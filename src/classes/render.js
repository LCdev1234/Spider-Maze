import { RigidBody } from "./objects"

export class Render {
    static scene
    static init(scene) {Render.scene = scene}
    constructor(width, height) {
        this.canvas = Render.scene.add.renderTexture(0, 0, width, height)
        if(width > height){
            this.canvas.setScale(Render.scene.scale.width/width)
        }else{
            this.canvas.setScale(Render.scene.scale.height/height)
        }
        this.canvas.setOrigin(0, 0)
        this.canvas.setPosition(Render.scene.scale.width/2 - this.canvas.displayWidth/2, Render.scene.scale.height/2 - this.canvas.displayHeight/2)
        this.sprites = new Set()
    }

    addObject(...renderObject) {
        for(let object of renderObject) {
            this.sprites.add(object)
            object.object.setVisible(false)
        }
    }

    update() {
        this.canvas.clear()
        for(let sprite of this.sprites){
            let halfWidth = sprite.object.width/2
            let halfHeight = sprite.object.height/2
            if(sprite.physicsObject != undefined){
                if(!sprite.physicsObject.hide){
                    this.canvas.draw(sprite.object, sprite.physicsObject.x+halfWidth, sprite.physicsObject.y+halfHeight)
                    this.canvas.render()
                }
            }
        }
    }
}

export default class RenderObject {
    constructor(object, x, y, physicsObject = undefined) {
        this.object = object
        this.x = x
        this.y = y
        this.physicsObject = physicsObject
    }
}