import Phaser from 'phaser';

import Human from './Human';

class HumansGroup extends Phaser.GameObjects.Group {
  constructor(scene, leader) {
    super(scene);

    this.leaderImgKey = leader.texture.key;
    this.scene = scene;

    // leader of group
    this.leader = leader;
  }

  addMember(passive) {
    // get x and y position from passive
    const { x, y } = passive;
    // create new member with x and y position from passive
    const member = new Human(this.scene, x, y, this.leaderImgKey);
    // add meber to group
    this.add(member);
  }

  moveToLeader() {
    // call action to get all member of group
    Phaser.Actions.Call(this.getChildren(), (member) => {
      // folow leader
      member.follow(this.leader);
    });
  }
}

export default HumansGroup;
