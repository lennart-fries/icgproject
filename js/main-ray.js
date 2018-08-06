import {GroupNode, SphereNode} from './scenegraph/nodes.js'
import {Matrix} from './primitives/matrix.js'
import {Vector} from './primitives/vector.js'
import { raytracer } from './ray.js'

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

raytracer(canvas, ctx, camera, sg, lightPositions)
