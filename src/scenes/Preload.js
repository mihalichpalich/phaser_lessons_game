import { Scene } from 'phaser';

import { TitleScreen } from '../consts/SceneKeys.js';
import { PongBeep, PongPlop } from '../consts/AudioKeys.js';

import WebFontFile from './WebFontFile.js';

export default class Preload extends Scene {
  preload() {
    const fonts = new WebFontFile(this.load, 'Press Start 2P');
    this.load.addFile(fonts);
    this.load.audio(PongBeep, 'assets/ping_pong_8bit_beeep.ogg');
    this.load.audio(PongPlop, 'assets/ping_pong_8bit_plop.ogg');
  }

  create() {
    this.scene.start(TitleScreen);
  }
}
