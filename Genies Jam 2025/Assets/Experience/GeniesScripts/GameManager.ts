
import {GameObject, MonoBehaviour} from "UnityEngine";

/** This is an enumerator to describe a game state. */
export enum GameState {
    INITIAL,
    LOADING,
    GAME_PLAY,
    GAME_OVER,
    GAME_WIN
}

export default class GameManager extends MonoBehaviour {

    /** This is an event that is triggered when the current GameState changes. */
    @NonSerialized public OnGameStateChange: GeniesEvent<[GameState]> = new GeniesEvent<[GameState]>();
    /** This is an instance of the GameManager singleton. */
    @NonSerialized public static Instance: GameManager;
    /** The game's current GameState value. */
    private gameState: GameState;
    

    
    private Awake() : void {
        //Establishes the GameManager singleton instance
        if(GameManager.Instance == null) {
            GameManager.Instance = this;
        }else{
            GameObject.Destroy(this.gameObject);
        }
    }

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void {
        this.ChangeGameState(GameState.LOADING);
    }

    public GetGameState(): GameState {
        return this.gameState;
    }
    
    //Update is called every frame, if the MonoBehaviour is enabled.
    public ChangeGameState(newState: GameState): void {
        if (newState == this.gameState) {
            return;
        }
        console.log("New Game State Change: ", newState)
        this.OnGameStateChange.trigger(newState);
        this.gameState = newState;
    }
}
