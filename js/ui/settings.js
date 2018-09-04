/* global history */
/* global $ */

import { RasterRenderer } from '../rendering/raster-renderer.js'
import { RayRenderer } from '../rendering/ray-renderer.js'
import { GroupNode } from '../scenegraph/nodes.js'

const renderersToClasses = {'Raster': RasterRenderer, 'Ray': RayRenderer}
const renderers = Object.keys(renderersToClasses)

let sgTemp

export class Settings {
  /**
   * Creates a new settings object with the default settings
   */
  constructor () {
    this.settingsStr = {renderer: 'Raster', renderResolution: '1', backgroundColor: '000000'}
    this.settingsObj = {}
    this.setSettings(this.settingsStr)
    // console.log(this)
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
    //todo import scenegraph
  }

  get settings () {
    return this.settingsObj
  }

  get scenegraph () {
    let sg = this.sgTemp
    this.sgTemp = null
    return sg
  }

  setScenegraph (sg) {
    this.sgTemp = sg
  }

  loadScenegraph () {
    let file = $('#loadScenegraphFile')[0].children[0].files[0]
    let fr = new FileReader()
    fr.onload = function (e) {
      //hier iwi callback auf setScenegraph(GroupNode.fromJson(JSON.parse(e.target.result).GroupNode))
    }
    this.sgTemp = fr.readAsText(file)
  }

  saveScenegraphToJson (sg, animationNodes) {
    let sgJson = JSON.stringify(sg, null, 2)
    let animationNodesJson = JSON.stringify(animationNodes, null, 2)
    let url = URL.createObjectURL(new Blob([sgJson, animationNodesJson], {type: 'text/plain'}))
    let sgDownload = document.createElement('a')
    sgDownload.href = url
    sgDownload.download = 'scenegraph.json'
    sgDownload.click()
  }
}
