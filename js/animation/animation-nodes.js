/**
 * Class representing an Animation
 */

import { Matrix } from '../primitives/matrix'
import { GroupNode } from '../scenegraph/nodes'

/**
 * Class representing an animation, attaching to a group node and modifying it every frame
 */
export class AnimationNode {
  /**
   * Creates a new AnimationNode
   * @param {GroupNode} groupNode     - GroupNode to attach to
   * @param {number} speed            - Speed multiplier for the animation
   * @param {Boolean} active          - Whether the animation is active by default
   * @param {Vector} axesOrDirections - Axes or directions to animate
   * @param {Function} applyFunction  - Function to transform the axis/direction vector into a matrix (e.g. rotation)
   */
  constructor (groupNode, speed, active, axesOrDirections, applyFunction) {
    this.groupNode = groupNode
    this.speed = speed
    this.active = active
    this.axesOrDirections = axesOrDirections
    this.applyFunction = applyFunction
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
      groupNode: this.groupNode,
      speed: this.speed,
      active: this.active,
      axesOrDirections: this.axesOrDirections,
      applyFunction: this.applyFunction
    }
  }

  static fromJson (node) {
    // todo
    return new AnimationNode()
  }
}

/**
 * Class representing a back-and-forth animation
 * @extends AnimationNode
 */
export class BackAndForthAnimationNode extends AnimationNode {
  /**
   * Creates a new RotationNode
   * @param {GroupNode} groupNode     - Group node to attach to
   * @param {number} speed            - Speed multiplier for the animation
   * @param {Boolean} active          - Whether the animation is active by default
   * @param {Vector} axesOrDirections - Axes or directions to animate
   * @param {Function} applyFunction  - Function to transform the axis/direction vector into a matrix (e.g. rotation)
   * @param {number} limit            - How far to move in total
   * @param {number} startPosition    - Where in the movement to start at
   */
  constructor (groupNode, speed, active, axesOrDirections, applyFunction, limit, startPosition = 0) {
    super(groupNode, speed, active, axesOrDirections, applyFunction)
    this.limit = limit
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
      groupNode: this.groupNode,
      speed: this.speed,
      active: this.active,
      axesOrDirections: this.axesOrDirections,
      applyFunction: this.applyFunction,
      limit: this.limit,
      position: this.position,
      invert: this.invert
    }
  }

  static fromJson (node) {
    // todo
    return new BackAndForthAnimationNode()
  }
}
