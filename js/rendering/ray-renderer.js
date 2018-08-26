import { RayVisitor } from '../ray/ray-visitor.js'
import { Renderer } from './renderer.js'

export class RayRenderer extends Renderer {
  /**
   * Creates a renderer that uses ray tracing
   * @param {HTMLCanvasElement} canvas - Canvas to draw on
   * @param {Node} sg             - Root node of the scene graph
   */
  constructor (canvas, sg) {
    super()
    this.ctx = canvas.getContext('2d')
    this.visitor = new RayVisitor(this.ctx)
  }

  /**
   * Loops through the scene graph to render the next frame
   * @param {Node} sg                       - Root node of the scene graph
   * @param {Object} camera                 - Object containing camera parameters for the scene
   * @param {Array.<Vector>} lightPositions - Array of vectors representing light positions
   */
  loop (sg, camera, lightPositions) {
    this.visitor.run(sg, camera, lightPositions, this.width, this.height)
  }

  /**
   * Updates the canvas resolution
   * @param {int} width  - Width of the canvas
   * @param {int} height - Height of the canvas
   */
  updateResolution (width, height) {
    this.width = width
    this.height = height
  }
}
