import { Matrix } from './primitives/matrix.js'
import { Vector } from './primitives/vector.js'
import { GroupNode, SphereNode, TextureBoxNode } from './scenegraph/nodes.js'
import { rasterizer } from './raster.js'
import { raytracer } from './ray.js'

const canvas = document.getElementById('rasteriser')
const gl = canvas.getContext('webgl')
const ctx = canvas.getContext('2d')

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

const lightPositions = [
  new Vector(1, 1, -1, 1)
]

let camera = {
  eye: new Vector(-0.5, 0.5, -1, 1),
  center: new Vector(0, 0, 0, 1),
  up: new Vector(0, 1, 0, 0),
  fovy: 90,
  aspect: gl.canvas.clientWidth / gl.canvas.clientHeight,
  near: 0.1,
  far: 100
}

const raster = true

if (raster === true) {
  rasterizer(sg, gl, camera, gn2)
} else {
  raytracer(canvas, ctx, camera, sg, lightPositions)
}
