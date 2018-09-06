/* global performance */
/* eslint new-cap: ['error', { 'newIsCapExceptions': ['renderer'] }] */

import { settings } from './ui/ui.js'
import { PreviewVisitor } from './scenegraph/preview-visitor.js'

let r, previewVisitor, scenegraph, animationNodes

const canvasID = 'render-surface'
let canvas = document.getElementById(canvasID)

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
    r = new settings.settings.renderer(canvas, scenegraph)
    previewVisitor = new PreviewVisitor()
    r.setup().then(() =>
      window.requestAnimationFrame(animate)
    )
    return true
  }
  return false
}
Date.now()
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
  // Update scenegraph and animation nodes if changed
  let scenegraphNew = settings.settings.scenegraph
  if (!(scenegraphNew === scenegraph)) {
    scenegraph = scenegraphNew
  }
  let animationNodesNew = settings.settings.animationNodes
  if (!(animationNodesNew === animationNodes)) {
    animationNodes = animationNodesNew
  }
  if (updateRenderer()) {
    // Changing the renderer already calls requestAnimationFrame, which calls this method, so quit
    return
  }
  // Set background color of scene
  document.getElementById('content').style.backgroundColor = '#' + settings.settings.backgroundColor
  simulate(timestamp - lastTimestamp)
  let [camera, lights] = previewVisitor.run(scenegraph)
  updateResolution(camera)
  // Render new frame
  r.loop(scenegraph, camera, lights)
  lastTimestamp = timestamp

  window.requestAnimationFrame(animate)
}

animate(Date.now())
