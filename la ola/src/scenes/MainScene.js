class MainScene extends Phaser.Scene {

constructor() { super('MainScene'); }



create() {
this.w = this.sys.game.config.width;
this.h = this.sys.game.config.height;


this.cameras.main.setBackgroundColor('#7cd2ff');


this.texto = this.add.text(this.w/2, 20, "", {
fontSize: "28px",
color: "#003"
}).setOrigin(0.5, 0);


this.cantidad = 4;
this.tiempoMarea = 1600;


this.iniciarRonda();
}


iniciarRonda() {
this.texto.setText("");


if (this.peces) this.peces.clear(true, true);
this.peces = this.add.group();


const posDiff = Phaser.Math.Between(0, this.cantidad - 1);
const espacio = (this.w - 160) / (this.cantidad - 1);


for (let i = 0; i < this.cantidad; i++) {
const key = i === posDiff ? "pez1" : "pez2";
const pez = this.add.image(80 + i * espacio, this.h/2, key).setScale(0.9);
pez.setInteractive({ cursor: 'pointer' });
pez._diferente = i === posDiff;
pez.on('pointerdown', () => this.seleccionar(pez));
this.peces.add(pez);
}



// Crear marea
this.marea = this.add.image(0, 0, "ola").setOrigin(0,0);
this.marea.displayWidth = this.w;
this.marea.displayHeight = this.h;
this.marea.x = this.w;


this.mareaTween = this.tweens.add({
targets: this.marea,
x: -this.w,
duration: this.tiempoMarea,
ease: 'Linear',
onComplete: () => this.perdio()
});
}


seleccionar(pez) {
if (!this.mareaTween.isPlaying()) return;


this.mareaTween.stop();


if (pez._diferente) {
this.texto.setColor('#0a3');
this.texto.setText('¡Correcto! 🐟✨');
} else {
this.texto.setColor('#a00');
this.texto.setText('Ese no era 😭');
}


this.time.delayedCall(1200, () => this.iniciarRonda());
}

perdio() {
    this.texto.setColor('#a00');
    this.texto.setText('¡La marea te alcanzó! ❌');

    this.time.delayedCall(1500, () => {
        this.iniciarRonda();
    });
}

}
window.MainScene = MainScene;
export default MainScene;