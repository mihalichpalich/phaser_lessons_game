import {Scene} from "phaser";

export default class TitleScreen extends Scene {
  create() {
    const text = this.add.text(400, 250, 'Hello, World');
    text.setOrigin(0.5, 0.5);
  }
}