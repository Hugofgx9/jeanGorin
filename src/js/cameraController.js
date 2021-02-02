import gsap from 'gsap';

let positions = [
	{ x: 100, y: 200, z: 400 },
	{ x: -200, y: 200, z: 400 },
	{ x: 200, y: 200, z: 200 },
	{ x: 300, y: 100, z: 0 },
];

export default class CameraController {
	constructor(camera) {
		this.camera = camera;
		this.currentCamPos = 0;
	}

	rotate(mouse) {
		let y = 2 * (mouse.x / window.innerHeight) - 1;
		let x = 2 * (mouse.y / window.innerWidth) - 1;
		let amount = 0.08;
		gsap.to(this.camera.rotation, 1, {
			x: y * amount,
			y: x * amount,
		});
	}

	nextPosition() {
		if ([0, 1, 2, 3].includes(this.currentCamPos)) {
			let i = this.currentCamPos;
			gsap.to(this.camera.position, 2, {
				x: positions[i].x,
				y: positions[i].y,
				z: positions[i].z,
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
