/**
 * Class representing an axis aligned box
 */

import { Vector } from '../primitives/vector.js'
import { Intersection } from './intersection.js'

export class AABox {
  /**
   * Creates an axis aligned box
   * @param  {Vector} minPoint - The minimum Point
   * @param  {Vector} maxPoint - The maximum Point
   * @param  {Vector} color    - The colour of the cube
   * @param  {string} texture  - The image filename for the texture, optional
   */
  constructor (minPoint, maxPoint, color, texture = '') {
    if (typeof color.constructor !== Vector) {
      this.color = new Vector(color[0], color[1], color[2], color[3])
    } else {
      this.color = color
    }
    this.texture = texture
    /*
              Λ y
              |

              7----6
             /|   /|   2 = maxPoint
            3----2 |   4 = minPoint
            | 4--|-5   Looking into negative z direction
            |/   |/
            0----1    -> x

          /
        |_  z
         */

    // array index = point number in drawing
    this.vertices = [
      new Vector(minPoint.x, minPoint.y, maxPoint.z, 1), // 0,0,1
      new Vector(maxPoint.x, minPoint.y, maxPoint.z, 1), // 1,0,1
      new Vector(maxPoint.x, maxPoint.y, maxPoint.z, 1), // 1,1,1
      new Vector(minPoint.x, maxPoint.y, maxPoint.z, 1), // 0,1,1
      new Vector(minPoint.x, minPoint.y, minPoint.z, 1), // 0,0,0
      new Vector(maxPoint.x, minPoint.y, minPoint.z, 1), // 1,0,0
      new Vector(maxPoint.x, maxPoint.y, minPoint.z, 1), // 1,1,0
      new Vector(minPoint.x, maxPoint.y, minPoint.z, 1) // 0,1,0
    ]

    this.minPoint = minPoint
    this.maxPoint = maxPoint

    this.sides = [
      [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]], // vorne
      [this.vertices[5], this.vertices[4], this.vertices[7], this.vertices[6]], // hinten
      [this.vertices[3], this.vertices[2], this.vertices[6], this.vertices[7]], // oben
      [this.vertices[0], this.vertices[4], this.vertices[5], this.vertices[1]], // unten
      [this.vertices[4], this.vertices[0], this.vertices[3], this.vertices[7]], // links
      [this.vertices[1], this.vertices[5], this.vertices[6], this.vertices[2]] // rechts
    ]
  }

  /**
   * Calculates the intersection of the AAbox with the given ray
   * @param  {Ray} ray      - The ray to intersect with
   * @return {Intersection}   The intersection if there is one, null if there is none
   */

  intersect (ray) {
    let inters = []
    this.sides.forEach(function (side, i) {
      let c = Math.floor(i / 2)
      let n = (side[1].sub(side[0])).cross(side[3].sub(side[0])).normalised()
      let d = (c === 0) ? side[0].z : (c === 1) ? side[0].y : side[0].x
      d *= (i % 2) ? -1 : 1
      let t = (d - n.dot(ray.origin)) / n.dot(ray.direction)
      let x = ray.origin.add(ray.direction.mul(t))
      if ((c === 2 || (x.x > this.minPoint.x && x.x < this.maxPoint.x)) &&
        (c === 1 || (x.y > this.minPoint.y && x.y < this.maxPoint.y)) &&
        (c === 0 || (x.z > this.minPoint.z && x.z < this.maxPoint.z))) {
        inters.push(new Intersection(t, x, n))
      }
    }, this)
    if (inters.length === 0) {
      return null
    }
    inters.sort(function (a, b) {
      return a.t - b.t
    })
    return inters[0]
  }
}
