/**
 * Class representing a ray-sphere intersection in 3D space
 */
export class Intersection {
  /**
   * Create an Intersection
   * @param {number} t      - Distance on the ray
   * @param {Vector} point  - Intersection points
   * @param {Vector} normal - Normal in the intersection
   */
  constructor (t, point, normal) {
    if (t) {
      this.t = t
    } else {
      this.t = Infinity
    }
    this.point = point
    this.normal = normal
  }

  /**
   * Determines whether this intersection is closer than the other
   * @param  {Intersection} other - Other Intersection
   * @return {Boolean}              Result
   */
  closerThan (other) {
    return this.t < other.t
  }
}
