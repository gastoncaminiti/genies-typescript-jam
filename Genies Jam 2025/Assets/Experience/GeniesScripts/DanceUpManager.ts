
import { MonoBehaviour } from "UnityEngine";
import GameManager, {GameState} from "@assets/Experience/GeniesScripts/GameManager";
export default class DanceUpManager extends MonoBehaviour {

    @SerializeField private danceMultiplierGoal: int = 8;
    
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
        console.log("LOAD CANVAS");
    }

    private CheckGameState(newState: GameState) {
        switch(newState) {
            case GameState.LOADING:
                this.OnLoading();
                break;
            case GameState.GAME_PLAY:
                break;
            case GameState.GAME_OVER:
                break;
        }
    }

    private OnLoading() {
        this.ResetDanceMultiplier();
        this.towerDistance = 0;
    }
    
    public IncreaseDanceMultiplier(): void{
        this.danceMultiplier++;
        if(this.danceMultiplier == this.danceMultiplierGoal){
            this.ResetDanceMultiplier();
            this.towerDistance++;
        }
    }

    public ResetDanceMultiplier(): void{
        this.danceMultiplier = 0;
    }
    
    public GetTowerDistanceText(): string{
        return this.towerDistance+" Mi";
    }

    public GetDanceMultiplierText(): string{
        return "x"+this.danceMultiplier;
    }
}
