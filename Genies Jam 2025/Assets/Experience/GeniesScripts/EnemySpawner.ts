
import { MonoBehaviour,GameObject,Coroutine, WaitForSeconds, Object } from "UnityEngine";
import GameManager, { GameState } from "./GameManager";
import EnemyManager from "./EnemyManager";
export default class EnemySpawner extends MonoBehaviour {

    @Header("Enemy Settings")
    @SerializeField private enemyPrefab: GameObject;
    //@SerializeField private enemySpeed: float = 20;
    @SerializeField private enemySpawnDelay: float = 1;

    private gameManager: GameManager;

    private coroutine: Coroutine;

    private Start() : void {
        //Get GameManager singleton and add a listener to OnGameStateChange event
        this.gameManager = GameManager.Instance;
        this.gameManager.OnGameStateChange.addListener(this.CheckGameState);
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
            myEnemyManager.canMove = true;
            
            console.log("INSTANCIADO"+ enemy.name);
        }
    }
}
