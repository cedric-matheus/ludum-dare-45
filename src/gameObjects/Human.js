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
    // this.createStopAnimations();
    // create walk animations
    // this.createWalkAnimations();
  }

  createWalkAnimations() {
    this.scene.anims.create({
      key: 'walkFront',
      frames: this.scene.anims.generateFrameNumbers(this.imageKey, {
        start: 4,
        end: 7,
      }),
      frameRate: 16,
      repeat: -1,
    });
    this.scene.anims.create({
      key: 'walkLeft',
      frames: this.scene.anims.generateFrameNumbers('player', {
        start: 8,
        end: 11,
      }),
      frameRate: 16,
      repeat: -1,
    });
    // this.anims.create({
    //   key: 'walkBack',
    //   frames: this.anims.generateFrameNumbers(this.imageKey, {
    //     start: 12,
    //     end: 15,
    //   }),
    //   frameRate: 16,
    //   repeat: -1,
    // });
    // this.anims.create({
    //   key: 'walkRight',
    //   frames: this.anims.generateFrameNumbers(this.imageKey, {
    //     start: 16,
    //     end: 19,
    //     first: 19,
    //   }),
    //   frameRate: 16,
    //   repeat: -1,
    // });
  }

  createStopAnimations() {
    this.scene.anims.create({
      key: 'stopFront',
      frames: this.scene.anims.generateFrameNumbers(this.imageKey, {
        start: 0,
        end: 0,
      }),
      frameRate: 16,
      repeat: -1,
    });
    this.scene.anims.create({
      key: 'stopLeft',
      frames: this.scene.anims.generateFrameNumbers(this.imageKey, {
        start: 1,
        end: 1,
      }),
      frameRate: 16,
      repeat: -1,
    });
    // this.anims.create({
    //   key: 'stopBack',
    //   frames: this.anims.generateFrameNumbers(this.imageKey, {
    //     start: 2,
    //     end: 2,
    //   }),
    //   frameRate: 16,
    //   repeat: -1,
    // });
    // this.anims.create({
    //   key: 'stopRight',
    //   frames: this.anims.generateFrameNumbers(this.imageKey, {
    //     start: 3,
    //     end: 3,
    //   }),
    //   frameRate: 16,
    //   repeat: -1,
    // });
  }

  stop() {
    // stop animations array
    const stopAnimations = [
      'stopFront',
      'stopLeft',
      `${this.imageKey}StopBack`,
      `${this.imageKey}StopRight`,
    ];
    // get a random animation number
    const randomAnimationNumber = Phaser.Math.Between(0, 3);

    // clear velocity of human
    this.body.setVelocity(0, 0);

    // play animation
    this.play(stopAnimations[randomAnimationNumber]);
  }

  moveUp() {
    // set negative velocity in y axis
    this.body.setVelocityY(-this.velocity);
    // play animation
    this.play('walkBack');
  }

  moveDown() {
    // set velocity in y axis
    this.body.setVelocityY(this.velocity);
    // play animation
    this.play('walkFront');
  }

  moveLeft() {
    // set negative velocity in x axis
    this.body.setVelocityX(-this.velocity);
    // play animation
    // this.play('walkLeft', true);
  }

  moveRight() {
    // set velocity in x axis
    this.body.setVelocityX(this.velocity);
    // play animation
    this.play(`walkRight`, true);
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
