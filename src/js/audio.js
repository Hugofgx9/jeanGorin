import mp3 from '../audio/Bienvenue_01.mp3';
import vtt from '../vtt/bienvenue.vtt';
import makeNode from './utils/makeNode';

export default class AudioController {
	constructor() {
		this.play();
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
}
