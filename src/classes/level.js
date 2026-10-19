import {RigidBody, Rectangle} from "./objects"

export default class Level {
    constructor(code) {
        this.blocks = []
        let line = []
        for(let block of code) {
            if(block != "\n") {
                if(block != "\r"){
                    if(block == 1) line.push(1)
                    else line.push(0)
                }
            }else {
                this.blocks.push(line)
                line = []
            }
        }
        if(line.length != 0) this.blocks.push(line)

        this.bodies = []
        for(let y = 0; y < this.blocks.length; y++){
            let line = []
            for(let x = 0; x < this.blocks[y].length; x++){
                let squareLevel = new Rectangle(x*50, y*50, 50, 50, RigidBody.STATE.SOLID)
                line.push(squareLevel)
            }
            this.bodies.push(line)
        }
    }
}