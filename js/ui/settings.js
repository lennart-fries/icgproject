/* global history */

import { RasterRenderer } from '../rendering/raster-renderer.js'
import { RayRenderer } from '../rendering/ray-renderer.js'
import { JsonDeserializer } from '../scenegraph/JsonDeserializer.js'
import {
  NodePlacement,
  AABoxNode,
  CameraNode,
  GroupNode,
  LightNode,
  PyramidNode,
  SphereNode
} from '../scenegraph/nodes.js'
import { Matrix } from '../primitives/matrix.js'
import { Vector } from '../primitives/vector.js'
import {
  AnimationNode,
  BackAndForthAnimationNode,
  RelativeMovementAnimationNode
} from '../animation/animation-nodes.js'
import { PushKeybind, ToggleKeybind } from './keybinds.js'

const renderersToClasses = {'Raster': RasterRenderer, 'Ray': RayRenderer}
const renderers = Object.keys(renderersToClasses)

export class Settings {
  /**
   * Creates a new settings object with the default settings
   */
  constructor () {
    let nodes = new Map()
    this.settingsStr = {renderer: 'Raster', renderResolution: '1', backgroundColor: '000000'}
    this.settingsObj = {}
    this.setSettings(this.settingsStr)

    // construct scene graph
    const gn0 = new GroupNode('scenegraphRoot', Matrix.identity())
    nodes.set(gn0.name, gn0)
    const sGn0 = new NodePlacement(gn0.name)

    const cameraTranslate = new GroupNode('cameraTranslate', Matrix.translation(new Vector(0, 0, 10, 0)))
    nodes.set(cameraTranslate.name, cameraTranslate)
    const sCameraTranslate = new NodePlacement(cameraTranslate.name)
    sGn0.add(sCameraTranslate)

    const cameraRotate = new GroupNode('cameraRotate', Matrix.identity())
    nodes.set(cameraRotate.name, cameraRotate)
    const sCameraRotate = new NodePlacement(cameraRotate.name)
    sCameraTranslate.add(sCameraRotate)

    const gn1 = new GroupNode('gn1', Matrix.translation(new Vector(1, 1, 0, 0.0)))
    nodes.set(gn1.name, gn1)
    const sGn1 = new NodePlacement(gn1.name)
    sGn0.add(sGn1)

    const gn3 = new GroupNode('gn3', Matrix.identity())
    nodes.set(gn3.name, gn3)
    const sGn3 = new NodePlacement(gn3.name)
    sGn1.add(sGn3)

    const sphere = new SphereNode('sphere', new Vector(0.5, -0.8, 0, 1), 0.4,
      new Vector(0.8, 0.4, 0.1, 1), new Vector(0.3, 0.6, 1.5, 4),
      'assets/diamond_ore.png', 'assets/diamond_ore_n.png')
    nodes.set(sphere.name, sphere)
    const sSphere = new NodePlacement(sphere.name)
    sGn3.add(sSphere)

    const gn2 = new GroupNode('gn2', Matrix.translation(new Vector(-0.7, -0.4, 0.1, 0.0)))
    nodes.set(gn2.name, gn2)
    const sGn2 = new NodePlacement(gn2.name)
    sGn0.add(sGn2)

    const gn4 = new GroupNode('gn4', Matrix.identity())
    nodes.set(gn4.name, gn4)
    const sGn4 = new NodePlacement(gn4.name)
    sGn0.add(sGn4)

    const cube = new AABoxNode('cube', new Vector(-1, -1, -1, 1),
      new Vector(1, 1, 1, 1), new Vector(0.0, 1.0, 0.0, 1.0),
      new Vector(0.3, 0.6, 1.5, 4), 'assets/diamond_ore.png' /*, 'assets/diamond_ore_n.png' */)
    nodes.set(cube.name, cube)
    const sCube = new NodePlacement(cube.name)
    sGn2.add(sCube)

    const colorsArray = [
      new Vector(0.0, 1.0, 0.0, 1.0),
      new Vector(0.0, 0.0, 1.0, 1.0),
      new Vector(1.0, 0.0, 0.0, 1.0)/* ,
  new Vector(0.0, 0.0, 0.0, 1.0),
  new Vector(0.0, 1.0, 0.0, 1.0),
  new Vector(1.0, 0.0, 0.0, 1.0),
  new Vector(1.0, 0.0, 1.0, 1.0),
  new Vector(0.0, 0.0, 1.0, 1.0) */
    ]

    const pyramid = new PyramidNode('pyramid', new Vector(1.1, -1.5, 0.5, 0), 1.5,
      colorsArray, new Vector(0.3, 0.6, 1.5, 4),
      'assets/diamond_ore.png', 'assets/diamond_ore_n.png')
    nodes.set(pyramid.name, pyramid)
    const sPyramid = new NodePlacement(pyramid.name)
    sGn1.add(sPyramid)

    const light1 = new LightNode('light1', new Vector(-10, 3, 3, 1), 0.2)
    nodes.set(light1.name, light1)
    const sLight1 = new NodePlacement(light1.name)
    sGn1.add(sLight1)

    const light2 = new LightNode('light2', new Vector(10, 3, 3, 1), 0.2)
    nodes.set(light2.name, light2)
    const sLight2 = new NodePlacement(light2.name)
    sGn1.add(sLight2)

    const cameraNode = new CameraNode('cameraNode', new Vector(0, 0, 0, 1), new Vector(0, 0, -1, 0), new Vector(0, 1, 0, 0), 60, 1, 0.1, 100)
    nodes.set(cameraNode.name, cameraNode)
    const sCameraNode = new NodePlacement(cameraNode.name)
    sCameraRotate.add(sCameraNode)

    let animationNodes = new Map()
    // Free Flight Forward
    let ffForward = new RelativeMovementAnimationNode('Free Flight Forward', cameraTranslate, 2.0, false, new Vector(0, 0, -1, 0), Matrix.translation, cameraRotate)
    animationNodes.set(ffForward.name, ffForward)
    // Free Flight Backwards
    let ffBackwards = new RelativeMovementAnimationNode('Free Flight Backwards', cameraTranslate, 2.0, false, new Vector(0, 0, 1, 0), Matrix.translation, cameraRotate)
    animationNodes.set(ffBackwards.name, ffBackwards)
    // Free Flight Left
    let ffLeft = new RelativeMovementAnimationNode('Free Flight Left', cameraTranslate, 2.0, false, new Vector(-1, 0, 0, 0), Matrix.translation, cameraRotate)
    animationNodes.set(ffLeft.name, ffLeft)
    // Free Flight Right
    let ffRight = new RelativeMovementAnimationNode('Free Flight Right', cameraTranslate, 2.0, false, new Vector(1, 0, 0, 0), Matrix.translation, cameraRotate)
    animationNodes.set(ffRight.name, ffRight)
    // Free Flight Ascend
    let ffAscend = new RelativeMovementAnimationNode('Free Flight Ascend', cameraTranslate, 2.0, false, new Vector(0, 1, 0, 0), Matrix.translation, cameraRotate)
    animationNodes.set(ffAscend.name, ffAscend)
    // Free Flight Descend
    let ffDescend = new RelativeMovementAnimationNode('Free Flight Descend', cameraTranslate, 2.0, false, new Vector(0, -1, 0, 0), Matrix.translation, cameraRotate)
    animationNodes.set(ffDescend.name, ffDescend)
    // Free Flight Turn Upwards
    let ffTurnUpwards = new AnimationNode('Free Flight Turn Upwards', cameraRotate, 1.0, false, new Vector(-1, 0, 0, 0), Matrix.rotation)
    animationNodes.set(ffTurnUpwards.name, ffTurnUpwards)
    // Free Flight Turn Downwards
    let ffTurnDownwards = new AnimationNode('Free Flight Turn Downwards', cameraRotate, 1.0, false, new Vector(1, 0, 0, 0), Matrix.rotation)
    animationNodes.set(ffTurnDownwards.name, ffTurnDownwards)
    // Free Flight Turn Left
    let ffTurnLeft = new AnimationNode('Free Flight Turn Left', cameraRotate, 1.0, false, new Vector(0, 1, 0, 0), Matrix.rotation)
    animationNodes.set(ffTurnLeft.name, ffTurnLeft)
    // Free Flight Turn Right
    let ffTurnRight = new AnimationNode('Free Flight Turn Right', cameraRotate, 1.0, false, new Vector(0, -1, 0, 0), Matrix.rotation)
    animationNodes.set(ffTurnRight.name, ffTurnRight)
    // Free Flight Left Roll?
    let ffLeftRoll = new AnimationNode('Free Flight Left Roll', cameraRotate, 1.0, false, new Vector(0, 0, 1, 0), Matrix.rotation)
    animationNodes.set(ffLeftRoll.name, ffLeftRoll)
    // Free Flight Right Roll?
    let ffRightRoll = new AnimationNode('Free Flight Right Roll', cameraRotate, 2.0, false, new Vector(0, 0, -1, 0), Matrix.rotation)
    animationNodes.set(ffRightRoll.name, ffRightRoll)
    let aGn2 = new RelativeMovementAnimationNode('gn2', gn2, 1.0, false, new Vector(0, 0.5, 0.5, 0), Matrix.rotation, cameraRotate)
    animationNodes.set(aGn2.name, aGn2)
    let aGn3 = new BackAndForthAnimationNode('gn3', gn3, 1.0, true, new Vector(0, 0, 1, 0), Matrix.translation, 3, 1.5)
    animationNodes.set(aGn3.name, aGn3)
    let aGn4 = new AnimationNode('gn4', gn4, 1.0, true, new Vector(1, 0, 0, 0), Matrix.rotation)
    animationNodes.set(aGn4.name, aGn4)

    let keybinds = new Map()
    // Free Flight Forward
    let keyW = new PushKeybind(animationNodes.get('Free Flight Forward'), 'KeyW')
    keybinds.set(keyW.name, keyW)
    // Free Flight Backward
    let KeyS = new PushKeybind(animationNodes.get('Free Flight Backwards'), 'KeyS')
    keybinds.set(KeyS.name, KeyS)
    // Free Flight Left
    let KeyA = new PushKeybind(animationNodes.get('Free Flight Left'), 'KeyA')
    keybinds.set(KeyA.name, KeyA)
    // Free Flight Right
    let KeyD = new PushKeybind(animationNodes.get('Free Flight Right'), 'KeyD')
    keybinds.set(KeyD.name, KeyD)
    // Free Flight Ascend
    let Space = new PushKeybind(animationNodes.get('Free Flight Ascend'), 'Space')
    keybinds.set(Space.name, Space)
    // Free Flight Descend
    let ShiftLeft = new PushKeybind(animationNodes.get('Free Flight Descend'), 'ShiftLeft')
    keybinds.set(ShiftLeft.name, ShiftLeft)
    // Free Flight Turn Upwards
    let ArrowUp = new PushKeybind(animationNodes.get('Free Flight Turn Upwards'), 'ArrowUp')
    keybinds.set(ArrowUp.name, ArrowUp)
    // Free Flight Turn Downwards
    let ArrowDown = new PushKeybind(animationNodes.get('Free Flight Turn Downwards'), 'ArrowDown')
    keybinds.set(ArrowDown.name, ArrowDown)
    // Free Flight Turn Left
    let ArrowLeft = new PushKeybind(animationNodes.get('Free Flight Turn Left'), 'ArrowLeft')
    keybinds.set(ArrowLeft.name, ArrowLeft)
    // Free Flight Turn Right
    let ArrowRight = new PushKeybind(animationNodes.get('Free Flight Turn Right'), 'ArrowRight')
    keybinds.set(ArrowRight.name, ArrowRight)
    // Free Flight Left Roll
    let KeyQ = new PushKeybind(animationNodes.get('Free Flight Left Roll'), 'KeyQ')
    keybinds.set(KeyQ.name, KeyQ)
    // Free Flight Right Roll
    let KeyE = new PushKeybind(animationNodes.get('Free Flight Right Roll'), 'KeyE')
    keybinds.set(KeyE.name, KeyE)
    // Toggle Animation 1
    let Digit1 = new ToggleKeybind(animationNodes.get('gn2'), 'Digit1')
    keybinds.set(Digit1.name, Digit1)
    // Toggle Animation 2
    let Digit2 = new ToggleKeybind(animationNodes.get('gn3'), 'Digit2')
    keybinds.set(Digit2.name, Digit2)
    // Toggle Animation 3
    let Digit3 = new ToggleKeybind(animationNodes.get('gn4'), 'Digit3')
    keybinds.set(Digit3.name, Digit3)

    this.settingsObj.nodes = nodes
    this.settingsObj.animationNodes = animationNodes
    this.settingsObj.scenegraphStructure = sGn0
    this.settingsObj.keybinds = keybinds
  }

