class Bootloader extends Phaser.Scene {
    constructor() {
        super({ key: "Bootloader" });
    }

    preload() {
        console.log("Cargando assets...");

     this.load.image("ola", "assets/ola.png");   

    this.load.image("pez1", "assets/pez1.png");
    this.load.image("pez2", "assets/pez2.png");

    }

    create() {
        this.scene.start("MainScene");
    }
}

export default Bootloader;
