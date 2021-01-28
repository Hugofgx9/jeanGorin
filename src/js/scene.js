import * as THREE from 'three';
import { Interaction } from 'three.interaction';
import gsap from 'gsap';
import vertexShader from '../glsl/vShader.glsl';
import fragmentShader from '../glsl/fShader.glsl';

export default class Scene {
	constructor(opts = {}) {

		this.options = opts;

		this.container = document.querySelector('canvas');

		this.scene = new THREE.Scene();
		this.perspective = 100;
		this.fov = (180 * (2 * Math.atan(window.innerHeight / 2 / this.perspective))) / Math.PI; //use for camera
		this.renderer = new THREE.WebGLRenderer ({
			canvas: this.container,
			antialias: true,
			alpha: true,
		});
		//document.body.appendChild ( this.renderer.domElement );
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);

		this.mouse = new THREE.Vector2(0,0);
		this.clock = new THREE.Clock();

		this.initLights();
		this.initCamera();
		this.bindEvents();
		this.update();
		this.interaction();
	}

	initLights() {
		const ambientLight = new THREE.AmbientLight( 0xffffff, 2);
		this.scene.add(ambientLight);
	}

	initCamera() {
		this.camera = new THREE.PerspectiveCamera( this.fov, window.innerWidth / window.innerHeight, 1, 1000);
		this.camera.position.set(0,0, this.perspective);
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
	}

	update() {
		requestAnimationFrame( this.update.bind( this ) );

		//this.stats.begin();

		this.renderer.render( this.scene , this.camera );
		//this.stats.end();
	}

	bindEvents() {
		if ('ontouchstart' in window){
			document.addEventListener('touchmove', (ev) => this.onMouseMove(ev));
		}else{
			window.addEventListener( 'resize', () => this.onWindowResize() );
			document.addEventListener('mousemove', (ev) => this.onMouseMove(ev), false);
		}
	}

	interaction() {
		new Interaction(this.renderer, this.scene, this.camera);
}



