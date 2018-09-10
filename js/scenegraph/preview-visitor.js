import { MatrixVisitor } from './visitor.js'
import { Vector } from '../primitives/vector.js'

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
      towards: mat.mul(node.towards),
      up: mat.mul(node.up),
      fovy: node.fovy,
      aspect: node.aspect,
      near: node.near,
      far: node.far
    }
  }

  /**
   * Visits a light node and adds it to the array of light positions
   * @param  {LightNode} node - Node to visit
   */
  visitLightNode (node) {
    let vec = this.currentMatrix.mul(node.position)
    this.lightPositions.push(new Vector(vec.x, vec.y, vec.z, node.intensity))
  }
}
