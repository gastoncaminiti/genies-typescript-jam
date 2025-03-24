
import {MonoBehaviour, AudioSource, AudioClip} from "UnityEngine";
import GameManager, { GameState } from './GameManager';
import TimeManager from "@assets/Experience/GeniesScripts/TimeManager";
export default class MusicManager extends MonoBehaviour {

    @SerializeField private audioClips: AudioClip[] = [];
    @SerializeField private myAudio: AudioSource;
    

    private gameManager: GameManager;
    private clipIndex: int;
 
    private Start() : void {
        //Get GameManager singleton and add a listener to OnGameStateChange event
        this.gameManager = GameManager.Instance;
        this.gameManager.OnGameStateChange.addListener(this.CheckGameState);
        this.clipIndex = 0;
    }

    private CheckGameState(newState: GameState) {
        switch(newState) {
            case GameState.GAME_PLAY:
                this.OnGamePlay();
                break;
            case GameState.GAME_OVER:
                this.ResetSongList();
                break;
            case GameState.GAME_WIN:
                this.NextSong();
                break;
        }
    }
    private OnGamePlay(): void {
        this.myAudio.clip = this.audioClips[this.clipIndex];
        this.myAudio.Play();
        TimeManager.Instance.SetSongDuration(this.myAudio.clip.length)
    }

    private NextSong(): void {
        
        this.clipIndex++;
        
        if(this.clipIndex == this.audioClips.length){
            this.ResetSongList();
        }
        
        console.log("NEXT SONG INDEX "+this.clipIndex.toString())
    }
    
    private ResetSongList():void{
        this.clipIndex = 0;
    }
    
}
