import gsap from 'gsap';
import Scene from './scene';
import Audio from './audio';
import LevelController from './levelController';
import ScrollLoader from './loader';

let audioController = new Audio();
let scene = new Scene({ audio: audioController });




//new ScrollLoader;





//loader
document.querySelector('.loader button').addEventListener('click', () => {
	hideLoader( afterHide );

	function afterHide() {
		document.querySelector('.loader').remove();
		scene.start();
		audioController.playMusic();
	};
})

function hideLoader ( callback ) {
	gsap.to('.loader', 1, {
		opacity: 0,
		onComplete: callback,
	})
}