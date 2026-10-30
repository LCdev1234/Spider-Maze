import { Point, RigidBody } from "./objects"
import Physics from "./physics"
import RenderObject, { Render } from "./render"


export default class Spider{
    constructor(cursors) {
        this.cursors = cursors
        this.x = this.cursors.x
        this.y = this.cursors.y

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
            leg.targetX = this.x
            leg.targetY = this.y
            leg.actualX = this.x
            leg.actualY = this.y
        }
    }

    update(centerX, centerY, scale){
        this.sprite.x = centerX + (this.cursors.x - Render.scene.scale.width/2) / scale
        this.sprite.y = centerY + (this.cursors.y - Render.scene.scale.height/2) / scale
        this.x = this.cursors.x
        this.y = this.cursors.y

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