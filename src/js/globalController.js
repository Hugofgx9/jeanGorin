import gsap from 'gsap';

export default class globalController {
	constructor(audio, scene) {
		this.audio = audio;
		this.scene = scene;
		this.$cursor = {
			play: document.querySelector('.cursor .play'),
			continue: document.querySelector('.cursor .continue'),
			el: document.querySelector('.cursor'),
		};

		this.loader();
	}

	//hide first screen and start sound
	loader() {
		let self = this;
		document.addEventListener('click', () => {
			hideLoader(afterHide);

			function afterHide() {
				document.querySelector('.intro-screen').remove();
				self.scene.start();
				self.$cursor.play.style.display = 'none';
				self.audio.playMusic();
				self.audio.playVocal('1.introduction');
				self.nextScene();
			}
		});

		function hideLoader(callback) {
			gsap.to('.intro-screen', 1, {
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

		document.addEventListener('click', () => btnHandle());

		function allowNextAnim() {
			//btn.style.display = 'block';
			self.$cursor.continue.style.display = 'block';
		}

		function btnHandle() {
			self.scene.nextSeq();
			//btn.style.display = 'none';
			self.$cursor.continue.style.display = 'none';
		}
	}
}
