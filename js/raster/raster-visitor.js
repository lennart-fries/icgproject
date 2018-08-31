/**
 * Visitor that uses rasterization to render a scene graph
 */

import { Matrix } from '../primitives/matrix.js'
import { RasterSphere } from './raster-sphere.js'
import { RasterAABox } from './raster-aabox.js'
import { MatrixVisitor, Visitor } from '../scenegraph/visitor.js'

export class RasterVisitor extends MatrixVisitor {
  /**
   * Renders the scene graph
   * @param  {Node} rootNode                 - Root node of the scene graph
   * @param  {Object} camera                 - Camera to use
   * @param  {Array.<Vector>} lightPositions - Array of point light positions to use
   */
  run (rootNode, camera, lightPositions) {
    // clear
    this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT)

    this.setupCamera(camera)

    this.lightPositions = lightPositions

    // traverse and render
    super.run(rootNode)
  }

  /**
   * Helper function to setup camera matrices
   * @param  {Object} camera - Camera to use
   */
  setupCamera (camera) {
    if (camera) {
      this.lookat = Matrix.lookat(
        camera.eye,
        camera.center,
        camera.up)

      this.perspective = Matrix.perspective(
        camera.fovy,
        camera.aspect,
        camera.near,
        camera.far
      )
      if (typeof this.perspective === 'undefined') {
        this.perspective = Matrix.identity()
      }
    }
  }

  /**
   * Helper function to set all the uniform parameters for the shader
   * @return {Object} shader - Shader to use
   */
  setUniforms () {
    let shader = this.shader
    shader.use()

    // model matrix
    let mat = this.currentMatrix
    shader.getUniformMatrix('M').set(mat)

    // view matrix
    let V = shader.getUniformMatrix('V')
    V.set(this.lookat)

    // projection matrix
    let P = shader.getUniformMatrix('P')

    P.set(this.perspective)

    // normal matrix
    let normal = this.lookat.mul(mat).invert().transpose()
    shader.getUniformMatrix('N').set(normal)

    shader.getUniformArray('lightPositions').set(this.lightPositions)

    return shader
  }

  /**
   * Visits a sphere node for rendering
   * @param  {SphereNode} node - Node to visit
   */
  visitSphereNode (node) {
    let shader = this.setUniforms()
    node.rasterSphere.render(shader)
  }

  /**
   * Visits an axis aligned box node for rendering
   * @param  {AABoxNode} node - Node to visit
   */
  visitAABoxNode (node) {
    let shader = this.setUniforms()
    node.rasterBox.render(shader)
  }

  /**
   * Visits an tetrahedron pyramid node for rendering
   * @param {PyramidNode} node - Node to visit
   */
  visitPyramidNode (node) {
    let shader = this.setUniforms()
    node.rasterPyramid.render(shader)
  }
}

/**
 * Visitor that sets up buffers for use by the RasterVisitor
 */
export class RasterSetupVisitor extends Visitor {
  /**
   * Sets up all needed buffers
   * @param  {Node} rootNode - Root node of the scene graph
   */
  run (rootNode) {
    // Clear to transparent
    this.context.clearColor(0.0, 0.0, 0.0, 0.0)
    // Clear everything
    this.context.clearDepth(1.0)
    // Enable depth testing
    this.context.enable(this.context.DEPTH_TEST)
    this.context.depthFunc(this.context.LEQUAL)

    super.run(rootNode)
  }

  /**
   * Visits a sphere node for setup
   * @param  {SphereNode} node - Node to visit
   */
  visitSphereNode (node) {
    node.rasterSphere = new RasterSphere(this.context, node.center, node.radius, node.colors, node.materials, node.texture)
  }

  /**
   * Visits an axis aligned box node for setup
   * @param  {AABoxNode} node - Node to visit
   */
  visitAABoxNode (node) {
    node.rasterBox = new RasterAABox(this.context, node.minPoint, node.maxPoint, node.colors, node.materials, node.texture)
  }
}

/**
 * Visitor that tears down WebGL buffers
 */
export class RasterTeardownVisitor extends Visitor {
  /**
   * Visits a sphere node for teardown
   * @param  {SphereNode} node - Node to visit
   */
  visitSphereNode (node) {
    node.rasterSphere.teardown()
  }

  /**
   * Visits an axis aligned box node for teardown
   * @param  {AABoxNode} node - Node to visit
   */
  visitAABoxNode (node) {
    node.rasterBox.teardown()
  }
}
