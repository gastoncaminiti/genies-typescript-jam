
import {MonoBehaviour, Time, Vector3} from "UnityEngine";
export default class EnemyManager extends MonoBehaviour {

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
    
    public InitialConfigEnemy(globalSpeed:float, xRange: float): void{
        let enemyPos = this.transform.position;
        this.transform.position = new Vector3(xRange, enemyPos.y, enemyPos.z);
        this.enemySpeed = globalSpeed;
        this.canMove = true;
    }
}
