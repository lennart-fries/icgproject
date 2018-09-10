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
   * @param {int}       id - id of the node, used if the node is imported from a json
   */
  constructor (mat, children = [], id = null) {
    super()
    this.id = id
    this.matrix = mat
    this.startmatrix = mat
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
      id: this.id,
      type: 'GroupNode',
      matrix: this.matrix.transpose(),
      children: this.children
    }
  }

  static fromJson (node) {
    let id = node.id
    let matrix = new Matrix(node.matrix.data)
    let children = []
    node.children.forEach(child => children.push(getType(child)))
    return new GroupNode(matrix, children, id)
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
   * @param  {int}       id                      - id of the node, used if the node is imported from a json
   */
  constructor (center, radius, colors, materials, texture = null, map = null, id = null) {
    super()
    this.id = id
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
      id: this.id,
      type: 'SphereNode',
      center: this.center,
      radius: this.radius,
      colors: this.colors,
      materials: this.materials,
      map: this.map,
      texture: this.texture
    }
  }

  static fromJson (node) {
    let id = node.id
    let center = new Vector(node.center.data)
    let colors = getColors(node.colors)
    let materials = getColors(node.materials)
    let radius = node.radius
    let texture = node.texture
    let map = node.map
    return new SphereNode(center, radius, colors, materials, texture, map, id)
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
   * @param  {int}           id                  - id of the node, used if the node is imported from a json
   */
  constructor (minPoint, maxPoint, colors, materials, texture = null, map = null, id = null) {
    super()
    this.id = id
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
      id: this.id,
      type: 'AABoxNode',
      minPoint: this.minPoint,
      maxPoint: this.maxPoint,
      colors: this.colors,
      materials: this.materials,
      map: this.map,
      texture: this.texture
    }
  }

  static fromJson (node) {
    let id = node.id
    let minPoint = new Vector(node.minPoint.data)
    let maxPoint = new Vector(node.maxPoint.data)
    let colors = getColors(node.colors)
    let materials = getColors(node.materials)
    let map = node.map
    let texture = node.texture
    return new AABoxNode(minPoint, maxPoint, colors, materials, texture, map, id)
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
   * @param  {int}           id                  - id of the node, used if the node is imported from a json
   */
  constructor (center, height, colors, materials, texture = null, map = null, id = null) {
    super()
    this.id = id
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
      id: this.id,
      type: 'PyramidNode',
      center: this.center,
      height: this.height,
      colors: this.colors,
      materials: this.materials,
      map: this.map,
      texture: this.texture
    }
  }

  static fromJson (node) {
    let id = node.id
    let center = new Vector(node.center.data)
    let height = node.height
    let colors = getColors(node.colors)
    let materials = getColors(node.materials)
    let texture = node.texture
    let map = node.map
    return new PyramidNode(center, height, colors, materials, texture, map,  id)
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
   * @param  {int}    id     - id of the node, used if the node is imported from a json
   */
  constructor (eye, center, up, fovy, aspect, near, far, id = null) {
    super()
    this.id = id
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
      id: this.id,
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
    let id = node.id
    let eye = new Vector(node.eye.data)
    let center = new Vector(node.center.data)
    let up = new Vector(node.up.data)
    let fovy = node.fovy
    let aspect = node.aspect
    let near = node.near
    let far = node.far
    return new CameraNode(eye, center, up, fovy, aspect, near, far, id)
  }
}

export class LightNode extends Node {
  /**
   * Creates a point light.
   * @param  {Vector} position  - position of the light
   * @param  {number} intensity - how strong the light is, from 0 to 1
   * @param  {int}    id        - id of the node, used if the node is imported from a json
   */
  constructor (position, intensity, id = null) {
    super()
    this.id = id
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
      id: this.id,
      type: 'LightNode',
      position: this.position,
      intensity: this.intensity
    }
  }

  static fromJson (node) {
    let id = node.id
    let position = new Vector(node.position.data)
    let intensity = node.intensity
    return new LightNode(position, intensity, id)
  }
}

function getType (node) {
  switch (node.type) {
    case 'GroupNode':
      return GroupNode.fromJson(node)
    case 'SphereNode':
      return SphereNode.fromJson(node)
    case 'AABoxNode':
      return AABoxNode.fromJson(node)
    case 'PyramidNode':
      return PyramidNode.fromJson(node)
    case 'LightNode':
      return LightNode.fromJson(node)
    case 'CameraNode':
      return CameraNode.fromJson(node)
  }
}

function getColors (colors) {
  if (Array.isArray(colors)) {
    let colorArray = []
    colors.forEach(color => colorArray.push(new Vector(color.data)))
    return colorArray
  } else {
    return new Vector(colors.data)
  }
}
