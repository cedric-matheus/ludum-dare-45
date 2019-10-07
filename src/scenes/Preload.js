import Phaser from 'phaser';

import playerImg from '../assets/player.png';
import enemyImg from '../assets/enemy.png';
import passiveImg from '../assets/passive.png';

class Preload extends Phaser.Scene {
  constructor() {
    // set scene key
    super('Preload');
  }

  preload() {
    // show loading screen
    this.logo = this.add.image(400, 300, 'logo');

    // load game assets
    this.load.spritesheet('player', playerImg, {
      frameWidth: 16,
      frameHeight: 30,
    });
    this.load.spritesheet('passive', passiveImg, {
      frameWidth: 16,
      frameHeight: 30,
    });
    this.load.spritesheet('enemy', enemyImg, {
      frameWidth: 16,
      frameHeight: 30,
    });
  }

  create() {
    // start game scene
    this.scene.start('Game');
  }
}

export default Preload;
