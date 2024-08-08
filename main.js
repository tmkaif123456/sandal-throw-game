const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let score = 0;
let scoreText;
let level = 1;
let targetSpeed = 100;
let sandal;
let aim;
let targets;
let hitSound;

function preload() {
    this.load.image('sandal', 'assets/sandal.jpg');
    this.load.image('aim', 'assets/aim.png');
    this.load.audio('hitSound', 'assets/sound.mp3');
    
    // Load target images
    const targetNames = ['arafath', 'atika_and_saddam', 'hasina', 'kawa_akder', 'manik', 'Nowfel', 'polok', 'shakib', 'sumon', 'tarek'];
    targetNames.forEach(name => {
        this.load.image(name, `assets/${name}.jpg`);
    });
}

function create() {
    // Create fixed aim in the center
    aim = this.add.image(400, 300, 'aim').setDepth(1); // Ensure aim is on top layer
    
    // Create sandal, initially hidden
    sandal = this.physics.add.image(aim.x, aim.y, 'sandal').setVisible(false).setDepth(2);

    // Create a group of targets
    targets = this.physics.add.group();
    createTargets();

    // Score text
    scoreText = this.add.text(16, 16, `Score: ${score}`, { fontSize: '32px', fill: '#000' });

    // Add sound
    hitSound = this.sound.add('hitSound');

    // Input event
    this.input.on('pointerdown', throwSandal, this);
}

function createTargets() {
    const targetNames = ['arafath', 'atika_and_saddam', 'hasina', 'kawa_akder', 'manik', 'Nowfel', 'polok', 'shakib', 'sumon', 'tarek'];
    targetNames.forEach(name => {
        let target = targets.create(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), name);
        target.setVelocity(Phaser.Math.Between(-targetSpeed, targetSpeed), Phaser.Math.Between(-targetSpeed, targetSpeed));
        target.setCollideWorldBounds(true);
        target.setBounce(1);
    });
}

function update() {
    // Continuously move targets around the screen
    targets.children.iterate(function (target) {
        if (target.x < 0 || target.x > 800 || target.y < 0 || target.y > 600) {
            target.setVelocity(Phaser.Math.Between(-targetSpeed, targetSpeed), Phaser.Math.Between(-targetSpeed, targetSpeed));
        }
    });
}

function throwSandal(pointer) {
    // Check if a target is within the aim when clicked
    let hit = false;
    targets.children.iterate((target) => {
        if (Phaser.Geom.Intersects.RectangleToRectangle(aim.getBounds(), target.getBounds())) {
            hit = true;
            animateSandal(target);
        }
    });

    // If no target is hit, just show the sandal animation
    if (!hit) {
        animateSandal(null);
    }
}

function animateSandal(target) {
    sandal.setVisible(true);
    sandal.setPosition(aim.x, aim.y);

    // If there's a target, animate the sandal towards it
    if (target) {
        this.tweens.add({
            targets: sandal,
            x: target.x,
            y: target.y,
            duration: 300,
            onComplete: () => {
                sandal.setVisible(false);
                hitTarget(target);
            }
        });
    } else {
        // If no target is hit, just fade out the sandal
        this.time.delayedCall(500, () => {
            sandal.setVisible(false);
        });
    }
}

function hitTarget(target) {
    target.disableBody(true, true);
    score += 10;
    scoreText.setText(`Score: ${score}`);
    hitSound.play();

    // Check if all targets are hit to level up
    if (targets.countActive(true) === 0) {
        levelUp();
    }
}

function levelUp() {
    level += 1;
    targetSpeed += 50;

    // Recreate targets with increased speed
    createTargets();

    // Add level text
    this.add.text(16, 50, `Level: ${level}`, { fontSize: '32px', fill: '#000' });
}

