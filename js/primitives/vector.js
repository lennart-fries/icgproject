/**
 * Class representing a vector in 4D space
 */

export class Vector {
  /**
   * Create a vector
   * @param  {number} x - X component
   * @param  {number} y - Y component
   * @param  {number} z - Z component
   * @param  {number} w - W component
   * @return {number}     Resulting vector
   */
  constructor (x, y, z, w) {
    if (Array.isArray(x)) {
      this.data = [x[0], x[1], x[2], x[3]]
    } else {
      this.data = [x, y, z, w]
    }
  }

  /**
   * Returns the x component of the vector
   * @return {number} X component of the vector
   */
  get x () {
    return this.data[0]
  }

  /**
   * Sets the x component of the vector to val
   * @param  {number} val - New value
   */
  set x (val) {
    this.data[0] = val
  }

  /**
   * Returns the first component of the vector
   * @return {number} First component of the vector
   */
  get r () {
    return this.data[0]
  }

  /**
   * Sets the first component of the vector to val
   * @param  {number} val - New value
   */
  set r (val) {
    this.data[0] = val
  }

  /**
   * Returns the y component of the vector
   * @return {number} Y component of the vector
   */
  get y () {
    return this.data[1]
  }

  /**
   * Sets the y component of the vector to val
   * @param  {number} val - New value
   */
  set y (val) {
    this.data[1] = val
  }

  /**
   * Returns the second component of the vector
   * @return {number} Second component of the vector
   */
  get g () {
    return this.data[1]
  }

  /**
   * Sets the second component of the vector to val
   * @param  {number} val - New value
   */
  set g (val) {
    this.data[1] = val
  }

  /**
   * Returns the z component of the vector
   * @return {number} Z component of the vector
   */
  get z () {
    return this.data[2]
  }

  /**
   * Sets the z component of the vector to val
   * @param  {number} val - New value
   */
  set z (val) {
    this.data[2] = val
  }

  /**
   * Returns the third component of the vector
   * @return {number} Third component of the vector
   */
  get b () {
    return this.data[2]
  }

  /**
   * Sets the third component of the vector to val
   * @param  {number} val - New value
   */
  set b (val) {
    this.data[2] = val
  }

  /**
   * Returns the w component of the vector
   * @return {number} W component of the vector
   */
  get w () {
    return this.data[3]
  }

  /**
   * Sets the w component of the vector to val
   * @param  {number} val - New value
   */
  set w (val) {
    this.data[3] = val
  }

  /**
   * Returns the fourth component of the vector
   * @return {number} Fourth component of the vector
   */
  get a () {
    return this.data[3]
  }

  /**
   * Sets the fourth component of the vector to val
   * @param  {number} val - New value
   */
  set a (val) {
    this.data[3] = val
  }

  /**
   * Calculates the length of the vector
   * @return {number} Length of the vector
   */
  get length () {
    return Math.sqrt(
      this.x * this.x +
      this.y * this.y +
      this.z * this.z
    )
  }

  /**
   * Creates a new vector with the vector added
   * @param {Vector} other - Vector to add
   * @return {Vector}        New vector;
   */
  add (other) {
    return new Vector(
      this.x + other.x,
      this.y + other.y,
      this.z + other.z,
      this.w + other.w
    )
  }

  /**
   * Creates a new vector with the vector subtracted
   * @param {Vector} other - Vector to subtract
   * @return {Vector}        New vector
   */
  sub (other) {
    return new Vector(
      this.x - other.x,
      this.y - other.y,
      this.z - other.z,
      this.w - other.w
    )
  }

  /**
   * Creates a new vector with the scalar multiplied
   * @param {number} other - Scalar to multiply
   * @return {Vector}        New vector
   */
  mul (other) {
    return new Vector(
      this.x * other,
      this.y * other,
      this.z * other,
      this.w * other
    )
  }

  /**
   * Creates a new vector with the scalar divided
   * @param {number} other - Scalar to divide
   * @return {Vector}        New vector
   */
  div (other) {
    return new Vector(
      this.x / other,
      this.y / other,
      this.z / other,
      this.w / other
    )
  }

  /**
   * Dot product
   * @param {Vector} other - Vector to calculate the dot product with
   * @return {number}        Result of the dot product
   */
  dot (other) {
    if (other instanceof Vector) {
      return (this.x * other.x + this.y * other.y + this.z * other.z)
    } else {
      throw new Error('Dot Products only works with vectors!')
    }
  }

  /**
   * Cross product
   * @param {Vector} other - Vector to calculate the cross product with
   * @return {Vector}        Result of the cross product as new Vector
   */
  cross (other) {
    return new Vector(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x,
      0
    )
  }

  /**
   * Returns an array representation of the vector
   * @return {Array.<number>} An array representation.
   */
  valueOf () {
    return this.data
  }

  /**
   * Creates a new vector by normalising the vector
   * @return {Vector} A vector with length 1
   */
  normalised () {
    const l = this.length
    return this.div(l)
  }

  /**
   * Compares the vector to another
   * @param  {Vector} other - Vector to compare to.
   * @return {Boolean}        True if the vectors carry equal numbers. The fourth element may be both equivalent to undefined to still return true.
   */
  equals (other) {
    return (
      Math.abs(this.x - other.x) <= Number.EPSILON &&
      Math.abs(this.y - other.y) <= Number.EPSILON &&
      Math.abs(this.z - other.z) <= Number.EPSILON &&
      ((!this.w && !other.w) || (Math.abs(this.w - other.w) <= Number.EPSILON))
    )
  }
}
