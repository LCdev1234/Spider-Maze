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

export class LevelRender extends RenderObject {
    static tiles = []
    static tile_size
    static tile_sprite
    static square_graphics
    static init(tile_size){
        LevelRender.tile_size = tile_size
        LevelRender.tile_sprite = Render.scene.add.graphics()
        LevelRender.square_graphics = Render.scene.add.graphics()
        LevelRender.square_graphics.clear()
        LevelRender.square_graphics.fillStyle(0x000000, 1)
        LevelRender.square_graphics.fillRect(0, 0, LevelRender.tile_size, LevelRender.tile_size);
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
            }else{
                tile.up.useless = true
            }

            //Down side
            if(sides[2][1] != 1){
                if(sides[1][0] == 1 && sides[2][0] != 1) tile.down.next_right = render_tiles[tile.list_y][tile.list_x-1].down
                else if(sides[1][0] != 1 && sides[2][0] != 1) tile.down.next_right = tile.left
                else if(sides[2][0] == 1) tile.down.next_right = render_tiles[tile.list_y+1][tile.list_x-1].right

                if(sides[1][2] == 1 && sides[2][2] != 1) tile.down.next_left = render_tiles[tile.list_y][tile.list_x+1].down
                else if(sides[1][2] != 1 && sides[2][2] != 1) tile.down.next_left = tile.right
                else if(sides[2][2] == 1) tile.down.next_left = render_tiles[tile.list_y+1][tile.list_x+1].left
            }else{
                tile.down.useless = true
            }

            //Right side
            if(sides[1][2] != 1){
                if(sides[2][1] == 1 && sides[2][2] != 1) tile.right.next_right = render_tiles[tile.list_y+1][tile.list_x].right
                else if(sides[2][1] != 1 && sides[2][2] != 1) tile.right.next_right = tile.down
                else if(sides[2][2] == 1) tile.right.next_right = render_tiles[tile.list_y+1][tile.list_x+1].up

                if(sides[0][1] == 1 && sides[0][2] != 1) tile.right.next_left = render_tiles[tile.list_y-1][tile.list_x].right
                else if(sides[0][1] != 1 && sides[0][2] != 1) tile.right.next_left = tile.up
                else if(sides[0][2] == 1) tile.right.next_left = render_tiles[tile.list_y-1][tile.list_x+1].down
            }else{
                tile.right.useless = true
            }

            //Left side
            if(sides[1][0] != 1){
                if(sides[0][1] == 1 && sides[0][0] != 1) tile.left.next_right = render_tiles[tile.list_y-1][tile.list_x].left
                else if(sides[0][1] != 1 && sides[0][0] != 1) tile.left.next_right = tile.up
                else if(sides[0][0] == 1) tile.left.next_right = render_tiles[tile.list_y-1][tile.list_x-1].down

                if(sides[2][1] == 1 && sides[2][0] != 1) tile.left.next_left = render_tiles[tile.list_y+1][tile.list_x].left
                else if(sides[2][1] != 1 && sides[2][0] != 1) tile.left.next_left = tile.down
                else if(sides[2][0] == 1) tile.left.next_left = render_tiles[tile.list_y+1][tile.list_x-1].up
            }else{
                tile.left.useless = true
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
            
            if(!this.up.drawComplete && !this.right.drawComplete && !this.down.drawComplete && !this.left.drawComplete){
                return {draw: LevelRender.square_graphics, x: x, y: y}
            }

            graphics.clear()
            graphics.fillStyle(0x000000, 1)
            //Up line
            graphics.beginPath()
            let difference = LevelRender.tile_size / (this.up.dots.length-1)
            if(this.up.drawComplete) {
                for(let i = 0; i < this.up.dots.length; i++){
                    if(i == 0) graphics.moveTo(0, 0 + this.up.dots[i].height)
                    else graphics.lineTo(i*difference, 0 + this.up.dots[i].height)
                }
            }else {
                graphics.moveTo(0, 0)
                graphics.lineTo(LevelRender.tile_size, 0)
            }
            //Right line
            if(this.right.drawComplete){
                for(let i = 0; i < this.right.dots.length; i++){
                    graphics.lineTo(LevelRender.tile_size + this.right.dots[i].height, i*difference)
                }
            }else{
                graphics.lineTo(LevelRender.tile_size, LevelRender.tile_size)
            }
            //Down line
            if(this.down.drawComplete){
                for(let i = 0; i < this.down.dots.length; i++){
                    graphics.lineTo(LevelRender.tile_size - i*difference, LevelRender.tile_size + this.down.dots[i].height)
                }
            }else{
                graphics.lineTo(0, LevelRender.tile_size)
            }
            //Left line
            if(this.left.drawComplete){
                for(let i = 0; i < this.left.dots.length; i++){
                    graphics.lineTo(0 + this.left.dots[i].height, LevelRender.tile_size - i*difference)
                }
            }
            graphics.closePath()
            graphics.fillPath()
            
            return {draw: graphics, x: x, y: y}
        }else {
            return undefined
        }
    }
}

