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
   * @param  {Vector} center                     - Center of the sphere
   * @param  {number} radius                     - Radius of the sphere
   * @param  {Array.<Vector> | Vector} colors    - Color(s) of the sphere
   * @param  {Array.<Vector> | Vector} materials - Material(s) of the sphere
   *                                               x = ambient, y = diffuse, z = specular, w = shininess
   * @param  {string | null} texture               Image filename for the texture, optional
   */
  constructor (center, radius, colors, materials, texture = null) {
    super()
    this.center = center
    this.radius = radius
    this.colors = colors
    this.materials = materials
    this.texture = texture
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
   * @param  {Vector} minPoint                   - Minimum point
   * @param  {Vector} maxPoint                   - Maximum point
   * @param  {Array.<Vector> | Vector} colors    - Color(s) of the box
   * @param  {Array.<Vector> | Vector} materials - Material(s) of the box
   *                                               x = ambient, y = diffuse, z = specular, w = shininess
   * @param  {string | null} texture               Image filename for the texture, optional
   */
  constructor (minPoint, maxPoint, colors, materials, texture = null) {
    super()
    this.minPoint = minPoint
    this.maxPoint = maxPoint
    this.colors = colors
    this.materials = materials
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

/**
 * Class representing a Tetrahedron Pyramid in the scene graph
 * @extends Node
 */
export class PyramidNode extends Node {
  /**
   * Creates a tetrahedron pyramid
   * @param {Vector} center    - Center of the Bottom Triangle
   * @param {number} height    - Height of the Pyramid from the Center
   * @param {Vector} color     - Color of the pyramid
   * @param {Vector} materials - Material(s) of the box
   *                             x = ambient, y = diffuse, z = specular, w = shininess
   * @param {String} texture   - Texture of the pyramid, optional
   */
  constructor (center, height, color, materials, texture = '') {
    super()
    this.center = center
    this.height = height
    this.color = color
    this.materials = materials
    this.texture = texture
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param {Visitor} visitor - Visitor
   */
  accept (visitor) {
    visitor.visitPyramidNode(this)
  }
}

export class CameraNode extends Node {
  /**
   * Creates a camera
   * @param  {Vector} eye    - position of the camera
   * @param  {Vector} center - center of the camera
   * @param  {Vector} up     - vector pointing up on the y-axis
   * @param  {number} fovy   - vertical field of view in degrees
   * @param  {number} aspect - aspect ratio of the camera (width/height)
   * @param  {number} near   - nearest distance of the rendered view
   * @param  {number} far    - furthest distance of the rendered view
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
   * Creates a point light.
   * @param  {Vector} position  - position of the light
   * @param  {number} intensity - how strong the light is, from 0 to 1
   */
  constructor (position, intensity) {
    super()
    this.position = position
    this.intensity = intensity
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {Visitor} visitor - Visitor
   */
  accept (visitor) {
    visitor.visitLightNode(this)
  }
}
