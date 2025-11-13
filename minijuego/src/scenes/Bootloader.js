// bootloader.js
class Bootloader extends Phaser.Scene {
    constructor() {
        super({ key: "Bootloader" });
    }



    preload() {console.log("Escena Bootloader");

    this.load.image("console", "assets/console.png");
    this.load.image("gato", "assets/gato.png");
    this.load.image("pez1", "assets/pez1.png");
    this.load.image("pez2", "assets/pez2.png");
    // Carga de sonido
    this.load.audio("fondo", "assets/sonido_burbujas.mp3");
  
    
    }


    create() {
    const { width, height } = this.sys.game.config;
    

    // Fondo de la consola
    const consola = this.add.image(width / 2, height / 2, "console").setOrigin(0.5);
    consola.setScale(1.4); // 🔹 Puedes cambiar este número para agrandar la consola

    // Coordenadas del área de la "pantalla azul" (ajústalas según tu imagen)
    const screenX = width * 0.35;
    const screenY = height * 0.1;
    const screenWidth = width * 0.26;
    const screenHeight = height * 0.35;

    

    // Dibujar área invisible (ayuda para depurar)
    // const debug = this.add.graphics();
    // debug.lineStyle(2, 0xff0000);
    // debug.strokeRect(screenX, screenY, screenWidth, screenHeight);
    // Añadir gato (decorativo)
    this.add.image(width * 0.40, height * 0.42, "gato").setScale(0.7);

   // Crear grupo de peces
  this.fishes = [];
  this.gameOver = false;

  // 🔹 Crear 1 pez1 y 4 pez2 usando la misma estructura
  for (let i = 0; i < 5; i++) {
    const fishKey = i === 0 ? "pez1" : "pez2"; // solo el primero es pez1

    const fish = this.add.sprite(
      Phaser.Math.Between(screenX + 50, screenX + screenWidth - 50),
      Phaser.Math.Between(screenY + 50, screenY + screenHeight - 50),
      fishKey
    );

    fish.setScale(fishKey === "pez1" ? 0.9 : 0.8);
    fish.speedX = Phaser.Math.Between(80, 120) * (Math.random() < 0.5 ? 1 : -1);
    fish.speedY = Phaser.Math.Between(40, 70) * (Math.random() < 0.5 ? 1 : -1);
    fish.setFlipX(fish.speedX < 0);

    // Hacer los peces interactivos
    fish.setInteractive();

    // 🔹 Si el jugador hace clic en pez1 → gana
    fish.on("pointerdown", () => {
      if (this.gameOver) return; // evita hacer clic varias veces
      this.gameOver = true;

      if (fishKey === "pez1") {
        this.add.text(width / 2, height * 0.10, "🎉 ¡Atrapaste el pez correcto! 🎉", {
          fontSize: "28px",
          fill: "#ffffff",
          stroke: "#000000",
          strokeThickness: 5
        }).setOrigin(0.5);
      } else {
        this.add.text(width / 2, height * 0.10, " Ese no era el pez correcto", {
          fontSize: "28px",
          fill: "#ffffff",
          stroke: "#000000",
          strokeThickness: 5
        }).setOrigin(0.5);
      }

      // Detener movimiento de todos los peces
      this.fishes.forEach(f => {
        f.speedX = 0;
        f.speedY = 0;
      });
    });

    this.fishes.push(fish);
  }
   // Botón de reinicio
  const restartBtn = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 40, "°", {
    fontSize: "28px",
    fill: "#00ffff",
    backgroundColor: "#003366",
    padding: { x: 10, y: 10 }
  })
    .setOrigin(0.40 )
    .setInteractive({ useHandCursor: true })
    .on("pointerdown", () => {
      this.scene.restart(); // Reinicia la escena
    })
    .on("pointerover", () => restartBtn.setStyle({ fill: "#ffff00" }))
    .on("pointerout", () => restartBtn.setStyle({ fill: "#00ffff" }));



  // Guardar área azul
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


