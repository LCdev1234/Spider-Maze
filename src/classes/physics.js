export default class Physics {
    static GRAVITY = 0.9
    static FRICTION = 0.85

    constructor() {
        this.bodies = new Set()
    }

    addObject(...bodys) {
        for(let body of bodys) {
            this.bodies.add(body)
        }
    }

    update() {

    }
}