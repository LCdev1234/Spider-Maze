import './style.css'
import Phaser from "phaser"
import Main from "./scenes/mainScene"
import DeadScene from "./scenes/deadScene"
import WinScene from './scenes/winScene'
import TutorialScene from './scenes/tutorialScene'

const config = {
  type: Phaser.WEBGL,
  canvas: gameCanvas,
  fps: {
    target: 60,
    forceSetTimeOut: false,
    smoothStep: false
  },
  scale: {
      mode: Phaser.Scale.RESIZE,
      width: "100%",
      height: "100%",
  },
  scene:[Main, DeadScene, WinScene, TutorialScene]
}

const game = new Phaser.Game(config)