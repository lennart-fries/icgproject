import { RayVisitor } from '../ray/rayvisitor.js'

export class Ray {
  constructor (canvas, sg) {
    this.ctx = canvas.getContext('2d')
    this.visitor = new RayVisitor(this.ctx)
  }

  setup () {
    return Promise.resolve(0)
  }

  loop (sg, camera, lightPositions) {
    this.visitor.render(sg, camera, lightPositions, this.width, this.height)
  }

  updateResolution (width, height) {
    this.width = width
    this.height = height
  }

  teardown () {
    // does nothing
  }
}
