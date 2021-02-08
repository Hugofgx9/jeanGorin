import * as THREE from 'three';
import gsap from 'gsap';
import vShader from '~/glsl/vShader_basic.glsl';
import fShader from '~/glsl/fShader.glsl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import composition35 from '~/img/jeanGorin.jpeg';
import model from '../model/GORIN_GLTF_SHADOWS_V2.gltf.png';
import Emitter from './utils/emitter';

export default class Model {
	constructor(scene, sceneCtx) {
		this.sceneCtx = sceneCtx;
		this.scene = scene;
		this.emitter = new Emitter();

		this.loadModel();
	}

	on(event, callback) {
		this.emitter.on(event, callback);
	}


	loadModel() {
		const loader = new GLTFLoader();

		loader.load(
			model,
			gltf => {
				this.model = gltf.scene;
				this.model.name = '3d_scene';
				this.scene.add(this.model);

				let modelCam = this.model.getObjectByName('CAM_FLAT', true);

				this.art = this.model.getObjectByName('3D', true);

				// this.art.material = new THREE.ShaderMaterial({
				// 	uniforms: {
				// 		u_map: { type: 't', value: this.art.material.map },
				// 		u_colorAmount: { type: 'vec3', value: {r: 0, g:0, b:0} },
				// 	},
				// 	vertexShader: vShader,
				// 	fragmentShader: fShader,
				// 	defines: {
				// 		// tofixed(1) tronque le nombre avec 1 nombre après la virgule
				// 		PR: window.devicePixelRatio.toFixed(1),
				// 	},
				// });

				this.model.traverse(child => {
					if (child.material && child.name != '3D') {
						child.material = new THREE.MeshBasicMaterial({
							color: 'rgb(100%, 100%, 100%)',
							map: child.material.map,
						});
					}
				});

				this.art.children.forEach(a => {
					a.material = new THREE.ShaderMaterial({
						uniforms: {
							u_map: { type: 't', value: a.material.map },
							u_colorAmount: { type: 'f', value: 0 },
							u_alpha: { type: 'f', value: 1 },
						},
						vertexShader: vShader,
						fragmentShader: fShader,
						defines: {
							// tofixed(1) tronque le nombre avec 1 nombre après la virgule
							PR: window.devicePixelRatio.toFixed(1),
						},
					});
				});
				//this.waveArt('ROUGE', 4, 1);
				//this.waveArt('BLEU', 1.5, 1);
				//this.waveArt('JAUNE', 5, 1);
				//this.waveArt('NOIR', 4, 1);
				console.log(this.model);
			},
			xhr => {
				let amount = xhr.loaded / xhr.total;
				amount = isFinite(amount) ? amount : 0;
				this.emitter.emit('load', amount);
			},
			error => {
				console.error(error);
			}
		);
	}

	colorArt(name) {
		let elementTarget = this.art.getObjectByName(name).material.uniforms.u_colorAmount;

		gsap.to(elementTarget, 2, {
			value: 1,
			ease: 'power1.easeInOut',
		});
	}

	waveArt(obj, value, speed) {
		let time = value / speed;

		// vitesse = distance / temps
		// temps = distance / vitesse

		if (this.art.getObjectByName(obj)) {
			let tl = gsap.timeline({ repeat: -1 });
			tl.to(this.art.getObjectByName(obj).position, time, {
				z: `+= ${value}`,
				ease: 'Power1.easeInOut',
			});
			tl.to(this.art.getObjectByName(obj).position, time, {
				z: `-= ${value}`,
				ease: 'Power1.easeInOut',
			});
		}
	}

	closeScene() {
		//create the tableau mesh;
		let mesh;
		let size = 90;
		let geometry = new THREE.PlaneGeometry(1, 1, 100, 100);

		let tex = new THREE.TextureLoader().load(composition35, () => {
			tex.needsUpdate = true;
			//set img ratio to mesh
			mesh.scale.set(-size, (size * tex.image.height) / tex.image.width, 1.0);
		});

		let material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			map: tex,
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0,
		});

		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(3, 49, 0);

		this.scene.add(mesh);

		//anim appear
		let tl = gsap.timeline();
		let random_box = this.model.getObjectByName('RANDOM_BOX');
		let random_plate = this.model.getObjectByName('RANDOM_PLATE');
		let cube = this.model.getObjectByName('CUBE');
		random_box.material.transparent = true;
		random_plate.material.transparent = true;
		cube.material.transparent = true;
		//random_box.material.wireframe = true;
		//random_plate.material.wireframe = true;
		//cube.material.wireframe = true;

		// tl.to(cube.material, 3, {
		// 	opacity: 0,
		// 	ease: 'power1.InOut',
		// 	onComplete: () => this.sceneCtx.remove( cube )
		// });
		// tl.to(random_plate.material, 3, {
		// 	opacity: 0,
		// 	ease: 'power1.InOut',
		// 	onComplete: () => this.sceneCtx.remove( random_plate ) 
		// }, '<1');
		// tl.to( random_box.material, 2, {
		// 	opacity: 0,
		// 	ease: 'power1.InOut',
		// 	onComplete: () => this.sceneCtx.remove( random_box )
		// }, '<1');
		tl.to(random_box.position, 3, {
			z: '-= 1000',
			ease: 'power2.In',
			//onComplete: () => this.sceneCtx.remove( random_box )
		});
		tl.to(random_plate.position, 3, {
			y: '-= 1000',
			ease: 'power2.In',
			//onComplete: () => this.sceneCtx.remove( random_plate ) 
		}, '<.5');
		tl.to( cube.material, 2, {
			opacity: 0,
			ease: 'power2.In',
			//onComplete: () => this.sceneCtx.remove( cube )
		}, '<1');
		// this.art.children.forEach( c => {
		// 	let uniforms = c.material.uniforms;
		// 	tl.to(uniforms, 3, {
		// 		u_alpha: 0,
		// 	}, '<');
		// });
		// tl.to(this.art.position, 10, {
		// 	z: -160,
		// 	ease: 'power2.InOut',
		// }, '<');
		// tl.to(this.art.getObjectByName('ROUGE').position, 2.5, {
		// 	z: -300,
		// 	ease: 'power2.In',
		// }, '>3');
		// tl.to(this.art.getObjectByName('JAUNE').position, 3, {
		// 	z: -300,
		// 	ease: 'power2.In',
		// }, '>-1');
		// tl.to(this.art.getObjectByName('BLEU').position, 2, {
		// 	z: -300,
		// 	ease: 'power2.In',
		// }, '>-1');
		// tl.to(this.art.getObjectByName('NOIR').position, 2.5, {
		// 	z: -300,
		// 	ease: 'power2.In',
		// }, '>-1.5');
		// tl.to(mesh.position, 10, {
		// 	z: -90,
		// 	ease: 'power2.InOut',
		// }, '<');
		// tl.to(mesh.position, 10, {
		// 	z: -90,
		// 	ease: 'power2.InOut',
		// 	onComplete: () => console.log(this.scene)
		// }, '<');
		tl.to(this.art.scale, 2, {
			z: 0.1,
		});
		tl.to(this.art.rotation, 2, {
			y: Math.PI / 4,
		}, '<');
		tl.to(this.sceneCtx.cameraController, 2, {
			rotateAmount: 0.01,
			ease: 'power2.InOut',
		}, '<10');
		tl.to(mesh.material, 4, {
			opacity: 1,
			ease: 'power2.InOut',
		}, '<3');
	}
}
