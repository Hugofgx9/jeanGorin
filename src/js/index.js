import gsap from 'gsap';
import Scene from './scene';
import Audio from './audio';
import LevelController from './levelController';

let audioController = new Audio();
let scene = new Scene({ audio: audioController });

document.querySelector('.loader button').addEventListener('click', () => {
	hideLoader( afterHide );

	function afterHide() {
		document.querySelector('.loader').remove();
		scene.start();
		audioController.playMusic();
		//audioController.playVocal();
	};
})

function hideLoader ( callback ) {
	gsap.to('.loader', 1, {
		opacity: 0,
		onComplete: callback,
	})
}