import {Scene} from "phaser";

export default class GameBackground extends Scene {
  preload () {

  }

  create() {
    this.add.line(400, 250);
  }
}