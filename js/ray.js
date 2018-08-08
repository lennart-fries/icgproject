import { RayVisitor } from './ray/rayvisitor.js'

export function raytracer (canvas, camera, sg, lightPositions) {
  const ctx = canvas.getContext('2d')
  const visitor = new RayVisitor(ctx)

  let animationHandle

  function animate (timestamp) {
    var width = canvas.clientWidth
    var height = canvas.clientHeight
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
      camera.aspect = width / height
    }

    visitor.render(sg, camera, lightPositions, canvas.width, canvas.height)
    animationHandle = window.requestAnimationFrame(animate)
  }

  function startAnimation () {
    if (animationHandle) {
      window.cancelAnimationFrame(animationHandle)
    }
    animationHandle = window.requestAnimationFrame(animate)
  }
  startAnimation()
}
