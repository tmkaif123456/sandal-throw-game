const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ffffff', // White background
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
let targetSpeed = 100; // Initial speed of moving targets
let sandal;
let aim;

function preload() {
    this.load.image('arafath', 'assets/arafath.jpg');
    this.load.image('atika_and_saddam', 'assets/atika_nd_saddam.jpg');
    this.load.image('hasina', 'assets/hasina.jpg');
    this.load.image('kawa_akder', 'assets/kawa akder.jpg');
    this.load.image('manik', 'assets/manik.jpg');
    this.load.image('Nowfel', 'assets/Nowfel.jpg');
    this.load.image('polok', 'assets/polok.jpg');
    this.load.image('shakib', 'assets/shakib.jpg');
    this.load.image('sumon', 'assets/sumon.jpg');
    this.load.image('tarek', 'assets/tarek.jpg');
    this.load.image('sandal', 'assets/sandal.jpg');
    this.load.image('aim', 'assets/aim.png'); // Assuming you have an aim image
    this.load.audio('hitSound', 'assets/sound.mp3');
}

function create() {
    // Create aim in the center of the screen
    aim = this.add.image(400, 300, 'aim');

    // Create sandal, initially hidden
    sandal = this.physics.add.image(aim.x, aim.y, 'sandal').setVisible(false);

    // Create targets group
    this.targets = this.physics.add.group({
        key: ['atika_and_saddam', 'hasina', 'kawa_akder', 'manik', 'Nowfel', 'polok', 'shakib', 'sumon', 'tarek'],
        frameQuantity: 1,
        setXY: { x: Phaser.Math.Between(100, 700), y: Phaser.Math.Between(50, 550) },
        velocityX: Phaser.Math.Between(-targetSpeed, targetSpeed),
        velocityY: Phaser.Math.Between(-targetSpeed, targetSpeed),
        collideWorldBounds: true,
        bounceX: 1,
        bounceY: 1
    });

    // Add collision detection
    this.physics.add.overlap(sandal, this.targets, hitTarget, null, this);

    // Input event
    this.input.on('pointerdown', throwSandal, this);

    // Score and level text
    scoreText = this.add.text(16, 16, `Score: ${score}`, { fontSize: '32px', fill: '#000' });
    this.add.text(16, 50, `Level: ${level}`, { fontSize: '32px', fill: '#000' });

    // Sound
    this.hitSound = this.sound.add('hitSound');
}

function update() {
    this.targets.children.iterate(function (target) {
        // Move targets and check for bounds
        if (target.x < 0 || target.x > 800 || target.y < 0 || target.y > 600) {
            target.setVelocityX(Phaser.Math.Between(-targetSpeed, targetSpeed));
            target.setVelocityY(Phaser.Math.Between(-targetSpeed, targetSpeed));
        }
    });
}

function throwSandal(pointer) {
    // Hide the sandal at first
    sandal.setVisible(false);

    // If an image is within the aim when clicked
    let hit = false;
    this.targets.children.iterate(function (target) {
        if (Phaser.Geom.Intersects.RectangleToRectangle(aim.getBounds(), target.getBounds())) {
            hit = true;
            hitTarget(sandal, target);
        }
    });

    // If no hit, the sandal just appears and fades
    if (!hit) {
        sandal.setPosition(pointer.x, pointer.y).setVisible(true);
        this.time.delayedCall(500, function () {
            sandal.setVisible(false);
        }, [], this);
    }
}

function hitTarget(sandal, target) {
    // Play hit sound
    this.hitSound.play();

    // Disable target
    target.disableBody(true, true);

    // Update score
    score += 10;
    scoreText.setText(`Score: ${score}`);

    // Check if all targets are hit to level up
    if (this.targets.countActive(true) === 0) {
        levelUp();
    }
}

function levelUp() {
    level += 1;
    targetSpeed += 50; // Increase target speed

    // Reactivate targets and reset positions
    this.targets.children.iterate(function (target) {
        target.enableBody(true, Phaser.Math.Between(100, 700), Phaser.Math.Between(50, 550), true, true);
        target.setVelocity(Phaser.Math.Between(-targetSpeed, targetSpeed), Phaser.Math.Between(-targetSpeed, targetSpeed));
    });

    this.add.text(16, 50, `Level: ${level}`, { fontSize: '32px', fill: '#000' });
}

