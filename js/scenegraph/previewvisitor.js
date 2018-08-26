import { Visitor } from './visitor.js'

export class PreviewVisitor extends Visitor {

  /**
   * Searches the Scenegraph for the camera node and all light nodes
   * @param  {Node} rootNode    - The root node of the Scenegraph
   * @returns {Array.<Object>}  - The camera in array[0] and all lights after that
   */
  run (rootNode) {
    this.lightPositions = []
    rootNode.accept(this)
    return [this.camera, this.lightPositions]
  }

  /**
   * Visits a camera node and safes it in the previewVisitor
   * @param  {Node} node - The node to visit
   */
  visitCameraNode (node) {
    let mat = this.currentMatrix
    this.camera = {
      eye: mat.mul(node.eye),
      center: mat.mul(node.center),
      up: mat.mul(node.up),
      fovy: node.fovy,
      aspect: node.aspect,
      near: node.near,
      far: node.far
    }
  }

  /**
   * Visits a light node and writes it to the lightsPosition array
   * @param  {Node} node - The node to visit
   */
  visitLightNode (node) {
    let mat = this.currentMatrix
    this.lightPositions.push(mat.mul(node.mat))
  }
}
