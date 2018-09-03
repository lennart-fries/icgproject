/**
 * A class creating buffers for a sphere to render it with WebGL
 */

import { Vector } from '../primitives/vector.js'
import { RasterBody } from './raster-body.js'
import { Matrix } from '../primitives/matrix.js'

export class RasterSphere extends RasterBody {
  /**
   * Creates all WebGL buffers for the sphere
   * @param  {WebGLRenderingContext} gl          - Canvas' context
   * @param  {Vector} center                     - Center of the sphere
   * @param  {number} radius                     - Radius of the sphere
   * @param  {Array.<Vector> | Vector} colors    - Color(s) of the sphere
   * @param  {Array.<Vector> | Vector} materials - Material(s) of the sphere
   *                                               x = ambient, y = diffuse, z = specular, w = shininess
   * @param  {string | null} texture             - Image filename for the texture, optional
   * @param  {string | null} map                 - Image filename for the mapping texture, optional
   */
  constructor (gl, center, radius, colors, materials, texture = null, map = null) {
    let vertices = []
    let normals = []
    let uvs = []
    let tangents = []
    let m = Matrix.rotation(new Vector(0, Math.PI / 2, 0, 0))

    let ringsize = 30
    for (let ring = 0; ring < ringsize; ring++) {
      for (let ring2 = 0; ring2 < ringsize; ring2++) {
        let theta = ring * Math.PI * 2 / ringsize - 1
        let phi = ring2 * Math.PI * 2 / ringsize

        let vertex = new Vector(
          radius * Math.sin(theta) * Math.cos(phi) + center.x,
          radius * Math.sin(theta) * Math.sin(phi) + center.y,
          radius * Math.cos(theta) + center.z,
          1
        )

        let normal = vertex.sub(center).normalised()

        let uv = new Vector(
          Math.atan2(normal.x, normal.z) / (2 * Math.PI) + 0.5,
          normal.y * 0.5 + 0.5,
          0,
          1
        )

        let tangent = m.mul(new Vector(normal.x, 0, normal.z, 0))

        vertices.push(vertex)
        normals.push(normal)
        uvs.push(uv)
        tangents.push(tangent)
      }
    }

    let indices = []

    for (let ring = 0; ring < ringsize - 1; ring++) {
      for (let ring2 = 0; ring2 < ringsize; ring2++) {
        indices.push(ring * ringsize + ring2)
        indices.push(ring * ringsize + ((ring2 + 1) % ringsize))
        indices.push((ring + 1) * ringsize + ring2)

        indices.push(ring * ringsize + ((ring2 + 1) % ringsize))
        indices.push((ring + 1) * ringsize + ((ring2 + 1) % ringsize))
        indices.push((ring + 1) * ringsize + ring2)
      }
    }

    super(gl, vertices, normals, tangents, uvs, colors, materials, indices, texture, map)
  }
}
