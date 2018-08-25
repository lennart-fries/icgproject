import { RasterSetupVisitor, RasterVisitor, RasterTeardownVisitor } from '../raster/rastervisitor.js'
import { Shader } from '../raster/shader.js'

export class Raster {
  /**
   * creates a raster rendering context
   * @param { HTML-canvas } canvas  - HTML-canvas
   * @param { groupNode } sg        - rootnode/scenegraph
   */
  constructor (canvas, sg) {
    this.gl = canvas.getContext('webgl')
    this.setupVisitor = new RasterSetupVisitor(this.gl)
    this.setupVisitor.run(sg)
    this.visitor = new RasterVisitor(this.gl)
    this.sg = sg
  }

  /**
   * todo
   * @return {Promise<any[]>}
   */
  setup () {
    this.shader = new Shader(this.gl,
      'glsl/vertex-shader.glsl',
      'glsl/fragment-shader.glsl'
    )
    this.visitor.shader = this.shader

    return this.shader.load()
  }

  /**
   * loops through the scenegraph to calculate everything for the next frame
   * @param { groupNode } sg                    - rootNode/sceneGraph
   * @param { CameraNode } camera               - camera for the scene
   * @param { Array.<Vector> } lightPositions   - Array of lights
   */
  loop (sg, camera, lightPositions) {
    this.lightPositions = lightPositions
    this.visitor.run(sg, camera, lightPositions)
  }

  /**
   * updates the canvas proportions
   * @param {int} width   - width of the canvas
   * @param {int} height  - height of the canvas
   */
  updateResolution (width, height) {
    this.gl.viewport(0, 0, width, height)
  }

  /**
   *  deletes the canvas and all its content (scenegraph)
   */
  teardown () {
    const teardownVisitor = new RasterTeardownVisitor(this.gl)
    teardownVisitor.run(this.sg)
  }
}
