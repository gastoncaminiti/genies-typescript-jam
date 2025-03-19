
import { MonoBehaviour,GameObject,Coroutine, WaitForSeconds, Object, Random, Mathf } from "UnityEngine";
import GameManager, { GameState } from "./GameManager";
import EnemyManager from "./EnemyManager";
import {EnemyState} from "./Enums/EnemyState";
import PlayerController from "./PlayerController";
import TowerManager from "./TowerManager";


export default class EnemySpawner extends MonoBehaviour {

    @SerializeField private playerController: PlayerController;
    @SerializeField private towerManager: TowerManager;
    
    @Header("Enemies Spawner Settings")
    @SerializeField private enemyPrefabs: GameObject[];
    @SerializeField private globalSpeed: float = 20;
    @SerializeField private xRange: float = 3;
    @SerializeField private enemySpawnDelay: float = 1;
    @SerializeField private poolSize: int = 10;
    
    private gameManager: GameManager;
    
    private coroutine: Coroutine;

    private enemyQueue: EnemyManager[] = [];
    private enemyPool: EnemyManager[] = [];
    private Start() : void {
        //Get GameManager singleton and add a listener to OnGameStateChange event
        this.gameManager = GameManager.Instance;
        this.gameManager.OnGameStateChange.addListener(this.CheckGameState);
        this.playerController.OnMoveStateChange.addListener(this.CheckMoveState);
        this.towerManager.OnHitTower.addListener(this.ReturnToPool);
  
        this.InitializePool();  // Inicializa el Object Pool
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
         
            let enemy: EnemyManager = this.GetPooledEnemy();
            if (enemy) {
                
                let x = Mathf.Floor(Random.Range(-this.xRange, this.xRange));
                enemy.InitialConfigEnemy(this.globalSpeed, x, this.transform.position.y);
                this.enemyQueue.push(enemy);
            }
        }
    }

    private CheckMoveState(newState: EnemyState) {
        
        let peekFirstEnemy:EnemyManager = this.enemyQueue[0];
        console.log("ESTADO ACTIVADO "+ newState);
        
        if(peekFirstEnemy.IsState(newState)){
            let dequeuedEnemy = this.enemyQueue.shift();
            console.log("EL ESTADO COINCIDE HAY QUE MATARLO");
            this.ReturnToPool(dequeuedEnemy);
        }
    }

    // 🔹 Inicializa el pool de enemigos al comenzar el juego
    private InitializePool(): void {
        for (let i = 0; i < this.poolSize; i++) {
            let randomIndex = Mathf.Floor(Random.Range(0, this.enemyPrefabs.length));
            let enemyObj = Object.Instantiate(this.enemyPrefabs[randomIndex]) as GameObject;
            let enemy = enemyObj.GetComponent<EnemyManager>();

            enemyObj.SetActive(false);  // Lo desactiva hasta que sea necesario
            this.enemyPool.push(enemy);
        }
    }


    // 🔹 Obtiene un enemigo del pool (si hay disponibles) o retorna null si el pool está vacío
    private GetPooledEnemy(): EnemyManager {
        if (this.enemyPool.length > 0) {
            let enemy = this.enemyPool.pop();
            enemy.gameObject.SetActive(true);
            return enemy;
        }
        return null;
    }
    
    // 🔹 Devuelve un enemigo al pool en lugar de destruirlo
    private ReturnToPool(enemy: EnemyManager): void {
        enemy.gameObject.SetActive(false);
        this.enemyPool.push(enemy);
    }
}
