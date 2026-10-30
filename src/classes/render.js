export class Render {
    static width
    static height
    static scene
    static init(scene) {Render.scene = scene}
    constructor(width, height) {
        Render.width = width
        Render.height = height
        
        this.canvas = Render.scene.add.renderTexture(0, 0, width, height)
        this.background = Render.scene.add.image(0, 0, "background")
        this.background.setVisible(false)
        this.background.setOrigin(0, 1)
        this.background.falseHeight = height
        this.background_width = this.background.width
        this.background_height = this.background_height
        
        this.light = Render.scene.add.renderTexture(0, 0, Render.scene.scale.width, Render.scene.scale.height)
        this.light.setOrigin(0, 0)
        this.light_graphics = Render.scene.add.graphics()
        this.light_graphics.setVisible(false)
        this.drawLights()

        this.light_blinks = 0       

        
        if(width > height){
            if(width/height < Render.scene.scale.width/Render.scene.scale.height) {
                this.canvas.setScale(Render.scene.scale.height/(height/4))
            }else{
                this.canvas.setScale(Render.scene.scale.width/(width/4))
            }
            this.background.setScale((width)/this.background_width)
        }else{
            if(height/width < Render.scene.scale.height/Render.scene.scale.width) {
                this.canvas.setScale(Render.scene.scale.width/(width/4))
            }else{
                this.canvas.setScale(Render.scene.scale.height/(height/4))
            }
            this.background.setScale((height)/this.background_height)
        }
        this.canvas.setOrigin(0, 0)
        this.canvas.setPosition(Render.scene.scale.width/2 - this.canvas.displayWidth/2, Render.scene.scale.height/2 - this.canvas.displayHeight/2)
        this.sprites = new Set()

        Render.scene.scale.on("resize", (gameSize) => {
            if(width > height){
                if(width/height < Render.scene.scale.width/Render.scene.scale.height) {
                    this.canvas.setScale(Render.scene.scale.height/(height/4))
                }else{
                    this.canvas.setScale(Render.scene.scale.width/(width/4))
                }
                this.background.setScale((width)/this.background_width)
            }else{
                if(height/width < Render.scene.scale.height/Render.scene.scale.width) {
                    this.canvas.setScale(Render.scene.scale.width/(width/4))
                }else{
                    this.canvas.setScale(Render.scene.scale.height/(height/4))
                }
                this.background.setScale((height)/this.background_height)
            }
            this.canvas.setPosition(Render.scene.scale.width/2 - this.canvas.displayWidth/2, Render.scene.scale.height/2 - this.canvas.displayHeight/2)

            this.light.resize(Render.scene.scale.width, Render.scene.scale.height)
            this.drawLights()
        });
    }

    addObject(...renderObject) {
        for(let object of renderObject) {
            this.sprites.add(object)
            object.setVisible(false)
        }
    }

    update(x, y, lights) {
        this.canvas.setPosition((-x-10)*this.canvas.scale + Render.scene.scale.width/2, (-y-10)*this.canvas.scale + Render.scene.scale.height/2)
        this.canvas.clear()
        this.canvas.fill(0xffffff)
        this.canvas.draw(this.background, 0, this.background.falseHeight)
        this.canvas.render()
        for(let sprite of this.sprites){
            let sprite_render
            sprite_render = sprite.render()
            if(sprite_render != undefined){
                this.canvas.draw(sprite_render.draw, sprite_render.x, sprite_render.y)
                this.canvas.render()
            }
        }
        this.drawLights(lights)
    }

    drawLights(lights){
        this.light_blinks++
        this.light.clear()
        this.light_graphics.clear()
        this.light_graphics.fillStyle(0x0d0303, 1)
        this.light_graphics.fillRect(0, 0, Render.scene.scale.width, Render.scene.scale.height);
        this.light.draw(this.light_graphics, 0, 0)
        this.light.render()
        if(this.light_blinks < 500 || this.light_blinks % 20 < 12 + 5*Math.random()){
            this.light_graphics.clear()
            if(lights){
                for(let {x, y} of lights){
                    this.light_graphics.fillStyle(0xffffff, 0.025)
                    this.light_graphics.fillCircle(x, y, Render.scene.scale.height/4)
                    this.light_graphics.fillStyle(0xffffff, 0.07)
                    this.light_graphics.fillCircle(x, y, 350/400 * Render.scene.scale.height/4)
                    this.light_graphics.fillStyle(0xffffff, 0.05)
                    this.light_graphics.fillCircle(x, y, 325/400 * Render.scene.scale.height/4)
                    this.light_graphics.fillStyle(0xffffff, 0.1)
                    this.light_graphics.fillCircle(x, y, 225/400 * Render.scene.scale.height/4)
                    this.light_graphics.fillStyle(0xffffff, 0.1)
                    this.light_graphics.fillCircle(x, y, 150/400 * Render.scene.scale.height/4)
                    this.light_graphics.fillStyle(0xffffff, 0.4)
                    this.light_graphics.fillCircle(x, y, 100/400 * Render.scene.scale.height/4)
                }
            }
            this.light_graphics.fillStyle(0xffffff, 0.05)
            this.light_graphics.fillCircle(Render.scene.scale.width/2, Render.scene.scale.height/2, Render.scene.scale.height/2.2)
            this.light_graphics.fillStyle(0xffffff, 0.1)
            this.light_graphics.fillCircle(Render.scene.scale.width/2, Render.scene.scale.height/2, 350/400 * Render.scene.scale.height/2.2)
            this.light_graphics.fillStyle(0xffffff, 0.2)
            this.light_graphics.fillCircle(Render.scene.scale.width/2, Render.scene.scale.height/2, 325/400 * Render.scene.scale.height/2.2)
            this.light_graphics.fillStyle(0xffffff, 0.1)
            this.light_graphics.fillCircle(Render.scene.scale.width/2, Render.scene.scale.height/2, 225/400 * Render.scene.scale.height/2.2)
            this.light_graphics.fillStyle(0xffffff, 0.3)
            this.light_graphics.fillCircle(Render.scene.scale.width/2, Render.scene.scale.height/2, 150/400 * Render.scene.scale.height/2.2)
            this.light_graphics.fillStyle(0xffffff, 0.6)
            this.light_graphics.fillCircle(Render.scene.scale.width/2, Render.scene.scale.height/2, 100/400 * Render.scene.scale.height/2.2)
            this.light.erase(this.light_graphics, 0, 0)
            this.light.render()
        }
        if(this.light_blinks > 570) this.light_blinks = 0
    }
}

export default class RenderObject {
    constructor(object, x, y, physicsObject = undefined) {
        this.object = object
        this.x = x
        this.y = y
        this.physicsObject = physicsObject
        this.hide = false
    }

    render() {
        if(!this.hide) {
            let halfWidth = this.object.width/2
            let halfHeight = this.object.height/2
            if(this.physicsObject != undefined){
                if(!this.physicsObject.hide){
                    return {draw: this.object, x: this.physicsObject.x+halfWidth + this.x, y:this.physicsObject.y+halfHeight + this.y}
                }
            }else{
                return {draw: this.object, x: this.x, y: this.y}
            }
        }
        return undefined
    }

    setVisible(visible) {
        this.object.setVisible(visible)
    }
}