import { Vector } from '../primitives/vector.js'

/**
 * Calculate the color of an object at the intersection point according to the Phong lighting model
 * @param {Vector} objColor               - Color of the intersected object
 * @param {Intersection} intersection     - Intersection information
 * @param {Array.<Vector>} lightPositions - Light positions
 * @param {Vector} material               - Material properties of the intersected object
 *                                          x = ambient, y = diffuse, z = specular, w = shininess
 * @param {Vector} cameraPosition         - Position of the camera
 * @return {Vector}                         Resulting color
 */
export function phong (objColor, intersection, lightPositions, material, cameraPosition) {
  let coefficientAmbient, coefficientDiffuse, coefficientSpecular, shininess, color

  [coefficientAmbient, coefficientDiffuse, coefficientSpecular, shininess] = material.valueOf()

  // ambient
  color = objColor.mul(coefficientAmbient)

  let diffuseSum = 0
  let specularSum = 0
  let viewDirection = (cameraPosition.sub(intersection.point)).normalised()

  for (let i = 0; i < lightPositions.length; i++) {
    // diffuse
    let lightVector = lightPositions[i].sub(intersection.point)
    let lightDirection = lightVector.normalised()
    let lj = lightPositions[i].w / lightVector.length
    diffuseSum += lj * Math.max(lightDirection.dot(intersection.normal), 0)
    // specular
    let negativeLightDir = lightDirection.mul(-1)
    let reflectDirection = negativeLightDir.sub(intersection.normal.mul(2.0 * intersection.normal.dot(negativeLightDir)))
    let specularAngle = Math.max(reflectDirection.normalised().dot(viewDirection), 0)
    let specPow = Math.pow(specularAngle, shininess)
    specularSum = specularSum + lj * specPow
  }

  // diffuse
  let diffuseLambertian = coefficientDiffuse * diffuseSum
  let diffuseVec = objColor.mul(diffuseLambertian)
  color = color.add(diffuseVec)

  // specular
  let specularLambertian = coefficientSpecular * specularSum
  let specularVec = objColor.mul(specularLambertian)
  color = color.add(specularVec)

  return new Vector(color.x, color.y, color.z, objColor.w)
}
