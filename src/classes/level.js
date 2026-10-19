
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
    }
}