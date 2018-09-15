/* global history */

import { RasterRenderer } from '../rendering/raster-renderer.js'
import { RayRenderer } from '../rendering/ray-renderer.js'
import { JsonDeserializer } from '../scenegraph/JsonDeserializer.js'
import {
  NodePlacement,
  AABoxNode,
  CameraNode,
  GroupNode,
  LightNode,
  PyramidNode,
  SphereNode
} from '../scenegraph/nodes.js'
import { Matrix } from '../primitives/matrix.js'
import { Vector } from '../primitives/vector.js'
import {
  AnimationNode,
  BackAndForthAnimationNode,
  RelativeMovementAnimationNode
} from '../animation/animation-nodes.js'
import { PushKeybind, ToggleKeybind } from './keybinds.js'

const renderersToClasses = {'Raster': RasterRenderer, 'Ray': RayRenderer}
const renderers = Object.keys(renderersToClasses)

export class Settings {
  /**
   * Creates a new settings object with the default settings
   */
  constructor () {
    let nodes = new Map()
    let animationNodes = new Map()
    this.settingsStr = {renderer: 'Raster', renderResolution: '1', backgroundColor: '000000'}
    this.settingsObj = {}
    this.setSettings(this.settingsStr)

    // construct scene graph

    // construct scene graph
    const colorsCube = [
      new Vector(0.5, 0.1, 0.1, 1.0),
      new Vector(0.1, 0.1, 0.5, 1.0),
      new Vector(0.5, 0.5, 0.1, 1.0),
      new Vector(0.5, 0.1, 0.5, 1.0),
      new Vector(0.1, 0.5, 0.5, 1.0),
      new Vector(0.1, 0.5, 0.1, 1.0),
      new Vector(0.5, 0.1, 0.1, 1.0),
      new Vector(0.1, 0.1, 0.5, 1.0),
      new Vector(0.5, 0.5, 0.1, 1.0),
      new Vector(0.5, 0.1, 0.5, 1.0),
      new Vector(0.1, 0.5, 0.5, 1.0),
      new Vector(0.1, 0.5, 0.1, 1.0)
    ]

    const colorsCubeHalf = [
      new Vector(0.5, 0.1, 0.1, 1.0),
      new Vector(0.1, 0.1, 0.5, 1.0),
      new Vector(0.5, 0.5, 0.1, 1.0),
      new Vector(0.5, 0.1, 0.5, 1.0),
      new Vector(0.1, 0.5, 0.5, 1.0),
      new Vector(0.1, 0.5, 0.1, 1.0)
    ]

    const colorsPyramid = [
      new Vector(0.5, 0.5, 0.1, 1.0),
      new Vector(0.5, 0.1, 0.1, 1.0),
      new Vector(0.1, 0.1, 0.5, 1.0),
      new Vector(0.1, 0.5, 0.1, 1.0),
      new Vector(0.5, 0.5, 0.1, 1.0),
      new Vector(0.5, 0.1, 0.1, 1.0),
      new Vector(0.1, 0.1, 0.5, 1.0),
      new Vector(0.1, 0.5, 0.1, 1.0)
    ]

    const colorsPyramidHalf = [
      new Vector(0.5, 0.5, 0.1, 1.0),
      new Vector(0.5, 0.1, 0.1, 1.0),
      new Vector(0.1, 0.1, 0.5, 1.0),
      new Vector(0.1, 0.5, 0.1, 1.0)
    ]

    const colorsSphere = [
      new Vector(0.0, 1.0, 0.0, 1.0),
      new Vector(0.0, 0.0, 1.0, 1.0),
      new Vector(1.0, 0.0, 0.0, 1.0)
    ]

    const desktopCube = new AABoxNode(
      'desktopCube',
      new Vector(-8, -8, -8, 1),
      new Vector(8, 8, 8, 1),
      new Vector(0.4, 0.25, 0.6, 1.0),
      new Vector(0.3, 0.6, 1.5, 4)
    )
    nodes.set(desktopCube.name, desktopCube)
    const sDesktopCube = new NodePlacement(desktopCube.name)

    const mappedCubeL = new AABoxNode(
      'mappedCubeL',
      new Vector(-1.5, 2, 2, 1),
      new Vector(1.5, 5, 5, 1),
      colorsCube,
      new Vector(0.2, 0.2, 0.5, 4),
      'assets/diamond_ore.png',
      'assets/diamond_ore_n.png'
    )
    nodes.set(mappedCubeL.name, mappedCubeL)
    const sMappedCubeL = new NodePlacement(mappedCubeL.name)

    const coloredCubeL = new AABoxNode(
      'coloredCubeL',
      new Vector(-1.5, -1.5, -1.5, 1),
      new Vector(1.5, 1.5, 1.5, 1),
      colorsCube,
      new Vector(0.3, 0.6, 1.5, 4)
    )
    nodes.set(coloredCubeL.name, coloredCubeL)
    const sColoredCubeL = new NodePlacement(coloredCubeL.name)

    const oneColoredCubeL = new AABoxNode(
      'oneColoredCubeL',
      new Vector(-1.5, 2, 2, 1),
      new Vector(1.5, 5, 5, 1),
      colorsCubeHalf,
      new Vector(0.3, 0.6, 1.5, 4)
    )
    nodes.set(oneColoredCubeL.name, oneColoredCubeL)
    const sOneColoredCubeL = new NodePlacement(oneColoredCubeL.name)

    const texturedCubeS = new AABoxNode(
      'texturedCubeS',
      new Vector(-1, -1, -1, 1),
      new Vector(1, 1, 1, 1),
      new Vector(0.2, 0.2, 0.5, 4),
      colorsCube,
      'assets/diamond_ore.png'
    )
    nodes.set(texturedCubeS.name, texturedCubeS)
    const sTexturedCubeS = new NodePlacement(texturedCubeS.name)

    const mappedSphereL = new SphereNode(
      'mappedSphereL',
      new Vector(0, 0, 0, 0),
      2.0,
      colorsSphere,
      new Vector(0.2, 0.2, 0.5, 4),
      'assets/diamond_ore.png',
      'assets/diamond_ore_n.png'
    )
    nodes.set(mappedSphereL.name, mappedSphereL)
    const sMappedSphereL = new NodePlacement(mappedSphereL.name)

    const texturedSphereL = new SphereNode(
      'texturedSphereL',
      new Vector(0, 0, 0, 0),
      2.0,
      colorsSphere,
      new Vector(0.2, 0.2, 0.5, 4),
      'assets/diamond_ore.png'
    )
    nodes.set(texturedSphereL.name, texturedSphereL)
    const sTexturedSphereL = new NodePlacement(texturedSphereL.name)

    const coloredSphereL = new SphereNode(
      'coloredSphereL',
      new Vector(-3, -1, 0, 0),
      2.0,
      new Vector(0.6, 0, 0.2, 1),
      new Vector(0.3, 0.6, 1.5, 4)
    )
    nodes.set(coloredSphereL.name, coloredSphereL)
    const sColoredSphereL = new NodePlacement(coloredSphereL.name)

    const coloredSphereS = new SphereNode(
      'coloredSphereS',
      new Vector(3, 0, 0, 0),
      0.6,
      new Vector(0.2, 0.0, 0.6, 1.0),
      new Vector(0.3, 0.6, 1.5, 4)
    )
    nodes.set(coloredSphereS.name, coloredSphereS)
    const sColoredSphereS = new NodePlacement(coloredSphereS.name)

    const mappedPyramidL = new PyramidNode(
      'mappedPyramidL',
      new Vector(1.5, -1.5, 2, 1),
      2.5,
      colorsPyramid,
      new Vector(0.2, 0.2, 0.5, 4),
      'assets/diamond_ore.png',
      'assets/diamond_ore_n.png'
    )
    nodes.set(mappedPyramidL.name, mappedPyramidL)
    const sMappedPyramidL = new NodePlacement(mappedPyramidL.name)

    const texturedPyramidL = new PyramidNode(
      'texturedPyramidL',
      new Vector(0, -1.5, 0, 1),
      2.5,
      colorsPyramid,
      new Vector(0.2, 0.2, 0.5, 4),
      'assets/diamond_ore.png'
    )
    nodes.set(texturedPyramidL.name, texturedPyramidL)
    const sTexturedPyramidL = new NodePlacement(texturedPyramidL.name)

    const coloredPyramidL = new PyramidNode(
      'coloredPyramidL',
      new Vector(1.5, -1.5, 2, 1),
      2.5,
      colorsPyramid,
      new Vector(0.3, 0.6, 1.5, 4)
    )
    nodes.set(coloredPyramidL.name, coloredPyramidL)
    const sColoredPyramidL = new NodePlacement(coloredPyramidL.name)

    const oneColoredPyramidL = new PyramidNode(
      'oneColoredPyramidL',
      new Vector(1.5, -1.5, 2, 1),
      2.5,
      colorsPyramidHalf,
      new Vector(0.3, 0.6, 1.5, 4)
    )
    nodes.set(oneColoredPyramidL.name, oneColoredPyramidL)
    const sOneColoredPyramidL = new NodePlacement(oneColoredPyramidL.name)

    const mappedPyramidS = new PyramidNode(
      'mappedPyramidS',
      new Vector(3, -1, 0, 4),
      1,
      colorsPyramid,
      new Vector(0.2, 0.2, 0.5, 4),
      'assets/diamond_ore.png',
      'assets/diamond_ore_n.png'
    )
    nodes.set(mappedPyramidS.name, mappedPyramidS)
    const sMappedPyramidS = new NodePlacement(mappedPyramidS.name)

    const gn0 = new GroupNode('scenegraphRoot', Matrix.identity())
    nodes.set(gn0.name, gn0)
    const sGn0 = new NodePlacement(gn0.name)

    const rotator = new GroupNode('rotator', Matrix.identity())
    nodes.set(rotator.name, rotator)
    const sRotator = new NodePlacement(rotator.name)

    const driver = new GroupNode('driver', Matrix.translation(new Vector(-3, -1, 0, 1)))
    nodes.set(driver.name, driver)
    const sDriver = new NodePlacement(driver.name)

    const cameraTranslate = new GroupNode('cameraTranslate', Matrix.translation(new Vector(0, 0, 10, 0)))
    nodes.set(cameraTranslate.name, cameraTranslate)
    const sCameraTranslate = new NodePlacement(cameraTranslate.name)
    sGn0.add(sCameraTranslate)

    const cameraRotate = new GroupNode('cameraRotate', Matrix.identity())
    nodes.set(cameraRotate.name, cameraRotate)
    const sCameraRotate = new NodePlacement(cameraRotate.name)
    sCameraTranslate.add(sCameraRotate)

    // westside
    const jumper = new GroupNode('jumper', Matrix.translation(new Vector(-4, -3, 3.65, 0)))
    nodes.set(jumper.name, jumper)
    const sJumper = new NodePlacement(jumper.name)
    sJumper.add(sTexturedSphereL)

    const rotationNode = new GroupNode('rotationNode', Matrix.translation(new Vector(0, 0, 0, 1)))
    nodes.set(rotationNode.name, rotationNode)
    const sRotationNode = new NodePlacement(rotationNode.name)
    sRotationNode.add(sColoredSphereS)

    const preNode = new GroupNode('preNode', Matrix.translation(new Vector(0, 3, 3, 1)))
    nodes.set(preNode.name, preNode)
    const sPreNode = new NodePlacement(preNode.name)
    sPreNode.add(sRotationNode)
    sPreNode.add(sColoredCubeL)
    sJumper.add(sRotationNode)

    let aRotationNode = new AnimationNode('rotationNode', rotationNode, 1.0, true, new Vector(0, 0.5, 0, 0), Matrix.rotation)
    animationNodes.set(aRotationNode.name, aRotationNode)

    const westSide = new GroupNode('westSide', Matrix.translation(new Vector(0, 0, 8, 0)))
    nodes.set(westSide.name, westSide)
    const sWestSide = new NodePlacement(westSide.name)

    sWestSide.add(sJumper)
    sWestSide.add(sPreNode)
    sWestSide.add(sColoredPyramidL)

    const westsideSphereRotation = new GroupNode('westsideSphereRotation', Matrix.identity())
    nodes.set(westsideSphereRotation.name, westsideSphereRotation)
    const sWestsideSphereRotation = new NodePlacement(westsideSphereRotation.name)
    sWestSide.add(sWestsideSphereRotation)
    sRotationNode.add(sColoredSphereS)
    const rotateSouth = new GroupNode('rotateSouth', Matrix.rotation(new Vector(0, Math.PI / 2, 0, 0)))
    nodes.set(rotateSouth.name, rotateSouth)
    const sRotateSouth = new NodePlacement(rotateSouth.name)

    const southSide = new GroupNode('southSide', Matrix.translation(new Vector(0, 0, 8, 0)))
    nodes.set(southSide.name, southSide)
    const sSouthSide = new NodePlacement(southSide.name)
    sRotateSouth.add(sSouthSide)
    sSouthSide.add(sMappedCubeL)
    sSouthSide.add(sMappedPyramidL)

    const bottomLeft = new GroupNode('bottomLeft', Matrix.translation(new Vector(-3, -1.5, 3, 1)))
    nodes.set(bottomLeft.name, bottomLeft)
    const sBottomLeft = new NodePlacement(bottomLeft.name)
    sSouthSide.add(sBottomLeft)

    const bottomLeftRotation = new GroupNode('bottomLeftRotation', Matrix.translation(new Vector(0, -1, 0, 1)))
    nodes.set(bottomLeftRotation.name, bottomLeftRotation)
    const sBottomLeftRotation = new NodePlacement(bottomLeftRotation.name)
    sBottomLeftRotation.add(sMappedPyramidS)

    let aBottomLeftRotation = new AnimationNode('bottomLeftRotation', bottomLeftRotation, 1.0, true, new Vector(0.5, 0.5, 0.5, 0), Matrix.rotation)
    animationNodes.set(aBottomLeftRotation.name, aBottomLeftRotation)
    southSide.add(sBottomLeft)
    sBottomLeft.add(sBottomLeftRotation)
    sBottomLeft.add(sMappedSphereL)

    const rotateEast = new GroupNode('rotateEast', Matrix.rotation(new Vector(0, Math.PI, 0, 0)))
    nodes.set(rotateEast.name, rotateEast)
    const sRotateEast = new NodePlacement(rotateEast.name)

    const eastSide = new GroupNode('eastSide', Matrix.translation(new Vector(0, 0, 8, 0)))
    nodes.set(eastSide.name, eastSide)
    const sEastSide = new NodePlacement(eastSide.name)
    sRotateEast.add(sEastSide)
    sRotator.add(sColoredCubeL)

    const eastSidelowerLeft = new GroupNode('eastSidelowerLeft', Matrix.translation(new Vector(-4, -2, 4, 0)))
    nodes.set(eastSidelowerLeft.name, eastSidelowerLeft)
    const sEastSidelowerLeft = new NodePlacement(eastSidelowerLeft.name)
    sEastSidelowerLeft.add(sRotator)

    const eastSideTop = new GroupNode('eastSideTop', Matrix.translation(new Vector(0, 4, 4, 0)))
    nodes.set(eastSideTop.name, eastSideTop)
    const sEastSideTop = new NodePlacement(eastSideTop.name)
    sEastSideTop.add(sMappedSphereL)

    const eastRightRotation = new GroupNode('eastRightRotation', Matrix.translation(new Vector(0, 2, 0, 1)))
    nodes.set(eastRightRotation.name, eastRightRotation)
    const sEastRightRotation = new NodePlacement(eastRightRotation.name)
    sEastRightRotation.add(sTexturedCubeS)

    let aEastRightRotation = new AnimationNode('eastRightRotation', eastRightRotation, 1.0, true, new Vector(0.5, 0.5, 0.5, 0), Matrix.rotation)
    animationNodes.set(aEastRightRotation.name, aEastRightRotation)

    const eastSideLowerRight = new GroupNode('eastSideLowerRight', Matrix.translation(new Vector(3, -2, 2, 0)))
    nodes.set(eastSideLowerRight.name, eastSideLowerRight)
    const sEastSideLowerRight = new NodePlacement(eastSideLowerRight.name)
    sEastSide.add(sEastSideLowerRight)
    sEastSide.add(sEastSidelowerLeft)
    sEastSide.add(sEastSideTop)
    sEastSideLowerRight.add(sTexturedPyramidL)
    sEastSideLowerRight.add(sEastRightRotation)

    const rotateNorth = new GroupNode('rotateNorth', Matrix.rotation(new Vector(0, -Math.PI / 2, 0, 0)))
    nodes.set(rotateNorth.name, rotateNorth)
    const sRotateNorth = new NodePlacement(rotateNorth.name)

    const northSide = new GroupNode('northSide', Matrix.translation(new Vector(0, 0, 8, 0)))
    nodes.set(northSide.name, northSide)
    const sNorthSide = new NodePlacement(northSide.name)
    sRotateNorth.add(sNorthSide)
    sNorthSide.add(sDriver)
    sDriver.add(sColoredSphereL)
    sNorthSide.add(sOneColoredCubeL)
    sNorthSide.add(sOneColoredPyramidL)

    const gn1 = new GroupNode('gn1', Matrix.translation(new Vector(1, 1, 0, 0.0)))
    nodes.set(gn1.name, gn1)
    const sGn1 = new NodePlacement(gn1.name)
    sGn0.add(sGn1)

    const gn3 = new GroupNode('gn3', Matrix.identity())
    nodes.set(gn3.name, gn3)
    const sGn3 = new NodePlacement(gn3.name)
    sGn1.add(sGn3)

    const desktopCubeNode = new GroupNode('desktopCubeNode', Matrix.identity())
    nodes.set(desktopCubeNode.name, desktopCubeNode)
    const sDesktopCubeNode = new NodePlacement(desktopCubeNode.name)
    sGn0.add(sDesktopCubeNode)

    const gn4 = new GroupNode('gn4', Matrix.identity())
    nodes.set(gn4.name, gn4)
    const sGn4 = new NodePlacement(gn4.name)
    sGn0.add(sGn4)

    sDesktopCubeNode.add(sDesktopCube)
    sDesktopCubeNode.add(sWestSide)
    sDesktopCubeNode.add(sRotateSouth)
    sDesktopCubeNode.add(sRotateEast)
    sDesktopCubeNode.add(sRotateNorth)

    const lightSouth = new LightNode('lightSouth', new Vector(20, 0, 0, 1), 4)
    nodes.set(lightSouth.name, lightSouth)
    const sLightSouth = new NodePlacement(lightSouth.name)
    sGn0.add(sLightSouth)

    const lightNorth = new LightNode('lightNorth', new Vector(-20, 0, 0, 1), 4)
    nodes.set(lightNorth.name, lightNorth)
    const sLightNorth = new NodePlacement(lightNorth.name)
    sGn0.add(sLightNorth)

    const lightUp = new LightNode('lightUp', new Vector(0, 20, 0, 1), 4)
    nodes.set(lightUp.name, lightUp)
    const sLightUp = new NodePlacement(lightUp.name)

    const lightDown = new LightNode('lightDown', new Vector(0, -20, 0, 1), 4)
    nodes.set(lightDown.name, lightDown)
    const sLightDown = new NodePlacement(lightDown.name)

    const wanderingLight = new GroupNode('wanderingLight', Matrix.identity())
    nodes.set(wanderingLight.name, wanderingLight)
    const sWanderingLight = new NodePlacement(wanderingLight.name)
    sGn1.add(sWanderingLight)
    sWanderingLight.add(sLightUp)
    sWanderingLight.add(sLightDown)

    const lightWest = new LightNode('lightWest', new Vector(0, 0, 20, 1), 4)
    nodes.set(lightWest.name, lightWest)
    const sLightWest = new NodePlacement(lightWest.name)
    sGn0.add(sLightWest)

    const lightEast = new LightNode('lightEast', new Vector(0, 0, -20, 1), 4)
    nodes.set(lightEast.name, lightEast)
    const sLightEast = new NodePlacement(lightEast.name)
    sGn0.add(sLightEast)

    const lightCamera = new LightNode('lightCamera', new Vector(0, 0, 5, 1), 4)
    nodes.set(lightCamera.name, lightCamera)
    const sLightCamera = new NodePlacement(lightCamera.name)

    const lightDriver = new LightNode('lightDriver', new Vector(0, 0, 0, 1), 4)
    nodes.set(lightDriver.name, lightDriver)
    const sLightDriver = new NodePlacement(lightDriver.name)
    sDriver.add(sLightDriver)

    const cameraNode = new CameraNode('cameraNode', new Vector(0, 0, 15, 1), new Vector(0, 0, -1, 0), new Vector(0, 1, 0, 0), 60, 1, 0.1, 100)
    nodes.set(cameraNode.name, cameraNode)
    const sCameraNode = new NodePlacement(cameraNode.name)
    sCameraRotate.add(sCameraNode)
    sCameraRotate.add(sLightCamera)

    // Free Flight Forward
    let ffForward = new RelativeMovementAnimationNode('Free Flight Forward', cameraTranslate, 8.0, false, new Vector(0, 0, -1, 0), Matrix.translation, cameraRotate)
    animationNodes.set(ffForward.name, ffForward)
    // Free Flight Backwards
    let ffBackwards = new RelativeMovementAnimationNode('Free Flight Backwards', cameraTranslate, 8.0, false, new Vector(0, 0, 1, 0), Matrix.translation, cameraRotate)
    animationNodes.set(ffBackwards.name, ffBackwards)
    // Free Flight Left
    let ffLeft = new RelativeMovementAnimationNode('Free Flight Left', cameraTranslate, 8.0, false, new Vector(-1, 0, 0, 0), Matrix.translation, cameraRotate)
    animationNodes.set(ffLeft.name, ffLeft)
    // Free Flight Right
    let ffRight = new RelativeMovementAnimationNode('Free Flight Right', cameraTranslate, 8.0, false, new Vector(1, 0, 0, 0), Matrix.translation, cameraRotate)
    animationNodes.set(ffRight.name, ffRight)
    // Free Flight Ascend
    let ffAscend = new RelativeMovementAnimationNode('Free Flight Ascend', cameraTranslate, 8.0, false, new Vector(0, 1, 0, 0), Matrix.translation, cameraRotate)
    animationNodes.set(ffAscend.name, ffAscend)
    // Free Flight Descend
    let ffDescend = new RelativeMovementAnimationNode('Free Flight Descend', cameraTranslate, 8.0, false, new Vector(0, -1, 0, 0), Matrix.translation, cameraRotate)
    animationNodes.set(ffDescend.name, ffDescend)
    // Free Flight Turn Upwards
    let ffTurnUpwards = new AnimationNode('Free Flight Turn Upwards', cameraRotate, 1.0, false, new Vector(-1, 0, 0, 0), Matrix.rotation)
    animationNodes.set(ffTurnUpwards.name, ffTurnUpwards)
    // Free Flight Turn Downwards
    let ffTurnDownwards = new AnimationNode('Free Flight Turn Downwards', cameraRotate, 1.0, false, new Vector(1, 0, 0, 0), Matrix.rotation)
    animationNodes.set(ffTurnDownwards.name, ffTurnDownwards)
    // Free Flight Turn Left
    let ffTurnLeft = new AnimationNode('Free Flight Turn Left', cameraRotate, 1.0, false, new Vector(0, 1, 0, 0), Matrix.rotation)
    animationNodes.set(ffTurnLeft.name, ffTurnLeft)
    // Free Flight Turn Right
    let ffTurnRight = new AnimationNode('Free Flight Turn Right', cameraRotate, 1.0, false, new Vector(0, -1, 0, 0), Matrix.rotation)
    animationNodes.set(ffTurnRight.name, ffTurnRight)
    // Free Flight Left Roll?
    let ffLeftRoll = new AnimationNode('Free Flight Left Roll', cameraRotate, 1.0, false, new Vector(0, 0, 1, 0), Matrix.rotation)
    animationNodes.set(ffLeftRoll.name, ffLeftRoll)
    // Free Flight Right Roll?
    let ffRightRoll = new AnimationNode('Free Flight Right Roll', cameraRotate, 2.0, false, new Vector(0, 0, -1, 0), Matrix.rotation)
    animationNodes.set(ffRightRoll.name, ffRightRoll)
    let aGn2 = new RelativeMovementAnimationNode('desktopCubeNode', desktopCubeNode, 1.0, false, new Vector(0, 0.5, 0.5, 0), Matrix.rotation, cameraRotate)
    animationNodes.set(aGn2.name, aGn2)
    let aGn3 = new BackAndForthAnimationNode('gn3', gn3, 1.0, true, new Vector(0, 0, 1, 0), Matrix.translation, 3, 1.5)
    animationNodes.set(aGn3.name, aGn3)
    let aGn4 = new AnimationNode('gn4', gn4, 1.0, true, new Vector(1, 0, 0, 0), Matrix.rotation)
    animationNodes.set(aGn4.name, aGn4)
    let aJumper = new BackAndForthAnimationNode('jumper', jumper, 1.0, true, new Vector(0, 4, 0, 0), Matrix.translation, 1)
    animationNodes.set(aJumper.name, aJumper)
    let aDriver = new BackAndForthAnimationNode('driver', driver, 1.0, true, new Vector(2, 0, 4, 0), Matrix.translation, 3)
    animationNodes.set(aDriver.name, aDriver)
    let aRotator = new AnimationNode('rotator', rotator, 1.0, true, new Vector(0, 0.5, 0.5, 0), Matrix.rotation)
    animationNodes.set(aRotator.name, aRotator)
    let cLeft = new AnimationNode('Cube Left', desktopCubeNode, 1.0, false, new Vector(0, -1, 0, 0), Matrix.rotation)
    animationNodes.set(cLeft.name, cLeft)
    let cRight = new AnimationNode('Cube Right', desktopCubeNode, 1.0, false, new Vector(0, 1, 0, 0), Matrix.rotation)
    animationNodes.set(cRight.name, cRight)
    let cUp = new AnimationNode('Cube Up', desktopCubeNode, 1.0, false, new Vector(1, 0, 0, 0), Matrix.rotation)
    animationNodes.set(cUp.name, cUp)
    let cDown = new AnimationNode('Cube Down', desktopCubeNode, 1.0, false, new Vector(-1, 0, 0, 0), Matrix.rotation)
    animationNodes.set(cDown.name, cDown)
    let cClock = new AnimationNode('Cube Clock', desktopCubeNode, 1.0, false, new Vector(0, 0, -1, 0), Matrix.rotation)
    animationNodes.set(cClock.name, cClock)
    let cCounterclock = new AnimationNode('Cube Counterclock', desktopCubeNode, 1.0, false, new Vector(0, 0, 1, 0), Matrix.rotation)
    animationNodes.set(cCounterclock.name, cCounterclock)
    let wanderingSun = new BackAndForthAnimationNode('wanderingSun', wanderingLight, 0.3, true, new Vector(0, 0, 10, 1), Matrix.translation, 3, 0)
    animationNodes.set(wanderingSun.name, wanderingSun)

    let keybinds = new Map()
    // Free Flight Forward
    let keyW = new PushKeybind(animationNodes.get('Free Flight Forward'), 'KeyW')
    keybinds.set(keyW.name, keyW)
    // Free Flight Backward
    let KeyS = new PushKeybind(animationNodes.get('Free Flight Backwards'), 'KeyS')
    keybinds.set(KeyS.name, KeyS)
    // Free Flight Left
    let KeyA = new PushKeybind(animationNodes.get('Free Flight Left'), 'KeyA')
    keybinds.set(KeyA.name, KeyA)
    // Free Flight Right
    let KeyD = new PushKeybind(animationNodes.get('Free Flight Right'), 'KeyD')
    keybinds.set(KeyD.name, KeyD)
    // Free Flight Ascend
    let Space = new PushKeybind(animationNodes.get('Free Flight Ascend'), 'Space')
    keybinds.set(Space.name, Space)
    // Free Flight Descend
    let ShiftLeft = new PushKeybind(animationNodes.get('Free Flight Descend'), 'ShiftLeft')
    keybinds.set(ShiftLeft.name, ShiftLeft)
    // Free Flight Turn Upwards
    let ArrowUp = new PushKeybind(animationNodes.get('Free Flight Turn Upwards'), 'ArrowUp')
    keybinds.set(ArrowUp.name, ArrowUp)
    // Free Flight Turn Downwards
    let ArrowDown = new PushKeybind(animationNodes.get('Free Flight Turn Downwards'), 'ArrowDown')
    keybinds.set(ArrowDown.name, ArrowDown)
    // Free Flight Turn Left
    let ArrowLeft = new PushKeybind(animationNodes.get('Free Flight Turn Left'), 'ArrowLeft')
    keybinds.set(ArrowLeft.name, ArrowLeft)
    // Free Flight Turn Right
    let ArrowRight = new PushKeybind(animationNodes.get('Free Flight Turn Right'), 'ArrowRight')
    keybinds.set(ArrowRight.name, ArrowRight)
    // Free Flight Left Roll
    let KeyQ = new PushKeybind(animationNodes.get('Free Flight Left Roll'), 'KeyQ')
    keybinds.set(KeyQ.name, KeyQ)
    // Free Flight Right Roll
    let KeyE = new PushKeybind(animationNodes.get('Free Flight Right Roll'), 'KeyE')
    keybinds.set(KeyE.name, KeyE)
    // Toggle Animation 1
    let KeyB = new ToggleKeybind(animationNodes.get('jumper'), 'KeyB')
    keybinds.set(KeyB.name, KeyB)
    // Toggle Animation 2
    let KeyN = new ToggleKeybind(animationNodes.get('driver'), 'KeyN')
    keybinds.set(KeyN.name, KeyN)
    // Toggle Animation 3
    let KeyM = new ToggleKeybind(animationNodes.get('rotator'), 'KeyM')
    keybinds.set(KeyM.name, KeyM)
    // Cube Up
    let KeyI = new PushKeybind(animationNodes.get('Cube Up'), 'KeyI')
    keybinds.set(KeyI.name, KeyI)
    // Cube Down
    let KeyK = new PushKeybind(animationNodes.get('Cube Down'), 'KeyK')
    keybinds.set(KeyK.name, KeyK)
    // Cube Left
    let KeyJ = new PushKeybind(animationNodes.get('Cube Left'), 'KeyJ')
    keybinds.set(KeyJ.name, KeyJ)
    // Cube Right
    let KeyL = new PushKeybind(animationNodes.get('Cube Right'), 'KeyL')
    keybinds.set(KeyL.name, KeyL)
    // Cube Clockwise Rotation
    let KeyO = new PushKeybind(animationNodes.get('Cube Clock'), 'KeyO')
    keybinds.set(KeyO.name, KeyO)
    // Cube Counterclockwise Rotation
    let KeyU = new PushKeybind(animationNodes.get('Cube Counterclock'), 'KeyU')
    keybinds.set(KeyU.name, KeyU)

    this.settingsObj.nodes = nodes
    this.settingsObj.animationNodes = animationNodes
    this.settingsObj.scenegraphStructure = [sGn0]
    this.settingsObj.keybinds = keybinds
  }

