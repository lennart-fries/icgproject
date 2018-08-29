/**
 * Class representing a Visitor that uses ray tracing to render a scene graph
 */

import { Ray } from './ray.js'
import { RaySphere } from './ray-sphere.js'
import { Intersection } from './intersection.js'
import { RayAABox } from './ray-aabox.js'
import { phong } from './phong.js'
import { MatrixVisitor } from '../scenegraph/visitor.js'

export class RayVisitor extends MatrixVisitor {
  /**
   * Renders the scene graph
   * @param  {Node} rootNode                 - Root node of the scene graph
   * @param  {Object} camera                 - Camera to use
   * @param  {Array.<Vector>} lightPositions - Array of point light positions to use
   * @param  {number} width                  - Width of the canvas
   * @param  {number} height                 - Height of the canvas
   */
  run (rootNode, camera, lightPositions, width, height) {
    this.imageData = this.context.getImageData(0, 0, width, height)
    // clear
    let data = this.imageData.data
    data.fill(0)
    this.objects = []

    // build list of render objects
    super.run(rootNode)

    // ray trace
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const ray = Ray.makeRay(width, height, x, y, camera)

        let minIntersection = new Intersection()
        let minObj = null
        for (let shape of this.objects) {
          const intersection = shape.intersect(ray)
          if (intersection && intersection.closerThan(minIntersection)) {
            minIntersection = intersection
            minObj = shape
          }
        }
        if (minObj) {
          // mirror around Y axis to match WebGL coordinates
          let offset = 4 * (width * (height - y) + x)
          if (!minObj.color) {
            data[offset] = 0
            data[offset + 1] = 0
            data[offset + 2] = 0
            data[offset + 3] = 255
          } else {
            let color = phong(minObj.color, minIntersection, lightPositions, 4.0, camera.eye)
            data[offset] = color.r * 255
            data[offset + 1] = color.g * 255
            data[offset + 2] = color.b * 255
            data[offset + 3] = color.a * 255
          }
          if (y === 95 && x === 105) {
            console.log(minObj, minIntersection, data[offset], data[offset+1], data[offset+2], data[offset+3])
            data[offset] = 255
            data[offset + 1] = 255
            data[offset + 2] = 255
            data[offset + 3] = 255
            continue
          }
        }
      }
    }
    this.context.putImageData(this.imageData, 0, 0)
  }

  /**
   * Visits a sphere node
   * @param  {SphereNode} node - Node to visit
   */
  visitSphereNode (node) {
    let mat = this.currentMatrix
    this.objects.push(new RaySphere(mat.mul(node.center), node.radius, node.color))
  }

  /**
   * Visits an axis aligned box node
   * @param  {AABoxNode} node - Node to visit
   */
  visitAABoxNode (node) {
    let mat = this.currentMatrix
    this.objects.push(new RayAABox(mat.mul(node.minPoint), mat.mul(node.maxPoint), node.color))
  }
}
