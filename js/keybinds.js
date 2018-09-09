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
}

/**
 * Class representing a Push Keybinding
 * @extends Keybind
 */
export class PushKeybind extends Keybind {
  constructor (animationNode, key) {
    super()
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
}