class Line {
    static SPREAD = 0.04

    constructor(tile_size) {
        this.dots = []
        for(let i = 0; i < tile_size/2; i++) {
            this.dots.push(new Point(0, 0, 0))
        }
        this.next_right
        this.next_left
        this.drawComplete = true
        this.useless = false
    }

    update() {
        let count = 0
        for(let point of this.dots){
            if(Math.floor(point.height) == Math.floor(point.targetHeight) && Math.abs(point.speed) < 0.1){
                count++
            }
        }
        if(count == this.dots.length) {
            this.drawComplete = false
            return
        }else{
            this.drawComplete = true
        }
        for(let point of this.dots){
            point.update()
        }

        let leftPoints = Array(this.dots.length)
        let rightPoints = Array(this.dots.length)

        for(let n = 0; n < 8; n++){
            for(let i = 0; i < this.dots.length; i++){
                if(i == 0){
                    if(this.next_left){
                        leftPoints[i] = Line.SPREAD * (this.dots[i].height - this.next_left.dots[this.next_left.dots.length-1].height)
                        this.next_left.dots[this.next_left.dots.length-1].speed += leftPoints[i]
                    }
                }else if(i > 0){
                    //Left points
                    leftPoints[i] = Line.SPREAD * (this.dots[i].height - this.dots[i-1].height)
                    this.dots[i-1].speed += leftPoints[i]
                }

                if(i == this.dots.length-1){
                    if(this.next_right){
                        rightPoints[i] = Line.SPREAD * (this.dots[i].height - this.next_right.dots[0].height)
                        this.next_right.dots[0].speed += rightPoints[i]
                    }
                }else if(i < this.dots.length-1){
                    //Right points
                    rightPoints[i] = Line.SPREAD * (this.dots[i].height - this.dots[i+1].height)
                    this.dots[i+1].speed += rightPoints[i]
                }
            }

            for(let i = 0; i < this.dots.length; i++){
                if(i == 0){
                    if(this.next_left){
                        this.next_left.dots[this.next_left.dots.length-1].height += leftPoints[i]
                    }
                }else if(i > 0){
                    this.dots[i-1].height += leftPoints[i]
                }

                if(i == this.dots.length-1){
                    if(this.next_right){
                        this.next_right.dots[0].height += rightPoints[i]
                    }
                }else if(i < this.dots.length-1){
                    this.dots[i+1].height += rightPoints[i]
                }
            }
        }
    }
}

class Point {
    static DAMPENING = 0.025
    static TENSION = 0.2
    constructor(height, targetHeight, speed){
        this.height = height
        this.targetHeight = targetHeight
        this.speed = speed
    }

    update() {
        let x = this.targetHeight - this.height

        if(Math.abs(x) < 0.5 && Math.abs(this.speed) < 0.1){
            this.height = this.targetHeight
        }else{
            this.speed += Point.TENSION * x - this.speed * Point.DAMPENING
            this.height += this.speed
        }
    }
}