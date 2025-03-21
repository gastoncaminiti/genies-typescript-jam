
import {Collider, MonoBehaviour} from "UnityEngine";
import GameManager, { GameState } from './GameManager';
import EnemyManager from "./EnemyManager";
import DanceUpManager from "./DanceUpManager";
export default class TowerManager extends MonoBehaviour {

    @NonSerialized public OnHitTower: GeniesEvent<[EnemyManager]> = new GeniesEvent<[EnemyManager]>();

    @SerializeField private towerHP: int = 4;
    
    private gameManager: GameManager;
    private currenteTowerHP: int;
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
        this.currenteTowerHP = this.towerHP;
    }
    
    private OnTriggerEnter(coll:Collider): void
    {
        if (coll.gameObject.tag == "Enemy") {
            
            console.log("ENEMY HIT TRIGGER");
            let enemy = coll.gameObject.GetComponent<EnemyManager>();
            this.OnHitTower.trigger(enemy);
            DanceUpManager.Instance.ResetDanceMultiplier();
            this.currenteTowerHP--;
            if(this.currenteTowerHP == 0){
                this.gameManager.ChangeGameState(GameState.GAME_OVER);
            }
        }
    }
}
