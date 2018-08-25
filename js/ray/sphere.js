/**
 * A class representing a sphere
 */

import { Intersection } from './intersection.js'

export class Sphere {
  /**
   * Creates a new Sphere with center and radius
   * @param  {Vector} center - The center of the Sphere
   * @param  {number} radius - The radius of the Sphere
   * @param  {Vector} color  - The colour of the Sphere
   */
  constructor (center, radius, color) {
    this.center = center
    this.radius = radius
    this.color = color
  }

  /**
   * Calculates the intersection of the sphere with the given ray
   * @param  {Ray} ray      - The ray to intersect with
   * @return {Intersection}   The intersection if there is one, null if there is none
   */
  intersect (ray) {
    const xZero = ray.origin.sub(this.center)
    const b = xZero.dot(ray.direction)
    const c = xZero.dot(xZero) - this.radius * this.radius

    if (b * b - c < 0) {
      return null
    } else if (b * b - c === 0) {
      return new Intersection(-b)
    } else {
      const t = Math.min(-b + Math.sqrt(b * b - c), -b - Math.sqrt(b * b - c))
      const point = ray.origin.add(ray.direction.mul(t))
      return new Intersection(t, point, point.sub(this.center).normalised())
    }
  }
}
