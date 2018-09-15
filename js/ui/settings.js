/* global history */

import { RasterRenderer } from '../rendering/raster-renderer.js'
import { RayRenderer } from '../rendering/ray-renderer.js'
import { JsonDeserializer } from '../scenegraph/JsonSerializer.js'
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

    let animationNodes = [
      // Free Flight Forward
      new RelativeMovementAnimationNode(cameraTranslate, 2.0, false, new Vector(0, 0, -1, 0), Matrix.translation, cameraRotate),
      // Free Flight Backwards
      new RelativeMovementAnimationNode(cameraTranslate, 2.0, false, new Vector(0, 0, 1, 0), Matrix.translation, cameraRotate),
      // Free Flight Left
      new RelativeMovementAnimationNode(cameraTranslate, 2.0, false, new Vector(-1, 0, 0, 0), Matrix.translation, cameraRotate),
      // Free Flight Right
      new RelativeMovementAnimationNode(cameraTranslate, 2.0, false, new Vector(1, 0, 0, 0), Matrix.translation, cameraRotate),
      // Free Flight Ascend
      new RelativeMovementAnimationNode(cameraTranslate, 2.0, false, new Vector(0, 1, 0, 0), Matrix.translation, cameraRotate),
      // Free Flight Descend
      new RelativeMovementAnimationNode(cameraTranslate, 2.0, false, new Vector(0, -1, 0, 0), Matrix.translation, cameraRotate),
      // Free Flight Turn Upwards
      new AnimationNode(cameraRotate, 1.0, false, new Vector(-1, 0, 0, 0), Matrix.rotation),
      // Free Flight Turn Downwards
      new AnimationNode(cameraRotate, 1.0, false, new Vector(1, 0, 0, 0), Matrix.rotation),
      // Free Flight Turn Left
      new AnimationNode(cameraRotate, 1.0, false, new Vector(0, 1, 0, 0), Matrix.rotation),
      // Free Flight Turn Right
      new AnimationNode(cameraRotate, 1.0, false, new Vector(0, -1, 0, 0), Matrix.rotation),
      // Free Flight Left Roll?
      new AnimationNode(cameraRotate, 1.0, false, new Vector(0, 0, 1, 0), Matrix.rotation),
      // Free Flight Right Roll?
      new AnimationNode(cameraRotate, 2.0, false, new Vector(0, 0, -1, 0), Matrix.rotation),
      new RelativeMovementAnimationNode(gn2, 1.0, false, new Vector(0, 0.5, 0.5, 0), Matrix.rotation, cameraRotate),
      new BackAndForthAnimationNode(gn3, 1.0, true, new Vector(0, 0, 1, 0), Matrix.translation, 3, 1.5),
      new AnimationNode(gn4, 1.0, true, new Vector(1, 0, 0, 0), Matrix.rotation)
    ]

    this.settingsObj.nodes = nodes
    this.settingsObj.animationNodes = animationNodes
    this.settingsObj.scenegraphStructure = sGn0
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
