
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
    @SerializeField private globalSpeedIncreaseByLevel: float = 0.2;
    @SerializeField private xRange: float = 3;
    @SerializeField private enemySpawnDelay: float = 1;
    @SerializeField private enemySpawnDelayDecreaseByLevel: float = 0.2;
    @SerializeField private poolSize: int = 10;
    @SerializeField private level: int = 0;
    
    private gameManager: GameManager;
    
    private coroutine: Coroutine;

    private enemyQueue: EnemyManager[] = [];
    private enemyPool: EnemyManager[] = [];
    
    private speed:float;
    private delay: float;
    private minDelay: float;
    private maxSpeed: float;

    private lastSpawnedState: EnemyState = null;
    private Start() : void {
        //Get GameManager singleton and add a listener to OnGameStateChange event
        this.gameManager = GameManager.Instance;
        this.gameManager.OnGameStateChange.addListener(this.CheckGameState);
        this.playerController.OnMoveStateChange.addListener(this.CheckMoveState);
        this.towerManager.OnHitTower.addListener(this.ReturnToPool);
  
        this.minDelay = this.enemySpawnDelay / 2;
        this.maxSpeed = this.globalSpeed * 2;
        
        this.ResetSpawnerConfig();
        
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
                this.ResetSpawnerConfig();
                break;
            case GameState.GAME_WIN:
                this.OnGameWin();
                break;
        }
    }

    /** This will manage the enemies once the game starts. */
    private OnGamePlay() {
        this.ShufflePool();
        this.coroutine = this.StartCoroutine(this.SpawnEnemies());
    }

    private OnGameOver() {
        this.coroutine = null;
        this.StopAllCoroutines();
        this.ResetEnemies();
    }

    private OnGameWin() {
        this.OnGameOver();
        
        this.speed =  this.speed + this.globalSpeedIncreaseByLevel;
        this.delay =  this.delay - this.enemySpawnDelayDecreaseByLevel;
        this.level++;
        
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed
        }

        if(this.delay < this.minDelay){
            this.delay = this.minDelay
        }
    }

    private *SpawnEnemies() {
        while(true) {
            yield new WaitForSeconds(this.delay);
         
            let enemy: EnemyManager = this.GetPooledEnemy();
            
            if (enemy) {
                let x = Mathf.Floor(Random.Range(-this.xRange, this.xRange));
                enemy.InitialConfigEnemy(this.speed, x, this.transform.position.y);
                this.enemyQueue.push(enemy);
            }
        }
    }

    private CheckMoveState(newState: EnemyState) {
        
        let peekFirstEnemy:EnemyManager = this.enemyQueue[0];
        console.log("ESTADO ACTIVADO "+ newState);
        
        if(peekFirstEnemy?.IsState(newState)){
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
        if (this.enemyPool.length === 0) {
            return null;
        }

        // Filtra los enemigos que NO tienen el mismo estado que el último generado
        let possibleEnemies = this.enemyPool.filter(e => e.GetState() !== this.lastSpawnedState);

        let selectedEnemy: EnemyManager;

        if (possibleEnemies.length > 0) {
            // Si hay enemigos con un estado diferente, elige uno aleatorio de ellos
            selectedEnemy = possibleEnemies[Mathf.Floor(Random.Range(0, possibleEnemies.length))];
        } else {
            // Si todos los enemigos tienen el mismo estado, elige cualquiera (caso extremo)
            selectedEnemy = this.enemyPool[Mathf.Floor(Random.Range(0, this.enemyPool.length))];
        }

        // Remover de la pool y activarlo
        this.enemyPool.splice(this.enemyPool.indexOf(selectedEnemy), 1);
        selectedEnemy.gameObject.SetActive(true);

        // Guardar el estado del enemigo seleccionado
        this.lastSpawnedState = selectedEnemy.GetState();

        return selectedEnemy;
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
    
    private ResetSpawnerConfig(){
        this.speed = this.globalSpeed;
        this.delay = this.enemySpawnDelay;
        this.level = 0;
    }
}
