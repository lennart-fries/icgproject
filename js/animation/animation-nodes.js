/**
 * Class representing an Animation
 */

import { Matrix } from '../primitives/matrix.js'
import { Vector } from '../primitives/vector.js'

/**
 * Class representing an animation, attaching to a group node and modifying it every frame
 */
export class AnimationNode {
  /**
   * Creates a new AnimationNode
   * @param {String} name             - Name of the AnimationNode
   * @param {GroupNode} groupNode     - GroupNode to attach to
   * @param {number} speed            - Speed multiplier for the animation
   * @param {Boolean} active          - Whether the animation is active by default
   * @param {Vector} axesOrDirections - Axes or directions to animate
   * @param {Function} applyFunction  - Function to transform the axis/direction vector into a matrix (e.g. rotation)
   */
  constructor (name, groupNode, speed, active, axesOrDirections, applyFunction) {
    this.name = name
    this.groupNode = groupNode
    this.speed = speed
    this.active = active
    this.axesOrDirections = axesOrDirections
    this.applyFunction = applyFunction
    this.applyFunctionName = applyFunction.name
  }

  /**
   * Toggles the active state of the animation node
   */
  toggleActive () {
    this.active = !this.active
  }

  /**
   * Calculates the rotation angle, movement speed or scaling/shear factor
   * @param {number} delta - Time difference the animation is advanced by, scaled by the speed
   * @return {number}        Movement that the attached group node is multiplied by
   */
  calculateMovement (delta) {
    return delta
  }

  /**
   * Advances the animation by deltaT
   * @param {number} deltaT - Time difference the animation is advanced by
   */
  simulate (deltaT) {
    // change the matrix of the attached group node to reflect the animation
    if (this.active) {
      this.groupNode.matrix = this.groupNode.matrix.mul(
        this.applyFunction(
          this.axesOrDirections.mul(this.calculateMovement((deltaT / 1000) * this.speed))
        )
      )
    }
  }

  toJSON () {
    return {
      type: 'AnimationNode',
      name: this.name,
      groupNodeName: this.groupNode.name,
      speed: this.speed,
      active: this.active,
      axesOrDirections: this.axesOrDirections,
      applyFunctionName: this.applyFunctionName // doesnt work properly?
    }
  }

  static fromJson (node, nodes) {
    let groupNode = getNodeByName(node.groupNodeName, nodes)
    let name = node.name
    let speed = node.speed
    let active = node.active
    let axesOrDirections = new Vector(node.axesOrDirections.data)
    let applyFunction
    switch (node.applyFunctionName) {
      case 'rotation':
        applyFunction = Matrix.rotation
        break
      case 'translation':
        applyFunction = Matrix.translation
        break
      case 'scaling':
        applyFunction = Matrix.scaling
        break
      case 'shear':
        applyFunction = Matrix.shear
        break
      case 'shearLower':
        applyFunction = Matrix.shearLower
        break
    }
    return new AnimationNode(name, groupNode, speed, active, axesOrDirections, applyFunction)
  }
}

/**
 * Class representing a back-and-forth animation
 * @extends AnimationNode
 */
export class BackAndForthAnimationNode extends AnimationNode {
  /**
   * Creates a new RotationNode
   * @param {String} name             - Name of the BackAndForthAnimationNode
   * @param {GroupNode} groupNode     - Group node to attach to
   * @param {number} speed            - Speed multiplier for the animation
   * @param {Boolean} active          - Whether the animation is active by default
   * @param {Vector} axesOrDirections - Axes or directions to animate
   * @param {Function} applyFunction  - Function to transform the axis/direction vector into a matrix (e.g. rotation)
   * @param {number} limit            - How far to move in total
   * @param {number} startPosition    - Where in the movement to start at
   */
  constructor (name, groupNode, speed, active, axesOrDirections, applyFunction, limit, startPosition = 0) {
    super(name, groupNode, speed, active, axesOrDirections, applyFunction)
    this.limit = limit
    this.startPosition = startPosition
    this.position = startPosition
    this.invert = false
  }

