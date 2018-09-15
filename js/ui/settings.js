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

    // construct scene graph
    const colorsCube = [
      new Vector(0.0, 1.0, 0.0, 1.0),
      new Vector(0.0, 0.0, 1.0, 1.0),
      new Vector(1.0, 0.0, 0.0, 1.0),
      new Vector(0.0, 0.0, 0.0, 1.0),
      new Vector(0.0, 1.0, 0.0, 1.0),
      new Vector(1.0, 0.0, 0.0, 1.0),
      new Vector(0.0, 1.0, 0.0, 1.0),
      new Vector(0.0, 0.0, 1.0, 1.0),
      new Vector(1.0, 0.0, 0.0, 1.0),
      new Vector(0.0, 0.0, 0.0, 1.0),
      new Vector(0.0, 1.0, 0.0, 1.0),
      new Vector(1.0, 0.0, 0.0, 1.0)
    ]

    const colorsCubeHalf = [
      new Vector(0.0, 1.0, 0.0, 1.0),
      new Vector(0.0, 0.0, 1.0, 1.0),
      new Vector(1.0, 0.0, 0.0, 1.0),
      new Vector(0.0, 0.0, 0.0, 1.0),
      new Vector(0.0, 1.0, 0.0, 1.0),
      new Vector(1.0, 0.0, 0.0, 1.0)
    ]

    const colorsPyramid = [
      new Vector(0.5, 0.5, 0.1, 1.0),
      new Vector(0.5, 0.1, 0.1, 1.0),
      new Vector(0.1, 0.1, 0.5, 1.0),
      new Vector(0.1, 0.5, 0.1, 1.0),
      new Vector(0.5, 0.5, 0.1, 1.0),
      new Vector(0.5, 0.1, 0.1, 1.0),
      new Vector(0.1, 0.1, 0.5, 1.0),
      new Vector(0.1, 0.5, 0.1, 1.0)
    ]

    const colorsPyramidHalf = [
      new Vector(0.5, 0.5, 0.1, 1.0),
      new Vector(0.5, 0.1, 0.1, 1.0),
      new Vector(0.1, 0.1, 0.5, 1.0),
      new Vector(0.1, 0.5, 0.1, 1.0)
    ]

    const colorsSphere = [
      new Vector(0.0, 1.0, 0.0, 1.0),
      new Vector(0.0, 0.0, 1.0, 1.0),
      new Vector(1.0, 0.0, 0.0, 1.0)
    ]

    const desktopCube = new AABoxNode(
      'desktopCube',
      new Vector(-8, -8, -8, 1),
      new Vector(8, 8, 8, 1),
      new Vector(0.3, 0.3, 0.3, 1),
      new Vector(0.3, 0.6, 1.5, 4)
    )
    nodes.set(desktopCube.name, desktopCube)
    const sDesktopCube = new NodePlacement(desktopCube.name)

    const mappedCubeL = new AABoxNode(
      'mappedCubeL',
      new Vector(-1.5, 2, 0.25, 1),
      new Vector(1.5, 5, 3.25, 1),
      colorsCube,
      new Vector(0.3, 0.6, 1.5, 4),
      'assets/diamond_ore.png',
      'assets/diamond_ore_n.png'
    )
    nodes.set(mappedCubeL.name, mappedCubeL)
    const sMappedCubeL = new NodePlacement(mappedCubeL.name)

    const texturedCubeL = new AABoxNode(
      'texturedCubeL',
      new Vector(-1.5, 2, 0.25, 1),
      new Vector(1.5, 5, 3.25, 1),
      colorsCube,
      new Vector(0.3, 0.6, 1.5, 4),
      'assets/diamond_ore.png'
    )
    nodes.set(texturedCubeL.name, texturedCubeL)
    const sTexturedCubeL = new NodePlacement(texturedCubeL.name)

    const coloredCubeL = new AABoxNode(
      'coloredCubeL',
      new Vector(-1.5, 2, 0.25, 1),
      new Vector(1.5, 5, 3.25, 1),
      colorsCube,
      new Vector(0.3, 0.6, 1.5, 4)
    )
    nodes.set(coloredCubeL.name, coloredCubeL)
    const sColoredCubeL = new NodePlacement(coloredCubeL.name)

    const oneColoredCubeL = new AABoxNode(
      'oneColoredCubeL',
      new Vector(-1.5, 2, 0.25, 1),
      new Vector(1.5, 5, 3.25, 1),
      colorsCubeHalf,
      new Vector(0.3, 0.6, 1.5, 4)
    )
    nodes.set(oneColoredCubeL.name, oneColoredCubeL)
    const sOneColoredCubeL = new NodePlacement(oneColoredCubeL.name)

    const texturedCubeS = new AABoxNode(
      'texturedCubeS',
      new Vector(2, -1.5, 2, 1),
      new Vector(3, -0.5, 3, 1),
      new Vector(0.3, 0.6, 1.5, 4),
      colorsCube,
      'assets/diamond_ore.png'
    )
    nodes.set(texturedCubeS.name, texturedCubeS)
    const sTexturedCubeS = new NodePlacement(texturedCubeS.name)

    const mappedSphereL = new SphereNode(
      'mappedSphereL',
      new Vector(-4, -3, 2.15, 0),
      2.0,
      colorsSphere,
      new Vector(0.3, 0.6, 1.5, 4),
      'assets/diamond_ore.png',
      'assets/diamond_ore_n.png'
    )
    nodes.set(mappedSphereL.name, mappedSphereL)
    const sMappedSphereL = new NodePlacement(mappedSphereL.name)

    const texturedSphereL = new SphereNode(
      'texturedSphereL',
      new Vector(-4, -3, 2.15, 0),
      2.0,
      colorsSphere,
      new Vector(0.3, 0.6, 1.5, 4),
      'assets/diamond_ore.png'
    )
    nodes.set(texturedSphereL.name, texturedSphereL)
    const sTexturedSphereL = new NodePlacement(texturedSphereL.name)

    const coloredSphereL = new SphereNode(
      'coloredSphereL',
      new Vector(-4, -3, 2.15, 0),
      2.0,
      new Vector(0.5, 0, 0.5, 1),
      new Vector(0.3, 0.6, 1.5, 4)
    )
    nodes.set(coloredSphereL.name, coloredSphereL)
    const sColoredSphereL = new NodePlacement(coloredSphereL.name)

    const coloredSphereS = new SphereNode(
      'coloredSphereS',
      new Vector(2.5, 5.5, 1.75, 0),
      0.6,
      colorsSphere,
      new Vector(0.3, 0.6, 1.5, 4)
    )
    nodes.set(coloredSphereS.name, coloredSphereS)
    const sColoredSphereS = new NodePlacement(coloredSphereS.name)

    const mappedPyramidL = new PyramidNode(
      'mappedPyramidL',
      new Vector(1.5, -1.5, 1, 1),
      2.5,
      colorsPyramid,
      new Vector(0.3, 0.6, 1.5, 4),
      'assets/diamond_ore.png',
      'assets/diamond_ore_n.png'
    )
    nodes.set(mappedPyramidL.name, mappedPyramidL)
    const sMappedPyramidL = new NodePlacement(mappedPyramidL.name)

    const texturedPyramidL = new PyramidNode(
      'texturedPyramidL',
      new Vector(1.5, -1.5, 1, 1),
      2.5,
      colorsPyramid,
      new Vector(0.3, 0.6, 1.5, 4),
      'assets/diamond_ore.png'
    )
    nodes.set(texturedPyramidL.name, texturedPyramidL)
    const sTexturedPyramidL = new NodePlacement(texturedPyramidL.name)

    const coloredPyramidL = new PyramidNode(
      'coloredPyramidL',
      new Vector(1.5, -1.5, 1, 1),
      2.5,
      colorsPyramid,
      new Vector(0.3, 0.6, 1.5, 4)
    )
    nodes.set(coloredPyramidL.name, coloredPyramidL)
    const sColoredPyramidL = new NodePlacement(coloredPyramidL.name)

    const oneColoredPyramidL = new PyramidNode(
      'oneColoredPyramidL',
      new Vector(1.5, -1.5, 1, 1),
      2.5,
      colorsPyramidHalf,
      new Vector(0.3, 0.6, 1.5, 4)
    )
    nodes.set(oneColoredPyramidL.name, oneColoredPyramidL)
    const sOneColoredPyramidL = new NodePlacement(oneColoredPyramidL.name)

    const mappedPyramidS = new PyramidNode(
      'mappedPyramidS',
      new Vector(-4, -0.5, 2.15, 4),
      1,
      colorsPyramid,
      new Vector(0.3, 0.6, 1.5, 4),
      'assets/diamond_ore.png',
      'assets/diamond_ore_n.png'
    )
    nodes.set(mappedPyramidS.name, mappedPyramidS)
    const sMappedPyramidS = new NodePlacement(mappedPyramidS.name)

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

    const westSide = new GroupNode('westSide', Matrix.translation(new Vector(0, 0, 8, 0)))
    nodes.set(westSide.name, westSide)
    const sWestSide = new NodePlacement(westSide.name)
    sGn0.add(sWestSide)
    sWestSide.add(sColoredCubeL)
    sWestSide.add(sColoredSphereS)
    sWestSide.add(sTexturedSphereL)
    sWestSide.add(sColoredPyramidL)

    const rotateSouth = new GroupNode('rotateSouth', Matrix.rotation(new Vector(0, Math.PI / 2, 0, 0)))
    nodes.set(rotateSouth.name, rotateSouth)
    const sRotateSouth = new NodePlacement(rotateSouth.name)
    sGn0.add(sRotateSouth)

    const southSide = new GroupNode('southSide', Matrix.translation(new Vector(0, 0, 8, 0)))
    nodes.set(southSide.name, southSide)
    const sSouthSide = new NodePlacement(southSide.name)
    sRotateSouth.add(sSouthSide)
    sSouthSide.add(sMappedCubeL)
    sSouthSide.add(sMappedSphereL)
    sSouthSide.add(sMappedPyramidS)
    sSouthSide.add(sMappedPyramidL)

    const rotateEast = new GroupNode('rotateEast', Matrix.rotation(new Vector(0, Math.PI, 0, 0)))
    nodes.set(rotateEast.name, rotateEast)
    const sRotateEast = new NodePlacement(rotateEast.name)
    sGn0.add(sRotateEast)

    const eastSide = new GroupNode('eastSide', Matrix.translation(new Vector(0, 0, 8, 0)))
    nodes.set(eastSide.name, eastSide)
    const sEastSide = new NodePlacement(eastSide.name)
    sRotateEast.add(sEastSide)
    sEastSide.add(sColoredCubeL)
    sEastSide.add(sMappedSphereL)
    sEastSide.add(sTexturedPyramidL)
    sEastSide.add(sTexturedCubeS)

    const rotateNorth = new GroupNode('rotateNorth', Matrix.rotation(new Vector(0, -Math.PI / 2, 0, 0)))
    nodes.set(rotateNorth.name, rotateNorth)
    const sRotateNorth = new NodePlacement(rotateNorth.name)
    sGn0.add(sRotateNorth)

    const northSide = new GroupNode('northSide', Matrix.translation(new Vector(0, 0, 8, 0)))
    nodes.set(northSide.name, northSide)
    const sNorthSide = new NodePlacement(northSide.name)
    sRotateNorth.add(sNorthSide)
    sNorthSide.add(sOneColoredCubeL)
    sNorthSide.add(sColoredSphereL)
    sNorthSide.add(sOneColoredPyramidL)

    const gn1 = new GroupNode('gn1', Matrix.translation(new Vector(1, 1, 0, 0.0)))
    nodes.set(gn1.name, gn1)
    const sGn1 = new NodePlacement(gn1.name)
    sGn0.add(sGn1)

    const gn3 = new GroupNode('gn3', Matrix.identity())
    nodes.set(gn3.name, gn3)
    const sGn3 = new NodePlacement(gn3.name)
    sGn1.add(sGn3)

    const gn2 = new GroupNode('gn2', Matrix.identity())
    nodes.set(gn2.name, gn2)
    const sGn2 = new NodePlacement(gn2.name)
    sGn0.add(sGn2)

    const gn4 = new GroupNode('gn4', Matrix.identity())
    nodes.set(gn4.name, gn4)
    const sGn4 = new NodePlacement(gn4.name)
    sGn0.add(sGn4)

    // sGn3.add(sCube2)
    sGn2.add(sDesktopCube)
    /* sGn2.add(sMappedCubeL)
    sGn2.add(sMappedPyramidL)
    sGn2.add(sMappedSphereL)
    sGn2.add(sMappedPyramidS)
    sGn2.add(sColoredSphereS)
    sGn2.add(sTexturedCubeS) */

    const light1 = new LightNode('light1', new Vector(20, 0, 0, 1), 0.1)
    nodes.set(light1.name, light1)
    const sLight1 = new NodePlacement(light1.name)
    sGn1.add(sLight1)

    const light2 = new LightNode('light2', new Vector(-20, 0, 0, 1), 0.1)
    nodes.set(light2.name, light2)
    const sLight2 = new NodePlacement(light2.name)
    sGn1.add(sLight2)

    const light3 = new LightNode('light3', new Vector(0, 20, 0, 1), 0.1)
    nodes.set(light3.name, light3)
    const sLight3 = new NodePlacement(light3.name)
    sGn1.add(sLight3)

    const light4 = new LightNode('light4', new Vector(0, -20, 0, 1), 0.1)
    nodes.set(light4.name, light4)
    const sLight4 = new NodePlacement(light4.name)
    sGn1.add(sLight4)

    const light5 = new LightNode('light5', new Vector(0, 0, 20, 1), 0.1)
    nodes.set(light5.name, light5)
    const sLight5 = new NodePlacement(light5.name)
    sGn1.add(sLight5)

    const light6 = new LightNode('light6', new Vector(0, 0, -20, 1), 0.1)
    nodes.set(light6.name, light6)
    const sLight6 = new NodePlacement(light6.name)
    sGn1.add(sLight6)

    const cameraNode = new CameraNode('cameraNode', new Vector(0, 0, 15, 1), new Vector(0, 0, -1, 0), new Vector(0, 1, 0, 0), 60, 1, 0.1, 100)
    nodes.set(cameraNode.name, cameraNode)
    const sCameraNode = new NodePlacement(cameraNode.name)
    sCameraRotate.add(sCameraNode)

    let animationNodes = new Map()
    // Free Flight Forward
    let ffForward = new RelativeMovementAnimationNode('Free Flight Forward', cameraTranslate, 8.0, false, new Vector(0, 0, -1, 0), Matrix.translation, cameraRotate)
    animationNodes.set(ffForward.name, ffForward)
    // Free Flight Backwards
    let ffBackwards = new RelativeMovementAnimationNode('Free Flight Backwards', cameraTranslate, 8.0, false, new Vector(0, 0, 1, 0), Matrix.translation, cameraRotate)
    animationNodes.set(ffBackwards.name, ffBackwards)
    // Free Flight Left
    let ffLeft = new RelativeMovementAnimationNode('Free Flight Left', cameraTranslate, 8.0, false, new Vector(-1, 0, 0, 0), Matrix.translation, cameraRotate)
    animationNodes.set(ffLeft.name, ffLeft)
    // Free Flight Right
    let ffRight = new RelativeMovementAnimationNode('Free Flight Right', cameraTranslate, 8.0, false, new Vector(1, 0, 0, 0), Matrix.translation, cameraRotate)
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
    this.settingsObj.scenegraphStructure = [sGn0]
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
