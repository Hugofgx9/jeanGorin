import * as THREE from 'three';
import gsap from 'gsap';
import events from '~/js/store/event.json';
import Emitter from './utils/emitter';

export default class CameraController {
	constructor(camera, sceneCtx) {
		this.sceneCtx = sceneCtx;
		this.camera = camera;
		this.cameraContainer = new THREE.Group();
		this.cameraContainer.add(this.camera);
		this.sceneCtx.scene.add(this.cameraContainer);
		this.baseRotation = new THREE.Vector3();

		this.emitter = new Emitter;
	}

	initPos() {
		this.baseRotation.set(0, Math.PI, 0);
		this.camera.rotation.set(
			this.baseRotation.x,
			this.baseRotation.y,
			this.baseRotation.z
		);
		this.cameraContainer.position.set(-200, 47, 120);
	}

	rotate(mouse) {
		let y = 2 * (mouse.x / window.innerHeight) - 1;
		let x = 2 * (mouse.y / window.innerWidth) - 1;
		let amount = 0.08;
		gsap.to(this.camera.rotation, 1, {
			x: this.baseRotation.x + x * (amount * 2),
			y: this.baseRotation.y - y * amount,
		});
	}

	nextPosition( index) {
		let targetPosition = events[index].camera.position;

		gsap.to(this.cameraContainer.position, 2, {
			x: targetPosition.x,
			y: targetPosition.y,
			z: targetPosition.z,
			ease: 'power2.InOut',
			onComplete: () => {
				this.emitter.emit('movementcomplete', index );
			}
		});
	}

	on(event, callback) {
		this.emitter.on(event, callback);
	}
}
