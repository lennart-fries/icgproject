/* global performance */

import { Matrix } from '../primitives/matrix.js'
import { Vector } from '../primitives/vector.js'
import { RasterVisitor, RasterSetupVisitor } from '../raster/rastervisitor.js'
import { Shader } from '../raster/shader.js'
import { RotationNode } from '../scenegraph/animation-nodes.js'
import { GroupNode, SphereNode, TextureBoxNode } from '../scenegraph/nodes.js'

const canvas = document.getElementById('rasteriser')
const gl = canvas.getContext('webgl')

// construct scene graph
const sg = new GroupNode(Matrix.scaling(new Vector(0.2, 0.2, 0.2)))
const gn1 = new GroupNode(Matrix.translation(new Vector(1, 1, 0)))
sg.add(gn1)
const gn3 = new GroupNode(Matrix.identity())
gn1.add(gn3)
const sphere = new SphereNode(new Vector(0.5, -0.8, 0, 1), 0.4, new Vector(0.8, 0.4, 0.1, 1))
gn3.add(sphere)
let gn2 = new GroupNode(Matrix.translation(new Vector(-0.7, -0.4, 0.1)))
sg.add(gn2)
const cube = new TextureBoxNode(
  new Vector(-1, -1, -1, 1),
  new Vector(1, 1, 1, 1),
  'assets/diamond_ore.png'
)
gn2.add(cube)

// setup for rendering
const setupVisitor = new RasterSetupVisitor(gl)
setupVisitor.setup(sg)

const visitor = new RasterVisitor(gl)

let camera = {
  eye: new Vector(-0.5, 0.5, -1, 1),
  center: new Vector(0, 0, 0, 1),
  up: new Vector(0, 1, 0, 0),
  fovy: 90,
  aspect: canvas.width / canvas.height,
  near: 0.1,
  far: 100
}

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