  /**
   * Appends a representation of the settings to the URL search parameters, to be loaded on refresh or as a bookmark
   */
  setURL () {
    let newParams = new URLSearchParams()
    for (let settingKey in this.settingsStr) {
      if (this.settingsStr.hasOwnProperty(settingKey)) {
        newParams.set(settingKey, this.settingsStr[settingKey])
      }
    }
    history.replaceState({}, '', 'index.html?' + newParams.toString())
  }

  /**
   * Applies the given new settings without setting the URL parameters
   * @param {Object} newSettings - New settings to be applied in string form
   */
  setSettings (newSettings) {
    for (let settingKey in newSettings) {
      if (newSettings.hasOwnProperty(settingKey)) {
        switch (settingKey) {
          case 'renderer':
            let newRenderer = newSettings.renderer
            // console.log(this, newRenderer)
            if (renderers.includes(newSettings.renderer)) {
              this.settingsStr.renderer = newRenderer
              this.settingsObj.renderer = renderersToClasses[newRenderer]
            }
            // console.log(this, newRenderer)
            break
          case 'renderResolution':
            let newRes = parseInt(newSettings.renderResolution)
            // console.log(this, newRes)
            if (newRes > 0) {
              this.settingsStr.renderResolution = newRes.toString()
              this.settingsObj.renderResolution = newRes
            }
            // console.log(this, newRes)
            break
          case 'backgroundColor':
            let newColor = parseInt(newSettings.backgroundColor, 16)
            if (newColor > -1) {
              newColor = newColor.toString(16)
              while (newColor.length < 6) {
                newColor = '0' + newColor
              }
              this.settingsStr.backgroundColor = newColor
              this.settingsObj.backgroundColor = newColor
            }
            break
          case 'scenegraph':
            let newSG = JsonDeserializer.fromJson(JSON.parse(newSettings.scenegraph))
            this.settingsObj.nodes = newSG.nodes
            this.settingsObj.animationNodes = newSG.animationNodes
            this.settingsObj.scenegraphStructure = newSG.scenegraphStructure
            this.settingsObj.keybinds = newSG.keybinds
        }
      }
    }
  }

  /**
   * Applies the given new settings, setting the URL parameters
   * @param {Object} newSettings - New settings to be applied in string form
   */
  set settings (newSettings) {
    this.setSettings(newSettings)
    this.setURL()
  }

  get settings () {
    return this.settingsObj
  }
}
