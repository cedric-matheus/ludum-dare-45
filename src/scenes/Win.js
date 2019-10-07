import Phaser from 'phaser';

// win screen
class Win extends Phaser.Scene {
  constructor() {
    // set scene key
    super('Win');
  }

  create() {
    console.log('Win');
  }
}

export default Win;
