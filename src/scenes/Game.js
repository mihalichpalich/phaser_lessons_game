import {Scene} from "phaser";

import WebFontFile from "./WebFontFile";

export default class Game extends Scene {
  init() {
    this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0);
    this.leftScore = 0;
    this.rightScore = 0;
  }
  
  preload() {
    const fonts = new WebFontFile(this.load, 'Press Start 2P');
    this.load.addFile(fonts);
  }

  create() {
    const scoreStyle = {
      fontSize: 48,
      fontFamily: '"Press Start 2P"'
    };

    this.physics.world.setBounds(-100, 0, 1000, 500);

    this.ball = this.add.circle(400, 250, 10, 0xffffff);
    this.physics.add.existing(this.ball);
    this.ball.body.setCollideWorldBounds(true);
    this.resetBall();
    this.ball.body.setBounce(1, 1);
    
    this.paddleLeft = this.add.rectangle(
      50,
      250,
      30,
      100,
      0xffffff,
    );
    this.paddleRight = this.add.rectangle(
        750,
        250,
        30,
        100,
        0xffffff,
    );
    this.physics.add.existing(this.paddleLeft, true);
    this.physics.add.existing(this.paddleRight, true);
    this.physics.add.collider(this.paddleLeft, this.ball);
    this.physics.add.collider(this.paddleRight, this.ball);

    this.leftScoreLabel = this.add.text(300, 125, '0', scoreStyle)
                                    .setOrigin(0.5, 0.5);
    this.rightScoreLabel = this.add.text(500, 375, '0', scoreStyle)
                                    .setOrigin(0.5, 0.5);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    const paddleLeftBody = this.paddleLeft.body;
    const paddleRightBody = this.paddleRight.body;

    if (this.cursors.up.isDown) {
      this.paddleLeft.y -= 10;
      paddleLeftBody.updateFromGameObject();
    } else if (this.cursors.down.isDown) {
      this.paddleLeft.y += 10;
      paddleLeftBody.updateFromGameObject();
    }

    const diff = this.ball.y - this.paddleRight.y;

    if (Math.abs(diff) < 10) {
      return
    }

    const aiSpeed = 3;
    if (diff < 0) {
      this.paddleRightVelocity.y = -aiSpeed;
      if (this.paddleRightVelocity.y < -10) {
        this.paddleRightVelocity.y = -10;
      }
    } else if (diff > 0) {
      this.paddleRightVelocity.y = aiSpeed;
      if (this.paddleRightVelocity.y > 10) {
        this.paddleRightVelocity.y = -10;
      }
    }

    this.paddleRight.y += this.paddleRightVelocity.y;
    paddleRightBody.updateFromGameObject();

    if (this.ball.x < -30) {
      this.resetBall();
      this.incrementRightScore();
    } else if (this.ball.x > 830) {
      this.resetBall();
      this.incrementLeftScore();
    }
  }

  resetBall() {
    const angle = Phaser.Math.Between(0, 360);
    const vec = this.physics.velocityFromAngle(angle, 400);
    this.ball.setPosition(400, 250);
    this.ball.body.setVelocity(vec.x, vec.y);
  }

  incrementLeftScore() {
    this.leftScore += 1;
    this.leftScoreLabel.text = this.leftScore;
  }

  incrementRightScore() {
    this.rightScore += 1;
    this.rightScoreLabel.text = this.rightScore;
  }
}