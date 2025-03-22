
import {GameObject, MonoBehaviour, Vector3, Animator, WaitForSeconds} from "UnityEngine";
export default class EffectManager extends MonoBehaviour {

    @NonSerialized public static Instance: EffectManager;

    @Header("Hit Effect Settings")
    @SerializeField private hitEffectObject: GameObject;

    @Header("Destroy Effect Settings")
    @SerializeField private destroyEffectObject: GameObject;

    @SerializeField private towerAnimator: Animator;
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
        this.StartCoroutine(this.DisableAfterAnimation(this.destroyEffectObject));
    }

    public HitEffect(newPosition: Vector3): void{
        this.towerAnimator.SetTrigger("isHit");
        this.hitEffectObject.transform.position = newPosition;
        this.hitEffectObject.SetActive(true);
        this.StartCoroutine(this.DisableAfterAnimation(this.hitEffectObject));
    }
    
    public UpEffect(){
        this.towerAnimator.SetTrigger("isUp");
    }

    // 🔹 Corrutina para desactivar el efecto luego de la animación
    private *DisableAfterAnimation(effectObject: GameObject) {
        let animator = effectObject.GetComponent<Animator>();
        if (animator) {
            let animationLength = animator.GetCurrentAnimatorStateInfo(0).length;
            yield new WaitForSeconds(animationLength);
        } else {
            yield new WaitForSeconds(1.0); // Fallback si no tiene Animator (1 seg por defecto)
        }
        effectObject.SetActive(false);
    }
}
