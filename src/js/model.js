import * as THREE from 'three';
import { Interaction } from 'three.interaction';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import model from '../model/GORIN_GLTF_COLOR_BAKED.gltf';

export default class Model {
	constructor(scene, sceneCtxt) {
		this.sceneCtxt = sceneCtxt;
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
				console.log(this.model);

				this.model.scale.x = this.model.scale.y = this.model.scale.z = 0.1;

				this.model.traverse((child) => {
					if (child.material) {
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
}
