import Phaser from "phaser"
import Physics from "../classes/physics"
import Player from "../classes/player"
import Level from "../classes/level"
import {Render} from "../classes/render"


export default class Main extends Phaser.Scene{
  constructor(){
    super("scene-game")
  }

  preload(){
    this.load.text("level1", "src/levels/level1.txt")
    this.load.text("level2", "src/levels/level2.txt")
  }

  create(){
    //Initialize render
    Render.init(this)

    //Levels
    this.codes = 
    {
      level1: this.cache.text.get("level1"),
      level2: this.cache.text.get("level2")
    }
    this.level = new Level(this.codes.level1)

    //Player
    const player_cursors = this.input.keyboard.addKeys(
      {
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        jump: Phaser.Input.Keyboard.KeyCodes.SPACE
      }
    )
    this.player = new Player(player_cursors, 0, 0)

    //Physics
    this.physics = new Physics()
    this.physics.addObject(this.player.hitbox) //Add player
    //Add level blocks
    for(let body of this.level.bodies.flat()){
      this.physics.addObject(body.object)
    }

    //Render
    console.log()
    this.render = new Render(this.level.tiles_width*this.level.tile_size, this.level.tiles_height*this.level.tile_size)
    this.render.addObject(this.player.sprite) //Add player
    this.render.addObject(...this.level.tile_sprites.flat())


    this.level.tile_sprites[2][8].up.dots[20].speed = 20
  }

  update(time, delta){
    //Adjust movement per time
    const fps = 1000/delta
    const fpsRatio = Math.min(60 / fps, 2)

    //Updates
    for(let lines of this.level.tile_sprites.flat()){
      lines.up.update()
      lines.down.update()
      lines.right.update()
      lines.left.update()
    }
   
    this.level.update(fpsRatio)
    this.player.update()
    const collisionPoints = this.physics.update(fpsRatio)
    for(let {x, y} of collisionPoints){
      if(!this.level.tile_sprites?.[Math.floor(y / this.level.tile_size)]?.[Math.floor(x / this.level.tile_size)]?.physicsObject.hide) {
        
      }else{
        let sides = 
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ]
        for(let ny = 0; ny < 3; ny++){
          for(let nx = 0; nx < 3; nx++){
            let list_x = Math.floor(x/this.level.tile_size) + (nx -1)
            let list_y = Math.floor(y/this.level.tile_size) + (ny -1)
            if(list_x >= 0 && list_y >= 0 && list_y < this.level.tiles.length && list_x < this.level.tiles[list_y].length) {
              sides[ny][nx] = this.level.tile_sprites[list_y][list_x]
            }else sides[ny][nx] = -1
          }
        }
        
        console.log(sides)
        //this.level.tile_sprites[Math.floor(y / this.level.tile_size)+1][Math.floor(x / this.level.tile_size)].up.dots[20].speed = 2
      }
      
    }
    this.render.update()

  }
}