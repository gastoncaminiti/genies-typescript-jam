
import {MonoBehaviour, Transform, Coroutine, WaitForSeconds, Vector3} from "UnityEngine";
import GameManager, { GameState } from './GameManager';
export default class MoveUpManager extends MonoBehaviour {

    @SerializeField private player: Transform;
    @SerializeField private tower: Transform;

    @SerializeField private upValue: float = 2;
    @SerializeField private upDelay: float = 2;
uc
    private gameManager: GameManager;
    private coroutine: Coroutine;

    private Start() : void {
        this.gameManager = GameManager.Instance;
        this.gameManager.OnGameStateChange.addListener(this.CheckGameState);
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private CheckGameState(newState: GameState) {
        switch(newState) {
            case GameState.GAME_PLAY:
                this.OnGamePlay();
                break;
        }
    }
    private OnGamePlay(): void {
        this.coroutine = this.StartCoroutine(this.MoveUp());
    }

    private *MoveUp() {
        while(true) {
            yield new WaitForSeconds(this.upDelay);
            console.log("SUBIENDO TORRE Y PERSONAJE");
            let playerPos = this.player.position;
            let towerPos = this.tower.position;
            let newPlayerPos =  new Vector3(playerPos.x, playerPos.y + this.upValue, playerPos.z);
            let newTowerPos =  new Vector3(towerPos.x, towerPos.y + this.upValue, towerPos.z);

            this.player.position =  newPlayerPos;
            this.tower.position = newTowerPos;
            
        }
    }
}
