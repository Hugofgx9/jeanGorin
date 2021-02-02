import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import gsap from 'gsap';
import { Interaction } from 'three.interaction';
import CameraController from './cameraController';
import vertexShader from '../glsl/vShader.glsl';
import fragmentShader from '../glsl/fShader.glsl';

export default class Scene {
	constructor(opts = {}) {

		this.options = opts;

		this.container = document.querySelector('canvas');

		this.scene = new THREE.Scene();
		this.perspective = 800;
		this.fov = (180 * (2 * Math.atan(window.innerHeight / 2 / this.perspective))) / Math.PI; //use for camera
		this.renderer = new THREE.WebGLRenderer ({
			canvas: this.container,
			antialias: true,
			alpha: true,
		});
		//document.body.appendChild ( this.renderer.domElement );
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.shadowMap.enabled = true;
		//this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.mouse = new THREE.Vector2(0,0);
		this.clock = new THREE.Clock();

		this.initLights();
		this.initCamera();
		this.bindEvents();
		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.initMeshs();
		this.update();
		this.interaction();

	}

	initLights() {
		const ambientLight = new THREE.AmbientLight( 0xffffff, 0.50);
		this.scene.add(ambientLight);

		const light1 = new THREE.PointLight( 0xffffff, 1, 0, 2);
		//const light1 = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);

		//light1.position.set(0, 5000, -25000 );
		light1.position.set(0, 0, 10 );
		light1.castShadow = true;
		light1.shadow.bias = -0.0001;
		light1.shadow.radius = 20;
    //light1.shadow.bias = 0.2;
		light1.shadow.mapSize.width = 1024 * 1;
		light1.shadow.mapSize.height = 1024 * 1;
		this.scene.add( light1 );
		//this.scene.add( light2 );

		// const sphereSize = 20;
		// const pointLightHelper = new THREE.PointLightHelper( light2, sphereSize );
		// this.scene.add( pointLightHelper );
	}

	initMeshs() {
		const geometry1 = new THREE.BoxGeometry( 1, 1, 1 );
		const material1 = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
		const cube = new THREE.Mesh( geometry1, material1 );
		this.scene.add( cube );
		cube.position.set(0, 0, 2);
		cube.castShadow = true;


		const geometry2 = new THREE.PlaneGeometry( 5, 20, 32 );
		const material2 = new THREE.MeshStandardMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
		const plane = new THREE.Mesh( geometry2, material2 );
		this.scene.add( plane );
		plane.receiveShadow = true;
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera( this.fov, window.innerWidth / window.innerHeight, 1, 10000000);
		this.camera.position.set(0, -3 , 5);
		this.cameraController = new CameraController (this.camera);
	}

	centerObject (object) {
		new THREE.Box3().setFromObject( object ).getCenter( object.position ).multiplyScalar( - 1 );
	}

	getObjectSize( object ) {
			return new THREE.Box3().setFromObject( object ).getSize();
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
		gsap.to(this.mouse, 0.5,{
			x: event.clientX,
			y: event.clientY,
			//x: ( event.clientX / window.innerWidth ) * 2 - 1,
			//y: ( event.clientY / window.innerHeight ) * 2 + 1,
		});
		this.cameraController.rotate( this.mouse );
	}

	update() {
		requestAnimationFrame( this.update.bind( this ) );

		//this.stats.begin();
		this.controls.update();

		this.renderer.render( this.scene , this.camera );
		//this.stats.end();
	}

	bindEvents() {
		if ('ontouchstart' in window){
			document.addEventListener('touchmove', (ev) => this.onMouseMove(ev));
		}else{
			window.addEventListener( 'resize', () => this.onWindowResize() );
			document.addEventListener('mousemove', (ev) => this.onMouseMove(ev), false);
			document.addEventListener('click', () => this.clickHandle() );
		}
	}

	clickHandle() {
		//this.cameraController.nextPosition();
		console.log('hello');
	}

	interaction() {
		new Interaction(this.renderer, this.scene, this.camera);
	}
}