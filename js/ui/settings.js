/* global history */

import { RasterRenderer } from '../rendering/raster-renderer.js'
import { RayRenderer } from '../rendering/ray-renderer.js'
import { JsonDeserializer } from '../scenegraph/JsonSerializer.js'
import { AABoxNode, CameraNode, GroupNode, LightNode, PyramidNode, SphereNode } from '../scenegraph/nodes.js'
import { Matrix } from '../primitives/matrix.js'
import { Vector } from '../primitives/vector.js'
import { AnimationNode, BackAndForthAnimationNode } from '../animation/animation-nodes.js'

const renderersToClasses = {'Raster': RasterRenderer, 'Ray': RayRenderer}
const renderers = Object.keys(renderersToClasses)

export class Settings {
  /**
   * Creates a new settings object with the default settings
   */
  constructor () {
    this.settingsStr = {renderer: 'Raster', renderResolution: '1', backgroundColor: '000000'}
    this.settingsObj = {}
    this.setSettings(this.settingsStr)
    // console.log(this)

    // construct scene graph
    let scenegraph = new GroupNode(Matrix.identity())
    const gn1 = new GroupNode(Matrix.translation(new Vector(1, 1, 0, 0.0)))
    scenegraph.add(gn1)
    const gn3 = new GroupNode(Matrix.identity())
    gn1.add(gn3)
    const sphere = new SphereNode(
      new Vector(0.5, -0.8, 0, 1),
      0.4,
      new Vector(0.8, 0.4, 0.1, 1),
      new Vector(0.3, 0.6, 1.5, 4)
      // 'assets/diamond_ore.png'
    )
    gn3.add(sphere)

    const gn2 = new GroupNode(Matrix.translation(new Vector(-0.7, -0.4, 0.1, 0.0)))
    scenegraph.add(gn2)

    const gn4 = new GroupNode(Matrix.identity())

    scenegraph.add(gn4)

    const colorsArray = [
      new Vector(0.0, 1.0, 0.0, 1.0),
      new Vector(0.0, 0.0, 1.0, 1.0),
      new Vector(1.0, 0.0, 0.0, 1.0),
      new Vector(0.0, 0.0, 0.0, 1.0),
      new Vector(0.0, 1.0, 0.0, 1.0),
      new Vector(1.0, 0.0, 0.0, 1.0),
      new Vector(1.0, 0.0, 1.0, 1.0),
      new Vector(0.0, 0.0, 1.0, 1.0)
    ]

    const colorVector = new Vector(0.0, 1.0, 0.0, 1.0)

    const cube = new AABoxNode(
      new Vector(-1, -1, -1, 1),
      new Vector(1, 1, 1, 1),
      colorVector,
      new Vector(0.3, 0.6, 1.5, 4),
      'assets/diamond_ore.png'
    )
    gn2.add(cube)

    const pyramid = new PyramidNode(
      new Vector(1.1, -1.5, 0.5, 0),
      1.5,
      colorsArray,
      new Vector(0.3, 0.6, 1.5, 4)
    )

    gn4.add(pyramid)

    const light1 = new LightNode(new Vector(-10, 3, 3, 1), 0.2)
    gn1.add(light1)
    const light2 = new LightNode(new Vector(10, 3, 3, 1), 0.2)
    gn1.add(light2)

    const cameraNode = new CameraNode(new Vector(0, 0, 10, 1), new Vector(0, 0, 0, 1), new Vector(0, 1, 0, 0), 60, 1, 0.1, 100)
    gn1.add(cameraNode)

    let animationNodes = [
      new AnimationNode(gn2, 1.0, true, new Vector(0, 0.5, 0.5, 0), Matrix.rotation),
      new BackAndForthAnimationNode(gn3, 1.0, true, new Vector(0, 0, 1, 0), Matrix.translation, 3, 1.5),
      new AnimationNode(gn4, 1.0, true, new Vector(1, 0, 0, 0), Matrix.rotation)
    ]

    this.settingsObj.scenegraph = scenegraph
    this.settingsObj.animationNodes = animationNodes
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
            this.settingsObj.scenegraph = newSG.scenegraph
            this.settingsObj.animationNodes = newSG.animationNodes
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

  /*
  get scenegraph () {
    let sg = this.sg
    this.sg = null
    return sg
  }

  get animationNodes () {
    let animationNodes = this.animationNodesArray
    this.animationNodesArray = null
    return animationNodes
  }
  */
}
