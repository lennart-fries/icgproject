/**
 * Class representing a Node in a scene graph
 */
class Node {
  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {Visitor} visitor - Visitor
   */
  accept (visitor) {
  }
}

/**
 * Class representing a GroupNode in the scene graph.
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
   * @param  {Visitor} visitor - Visitor
   */
  accept (visitor) {
    visitor.visitGroupNode(this)
  }

  /**
   * Adds a child node
   * @param {Node} childNode - Child node to add
   */
  add (childNode) {
    this.children.push(childNode)
  }
}

/**
 * Class representing a Sphere in the scene graph
 * @extends Node
 */
export class SphereNode extends Node {
  /**
   * Creates a new Sphere with center and radius
   * @param  {Vector} center - Center of the Sphere
   * @param  {number} radius - Radius of the Sphere
   * @param  {Vector} color  - Color of the Sphere
   */
  constructor (center, radius, color) {
    super()
    this.center = center
    this.radius = radius
    this.color = color
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {Visitor} visitor - Visitor
   */
  accept (visitor) {
    visitor.visitSphereNode(this)
  }
}

/**
 * Class representing an Axis Aligned Box in the scene graph
 * @extends Node
 */
export class AABoxNode extends Node {
  /**
   * Creates an axis aligned box
   * @param  {Vector} minPoint - Minimum Point
   * @param  {Vector} maxPoint - Maximum Point
   * @param  {Vector} color    - Color of the cube
   * @param  {String} texture  - Texture of the cube, optional
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
   * @param  {Visitor} visitor - Visitor
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
   * @param  {Visitor} visitor - Visitor
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
   * @param  {Visitor} visitor - Visitor
   */
  accept (visitor) {
    visitor.visitLightNode(this)
  }
}
