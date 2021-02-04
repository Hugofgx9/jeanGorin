import { Howl, Howler } from 'howler';
import gsap from 'gsap';
import makeNode from './utils/makeNode';
import music from '~/js/store/music';
import voiceStore from '~/js/store/voice';
import Emitter from './utils/emitter';

export default class AudioController {
	constructor() {
		this.emitter = new Emitter();
	}

	on(event, callback) {
		this.emitter.on(event, callback);
	}

	playVocal(key) {
		this.stopVocal();

		if (voiceStore[key]) {
			let audio = voiceStore[key].mp3;
			let vtt = voiceStore[key].vtt;

			let subtitleContainer = document.querySelector('.subtitle-container p');

			//create audio and subtitle element
			let sound = new Audio(audio);
			let track = makeNode([
				'track',
				{ src: vtt, kind: 'subtitles', srclang: 'fr', default: 'default' },
			]);
			sound.appendChild(track);
			sound.volume = 0;

			sound.play().then(() => {
				gsap.to(sound, 0.5, {
					volume: 1,
				});
				this.currentVocal = sound;

				this.currentVocal.addEventListener('ended', () => {
					this.emitter.emit('vocalComplete');
				});
			});
			//console.log(audio, 'playing');

			//track handler
			track.oncuechange = (event) => {
				if (track.track.activeCues[0]) {
					subtitleContainer.textContent = track.track.activeCues[0].text;
				} else {
					subtitleContainer.textContent = '';
				}
			};
		}
	}

	playMusic() {
		this.stopMusic();

		let subtitleContainer = document.querySelector('.subtitle-container p');

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
		}
	}

	stopMusic() {
		if (this.currentMusic) {
			this.currentMusic.stop();
		}
	}
}