  /**
   * Appends a representation of the settings to the URL search parameters, to be loaded on refresh or as a bookmark
   */
  setURL () {
    let newParams = new URLSearchParams()
    for (let settingKey in this.settingsStr) {
      if (this.settingsStr.hasOwnProperty(settingKey)) {
        newParams.set(settingKey, this.settingsStr[settingKey])
      }
    }
    history.replaceState({}, '', 'index.html?' + newParams.toString())
  }

  /**
   * Applies the given new settings without setting the URL parameters
   * @param {Object} newSettings - New settings to be applied in string form
   */
  setSettings (newSettings) {
    for (let settingKey in newSettings) {
      if (newSettings.hasOwnProperty(settingKey)) {
        switch (settingKey) {
          case 'renderer':
            let newRenderer = newSettings.renderer
            // console.log(this, newRenderer)
            if (renderers.includes(newSettings.renderer)) {
              this.settingsStr.renderer = newRenderer
              this.settingsObj.renderer = renderersToClasses[newRenderer]
            }
            // console.log(this, newRenderer)
            break
          case 'renderResolution':
            let newRes = parseInt(newSettings.renderResolution)
            // console.log(this, newRes)
            if (newRes > 0) {
              this.settingsStr.renderResolution = newRes.toString()
              this.settingsObj.renderResolution = newRes
            }
            // console.log(this, newRes)
            break
          case 'backgroundColor':
            let newColor = parseInt(newSettings.backgroundColor, 16)
            if (newColor > -1) {
              newColor = newColor.toString(16)
              while (newColor.length < 6) {
                newColor = '0' + newColor
              }
              this.settingsStr.backgroundColor = newColor
              this.settingsObj.backgroundColor = newColor
            }
            break
          case 'scenegraph':
            let newSG = JsonDeserializer.fromJson(JSON.parse(newSettings.scenegraph))
            this.settingsObj.nodes = newSG.nodes
            this.settingsObj.animationNodes = newSG.animationNodes
            this.settingsObj.scenegraphStructure = newSG.scenegraphStructure
            this.settingsObj.keybinds = newSG.keybinds
        }
      }
    }
  }

  /**
   * Applies the given new settings, setting the URL parameters
   * @param {Object} newSettings - New settings to be applied in string form
   */
  set settings (newSettings) {
    this.setSettings(newSettings)
    this.setURL()
  }

  get settings () {
    return this.settingsObj
  }
}
