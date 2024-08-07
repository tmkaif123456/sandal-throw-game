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

function preload() {
    // Load images
    this.load.image('arafath', 'assets/arafath.jpg');
    this.load.image('atika_and_saddam', 'assets/atika_nd_saddam.jpg');
    this.load.image('hasina', 'assets/hasina.jpg');
    this.load.image('kawa_akder', 'assets/kawa akder.jpg');
    this.load.image('manik', 'assets/manik.jpg');
    this.load.image('Nowfel', 'assets/Nowfel.jpg');
    this.load.image('polok', 'assets/polok.jpg');
    this.load.image('sandal', 'assets/sandal.jpg');
    this.load.image('shakib', 'assets/shakib.jpg');
    this.load.image('sumon', 'assets/sumon.jpg');
    this.load.image('tarek', 'assets/tarek.jpg');
    // Load sound
    this.load.audio('hitSound', 'assets/sound.mp3'); // Ensure this path is correct
}

function create() {
    // Create sandal
    this.sandal = this.physics.add.image(400, 500, 'sandal');

    // Create targets
    this.targets = this.physics.add.group();
    this.targets.create(100, 100, 'atika_and_saddam');
    this.targets.create(200, 150, 'hasina');
    this.targets.create(300, 200, 'kawa_akder');
    this.targets.create(400, 250, 'manik');
    this.targets.create(500, 300, 'Nowfel');
    this.targets.create(600, 350, 'polok');
    this.targets.create(700, 400, 'shakib');
    this.targets.create(800, 450, 'sumon');
    this.targets.create(900, 500, 'tarek');

    // Add collision detection
    this.physics.add.overlap(this.sandal, this.targets, hitTarget, null, this);

    // Input events
    this.input.on('pointerdown', throwSandal, this);

    // Add sound
    this.gameSound = this.sound.add('hitSound');
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    // Start audio context
    const startAudioButton = document.getElementById('startAudio');
    if (startAudioButton) {
        startAudioButton.addEventListener('click', () => {
            this.gameSound.context.resume().then(() => {
                console.log('Audio context resumed');
            });
        });
    } else {
        console.error('Start button not found');
    }
}

function update() {
    this.targets.children.iterate(function (child) {
        child.x += 1;
        if (child.x > 800) {
            child.x = 0;
        }
    });
}

function throwSandal(pointer) {
    this.physics.moveTo(this.sandal, pointer.x, pointer.y, 300);
}

function hitTarget(sandal, target) {
    target.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
    this.gameSound.play(); // Play sound effect

    // Reappear target after 2 seconds
    this.time.delayedCall(2000, function() {
        target.setAlpha(1);
        target.setPosition(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600));
        target.setActive(true).setVisible(true);
    });
}
