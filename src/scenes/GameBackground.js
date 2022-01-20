import { Scene } from 'phaser';

import { White } from '../consts/Colors';

export default class GameBackground extends Scene {
  preload() {}

  create() {
    this.add.line(400, 250, 0, 0, 0, 500, White, 1).setLineWidth(2.5, 2.5);
    this.add.circle(400, 250, 50).setStrokeStyle(5, White, 1);
  }
}
