
import { MonoBehaviour,GameObject } from "UnityEngine";
import GameManager, { GameState } from "./GameManager";
import { CloudSaveStorage } from "Genies.Experience.CloudSave";
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
    @SerializeField private loadingEffect: GameObject;

    @SerializeField private timeText: TMP_Text;
    @SerializeField private distanceText: TMP_Text;
    @SerializeField private multiplierText: TMP_Text;
    @SerializeField private notificationText: TMP_Text;
    @SerializeField private notificationButtonText: TMP_Text;
    @SerializeField private personalHighScoreText: TMP_Text;

    @SerializeField private replayButton: Button;

    private gameManager: GameManager;
    
    private canUpdateUI: bool = false;

    // ========== Genies Score ==========//
    private personalStorage: CloudSaveStorage;
    private personalStorageKey: string = "PersonalStorageKey";
    private mileHighScoreKey: string = "mileHighScoreKey";
    private personalString: string = "Best: ";
    

    
    private Start() : void {
        this.gameManager = GameManager.Instance;
        this.gameManager.OnGameStateChange.addListener(this.CheckGameState);
        this.canUpdateUI = true;

        //Add a listener to the ReplayButton click event
        this.replayButton.onClick.AddListener(this.OnReplay);

        //Initialize both high scores
        this.InitializeHighScores();
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
        this.loadingEffect.SetActive(true);
    }

    private OnGamePlay() {
        this.canUpdateUI = true;
        this.notificationPanel.SetActive(false);
        this.loadingPanel.SetActive(false);
        this.loadingEffect.SetActive(false);
        this.hudPanel.SetActive(true);
    }

    private OnGameOver() {
        this.canUpdateUI = false;
        this.notificationText.text = "GAME OVER";
        this.notificationButtonText.text = "REPLAY";
        this.loadingPanel.SetActive(false);
        this.loadingEffect.SetActive(false);
        this.notificationPanel.SetActive(true);
    }

    private OnGameWin() {
        this.canUpdateUI = false;
        this.timeText.text = TimeManager.Instance.GetRemainingTimeText();
        this.notificationText.text = "WELL DONE";
        this.notificationButtonText.text = "NEXT";
        this.notificationPanel.SetActive(true);
        this.loadingEffect.SetActive(false);
        this.loadingPanel.SetActive(false);
        this.CheckHighScore(this.personalStorage, DanceUpManager.Instance.GetTowerDistance());
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

    /** Initialize and load both the personal and global high scores. */
    private InitializeHighScores() {
        //Initialize Personal High Score
        this.personalStorage = new CloudSaveStorage(this.personalStorageKey, false);
        this.LoadHighScore(this.personalStorage, this.personalHighScoreText, this.personalString);
    }
   
    private async LoadHighScore(storage: CloudSaveStorage, textObj: TMP_Text, highScoreString: string) {
        await storage.Load();
        if (storage.Has(this.mileHighScoreKey)) {
            let highScore = storage.GetInt(this.mileHighScoreKey);
            textObj.text = highScoreString + highScore.toString() + " mi";
        }else{
            storage.SetFloat(this.mileHighScoreKey, 0);
            textObj.text = highScoreString + "0 mi";
            await storage.Save();
        }
    }

    private async CheckHighScore(storage: CloudSaveStorage, newScore:int) {
        await storage.Load();
        if (storage.Has(this.mileHighScoreKey)) {
            let highScore:int = storage.GetInt(this.mileHighScoreKey);
            if(newScore > highScore) {
                storage.SetInt(this.mileHighScoreKey, newScore);
                await storage.Save();
            }
        }
    }
}
