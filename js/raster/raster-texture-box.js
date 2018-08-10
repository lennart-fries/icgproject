/* global Image */

/**
 * A class creating buffers for a textured box to render it with WebGL
 */
export class RasterTextureBox {
  /**
   * Creates all WebGL buffers for the textured box
   *     6 ------- 7
   *    / |       / |
   *   3 ------- 2  |
   *   |  |      |  |
   *   |  5 -----|- 4
   *   | /       | /
   *   0 ------- 1
   *  looking in negative z axis direction
   * @param {WebGLRenderingContext} gl - The canvas' context
   * @param {Vector} minPoint - The minimal x,y,z of the box
   * @param {Vector} maxPoint - The maximal x,y,z of the box
   */
  constructor (gl, minPoint, maxPoint, texture) {
    this.gl = gl
    const mi = minPoint
    const ma = maxPoint
    let vertices = [
      //  front
      mi.x, mi.y, ma.z, ma.x, mi.y, ma.z, ma.x, ma.y, ma.z,
      ma.x, ma.y, ma.z, mi.x, ma.y, ma.z, mi.x, mi.y, ma.z,
      //  back
      ma.x, mi.y, mi.z, mi.x, mi.y, mi.z, mi.x, ma.y, mi.z,
      mi.x, ma.y, mi.z, ma.x, ma.y, mi.z, ma.x, mi.y, mi.z,
      //  right
      ma.x, mi.y, ma.z, ma.x, mi.y, mi.z, ma.x, ma.y, mi.z,
      ma.x, ma.y, mi.z, ma.x, ma.y, ma.z, ma.x, mi.y, ma.z,
      //  top
      mi.x, ma.y, ma.z, ma.x, ma.y, ma.z, ma.x, ma.y, mi.z,
      ma.x, ma.y, mi.z, mi.x, ma.y, mi.z, mi.x, ma.y, ma.z,
      //  left
      mi.x, mi.y, mi.z, mi.x, mi.y, ma.z, mi.x, ma.y, ma.z,
      mi.x, ma.y, ma.z, mi.x, ma.y, mi.z, mi.x, mi.y, mi.z,
      //  bottom
      mi.x, mi.y, mi.z, ma.x, mi.y, mi.z, ma.x, mi.y, ma.z,
      ma.x, mi.y, ma.z, mi.x, mi.y, ma.z, mi.x, mi.y, mi.z
    ]

    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    this.vertexBuffer = vertexBuffer
    this.elements = vertices.length / 3

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
    this.texBuffer = cubeTexture

    let uv = [
      //  front
      0, 0, 1, 0, 1, 1,
      1, 1, 0, 1, 0, 0,
      //  back
      0, 0, 1, 0, 1, 1,
      1, 1, 0, 1, 0, 0,
      //  right
      0, 0, 1, 0, 1, 1,
      1, 1, 0, 1, 0, 0,
      //  top
      0, 0, 1, 0, 1, 1,
      1, 1, 0, 1, 0, 0,
      //  left
      0, 0, 1, 0, 1, 1,
      1, 1, 0, 1, 0, 0,
      //  bottom
      0, 0, 1, 0, 1, 1,
      1, 1, 0, 1, 0, 0
    ]

    let uvBuffer = this.gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
    gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(uv),
      gl.STATIC_DRAW)
    this.texCoords = uvBuffer
  }

  /**
   * Renders the textured box
   * @param {Shader} shader - The shader used to render
   */
  render (shader) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    const positionLocation = shader.getAttributeLocation('a_position')
    this.gl.enableVertexAttribArray(positionLocation)
    this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0)

    /* const normalLocation = shader.getAttributeLocation('a_normal')
    this.gl.enableVertexAttribArray(normalLocation)
    this.gl.vertexAttribPointer(normalLocation, 3, this.gl.FLOAT, false, 0, 0)

    const colorLocation = shader.getAttributeLocation('a_color')
    this.gl.enableVertexAttribArray(colorLocation)
    this.gl.vertexAttribPointer(colorLocation, 3, this.gl.FLOAT, false, 0, 0); */

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoords)
    const textureLocation = shader.getAttributeLocation('a_texCoord')
    this.gl.enableVertexAttribArray(textureLocation)
    this.gl.vertexAttribPointer(textureLocation, 2, this.gl.FLOAT, false, 0, 0)

    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texBuffer)
    shader.getUniformInt('sampler').set(0)
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.elements)

    this.gl.disableVertexAttribArray(positionLocation)
    // this.gl.disableVertexAttribArray(normalLocation)
    // this.gl.disableVertexAttribArray(colorLocation)
    this.gl.disableVertexAttribArray(textureLocation)
  }

  teardown () {
    this.gl.deleteBuffer(this.vertexBuffer)
    this.gl.deleteBuffer(this.texCoords)
    this.gl.deleteTexture(this.texBuffer)
  }
}
