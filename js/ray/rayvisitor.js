/**
 * Class representing a Visitor that uses
 * Raytracing to render a Scenegraph
 */

import { Matrix } from '../primitives/matrix.js'
import { Ray } from './ray.js'
import { Sphere } from './sphere.js'
import { Intersection } from './intersection.js'
import { AABox } from './aabox.js'
import { phong } from './phong.js'

export class RayVisitor {
  /**
   * Creates a new RayVisitor
   * @param {Object} context - The 2D context to render to
   */
  constructor (context) {
    this.context = context
    this.currentMatrix = Matrix.identity()
  }

  /**
   * Renders the Scenegraph
   * @param  {Node} rootNode                 - The root node of the Scenegraph
   * @param  {Object} camera                 - The camera used
   * @param  {Array.<Vector>} lightPositions - The light light positions
   * @param {number} width   - The width of the canvas
   * @param {number} height  - The height of the canvas
   */
  render (rootNode, camera, lightPositions, width, height) {
    this.imageData = this.context.getImageData(0, 0, width, height)
    // clear
    let data = this.imageData.data
    data.fill(0)
    this.objects = []

    // build list of render objects
    rootNode.accept(this)

    // raytrace
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
          if (!minObj.color) {
            data[4 * (width * y + x)] = 0
            data[4 * (width * y + x) + 1] = 0
            data[4 * (width * y + x) + 2] = 0
            data[4 * (width * y + x) + 3] = 1
          } else {
            let color = phong(minObj.color, minIntersection, lightPositions, 10, camera.eye)
            data[4 * (width * y + x)] = color.r * 255
            data[4 * (width * y + x) + 1] = color.g * 255
            data[4 * (width * y + x) + 2] = color.b * 255
            data[4 * (width * y + x) + 3] = color.a * 255
          }
        }
      }
    }
    this.context.putImageData(this.imageData, 0, 0)
  }

  /**
   * Visits a group node
   * @param  {Node} node - The node to visit
   */
  visitGroupNode (node) {
    let oldMatrix = this.currentMatrix
    this.currentMatrix = oldMatrix.mul(node.matrix)
    for (let child of node.children) {
      child.accept(this)
    }
    this.currentMatrix = oldMatrix
  }

  /**
   * Visits a sphere node
   * @param  {Node} node - The node to visit
   */
  visitSphereNode (node) {
    let mat = this.currentMatrix
    this.objects.push(new Sphere(mat.mul(node.center), node.radius, node.color))
  }

  /**
   * Visits an axis aligned box node
   * @param  {Node} node - The node to visit
   */
  visitAABoxNode (node) {
    let mat = this.currentMatrix
    this.objects.push(new AABox(mat.mul(node.minPoint), mat.mul(node.maxPoint), node.color))
  }

  /**
   * Visits a textured box node
   * @param  {Node} node - The node to visit
   */
  visitTextureBoxNode (node) { }

  /**
   * Visits a camera box node
   * @param  {Node} node - The node to visit
   */
  visitCameraNode (node) {

  }

  /**
   * Visits a light box node
   * @param  {Node} node - The node to visit
   */
  visitLightNode (node) {

  }
}
