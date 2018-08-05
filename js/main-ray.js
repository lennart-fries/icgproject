/* eslint-disable import/no-duplicates */
import {GroupNode} from './ray/nodes.js'
import {Matrix} from './primitives/matrix.js'
import {SphereNode} from './ray/nodes.js'
import {Vector} from './primitives/vector.js'
import {RayVisitor} from './ray/rayvisitor.js'

const canvas = document.getElementById('raytracer')
const ctx = canvas.getContext('2d')

const sg = new GroupNode(Matrix.identity())
const gn = new GroupNode(Matrix.identity())
sg.add(gn)
gn.add(new SphereNode(new Vector(0.5, -0.2, 0, 1), 0.4, new Vector(0.3, 0, 0, 1)))
gn.add(new SphereNode(new Vector(-0.5, -0.2, 0.5, 1), 0.4, new Vector(0, 0, 0.3, 1)))
const lightPositions = [
  new Vector(1, 1, -1, 1)
]
const camera = {
  eye: new Vector(0, 0, -2, 1),
  center: new Vector(0, 0, 0, 1),
  up: new Vector(0, 1, 0, 0),
  fovy: 60,
  aspect: canvas.clientWidth / canvas.clientHeight,
  near: 0.1,
  far: 100
}

const visitor = new RayVisitor(ctx)

let animationHandle

function animate (timestamp) {
  var width = canvas.clientWidth
  var height = canvas.clientHeight
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    camera.aspect = width / height
  }

  sg.matrix.setVal(1, 3, Math.sin(Math.PI * timestamp / 2000) * 0.3)
  sg.matrix.setVal(2, 3, Math.cos(Math.PI * timestamp / 2000) * 0.3)

  visitor.render(sg, camera, lightPositions, width, height)
  animationHandle = window.requestAnimationFrame(animate)
}

function startAnimation () {
  if (animationHandle) {
    window.cancelAnimationFrame(animationHandle)
  }
  animationHandle = window.requestAnimationFrame(animate)
}
startAnimation()
