
import { MonoBehaviour,GameObject,Coroutine, WaitForSeconds, Object, Random, Mathf } from "UnityEngine";
import GameManager, { GameState } from "./GameManager";
import EnemyManager from "./EnemyManager";
import {EnemyState} from "./Enums/EnemyState";
import PlayerController from "./PlayerController";
import TowerManager from "./TowerManager";
import EffectManager from "./EffectManager";
import DanceUpManager from "./DanceUpManager";


export default class EnemySpawner extends MonoBehaviour {

    @SerializeField private playerController: PlayerController;
    @SerializeField private towerManager: TowerManager;
    
    @Header("Enemies Spawner Settings")
    @SerializeField private enemyPrefabs: GameObject[];
    @SerializeField private globalSpeed: float = 20;
    @SerializeField private globalSpeedIncreaseByLevel: float = 2;
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
            case GameState.GAME_OVER:
                this.OnGameOver();
                break;
            case GameState.GAME_WIN:
                this.OnGameOver();
                this.globalSpeed = this.globalSpeed + this.globalSpeedIncreaseByLevel;
                break;
        }
    }

    /** This will manage the enemies once the game starts. */
    private OnGamePlay() {
        this.coroutine = this.StartCoroutine(this.SpawnEnemies());
    }

    private OnGameOver() {
        this.coroutine = null;
        this.StopAllCoroutines();
        this.ResetEnemies();
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
            EffectManager.Instance.DestroyEffect(dequeuedEnemy.transform.position);
            
            this.ReturnToPool(dequeuedEnemy);
            console.log("EL ESTADO COINCIDE HAY QUE MATARLO");
            DanceUpManager.Instance.IncreaseDanceMultiplier();
        }
    }

    // 🔹 Inicializa el pool de enemigos al comenzar el juego
    private InitializePool(): void {

        let enemyTypes: number = this.enemyPrefabs.length;
        let enemiesPerType: float = Mathf.Floor(this.poolSize / enemyTypes);
        let extraEnemies:number = this.poolSize % enemyTypes;  // Si no es divisible exacto, agrega extras

        for (let i: number = 0; i < enemyTypes; i++) {
            let count: number = enemiesPerType + (i < extraEnemies ? 1 : 0); // Distribuye extra si es necesario
            
            for (let j:number = 0; j < count; j++) {
                
                let enemyObj = Object.Instantiate(this.enemyPrefabs[i]) as GameObject;
                let enemy = enemyObj.GetComponent<EnemyManager>();

                enemyObj.SetActive(false);  // Lo desactiva hasta que sea necesario
                this.enemyPool.push(enemy);
            }
        }
        
        // Mezcla el pool para evitar que siempre salgan en el mismo orden
        this.ShufflePool();
    }

    // 🔹 Mezcla el pool para una mejor distribución aleatoria
    private ShufflePool(): void {
        for (let i = this.enemyPool.length - 1; i > 0; i--) {
            let j = Mathf.Floor(Random.Range(0, i + 1));
            [this.enemyPool[i], this.enemyPool[j]] = [this.enemyPool[j], this.enemyPool[i]];
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
    private ResetEnemies() {
        console.log("RESET ALL ENEMIES"); 
        this.enemyPool.forEach ((enemy) => {
            enemy.gameObject.SetActive(false);
        });

        this.enemyQueue.forEach ((enemy) => {
            enemy.gameObject.SetActive(false);
        });
        
        while(this.enemyQueue.length != 0){
            this.enemyQueue.shift();
        }
    }
}
