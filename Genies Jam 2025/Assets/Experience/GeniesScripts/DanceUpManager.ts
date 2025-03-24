
import { MonoBehaviour} from "UnityEngine";
import {CinemachineImpulseSource}  from "Cinemachine";
import GameManager, {GameState} from "./GameManager";
import EffectManager from "./EffectManager";
export default class DanceUpManager extends MonoBehaviour {

    @SerializeField private danceMultiplierGoal: int = 8;
    @SerializeField private impulseSource: CinemachineImpulseSource;
    
    @NonSerialized public static Instance: DanceUpManager;
        
    private gameManager: GameManager;

    private danceMultiplier: int;
    private towerDistance: int;

    private Awake() : void {
        //Establishes the GameManager singleton instance
        if(DanceUpManager.Instance == null) {
            DanceUpManager.Instance = this;
        }else{
            DanceUpManager.Destroy(this.gameObject);
        }
    }
    
    private Start() : void {
        this.gameManager = GameManager.Instance;
        this.gameManager.OnGameStateChange.addListener(this.CheckGameState);
        this.ResetProgress();
    }

    private CheckGameState(newState: GameState) {
        switch(newState) {
            case GameState.GAME_PLAY:
                this.ResetDanceMultiplier();
                break;
            case GameState.GAME_OVER:
                this.ResetProgress();
                break;
            case GameState.GAME_WIN:
                this.ResetDanceMultiplier();
                //SAVE DATA
                break;
        }
    }
    
    public IncreaseDanceMultiplier(): void{
        this.danceMultiplier++;
        if(this.danceMultiplier == this.danceMultiplierGoal){
            this.ResetDanceMultiplier();
            this.towerDistance++;
            this.impulseSource.GenerateImpulse();
            EffectManager.Instance.UpEffect();
        }
    }

    public ResetDanceMultiplier(): void{
        this.danceMultiplier = 0;
    }
    
    private ResetProgress():void{
        this.danceMultiplier = 0;
        this.towerDistance = 0;
    }
    
    public GetTowerDistance(): int {
        return this.towerDistance;
    }
    
    public GetTowerDistanceText(): string{
        return this.towerDistance.toString()+" mi";
    }

    public GetDanceMultiplierText(): string{
        return "x"+this.danceMultiplier.toString();
    }
}
