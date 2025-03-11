import { MonoBehaviour, Input, Vector3, Mathf, Time, Animator, Collider, RuntimeAnimatorController } from 'UnityEngine';

import { GeniesAvatar, GeniesAvatarsSdk } from 'Genies.Avatars.Sdk';
import GameManager, { GameState } from './GameManager';
export default class PlayerController extends MonoBehaviour {

    @Header("Player Settings")
    @SerializeField private playerAnimator: RuntimeAnimatorController;
    
    private userAvatar: GeniesAvatar;
    private gameManager: GameManager;

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
    private Update() : void {}

    /** Manages the player logic when the game state changes. @param newState */
    private CheckGameState(newState: GameState) {
        switch(newState) {
            case GameState.GAME_PLAY:
                this.OnGamePlay();
                break;
        }
    }

    /** This will manage the player once the game starts. */
    private OnGamePlay(): void {
        this.transform.position = Vector3.zero;
        this.userAvatar.Animator.SetFloat("idle_run_walk", 1);
    }

}
