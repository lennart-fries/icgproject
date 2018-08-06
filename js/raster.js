/* global performance */

import { RasterSetupVisitor, RasterVisitor } from './raster/rastervisitor.js'
import { Shader } from './raster/shader.js'
import { RotationNode } from './scenegraph/animation-nodes.js'
import { Vector } from './primitives/vector.js'

export function rasterizer (sg, gl, camera, gn2) {
  const setupVisitor = new RasterSetupVisitor(gl)
  setupVisitor.setup(sg)

  const visitor = new RasterVisitor(gl)

  const phongShader = new Shader(gl,
    'glsl/phong-vertex-shader.glsl',
    'glsl/phong-fragment-shader.glsl'
  )
  visitor.shader = phongShader
  const textureShader = new Shader(gl,
    'glsl/texture-vertex-shader.glsl',
    'glsl/texture-fragment-shader.glsl'
  )
  visitor.textureshader = textureShader

  let animationNodes = [
    new RotationNode(gn2, new Vector(0, 0, 1))
  ]

  function simulate (deltaT) {
    for (let animationNode of animationNodes) {
      animationNode.simulate(deltaT)
    }
  }

  let lastTimestamp = performance.now()

  function animate (timestamp) {
    var width = gl.canvas.clientWidth
    var height = gl.canvas.clientHeight
    if (gl.canvas.width !== width || gl.canvas.height !== height) {
      gl.canvas.width = width
      gl.canvas.height = height
      gl.viewport(0, 0, width, height)
      camera.aspect = width / height
    }
    simulate(timestamp - lastTimestamp)
    visitor.render(sg, camera)
    lastTimestamp = timestamp
    window.requestAnimationFrame(animate)
  }
  Promise.all(
    [phongShader.load(), textureShader.load()]
  ).then(x =>
    window.requestAnimationFrame(animate)
  )

  window.addEventListener('keydown', function (event) {
    switch (event.key) {
      case 'ArrowUp':
        animationNodes[0].toggleActive()
        break
    }
  })
}
