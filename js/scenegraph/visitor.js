import { Matrix } from '../primitives/matrix.js'

/**
 * Traverses the scene graph, executing different functionality based on the type of node encountered
 */
export class Visitor {
  /**
   * Creates a new Visitor
   * @param {CanvasRenderingContext2D | WebGLRenderingContext} context - Context to render to
   */
  constructor (context) {
    this.context = context
  }

  /**
   * Begins visiting the scene graph
   * @param  {Node} rootNode - Root node of the scene graph
   */
  run (rootNode) {
    rootNode.accept(this)
  }

  /**
   * Visits a group node for Setup or Teardown
   * @param  {GroupNode} node - Node to visit
   */
  visitGroupNode (node) {
    for (let child of node.children) {
      child.accept(this)
    }
  }

  /**
   * Visits a sphere node
   * @param  {SphereNode} node - Node to visit
   */
  visitSphereNode (node) { }

  /**
   * Visits an axis aligned box node
   * @param  {AABoxNode} node - Node to visit
   */
  visitAABoxNode (node) { }

  /**
   * Visits an tetrahedron pyramid node
   * @param node
   */
  visitPyramidNode (node) { }

  /**
   * Visits a camera node
   * @param  {CameraNode} node - Node to visit
   */
  visitCameraNode (node) { }

  /**
   * Visits a light node
   * @param  {LightNode} node - Node to visit
   */
  visitLightNode (node) { }
}

/**
 * Visitor that works with a matrix stack
 */
export class MatrixVisitor extends Visitor {
  /**
   * Creates a new Visitor
   * @param {WebGLRenderingContext} context   - 3D context to render to
   */
  constructor (context) {
    super(context)
    this.currentMatrix = Matrix.identity()
  }

  /**
   * Visits a group node
   * @param  {GroupNode} node - Node to visit
   */
  visitGroupNode (node) {
    let oldMatrix = this.currentMatrix
    this.currentMatrix = oldMatrix.mul(node.matrix)
    super.visitGroupNode(node)
    this.currentMatrix = oldMatrix
  }
}