  /**
   * Calculates the movement matrix
   * @param {number} delta - Time difference the animation is advanced by, scaled by the speed
   * @return {number}        Matrix that the matrix of the attached group node is multiplied by
   */
  calculateMovement (delta) {
    // first restrict relative movement to limit...
    let newPosition = this.position + ((delta % this.limit) * (this.invert ? -1 : 1))
    // then restrict new position
    if (newPosition > this.limit) {
      this.invert = true
      newPosition = 2 * this.limit - newPosition
    } else if (newPosition < 0) {
      this.invert = false
      newPosition = -newPosition
    }
    // calculate the difference between the current and new position
    let movement = newPosition - this.position
    this.position = newPosition
    return movement
  }

  toJSON () {
    return {
      type: 'BackAndForthAnimationNode',
      name: this.name,
      groupNodeName: this.groupNode.name,
      speed: this.speed,
      active: this.active,
      axesOrDirections: this.axesOrDirections,
      applyFunctionName: this.applyFunctionName,
      limit: this.limit,
      position: this.startPosition
    }
  }

  static fromJson (node, nodes) {
    let groupNode = getNodeByName(node.groupNodeName, nodes)
    let name = node.name
    let speed = node.speed
    let active = node.active
    let axesOrDirections = new Vector(node.axesOrDirections.data)
    let applyFunction
    switch (node.applyFunctionName) {
      case 'rotation':
        applyFunction = Matrix.rotation
        break
      case 'translation':
        applyFunction = Matrix.translation
        break
      case 'scaling':
        applyFunction = Matrix.scaling
        break
      case 'shear':
        applyFunction = Matrix.shear
        break
    }
    let limit = node.limit
    let position = node.position
    return new BackAndForthAnimationNode(name, groupNode, speed, active, axesOrDirections, applyFunction, limit, position)
  }
}

export class RelativeMovementAnimationNode extends AnimationNode {
  /**
   * Creates a new Relative Movement Node
   * @param {String} name             - Name of the RelativeMovementAnimationNode
   * @param {GroupNode} groupNode     - Group node to attach to
   * @param {number} speed            - Speed multiplier for the animation
   * @param {Boolean} active          - Whether the animation is active by default
   * @param {Vector} axesOrDirections - Axes or directions to animate
   * @param {Function} applyFunction  - Function to transform the axis/direction vector into a matrix (e.g. rotation)
   * @param referenceNode             - The Point of reference for this Node
   */
  constructor (name, groupNode, speed, active, axesOrDirections, applyFunction, referenceNode) {
    super(name, groupNode, speed, active, axesOrDirections, applyFunction)
    this.referenceNode = referenceNode
  }

  /**
   * Advances the animation by deltaT
   * @param {number} deltaT - Time difference the animation is advanced by
   */
  simulate (deltaT) {
    // change the matrix of the attached group node to reflect the animation
    if (this.active) {
      this.groupNode.matrix = this.groupNode.matrix.mul(
        this.applyFunction(
          this.referenceNode.matrix.mul(this.axesOrDirections.mul(this.calculateMovement((deltaT / 1000) * this.speed)))
        )
      )
    }
  }

  toJSON () {
    return {
      type: 'RelativeMovementAnimationNode',
      name: this.name,
      groupNodeName: this.groupNode.name,
      speed: this.speed,
      active: this.active,
      axesOrDirections: this.axesOrDirections,
      applyFunctionName: this.applyFunctionName,
      referenceNodeName: this.referenceNode.name
    }
  }

  static fromJson (node, nodes) {
    let groupNode = getNodeByName(node.groupNodeName, nodes)
    let name = node.name
    let speed = node.speed
    let active = node.active
    let axesOrDirections = new Vector(node.axesOrDirections.data)
    let applyFunction
    switch (node.applyFunctionName) {
      case 'rotation':
        applyFunction = Matrix.rotation
        break
      case 'translation':
        applyFunction = Matrix.translation
        break
      case 'scaling':
        applyFunction = Matrix.scaling
        break
      case 'shear':
        applyFunction = Matrix.shear
        break
    }
    let referenceNode = getNodeByName(node.referenceNodeName, nodes)
    return new RelativeMovementAnimationNode(name, groupNode, speed, active, axesOrDirections, applyFunction, referenceNode)
  }
}

function getNodeByName (name, nodes) {
  return nodes.get(name)
}
