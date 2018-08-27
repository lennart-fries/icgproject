/**
 * A class creating buffers for a sphere to render it with WebGL
 */

import { Vector } from '../primitives/vector.js'

export class RasterSphere {
  /**
   * Creates all WebGL buffers for the sphere
   * @param {WebGLRenderingContext} gl - Canvas' context
   * @param {Vector} center            - Center of the sphere
   * @param {number} radius            - Radius of the sphere
   * @param {Vector} color             - Color of the sphere
   */
  constructor (gl, center, radius, color) {
    this.gl = gl

    let vertices = []
    let indices = []
    let normals = []

    let ringsize = 30
    for (let ring = 0; ring < ringsize; ring++) {
      for (let ring2 = 0; ring2 < ringsize; ring2++) {
        let theta = ring * Math.PI * 2 / ringsize - 1
        let phi = ring2 * Math.PI * 2 / ringsize
        let x = (radius *
          Math.sin(theta) *
          Math.cos(phi) +
          center.x
        )
        let y = (radius *
          Math.sin(theta) *
          Math.sin(phi) +
          center.y
        )
        let z = (radius *
          Math.cos(theta) +
          center.z
        )
        vertices.push(x)
        vertices.push(y)
        vertices.push(z)

        let normal = (new Vector(x, y, z)).sub(center).normalised()
        normals.push(normal.x)
        normals.push(normal.y)
        normals.push(normal.z)
      }
    }

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

    const vertexBuffer = this.gl.createBuffer()
    gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW)
    this.vertexBuffer = vertexBuffer

    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW)
    this.indexBuffer = indexBuffer

    const normalBuffer = this.gl.createBuffer()
    gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBuffer)
    gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW)
    this.normalBuffer = normalBuffer

    this.elements = indices.length

    this.color = color
  }

  /**
   * Renders the sphere
   * @param {Shader} shader - Shader used to render
   */
  render (shader) {
    shader.getUniformInt('textured').set(0)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    const positionLocation = shader.getAttributeLocation('a_position')
    this.gl.enableVertexAttribArray(positionLocation)
    this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0)

    const colorLocation = shader.getAttributeLocation('a_color')
    this.gl.disableVertexAttribArray(colorLocation)
    this.gl.vertexAttrib4fv(colorLocation, new Float32Array(this.color.valueOf()))

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer)
    const normalLocation = shader.getAttributeLocation('a_normal')
    this.gl.enableVertexAttribArray(normalLocation)
    this.gl.vertexAttribPointer(normalLocation, 3, this.gl.FLOAT, false, 0, 0)

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
    this.gl.drawElements(this.gl.TRIANGLES, this.elements, this.gl.UNSIGNED_SHORT, 0)

    this.gl.disableVertexAttribArray(positionLocation)
    this.gl.disableVertexAttribArray(normalLocation)
  }

  /**
   * Deletes WebGL buffers
   */
  teardown () {
    this.gl.deleteBuffer(this.vertexBuffer)
    this.gl.deleteBuffer(this.normalBuffer)
    this.gl.deleteBuffer(this.indexBuffer)
  }
}
