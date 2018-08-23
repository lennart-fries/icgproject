/**
 * Class representing a Visitor that uses Rasterisation to render a Scenegraph
 */

import { Matrix } from '../primitives/matrix.js'
import { RasterSphere } from './raster-sphere.js'
import { RasterAabox } from './raster-aabox.js'
import { Visitor } from '../scenegraph/visitor.js'

export class RasterVisitor extends Visitor {
  /**
   * Renders the Scenegraph
   * @param  {Node} rootNode                 - The root node of the Scenegraph
   * @param  {Object} camera                 - The camera used
   */
  run (rootNode, camera, lightPositions) {
    // clear
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    this.setupCamera(camera)

    this.lightPositions = lightPositions

    // traverse and render
    super.run(rootNode)
  }

  /**
   * Helper function to setup camera matrices
   * @param  {Object} camera - The camera used
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
   * @returns {Object} shader - The shader used
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
   * Visits a sphere node
   * @param  {Node} node - The node to visit
   */
  visitSphereNode (node) {
    let shader = this.setUniforms()
    node.rastersphere.render(shader)
  }

  /**
   * Visits an axis aligned box node
   * @param  {Node} node - The node to visit
   */
  visitAABoxNode (node) {
    let shader = this.setUniforms()
    node.rasterbox.render(shader)
  }
}

/** Class representing a Visitor that sets up buffers for use by the RasterVisitor */
export class RasterSetupVisitor extends Visitor {
  /**
   * Sets up all needed buffers
   * @param  {Node} rootNode - The root node of the Scenegraph
   */
  run (rootNode) {
    // Clear to white, fully opaque
    this.gl.clearColor(1.0, 1.0, 1.0, 1.0)
    // Clear everything
    this.gl.clearDepth(1.0)
    // Enable depth testing
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.depthFunc(this.gl.LEQUAL)

    super.run(rootNode)
  }

  /**
   * Visits a group node
   * @param  {Node} node - The node to visit
   */
  visitGroupNode (node) {
    super.visitGroupNode2(node)
  }

  /**
   * Visits a sphere node
   * @param  {Node} node - The node to visit
   */
  visitSphereNode (node) {
    node.rastersphere = new RasterSphere(this.gl, node.center, node.radius, node.color)
  }

  /**
   * Visits an axis aligned box node
   * @param  {Node} node - The node to visit
   */
  visitAABoxNode (node) {
    node.rasterbox = new RasterAabox(this.gl, node.minPoint, node.maxPoint, node.color, node.texture)
  }
}

export class RasterTeardownVisitor extends Visitor {
  visitGroupNode (node) {
    super.visitGroupNode2(node)
  }

  /**
   * visits a sphere for teardowning
   * @param  {Node} node - The node to visit
   */
  visitSphereNode (node) {
    node.rastersphere.teardown()
  }

  /**
   * visits a aa box for teardowning
   * @param  {Node} node - The node to visit
   */
  visitAABoxNode (node) {
    node.rasterbox.teardown()
  }
}
