import Phaser from 'phaser';

import scenes from './scenes';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: scenes,
  backgroundColor: '#7FD456',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: 0,
      debug: false,
    },
  },
};

export default config;
