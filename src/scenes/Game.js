import { Scene } from 'phaser';

import * as SceneKeys from '../consts/SceneKeys';
import { White } from '../consts/Colors';
import { PressStart2P } from '../consts/Fonts.js';
import { PongBeep, PongPlop } from '../consts/AudioKeys.js';

const GameState = {
  Running: 'running',
  PlayerWon: 'player-won',
  AIWon: 'ai-won',
};

export default class Game extends Scene {
  init() {
    this.gameState = GameState.Running;
    this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0);
    this.leftScore = 0;
    this.rightScore = 0;
    this.paused = false;
  }

  create() {
    const scoreStyle = {
      fontSize: 48,
      fontFamily: PressStart2P,
    };
    this.scene.run(SceneKeys.GameBackground);
    this.scene.sendToBack(SceneKeys.GameBackground);

    this.physics.world.setBounds(-100, 0, 1000, 500);

    this.ball = this.add.circle(400, 250, 10, White);
    this.physics.add.existing(this.ball);
    this.ball.body.setCollideWorldBounds(true);
    this.ball.body.setCircle(10);
    this.ball.body.setBounce(1, 1);
    this.ball.body.setMaxSpeed(400);
    this.ball.body.onWorldBounds = true;

    this.paddleLeft = this.add.rectangle(50, 250, 30, 100, White);
    this.paddleRight = this.add.rectangle(750, 250, 30, 100, White);
    this.physics.add.existing(this.paddleLeft, true);
    this.physics.add.existing(this.paddleRight, true);
    this.physics.add.collider(
      this.paddleLeft,
      this.ball,
      this.handlePaddleBallCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.paddleRight,
      this.ball,
      this.handlePaddleBallCollision,
      undefined,
      this
    );

    this.physics.world.on(
      'worldbounds',
      this.handlePaddleBallWorldBoundsCollision,
      this
    );

    this.leftScoreLabel = this.add
      .text(300, 125, '0', scoreStyle)
      .setOrigin(0.5, 0.5);
    this.rightScoreLabel = this.add
      .text(500, 375, '0', scoreStyle)
      .setOrigin(0.5, 0.5);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.time.delayedCall(1500, () => {
      this.resetBall();
    });
  }

  update() {
    if (this.paused || this.gameState !== GameState.Running) return;
    this.processPlayerInput();
    this.updateAI();
    this.checkScore();
  }

  handlePaddleBallWorldBoundsCollision(body, up, down, left, right) {
    if (left || right) {
      return;
    }

    this.sound.play(PongPlop);
  }

  handlePaddleBallCollision() {
    const vel = this.ball.body.velocity;

    vel.x *= 1.05;
    vel.y *= 1.05;
    this.ball.body.setVelocity(vel.x, vel.y);
    this.sound.play(PongBeep);
  }

  processPlayerInput() {
    const paddleLeftBody = this.paddleLeft.body;

    if (this.cursors.up.isDown) {
      this.paddleLeft.y -= 10;
      paddleLeftBody.updateFromGameObject();
    } else if (this.cursors.down.isDown) {
      this.paddleLeft.y += 10;
      paddleLeftBody.updateFromGameObject();
    }
  }

  updateAI() {
    const paddleRightBody = this.paddleRight.body;
    const aiSpeed = 3;
    const diff = this.ball.y - this.paddleRight.y;

    if (Math.abs(diff) < 10) {
      return;
    }

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
  }

  checkScore() {
    const x = this.ball.x;
    const leftBounds = -30;
    const rightBounds = 830;
    const maxScore = 15;

    if (x >= leftBounds && x <= rightBounds) return;

    if (this.ball.x < leftBounds) {
      this.incrementRightScore();
    } else if (this.ball.x > rightBounds) {
      this.incrementLeftScore();
    }

    if (this.leftScore >= maxScore) {
      this.gameState = GameState.PlayerWon;
    } else if (this.rightScore >= maxScore) {
      this.gameState = GameState.AIWon;
    }

    if (this.gameState === GameState.Running) {
      this.resetBall();
    } else {
      this.ball.active = false;
      this.physics.world.remove(this.ball.body);
      this.scene.stop(SceneKeys.GameBackground);
      this.scene.start(SceneKeys.GameOver, {
        leftScore: this.leftScore,
        rightScore: this.rightScore,
      });
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
