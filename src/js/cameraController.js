import * as THREE from 'three';
import {gsap, Power3} from 'gsap';

let positions = [
	{ x: 100, y: 200, z: 400 },
	{ x: -200, y: 200, z: 400 },
	{ x: 200, y: 200, z: 200 },
	{ x: 300, y: 100, z: 0 },
];

export default class CameraController {
	constructor( camera ) {
		
		this.camera = camera;
		this.currentCamPos = 0;
		this.baseRotation = new THREE.Vector3();
	}

	initPos() {

		this.baseRotation.set( 0, Math.PI, 0);
		this.camera.rotation.set( this.baseRotation.x, this.baseRotation.y, this.baseRotation.z );
		this.camera.position.set( 0, 400, -2000 );

	};

	rotate(mouse) {
		let y = 2 * (mouse.x / window.innerHeight) - 1;
		let x = 2 * (mouse.y / window.innerWidth) - 1;
		let amount = 0.08;
		gsap.set(this.camera.rotation, {
			x: this.baseRotation.x + x * amount,
			y: this.baseRotation.y - y * amount,
		});
	}

	nextPosition() {
		if ([0, 1, 2, 3].includes(this.currentCamPos)) {
			let i = this.currentCamPos;
			gsap.to(this.camera.position, 2, {
				x: positions[i].x,
				y: positions[i].y,
				z: positions[i].z,
				onComplete: () => this.currentCamPos = i + 1,
			});
		}

		// if (this.currentCamPos === 0) {
		// 	gsap.to(this.camera.position, 2, {
		// 		x: 100,
		// 		y: 200,
		// 		z: 400,
		// 		onComplete: () => (this.currentCamPos = 1),
		// 	});
		// } else if (this.currentCamPos === 1) {
		// 	gsap.to(this.camera.position, 2, {
		// 		x: -200,
		// 		y: 200,
		// 		z: 400,
		// 		onComplete: () => (this.currentCamPos = 2),
		// 	});
		// }
	}
}
