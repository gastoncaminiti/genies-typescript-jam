
import {Collider, MonoBehaviour} from "UnityEngine";
import GameManager, { GameState } from './GameManager';
export default class TowerManager extends MonoBehaviour {

    private gameManager: GameManager;
    //Called when script instance is loaded
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
        //PLAY BEHAVIOR
    }
    
    private OnTriggerEnter(coll:Collider): void
    {
        if (coll.gameObject.tag == "Enemy") {
            console.log("ENEMY HIT TRIGGER");
        }
    }
}
