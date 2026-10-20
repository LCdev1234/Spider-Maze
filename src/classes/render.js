import { RigidBody } from "./objects"

export class Render {
    static scene
    static init(scene) {Render.scene = scene}
    constructor() {
        this.canvas = Render.scene.add.renderTexture(0, 0, Render.scene.scale.width, Render.scene.scale.height)
        this.sprites = new Set()
    }

    addObject(...renderObject) {
        console.log(renderObject)
        for(let object of renderObject) {
            this.sprites.add(object)
            //console.log(object.object)
            //object.object.setVisible(false)
        }
    }

    update() {
        this.canvas.clear()
        for(let sprite of this.sprites){
            if(sprite.physicsObject != undefined){
                if(sprite.physicsObject.hide){
                    sprite.object.setPosition(sprite.physicsObject.x, sprite.physicsObject.y)
                    this.canvas.draw(sprite.object)
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