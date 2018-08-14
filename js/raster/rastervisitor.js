/**
 * Class representing a Visitor that uses Rasterisation to render a Scenegraph
 */

import { Matrix } from '../primitives/matrix.js'
import { RasterSphere } from './raster-sphere.js'
import { RasterAabox } from './raster-aabox.js'
import { Visitor } from '../scenegraph/visitor.js'
import { CameraNode, LightNode } from '../scenegraph/nodes.js'

export class RasterVisitor extends Visitor {
  /**
   * Renders the Scenegraph
   * @param  {Node} rootNode                 - The root node of the Scenegraph
   * @param  {Object} camera                 - The camera used
   */
  run (rootNode, camera) {
    // clear
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    this.setupCamera(camera)

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
   * Visits a sphere node
   * @param  {Node} node - The node to visit
   */
  visitSphereNode (node) {
    let shader = this.calculateCurrentShader()
    node.rastersphere.render(shader)
  }

  /**
   * Visits an axis aligned box node
   * @param  {Node} node - The node to visit
   */
  visitAABoxNode (node) {
    let shader = this.calculateCurrentShader()
    node.rasterbox.render(shader)
  }

  calculateCurrentShader () {
    let shader = this.shader
    shader.use()

    let mat = this.currentMatrix
    shader.getUniformMatrix('M').set(mat)

    let V = shader.getUniformMatrix('V')
    if (V && this.lookat) {
      V.set(this.lookat)
    }
    let P = shader.getUniformMatrix('P')
    if (P && this.perspective) {
      P.set(this.perspective)
    }
    let normal = this.lookat.mul(mat).invert().transpose()
    shader.getUniformMatrix('N').set(normal)
    return shader
  }

  /**
   * Visits a textured box node
   * @param  {Node} node - The node to visit
   */
  visitTextureBoxNode (node) {
    let shader = this.textureshader
    shader.use()

    let mat = this.currentMatrix
    shader.getUniformMatrix('M').set(mat)

    let V = shader.getUniformMatrix('V')
    if (V && this.lookat) {
      V.set(this.lookat)
    }
    let P = shader.getUniformMatrix('P')
    if (P && this.perspective) {
      P.set(this.perspective)
    }

    node.rastertexturebox.render(shader)
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
    node.rasterbox = new RasterAabox(this.gl, node.minPoint, node.maxPoint)
  }

  /**
   * Visits a textured box node. Loads the texture
   * and creates a uv coordinate buffer
   * @param  {Node} node - The node to visit
   */
  visitTextureBoxNode (node) {
    node.rastertexturebox = new RasterAabox(this.gl, node.minPoint, node.maxPoint, node.texture)
  }

  /**
   * Visits a camera node
   * @param  {Node} node - The node to visit
   */
  visitCameraNode (node) {
    node.camera = new CameraNode(node.eye, node.center, node.up, node.fovy, node.aspect, node.near, node.far)
  }

  /**
   * Visits a light node
   * @param  {Node} node - The node to visit
   */
  visitLightNode (node) {
    node.light = new LightNode(this.mat)
  }
}

export class RasterTeardownVisitor extends Visitor {
  visitGroupNode (node) {
    super.visitGroupNode2(node)
  }

  /**
   * Visits a light node
   * @param  {Node} node - The node to visit
   */
  visitSphereNode (node) {
    node.rastersphere.teardown()
  }

  /**
   * Visits a light node
   * @param  {Node} node - The node to visit
   */
  visitAABoxNode (node) {
    node.rasterbox.teardown()
  }

  visitTextureBoxNode (node) {
    node.rastertexturebox.teardown()
  }

  /**
   * Visits a light node
   * @param  {Node} node - The node to visit
   */
  visitLightNode (node) {
    node.light.teardown()
  }

  /**
   * Visits a light node
   * @param  {Node} node - The node to visit
   */
  visitCameraNode (node) {
    node.camera.teardown()
  }
}
