/* global performance */
/* eslint new-cap: ['error', { 'newIsCapExceptions': ['renderer'] }] */

import { Matrix } from './primitives/matrix.js'
import { Vector } from './primitives/vector.js'
import { GroupNode, SphereNode, AABoxNode } from './scenegraph/nodes.js'
import { RotationNode } from './scenegraph/animation-nodes.js'
import { renderer, renderResolution } from './ui.js'

let r

const canvasID = 'render-surface'
let canvas = document.getElementById(canvasID)

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

const colors = [
  0.0, 1.0, 0.0, 1.0,
  0.0, 0.0, 1.0, 1.0,
  1.0, 0.0, 0.0, 1.0,
  0.0, 0.0, 0.0, 1.0,
  // untenrechts
  0.0, 1.0, 0.0, 1.0, // grün
  // untenlinks
  1.0, 0.0, 0.0, 1.0, // rot
  // obenlinks
  1.0, 0.0, 1.0, 1.0, // rosa
  // obenrechts
  0.0, 0.0, 1.0, 1.0 // blau
]

const cube = new AABoxNode(
  new Vector(-1, -1, -1, 1),
  new Vector(1, 1, 1, 1),
  colors
  // 'assets/diamond_ore.png'
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

export function simulate (deltaT) {
  for (let animationNode of animationNodes) {
    animationNode.simulate(deltaT)
  }
}

let lastTimestamp = performance.now()

function updateRenderer () {
  if (r == null || !(r instanceof renderer)) {
    if (r != null) {
      r.teardown()

      // recreate canvas to lose context
      let newCanvas = document.createElement('canvas')
      newCanvas.setAttribute('id', canvasID)
      canvas.parentNode.replaceChild(newCanvas, canvas)
      canvas = newCanvas
    }
    r = new renderer(canvas, sg)
    r.setup().then(() =>
      window.requestAnimationFrame(animate)
    )
    return true
  }
  return false
}

function updateResolution () {
  var width = canvas.clientWidth / renderResolution
  var height = canvas.clientHeight / renderResolution
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    r.updateResolution(width, height)
    camera.aspect = width / height
  }
}

function animate (timestamp) {
  if (updateRenderer()) {
    return
  }
  updateResolution()
  simulate(timestamp - lastTimestamp)
  r.loop(sg, camera, lightPositions)
  lastTimestamp = timestamp
  window.requestAnimationFrame(animate)
}

updateRenderer()

window.addEventListener('keydown', function (event) {
  switch (event.key) {
    case 'ArrowUp':
      animationNodes[0].toggleActive()
      break
  }
})
