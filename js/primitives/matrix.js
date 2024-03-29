/**
 * Class representing a 4x4 Matrix
 */

import { Vector } from './vector.js'

export class Matrix {
  /**
   * Constructor of the matrix. Expects an array in row-major layout. Saves the data as column major internally
   * @param  {Array.<number>|Float32Array} mat - Matrix values row major
   */
  constructor (mat) {
    this.data = new Float32Array(16)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        this.data[row * 4 + col] = mat[col * 4 + row]
      }
    }
  }

  /**
   * Returns a matrix that represents a translation
   * @param  {Vector} translation - Translation vector that shall be expressed by the matrix
   * @return {Matrix}               Resulting translation matrix
   */
  static translation (translation) {
    let m = Matrix.identity()
    for (let i = 0; i < 3; i++) {
      m.setVal(i, 3, translation.data[i])
    }

    return m
  }

  /**
   * Returns a matrix that represents a rotation
   * @param  {Vector} angles - Angle to rotate per axis, applied in order x, y, z
   * @return {Matrix}          Resulting rotation matrix
   */
  static rotation (angles) {
    let m = Matrix.identity()
    let values = angles.valueOf()
    for (let i = 0; i < 3; i++) {
      let sin = Math.sin(values[i])
      let cos = Math.cos(values[i])
      let offset = (i + 1) % 3
      let offset2 = (i + 2) % 3

      let temp = Matrix.identity()

      temp.setVal(offset, offset, cos)
      temp.setVal(offset, offset2, -sin)
      temp.setVal(offset2, offset, sin)
      temp.setVal(offset2, offset2, cos)

      m = m.mul(temp)
    }
    return m
  }

  /**
   * Returns a matrix that represents a scaling
   * @param  {Vector} scale - Amount to scale in each direction
   * @return {Matrix}         Resulting scaling matrix
   */
  static scaling (scale) {
    let m = Matrix.identity()
    for (let i = 0; i < 3; i++) {
      m.setVal(i, i, scale.data[i])
    }
    return m
  }

  /**
   * Returns a matrix that represents a shear on the upper triangle of the matrix
   * @param  {Vector} shear - Amount to shear in each direction, the X component describes the YZ shear etc.
   * @return {Matrix}         Resulting scaling matrix
   */
  static shear (shear) {
    let m = Matrix.identity()
    let i = 2
    for (let row = 0; row < 2; row++) {
      for (let col = row; col < 3; col++) {
        m.setVal(row, col, shear.data[i])
        i--
      }
    }
    return m
  }

  /**
   * Returns a matrix that represents a shear on the lower triangle of the matrix
   * @param  {Vector} shear - Amount to shear in each direction, the X component describes the ZY shear etc.
   * @return {Matrix}         Resulting scaling matrix
   */
  static shearLower (shear) {
    return Matrix.shear(shear).transpose()
  }

  /**
   * Constructs a viewing matrix
   * @param  {Vector} eye    - Position of the viewer
   * @param  {Vector} center - Position to look at
   * @param  {Vector} up     - Up direction
   * @return {Matrix}          Resulting viewing matrix
   */
  static lookat (eye, center, up) {
    // https://www.khronos.org/registry/OpenGL-Refpages/gl2.1/xhtml/gluLookAt.xml
    let f = new Vector(center.x - eye.x, center.y - eye.y, center.z - eye.z, 0).normalised()
    let s = f.cross(up).normalised()
    let u = s.cross(f)
    let M2 = new Matrix([
      s.x, s.y, s.z, 0,
      u.x, u.y, u.z, 0,
      -f.x, -f.y, -f.z, 0,
      0, 0, 0, 1
    ])
    return M2.mul(Matrix.translation(eye.mul(-1)))
  }

  static lookto (eye, towards, up) {
    let s = towards.cross(up).normalised()
    let u = s.cross(towards)
    let M2 = new Matrix([
      s.x, s.y, s.z, 0,
      u.x, u.y, u.z, 0,
      -towards.x, -towards.y, -towards.z, 0,
      0, 0, 0, 1
    ])
    return M2.mul(Matrix.translation(eye.mul(-1)))
  }

  /**
   * Constructs a new matrix that represents a projection normalisation transformation
   * @param  {number} left   - Camera-space left value of lower near point
   * @param  {number} right  - Camera-space right value of upper right far point
   * @param  {number} bottom - Camera-space bottom value of lower lower near point
   * @param  {number} top    - Camera-space top value of upper right far point
   * @param  {number} near   - Camera-space near value of lower lower near point
   * @param  {number} far    - Camera-space far value of upper right far point
   * @return {Matrix}          Rotation matrix
   */
  static frustum (left, right, bottom, top, near, far) {
    return new Matrix([
      (2 * near) / (right - left), 0, (right + left) / (right - left), 0,
      0, (2 * near) / (top - bottom), (top + bottom) / (top - bottom), 0,
      0, 0, -(far + near) / (far - near), -(2 * far * near) / (far - near),
      0, 0, -1, 0
    ])
  }

  /**
   * Constructs a new matrix that represents a projection normalisation transformation.
   * @param  {number} fovy   - Field of view in y-direction
   * @param  {number} aspect - Aspect ratio between width and height
   * @param  {number} near   - Camera-space distance to near plane
   * @param  {number} far    - Camera-space distance to far plane
   * @return {Matrix}          Resulting matrix
   */
  static perspective (fovy, aspect, near, far) {
    // calculates frustum from fov and near pane
    let top = near * Math.tan(fovy / 2.0 * (Math.PI / 180))
    let bottom = -top
    let right = top * aspect
    let left = -right
    return this.frustum(left, right, bottom, top, near, far)
  }

  /**
   * Returns the identity matrix
   * @return {Matrix} A new identity matrix
   */
  static identity () {
    return new Matrix([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ])
  }

  /**
   * Returns the value of the matrix at position row, col
   * @param  {number} row - Value's row
   * @param  {number} col - Value's column
   * @return {number}       Requested value
   */
  getVal (row, col) {
    return this.data[col * 4 + row]
  }

  /**
   * Sets the value of the matrix at position row, col
   * @param {number} row - Value's row
   * @param {number} val - Value to set to
   * @param {number} col - Value's column
   */
  setVal (row, col, val) {
    this.data[col * 4 + row] = val
  }

  /**
   * Matrix multiplication
   * @param  {Matrix|Vector} other - Matrix or vector to multiplicate with
   * @return {Matrix|Vector}         Result of the multiplication this*other
   */
  mul (other) {
    if (other instanceof Matrix) {
      let result = Matrix.identity()
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          let sum = 0
          for (let i = 0; i < 4; i++) {
            sum += this.getVal(row, i) * other.getVal(i, col)
          }
          result.setVal(row, col, sum)
        }
      }
      return result
    } else { // other is vector
      let result = new Vector(0, 0, 0, 0)
      for (let row = 0; row < 4; row++) {
        let sum = 0
        for (let i = 0; i < 4; i++) {
          sum += this.getVal(row, i) * other.data[i]
        }
        result.data[row] = sum
      }
      return result
    }
  }

  /**
   * Returns the transpose of this matrix
   * @return {Matrix} A new matrix that is the transposed of this
   */
  transpose () {
    return new Matrix(this.data)
  }

  /**
   * Debug print to console
   */
  print () {
    for (let row = 0; row < 4; row++) {
      console.log('> ' + this.getVal(row, 0) +
        '\t' + this.getVal(row, 1) +
        '\t' + this.getVal(row, 2) +
        '\t' + this.getVal(row, 3)
      )
    }
  }

  /**
   * Returns a new matrix that is the inverse of this matrix
   * @return {Matrix} Inverse matrix
   */
  invert () {
    let mat = this.data
    let dst = new Float32Array(16)
    let tmp = new Float32Array(12)

    /* temparray for pairs */
    let src = new Float32Array(16)

    /* array of transpose source matrix */
    let det

    /* determinant */
    /*
     * transpose matrix
  */
    for (let i = 0; i < 4; i++) {
      src[i] = mat[i * 4]
      src[i + 4] = mat[i * 4 + 1]
      src[i + 8] = mat[i * 4 + 2]
      src[i + 12] = mat[i * 4 + 3]
    }

    /* calculate pairs for first 8 elements (cofactors) */
    tmp[0] = src[10] * src[15]
    tmp[1] = src[11] * src[14]
    tmp[2] = src[9] * src[15]
    tmp[3] = src[11] * src[13]
    tmp[4] = src[9] * src[14]
    tmp[5] = src[10] * src[13]
    tmp[6] = src[8] * src[15]
    tmp[7] = src[11] * src[12]
    tmp[8] = src[8] * src[14]
    tmp[9] = src[10] * src[12]
    tmp[10] = src[8] * src[13]
    tmp[11] = src[9] * src[12]

    /* calculate first 8 elements (cofactors) */
    dst[0] = tmp[0] * src[5] + tmp[3] * src[6] + tmp[4] * src[7]
    dst[0] -= tmp[1] * src[5] + tmp[2] * src[6] + tmp[5] * src[7]
    dst[1] = tmp[1] * src[4] + tmp[6] * src[6] + tmp[9] * src[7]
    dst[1] -= tmp[0] * src[4] + tmp[7] * src[6] + tmp[8] * src[7]
    dst[2] = tmp[2] * src[4] + tmp[7] * src[5] + tmp[10] * src[7]
    dst[2] -= tmp[3] * src[4] + tmp[6] * src[5] + tmp[11] * src[7]
    dst[3] = tmp[5] * src[4] + tmp[8] * src[5] + tmp[11] * src[6]
    dst[3] -= tmp[4] * src[4] + tmp[9] * src[5] + tmp[10] * src[6]
    dst[4] = tmp[1] * src[1] + tmp[2] * src[2] + tmp[5] * src[3]
    dst[4] -= tmp[0] * src[1] + tmp[3] * src[2] + tmp[4] * src[3]
    dst[5] = tmp[0] * src[0] + tmp[7] * src[2] + tmp[8] * src[3]
    dst[5] -= tmp[1] * src[0] + tmp[6] * src[2] + tmp[9] * src[3]
    dst[6] = tmp[3] * src[0] + tmp[6] * src[1] + tmp[11] * src[3]
    dst[6] -= tmp[2] * src[0] + tmp[7] * src[1] + tmp[10] * src[3]
    dst[7] = tmp[4] * src[0] + tmp[9] * src[1] + tmp[10] * src[2]
    dst[7] -= tmp[5] * src[0] + tmp[8] * src[1] + tmp[11] * src[2]

    /* calculate pairs for second 8 elements (cofactors) */
    tmp[0] = src[2] * src[7]
    tmp[1] = src[3] * src[6]
    tmp[2] = src[1] * src[7]
    tmp[3] = src[3] * src[5]
    tmp[4] = src[1] * src[6]
    tmp[5] = src[2] * src[5]
    tmp[6] = src[0] * src[7]
    tmp[7] = src[3] * src[4]
    tmp[8] = src[0] * src[6]
    tmp[9] = src[2] * src[4]
    tmp[10] = src[0] * src[5]
    tmp[11] = src[1] * src[4]

    /* calculate second 8 elements (cofactors) */
    dst[8] = tmp[0] * src[13] + tmp[3] * src[14] + tmp[4] * src[15]
    dst[8] -= tmp[1] * src[13] + tmp[2] * src[14] + tmp[5] * src[15]
    dst[9] = tmp[1] * src[12] + tmp[6] * src[14] + tmp[9] * src[15]
    dst[9] -= tmp[0] * src[12] + tmp[7] * src[14] + tmp[8] * src[15]
    dst[10] = tmp[2] * src[12] + tmp[7] * src[13] + tmp[10] * src[15]
    dst[10] -= tmp[3] * src[12] + tmp[6] * src[13] + tmp[11] * src[15]
    dst[11] = tmp[5] * src[12] + tmp[8] * src[13] + tmp[11] * src[14]
    dst[11] -= tmp[4] * src[12] + tmp[9] * src[13] + tmp[10] * src[14]
    dst[12] = tmp[2] * src[10] + tmp[5] * src[11] + tmp[1] * src[9]
    dst[12] -= tmp[4] * src[11] + tmp[0] * src[9] + tmp[3] * src[10]
    dst[13] = tmp[8] * src[11] + tmp[0] * src[8] + tmp[7] * src[10]
    dst[13] -= tmp[6] * src[10] + tmp[9] * src[11] + tmp[1] * src[8]
    dst[14] = tmp[6] * src[9] + tmp[11] * src[11] + tmp[3] * src[8]
    dst[14] -= tmp[10] * src[11] + tmp[2] * src[8] + tmp[7] * src[9]
    dst[15] = tmp[10] * src[10] + tmp[4] * src[8] + tmp[9] * src[9]
    dst[15] -= tmp[8] * src[9] + tmp[11] * src[10] + tmp[5] * src[8]

    /* calculate determinant */
    det = src[0] * dst[0] + src[1] * dst[1] + src[2] * dst[2] + src[3] * dst[3]

    if (det === 0.0) {
      throw new Error('singular matrix is not invertible')
    }

    /* calculate matrix inverse */
    det = 1 / det

    for (let j = 0; j < 16; j++) {
      dst[j] *= det
    }

    let ret = Matrix.identity()
    ret.data = dst
    return ret
  }
}
