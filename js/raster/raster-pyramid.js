import { Vector } from '../primitives/vector.js'
import { stretchArray } from '../primitives/array-utils.js'
import { RasterBody } from './raster-body.js'

/**
 * A class creating buffers for an axis aligned box to render it with WebGL
 */
export class RasterPyramid extends RasterBody {
  /**
   * Creates all WebGL buffers for the sphere
   * @param  {WebGLRenderingContext} gl          - Canvas' context
   * @param  {Vector} center                     - Center of the tetrahedron
   * @param  {number} height                     - Height of the tetrahedron
   * @param  {Array.<Vector> | Vector} colors    - Color(s) of the sphere
   * @param  {Array.<Vector> | Vector} materials - Material(s) of the sphere
   *                                               x = ambient, y = diffuse, z = specular, w = shininess
   * @param  {string | null} texture               Image filename for the texture, optional
   */
  constructor (gl, center, height, colors, materials, texture = null) {
    // right
    const vertex0 = new Vector((center.x + Math.sqrt(8 / 9)) * height, center.y * height, center.z * height, 1)
    // front left
    const vertex1 = new Vector((center.x - Math.sqrt(2 / 9)) * height, center.y * height, (center.z + Math.sqrt(2 / 3)) * height, 1)
    // back left
    const vertex2 = new Vector((center.x - Math.sqrt(2 / 9)) * height, center.y * height, (center.z - Math.sqrt(2 / 3)) * height, 1)
    // up
    const vertex3 = new Vector(center.x * height, (center.y + 4 / 3) * height, center.z * height, 1)

    // 12 = 3 for 4

    const vertices = [ // vertices for each side
      // bottom
      vertex0, vertex1, vertex2,
      // left
      vertex3, vertex2, vertex1,
      // right
      vertex0, vertex3, vertex1,
      // back
      vertex0, vertex3, vertex2
    ]

    const normals = stretchArray([ // Normals for each vertex
      // bottom
      new Vector(0, -1, 0, 0),
      // left
      (vertex2.sub(vertex3)).cross(vertex1.sub(vertex3)),
      // right
      (vertex1.sub(vertex3)).cross(vertex0.sub(vertex3)),
      // back
      (vertex0.sub(vertex3)).cross(vertex2.sub(vertex3))
    ], 12)

    const uvsRaw = [ // Texture coordinates per vertex, same for each side
      new Vector(0, 0, 0, 1),
      new Vector(1, 0, 0, 1),
      new Vector(0.5, 1, 0, 1)
    ]
    let uvs = []

    const indicesRaw = [0, 1, 2] // one triangle per side
    let indices = []

    for (let i = 0; i < 4; i++) {
      uvs = uvs.concat(uvsRaw)
      indices = indices.concat(indicesRaw.map(x => x + (i * 3)))
    }
    super(gl, vertices, normals, uvs, colors, materials, indices, texture)
  }
}
