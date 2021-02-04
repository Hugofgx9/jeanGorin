import * as THREE from 'three';
import gsap from 'gsap';
import events from '~/js/store/event.json';

export default class CameraController {
	constructor(camera, sceneCtx) {
		this.sceneCtx = sceneCtx;
		this.camera = camera;
		this.currentCamPos = 1;
		this.baseRotation = new THREE.Vector3();
	}

	initPos() {
		this.baseRotation.set(0, Math.PI, 0);
		this.camera.rotation.set(
			this.baseRotation.x,
			this.baseRotation.y,
			this.baseRotation.z
		);
		this.camera.position.set(0, 47, -226);
	}

	rotate(mouse) {
		let y = 2 * (mouse.x / window.innerHeight) - 1;
		let x = 2 * (mouse.y / window.innerWidth) - 1;
		let amount = 0.08;
		gsap.to(this.camera.rotation, 1, {
			x: this.baseRotation.x + x * amount,
			y: this.baseRotation.y - y * amount,
		});
	}

	nextPosition() {
		if (this.currentCamPos < events.length) {
			let i = this.currentCamPos;
			let targetPosition = events[i].camera.position;
			let vocalKey = events[i].vocal;
			let colorAmount = events[i].colorAmount;

			gsap.to(this.camera.position, 2, {
				x: targetPosition.x,
				y: targetPosition.y,
				z: targetPosition.z,
				onComplete: () => {
					this.sceneCtx.options.audio.playVocal(vocalKey);
					this.sceneCtx.model.setColorAmount(colorAmount);
					this.currentCamPos = i + 1;
				},
			});
		}
	}
}
