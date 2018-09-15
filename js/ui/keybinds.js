/* global $ */

/**
 * Class representing a Keybind to invoke actions on the scenegraph
 */

class Keybind {
  /**
   * Activates the specified Animation Node
   */
  activate () {

  }

  /**
   * Sets the specified AnimationNode back to Start
   */
  stop () {

  }
}

/**
 * Class representing a Toggle Keybinding
 * @extends Keybind
 */
export class ToggleKeybind extends Keybind {
  constructor (animationNode, key) {
    super()
    this.name = animationNode.name
    this.animationNode = animationNode
    this.key = key
  }

  /**
   * Toggles the specified Animation Node to the State it wasnt in previously
   */
  activate () {
    this.animationNode.toggleActive()
  }

  stop () {
  }

  toJSON () {
    return {
      name: this.name,
      type: 'ToggleKeybind',
      key: this.key
    }
  }

  static fromJson (keybind, animationNodes) {
    let name = keybind.name
    let key = keybind.key
    return new ToggleKeybind(getAnimationNodeByName(name, animationNodes), key)
  }
}

/**
 * Class representing a Push Keybinding
 * @extends Keybind
 */
export class PushKeybind extends Keybind {
  constructor (animationNode, key) {
    super()
    this.name = animationNode.name
    this.animationNode = animationNode
    this.key = key
  }

  /**
   * Sets the specified Animation Node to active
   */
  activate () {
    this.animationNode.active = true
  }

  /**
   * Sets the specified Animation Node to inactive
   */
  stop () {
    this.animationNode.active = false
  }

  toJSON () {
    return {
      name: this.name,
      type: 'PushKeybind',
      key: this.key
    }
  }

  static fromJson (keybind, animationNodes) {
    let name = keybind.name
    let key = keybind.key
    return new PushKeybind(getAnimationNodeByName(name, animationNodes), key)
  }
}

/**
 * Sets up all keybinds for usage and checks for render changing keybind
 * @param keybinds
 * @param settings
 */
export function setupKeybinds (keybinds, settings) {
  window.addEventListener('keydown', function (event) {
    for (let i = 0; i < keybinds.length; i++) {
      if (event.code === keybinds[i].key) {
        keybinds[i].activate()
      } else if (event.code === 'KeyR') {
        if (settings.settingsStr.renderer === 'Ray') {
          settings.settings = {renderer: 'Raster'}
          $('#raster').addClass('active')
          $('#ray').removeClass('active')
        } else {
          settings.settings = {renderer: 'Ray'}
          $('#ray').addClass('active')
          $('#raster').removeClass('active')
        }
      }
    }
  })

  window.addEventListener('keyup', function (event) {
    for (let i = 0; i < keybinds.length; i++) {
      if (event.code === keybinds[i].key) {
        keybinds[i].stop()
      }
    }
  })
}

function getAnimationNodeByName (name, nodes) {
  return nodes.get(name)
}
