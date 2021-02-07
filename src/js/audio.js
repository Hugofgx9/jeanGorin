import { Howl, Howler } from 'howler';
import gsap from 'gsap';
import makeNode from './utils/makeNode';
import music from '~/js/store/music';
import voiceStore from '~/js/store/voice';
import Emitter from './utils/emitter';

export default class AudioController {
	constructor() {
		this.emitter = new Emitter();
		this.preload();
		this.voiceLoaded = {};
	}

	preload() {
		console.log('preload');

		let loaded = 0;
		let total = Object.keys(voiceStore).length;
		for (let key in voiceStore) {
			let audio = voiceStore[key].mp3;
			let vtt = voiceStore[key].vtt;

			//create audio and subtitle element
			let sound = new Audio(audio);
			let track = makeNode(['track', { src: vtt, kind: 'subtitles', srclang: 'fr', default: 'default' }]);
			sound.appendChild(track);

			sound.addEventListener('canplaythrough', () => {
				this.voiceLoaded[key] = sound;
				loaded += 1;
				this.emitter.emit('loadprogress', loaded / total);
			});
		}
	}

	on(event, callback) {
		this.emitter.on(event, callback);
	}

	playVocal(key) {
		this.stopVocal();

		if (this.voiceLoaded[key]) {
			this.sound = this.voiceLoaded[key];
			this.track = this.sound.querySelector('track');

			let subtitleContainer = document.querySelector('.subtitle-container p');
			this.currentVocal = this.sound;

			this.sound.play().then(() => {
				// gsap.to(sound, 0.5, {
				// 	volume: 1,
				// });

				this.currentVocal.addEventListener('ended', () => {
					this.emitter.emit('vocalComplete');
				});
			});

			//track handler
			this.track.oncuechange = () => {
				if (this.track.track.activeCues[0]) {
					subtitleContainer.textContent = this.track.track.activeCues[0].text;
				} else {
					subtitleContainer.textContent = '';
				}
			};
		}
	}

	playMusic() {
		this.stopMusic();

		const sound = new Howl({
			src: [music.piano],
			loop: true,
			volume: 0.5,
		});
		// Play the sound.
		sound.play();
		this.currentMusic = sound;
	}

	stopVocal() {
		if (this.currentVocal) {
			this.currentVocal.pause();
			this.currentVocal.currentTime = 0;
			this.vocal = null;
		}
	}

	stopMusic() {
		if (this.currentMusic) {
			this.currentMusic.stop();
		}
	}
}
