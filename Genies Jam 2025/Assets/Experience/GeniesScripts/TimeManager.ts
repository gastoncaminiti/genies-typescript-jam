import {MonoBehaviour, WaitForSeconds} from "UnityEngine";
import GameManager, { GameState } from './GameManager';
export default class TimeManager extends MonoBehaviour {

    @NonSerialized public static Instance: TimeManager;
    
    private gameManager: GameManager;

    private songDuration: float;
    
    private remainingTime: float;
    private remainingTimeText: string;
    private isCounting: boolean = false;

    private Awake() : void {
        //Establishes the GameManager singleton instance
        if(TimeManager.Instance == null) {
            TimeManager.Instance = this;
        }else{
            TimeManager.Destroy(this.gameObject);
        }
    }
    
    private Start() : void {
        //Get GameManager singleton and add a listener to OnGameStateChange event
        this.gameManager = GameManager.Instance;
    }
    
    public SetSongDuration(seconds: float): void{
        this.songDuration = seconds;
        this.remainingTime = this.songDuration;
        this.isCounting = true;
        this.UpdateTimeText();
        this.StartCoroutine(this.UpdateTimer());
    }

    private *UpdateTimer() {
        while (this.isCounting && this.remainingTime > 0) {
            this.remainingTime -= 1;
            this.UpdateTimeText();
            yield new WaitForSeconds(1);
        }

        if (this.remainingTime <= 0) {
            this.isCounting = false;
            this.gameManager.ChangeGameState(GameState.GAME_WIN);
            this.StopAllCoroutines();
        }
    }

    private UpdateTimeText() {
        let minutes = Math.floor(this.remainingTime / 60);
        let seconds = Math.floor(this.remainingTime % 60);
        this.remainingTimeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    public GetRemainingTimeText(): string{
        return this.remainingTimeText;
    }
}
