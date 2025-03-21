
import { MonoBehaviour,GameObject, WaitForSeconds  } from "UnityEngine";
import GameManager, { GameState } from "./GameManager";
import { TMP_Text } from "TMPro";
import TimeManager from "@assets/Experience/GeniesScripts/TimeManager";
export default class CanvasController extends MonoBehaviour {
    
    //Called when script instance is loaded
    @Header("UI Object References")
    @SerializeField private gameOverPanel: GameObject;
    @SerializeField private loadingPanel: GameObject;
    @SerializeField private hudPanel: GameObject;

    @SerializeField private timeText: TMP_Text;

    private gameManager: GameManager;
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
                console.log("JUEGO CARGADO");
                this.OnGamePlay();
                break;
            case GameState.GAME_OVER:
                this.OnGameOver();
                break;
        }
    }

    private OnLoading() {
        this.loadingPanel.SetActive(true);
        this.hudPanel.SetActive(true);
        this.gameOverPanel.SetActive(false);
    }

    private OnGamePlay() {
        this.gameOverPanel.SetActive(false);
        this.loadingPanel.SetActive(false);
    }

    private OnGameOver() {
        this.gameOverPanel.SetActive(true);
        this.loadingPanel.SetActive(false);
    }

    private Update() : void {
        
        this.timeText.text = TimeManager.Instance.GetRemainingTimeText();
        
    }
}
