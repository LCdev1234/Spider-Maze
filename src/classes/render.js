
export class Render {
    static scene
    static init(scene) {Render.scene = scene}
    constructor() {

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