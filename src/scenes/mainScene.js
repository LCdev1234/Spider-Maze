import Phaser from "phaser"
import Physics from "../classes/physics"
import Player from "../classes/player"
import Level, { LevelRender } from "../classes/level"
import RenderObject, {Render} from "../classes/render"
import Spider from "../classes/spider"


export default class Main extends Phaser.Scene{
  constructor(){
    super("scene-game")
  }

  preload(){
    this.load.text("level1", "src/levels/level1.txt")
    this.load.text("spider_level", "src/levels/spider_level.txt")
    this.load.image("background", "src/assets/background.png")
  }

  create(){
    //Initialize render
    Render.init(this)

    //Levels
    this.codes = 
    {
      level1: this.cache.text.get("level1"),
      spiderLevel: this.cache.text.get("spider_level")
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
    this.player = new Player(player_cursors, 60, 570)
    this.player.input_pause = false
    this.timerText = this.add.text(20, this.scale.height-20, '0', {
        fontFamily: 'Fredoka',
        fontSize: '64px',
        fontStyle: 'bold',
        color: '#ffffff'
    }).setDepth(100).setOrigin(0, 1)
    this.coldown = 0
    this.timer = this.time.addEvent({
          delay: 1000,
          callback: () => {
            if(this.coldown > 0){
              this.coldown--
              this.timerText.setText(this.coldown)
              if(this.coldown == 0) this.player.canMerge = true
            }else{
              this.timerText.setText("")
            }
          },
          callbackScope: this,
          loop: true
      });

    //Spider
    this.spider = new Spider(600, 90, Level.getLevel(this.codes.spiderLevel))

    //WinOrb
    this.winorb = new WinOrb(2350, 1350)

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
    this.render.addObject(this.winorb.sprite)
    this.render.addObject(this.player.sprite, this.player.eye1, this.player.eye2) //Add player
  }

  update(time, delta){
    //Adjust movement per time
    const fps = 1000/delta
    const fpsRatio = Math.min(60 / fps, 2)
    this.timerText.setPosition(20, this.scale.height-20)
    this.timerText.setScale(this.render.canvas.scale/2)

    //Updates
    for(let lines of this.level.tile_sprites.flat()){
      lines.up.update()
      lines.down.update()
      lines.right.update()
      lines.left.update()
    }
   
    this.level.update(fpsRatio)
    this.player.update()
    if(this.player.win){
      this.player.hitbox.x += (this.winorb.x - this.player.hitbox.x)/10
      this.player.hitbox.y += (this.winorb.y - this.player.hitbox.y)/10
    }
    this.spider.move(!(this.player.hitbox.x < 360 && this.player.hitbox.y < 600) && !this.player.win, this.player.hitbox.x, this.player.hitbox.y)
    {
      let tile = {y: Math.floor(this.spider.y / this.level.tile_size), x:Math.floor(this.spider.x / this.level.tile_size)}
      this.spider.sprite.x = this.spider.x
      this.spider.sprite.y = this.spider.y

      let changesY = 0
      if(this.level.tile_sprites[tile.y-1][tile.x].physicsObject.hide == false){
        this.spider.sprite.y += this.level.tile_size/2
        changesY++
      }
      if(this.level.tile_sprites[tile.y+1][tile.x].physicsObject.hide == false){
        this.spider.sprite.y -= this.level.tile_size/2
        changesY++
      }

      let changesX = 0
      if(this.level.tile_sprites[tile.y][tile.x+1].physicsObject.hide == false){
        this.spider.sprite.x -= this.level.tile_size/2
        changesX++
      }
      if(this.level.tile_sprites[tile.y][tile.x-1].physicsObject.hide == false){
        this.spider.sprite.x += this.level.tile_size/2
        changesX++
      }

      if(changesX == 0 && changesY == 0){
        if(this.level.tile_sprites[tile.y+1][tile.x-1].physicsObject.hide == false){
          this.spider.sprite.x += this.level.tile_size/2
          this.spider.sprite.y -= this.level.tile_size/2
        }
        if(this.level.tile_sprites[tile.y+1][tile.x+1].physicsObject.hide == false){
          this.spider.sprite.x -= this.level.tile_size/2
          this.spider.sprite.y -= this.level.tile_size/2
        }
        if(this.level.tile_sprites[tile.y-1][tile.x-1].physicsObject.hide == false){
          this.spider.sprite.x += this.level.tile_size/2
          this.spider.sprite.y += this.level.tile_size/2
        }
        if(this.level.tile_sprites[tile.y-1][tile.x+1].physicsObject.hide == false){
          this.spider.sprite.x -= this.level.tile_size/2
          this.spider.sprite.y += this.level.tile_size/2
        }
      }
    }
    this.spider.update()

    if(this.player.merge_start) 
    {
      this.unmerge = this.time.addEvent({
          delay: 3000,
          callback: () => {
            this.player.merge = false
            this.coldown = 10
            this.unmerge.remove();
          },
          callbackScope: this,
          loop: true
      });
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

        if(sides[2][1].up?.dots){
          let dots = sides[2][1].up.dots[Math.floor(x%(LevelRender.tile_size/2))]
          dots.speed = Math.min(20, dots.speed + speed*2)
        }
      }
    }else if(this.player.merge_end){
      this.unmerge.remove()
      this.player.merge = false
      this.coldown = 10
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

    this.winorb.update(delta)
    if(!this.player.merge && Math.abs(Math.sqrt(getDistance(this.player.hitbox.x, this.player.hitbox.y, this.winorb.x, this.winorb.y))) < 200){
      this.player.win = true
      this.player.input_pause = true
      this.player.hitbox.gravity = 0
      this.player.hitbox.speed_y = 0
      this.player.hitbox.speed_x = 0
    }else if(Math.abs(Math.sqrt(getDistance(this.player.hitbox.x, this.player.hitbox.y, this.spider.x, this.spider.y))) < 20 && !this.player.merge && !this.player.win) {
      //Player dead
      //this.scene.pause();
      this.scene.launch("DeadScene");
      //this.player.hitbox.x = 60
      //this.player.hitbox.y = 570
    }
    this.render.update(this.player.hitbox.x, this.player.hitbox.y, [{x: this.render.canvas.x + this.spider.sprite.x*this.render.canvas.scale, y: this.render.canvas.y + this.spider.sprite.y*this.render.canvas.scale, scale: 4}, {x: this.render.canvas.x + this.winorb.sprite.x*this.render.canvas.scale, y: this.render.canvas.y + this.winorb.sprite.y*this.render.canvas.scale, scale: 2}])

  }
}

function getDistance(x1, y1, x2, y2){
  if(!x1 || !y1 || !x2 || !y2) return 1000000000
  return (x2-x1)**2 + (y2-y1)**2
}

class WinOrb {
  constructor(x, y) {
    this.x = x
    this.y = y

    this.radius = 100
    this.time = 0

    this.sprite = new RenderObject(
      Render.scene.add.circle(0, 0, this.radius, 0xffffff),
      this.x,
      this.y
    );
  }

  update(delta) {
    this.time += delta;

    const breathing = Math.sin(this.time * 0.002)

    const newRadius = this.radius + breathing * 10

    this.sprite.object.setRadius(newRadius)
  }
}