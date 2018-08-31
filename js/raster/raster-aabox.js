import { Vector } from '../primitives/vector.js'
import { stretchArray } from '../primitives/array-utils.js'
import { RasterBody } from './raster-body.js'

/**
 * A class creating buffers for an axis aligned box to render it with WebGL
 */
export class RasterAABox extends RasterBody {
  /**
   * Creates all WebGL buffers for the box
   *     6 ------- 7
   *    / |       / |
   *   3 ------- 2  |
   *   |  |      |  |
   *   |  5 -----|- 4
   *   | /       | /
   *   0 ------- 1
   *  looking in negative z axis direction
   * @param  {WebGLRenderingContext} gl          - Canvas' context
   * @param  {Vector} minPoint                   - Minimal x,y,z of the box
   * @param  {Vector} maxPoint                   - Maximal x,y,z of the box
   * @param  {Array.<Vector> | Vector} colors    - Color(s) of the box
   * @param  {Array.<Vector> | Vector} materials - Material(s) of the box
   *                                               x = ambient, y = diffuse, z = specular, w = shininess
   * @param  {string | null} texture               Image filename for the texture, optional
   */
  constructor (gl, minPoint, maxPoint, colors, materials, texture = null) {
    const mi = minPoint
    const ma = maxPoint

    const vertex0 = new Vector(mi.x, mi.y, ma.z, 1)
    const vertex1 = new Vector(ma.x, mi.y, ma.z, 1)
    const vertex2 = new Vector(ma.x, ma.y, ma.z, 1)
    const vertex3 = new Vector(mi.x, ma.y, ma.z, 1)
    const vertex4 = new Vector(ma.x, mi.y, mi.z, 1)
    const vertex5 = new Vector(mi.x, mi.y, mi.z, 1)
    const vertex6 = new Vector(mi.x, ma.y, mi.z, 1)
    const vertex7 = new Vector(ma.x, ma.y, mi.z, 1)

    const vertices = [ // vertices for each side
      // front
      vertex0, vertex1, vertex2, vertex3,
      // back
      vertex4, vertex5, vertex6, vertex7,
      // right
      vertex1, vertex4, vertex7, vertex2,
      // top
      vertex3, vertex2, vertex7, vertex6,
      // left
      vertex5, vertex0, vertex3, vertex6,
      // bottom
      vertex5, vertex4, vertex1, vertex0
    ]

    const normals = stretchArray([ // Normals for each vertex
      // front
      new Vector(0, 0, 1, 0),
      // back
      new Vector(0, 0, -1, 0),
      // right
      new Vector(1, 0, 0, 0),
      // top
      new Vector(0, 1, 0, 0),
      // left
      new Vector(-1, 0, 0, 0),
      // bottom
      new Vector(0, -1, 0, 0)
    ], 24)

    const uvsRaw = [ // Texture coordinates per vertex, same for each side
      new Vector(0, 0, 0, 1),
      new Vector(1, 0, 0, 1),
      new Vector(1, 1, 0, 1),
      new Vector(0, 1, 0, 1)
    ]
    let uvs = []

    const indicesRaw = [0, 1, 2, 2, 3, 0] // triangles, two per cube side
    let indices = []

    for (let i = 0; i < 6; i++) {
      uvs = uvs.concat(uvsRaw)
      indices = indices.concat(indicesRaw.map(x => x + (i * 4)))
    }
    super(gl, vertices, normals, uvs, colors, materials, indices, texture)
  }
}
