import { RasterSetupVisitor, RasterVisitor, RasterTeardownVisitor } from '../raster/raster-visitor.js'
import { Shader } from '../raster/shader.js'
import { Renderer } from './renderer.js'

export class RasterRenderer extends Renderer {
  /**
   * Creates a renderer that uses rasterization
   * @param {HTMLCanvasElement} canvas - Canvas to draw on
   * @param {GroupNode} sg             - Root node of the scene graph
   */
  constructor (canvas, sg) {
    super()
    this.gl = canvas.getContext('webgl')
    this.setupVisitor = new RasterSetupVisitor(this.gl)
    this.visitor = new RasterVisitor(this.gl)
    this.sg = sg
  }

  /**
   * Sets up the renderer by setting up the buffers and loading the shader
   * @return {Promise}
   */
  setup () {
    this.setupVisitor.run(this.sg)

    this.shader = new Shader(this.gl,
      'glsl/vertex-shader.glsl',
      'glsl/fragment-shader.glsl'
    )
    this.visitor.shader = this.shader

    return this.shader.load()
  }

  /**
   * Loops through the scene graph to render the next frame
   * @param {Node} sg                       - Root node of the scene graph
   * @param {Object} camera                 - Object containing camera parameters for the scene
   * @param {Array.<Vector>} lightPositions - Array of vectors representing light positions
   */
  loop (sg, camera, lightPositions) {
    this.visitor.run(sg, camera, lightPositions)
  }

  /**
   * Updates the canvas resolution
   * @param {int} width  - Width of the canvas
   * @param {int} height - Height of the canvas
   */
  updateResolution (width, height) {
    this.gl.viewport(0, 0, width, height)
  }

  /**
   * Tears down the renderer by deleting the buffers
   */
  teardown () {
    const teardownVisitor = new RasterTeardownVisitor(this.gl)
    teardownVisitor.run(this.sg)
  }
}
