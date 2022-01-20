import { Scene } from 'phaser';

import * as SceneKeys from '../consts/SceneKeys';
import { PressStart2P } from '../consts/Fonts.js';

export default class GameOver extends Scene {
  create(data) {
    let titleText = 'GameOver';

    if (data.leftScore > data.rightScore) {
      titleText = 'You win!';
    }

    this.add
      .text(400, 200, titleText, {
        fontFamily: PressStart2P,
        fontSize: 38,
      })
      .setOrigin(0.5);
    this.add
      .text(400, 300, 'Press Space to Continue', {
        fontFamily: PressStart2P,
      })
      .setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start(SceneKeys.TitleScreen);
    });
  }
}
