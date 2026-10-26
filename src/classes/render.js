export class Render {
    static scene
    static init(scene) {Render.scene = scene}
    constructor(width, height) {
        this.canvas = Render.scene.add.renderTexture(0, 0, width, height)
        this.background = Render.scene.add.image(0, 0, "background")
        this.background.setVisible(false)
        this.background.setOrigin(0, 1)
        this.background.setPosition(0, height)
        if(width > height){
            if(width/height < Render.scene.scale.width/Render.scene.scale.height) {
                this.canvas.setScale(Render.scene.scale.height/(height/2))
            }else{
                this.canvas.setScale(Render.scene.scale.width/(width/2))
            }
            this.background.setScale((this.background.scale*width)/this.background.width)
        }else{
            if(height/width < Render.scene.scale.height/Render.scene.scale.width) {
                this.canvas.setScale(Render.scene.scale.width/(width/2))
            }else{
                this.canvas.setScale(Render.scene.scale.height/(height/2))
            }
            this.background.setScale((this.background.scale*height)/this.background.height)
        }
        this.canvas.setOrigin(0, 0)
        this.canvas.setPosition(Render.scene.scale.width/2 - this.canvas.displayWidth/2, Render.scene.scale.height/2 - this.canvas.displayHeight/2)
        this.sprites = new Set()

        Render.scene.scale.on("resize", (gameSize) => {
            if(width > height){
                if(width/height < Render.scene.scale.width/Render.scene.scale.height) {
                    this.canvas.setScale(Render.scene.scale.height/(height/2))
                }else{
                    this.canvas.setScale(Render.scene.scale.width/(width/2))
                }
                this.background.setScale((this.background.scale*width)/this.background.width)
            }else{
                if(height/width < Render.scene.scale.height/Render.scene.scale.width) {
                    this.canvas.setScale(Render.scene.scale.width/(width/2))
                }else{
                    this.canvas.setScale(Render.scene.scale.height/(height/2))
                }
                this.background.setScale((this.background.scale*height)/this.background.height)
            }
            this.canvas.setPosition(Render.scene.scale.width/2 - this.canvas.displayWidth/2, Render.scene.scale.height/2 - this.canvas.displayHeight/2)
        });
    }

    addObject(...renderObject) {
        for(let object of renderObject) {
            this.sprites.add(object)
            object.setVisible(false)
        }
    }

    update(x, y) {
        this.canvas.setPosition((-x + this.canvas.width/4)*this.canvas.scale, (-y + this.canvas.height/4)*this.canvas.scale)
        this.canvas.clear()
        this.canvas.fill(0xffffff)
        this.canvas.draw(this.background)
        for(let sprite of this.sprites){
            let sprite_render = sprite.render()
            if(sprite_render != undefined){
                this.canvas.draw(sprite_render.draw, sprite_render.x, sprite_render.y)
                this.canvas.render()
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

    render() {
        let halfWidth = this.object.width/2
        let halfHeight = this.object.height/2
        if(this.physicsObject != undefined){
            if(!this.physicsObject.hide){
                return {draw: this.object, x: this.physicsObject.x+halfWidth + this.x, y:this.physicsObject.y+halfHeight + this.y}
            }
        }else{
            return {draw: this.object, x: this.x, y: this.y}
        }
        return undefined
    }

    setVisible(visible) {
        this.object.setVisible(visible)
    }
}