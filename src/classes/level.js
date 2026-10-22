import {RigidBody, Rectangle} from "./objects"
import RenderObject from "./render"
import {Render} from "./render"

export default class Level {
    static time = 0

    constructor(code) {
        this.tile_size = 40
        LevelRender.init(this.tile_size)

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
        this.tiles_width = Math.max(...this.tiles.map(tile => tile.length))
        this.tiles_height = this.tiles.length


        this.bodies = []
        for(let y = 0; y < this.tiles.length; y++){
            let line = []
            for(let x = 0; x < this.tiles[y].length; x++){
                let squareLevel = new Rectangle(x*this.tile_size, y*this.tile_size, this.tile_size, this.tile_size, RigidBody.STATE.SOLID, !this.tiles[y][x])
                line.push({object: squareLevel, x: x, y: y})
            }
            this.bodies.push(line)
        }

        this.tile_sprites = []
        for(let y = 0; y < this.tiles.length; y++){
            let line = []
            for(let x = 0; x < this.tiles[y].length; x++){
                line.push(new LevelRender(this.bodies[y][x].object, this.bodies[y][x].x, this.bodies[y][x].y, this.tiles))
            }
            this.tile_sprites.push(line)
        }
        LevelRender.tiles_init(this.tile_sprites)
    }

    update(fpsRatio) {
        Level.time += fpsRatio
    }
}

class LevelRender extends RenderObject {
    static tiles = []
    static tile_size
    static tile_sprite
    static init(tile_size){
        LevelRender.tile_size = tile_size
        LevelRender.tile_sprite = Render.scene.add.graphics()
    }
    static tiles_init(render_tiles){
        for(let tile of LevelRender.tiles) {
            let sides = 
            [
                [0, 0, 0],
                [0, 9, 0],
                [0, 0, 0]
            ]
            if(!tile.physicsObject.hide){
                for(let ny = 0; ny < 3; ny++) {
                    for(let nx = 0; nx < 3; nx++) {
                        let list_x = tile.list_x + (nx -1)
                        let list_y = tile.list_y + (ny -1)
                        if(list_x >= 0 && list_y >= 0 && list_y < tile.tiles.length && list_x < tile.tiles[list_y].length) {
                            sides[ny][nx] = tile.tiles[list_y][list_x]
                        }else sides[ny][nx] = -1
                    }
                }
            }

            //Up side
            if(sides[0][1] != 1){
                if(sides[1][2] == 1 && sides[0][2] != 1) tile.up.next_right = render_tiles[tile.list_y][tile.list_x+1].up
                else if(sides[1][2] != 1 && sides[0][2] != 1) tile.up.next_right = tile.right
                else if(sides[0][2] == 1) tile.up.next_right = render_tiles[tile.list_y-1][tile.list_x+1].left

                if(sides[1][0] == 1 && sides[0][0] != 1) tile.up.next_left = render_tiles[tile.list_y][tile.list_x-1].up
                else if(sides[1][0] != 1 && sides[0][0] != 1) tile.up.next_left = tile.left
                else if(sides[0][0] == 1) tile.up.next_left = render_tiles[tile.list_y-1][tile.list_x-1].right
            }

            //Down side
            if(sides[2][1] != 1){
                if(sides[1][0] == 1 && sides[2][0] != 1) tile.down.next_right = render_tiles[tile.list_y][tile.list_x-1].down
                else if(sides[1][0] != 1 && sides[2][0] != 1) tile.down.next_right = tile.left
                else if(sides[2][0] == 1) tile.down.next_right = render_tiles[tile.list_y+1][tile.list_x-1].right

                if(sides[1][2] == 1 && sides[2][2] != 1) tile.down.next_left = render_tiles[tile.list_y][tile.list_x+1].down
                else if(sides[1][2] != 1 && sides[2][2] != 1) tile.down.next_left = tile.right
                else if(sides[2][2] == 1) tile.down.next_left = render_tiles[tile.list_y+1][tile.list_x+1].left
            }

            //Right side
            if(sides[1][2] != 1){
                if(sides[2][1] == 1 && sides[2][2] != 1) tile.right.next_right = render_tiles[tile.list_y+1][tile.list_x].right
                else if(sides[2][1] != 1 && sides[2][2] != 1) tile.right.next_right = tile.down
                else if(sides[2][2] == 1) tile.right.next_right = render_tiles[tile.list_y+1][tile.list_x+1].up

                if(sides[0][1] == 1 && sides[0][2] != 1) tile.right.next_left = render_tiles[tile.list_y-1][tile.list_x].right
                else if(sides[0][1] != 1 && sides[0][2] != 1) tile.right.next_left = tile.up
                else if(sides[0][2] == 1) tile.right.next_left = render_tiles[tile.list_y-1][tile.list_x+1].down
            }

            //Left side
            if(sides[1][0] != 1){
                if(sides[0][1] == 1 && sides[0][0] != 1) tile.left.next_right = render_tiles[tile.list_y-1][tile.list_x].left
                else if(sides[0][1] != 1 && sides[0][0] != 1) tile.left.next_right = tile.up
                else if(sides[0][0] == 1) tile.left.next_right = render_tiles[tile.list_y-1][tile.list_x-1].down

                if(sides[2][1] == 1 && sides[2][0] != 1) tile.left.next_left = render_tiles[tile.list_y+1][tile.list_x].left
                else if(sides[2][1] != 1 && sides[2][0] != 1) tile.left.next_left = tile.down
                else if(sides[2][0] == 1) tile.left.next_left = render_tiles[tile.list_y+1][tile.list_x-1].up
            }
        }
    }

    constructor(physicsObject, x, y, tiles) {
        super(LevelRender.tile_sprite, 0, 0, physicsObject)
        LevelRender.tiles.push(this)
        this.tiles = tiles
        this.list_x = x
        this.list_y = y
        this.up = new Line(LevelRender.tile_size)
        this.down = new Line(LevelRender.tile_size)
        this.left = new Line(LevelRender.tile_size)
        this.right = new Line(LevelRender.tile_size)
    }

    render() {
        if(!this.physicsObject.hide){
            let graphics = this.object
            let x = this.physicsObject.getX()
            let y = this.physicsObject.getY()
            
            graphics.clear()
            graphics.lineStyle(2, 0xffffff, 1)
            graphics.beginPath()
            let difference = LevelRender.tile_size / (this.up.dots.length-1)
            for(let i = 0; i < this.up.dots.length; i++){
                if(i == 0) graphics.moveTo(0, 0 + this.up.dots[i])
                else graphics.lineTo(i*difference, 0 + this.up.dots[i])
            }
            graphics.strokePath()
            
            return {draw: graphics, x: x, y: y}
        }else {
            return undefined
        }
    }
}

class Line {
    constructor(tile_size) {
        this.dots = []
        for(let i = 0; i < tile_size; i++) {
            this.dots.push(0)
        }
        this.next_right
        this.next_left
    }
}