import gsap from 'gsap';
import Scene from './scene';
import Audio from './audio';
import GlobalController from './globalController';

let audioController = new Audio();
let scene = new Scene({ audio: audioController });

new GlobalController(audioController, scene);


let cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {

	gsap.to(cursor, 0.5, {
		x: e.clientX,
		y: e.clientY,
		ease: 'linear.easeInOut'
	});
});