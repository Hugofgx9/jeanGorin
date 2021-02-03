import gsap from 'gsap';

export default class Loader {
	constructor() {
		this.bindEvents();
		this.wheelValue = 1;
	}
	bindEvents() {
		document.addEventListener('mousewheel', (ev) => {
			this.wheelValue += ev.deltaY * 0.0001;
			this.setScale(this.wheelValue);

			let opacity = Math.min(Math.max(this.wheelValue, 1.5), 2);
			//0 ..1
			opacity = (opacity - 1.5) * 2;
			//1.. 0
			opacity = -opacity + 1;
			this.setOpacity(opacity);

			if (this.wheelValue >= 1.6) this.openScene();
		});
	}

	setScale(v) {
		gsap.to('.loader img', 0.5, {
			scale: v,
		});
	}

	setOpacity(v) {
		gsap.to('.loader', 0.5, {
			opacity: v,
		});
	}

	openScene() {
		this.setScale(2);
		this.setOpacity(0);
	}
}
