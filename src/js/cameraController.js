import gsap from 'gsap';

export default class CameraController {
	constructor (camera) {
		this.camera = camera;
		this.currentCamPos = 0;
	}

	rotate(mouse) {
		let y = ( 2 *(mouse.x / window.innerHeight) - 1);
		let x = ( 2 *(mouse.y / window.innerWidth) - 1);
		let amount = 0.08;
		gsap.to(this.camera.rotation, 1, {
			x: y * amount,
			y: x * amount,
		});
	}

	nextPosition() {
		if (this.currentCamPos === 0) {
			gsap.to(this.camera.position, 2, {
				x: 100,
				y: 200,
				z: 400,
				onComplete: () => this.currentCamPos = 1,
			})
		}
		else if (this.currentCamPos === 1) {
			gsap.to(this.camera.position, 2, {
				x: -200,
				y: 200,
				z: 400,
				onComplete: () => this.currentCamPos = 2,
			})
		}
	}
}