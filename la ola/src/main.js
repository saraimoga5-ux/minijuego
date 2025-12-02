import Bootloader from "./scenes/Bootloader.js"
import MainScene from "./scenes/MainScene.js";


const config = {

    type: Phaser.AUTO,
    pixelArt: true,
    backgroundColor: "#70b3ff", 

    scale: { 
    parent: "contenedor", 
    width: 1500, 
    height: 700, 
    
},
    scene: [Bootloader, MainScene],
}
const game = new Phaser.Game(config);