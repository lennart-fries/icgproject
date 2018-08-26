import { MatrixVisitor } from './visitor.js'

export class PreviewVisitor extends MatrixVisitor {
  /**
   * Searches the scene graph for the camera node and all light nodes
   * @param  {Node} rootNode - Root node of the scene graph
   * @return {Array.<Object>}  First element: camera, second element: array of light positions as vectors
   */
  run (rootNode) {
    this.lightPositions = []
    super.run(rootNode)
    return [this.camera, this.lightPositions]
  }

  /**
   * Visits a camera node and saves the data in a camera object
   * @param  {CameraNode} node - Node to visit
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
   * @param  {LightNode} node - Node to visit
   */
  visitLightNode (node) {
    let mat = this.currentMatrix
    this.lightPositions.push(mat.mul(node.mat))
  }
}
