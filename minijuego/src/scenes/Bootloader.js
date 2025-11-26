// bootloader.js
class Bootloader extends Phaser.Scene {
    constructor() {
        super({ key: "Bootloader" });
    }



    preload() {console.log("Escena Bootloader");

    this.load.image("console", "assets/console.png");
    this.load.image("gato", "assets/gato.png");



    // Pez normal (5 frames)
    this.load.image("pez1", "assets/pez 1.png");
    this.load.image("pez2", "assets/pez 2.png");
    this.load.image("pez3", "assets/pez 3.png");
    this.load.image("pez4", "assets/pez 4.png");
    this.load.image("pez5", "assets/pez 5.png");

    // Pez brillante (3 frames)
    this.load.image("pezb1", "assets/pezb1.png");
    this.load.image("pezb2", "assets/pezb2.png");
    this.load.image("pezb3", "assets/pezb3.png");

    }


    
create() {
    const { width, height } = this.sys.game.config;

    // 🟦 Animación del pez normal
    this.anims.create({
        key: "animPezNormal",
        frames: [
            { key: "pez1" },
            { key: "pez2" },
            { key: "pez3" },
            { key: "pez4" },
            { key: "pez5" },
        ],
        frameRate: 6,
        repeat: -1
    });

    // ✨ Animación del pez brillante
    this.anims.create({
        key: "animPezBrillante",
        frames: [
            { key: "pezb1" },
            { key: "pezb2" },
            { key: "pezb3" },
        ],
        frameRate: 6,
        repeat: -1
    });

    // 🎮 Consola principal
    const consola = this.add.image(width / 2, height / 2, "console")
        .setOrigin(0.5)
        .setScale(1.8)   // 🔹 Tamaño corregido
        .setDepth(2);    // 🔹 Debajo de todo lo demás

    // 🐱 Gato decorativo
    this.add.image(width * 0.40, height * 0.42, "gato")
        .setScale(0.7)
        .setDepth(2);    // Sobre la consola

    // 📺 Área de la pantalla azul
    const screenX = width * 0.35;
    const screenY = height * 0.10;
    const screenWidth = width * 0.26;
    const screenHeight = height * 0.35;

    // 🐟 Crear peces
    this.fishes = [];
    this.gameOver = false;

    for (let i = 0; i < 5; i++) {

        // SOLO el pez 0 es normal (pez1 animPezNormal)
        const isNormal = (i == 0);

        const fishKey = isNormal ? "pez1" : "pezb1";
        const animKey = isNormal ? "animPezNormal" : "animPezBrillante";

        const fish = this.add.sprite(
            Phaser.Math.Between(screenX + 50, screenX + screenWidth - 50),
            Phaser.Math.Between(screenY + 50, screenY + screenHeight - 50),
            fishKey
        )
            .setDepth(3)  // Sobre consola y gato
            .setScale(isNormal ? 0.1 : 0.30);

        fish.setFlipX(false); // 🔹 Corregir orientación inicial

        // iniciar animación
        fish.play(animKey);
        fish.setScale(fishKey === "pezb1" ? 0.1 : 0.2); 

        // Velocidad aleatoria
        fish.speedX = Phaser.Math.Between(60, 120) * (Math.random() < 0.5 ? 1 : -1);
        fish.speedY = Phaser.Math.Between(40, 70) * (Math.random() < 0.5 ? 1 : -1);

        fish.setInteractive();

        // Evento de clic
        fish.on("pointerdown", () => {
            if (this.gameOver) return;

            this.gameOver = true;

            if (isNormal) {
                this.add.text(width / 2, height * 0.10, "🎉 ¡Atrapaste el pez correcto! 🎉", {
                    fontSize: "28px",
                    fill: "#ffffff",
                    stroke: "#000",
                    strokeThickness: 5
                }).setOrigin(0.5).setDepth(10);
            } else {
                this.add.text(width / 2, height * 0.10, "Ese no era el pez correcto", {
                    fontSize: "28px",
                    fill: "#ffffff",
                    stroke: "#000",
                    strokeThickness: 5
                }).setOrigin(0.5).setDepth(10);
            }

            // Detener todos los peces
            this.fishes.forEach(f => {
                f.speedX = 0;
                f.speedY = 0;
            });
        });

        this.fishes.push(fish);
    }

    // 🔄 Botón de reinicio
    const restartBtn = this.add.text(width / 2, height / 2 + 80, "↻ Reiniciar", {
        fontSize: "28px",
        fill: "#00ffff",
        backgroundColor: "#003366",
        padding: { x: 15, y: 10 }
    })
        .setOrigin(0.5)
        .setDepth(10)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => this.scene.restart())
        .on("pointerover", () => restartBtn.setStyle({ fill: "#ffff00" }))
        .on("pointerout", () => restartBtn.setStyle({ fill: "#00ffff" }));

    // Guardar la zona azul
    this.gameZone = { x: screenX, y: screenY, width: screenWidth, height: screenHeight };
}



     update(time, delta) {
    const zone = this.gameZone;

    // Mover peces
    this.fishes.forEach((fish) => {
      fish.x += (fish.speedX * delta) / 1000;
      fish.y += (fish.speedY * delta) / 1000;

      // Rebotar dentro del área azul
      if (fish.x < zone.x + 30 || fish.x > zone.x + zone.width - 30) {
        fish.speedX *= -1;
        fish.setFlipX(fish.speedX < 0);
      }
      if (fish.y < zone.y + 30 || fish.y > zone.y + zone.height - 30) {
        fish.speedY *= -1;
      }
    });

   
  }
}
     

     

     

export default Bootloader;


