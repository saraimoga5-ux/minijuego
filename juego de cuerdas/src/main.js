let ropes = [];
let selectedRope = null;
let dragPoint = null;
 

const config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 1000,
    backgroundColor: "#f6f5f5", // fondo gris clarito
    parent: "contenedor",
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

new Phaser.Game(config);

function preload() { this.load.image("fondo (3)", "assets/fondo (3).png");
     
    
    // Aquí podrías cargar imágenes si quieres
}

function create() {
      
        const fondo = this.add.image(0, 0, "fondo (3)").setOrigin(0, 0);
    fondo.setDisplaySize(1500, 1000)
    const ropeData = [
        { start: { x: 550, y: 100 }, end: { x: 700, y: 500 }, color: 0x00ff00 },
        { start: { x: 100, y: 500 }, end: { x: 700, y: 100 }, color: 0x0000ff },
        { start: { x: 850, y: 50 }, end: { x: 400, y: 550 }, color:  0xff0000 },
    ]

    ropeData.forEach(data => {
        let line = this.add.line(
            0, 0,
            data.start.x, data.start.y,
            data.end.x, data.end.y,
            data.color,
            1
        ).setOrigin(0,0).setLineWidth(6);
        line.start = { ...data.start };
        line.end = { ...data.end };
        ropes.push(line);
    });

    // Detectar clic y arrastre de extremos
    this.input.on('pointerdown', pointer => {
        ropes.forEach(r => {
            if (Phaser.Math.Distance.Between(pointer.x, pointer.y, r.start.x, r.start.y) < 15) {
                selectedRope = r;
                dragPoint = 'start';
            } else if (Phaser.Math.Distance.Between(pointer.x, pointer.y, r.end.x, r.end.y) < 15) {
                selectedRope = r;
                dragPoint = 'end';
            }
        });
    });

    this.input.on('pointerup', () => {
        selectedRope = null;
        dragPoint = null;
    });
}

function update() {
    if (selectedRope && dragPoint) {
        let pointer = this.input.activePointer;
        selectedRope[dragPoint].x = pointer.x;
        selectedRope[dragPoint].y = pointer.y;
        selectedRope.setTo(
            selectedRope.start.x, selectedRope.start.y,
            selectedRope.end.x, selectedRope.end.y
        );
    }

    // Verificar cruces
    if (!hasCrossings()) {
        if (!this.winText) {
            this.winText = this.add.text(300, 10, '¡Ganaste!', { font: '32px Arial', fill: '#ff0000' });
        }
    }
}

// Función para detectar cruces entre cuerdas
function hasCrossings() {
    for (let i = 0; i < ropes.length; i++) {
        for (let j = i + 1; j < ropes.length; j++) {
            if (lineIntersect(ropes[i].start, ropes[i].end, ropes[j].start, ropes[j].end)) {
                return true;
            }
        }
    }
    return false;
}

// Algoritmo simple de intersección de líneas
function lineIntersect(p1, p2, p3, p4) {
    const det = (p2.x - p1.x)*(p4.y - p3.y) - (p4.x - p3.x)*(p2.y - p1.y);
    if (det === 0) return false; // paralelas
    const t = ((p3.x - p1.x)*(p4.y - p3.y) - (p3.y - p1.y)*(p4.x - p3.x)) / det;
    const u = ((p3.x - p1.x)*(p2.y - p1.y) - (p3.y - p1.y)*(p2.x - p1.x)) / det;
    return t > 0 && t < 1 && u > 0 && u < 1;
}
