import { Vector } from '../primitives/vector.js'

/**
 * Calculate the colour of an object at the intersection point according to the Phong Lighting model.
 * @param {Vector} objColor               - The colour of the intersected object
 * @param {Intersection} intersection     - The intersection information
 * @param {Array.<Vector>} lightPositions - The light positions
 * @param {number} shininess              - The shininess parameter of the Phong model
 * @param {vector} cameraPosition         - The position of the camera
 * @return {Vector}                         The resulting color
 */
export function phong (objColor, intersection, lightPositions, shininess, cameraPosition) {
  let color = objColor

  let ka = 0.6
  let kd = 0.8
  let ks = 0.8
  let ke = shininess
  let energy = 0.3

  // ambient
  let ambient = ka * energy
  let ambientVector = new Vector(ambient, ambient, ambient, 0)
  color = color.add(ambientVector)

  // diffuse
  let dsum = 0
  lightPositions.forEach(function (light) {
    let sj = light.sub(intersection.point)
    let n = intersection.normal

    if (n.dot(sj) > 0) {
      dsum = dsum + (energy * n.dot(sj))
    }
  })
  let diffuse = kd * dsum
  let diffuseVector = new Vector(diffuse, diffuse, diffuse, 0)
  color = color.add(diffuseVector)

  // specular
  let ssum = 0
  lightPositions.forEach(function (light) {
      let n = intersection.normal
      let l = light.sub(intersection.point).normalised()
      let firstPart = 2 * n.dot(l)
      let middlePart = n.mul(firstPart)
      let r = middlePart.sub(l).normalised()

      let v = cameraPosition.normalised()

      if (r.dot(v) > 0) {
        ssum = ssum + energy * Math.pow((r.dot(v)), ke)
      } else {
        ssum = ssum + Math.pow(0, ke)
      }
    }
  )

  let specular = ks * ssum
  let specularVector = new Vector(specular, specular, specular, 0)
  color = color.add(specularVector)

  return color
}
