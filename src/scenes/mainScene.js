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
    this.physics.addObject(this.player.hitbox) //Add players
    this.physics.addObject(...this.level.bodies.flat()) //Add level blocks

    //Render
    this.render = new Render()
  }

  update(){
    this.physics.update()
  }
}