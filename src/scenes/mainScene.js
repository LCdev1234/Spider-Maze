import Phaser from "phaser"
import Physics from "../classes/physics"
import Player from "../classes/player"
import Level, { LevelRender } from "../classes/level"
import {Render} from "../classes/render"
import Spider from "../classes/spider"


export default class Main extends Phaser.Scene{
  constructor(){
    super("scene-game")
  }

  preload(){
    this.load.text("level1", "src/levels/level1.txt")
    this.load.text("level2", "src/levels/level2.txt")
    this.load.image("background", "src/assets/background.png")
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
        space: Phaser.Input.Keyboard.KeyCodes.SPACE
      }
    )
    this.player = new Player(player_cursors, 60, 60)

    //Spider
    const temporaly_pointer = this.input.activePointer
    this.spider = new Spider(temporaly_pointer)

    //Physics
    this.physics = new Physics()
    this.physics.addObject(this.player.hitbox) //Add player
    //Add level blocks
    for(let body of this.level.bodies.flat()){
      this.physics.addObject(body.object)
    }

    //Render
    this.render = new Render(this.level.tiles_width*this.level.tile_size, this.level.tiles_height*this.level.tile_size)
    this.render.addObject(...this.level.tile_sprites.flat())
    this.render.addObject(this.spider.sprite) //Add spider
    this.render.addObject(...this.spider.legs)
    this.render.addObject(this.player.sprite, this.player.eye1, this.player.eye2) //Add player
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
    this.spider.update(this.player.hitbox.x +10, this.player.hitbox.y +10, this.render.canvas.scale)
    if(this.player.merge_start) 
    {
      let x = this.player.hitbox.x
      let y = this.player.hitbox.y
      let speed = 200
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
              if(this.level.tiles[list_y][list_x] == 1) sides[ny][nx] = this.level.tile_sprites[list_y][list_x]
              else sides[ny][nx] = -1
            }else sides[ny][nx] = -1
          }
        }

        let dots = sides[2][1].up.dots[Math.floor(x%(LevelRender.tile_size/2))]
        dots.speed = Math.min(20, dots.speed + speed*2)
      }
    }
    const collisionPoints = this.physics.update(fpsRatio)
    for(let {x, y, speed} of collisionPoints){
      x += 10
      y += 10
      if(!this.level.tile_sprites?.[Math.floor(y / this.level.tile_size)]?.[Math.floor(x / this.level.tile_size)]?.physicsObject.hide) {
        const tile_x = Math.floor(x/this.level.tile_size)
        const tile_y = Math.floor(y/this.level.tile_size)
        const tile = this.level.tile_sprites[tile_y]?.[tile_x]

        if(tile){
          let dot
          if(!tile.up.useless) {
            dot = tile.up.dots[Math.floor(x%(LevelRender.tile_size/2))]
            dot.speed = Math.max(-5, dot.speed - speed*1.5)
          }
          if(!tile.down.useless) {
            dot = tile.down.dots[tile.down.dots.length-1-Math.floor(x%(LevelRender.tile_size/2))]
            dot.speed = Math.min(5, dot.speed + speed*1.5)
          }
          if(!tile.right.useless) {
            dot = tile.right.dots[Math.floor(y%(LevelRender.tile_size/2))]
            dot.speed = Math.min(5, dot.speed + speed*1.5)
          }
          if(!tile.left.useless) {
            dot = tile.left.dots[tile.left.dots.length-1-Math.floor(y%(LevelRender.tile_size/2))]
            dot.speed = Math.max(-5, dot.speed - speed*1.5)
          }
        }
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
              if(this.level.tiles[list_y][list_x] == 1) sides[ny][nx] = this.level.tile_sprites[list_y][list_x]
              else sides[ny][nx] = -1
            }else sides[ny][nx] = -1
          }
        }

        let closest = {x: 0, y:0}
        let min_distance = 1000000

        let distance = getDistance(sides[0][1]?.physicsObject?.getX() + LevelRender.tile_size/2, sides[0][1]?.physicsObject?.getY() + LevelRender.tile_size/2, x, y)
        if(distance < min_distance){
          min_distance = distance
          closest = {x: 1, y: 0}
        }
        
        distance = getDistance(sides[1][0]?.physicsObject?.getX() + LevelRender.tile_size/2, sides[1][0]?.physicsObject?.getY() + LevelRender.tile_size/2, x, y)
        if(distance < min_distance){
          closest = {x: 0, y: 1}
          min_distance = distance
        }

        distance = getDistance(sides[1][2]?.physicsObject?.getX() + LevelRender.tile_size/2, sides[1][2]?.physicsObject?.getY() + LevelRender.tile_size/2, x, y)
        if(distance < min_distance){
          closest = {x: 2, y: 1}
          min_distance = distance
        }

        distance = getDistance(sides[2][1]?.physicsObject?.getX() + LevelRender.tile_size/2, sides[2][1]?.physicsObject?.getY() + LevelRender.tile_size/2, x, y)
        if(distance < min_distance){
          closest = {x: 1, y: 2}
          min_distance = distance
        }

        
        if(closest.x == 1 && closest.y == 2){
          let dots = sides[closest.y][closest.x].up.dots[Math.floor(x%(LevelRender.tile_size/2))]
          dots.speed = Math.min(5, dots.speed + speed*2)
        }else if(closest.x == 2 && closest.y == 1){
          let dots = sides[closest.y][closest.x].left.dots[Math.floor(y%(LevelRender.tile_size/2))]
          dots.speed = Math.min(5, dots.speed + speed/1)
        }else if(closest.x == 0 && closest.y == 1){
          let dots = sides[closest.y][closest.x].right.dots[Math.floor(y%(LevelRender.tile_size/2))]
          dots.speed = Math.max(-5, dots.speed - speed/1)
        }else if(closest.x == 1 && closest.y == 0){
          let dots = sides[closest.y][closest.x].down.dots[Math.floor(x%(LevelRender.tile_size/2))]
          dots.speed = Math.max(-5, dots.speed - speed/1)
        }
      }
      
    }
    this.render.update(this.player.hitbox.x, this.player.hitbox.y, [{x: this.spider.x, y: this.spider.y}])

  }
}

function getDistance(x1, y1, x2, y2){
  if(!x1 || !y1 || !x2 || !y2) return 1000000000
  return (x2-x1)**2 + (y2-y1)**2
}