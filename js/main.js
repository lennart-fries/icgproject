/* global performance */
/* eslint new-cap: ['error', { 'newIsCapExceptions': ['renderer'] }] */

import { Matrix } from './primitives/matrix.js'
import { Vector } from './primitives/vector.js'
import { GroupNode, SphereNode, AABoxNode, PyramidNode, CameraNode, LightNode } from './scenegraph/nodes.js'
import { AnimationNode, BackAndForthAnimationNode } from './animation/animation-nodes.js'
import { settings } from './ui/ui.js'
import { PreviewVisitor } from './scenegraph/preview-visitor.js'

let r, previewVisitor

const canvasID = 'render-surface'
let canvas = document.getElementById(canvasID)

// construct scene graph
const sg = new GroupNode(Matrix.identity())
const gn1 = new GroupNode(Matrix.translation(new Vector(1, 1, 0, 0.0)))
sg.add(gn1)
const gn3 = new GroupNode(Matrix.identity())
gn1.add(gn3)
const sphere = new SphereNode(
  new Vector(0.5, -0.8, 0, 1),
  0.4,
  new Vector(0.8, 0.4, 0.1, 1),
  new Vector(0.3, 0.6, 1.5, 4)
)

gn3.add(sphere)
let gn2 = new GroupNode(Matrix.translation(new Vector(-0.7, -0.4, 0.1, 0.0)))
sg.add(gn2)

/* const colorsArray = [
  new Vector(0.0, 1.0, 0.0, 1.0),
  new Vector(0.0, 0.0, 1.0, 1.0),
  new Vector(1.0, 0.0, 0.0, 1.0),
  new Vector(0.0, 0.0, 0.0, 1.0),
  new Vector(0.0, 1.0, 0.0, 1.0),
  new Vector(1.0, 0.0, 0.0, 1.0),
  new Vector(1.0, 0.0, 1.0, 1.0),
  new Vector(0.0, 0.0, 1.0, 1.0)
] */

const colorVector = new Vector(0.0, 1.0, 0.0, 1.0)

const cube = new AABoxNode(
  new Vector(-1, -1, -1, 1),
  new Vector(1, 1, 1, 1),
  colorVector,
  new Vector(0.3, 0.6, 1.5, 4),
  'assets/diamond_ore.png'
)
gn2.add(cube)

const pyramid = new PyramidNode(
  new Vector(1.1, -1.5, 0.5, 0),
  1.5,
  colorVector,
  new Vector(0.3, 0.6, 1.5, 4)
)

gn3.add(pyramid)

const light1 = new LightNode(new Vector(-10, 3, 3, 1), 0.2)
gn1.add(light1)
const light2 = new LightNode(new Vector(10, 3, 3, 1), 0.2)
gn1.add(light2)

const cameraNode = new CameraNode(new Vector(0, 0, 10, 1), new Vector(0, 0, 0, 1), new Vector(0, 1, 0, 0), 60, 1, 0.1, 100)
gn1.add(cameraNode)

let animationNodes = [
  // new AnimationNode(gn2, 1.0, true, new Vector(0.5, 0.5, 0.5, 0), Matrix.rotation),
  new AnimationNode(gn2, 1.0, true, new Vector(0, 0, 0.5, 0), Matrix.rotation),
  new BackAndForthAnimationNode(gn3, 1.0, true, new Vector(0, 0, 1, 0), Matrix.translation, 3, 1.5)
]

/**
 * Advances the animations described by the animation nodes
 * @param deltaT - Time since last invocation
 */
function simulate (deltaT) {
  for (let animationNode of animationNodes) {
    animationNode.simulate(deltaT)
  }
}

let lastTimestamp = performance.now()

/**
 * Makes sure the current renderer is the selected one
 * @return {boolean} - True if renderer changed
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
    previewVisitor = new PreviewVisitor()
    r.setup().then(() =>
      window.requestAnimationFrame(animate)
    )
    return true
  }
  return false
}

/**
 * Makes sure the resolution of the canvas corresponds to the window size and configure camera accordingly
 * @param camera - Camera object to inject the correct aspect ratio into
 */
function updateResolution (camera) {
  // ensure canvas size is a whole number
  let width = Math.ceil(canvas.clientWidth / settings.settings.renderResolution)
  let height = Math.ceil(canvas.clientHeight / settings.settings.renderResolution)
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    r.updateResolution(width, height)
  }
  camera.aspect *= width / height
}

/**
 * Changes settings, advances the animations and draws a new frame
 * @param timestamp - Current time
 */
function animate (timestamp) {
  if (updateRenderer()) {
    // Changing the renderer already calls requestAnimationFrame, which calls this method, so quit
    return
  }
  // Set background color of scene
  document.getElementById('content').style.backgroundColor = '#' + settings.settings.backgroundColor
  simulate(timestamp - lastTimestamp)
  let [camera, lights] = previewVisitor.run(sg)
  updateResolution(camera)
  // Render new frame
  r.loop(sg, camera, lights)
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
