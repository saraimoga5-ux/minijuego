let ropesObj = [];
let buttonsObj = [];
let dropZones = [];
let ringSprites = [];

const GAME_WIDTH = 1500;
const GAME_HEIGHT = 1000;

const level = {
    topY: 40,
    topXs: [450, 650, 850, 1050],
    bottomY: 850,
    bottomXs: [550, 750, 950, 1150]
};

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: "#000000",
    parent: "contenedor",
    scene: { preload: preload, create: create, update: update }
};

new Phaser.Game(config);

function preload() {
    this.load.image("fondo", "assets/fondo (2).png");

    // Cuerdas
    this.load.image("cuerda1", "assets/cuerda1.png");
    this.load.image("cuerda2", "assets/cuerda2.png");
    this.load.image("cuerda3", "assets/cuerda3.png");
    this.load.image("cuerda4", "assets/cuerda4.png");

    // Botones
    this.load.image("boton1", "assets/boton1.png");
    this.load.image("boton2", "assets/boton2.png");
    this.load.image("boton3", "assets/boton3.png");
    this.load.image("boton4", "assets/boton4.png");

    // Anillos
    this.load.image("anillo", "assets/anillo.png");
}

function create() {
    // Fondo
    const fondo = this.add.image(0, 0, "fondo").setOrigin(0, 0);
    fondo.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    const ropeImages = ["cuerda1", "cuerda2", "cuerda3", "cuerda4"];
    const buttonImages = ["boton1", "boton2", "boton3", "boton4"];
    const ropeColors = [0xff4d4d, 0x3a8cff, 0x4dff4d, 0xffd54f];

    // Crear zonas / anillos
    for (let i = 0; i < 4; i++) {
        const x = level.bottomXs[i];
        const y = level.bottomY;

        const zone = this.add.zone(x, y, 100, 100).setName("zona" + (i + 1))
            .setRectangleDropZone(100, 100);
        dropZones.push(zone);

        const ring = this.add.image(x, y, "anillo").setScale(0.5);
        ringSprites.push(ring);
    }

    // Zona extra a la izquierda
    const extraZone = this.add.zone(400, level.bottomY, 100, 100)
        .setName("zonaExtra").setRectangleDropZone(100, 100);
    this.add.image(400, level.bottomY, "anillo").setScale(0.5);

    // Crear botones y cuerdas
    for (let i = 0; i < 4; i++) {
        // Posición inicial aleatoria de botones (independientes)
        const x = Phaser.Math.Between(level.bottomXs[i] - 150, level.bottomXs[i] + 150);
        const y = Phaser.Math.Between(level.bottomY + 50, level.bottomY + 150);

        const btn = this.add.image(x, y, buttonImages[i])
            .setOrigin(0.5, 1)
            .setScale(0.4)
            .setInteractive({ draggable: true });
        btn.setName("pieza" + (i + 1));
        btn.assignedColor = ropeColors[i];
        buttonsObj.push(btn);

        // Cuerda sprite
        const rope = this.add.image(level.topXs[i], level.topY, ropeImages[i])
            .setOrigin(0.5, 0)
            .setScale(0.4, 1);
        rope.targetBtn = btn;
        ropesObj.push(rope);
    }

    // Drag de botones
    this.input.on("drag", (pointer, obj, dragX, dragY) => {
        obj.x = Phaser.Math.Clamp(dragX, 0, GAME_WIDTH);
        obj.y = Phaser.Math.Clamp(dragY, 0, GAME_HEIGHT);
    });

    // Drop de botones
    this.input.on("drop", (pointer, pieza, zona) => {
        const correcta = zona.name === pieza.name.replace("pieza", "zona") || zona.name === "zonaExtra";
        if (correcta) {
            pieza.x = zona.x;
            pieza.y = zona.y;
            pieza.input.enabled = false;
            pieza.setDepth(10);
        }
        // Si no es correcta, el botón se queda donde se soltó
    });

    // Mensaje
    this.msg = this.add.text(GAME_WIDTH / 2, 30, "Organiza las cuerdas", {
        fontSize: "28px", color: "#ffffff", fontStyle: "bold", stroke: "#000", strokeThickness: 4
    }).setOrigin(0.5, 0);
}

function update() {
    // Actualizar cuerdas para apuntar a los botones
    ropesObj.forEach(rope => {
        const btn = rope.targetBtn;

        const dx = btn.x - rope.x;
        const dy = btn.y - rope.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        rope.displayHeight = dist;
        rope.rotation = Math.atan2(dy, dx) - Math.PI / 2;
    });

    // Comprobar cruces y actualizar mensaje
    if (checkCrossing(buttonsObj)) {
        this.msg.setText("Las cuerdas están enredadas");
        this.msg.setColor("#ffd54f");
    } else {
        this.msg.setText("Organiza las cuerdas");
        this.msg.setColor("#ffffff");
    }
}

// Detecta si alguna cuerda cruza a otra
function checkCrossing(buttons) {
    const segments = [];
    buttons.forEach((btn, i) => {
        const start = { x: ropesObj[i].x, y: ropesObj[i].y };
        const end = { x: btn.x, y: btn.y };
        segments.push({ a: start, b: end });
    });

    for (let i = 0; i < segments.length; i++) {
        for (let j = i + 1; j < segments.length; j++) {
            if (segmentsIntersect(segments[i].a, segments[i].b, segments[j].a, segments[j].b)) return true;
        }
    }
    return false;

    function segmentsIntersect(p1, q1, p2, q2) {
        const o1 = orientation(p1, q1, p2);
        const o2 = orientation(p1, q1, q2);
        const o3 = orientation(p2, q2, p1);
        const o4 = orientation(p2, q2, q1);
        if (o1 !== o2 && o3 !== o4) return true;
        if (o1 === 0 && onSegment(p1, p2, q1)) return true;
        if (o2 === 0 && onSegment(p1, q2, q1)) return true;
        if (o3 === 0 && onSegment(p2, p1, q2)) return true;
        if (o4 === 0 && onSegment(p2, q1, q2)) return true;
        return false;
    }
    function orientation(p, q, r) {
        const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (Math.abs(val) < 1e-6) return 0;
        return val > 0 ? 1 : 2;
    }
    function onSegment(p, q, r) {
        return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
               q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
    }
}
