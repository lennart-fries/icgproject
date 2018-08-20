import { Matrix } from '../primitives/matrix.js'

export class Visitor {
  /**
   * Creates a new Visitor
   * @param {WebGLRenderingContext} context                 - The 3D context to render to
   */
  constructor (context) {
    this.gl = context
    this.currentMatrix = Matrix.identity()
  }

  run (rootNode) {
    rootNode.accept(this)
  }

  /**
   * Visits a group node
   * @param  {Node} node - The node to visit
   */
  visitGroupNode (node) {
    let oldMatrix = this.currentMatrix
    this.currentMatrix = oldMatrix.mul(node.matrix)
    for (let child of node.children) {
      child.accept(this)
    }
    this.currentMatrix = oldMatrix
  }

  /**
   * Visits a group node for Setup or Teardown
   * @param  {Node} node - The node to visit
   */
  visitGroupNode2 (node) {
    for (let child of node.children) {
      child.accept(this)
    }
  }

  /**
   * Visits a sphere node
   * @param  {Node} node - The node to visit
   */
  visitSphereNode (node) { }

  /**
   * Visits a axis aligned box node
   * @param  {Node} node - The node to visit
   */
  visitAABoxNode (node) { }

  /**
   * Visits a textured box node
   * @param  {Node} node - The node to visit
   */
  visitTextureBoxNode (node) { }

  /**
   * Visits a camera node
   * @param  {Node} node - The node to visit
   */
  visitCameraNode (node) { }

  /**
   * Visits a light node
   * @param  {Node} node - The node to visit
   */
  visitLightNode (node) { }
}
