import Bootloader from "./scenes/Bootloader.js"

const config = {

    type: Phaser.AUTO,
    pixelArt: true,
    backgroundColor: "#70b3ff", 

    scale: { 
    parent: "contenedor", 
    width: 1900, 
    height: 950, 
    
},
    scene: [Bootloader]
}
const game = new Phaser.Game(config);