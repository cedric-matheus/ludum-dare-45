import Phaser from 'phaser';

import { Human, HumansGroup } from '../gameObjects';

class Game extends Phaser.Scene {
  constructor() {
    // set scene key
    super('Game');

    this.passives;
    this.player;
    this.enemy;
    this.cursors;
  }

  createLeader(enemy = false) {
    let leader;

    if (enemy) {
      // create enemy leader
      leader = this.createHuman('enemy');
      // add movement attributes
      leader.movementCounter = 0;
      leader.movementTotal = 0;
      leader.movement = null;
    } else {
      // create player leader
      leader = this.createHuman('player');
    }

    // create group of leader
    leader.group = new HumansGroup(this, leader);

    return leader;
  }

  createPassives(total) {
    // create passives group
    this.passives = this.physics.add.group({
      collideWorldBounds: true,
    });

    // create passives
    for (let i = 1; i <= total; i++) {
      // create passive
      const member = this.createHuman('passive');
      // add movement attributes
      member.movementCounter = 0;
      member.movementTotal = 0;
      member.movement = null;
      // add passive to array
      this.passives.add(member);
    }
  }

  createHuman(imageKey) {
    // get random position
    const humanX = Phaser.Math.Between(18, 800 - 18);
    const humanY = Phaser.Math.Between(41, 600 - 41);

    return new Human(this, humanX, humanY, imageKey);
  }

  recruteMember(leader, passive) {
    // add passive to leader group that recruited
    leader.group.addMember(passive);
    // destroy passive
    passive.destroy();
  }

  moveHuman(human) {
    // human don't have a movement
    if (!human.movement) {
      // get a random movement number
      const randomMovement = Phaser.Math.Between(1, 5);
      // get a total number of movements
      human.movementTotal = Phaser.Math.Between(1, 15);

      // set movement by number
      switch (randomMovement) {
        case 1:
          human.movement = human.moveDown;
          break;
        case 2:
          human.movement = human.moveUp;
          break;
        case 3:
          human.movement = human.moveLeft;
          break;
        case 4:
          human.movement = human.moveRight;
          break;
        case 5:
          human.movement = human.stop;
          break;
      }

      // move human
      human.movement();

      // human movement counter is reached in total
    } else if (human.movementCounter === human.movementTotal) {
      // set movement to null
      human.movement = null;
      // clear counter and total
      human.movementCounter = 0;
      human.movementTotal = 0;
    } else {
      // move human
      human.movement();
      // increment movement counter
      human.movementCounter++;
    }
  }

  humanConflict(humanA, humanB) {
    humanA.life -= humanB.attackForce;
    humanB.life -= humanA.attackForce;
  }

  create() {
    // create player
    this.player = this.createLeader();

    // create enemy
    this.enemy = this.createLeader(true);

    // create passives
    this.createPassives(6);

    // create collision between player and player group
    this.physics.add.collider(this.player, this.player.group);

    // create collision between player group and player group
    this.physics.add.collider(this.player.group, this.player.group);

    // create collision between enemy and enemy group
    this.physics.add.collider(this.enemy, this.enemy.group);

    // create collision between enemy group and enemy group
    this.physics.add.collider(this.enemy.group, this.enemy.group);

    // create overlap collision between player and passive human
    this.physics.add.overlap(this.passives, this.player, this.recruteMember);

    // create overlap collision between enemy and passive human
    this.physics.add.overlap(this.passives, this.enemy, this.recruteMember);

    // create collision between player and enemy
    this.physics.add.collider(this.player, this.enemy, this.humanConflict);

    // create collision between player and enemy group
    this.physics.add.collider(
      this.player,
      this.enemy.group,
      this.humanConflict
    );

    // create collision between player group and enemy group
    this.physics.add.collider(
      this.player.group,
      this.enemy.group,
      this.humanConflict
    );

    // create collision between player group and enemy
    this.physics.add.collider(
      this.player.group,
      this.enemy,
      this.humanConflict
    );

    // cursors to move
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    // player movement
    // player movement stop
    this.player.stop();
    // player movement x axis
    if (this.cursors.left.isDown) {
      this.player.moveLeft();
      this.player.anims.play('walkLeft', true, 2);
    } else if (this.cursors.right.isDown) {
      this.player.moveRight();
    }
    // player movement y axis
    if (this.cursors.up.isDown) {
      this.player.moveUp();
    } else if (this.cursors.down.isDown) {
      this.player.moveDown();
    }

    // player group movement
    this.player.group.moveToLeader();
    // member of player group is close to enemy group or enemy
    // call action to get all child of player group array
    Phaser.Actions.Call(this.player.group.getChildren(), (playerMember) => {
      // check if playerMember is close to enemy
      if (playerMember.isClose(this.enemy)) playerMember.attack(this.enemy);

      // call action to get all child of enemy group array
      Phaser.Actions.Call(this.enemy.group.getChildren(), (enemyMember) => {
        // check if playerMember is close to enemyMember
        if (playerMember.isClose(enemyMember)) playerMember.attack(enemyMember);
      });
    });

    // enemy movement
    this.moveHuman(this.enemy);
    // enemy is close to passive
    // call action to get all child of passives array
    Phaser.Actions.Call(this.passives.getChildren(), (passive) => {
      // check if enemy is close to passive
      if (this.enemy.isClose(passive)) this.enemy.attack(passive);
    });

    // enemy group movement
    this.enemy.group.moveToLeader();
    // member of enemy group is close to player group or player
    // call action to get all child of enemy group array
    Phaser.Actions.Call(this.enemy.group.getChildren(), (enemyMember) => {
      // check if enemyMember is close to player
      if (enemyMember.isClose(this.player)) enemyMember.attack(this.player);

      // call action to get all child of player group array
      Phaser.Actions.Call(this.player.group.getChildren(), (playerMember) => {
        // check if enemyMember is close to playerMember
        if (enemyMember.isClose(playerMember)) enemyMember.attack(playerMember);
      });
    });

    // passives movement
    // call action to get all child of passives array
    Phaser.Actions.Call(this.passives.getChildren(), (passive) => {
      // move passive
      this.moveHuman(passive);
    });

    // player group dead
    // call action to get all child of player group array
    Phaser.Actions.Call(this.player.group.getChildren(), (child) => {
      // check child dead
      if (child.isDead()) child.destroy();
    });

    // player group dead
    // call action to get all child of enemy group array
    Phaser.Actions.Call(this.enemy.group.getChildren(), (child) => {
      // check child dead
      if (child.isDead()) child.destroy();
    });

    // check enemy dead (Win)
    if (this.enemy.isDead()) this.scene.start('Win');

    // check player dead (Lose)
    if (this.player.isDead()) this.scene.start('Lose');
  }
}

export default Game;
