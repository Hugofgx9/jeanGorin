import gsap from 'gsap';

export default class globalController {
	constructor(audio, scene) {
		this.audio = audio;
		this.scene = scene;

		this.loader();
		this.nextScene();
	}

	//hide first screen and start sound
	loader() {
		let self = this;
		document.querySelector('.loader button').addEventListener('click', () => {
			hideLoader(afterHide);

			function afterHide() {
				document.querySelector('.loader').remove();
				self.scene.start();
				document.body.style.cursor = 'none';
				self.audio.playMusic();
				self.audio.playVocal('1.introduction');
			}
		});

		function hideLoader(callback) {
			gsap.to('.loader', 1, {
				opacity: 0,
				onComplete: callback,
			});
		}
	}

	//allow the user to change scene and do it
	nextScene() {
		//event
		let self = this;

		this.audio.on('vocalComplete', () => {
			allowNextAnim();
		});

		let btn = document.querySelector('.scene .next-btn');
		btn.addEventListener('click', () => btnHandle());

		function allowNextAnim() {
			btn.style.display = 'block';
			document.body.style.cursor = 'default';
		}

		function btnHandle() {
			self.scene.nextSeq();
			btn.style.display = 'none';
			document.body.style.cursor = 'none';
		}
	}
}
