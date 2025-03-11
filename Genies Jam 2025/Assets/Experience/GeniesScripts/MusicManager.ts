
import {MonoBehaviour, AudioSource} from "UnityEngine";
import GameManager, { GameState } from './GameManager';
export default class MusicManager extends MonoBehaviour {

    @SerializeField private myAudio: AudioSource;

    private gameManager: GameManager;
 
    private Start() : void {
        //Get GameManager singleton and add a listener to OnGameStateChange event
        this.gameManager = GameManager.Instance;
        this.gameManager.OnGameStateChange.addListener(this.CheckGameState);
    }

    private CheckGameState(newState: GameState) {
        switch(newState) {
            case GameState.GAME_PLAY:
                this.OnGamePlay();
                break;
        }
    }
    private OnGamePlay(): void {
        this.myAudio.Play();
    }
    
}
