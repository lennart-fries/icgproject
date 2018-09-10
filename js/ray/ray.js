/**
 * Class representing a ray
 */
export class Ray {
  /**
   * Creates a new ray with origin and direction
   * @param  {Vector} origin    - Origin of the Ray
   * @param  {Vector} direction - Direction of the Ray
   */
  constructor (origin, direction) {
    this.origin = origin
    this.direction = direction
  }

  /**
   * Creates a ray from the camera through the image plane. The plane is located at (0, 0, -1) with x ∈ [-1,1] and y ∈ [-1, 1]
   * @param  {number} width  - Width of the canvas
   * @param  {number} height - Height of the canvas
   * @param  {number} xpos   - Pixel's x-position in the canvas
   * @param  {number} ypos   - Pixel's y-position in the canvas
   * @param  {Vector} camera - Camera-position
   * @return {Ray}             Resulting Ray
   */
  static makeRay (width, height, xpos, ypos, camera) {
    const fovyRadian = camera.fovy * Math.PI / 180
    const viewDir = camera.towards.normalised()
    const rightDir = viewDir.cross(camera.up)

    const h = ((ypos / (height - 1)) * 2 - 1) * camera.near * Math.tan(fovyRadian / 2)
    const w = ((xpos / (width - 1)) * 2 - 1) * camera.near * Math.tan(fovyRadian / 2) * camera.aspect

    const direction = viewDir.mul(camera.near).add(rightDir.mul(w)).add(camera.up.mul(h))

    return new Ray(
      camera.eye, direction.normalised()
    )
  }
}
