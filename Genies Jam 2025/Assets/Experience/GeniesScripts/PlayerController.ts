import { MonoBehaviour, Input, Vector3, Mathf, Time, Animator, Collider, RuntimeAnimatorController } from 'UnityEngine';

import { GeniesAvatar, GeniesAvatarsSdk } from 'Genies.Avatars.Sdk';
import GameManager, { GameState } from './GameManager';
import {EnemyState} from "./Enums/EnemyState";
export default class PlayerController extends MonoBehaviour {

    /** This is an event that is triggered when the current GameState changes. */
    @NonSerialized public OnMoveStateChange: GeniesEvent<[EnemyState]> = new GeniesEvent<[EnemyState]>();
    
    @Header("Player Settings")
    @SerializeField private playerSpeed: float = 2;
    @SerializeField private playerAnimator: RuntimeAnimatorController;

    private targetLane: int = 0;
    private mouseStartPos: Vector3;
    
    private userAvatar: GeniesAvatar;
    private gameManager: GameManager;

    private canMove: bool = false;
    
    async Start(): Promise<void> {
        //Get GameManager singleton and add a listener to OnGameStateChange event
        this.gameManager = GameManager.Instance;
        this.gameManager.OnGameStateChange.addListener(this.CheckGameState);
        //Initialize the SDK
        await GeniesAvatarsSdk.InitializeAsync();
        //Load the user Avatar
        this.userAvatar = await GeniesAvatarsSdk.LoadUserAvatarAsync("UserAvatar", this.transform, this.playerAnimator);
        //send message to GameManager that the Avatar has been loaded
        this.gameManager.ChangeGameState(GameState.GAME_PLAY);
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {
        //If game is playing, check for mouse swipe and move player accordingly
        if(this.canMove) {
            this.CheckSwipe();
            this.MovePlayer();
        }
        
    }

    /** Manages the player logic when the game state changes. @param newState */
    private CheckGameState(newState: GameState) {
        switch(newState) {
            case GameState.GAME_PLAY:
                this.OnGamePlay();
                break;
        }
    }

    private CheckSwipe(){
        
        if (Input.GetMouseButtonDown(0)) {
            this.mouseStartPos = Input.mousePosition;
        }

        if (Input.GetMouseButtonUp(0)) {
            let direction = Input.mousePosition - this.mouseStartPos;

            // Determine if the swipe was more horizontal than vertical
            if (Mathf.Abs(direction.x) > Mathf.Abs(direction.y)) {
                //Change target lane based on swipe direction
                if (direction.x > 0 && this.targetLane < 1) {
                    this.targetLane = this.targetLane + 1;
                    this.userAvatar.Animator.SetTrigger("isRight");
                    this.OnMoveStateChange.trigger(EnemyState.RIGHT);
                }
                if (direction.x < 0 && this.targetLane > -1) {
                    this.targetLane = this.targetLane - 1;
                    this.userAvatar.Animator.SetTrigger("isLeft");
                    this.OnMoveStateChange.trigger(EnemyState.LEFT);
                }
            }
        }
    }

    private MovePlayer() {
        let playerPos = this.transform.position;
        let targetPos = new Vector3(this.targetLane, playerPos.y, playerPos.z);
        let newPos = Vector3.MoveTowards(playerPos, targetPos, this.playerSpeed * Time.deltaTime);
        this.transform.position = newPos;
    }

    /** This will manage the player once the game starts. */
    private OnGamePlay(): void {
        this.canMove = true;
        this.transform.position = Vector3.zero;
        this.targetLane = 0;
        console.log("LOAD AVATAR");
    }

}
