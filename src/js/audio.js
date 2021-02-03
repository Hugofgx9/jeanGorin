import {Howl, Howler} from 'howler';

import mp3 from '../audio/voice/1_bienvenue.mp3';
import vtt from './../vtt/1 - bienvenue.vtt';
import makeNode from './utils/makeNode';

export default class AudioController {
	constructor() {
		this.play2();
	}

	play() {
		let subtitleContainer = document.querySelector('.subtitle-container p');

		let sound = new Audio(mp3);
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

	play2() {
		let subtitleContainer = document.querySelector('.subtitle-container p');
		
		const sound = new Howl({
		  src: [mp3],
		});

		console.log(sound);

		// Play the sound.
		sound.play();
	}
}
