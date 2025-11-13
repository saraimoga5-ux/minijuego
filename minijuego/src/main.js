import Bootloader from "./scenes/Bootloader.js"

const config = {

    type: Phaser.AUTO,
    pixelArt: true,
    backgroundColor: "#70b3ff", 

    scale: { 
    parent: "contenedor", 
    width: 1500, 
    height: 700, 
    
},
    scene: [Bootloader]
}
const game = new Phaser.Game(config);