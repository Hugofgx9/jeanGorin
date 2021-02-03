import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { Interaction } from 'three.interaction';
import CameraController from './cameraController';
import Model from './model';
import vertexShader from '../glsl/vShader.glsl';
import fragmentShader from '../glsl/fShader.glsl';
import Stats from 'stats.js';

export default class Scene {
	constructor(opts = {}) {
		this.options = opts;

		this.container = document.querySelector('canvas');

		this.scene = new THREE.Scene();
		this.perspective = 800;
		this.fov =
			(180 * (2 * Math.atan(window.innerHeight / 2 / this.perspective))) /
			Math.PI; //use for camera
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.container,
			antialias: true,
			alpha: true,
		});

		this.stats = new Stats();

		this.stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
		document.body.appendChild(this.stats.dom);

		//document.body.appendChild ( this.renderer.domElement );
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.mouse = new THREE.Vector2(0, 0);
		this.clock = new THREE.Clock();

		//this.initLights();
		this.initCamera();
		//this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.model = new Model(this.scene, this);
		this.interaction();
		this.update();
	}

	initLights() {
		// const ambientLight = new THREE.AmbientLight( 0xffffff, 1000000);
		// this.scene.add(ambientLight);
		/*		const light1 = new THREE.PointLight( 0xffffff, 3.5, 0, 2);
		//light1.position.set(0, 5000, -25000 );
		light1.position.set(0, 100000, 0 );
		//light1.castShadow = true;
		const light2 = new THREE.PointLight( 0xffffff, 1.3, 0, 2 );
		light2.position.set(-2000, 400, -10000 );
		//light2.castShadow = true;
		this.scene.add( light1 );
		this.scene.add( light2 );
*/
	}

	start() {
		this.bindEvents();
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera(
			this.fov,
			window.innerWidth / window.innerHeight,
			1,
			1000000
		);
		this.camera.position.set(0, 0, this.perspective);
		this.camera.rotation.set(0, 0, 0);
		this.cameraController = new CameraController(this.camera, this);
		this.cameraController.initPos();
	}

	centerObject(object) {
		new THREE.Box3()
			.setFromObject(object)
			.getCenter(object.position)
			.multiplyScalar(-1);
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
	}

	onMouseMove(event) {
		gsap.to(this.mouse, 0.5, {
			x: event.clientX,
			y: event.clientY,
			ease: 'linear.none',
			onUpdate: () => this.cameraController.rotate(this.mouse),
		});
	}

	update() {
		requestAnimationFrame(this.update.bind(this));

		this.stats.begin();
		//this.controls.update();

		this.renderer.render(this.scene, this.camera);
		this.stats.end();
	}

	bindEvents() {
		if ('ontouchstart' in window) {
			document.addEventListener('touchmove', (ev) => this.onMouseMove(ev));
		} else {
			window.addEventListener('resize', () => this.onWindowResize());
			document.addEventListener(
				'mousemove',
				(ev) => this.onMouseMove(ev),
				false
			);
			document.addEventListener('click', () => this.clickHandle());
		}
	}

	clickHandle() {
		this.cameraController.nextPosition();
		//console.log('click');
	}

	interaction() {
		new Interaction(this.renderer, this.scene, this.camera);
	}
}
