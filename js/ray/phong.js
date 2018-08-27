import { Vector } from '../primitives/vector.js'

/**
 * Calculate the color of an object at the intersection point according to the Phong lighting model
 * @param {Vector} objColor               - Color of the intersected object
 * @param {Intersection} intersection     - Intersection information
 * @param {Array.<Vector>} lightPositions - Light positions
 * @param {number} shininess              - Shininess parameter of the Phong model
 * @param {Vector} cameraPosition         - Position of the camera
 * @return {Vector}                         Resulting color
 */
export function phong (objColor, intersection, lightPositions, shininess, cameraPosition) {
  let coefficientAmbient = 0.3
  let coefficientDiffuse = 0.6
  let coefficientSpecular = 1.5
  let color

  // ambient new
  color = objColor.mul(coefficientAmbient)

  // diffuse new

  let diffuseSum = 0
  let specularSum = 0
  let viewDirection = (cameraPosition.sub(intersection.point)).normalised()

  for (let i = 0; i < lightPositions.length; i++) {
    // diffuse
    let lightDirection = (lightPositions[i].sub(intersection.point)).normalised()
    let lj = (lightPositions[i].sub(intersection.point)).length * lightPositions[i].w
    diffuseSum += lj * Math.max(lightDirection.dot(intersection.normal), 0)
    // specular
    let negativeLightDir = lightDirection.mul(-1)
    let reflectDirection = negativeLightDir.sub(intersection.normal.mul(2.0 * intersection.normal.dot(negativeLightDir)))
    let specularAngle = Math.max(reflectDirection.normalised().dot(viewDirection), 0)
    let specPow = Math.pow(specularAngle, shininess)
    specularSum = specularSum + lj * specPow
  }

  let diffuseLambertian = coefficientDiffuse * diffuseSum
  let diffuseVec = objColor.mul(diffuseLambertian)
  color = color.add(diffuseVec)

  // specular new
  let specularLambertian = coefficientSpecular * specularSum
  let specularVec = objColor.mul(specularLambertian)
  //color = color.add(specularVec)

  return new Vector(color.x, color.y, color.z, objColor.w)
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
    let n = intersection.normal                             // normal
    let l = light.sub(intersection.point).normalised()      // lightDirection
    let firstPart = 2 * n.dot(l)                            // normal dot light
    let middlePart = n.mul(firstPart)                       // normal mul firstPart
    let r = middlePart.sub(l).normalised()                  // sub for specangle

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
