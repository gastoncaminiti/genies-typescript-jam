
import {MonoBehaviour, Time, Vector3} from "UnityEngine";

export default class EnemyManager extends MonoBehaviour {

    @SerializeField private enemySpeed: float = 20;
    public canMove: bool = false;
    private Update() : void {
        if(this.canMove) {
            this.MoveEnemy();
        }
    }

    private MoveEnemy() {
        let enemyPos = this.transform.position;
        let targetPos = new Vector3(enemyPos.x, enemyPos.y - 1, enemyPos.z);
        let newPos = Vector3.MoveTowards(enemyPos, targetPos, this.enemySpeed * Time.deltaTime);
        this.transform.position = newPos;
    }
}
