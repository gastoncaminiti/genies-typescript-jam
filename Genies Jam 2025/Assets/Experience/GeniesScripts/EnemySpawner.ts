
import { MonoBehaviour,GameObject,Coroutine, WaitForSeconds, Object, Random, Mathf } from "UnityEngine";
import GameManager, { GameState } from "./GameManager";
import EnemyManager from "./EnemyManager";
import {EnemyState} from "./Enums/EnemyState";
import PlayerController from "./PlayerController";

export default class EnemySpawner extends MonoBehaviour {

    @SerializeField private playerController: PlayerController;
    
    @Header("Enemies Spawner Settings")
    @SerializeField private enemyPrefab: GameObject;
    @SerializeField private globalSpeed: float = 20;
    @SerializeField private xRange: float = 3;
    @SerializeField private enemySpawnDelay: float = 1;
    
    private gameManager: GameManager;
    private nextEnemy: EnemyManager;


    private coroutine: Coroutine;

    private Start() : void {
        //Get GameManager singleton and add a listener to OnGameStateChange event
        this.gameManager = GameManager.Instance;
        this.gameManager.OnGameStateChange.addListener(this.CheckGameState);
        this.playerController.OnMoveStateChange.addListener(this.CheckMoveState);
        //Spawn the pool of enemies
        //this.SpawnPool();
    }

    /** Manages the enemy logic when the game state changes. @param newState */
    private CheckGameState(newState: GameState) {
        switch(newState) {
            case GameState.GAME_PLAY:
                this.OnGamePlay();
                break;
        }
    }

    /** This will manage the enemies once the game starts. */
    private OnGamePlay() {
        this.coroutine = this.StartCoroutine(this.SpawnEnemies());
    }

    private *SpawnEnemies() {
        while(true) {
            yield new WaitForSeconds(this.enemySpawnDelay);
            
            let enemy =  Object.Instantiate(this.enemyPrefab) as GameObject;
                        
            const myEnemyManager = enemy.GetComponent<EnemyManager>();

            let x = Mathf.Floor(Random.Range(-this.xRange, this.xRange));
            myEnemyManager.InitialConfigEnemy(this.globalSpeed,x);
            
            if(this.nextEnemy == null){
                this.nextEnemy = myEnemyManager;    
            }
        }
    }

    private CheckMoveState(newState: EnemyState) {
        if(this.nextEnemy.IsState(newState)){
            Object.DestroyImmediate(this.nextEnemy.gameObject);
            this.nextEnemy = null;
            console.log("EL ESTADO COINCIDE HAY QUE MATARLO");
        }
    }
}
