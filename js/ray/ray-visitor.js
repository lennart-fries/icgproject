/**
 * Class representing a Visitor that uses ray tracing to render a scene graph
 */

import { Ray } from './ray.js'
import { RaySphere } from './ray-sphere.js'
import { Intersection } from './intersection.js'
import { phong } from './phong.js'
import { MatrixVisitor } from '../scenegraph/visitor.js'
import { Vector } from '../primitives/vector.js'

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
          let color = phong(minObj.color, minIntersection, lightPositions, minObj.material, camera.eye)

          // mirror around Y axis to match WebGL coordinates
          let offset = 4 * (width * (height - y) + x)

          data[offset] = color.r * 255
          data[offset + 1] = color.g * 255
          data[offset + 2] = color.b * 255
          data[offset + 3] = color.a * 255
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
    this.objects.push(new RaySphere(mat.mul(node.center), node.radius, node.colors, node.materials))
  }

  /**
   * Visits an axis aligned box node
   * @param  {AABoxNode} node - Node to visit
   */
  visitAABoxNode (node) {
    let mat = this.currentMatrix
    let center = node.minPoint.add(node.maxPoint.sub(node.minPoint).mul(0.5))
    let radius = (node.maxPoint.x - node.minPoint.x) / 2.0
    this.objects.push(new RaySphere(mat.mul(center), radius, node.colors, node.materials))
  }

  /**
   * Visits an tetrahedron pyramid node
   * @param  {AABoxNode} node - Node to visit
   */
  visitPyramidNode (node) {
    let mat = this.currentMatrix
    let center = node.center
    this.objects.push(new RaySphere(mat.mul(center.add(new Vector(0, 0.5, 0, 1))), node.height / 2, node.colors, node.materials))
  }
}
