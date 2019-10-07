import Phaser from 'phaser';

// lose screen
class Lose extends Phaser.Scene {
  constructor() {
    // set scene key
    super('Lose');
  }

  create() {
    console.log('Lose');
  }
}

export default Lose;
