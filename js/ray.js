import { RayVisitor } from './ray/rayvisitor.js'

export function raytracer (canvas, ctx, camera, sg, lightPositions) {
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

    sg.matrix.setVal(1, 3, Math.sin(Math.PI * timestamp / 2000) * 0.3)
    sg.matrix.setVal(2, 3, Math.cos(Math.PI * timestamp / 2000) * 0.3)

    visitor.render(sg, camera, lightPositions, width, height)
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