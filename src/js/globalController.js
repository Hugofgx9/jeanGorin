import gsap from 'gsap';
import events from '~/js/store/event.json';

export default class globalController {
	constructor(audio, scene) {
		this.state = 0;
		this.audio = audio;
		this.scene = scene;
		this.$cursor = {
			play: document.querySelector('.cursor .play'),
			continue: document.querySelector('.cursor .continue'),
			el: document.querySelector('.cursor'),
		};

		this.loader();
	}

	/**
	 * Hide first screen and start sound
	 */
	loader() {
		let self = this;
		document.querySelector('.intro-screen').addEventListener('click', () => {
			hideLoader(afterHide);

			function afterHide() {
				document.querySelector('.intro-screen').remove();
				self.scene.start();
				self.hideEl(self.$cursor.play);
				self.audio.playMusic();
				self.audio.playVocal('1.introduction');
				self.state = 1;
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

	/**
	 * Allow the user to change scene and do it
	 */
	nextScene() {
		//event
		let canNext = false;
		let self = this;

		this.audio.on('vocalComplete', () => {
			allowNextAnim();
		});

		function allowNextAnim() {
			self.showEl(self.$cursor.continue);
			//btn.style.display = 'block';
			canNext = true;
		}

		function btnHandle() {
			if (canNext == true && self.state < events.length) {
				self.scene.nextSeq(self.state);
				//btn.style.display = 'none';
				self.hideEl(self.$cursor.continue);
				canNext = false;
			}
		}

		function onCameraComplete(i) {
			let vocalKey = events[i].vocal;
			let cubeAppear = events[i].cubeAppear;

			self.audio.playVocal(vocalKey);
			if (cubeAppear) self.scene.model.colorArt(cubeAppear);
			if (events[i].animation) self.scene.model.closeScene();
			self.state = i + 1;
		}

		this.scene.cameraController.on('movementcomplete', i => {
			onCameraComplete(i);
		});
		document.addEventListener('click', () => btnHandle());
	}

	showEl(el) {
		el.style.display = 'block';
		gsap.fromTo(
			el,
			0.5,
			{
				opacity: 0,
			},
			{
				opacity: 1,
				ease: 'power1.Out',
			}
		);
	}

	hideEl(el) {
		gsap.to(el, 1, {
			opacity: 0,
			ease: 'power1.Out',
			onComplete: () => (el.style.display = 'block'),
		});
	}
}
