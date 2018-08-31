/**
 * A class representing a sphere
 */

import { Intersection } from './intersection.js'
import { elementOrArrayToElement } from '../primitives/array-utils.js'

export class RaySphere {
  /**
   * Creates a new sphere with center and radius
   * @param  {Vector} center                     - Center of the sphere
   * @param  {number} radius                     - Radius of the sphere
   * @param  {Array.<Vector> | Vector} colors    - Color(s) of the sphere, only the first element is used
   * @param  {Array.<Vector> | Vector} materials - Material(s) of the sphere, only the first element is used
   *                                               x = ambient, y = diffuse, z = specular, w = shininess
   */
  constructor (center, radius, colors, materials) {
    this.center = center
    this.radius = radius
    this.color = elementOrArrayToElement(colors)
    this.material = elementOrArrayToElement(materials)
  }

  /**
   * Calculates the intersection of the sphere with the given ray
   * @param  {Ray} ray      - Ray to intersect with
   * @return {Intersection}   Intersection if there is one, null if there is none
   */
  intersect (ray) {
    const xZero = ray.origin.sub(this.center)
    const b = xZero.dot(ray.direction) // (x_0*d)^2
    const c = b * b - xZero.dot(xZero) + this.radius * this.radius // VL 4x38

    if (c < 0) {
      return null
    } else if (c === 0) {
      return new Intersection(-b)
    } else {
      const t = Math.min(-b + Math.sqrt(c), -b - Math.sqrt(c)) // VL 4x38
      const point = ray.origin.add(ray.direction.mul(t)) // VL 4x39
      return new Intersection(t, point, point.sub(this.center).normalised())
    }
  }
}
