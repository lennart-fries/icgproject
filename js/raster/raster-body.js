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
   * @param  {string | null} texture               Image filename for the texture, optional
   */
  constructor (gl, vertices, normals, uvs, colors, materials, indices, texture = null) {
    this.gl = gl
    this.textured = (texture != null)

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

    const surfaceBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, surfaceBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array((this.textured) ? uvsNum : colorsNum), gl.STATIC_DRAW)
    this.surfaceBuffer = surfaceBuffer

    if (this.textured) {
      let cubeTexture = gl.createTexture()
      let cubeImage = new Image()
      cubeImage.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, cubeTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cubeImage)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.bindTexture(gl.TEXTURE_2D, null)
      }
      cubeImage.src = texture
      this.texture = cubeTexture
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

    let attributeName, counter
    if (this.textured) {
      attributeName = 'a_texCoord'
      counter = 2
    } else {
      attributeName = 'a_color'
      counter = 4
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.surfaceBuffer)
    const surfaceLocation = shader.getAttributeLocation(attributeName) // color or texture
    this.gl.vertexAttribPointer(surfaceLocation, counter, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(surfaceLocation)

    if (this.textured) {
      this.gl.activeTexture(this.gl.TEXTURE0)
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
      shader.getUniformInt('sampler').set(0)
      shader.getUniformInt('textured').set(1)
    } else {
      shader.getUniformInt('textured').set(0)
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.materialBuffer)
    const materialLocation = shader.getAttributeLocation('a_material')
    this.gl.vertexAttribPointer(materialLocation, 4, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(materialLocation)

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
    this.gl.drawElements(this.gl.TRIANGLES, this.numIndices, this.gl.UNSIGNED_SHORT, 0)

    this.gl.disableVertexAttribArray(positionLocation)
    this.gl.disableVertexAttribArray(normalLocation)
    this.gl.disableVertexAttribArray(surfaceLocation)
    this.gl.disableVertexAttribArray(materialLocation)
  }

  /**
   * Deletes WebGL buffers
   */
  teardown () {
    this.gl.deleteBuffer(this.vertexBuffer)
    this.gl.deleteBuffer(this.normalBuffer)
    this.gl.deleteBuffer(this.surfaceBuffer)
    this.gl.deleteBuffer(this.materialBuffer)
    this.gl.deleteBuffer(this.indexBuffer)
    if (this.textured) {
      this.gl.deleteTexture(this.texture)
    }
  }
}
