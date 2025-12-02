const config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 1000,
    backgroundColor: "#ffffffff",
    scene: {
        preload: preload,
        create: create
    }
};
new Phaser.Game(config);


function preload()  {console.log;

    this.load.image("fondo huellitas", "assets/fondo huellitas.png");
    this.load.image("pieza1", "assets/pieza1.png");
    this.load.image("pieza2", "assets/pieza2.png");
    this.load.image("pieza3", "assets/pieza3.png");
    this.load.image("pieza4", "assets/pieza4.png");
}
function create() {   

const img = this.add.image(0, 0, "fondo huellitas").setOrigin(0);

// Escalar a 1200 x 900
img.setDisplaySize(1500, 1000);



  const PIEZA_WIDTH = 329;
    const PIEZA_HEIGHT = 303;

    // Contador
    this.piezasCorrectas = 0;

    // CREAR PIEZAS
    
    const pieza1 = this.add.image(150, 600, "pieza1").setInteractive();
    const pieza2 = this.add.image(350, 600, "pieza2").setInteractive();
    const pieza3 = this.add.image(550, 600, "pieza3").setInteractive();
    const pieza4 = this.add.image(750, 600, "pieza4").setInteractive();

    pieza1.name = "pieza1";
    pieza2.name = "pieza2";
    pieza3.name = "pieza3";
    pieza4.name = "pieza4";

    this.input.setDraggable([pieza1, pieza2, pieza3, pieza4]);

    // ZONAS CORRECTAS AJUSTADAS AL PIXEL
   
    const zonas = [
        { name: "zona1", x: 500, y: 300 },
        { name: "zona2", x: 500 + PIEZA_WIDTH, y: 300 },
        { name: "zona3", x: 500, y: 300 + PIEZA_HEIGHT },
        { name: "zona4", x: 500 + PIEZA_WIDTH, y: 300 + PIEZA_HEIGHT }
    ];

    zonas.forEach(z => {

        // Zona que detecta el drop
        const zone = this.add.zone(z.x, z.y, PIEZA_WIDTH, PIEZA_HEIGHT)
            .setRectangleDropZone(PIEZA_WIDTH, PIEZA_HEIGHT)
            .setName(z.name);

        // Cuadro verde exacto
        this.add.graphics()
            .lineStyle(3, 0x00ff00)
            .strokeRect(
                z.x - PIEZA_WIDTH / 2,
                z.y - PIEZA_HEIGHT / 2,
                PIEZA_WIDTH,
                PIEZA_HEIGHT
            );
    });

    // EVENTOS DE ARRASTRE

    // Mover pieza mientras la arrastran
    this.input.on("drag", (pointer, obj, dragX, dragY) => {
        obj.x = dragX;
        obj.y = dragY;
    });

    // Cuando sueltan la pieza en una zona
    this.input.on("drop", (pointer, pieza, zona) => {

        const correcta =
            (pieza.name === "pieza1" && zona.name === "zona1") ||
            (pieza.name === "pieza2" && zona.name === "zona3") ||
            (pieza.name === "pieza3" && zona.name === "zona2") ||
            (pieza.name === "pieza4" && zona.name === "zona4");

        if (correcta) {

            pieza.x = zona.x;
            pieza.y = zona.y;

            pieza.input.enabled = false;

            this.piezasCorrectas++;

            mostrarMensaje.call(this, "¡Pieza correcta!");

            if (this.piezasCorrectas === 4) {
                mostrarMensaje.call(this, "¡Rompecabezas completado!");
            }

        } else {
            mostrarMensaje.call(this, "Esa no va ahí");
        }
    });

    // Soltó fuera de cualquier zona
    this.input.on("dragend", (pointer, pieza, dropped) => {
        if (!dropped) {
            pieza.x += 0;
            pieza.y += 0;
        }
    });

}

// FUNCIÓN PARA MOSTRAR MENSAJES

function mostrarMensaje(texto) {
    const msg = this.add.text(750, 50, texto, {
        font: "32px Arial",
        fill: "#000",
        stroke: "#fff",
        strokeThickness: 4
    }).setOrigin(0.5);

    this.time.delayedCall(1500, () => {
        msg.destroy();
    });
}