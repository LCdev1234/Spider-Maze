import Physics from "./physics"

export class RigidBody {
    static STATE = Object.freeze(
        {
            SOLID: "solid",
            MOVING: "moving"
        }
    )

    constructor(x, y, state){
        this.x = x
        this.y = y
        this.state = state
        this.gravity = Physics.GRAVITY
        this.frction = Physics.FRICTION
    }

    getX() {return this.x}
    getY() {return this.y}
    getState() {return this.state}

    update() {
        if(this.state == RigidBody.STATE.MOVING){
            this.y -= this.gravity
            this.x += this.frction
        }
    }

    isTouching(shape) {
        throw new Error("Is touching not implemented in class");
    }
}

export class Rectangle extends RigidBody {
    constructor(x, y, width, height, state, hide = true){
        super(x, y, state)

        this.width = width
        this.height = height
        this.hide = hide
    }

    getWidth() {return this.width}
    getHeight() {return this.height}
}