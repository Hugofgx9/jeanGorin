
import Scene from './scene';
import Audio from './audio';
import GlobalController from './globalController';

let audioController = new Audio();
let scene = new Scene({ audio: audioController });

new GlobalController(audioController, scene);