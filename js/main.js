/* global performance */
/* eslint new-cap: ['error', { 'newIsCapExceptions': ['renderer'] }] */

import { Matrix } from './primitives/matrix.js'
import { Vector } from './primitives/vector.js'
import { GroupNode, SphereNode, AABoxNode, CameraNode, LightNode } from './scenegraph/nodes.js'
import { RotationNode } from './scenegraph/animation-nodes.js'
import { settings } from './ui/ui.js'
import { PreviewVisitor } from './scenegraph/previewvisitor.js'

let r
let previewVisitor = new PreviewVisitor()

const canvasID = 'render-surface'
let canvas = document.getElementById(canvasID)

// construct scene graph
const sg = new GroupNode(Matrix.scaling(new Vector(0.2, 0.2, 0.2, 0.0)))
const gn1 = new GroupNode(Matrix.translation(new Vector(1, 1, 0, 0.0)))
sg.add(gn1)
const gn3 = new GroupNode(Matrix.identity())
gn1.add(gn3)
const sphere = new SphereNode(new Vector(0.5, -0.8, 0, 1), 0.4, new Vector(0.8, 0.4, 0.1, 1))
gn3.add(sphere)
let gn2 = new GroupNode(Matrix.translation(new Vector(-0.7, -0.4, 0.1, 0.0)))
sg.add(gn2)

const colorsArray = [
  new Vector(0.0, 1.0, 0.0, 1.0),
  new Vector(0.0, 0.0, 1.0, 1.0),
  new Vector(1.0, 0.0, 0.0, 1.0),
  new Vector(0.0, 0.0, 0.0, 1.0),
  new Vector(0.0, 1.0, 0.0, 1.0),
  new Vector(1.0, 0.0, 0.0, 1.0),
  new Vector(1.0, 0.0, 1.0, 1.0),
  new Vector(0.0, 0.0, 1.0, 1.0)
]

const colorVector = new Vector(0.0, 1.0, 0.0, 1.0)

const cube = new AABoxNode(
  new Vector(-1, -1, -1, 1),
  new Vector(1, 1, 1, 1),
  colorVector,
  // 'assets/diamond_ore.png'
)
gn2.add(cube)

const light1 = new LightNode(new Vector(0.2, 1, -1, 0.7))
gn1.add(light1)
const light2 = new LightNode(new Vector(0.2, -10, 1, 0.5))
gn1.add(light2)

const camera = new CameraNode(new Vector(0, 0, 100, 1), new Vector(0, 0, 0, 1), new Vector(0, 1, 0, 0), 60, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
gn1.add(camera)

let animationNodes = [
  new RotationNode(gn2, new Vector(0, 0, 1, 0))
]

export function simulate (deltaT) {
  for (let animationNode of animationNodes) {
    animationNode.simulate(deltaT)
  }
}

let lastTimestamp = performance.now()

/**
 * todo
 * @return {boolean}
 */
function updateRenderer () {
  if (r == null || !(r instanceof settings.settings.renderer)) {
    if (r != null) {
      r.teardown()

      // recreate canvas to lose context
      let newCanvas = document.createElement('canvas')
      newCanvas.setAttribute('id', canvasID)
      canvas.parentNode.replaceChild(newCanvas, canvas)
      canvas = newCanvas
    }
    r = new settings.settings.renderer(canvas, sg)
    r.setup().then(() =>
      window.requestAnimationFrame(animate)
    )
    return true
  }
  return false
}

/**
 * todo
 */
function updateResolution () {
  let width = Math.ceil(canvas.clientWidth / settings.settings.renderResolution)
  let height = Math.ceil(canvas.clientHeight / settings.settings.renderResolution)
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    r.updateResolution(width, height)
    camera.aspect = width / height
  }
}

/**
 * todo
 * @param timestamp
 */
function animate (timestamp) {
  if (updateRenderer()) {
    return
  }
  // camera und light stuff
  updateResolution()
  simulate(timestamp - lastTimestamp)
  let cameraAndLights = previewVisitor.run(sg)
  r.loop(sg, cameraAndLights[0], cameraAndLights[1])
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
