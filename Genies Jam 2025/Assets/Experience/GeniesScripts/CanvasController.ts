
import { MonoBehaviour,GameObject } from "UnityEngine";
import GameManager, { GameState } from "./GameManager";
import { TMP_Text } from "TMPro";
import TimeManager from "./TimeManager";
import DanceUpManager from "./DanceUpManager";
import { Button } from "UnityEngine.UI";
export default class CanvasController extends MonoBehaviour {
    
    //Called when script instance is loaded
    @Header("UI Object References")
    @SerializeField private notificationPanel: GameObject;
    @SerializeField private loadingPanel: GameObject;
    @SerializeField private hudPanel: GameObject;

    @SerializeField private timeText: TMP_Text;
    @SerializeField private distanceText: TMP_Text;
    @SerializeField private multiplierText: TMP_Text;
    @SerializeField private notificationText: TMP_Text;

    @SerializeField private replayButton: Button;

    private gameManager: GameManager;
    
    private canUpdateUI: bool = false;
    private Start() : void {
        this.gameManager = GameManager.Instance;
        this.gameManager.OnGameStateChange.addListener(this.CheckGameState);
        this.canUpdateUI = true;

        //Add a listener to the ReplayButton click event
        this.replayButton.onClick.AddListener(this.OnReplay);
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
            case GameState.GAME_WIN:
                this.OnGameWin();
                break;
        }
    }

    private OnLoading() {
        this.hudPanel.SetActive(false);
        this.notificationPanel.SetActive(false);
        this.loadingPanel.SetActive(true);
    }

    private OnGamePlay() {
        this.canUpdateUI = true;
        this.notificationPanel.SetActive(false);
        this.loadingPanel.SetActive(false);
        this.hudPanel.SetActive(true);
    }

    private OnGameOver() {
        this.canUpdateUI = false;
        this.notificationText.text = "GAME OVER";
        this.notificationPanel.SetActive(true);
        this.loadingPanel.SetActive(false);
    }

    private OnGameWin() {
        this.canUpdateUI = false;
        this.timeText.text = TimeManager.Instance.GetRemainingTimeText();
        this.notificationText.text = "LEVEL COMPLETE";
        this.notificationPanel.SetActive(true);
        this.loadingPanel.SetActive(false);
    }

    /** Set the game state back to replay the game. */
    private OnReplay() {
        this.gameManager.ChangeGameState(GameState.GAME_PLAY);
    }

    private Update() : void {
        if(this.canUpdateUI){
            this.timeText.text = TimeManager.Instance.GetRemainingTimeText();
            this.multiplierText.text = DanceUpManager.Instance.GetDanceMultiplierText();
            this.distanceText.text = DanceUpManager.Instance.GetTowerDistanceText();
        }
    }
    
  
}
