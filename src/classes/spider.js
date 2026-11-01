import { LevelRender } from "./level"
import { Point, RigidBody } from "./objects"
import Physics from "./physics"
import RenderObject, { Render } from "./render"


export default class Spider{
    constructor(x, y, level) {
        this.x = x
        this.y = y
        this.level = level

        this.detectPoint = new Point(0, 0, RigidBody.STATE.SOLID)

        this.sprite = new RenderObject(Render.scene.add.rectangle(
            0,
            0,
            25,
            20,
            0x000000
        ), this.x, this.y)

        this.legs = []
        for(let i = 0; i < 8; i++){
            this.legs.push(new RenderObject(Render.scene.add.graphics(), this.x, this.y))
        }

        for(let leg of this.legs){
            leg.targetX = 100
            leg.targetY = 100
            leg.actualX = this.x
            leg.actualY = this.y
        }

        this.isPath = true
        this.current
        this.lastChangeX = 0
        this.lastChangeY = 0
    }

    move(findPlayer, x, y){
        const distanceToPlayer = getDistance(this.x, this.y, x, y)
        //Path finding
        if(findPlayer && this.isPath) {
            this.isPath = false
            let new_level = this.level.map(row => [...row])
            
            let player = {x: Math.floor((x+10) / LevelRender.tile_size), y: Math.floor((y+10) / LevelRender.tile_size)}
            let start = {x: Math.floor(this.x / LevelRender.tile_size), y: Math.floor(this.y / LevelRender.tile_size)}
            new_level[start.y][start.x] = {x: start.x, y: start.y, check: true, parent: null, g: 0, h: 0, f: 0}
            new_level[player.y][player.x] = "B"

            let current = new_level[start.y][start.x]
            pathfind:
            while(true){
                for(let x = 0; x < 3; x++){
                    for(let y = 0; y < 3; y++){
                        if(!(x == 1 && y == 1) && (x == 1 || y == 1)) {
                            let list_x = current.x + (x-1)
                            let list_y = current.y + (y-1)

                            if(!Number.isFinite(current.f)) {
                                this.isPath = true
                                break pathfind
                            }

                            if(new_level[list_y][list_x] == 0){
                                let node = {x: list_x, y: list_y, check: true, parent: current, g: current.g + Math.abs(getDistance(current.x, current.y, list_x, list_y)), h: Math.abs(getDistance(player.x, player.y, list_x, list_y)), f: 0}
                                node.f = node.g + node.h
                                new_level[list_y][list_x] = node
                            }else if(new_level[list_y][list_x]?.check){
                                let node = {x: list_x, y: list_y, check: true, parent: current, g: current.g + Math.abs(getDistance(current.x, current.y, list_x, list_y)), h: Math.abs(getDistance(player.x, player.y, list_x, list_y)), f: 0}
                                node.f = node.g + node.h
                                if(node.f < new_level[list_y][list_x].f) new_level[list_y][list_x] = node
                            }else if(new_level[list_y][list_x] == "B"){
                                this.path = []
                                let node = current
                                while (node != null) {
                                    this.path.push({x: node.x * LevelRender.tile_size + LevelRender.tile_size/2, y: node.y * LevelRender.tile_size + LevelRender.tile_size/2})
                                    node = node.parent;
                                }
                                this.path.reverse()
                                break pathfind
                            }
                        }
                    }
                }

                let smallest = {f:Infinity, check: false, h:Infinity}
                for(let y = 0; y < new_level.length; y++){
                    for(let x = 0; x < new_level[y].length; x++){
                        if(new_level[y][x]?.check){
                            if(new_level[y][x].f < smallest.f){
                                smallest = new_level[y][x]
                            }else if(new_level[y][x].f == smallest.f){
                                if(new_level[y][x].h < smallest.h){
                                    smallest = new_level[y][x]
                                }
                            }
                        }
                    }
                }

                current = smallest
                current.check = false
            }

        }

        if(this.path){
            if(!this.current) this.current = 0
            
            if(this.path.length > 1){
                let speed
                if(Math.sqrt(distanceToPlayer) > 400){
                    speed = 30
                }else if(Math.sqrt(distanceToPlayer) > 100){
                    speed = 4
                }else{
                    speed = 3
                }
                if(this.path[this.current].x == this.x && this.path[this.current].y == this.y) {
                    if(this.current == 1){
                        this.path = undefined
                        this.current = 0
                        this.isPath = true
                    }else{
                        this.current++
                    }
                }else{
                    if(this.x < this.path[this.current].x) {
                        this.x += Math.min(speed, this.path[this.current].x - this.x)
                    }else{
                        this.x -= Math.min(speed, this.x - this.path[this.current].x)
                    }
                    if(this.y < this.path[this.current].y) {
                        this.y += Math.min(speed, this.path[this.current].y - this.y)
                    }else{
                        this.y -= Math.min(speed, this.y - this.path[this.current].y)
                    }
                    //this.sprite.x = this.x
                    //this.sprite.y = this.y
                }
            }else {
                this.path = undefined
                this.current = 0
                this.isPath = true
            }
        }
    }

