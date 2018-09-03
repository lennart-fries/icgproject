import { Matrix } from '../primitives/matrix.js'
import { Vector } from '../primitives/vector.js'

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
   * @param {Matrix}        mat - A matrix describing the node's transformation
   * @param {Array.<Node>}  children - all children nodes
   */
  constructor (mat, children = []) {
    super()
    this.matrix = mat
    this.children = children
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

  toJSON () {
    return {
      type: 'GroupNode',
      matrix: this.matrix,
      children: this.children

    }
  }

  static fromJson (node) {
    let matrix = new Matrix(node.matrix.data)
    let children = []
    node.children.forEach(child => children.push(getType(child)))
    return new GroupNode(matrix.data, children)
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
   * @param  {string | null} texture             - Image filename for the texture, optional
   * @param  {string | null} map                 - Image filename for the mapping texture, optional
   */
  constructor (center, radius, colors, materials, texture = null, map = null) {
    super()
    this.center = center
    this.radius = radius
    this.colors = colors
    this.materials = materials
    this.texture = texture
    this.map = map
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {Visitor} visitor - Visitor
   */
  accept (visitor) {
    visitor.visitSphereNode(this)
  }

  toJSON () {
    return {
      type: 'SphereNode',
      center: this.center,
      radius: this.radius,
      colors: this.colors,
      materials: this.materials,
      texture: this.texture
    }
  }

  static fromJson (node) {
    let center = new Vector(node.center.data)
    let colors = getColors(node.colors)
    let materials = getColors(node.materials)
    let radius = node.radius
    let texture = node.texture
    return new SphereNode(center, radius, colors, materials, texture)
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
   * @param  {string | null} texture             - Image filename for the texture, optional
   * @param  {string | null} map                 - Image filename for the mapping texture, optional
   */
  constructor (minPoint, maxPoint, colors, materials, texture = null, map = null) {
    super()
    this.minPoint = minPoint
    this.maxPoint = maxPoint
    this.colors = colors
    this.materials = materials
    this.texture = texture
    this.map = map
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param  {Visitor} visitor - Visitor
   */
  accept (visitor) {
    visitor.visitAABoxNode(this)
  }

  toJSON () {
    return {
      type: 'AABoxNode',
      minPoint: this.minPoint,
      maxPoint: this.maxPoint,
      colors: this.colors,
      materials: this.materials
    }
  }

  static fromJson (node) {
    let minPoint = new Vector(node.minPoint.data)
    let maxPoint = new Vector(node.maxPoint.data)
    let colors = getColors(node.colors)
    let materials = getColors(node.materials)
    return new AABoxNode(minPoint, maxPoint, colors, materials)
  }
}

/**
 * Class representing a Tetrahedron Pyramid in the scene graph
 * @extends Node
 */
export class PyramidNode extends Node {
  /**
   * Creates a tetrahedron pyramid
   * @param {Vector} center                      - Center of the bottom triangle
   * @param {number} height                      - Height of the pyramid from the center
   * @param  {Array.<Vector> | Vector} colors    - Color(s) of the pyramid
   * @param  {Array.<Vector> | Vector} materials - Material(s) of the pyramid
   *                                               x = ambient, y = diffuse, z = specular, w = shininess
   * @param  {string | null} texture             - Image filename for the texture, optional
   * @param  {string | null} map                 - Image filename for the mapping texture, optional
   */
  constructor (center, height, colors, materials, texture = null, map = null) {
    super()
    this.center = center
    this.height = height
    this.colors = colors
    this.materials = materials
    this.texture = texture
    this.map = map
  }

  /**
   * Accepts a visitor according to the visitor pattern
   * @param {Visitor} visitor - Visitor
   */
  accept (visitor) {
    visitor.visitPyramidNode(this)
  }

  toJSON () {
    return {
      type: 'PyramidNode',
      center: this.center,
      height: this.height,
      colors: this.colors,
      materials: this.materials,
      texture: this.texture
    }
  }

  static fromJson (node) {
    let center = new Vector(node.center.data)
    let height = node.height
    let colors = getColors(node.colors)
    let materials = getColors(node.materials)
    let texture = node.texture
    return new PyramidNode(center, height, colors, materials, texture)
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

  toJSON () {
    return {
      type: 'CameraNode',
      eye: this.eye,
      center: this.center,
      up: this.up,
      fovy: this.fovy,
      aspect: this.aspect,
      near: this.near,
      far: this.far
    }
  }

  static fromJson (node) {
    let eye = new Vector(node.eye.data)
    let center = new Vector(node.center.data)
    let up = new Vector(node.up.data)
    let fovy = node.fovy
    let aspect = node.aspect
    let near = node.near
    let far = node.far
    return new CameraNode(eye, center, up, fovy, aspect, near, far)
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

  toJSON () {
    return {
      type: 'LightNode',
      position: this.position,
      intensity: this.intensity
    }
  }

  static fromJson (node) {
    let position = new Vector(node.position.data)
    let intensity = node.intensity
    return new LightNode(position, intensity)
  }
}

function getType (node) {
  if (node.GroupNode != null) {
    return GroupNode.fromJson(node.GroupNode)
  } else if (node.SphereNode != null) {
    return SphereNode.fromJson(node.SphereNode)
  } else if (node.AABoxNode != null) {
    return AABoxNode.fromJson(node.AABoxNode)
  } else if (node.PyramidNode != null) {
    return PyramidNode.fromJson(node.PyramidNode)
  } else if (node.LightNode != null) {
    return LightNode.fromJson(node.LightNode)
  } else if (node.CameraNode != null) {
    return CameraNode.fromJson(node.CameraNode)
  }
}

function getColors (colors) {
  if (Array.isArray(colors)) {
    let colorArray = []
    colors.forEach(color => colorArray.push(new Vector(color.data)))
  } else {
    return new Vector(colors.data)
  }
}
