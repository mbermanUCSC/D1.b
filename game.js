class SceneA extends Phaser.Scene {
  constructor() {
    super({ key: 'sceneA' });
  }

  preload() {
    this.load.image('background', 'assets/bckgrn.png');
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Set studio logo as full screen
    const background = this.add.image(centerX, centerY, 'background');
    background.setDisplaySize(window.innerWidth, window.innerHeight);

    const text = this.add.text(centerX, 100, 'Fluffy Pillow Studios', {
      fontSize: '100px',
      fill: '#000000',
      fontStyle: 'bold',
      fontFamily: 'Impact'
    });
    text.setOrigin(0.5);

    // Advance when the screen is clicked
    this.input.on('pointerdown', () => {
      this.scene.start('sceneB');
    });
  }
}

// Menu scene
class SceneB extends Phaser.Scene {
  constructor() {
    super({ key: 'sceneB' });
  }

  preload() {
    this.load.image('startButton', 'assets/start.png');
    this.load.image('logoPNG', 'assets/logo.png');
    this.load.audio('backgroundMusic', 'assets/gameMusic.mp3');
  }

  create() {
    // Set bacgkround to white
    this.cameras.main.setBackgroundColor('#FFFFFF');


    // Load images & text + play music
    const startButton = this.add.image(450, 200, 'startButton').setScale(0.5);
    const logoPNG = this.add.image(1000, 300, 'logoPNG').setScale(0.4);

    const backgroundMusic = this.sound.add('backgroundMusic', { loop: true, volume: 0.5 });
    backgroundMusic.play();

    const multilineText = `
Get some z’s by clicking the pillow! The better rested you
are, the better your pillow becomes. Upgrade, modify, and 
learn to love your pillow friend.
`;
    this.add.text(100, 600, multilineText, { fontSize: '24px', color: '#000000', fontFamily: 'Courier' });

    // Start game when start button is pressed (Scence C)
    startButton.setInteractive();

    startButton.on('pointerdown', () => {
      this.cameras.main.fadeOut(500);
      this.time.delayedCall(500, () => {
        this.scene.start('sceneC');
        this.cameras.main.fadeIn(500);
      });
    });
  }
}


class SceneC extends Phaser.Scene {
  constructor() {
    super({ key: 'sceneC' });
  }

  preload() {
    this.load.image('pillowImage', 'assets/pillow.png');
    this.load.image('menu', 'assets/menu.png');
    this.load.audio('pillowSound', 'assets/pillow.mp3');
  }

  create() {
    // Set background to light yello
    this.cameras.main.setBackgroundColor('#f5deb3');

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    const pillowImage = this.add.image(centerX, centerY, 'pillowImage').setScale(0.3);
    const pillowSound = this.sound.add('pillowSound');


    // Make pillow interactive + initialize click counter
    const originalScale = pillowImage.scale;
    pillowImage.setInteractive();

    this.counter = 0;
    this.counterText = this.add.text(window.innerWidth - 100, 20, '0', { fontSize: '24px', fill: '#000000' });

    // Animate, play sound, + update counter when pillow is clicked
    pillowImage.on('pointerdown', () => {
      this.counter++;
      this.counterText.setText(this.counter);

      pillowImage.setScale(originalScale);
      pillowSound.play();

      this.tweens.add({
        targets: pillowImage,
        scale: originalScale * 1.2,
        duration: 100,
        yoyo: true,
        ease: 'Cubic.easeInOut',
      });
    });

    // Create 3 lines for a menu bar
    const lineHeight = 5;
    const lineWidth = 30;
    const lineSpacing = 5;
    for (let i = 0; i < 3; i++) {
      this.add.rectangle(20, 30 + (lineHeight + lineSpacing) * i, lineWidth, lineHeight, 0x000000);
    }

    // Add menu image, but hide it initially
    const menuImage = this.add.image(-500, centerY, 'menu').setScale(0.3);
    menuImage.setDepth(1);

    this.menuOpen = false;


    // Show + hide menu when menu bar is clicked
    this.input.on('pointerdown', (pointer) => {
      const cornerArea = 100;
      if (pointer.x < cornerArea && pointer.y < cornerArea) {
        if (!this.menuOpen) {
          this.tweens.add({
            targets: menuImage,
            x: menuImage.width / 2 - 200,
            duration: 300,
            ease: 'Cubic.easeOut',
          });
          this.menuOpen = true;
        } else {
          this.tweens.add({
            targets: menuImage,
            x: -menuImage.width / 2,
            duration: 300,
            ease: 'Cubic.easeIn',
          });
          this.menuOpen = false;
        }
      }
    });
  }

  update() {
    // Update objects for SceneC
  }
}


const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [SceneA, SceneB, SceneC],
  audio: {
    disableWebAudio: true
  }
};

const game = new Phaser.Game(config);

