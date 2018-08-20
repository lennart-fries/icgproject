/* global history */

import { Raster } from '../rendering/raster.js'
import { Ray } from '../rendering/ray.js'

const renderersToClasses = {'Raster': Raster, 'Ray': Ray}
const renderers = Object.keys(renderersToClasses)

export class Settings {
  constructor () {
    this.settingsStr = {renderer: 'Raster', renderResolution: '1'}
    this.settingsObj = {}
    this.setSettings(this.settingsStr)
    console.log(this)
  }

  setURL () {
    let newParams = new URLSearchParams()
    for (let settingKey in this.settingsStr) {
      if (this.settingsStr.hasOwnProperty(settingKey)) {
        newParams.set(settingKey, this.settingsStr[settingKey])
      }
    }
    history.replaceState({}, '', 'index.html?' + newParams.toString())
  }

  setSettings (newSettings) {
    for (let settingKey in newSettings) {
      if (newSettings.hasOwnProperty(settingKey)) {
        switch (settingKey) {
          case 'renderer':
            let newRenderer = newSettings.renderer
            console.log(this, newRenderer)
            if (renderers.includes(newSettings.renderer)) {
              this.settingsStr.renderer = newRenderer
              this.settingsObj.renderer = renderersToClasses[newRenderer]
            }
            console.log(this, newRenderer)
            break
          case 'renderResolution':
            let newRes = parseInt(newSettings.renderResolution)
            console.log(this, newRes)
            if (newRes > 0) {
              this.settingsStr.renderResolution = newRes.toString()
              this.settingsObj.renderResolution = newRes
            }
            console.log(this, newRes)
            break
        }
      }
    }
  }

  set settings (newSettings) {
    this.setSettings(newSettings)
    this.setURL()
  }

  get settings () {
    return this.settingsObj
  }
}
