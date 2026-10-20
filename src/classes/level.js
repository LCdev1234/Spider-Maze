import {RigidBody, Rectangle} from "./objects"
import RenderObject from "./render"
import {Render} from "./render"

export default class Level {
    constructor(code) {
        const tile_size = 40

        this.tiles = []
        let line = []
        for(let tile of code) {
            if(tile != "\n") {
                if(tile != "\r"){
                    if(tile == 1) line.push(1)
                    else line.push(0)
                }
            }else {
                this.tiles.push(line)
                line = []
            }
        }
        if(line.length != 0) this.tiles.push(line)

        this.bodies = []
        for(let y = 0; y < this.tiles.length; y++){
            let line = []
            for(let x = 0; x < this.tiles[y].length; x++){
                let squareLevel = new Rectangle(x*tile_size, y*tile_size, tile_size, tile_size, RigidBody.STATE.SOLID, this.tiles[y][x])
                line.push(squareLevel)
            }
            this.bodies.push(line)
        }

        this.sprite = Render.scene.add.rectangle(
            0,
            0,
            tile_size,
            tile_size,
            0xffffff
        )
        this.tile_sprites = []
        for(let body of this.bodies.flat()){
            this.tile_sprites.push(this.sprite, 0, 0, body)
        }
    }
}