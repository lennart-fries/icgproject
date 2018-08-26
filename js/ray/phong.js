/**
 * Calculate the colour of an object at the intersection point according to the Phong Lighting model.
 * @param {Vector} objColor               - The colour of the intersected object
 * @param {Intersection} intersection     - The intersection information
 * @param {Array.<Vector>} lightPositions - The light positions
 * @param {number} shininess              - The shininess parameter of the Phong model
 * @return {Vector}                         The resulting colour
 */

import { Vector } from '../primitives/vector.js'

export function phong (objColor, intersection, lightPositions, shininess, cameraPosition) {
  let coefficientAmbient = 0.3
  let coefficientDiffuse = 0.6
  let coefficientSpecular = 1.5
  let baseColor = objColor
  // ??? need to get that right
  let vertexNormal = intersection.normal
  let vertexPosition = intersection

  // lightPositions
  // cameraPosition
  // shininess

  // ambient new

  let ambientColor = coefficientAmbient * baseColor

  let ambientVec = new Vector(ambientColor, ambientColor, ambientColor, 0)
  objColor = objColor.add(ambientVec)

  // diffuse new

  let diffuseSum = 0
  let specularSum = 0
  let viewDirection = (vertexNormal.mul(-1)).normalised()

  for (let i = 0; i < lightPositions.size; i++) {
    let lj = (lightPositions.sub(vertexPosition)).length * lightPositions[i].w()
    let lightDirection = (lightPositions[i].sub(intersection.point)).normalised()
    diffuseSum += lj * vertexNormal.dot(lightDirection)
    // specular
    let firstPart = 2 * vertexNormal.dot(lightDirection)
    let secondPart = vertexNormal.mul(firstPart)
    let reflectDirection = (secondPart.sub(lightDirection)).normalised() // still needs to be done
    let specularTerm = Math.pow(viewDirection.dot(reflectDirection), shininess)

    if (specularTerm > 0) {
      specularSum += lj * specularTerm
    } else {
      specularSum += 0
    }
  }

  let diffuseLambertian = coefficientDiffuse * diffuseSum
  let diffuseVec = diffuseLambertian * baseColor
  objColor = objColor.add(diffuseVec)

  // specular new
  let specularLambertian = coefficientSpecular * specularSum
  let specularVec = specularLambertian * baseColor
  objColor = objColor.add(specularVec)

  return objColor
}

/*
  // altes phong
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
    let n = intersection.normal // normal
    let l = light.sub(intersection.point).normalised() // lightDirection
    let firstPart = 2 * n.dot(l) // normal dot light
    let middlePart = n.mul(firstPart) // normal mul firstPart
    let r = middlePart.sub(l).normalised() // sub for specangle

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
*/
