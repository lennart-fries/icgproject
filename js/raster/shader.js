/* global alert, fetch */

// Refer to https://developer.mozilla.org/de/docs/Web/API/WebGL_API/Tutorial/Hinzuf%C3%BCgen_von_2D_Inhalten_in_einen_WebGL-Kontext

/**
 * Class to assemble a Shader to use with WebGL
 */
export class Shader {
  /**
   * Creates a shader
   * @param {WebGLRenderingContext} gl - 3D context
   * @param {string} vsFilename        - File name of the vertex shader script node
   * @param {string} fsFilename        - File name of the fragment shader script node
   */
  constructor (gl, vsFilename, fsFilename) {
    this.vsFilename = vsFilename
    this.fsFilename = fsFilename

    this.gl = gl
  }

  /**
   * Loads shader from files, compiles and links it
   * @return {Promise} Finishes when loading is done
   */
  async load () {
    let gl = this.gl
    const vertexShader = this.getShader(gl, this.vsFilename, gl.VERTEX_SHADER)
    const fragmentShader = this.getShader(gl, this.fsFilename, gl.FRAGMENT_SHADER)

    return Promise.all([vertexShader, fragmentShader]).then(shaderParts => {
      // Create the shader program
      this.shaderProgram = gl.createProgram()
      gl.attachShader(this.shaderProgram, shaderParts[0])
      gl.attachShader(this.shaderProgram, shaderParts[1])
      gl.linkProgram(this.shaderProgram)

      // If creating the shader program failed, alert
      if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(this.shaderProgram))
      }
    })
  }

  /**
   * Use this shader program for the next WebGL calls
   */
  use () {
    this.gl.useProgram(this.shaderProgram)
  }

  /**
   * Returns the attribute location of a variable in the shader program
   * @param  {string} name - Name of the variable
   * @return {number}        Variable's location
   */
  getAttributeLocation (name) {
    const attr = this.gl.getAttribLocation(this.shaderProgram, name)
    if (attr !== -1) {
      this.gl.enableVertexAttribArray(attr)
    }
    return attr
  }

  /**
   * Loads a shader part from its file and compiles it
   * @param  {Object} gl                                - 3D context
   * @param  {string} filename                          - File name of shader part
   * @param  {gl.VERTEX_SHADER|gl.FRAGMENT_SHADER} type - Type of shader part
   * @return {Object}                                     Resulting shader part
   */
  async getShader (gl, filename, type) {
    const source = fetch(filename).then(response => response.text())

    return source.then(s => {
      const shader = gl.createShader(type)
      // Send the source to the shader object
      gl.shaderSource(shader, s)
      // Compile the shader program
      gl.compileShader(shader)

      // See if it compiled successfully
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
        return null
      }
      return shader
    })
  }

  /**
   * Returns an object that can be used to set a matrix on the GPU
   * @param  {string} name   - Name of the uniform to set
   * @return {UniformMatrix}   Resulting object
   */
  getUniformMatrix (name) {
    return new UniformMatrix(this.gl,
      this.gl.getUniformLocation(this.shaderProgram, name)
    )
  }

  /**
   * Returns an object that can be used to set a vector on the GPU
   * @param  {string} name - Name of the uniform to set
   * @return {UniformVec3}   Resulting object
   */
  getUniformVec3 (name) {
    return new UniformVec3(this.gl,
      this.gl.getUniformLocation(this.shaderProgram, name)
    )
  }

  /**
   * Returns an object that can be used to set a float on the GPU
   * @param  {string} name - Name of the uniform to set
   * @return {UniformFloat}  Resulting object
   */
  getUniformFloat (name) {
    return new UniformFloat(this.gl,
      this.gl.getUniformLocation(this.shaderProgram, name)
    )
  }

  /**
   * Returns an object that can be used to set an int on the GPU
   * @param  {string} name - Name of the uniform to set
   * @return {UniformInt}    Resulting object
   */
  getUniformInt (name) {
    return new UniformInt(this.gl,
      this.gl.getUniformLocation(this.shaderProgram, name)
    )
  }

  /**
   * Returns an Object that can be used to set an array on the GPU
   * @param  {string} name - Name of the uniform to set
   * @return {UniformArray}  Resulting Object
   */
  getUniformArray (name) {
    return new UniformArray(this.gl,
      this.gl.getUniformLocation(this.shaderProgram, name))
  }
}

/**
 * Handler class to set uniform matrices in the shader program
 */
class UniformMatrix {
  /**
   * Creates an uniform that holds a matrix
   * @param gl       - 3D context
   * @param position - Position of the uniform variable in the shader program
   */
  constructor (gl, position) {
    this.gl = gl
    this.position = position
  }

  /**
   * Sends the given matrix to the GPU
   * @param {Matrix} matrix - Matrix to send
   */
  set (matrix) {
    this.gl.uniformMatrix4fv(
      this.position,
      false,
      matrix.data)
  }
}

/**
 * Handler class to set uniform 3-component vectors in the shader program
 */
class UniformVec3 {
  /**
   * Creates an uniform that holds a 3-component vector
   * @param gl       - 3D context
   * @param position - Position of the uniform variable in the shader program
   */
  constructor (gl, position) {
    this.gl = gl
    this.position = position
  }

  /**
   * Sends the given vector to the GPU as 3dimensional vector
   * @param {Vector} vec - Vector to send
   */
  set (vec) {
    this.gl.uniform3f(
      this.position, vec.x, vec.y, vec.z
    )
  }
}

/**
 * Handler class to set uniform floating point numbers in the shader program
 */
class UniformFloat {
  /**
   * Creates an uniform that holds a floating point number
   * @param gl       - 3D context
   * @param position - Position of the uniform variable in the shader program
   */
  constructor (gl, position) {
    this.gl = gl
    this.position = position
  }

  /**
   * Sends the given float value to the GPU
   * @param {number} value - Float value to send
   */
  set (value) {
    this.gl.uniform1f(this.position, value)
  }
}

/**
 * Handler class to set uniform integers in the shader program
 */
class UniformInt {
  /**
   * Creates an uniform that holds an integer
   * @param gl       - 3D context
   * @param position - Position of the uniform variable in the shader program
   */
  constructor (gl, position) {
    this.gl = gl
    this.position = position
  }

  /**
   * Sends the given int value to the GPU
   * @param {number} value - Int value to send
   */
  set (value) {
    this.gl.uniform1i(this.position, value)
  }
}

/**
 * Handler class to set uniform arrays of 4-component vectors in the shader program
 */
class UniformArray {
  /**
   * Creates an uniform that holds an array of 4-component vectors
   * @param gl       - 3D context
   * @param position - Position of the uniform variable in the shader program
   */
  constructor (gl, position) {
    this.gl = gl
    this.position = position
  }

  /**
   * Sends the given array to the GPU
   * @param {Array.<number>} value - Array of vectors to send
   */
  set (value) {
    let array = []
    for (let i = 0; i < value.length; i++) {
      array[i * 4] = value[i].x
      array[i * 4 + 1] = value[i].y
      array[i * 4 + 2] = value[i].z
      array[i * 4 + 3] = value[i].w
    }
    this.gl.uniform4fv(this.position, array)
  }
}
