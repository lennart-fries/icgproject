/* global Image */
import { vecArrayToNumArray, vecOrVecArrayToNumArrayRepeating } from '../primitives/array-utils.js'

/**
 * A class creating buffers for an axis aligned box to render it with WebGL
 */
export class RasterBody {
  /**
   * Creates all WebGL buffers for the body
   * @param  {WebGLRenderingContext} gl          - Canvas' context
   * @param  {Array.<Vector>} vertices           - Vertices for the geometry
   * @param  {Array.<Vector>} normals            - Normal vectors, defined per vertex
   * @param  {Array.<Vector>} uvs                - Texture UV coordinates, defined per vertex
   * @param  {Array.<number>} indices            - Triangles, defined by indices for the vertex array
   * @param  {Array.<Vector> | Vector} colors    - Color(s) of the body
   * @param  {Array.<Vector> | Vector} materials - Material(s) of the body
   *                                               x = ambient, y = diffuse, z = specular, w = shininess
   * @param  {string | null} texture             - Image filename for the texture, optional
   * @param  {string | null} map                 - Image filename for the mapping texture, optional
   */
  constructor (gl, vertices, normals, uvs, colors, materials, indices, texture = null, map = null) {
    this.gl = gl
    this.textured = (texture != null)
    this.mapped = (map != null)

    let verticesNum = vecArrayToNumArray(vertices, -1, 3)
    let normalsNum = vecArrayToNumArray(normals, vertices.length, 3)
    let uvsNum = vecArrayToNumArray(uvs, vertices.length, 2)
    let colorsNum = vecOrVecArrayToNumArrayRepeating(colors, vertices.length)
    let materialsNum = vecOrVecArrayToNumArrayRepeating(materials, vertices.length)

    this.numIndices = indices.length

    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesNum), gl.STATIC_DRAW)
    this.vertexBuffer = vertexBuffer

    const normalBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalsNum), gl.STATIC_DRAW)
    this.normalBuffer = normalBuffer

    if (this.textured || this.mapped) {
      const uvBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvsNum), gl.STATIC_DRAW)
      this.uvBuffer = uvBuffer
    }

    if (!this.textured) {
      const colorBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsNum), gl.STATIC_DRAW)
      this.colorBuffer = colorBuffer
    }

    if (this.textured) {
      // this.texture = gl.createTexture() doesn't work for some twisted reason
      let texTexture = gl.createTexture()
      let texImage = new Image()
      texImage.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texImage)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.bindTexture(gl.TEXTURE_2D, null)
      }
      texImage.src = texture
      this.texture = texTexture
    }
    if (this.mapped) {
      // same as for this.texture
      let mapTexture = gl.createTexture()
      let mapImage = new Image()
      mapImage.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, mapTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mapImage)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.bindTexture(gl.TEXTURE_2D, null)
      }
      mapImage.src = map
      this.normalmap = mapTexture
    }

    const materialBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, materialBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(materialsNum), gl.STATIC_DRAW)
    this.materialBuffer = materialBuffer

    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
    this.indexBuffer = indexBuffer
  }

  /**
   * Renders the body
   * @param  {Shader} shader - Shader used to render
   */
  render (shader) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    const positionLocation = shader.getAttributeLocation('a_position')
    this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(positionLocation)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer)
    const normalLocation = shader.getAttributeLocation('a_normal')
    this.gl.vertexAttribPointer(normalLocation, 3, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(normalLocation)

    let uvLocation, colorLocation
    if (this.textured || this.mapped) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer)
      uvLocation = shader.getAttributeLocation('a_texCoord')
      this.gl.vertexAttribPointer(uvLocation, 2, this.gl.FLOAT, false, 0, 0)
      this.gl.enableVertexAttribArray(uvLocation)
    }
    if (!this.textured) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer)
      colorLocation = shader.getAttributeLocation('a_color')
      this.gl.vertexAttribPointer(colorLocation, 4, this.gl.FLOAT, false, 0, 0)
      this.gl.enableVertexAttribArray(colorLocation)
    }

    if (this.textured) {
      this.gl.activeTexture(this.gl.TEXTURE0)
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
      shader.getUniformInt('sampler').set(0)
      shader.getUniformInt('textured').set(1)
    } else {
      shader.getUniformInt('textured').set(0)
    }

    if (this.mapped) {
      this.gl.activeTexture(this.gl.TEXTURE1)
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.normalmap)
      shader.getUniformInt('mapSampler').set(1)
      shader.getUniformInt('mapped').set(1)
    } else {
      shader.getUniformInt('mapped').set(0)
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.materialBuffer)
    const materialLocation = shader.getAttributeLocation('a_material')
    this.gl.vertexAttribPointer(materialLocation, 4, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(materialLocation)

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
    this.gl.drawElements(this.gl.TRIANGLES, this.numIndices, this.gl.UNSIGNED_SHORT, 0)

    this.gl.disableVertexAttribArray(positionLocation)
    this.gl.disableVertexAttribArray(normalLocation)
    if (this.textured || this.mapped) {
      this.gl.disableVertexAttribArray(uvLocation)
    }
    if (!this.textured) {
      this.gl.disableVertexAttribArray(colorLocation)
    }
    this.gl.disableVertexAttribArray(materialLocation)
  }

  /**
   * Deletes WebGL buffers
   */
  teardown () {
    this.gl.deleteBuffer(this.vertexBuffer)
    this.gl.deleteBuffer(this.normalBuffer)
    if (this.textured || this.mapped) {
      this.gl.deleteBuffer(this.uvBuffer)
    }
    if (!this.textured) {
      this.gl.deleteBuffer(this.colorBuffer)
    }
    this.gl.deleteBuffer(this.materialBuffer)
    this.gl.deleteBuffer(this.indexBuffer)

    if (this.textured) {
      this.gl.deleteTexture(this.texture)
    }
    if (this.mapped) {
      this.gl.deleteTexture(this.normalmap)
    }
  }
}
