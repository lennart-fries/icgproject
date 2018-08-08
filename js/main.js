import { Matrix } from './primitives/matrix.js'
import { Vector } from './primitives/vector.js'
import { GroupNode, SphereNode, TextureBoxNode, AABoxNode } from './scenegraph/nodes.js'
import { /*rasterizer,*/ setupRaster , teardownRaster } from './rendering/raster.js'
import { raytracer, setupRay, teardownRay } from './rendering/ray.js'
import { RotationNode } from './scenegraph/animation-nodes.js'

const canvas = document.getElementById('rasteriser')

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

const raster = true

if (raster === true) {
  setupRaster(canvas, sg, camera, gn2, animationNodes)
} else {
  setupRay(canvas, camera, sg, lightPositions)
}
