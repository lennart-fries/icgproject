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
 * Class representing a NodePlacement in the scene graph.
 * A NodePlacement only has a name and children attached to it.
 * @extends Node
 */
export class NodePlacement {
  /**
   * Constructor
   * @param {String} name            - name of the Node
   */
  constructor (name) {
    this.name = name
    this.children = []
  }

  /**
   * Adds a child node
   * @param {NodePlacement} childNode - Child node to add
   */
  add (childNode) {
    this.children.push(childNode)
  }

  toJSON () {
    return {
      name: this.name,
      children: this.children
    }
  }

  static fromJson (treeNode) {
    let name = treeNode.name
    let nodePlacement = new NodePlacement(name)
    treeNode.children.forEach(child => nodePlacement.add(child))
    return nodePlacement
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
   * @param {String} name             - name of the Node
   * @param {Matrix} mat              - A matrix describing the node's transformation
   */
  constructor (name, mat) {
    super()
    this.name = name
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
   * @param {NodePlacement} childNode - Child node to add
   */
  add (childNode) {
    this.children.push(childNode)
  }

  toJSON () {
    return {
      name: this.name,
      children: this.children,
      type: 'GroupNode',
      matrix: this.matrix.transpose()
    }
  }

  static fromJson (node) {
    let name = node.name
    let matrix = new Matrix(node.matrix.data)
    return new GroupNode(name, matrix)
  }
}

/**
 * Class representing a Sphere in the scene graph
 * @extends Node
 */
export class SphereNode extends Node {
  /**
   * Creates a new Sphere with center and radius
   * @param  {String} name - name of the Node
   * @param  {Vector} center                     - Center of the sphere
   * @param  {number} radius                     - Radius of the sphere
   * @param  {Array.<Vector> | Vector} colors    - Color(s) of the sphere
   * @param  {Array.<Vector> | Vector} materials - Material(s) of the sphere
   *                                               x = ambient, y = diffuse, z = specular, w = shininess
   * @param  {string | null} texture             - Image filename for the texture, optional
   * @param  {string | null} map                 - Image filename for the mapping texture, optional
   */
  constructor (name, center, radius, colors, materials, texture = null, map = null) {
    super()
    this.name = name
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
      name: this.name,
      children: this.children,
      type: 'SphereNode',
      id: this.id,
      center: this.center,
      radius: this.radius,
      colors: this.colors,
      materials: this.materials,
      map: this.map,
      texture: this.texture
    }
  }

  static fromJson (node) {
    let name = node.name
    let center = new Vector(node.center.data)
    let colors = getColors(node.colors)
    let materials = getColors(node.materials)
    let radius = node.radius
    let texture = node.texture
    let map = node.map
    return new SphereNode(name, center, radius, colors, materials, texture, map)
  }
}

/**
 * Class representing an Axis Aligned Box in the scene graph
 * @extends Node
 */
export class AABoxNode extends Node {
  /**
   * Creates an axis aligned box
   * @param  {String} name - name of the Node
   * @param  {Vector} minPoint                   - Minimum point
   * @param  {Vector} maxPoint                   - Maximum point
   * @param  {Array.<Vector> | Vector} colors    - Color(s) of the box
   * @param  {Array.<Vector> | Vector} materials - Material(s) of the box
   *                                               x = ambient, y = diffuse, z = specular, w = shininess
   * @param  {string | null} texture             - Image filename for the texture, optional
   * @param  {string | null} map                 - Image filename for the mapping texture, optional
   */
  constructor (name, minPoint, maxPoint, colors, materials, texture = null, map = null) {
    super()
    this.name = name
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
      name: this.name,
      children: this.children,
      type: 'AABoxNode',
      id: this.id,
      minPoint: this.minPoint,
      maxPoint: this.maxPoint,
      colors: this.colors,
      materials: this.materials,
      map: this.map,
      texture: this.texture
    }
  }

  static fromJson (node) {
    let name = node.name
    let minPoint = new Vector(node.minPoint.data)
    let maxPoint = new Vector(node.maxPoint.data)
    let colors = getColors(node.colors)
    let materials = getColors(node.materials)
    let map = node.map
    let texture = node.texture
    return new AABoxNode(name, minPoint, maxPoint, colors, materials, texture, map)
  }
}

/**
 * Class representing a Tetrahedron Pyramid in the scene graph
 * @extends Node
 */
export class PyramidNode extends Node {
  /**
   * Creates a tetrahedron pyramid
   * @param  {String} name - name of the Node
   * @param {Vector} center                      - Center of the bottom triangle
   * @param {number} height                      - Height of the pyramid from the center
   * @param  {Array.<Vector> | Vector} colors    - Color(s) of the pyramid
   * @param  {Array.<Vector> | Vector} materials - Material(s) of the pyramid
   *                                               x = ambient, y = diffuse, z = specular, w = shininess
   * @param  {string | null} texture             - Image filename for the texture, optional
   * @param  {string | null} map                 - Image filename for the mapping texture, optional
   */
  constructor (name, center, height, colors, materials, texture = null, map = null) {
    super()
    this.name = name
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
      name: this.name,
      children: this.children,
      type: 'PyramidNode',
      id: this.id,
      center: this.center,
      height: this.height,
      colors: this.colors,
      materials: this.materials,
      map: this.map,
      texture: this.texture
    }
  }

  static fromJson (node) {
    let name = node.name
    let center = new Vector(node.center.data)
    let height = node.height
    let colors = getColors(node.colors)
    let materials = getColors(node.materials)
    let texture = node.texture
    let map = node.map
    return new PyramidNode(name, center, height, colors, materials, texture, map)
  }
}

export class CameraNode extends Node {
  /**
   * Creates a camera
   * @param  {String} name - name of the Node
   * @param  {Vector} eye    - position of the camera
   * @param  {Vector} towards - view direction
   * @param  {Vector} up     - vector pointing up on the y-axis
   * @param  {number} fovy   - vertical field of view in degrees
   * @param  {number} aspect - aspect ratio of the camera (width/height)
   * @param  {number} near   - nearest distance of the rendered view
   * @param  {number} far    - furthest distance of the rendered view
   */
  constructor (name, eye, towards, up, fovy, aspect, near, far) {
    super()
    this.name = name
    this.eye = eye
    this.towards = towards
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
      name: this.name,
      children: this.children,
      type: 'CameraNode',
      id: this.id,
      eye: this.eye,
      towards: this.towards,
      up: this.up,
      fovy: this.fovy,
      aspect: this.aspect,
      near: this.near,
      far: this.far
    }
  }

  static fromJson (node) {
    let name = node.name
    let eye = new Vector(node.eye.data)
    let towards = new Vector(node.towards.data)
    let up = new Vector(node.up.data)
    let fovy = node.fovy
    let aspect = node.aspect
    let near = node.near
    let far = node.far
    return new CameraNode(name, eye, towards, up, fovy, aspect, near, far)
  }
}

export class LightNode extends Node {
  /**
   * Creates a point light.
   * @param  {String} name - name of the Node
   * @param  {String} name - name of the Node
   * @param  {Vector} position  - position of the light
   * @param  {number} intensity - how strong the light is, from 0 to 1
   */
  constructor (name, position, intensity) {
    super()
    this.name = name
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
      name: this.name,
      children: this.children,
      type: 'LightNode',
      id: this.id,
      position: this.position,
      intensity: this.intensity
    }
  }

  static fromJson (node) {
    let name = node.name
    let position = new Vector(node.position.data)
    let intensity = node.intensity
    return new LightNode(name, position, intensity)
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
