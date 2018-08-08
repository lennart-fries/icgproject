/* global performance */
import { Matrix } from './primitives/matrix.js'
import { Vector } from './primitives/vector.js'
import { GroupNode, SphereNode, TextureBoxNode, AABoxNode } from './scenegraph/nodes.js'
import { Raster } from './rendering/raster.js'
import { Ray } from './rendering/ray.js'
import { RotationNode } from './scenegraph/animation-nodes.js'
let r;
const canvas = document.getElementById('render-surface')

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

/* const cube = new TextureBoxNode(
  new Vector(-1, -1, -1, 1),
  new Vector(1, 1, 1, 1),
  'assets/diamond_ore.png'
) */

const cube = new AABoxNode(
  new Vector(-1, -1, -1, 1),
  new Vector(1, 1, 1, 1),
  new Vector(1, 0, 1, 1)
)

gn2.add(cube)

const lightPositions = [
  new Vector(1, 1, -1, 1)
]

let camera = {
  eye: new Vector(-0.5, 0.5, -1, 1),
  center: new Vector(0, 0, 0, 1),
  up: new Vector(0, 1, 0, 0),
  fovy: 90,
  aspect: canvas.clientWidth / canvas.clientHeight,
  near: 0.1,
  far: 100
}

let animationNodes = [
  new RotationNode(gn2, new Vector(0, 0, 1))
]

const raster = false

if (raster === true) {
  r = new Raster(canvas, sg)
} else {
  r = new Ray(canvas, sg)
}

r.setup().then(x =>
  window.requestAnimationFrame(animate)
)

export function simulate (deltaT) {
  for (let animationNode of animationNodes) {
    animationNode.simulate(deltaT)
  }
}

let lastTimestamp = performance.now()

function animate (timestamp) {
  var width = canvas.clientWidth
  var height = canvas.clientHeight
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    r.updateResolution(width, height)
    camera.aspect = width / height
  }
  simulate(timestamp - lastTimestamp)
  r.loop(sg, camera, lightPositions)
  lastTimestamp = timestamp
  window.requestAnimationFrame(animate)
}

window.addEventListener('keydown', function (event) {
  switch (event.key) {
    case 'ArrowUp':
      animationNodes[0].toggleActive()
      break
  }
})
