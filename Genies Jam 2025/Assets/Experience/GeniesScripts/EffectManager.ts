
import {GameObject, MonoBehaviour, Vector3, Invoke} from "UnityEngine";
export default class EffectManager extends MonoBehaviour {

    @NonSerialized public static Instance: EffectManager;

    @Header("Hit Effect Settings")
    @SerializeField private hitEffectObject: GameObject;

    @Header("Destroy Effect Settings")
    @SerializeField private destroyEffectObject: GameObject;
    private Awake() : void {
        //Establishes the GameManager singleton instance
        if(EffectManager.Instance == null) {
            EffectManager.Instance = this;
        }else{
            EffectManager.Destroy(this.gameObject);
        }
    }
    
    public DestroyEffect(newPosition: Vector3): void{
        this.destroyEffectObject.transform.position = newPosition;
        this.destroyEffectObject.SetActive(true);
    }
    
    private DisableDestroyEffect():void{
        this.destroyEffectObject.SetActive(false);
    }

    public HitEffect(newPosition: Vector3): void{
        this.hitEffectObject.transform.position = newPosition;
        this.hitEffectObject.SetActive(true);
    }

    private DisableHitEffect():void{
        this.hitEffectObject.SetActive(false);
    }
}
