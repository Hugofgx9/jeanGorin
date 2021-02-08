import * as THREE from 'three';
import gsap from 'gsap';
import { Interaction } from 'three.interaction';

export default class Intersection {
	constructor (scene, sceneCtx) {
		this.scene = scene;
		this.sceneCtx = sceneCtx;
		this.raycaster = new THREE.Raycaster();
		this.selectedObjects = [];
	}

	checkIntersection() {
		let self = this.sceneCtx;

		let mouse = new THREE.Vector2(0,0);
		gsap.set(mouse, {
			x: ( self.mouse.x / self.renderer.domElement.clientWidth ) * 2 - 1,
			y: - ( self.mouse.y / self.renderer.domElement.clientHeight ) * 2 + 1,
		});

		this.raycaster.setFromCamera( mouse, self.camera );

		const intersects = this.raycaster.intersectObjects( self.model.art.children );

		if ( intersects.length > 0 ) {

			//console.log(intersects[0]);
			const selectedObject = intersects[ 0 ].object;
			//this.addSelectedObject( selectedObject );
			//console.log(selectedObject);
			self.outlinePass.selectedObjects = [selectedObject];

		} else {
			//self.outlinePass.selectedObjects = [];
		}
	}

	interaction() {
		let self = this.sceneCtx;
		new Interaction(self.Screnderer, self.scene, self.camera);
	}


	addSelectedObject ( obj ) {
		this.selectedObjects.push( obj );	
	}
}