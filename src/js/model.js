import * as THREE from 'three';
import gsap from 'gsap';
import vShader from '~/glsl/vShader_basic.glsl';
import fShader from '~/glsl/fShader.glsl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import model from '../model/GORIN_GLTF_SHADOWS_V2.gltf';

export default class Model {
	constructor(scene, sceneCtx) {
		this.sceneCtx = sceneCtx;
		this.scene = scene;

		this.loadModel();
	}

	loadModel() {
		const loader = new GLTFLoader();

		loader.load(
			model,
			gltf => {
				this.model = gltf.scene;
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
							side: THREE.DoubleSide,
							map: child.material.map,
						});
					}
				});

				this.art.children.forEach(a => {
					a.material = new THREE.ShaderMaterial({
						uniforms: {
							u_map: { type: 't', value: a.material.map },
							u_colorAmount: { type: 'f', value: 0 },
						},
						vertexShader: vShader,
						fragmentShader: fShader,
						defines: {
							// tofixed(1) tronque le nombre avec 1 nombre après la virgule
							PR: window.devicePixelRatio.toFixed(1),
						},
					});
				});
				this.waveArt('ROUGE', 40, 10);
				this.waveArt('BLEU', 15, 5);
				this.waveArt('JAUNE', 50, 7);
				this.waveArt('NOIR', 40, 6);
				console.log(this.model);
			},
			undefined,
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
}
