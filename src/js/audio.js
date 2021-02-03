import { Howl, Howler } from 'howler';
import makeNode from './utils/makeNode';
import music from '~/js/store/music';
import voiceStore from '~/js/store/voice';

export default class AudioController {
	constructor() {}

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

			sound.play();
			//console.log(audio, 'playing');
			this.currentVocal = sound;

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
