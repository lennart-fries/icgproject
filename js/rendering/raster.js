import { RasterSetupVisitor, RasterVisitor, RasterTeardownVisitor } from '../raster/rastervisitor.js'
import { Shader } from '../raster/shader.js'

export class Raster {
  constructor (canvas, sg) {
    this.gl = canvas.getContext('webgl')
    this.setupVisitor = new RasterSetupVisitor(this.gl)
    this.setupVisitor.run(sg)
    this.visitor = new RasterVisitor(this.gl)
    this.sg = sg
  }

  setup () {
    this.phongShader = new Shader(this.gl,
      'glsl/phong-vertex-shader.glsl',
      'glsl/phong-fragment-shader.glsl'
    )
    this.visitor.shader = this.phongShader
    this.textureShader = new Shader(this.gl,
      'glsl/texture-vertex-shader.glsl',
      'glsl/texture-fragment-shader.glsl'
    )
    this.visitor.textureshader = this.textureShader

    return Promise.all(
      [this.phongShader.load(), this.textureShader.load()]
    )
  }

  loop (sg, camera, lightPositions) {
    this.lightPositions = lightPositions
    this.visitor.run(sg, camera)
  }

  updateResolution (width, height) {
    this.gl.viewport(0, 0, width, height)
  }

  teardown () {
    const teardownVisitor = new RasterTeardownVisitor(this.gl)
    teardownVisitor.run(this.sg)
  }
}
