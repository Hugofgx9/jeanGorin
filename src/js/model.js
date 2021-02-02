import * as THREE from 'three';
import { Interaction } from 'three.interaction';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import model from '../model/GORIN_GLTF_BAKED.gltf';

export default class Model {
	constructor (scene, sceneCtxt) {

		this.sceneCtxt = sceneCtxt;
		this.scene = scene;

		this.loadModel();

	}


	loadModel() {
		const loader = new GLTFLoader();

		loader.load( model , ( gltf ) =>  {

			this.model = gltf.scene;
			this.scene.add( this.model );
			//this.model.getObjectByName('CUBE').visible = false;
			//this.sceneCtxt.camera.position.set( this.model.getObjectByName('CAM_FLAT', true).position.clone() );
			//this.sceneCtxt.camera = this.model.getObjectByName('CAM_FLAT', true);
			console.log(this.model);
			//console.log( this.model.getObjectByName('CAM_FLAT', true).position.clone() );
			//this.model(())
			//this.model.scale.x = this.model.scale.y = this.model.scale.z = 0.1;
			//console.log( this.model );
			this.model.traverse( (child) => {
				if (child.material) {
					//child.material.metalness = 0.999;
					//child.receiveShadow = true; //default
					//child.castShadow = true; //default is false
				}
			});

			//this.model.getObjectByName('CUBE', true).material.side = THREE.DoubleSide;
			//this.model.getObjectByName('CUBE', true).receiveShadow = true;

		}, undefined, ( error ) => {
			console.error( error );
		});

	}
}