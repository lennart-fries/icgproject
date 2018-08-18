/* global Image */
/**
 * A class creating buffers for an axis aligned box to render it with WebGL
 */
export class RasterAabox {
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
   * @param {WebGLRenderingContext} gl - The canvas' context
   * @param {Vector} minPoint - The minimal x,y,z of the box
   * @param {Vector} maxPoint - The maximal x,y,z of the box
   * @param {Vector} color - the color of the box
   * @param {string} texture  - The image filename for the texture, optional
   */
  constructor (gl, minPoint, maxPoint, color, texture = '') {
    this.gl = gl
    this.texture = texture
    const mi = minPoint
    const ma = maxPoint
    const vertices = [ // 8x cube corners
      mi.x, mi.y, ma.z,
      ma.x, mi.y, ma.z,
      ma.x, ma.y, ma.z,
      mi.x, ma.y, ma.z,
      ma.x, mi.y, mi.z,
      mi.x, mi.y, mi.z,
      mi.x, ma.y, mi.z,
      ma.x, ma.y, mi.z
    ]
    const indices = [ // triangles, two per cube side
      // front
      0, 1, 2, 2, 3, 0,
      // back
      4, 5, 6, 6, 7, 4,
      // right
      1, 4, 7, 7, 2, 1,
      // top
      3, 2, 7, 7, 6, 3,
      // left
      5, 0, 3, 3, 6, 5,
      // bottom
      5, 4, 1, 1, 0, 5
    ]
    const normals = [ // Normals for each vertex
      // front
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      // back
      0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
      // right
      1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
      // top
      0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      // left
      -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
      // bottom
      0.0, -1.0, 0.0, 0.0, -1.0, 0.0
    ]

    const uv = [ // Texture coordinates per index
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

    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    this.vertexBuffer = vertexBuffer

    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
    this.indexBuffer = indexBuffer
    this.elements = indices.length

    const normalBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW)
    this.normalBuffer = normalBuffer

    const surfaceBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, surfaceBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array((texture === '') ? color : uv), gl.STATIC_DRAW)
    this.surfaceBuffer = surfaceBuffer

    if (texture !== '') {
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
    }
  }

  /**
   * Renders the box
   *
   * @param {Shader} shader - The shader used to render
   */
  render (shader) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    const positionLocation = shader.getAttributeLocation('a_position')
    this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(positionLocation)

    let attributeName, counter
    if (this.texture === '') { // color
      attributeName = 'a_color'
      counter = 4
    } else { // texture
      attributeName = 'a_texCoord'
      counter = 2
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer)
    const normalLocation = shader.getAttributeLocation('a_normal')
    this.gl.vertexAttribPointer(normalLocation, 3, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(normalLocation)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.surfaceBuffer)
    const surfaceLocation = shader.getAttributeLocation(attributeName) // color or texture
    this.gl.vertexAttribPointer(surfaceLocation, counter, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(surfaceLocation)

    if (this.texture === '') {
      shader.getUniformInt('textured').set(0)
    } else {
      this.gl.activeTexture(this.gl.TEXTURE0)
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texBuffer)
      shader.getUniformInt('sampler').set(0)
      shader.getUniformInt('textured').set(1)
    }

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
    this.gl.drawElements(this.gl.TRIANGLES, this.elements, this.gl.UNSIGNED_SHORT, 0)

    this.gl.disableVertexAttribArray(positionLocation)
    this.gl.disableVertexAttribArray(surfaceLocation)
    this.gl.disableVertexAttribArray(normalLocation)
  }

  teardown () {
    this.gl.deleteBuffer(this.vertexBuffer)
    this.gl.deleteBuffer(this.normalBuffer)
    this.gl.deleteBuffer(this.surfaceBuffer)
    this.gl.deleteBuffer(this.indexBuffer)
    if (this.texture !== '') {
      this.gl.deleteTexture(this.texBuffer)
    }
  }
}