    update(){
        let positions = new Set()
        for(let a = 0; a < 360; a += 360/32) {
            let distance = 5
            while(distance < 80) {
                this.detectPoint.x = this.sprite.x + distance*Math.cos(a)
                this.detectPoint.y = this.sprite.y + distance*Math.sin(a)
                if(Physics.touchingSolid(undefined, this.detectPoint)) {
                    positions.add({x: this.detectPoint.x, y: this.detectPoint.y})
                    break
                }
                distance += 4
            }
        }

        for(let leg of this.legs){
            leg.x = this.sprite.x
            leg.y = this.sprite.y

            if(getDistance(leg.x, leg.y, leg.targetX, leg.targetY) > 6400){
                if(positions.size > 0){
                    let right = 0
                    let left = 0
                    for(let other of this.legs){
                        if(other.targetX > this.sprite.x){
                            right++
                        }else{
                            left++
                        }
                    }
                    let randomPosition
                    for(let position of suffle([...positions])) {
                        if(right > left){
                            if(position.x < this.sprite.x - 10) {
                                randomPosition = position
                                break
                            }
                        }else if(left > right){
                            if(position.x > this.sprite.x + 10) {
                                randomPosition = position
                                break
                            }
                        }
                    }
                    if(!randomPosition) randomPosition = [...positions][Math.floor(Math.random() * positions.size)]
                    leg.targetX = randomPosition.x
                    leg.targetY = randomPosition.y
                    positions.delete(randomPosition)
                }
            }

            let animationDistance = Math.sqrt(getDistance(leg.targetX, leg.targetY, leg.actualX, leg.actualY))
            if(Math.abs(animationDistance) > 5){
                let angle = getAngle(leg.actualX, leg.actualY, leg.targetX, leg.targetY)
                leg.actualX += Math.min(15, animationDistance) * Math.cos(angle)
                leg.actualY += Math.min(15, animationDistance) * Math.sin(angle)
            }
            let graphics = leg.object
            graphics.clear()
            graphics.lineStyle(5, 0x000000, 1);
            let targetX = leg.actualX - leg.x
            let targetY = leg.actualY - leg.y
            let angle = Math.acos(Math.sqrt(getDistance(0, 0, targetX, targetY))/80)
            let normalAngle = getAngle(0, 0, targetX, targetY)
            if(targetX > 0){
                graphics.lineBetween(0, 0, 0 + 40*Math.cos(normalAngle - angle), 0 + 40*Math.sin(normalAngle - angle));
                graphics.lineBetween(40*Math.cos(normalAngle - angle), 40*Math.sin(normalAngle - angle), targetX, targetY)
            }else{
                graphics.lineBetween(0, 0, 0 + 40*Math.cos(normalAngle + angle), 0 + 40*Math.sin(normalAngle + angle));
                graphics.lineBetween(40*Math.cos(normalAngle + angle), 40*Math.sin(normalAngle + angle), targetX, targetY)
            }
        }

    }
}

function getDistance(x1, y1, x2, y2){
  return (x2-x1)**2 + (y2-y1)**2
}

function getAngle(x1, y1, x2, y2){
    return Math.atan2(y2-y1, x2-x1)
}

function suffle(array) {
    for(let i = array.length -1; i > 0; i--){
        let r = Math.floor(Math.random() * (i+1))
        const last = array[r]
        array[r] = array[i]
        array[i] = last
    }
    return array
}