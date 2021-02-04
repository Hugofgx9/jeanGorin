import gsap from 'gsap';
import Scene from './scene';
import Audio from './audio';
import LevelController from './levelController';
import ScrollLoader from './loader';


let audioController = new Audio();
let scene = new Scene({ audio: audioController });

audioController.on('vocalComplete', () => {
	canNext();
});

let btn = document.querySelector('.scene .next-btn');
btn.addEventListener('click', () => btnHandle());

function canNext() {
	btn.style.display = 'block';
	document.body.style.cursor = 'default';
}

function btnHandle() {
	scene.nextSeq();
	btn.style.display = 'none';
	document.body.style.cursor = 'none';
}

//loader
document.querySelector('.loader button').addEventListener('click', () => {
	hideLoader(afterHide);

	function afterHide() {
		document.querySelector('.loader').remove();
		scene.start();
		document.body.style.cursor = 'none';
		audioController.playMusic();
		audioController.playVocal('1.introduction');
	}
});

function hideLoader(callback) {
	gsap.to('.loader', 1, {
		opacity: 0,
		onComplete: callback,
	});
}
