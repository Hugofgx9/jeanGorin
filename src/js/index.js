import gsap from 'gsap';
import Scene from './scene';
import Audio from './audio';

let audioController = new Audio();
new Scene({ audio: audioController });

document.addEventListener('click', () => {
	audioController.playMusic();
	audioController.playVocal();
});
