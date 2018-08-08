import { RayVisitor } from '../ray/rayvisitor.js'

/* export function raytracer (canvas, camera, sg, lightPositions) {
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

    sg.matrix.setVal(1, 3, Math.sin(Math.PI * timestamp / 2000) * 0.3)
    sg.matrix.setVal(2, 3, Math.cos(Math.PI * timestamp / 2000) * 0.3)

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
*/

export function setupRay (canvas, camera, sg, lightPositions) {
  const ctx = canvas.getContext('2d')
  const visitor = new RayVisitor(ctx)
  loop(canvas, camera, sg, lightPositions, visitor)
}

function loop (canvas, camera, sg, lightPositions, visitor) {
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

export function teardownRay() {
  // todo something something teardown
}
