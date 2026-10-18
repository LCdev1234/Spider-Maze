import './style.css'
import Phaser from "phaser"
import Main from "./scenes/mainScene"

const config = {
  type: Phaser.WEBGL,
  canvas: gameCanvas,
  scale: {
      mode: Phaser.Scale.RESIZE,
      width: "100%",
      height: "100%",
  },
  scene:[Main],
}

const game = new Phaser.Game(config)