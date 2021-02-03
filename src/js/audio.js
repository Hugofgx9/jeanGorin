import {Howl, Howler} from 'howler';
import makeNode from './utils/makeNode';
import music from '~/js/store/music';
import voiceStore from '~/js/store/voice';

export default class AudioController {
	constructor() {
		this.play(voiceStore.intro.audio, voiceStore.intro.vtt);
		this.playMusic();

	}

	play(audio, vtt) {
		let subtitleContainer = document.querySelector('.subtitle-container p');

		let sound = new Audio(audio);
		let track = makeNode([
			'track',
			{ src: vtt, kind: 'subtitles', srclang: 'fr', default: 'default' },
		]);
		sound.appendChild(track);

		sound.play();

		//track handler
		track.oncuechange = (event) => {
			console.log(track.track);
			if (track.track.activeCues[0]) {
				subtitleContainer.textContent = track.track.activeCues[0].text;
			} else {
				subtitleContainer.textContent = '';
			}
		};
	}

	playMusic() {
		let subtitleContainer = document.querySelector('.subtitle-container p');
		
		const sound = new Howl({
		  src: [music.piano],
	    loop: true,
  		volume: 0.5,
		});

		console.log(sound);

		// Play the sound.
		sound.play();
	}
}
