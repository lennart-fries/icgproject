import { RayVisitor } from '../ray/rayvisitor.js'

export class Ray {
  /**
   * creates a raster rendering context
   * @param { HTML-canvas } canvas  - HTML-canvas
   * @param { groupNode } sg        - rootnode/scenegraph
   */
  constructor (canvas, sg) {
    this.ctx = canvas.getContext('2d')
    this.visitor = new RayVisitor(this.ctx)
  }

  /**
   * todo
   * @return {Promise<any[]>}
   */
  setup () {
    return Promise.resolve(0)
  }

  /**
   * loops through the scenegraph to calculate everything for the next frame
   * @param { groupNode } sg                    - rootNode/sceneGraph
   * @param { CameraNode } camera               - camera for the scene
   * @param { Array.<Vector> } lightPositions   - Array of lights
   */
  loop (sg, camera, lightPositions) {
    this.visitor.run(sg, camera, lightPositions, this.width, this.height)
  }

  /**
   * updates the canvas proportions
   * @param {int} width   - width of the canvas
   * @param {int} height  - height of the canvas
   */
  updateResolution (width, height) {
    this.width = width
    this.height = height
  }

  teardown () {
    // does nothing
  }
}
