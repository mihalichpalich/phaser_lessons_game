import { Scene } from 'phaser';
import WebFontFile from './WebFontFile';

import { Game } from '../consts/SceneKeys';
import { PressStart2P } from '../consts/Fonts.js';
import { PongBeep } from '../consts/AudioKeys.js';

export default class TitleScreen extends Scene {
  preload() {
    const fonts = new WebFontFile(this.load, 'Press Start 2P');
    this.load.addFile(fonts);
  }

  create() {
    const title = this.add.text(400, 200, 'Old School Tennis', {
      fontSize: 38,
      fontFamily: PressStart2P,
    });
    title.setOrigin(0.5, 0.5);

    this.add
      .text(400, 300, 'Press Space to Start', {
        fontFamily: PressStart2P,
      })
      .setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.sound.play(PongBeep);
      this.scene.start(Game);
    });
  }
}
