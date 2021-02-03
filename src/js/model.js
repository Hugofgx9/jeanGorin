import * as THREE from 'three';
import { Interaction } from 'three.interaction';
import gsap from 'gsap';
import vShader from '~/glsl/vShader.glsl';
import fShader from '~/glsl/fShader.glsl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import model from '../model/GORIN_GLTF_COLOR_2048_EXPORT.gltf';

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
			(gltf) => {
				this.model = gltf.scene;
				this.scene.add(this.model);

				let modelCam = this.model.getObjectByName('CAM_FLAT', true);

				this.art = this.model.getObjectByName('3D', true);

				this.art.material = new THREE.ShaderMaterial({
					uniforms: {
						u_map: { type: 't', value: this.art.material.map },
						u_colorAmount: { type: 'vec3', value: {r: 0, g:0, b:0} },
					},
					vertexShader: vShader,
					fragmentShader: fShader,
					defines: {
						// tofixed(1) tronque le nombre avec 1 nombre après la virgule
						PR: window.devicePixelRatio.toFixed(1),
					},
				});

				this.model.traverse((child) => {
					if (child.material && child.name != '3D') {
						let firstMap = child.material.map;
						child.material = new THREE.MeshBasicMaterial({
							color: 0xffffff,
							side: THREE.DoubleSide,
							map: child.material.map,
						});
					}
				});
			},
			undefined,
			(error) => {
				console.error(error);
			}
		);
	}

	setColorAmount(colorAmount) {
		let elementTarget = this.art.material.uniforms.u_colorAmount.value;

		gsap.to(elementTarget, 1,{
			r: colorAmount.r,
			g: colorAmount.g,
			b: colorAmount.b,
		});
	}
}
