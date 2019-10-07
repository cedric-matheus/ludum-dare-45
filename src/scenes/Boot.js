import Phaser from 'phaser';

import logoImg from '../assets/logo.png';

// configure game and load loading asset
class Boot extends Phaser.Scene {
  constructor() {
    // set scene key
    super('Boot');
  }

  preload() {
    // asset used in loading
    this.load.image('logo', logoImg);
  }

  create() {
    // start preload scene
    this.scene.start('Preload');
  }
}

export default Boot;
