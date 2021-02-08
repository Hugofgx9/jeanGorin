import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import vShader from '~/glsl/vShader_basic.glsl';
import fShader from '~/glsl/fShader_noise.glsl';
import gsap from 'gsap';
import CameraController from './cameraController';
import Model from './model';
import Intersection from './intersection';

export default class Scene {
	constructor(opts = {}) {
		this.options = opts;

		this.container = document.querySelector('canvas');

		this.scene = new THREE.Scene();
		this.perspective = 800;
		this.fov = (180 * (2 * Math.atan(window.innerHeight / 2 / this.perspective))) / Math.PI; //use for camera
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.container,
			//antialias: true,
			alpha: true,
		});

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);

		this.mouse = new THREE.Vector2(0, 0);
		this.clock = new THREE.Clock();

		this.initCamera();
		this.initComposer();
		this.model = new Model(this.scene, this);

		//this.intersection = new Intersection(this.scene, this);

		this.update();
	}

	initLights() {
	}

	remove(obj) {
		// this.scene.remove(obj);
		// obj.geometry.dispose();
		// obj.material.dispose();
		obj.scale.z = 0;
	}

	start() {
		this.bindEvents();
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, 1, 1000000);
		this.camera.position.set(0, 0, 0);
		this.camera.rotation.set(0, 0, 0);
		this.cameraController = new CameraController(this.camera, this);
		this.cameraController.initPos();
	}

	initComposer() {
		this.composer = new EffectComposer(this.renderer);
		let renderPass = new RenderPass(this.scene, this.camera);

		this.outlinePass = new OutlinePass(new THREE.Vector2( window.innerWidth, window.innerHeight ), this.scene, this.camera);
		this.outlinePass.renderToScreen = true;
		this.outlinePass.visibleEdgeColor = new THREE.Color(1, 0, 0);



		//custom shader pass
		let noiseShader = {
			uniforms: {
				tDiffuse: { value: null },
				u_time: { t: 'f', value: 0 },
			},
			vertexShader: vShader,
			fragmentShader: fShader,
		};

		this.noisePass = new ShaderPass(noiseShader);
		this.noisePass.renderToScreen = true;

		this.fxaaPass = new ShaderPass(FXAAShader);

		//init fxaaPass
		let pixelRatio = this.renderer.getPixelRatio();
		this.fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
		this.fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);

		// rendering our scene with different layers
		this.composer.addPass(renderPass);
		this.composer.addPass(this.outlinePass);
		this.composer.addPass(this.noisePass);
		this.composer.addPass(this.fxaaPass);
	}

	centerObject(object) {
		new THREE.Box3().setFromObject(object).getCenter(object.position).multiplyScalar(-1);
	}

	getObjectSize(object) {
		return new THREE.Box3().setFromObject(object).getSize();
	}

	updateCamera() {
		this.camera.fov = this.fov;
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
	}

	onWindowResize() {
		this.updateCamera();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.composer.setSize(window.innerWidth, window.innerHeight);

		//update fxaaPass
		let pixelRatio = this.renderer.getPixelRatio();
		this.fxaaPass.uniforms['resolution'].value.set(1 / (window.innerWidth * pixelRatio), 1 / (window.innerHeight * pixelRatio) );
	}

	onMouseMove(event) {
		gsap.to(this.mouse, 0.5, {
			x: event.clientX,
			y: event.clientY,
			ease: 'linear.none',
			onUpdate: () => this.cameraController.rotate(this.mouse),
		});

		//this.intersection.checkIntersection();
	}

	update() {
		requestAnimationFrame(this.update.bind(this));

		this.cameraController.cameraContainer.lookAt(10, 40, 100);
		this.noisePass.uniforms.u_time.value = this.clock.getElapsedTime();

		this.composer.render();
	}

	bindEvents() {
		if ('ontouchstart' in window) {
			document.addEventListener('touchmove', ev => this.onMouseMove(ev));
		} else {
			window.addEventListener('resize', () => this.onWindowResize());
			document.addEventListener('mousemove', ev => this.onMouseMove(ev), false);
		}
	}

	nextSeq( index ) {
		this.cameraController.nextPosition( index );
	}
}
