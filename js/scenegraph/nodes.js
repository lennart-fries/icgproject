/**
 * Class representing a Node in a Scenegraph
 */
class Node {
  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {Visitor} visitor - The visitor
   */
  accept (visitor) {
  }
}

/**
 * Class representing a GroupNode in the Scenegraph.
 * A GroupNode holds a transformation and is able
 * to have child nodes attached to it.
 * @extends Node
 */
export class GroupNode extends Node {
  /**
   * Constructor
   * @param  {Matrix} mat - A matrix describing the node's transformation
   */
  constructor (mat) {
    super()
    this.matrix = mat
    this.children = []
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {Visitor} visitor - The visitor
   */
  accept (visitor) {
    visitor.visitGroupNode(this)
  }

  /**
   * Adds a child node
   * @param {Node} childNode - The child node to add
   */
  add (childNode) {
    this.children.push(childNode)
  }
}

/**
 * Class representing a Sphere in the Scenegraph
 * @extends Node
 */
export class SphereNode extends Node {
  /**
   * Creates a new Sphere with center and radius
   * @param  {Vector} center - The center of the Sphere
   * @param  {number} radius - The radius of the Sphere
   * @param  {Vector} color  - The colour of the Sphere
   */
  constructor (center, radius, color) {
    super()
    this.center = center
    this.radius = radius
    this.color = color
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {Visitor} visitor - The visitor
   */
  accept (visitor) {
    visitor.visitSphereNode(this)
  }
}

/**
 * Class representing an Axis Aligned Box in the Scenegraph
 * @extends Node
 */
export class AABoxNode extends Node {
  /**
   * Creates an axis aligned box
   * @param  {Vector} minPoint - The minimum Point
   * @param  {Vector} maxPoint - The maximum Point
   * @param  {Vector} color    - The colour of the cube
   * @param  {String} texture  - The texture of the cube, optional
   */
  constructor (minPoint, maxPoint, color, texture = '') {
    super()
    this.minPoint = minPoint
    this.maxPoint = maxPoint
    this.color = color
    this.texture = texture
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {Visitor} visitor - The visitor
   */
  accept (visitor) {
    visitor.visitAABoxNode(this)
  }
}

export class CameraNode extends Node {
  /**
   * Constructor
   * @param eye     - position of the camera
   * @param center  - alignment of the camera
   * @param up      - Farthest up on the y-axis
   * @param fovy    - field of view in degree
   * @param aspect  - aspect ratio of the camera (width/height)
   * @param near    - nearest distance of the rendered view
   * @param far     - furthest distance of the rendered view
   */
  constructor (eye, center, up, fovy, aspect, near, far) {
    super()
    this.eye = eye
    this.center = center
    this.up = up
    this.fovy = fovy
    this.aspect = aspect
    this.near = near
    this.far = far
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {Visitor} visitor - The visitor
   */
  accept (visitor) {
    visitor.visitCameraNode(this)
  }
}

export class LightNode extends Node {
  /**
   * Constructor
   * @param mat
   */
  constructor (mat) {
    super()
    this.mat = mat
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {Visitor} visitor - The visitor
   */
  accept (visitor) {
    visitor.visitLightNode(this)
  }
}
