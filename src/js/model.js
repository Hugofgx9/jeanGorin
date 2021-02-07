import * as THREE from 'three';
import gsap from 'gsap';
import vShader from '~/glsl/vShader_basic.glsl';
import fShader from '~/glsl/fShader.glsl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import composition35 from '~/img/jeanGorin.jpeg';
import model from '../model/GORIN_GLTF_SHADOWS_V2.gltf';
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
		let size = 55;
		let geometry = new THREE.PlaneGeometry(1, 1, 100, 100);

		let tex = new THREE.TextureLoader().load(composition35, t => {
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
		this.model.getObjectByName('RANDOM_BOX').material.transparent = true;
		this.model.getObjectByName('RANDOM_PLATE').material.transparent = true;
		this.model.getObjectByName('CUBE').material.transparent = true;

		tl.to(this.model.getObjectByName('RANDOM_BOX').material, 3, {
			opacity: 0,
			ease: 'power1.out',
		});
		tl.to(
			this.model.getObjectByName('RANDOM_PLATE').material,
			3,
			{
				opacity: 0,
				ease: 'power1.out',
			},
			'<'
		);
		tl.to(
			this.model.getObjectByName('CUBE').material,
			3,
			{
				opacity: 0,
				ease: 'power1.out',
			},
			'<'
		);
		tl.to(mesh.material, 3, {
			opacity: 1,
			ease: 'power1.out',
		}, '<');
	}
}
