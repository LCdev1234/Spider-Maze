import Phaser from "phaser"

export default class DeadScene extends Phaser.Scene {
    constructor(){
        super("DeadScene")
    }
    preload(){
        this.load.font("Nosifer", "./assets/Nosifer-Regular.ttf")
    }
    create(){
        this.input.setDefaultCursor('default')
        this.title = this.add.text(0, 0, "You have died", {
            fontFamily:"Nosifer",
            fontSize:"64px",
            color:"#ffffff"
        })

        this.button = this.add.container(200,200)
        this.button_background = this.add.rectangle(0, 0, 100, 50, 0xffffff).setInteractive()
        this.button_text = this.add.text(0, 0, "Respawn", {
            fontFamily:"Arial",
            fontSize:"32px",
            color:"#000000"
        })
        this.button_text.setOrigin(0.5)
        this.button.add(this.button_background)
        this.button.add(this.button_text)

        //User interaction
        this.button_background.on('pointerdown', () => {
            this.button.setScale(0.9, 0.9)
            this.scene.stop()
            this.input.setDefaultCursor('default')
            this.scene.resume("scene-game")
        })
        this.button_background.on('pointerover', () => {
            this.input.setDefaultCursor('pointer')
            this.button_background.setFillStyle(0xc4c4c4)
        })
        this.button_background.on('pointerout', () => {
            this.input.setDefaultCursor('default')
            this.button_background.setFillStyle(0xffffff)
        })

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }
    update(){
        let width = this.scale.width
        let height = this.scale.height

        this.title.setPosition(width/2 - this.title.width/2, height/2 - height/3 + 30)
        this.button.setPosition(width/2, height/2 - this.title.y + this.title.height + 205)
        this.button_background.setSize(width/3-20, this.button_text.height+20)
    }
}