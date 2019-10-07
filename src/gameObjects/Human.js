import Phaser from 'phaser';

class Human extends Phaser.GameObjects.Sprite {
  constructor(scene, posX, posY, imageKey) {
    super(scene, posX, posY, imageKey);

    this.scene = scene;
    this.imageKey = imageKey;

    // human attributes
    this.life = 100;
    this.attackForce = 5;
    this.velocity = 100;

    // add physics
    scene.physics.world.enable(this);
    // set bounce
    this.body.setBounce(1, 1);
    // add to scene
    scene.add.existing(this);
    // set collider with world bounds
    this.body.setCollideWorldBounds(true);

    console.log(this);
    // create stop animations
    this.createStopAnimations();
  }

  createStopAnimations() {
    this.scene.anims.create({
      key: `${this.imageKey}Stop`,
      frames: this.scene.anims.generateFrameNumbers(this.imageKey, {
        start: 0,
        end: 0,
      }),
      frameRate: 16,
      repeat: -1,
    });
  }

  stop() {
    // clear velocity of human
    this.body.setVelocity(0, 0);

    // play animation
    this.play(`${this.imageKey}Stop`);
  }

  moveUp() {
    // set negative velocity in y axis
    this.body.setVelocityY(-this.velocity);
  }

  moveDown() {
    // set velocity in y axis
    this.body.setVelocityY(this.velocity);
  }

  moveLeft() {
    // set negative velocity in x axis
    this.body.setVelocityX(-this.velocity);
  }

  moveRight() {
    // set velocity in x axis
    this.body.setVelocityX(this.velocity);
  }

  isClose(human) {
    // get humans x and y
    const { x, y } = this;
    const { x: humanX, y: humanY } = human;

    // check distance between humans
    return Phaser.Math.Distance.Between(x, y, humanX, humanY) <= 150;
  }

  isDead() {
    return this.life <= 0;
  }

  follow(human) {
    // follow human
    this.scene.physics.accelerateToObject(
      this,
      human,
      this.velocity,
      this.velocity,
      this.velocity
    );
  }

  attack(human) {
    // attack human
    this.scene.physics.moveToObject(this, human, this.velocity);
  }
}

export default Human;
