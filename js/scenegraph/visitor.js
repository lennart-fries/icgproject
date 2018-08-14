import { Matrix } from '../primitives/matrix.js'

// NO FUNCTION YET, extending the ray and rastervisior breaks everything
export class Visitor {
  /**
   * Creates a new Visitor
   * @param {Object} context - The context to render to
   */
  constructor (context) {
    this.context = context
    this.currentMatrix = Matrix.identity()
  }

  render (rootNode, camera, lightPositions, width = 0, height = 0) {

  }

  /**
   * Visits a group box node
   * @param  {Node} node - The node to visit
   */
  visitGroupNode (node) {

  }

  /**
   * Visits a sphere box node
   * @param  {Node} node - The node to visit
   */
  visitSphereNode (node) {

  }

  /**
   * Visits a axis aligned box node
   * @param  {Node} node - The node to visit
   */
  visitAABoxNode (node) {

  }

  /**
   * Visits a camera box node
   * @param  {Node} node - The node to visit
   */
  visitCameraNode (node) {

  }

  /**
   * Visits a light box node
   * @param  {Node} node - The node to visit
   */
  visitLightNode (node) {

  }
}
