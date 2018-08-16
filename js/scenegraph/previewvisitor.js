import { Visitor } from './visitor.js'
import { Matrix } from '../primitives/matrix'

export class PreviewVisitor extends Visitor {
  run (rootNode, camera) {
    this.setupCamera(camera)

  }

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

  visitCameraNode (node) {
    let mat = this.currentMatrix
    // iwi mat.mul
    this.objects.push([node.eye, node.center, node.up])
  }

  visitLightNode (node) {
    let mat = this.currentMatrix
    // iwi mat.mul
    // woher light positions
    // node.x node.y node.z
    this.objects.push(node.something)
  }
}
