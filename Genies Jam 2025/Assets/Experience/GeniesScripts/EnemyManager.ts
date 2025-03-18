
import {MonoBehaviour, Time, Vector3} from "UnityEngine";
import {EnemyState} from "./Enums/EnemyState";

export default class EnemyManager extends MonoBehaviour {
    @SerializeField private enemyState: EnemyState;
    
    private enemySpeed: float = 2;
    private canMove: bool = false;
    private Update() : void {
        if(this.canMove) {
            this.MoveEnemy();
        }
    }

    private MoveEnemy() {
        let enemyPos = this.transform.position;
        let targetPos = new Vector3(enemyPos.x, enemyPos.y - 1, enemyPos.z);
        this.transform.position = Vector3.MoveTowards(enemyPos, targetPos, this.enemySpeed * Time.deltaTime);
    }
    
    public InitialConfigEnemy(globalSpeed:float, xRange: float , yRange: float): void{
        let enemyPos = this.transform.position;
        this.transform.position = new Vector3(xRange, yRange, enemyPos.z);
        this.enemySpeed = globalSpeed;
        this.canMove = true;
    }
    
    public IsState(moveState:EnemyState): bool{
        return  this.enemyState == moveState; 
    }
}
