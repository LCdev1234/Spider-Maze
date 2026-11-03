import Phaser from "phaser"

export default class TutorialScene extends Phaser.Scene {
    constructor(){
        super("TutorialScene")
    }
    create(){
        this.input.setDefaultCursor('default')

        this.textBackground = this.add.rectangle(20, 20, 400, 200, 0x303030, 1)
        this.textBackground.setOrigin(0, 1)

        this.text = this.add.text(
            20, 20, "Use arrow keys to move around", 
            {
                fontFamily: "Comic Sans MS",
                fontSize: "40px",
                color: "#ffffff",
                wordWrap:{
                    width: 300,
                    useAdvancedWrap: true
                },
                align: "center"
            }
        )
        this.text.setOrigin(0, 0)

        this.next = this.add.text(
            0, 0, "Press (Space) to continue",
            {
                fontFamily: "Arial",
                fontSize: "36px",
                color: "#ffffff",
            }
        )
        this.next.setOrigin(1,1)

        this.instructions = [
            "Use arrow keys to move around",
            "Use up arrow key to jump",
            "While sliding down a wall, press up arrow again to jump again",
            "Press space to merge into the walls for 3 seconds (You must be on the floor to use this ability)",
            "While merged use arrow keys to move",
            "While merged inside the walls press space again to exit early",
            "The number in the bottom left corner shows the cooldown before you can use the merge ability again",
            "Your objective is to find the white orb in the maze, but beware of the spider!!"
        ]
        this.actualInstruction = 0
        this.key = this.input.keyboard.addKeys({
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            enter: Phaser.Input.Keyboard.KeyCodes.ENTER
        })
    }
    update(){
        let width = this.scale.width
        let height = this.scale.height

        this.textBackground.setPosition(20, height-20)
        this.textBackground.setSize(width-40, 200)

        this.text.setText(this.instructions[this.actualInstruction])
        this.text.setPosition(20, height-190)
        this.text.setFixedSize(width-40, 200)
        this.text.setWordWrapWidth(width-80)

        this.next.setPosition(width-30, height-30-200)

        if(Phaser.Input.Keyboard.JustDown(this.key.space) || Phaser.Input.Keyboard.JustDown(this.key.enter)){
            if(this.actualInstruction < this.instructions.length-1){
                this.actualInstruction++
            }else{
                this.scene.stop()
                this.scene.resume("scene-game")
            }
        }
    }
}