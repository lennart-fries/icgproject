export class Renderer {
  /**
   * Creates a renderer
   * @param {HTMLCanvasElement} canvas - Canvas to draw on
   * @param {GroupNode} sg             - Root node of the scene graph
   */
  constructor (canvas, sg) {
    if (new.target === Renderer) {
      throw new TypeError('Cannot construct Renderer instances directly')
    }
  }

  /**
   * Sets up the renderer
   * @return {Promise}
   */
  setup () {
    return Promise.resolve(0)
  }

  /**
   * Loops through the scene graph to render the next frame
   * @param {Node} sg                       - Root node of the scene graph
   * @param {Object} camera                 - Object containing camera parameters for the scene
   * @param {Array.<Vector>} lightPositions - Array of vectors representing light positions
   */
  loop (sg, camera, lightPositions) { }

  /**
   * Updates the canvas resolution
   * @param {int} width  - Width of the canvas
   * @param {int} height - Height of the canvas
   */
  updateResolution (width, height) { }

  /**
   * Tears down the renderer
   */
  teardown () { }
}
