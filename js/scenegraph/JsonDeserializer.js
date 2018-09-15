import { NodePlacement, GroupNode, SphereNode, AABoxNode, PyramidNode, CameraNode, LightNode } from './nodes.js'
import {
  AnimationNode,
  BackAndForthAnimationNode,
  RelativeMovementAnimationNode
} from '../animation/animation-nodes.js'
import { PushKeybind, ToggleKeybind } from '../ui/keybinds.js'

export class JsonDeserializer {
  static fromJson (json) {
    let deserializer = new JsonDeserializer()
    deserializer.nodes = new Map()
    json.nodes.forEach(node => deserializer.nodes.set(node.name, getNodeType(node)))
    deserializer.scenegraphStructure = []
    json.scenegraphStructure.forEach(child => deserializer.scenegraphStructure.push(NodePlacement.fromJson(child, deserializer.nodes)))
    deserializer.animationNodes = new Map()
    json.animationNodes.forEach(node => deserializer.animationNodes.set(node.name, getNodeType(node, deserializer.nodes)))
    deserializer.keybinds = new Map()
    json.keybinds.forEach(keybind => deserializer.keybinds.set(keybind.name, getNodeType(keybind, deserializer.animationNodes)))
    return deserializer
  }
}

function getNodeType (node, nodeCollection) {
  switch (node.type) {
    case 'GroupNode':
      return GroupNode.fromJson(node)
    case 'SphereNode':
      return SphereNode.fromJson(node)
    case 'AABoxNode':
      return AABoxNode.fromJson(node)
    case 'PyramidNode':
      return PyramidNode.fromJson(node)
    case 'CameraNode':
      return CameraNode.fromJson(node)
    case 'LightNode':
      return LightNode.fromJson(node)
    case 'AnimationNode':
      return AnimationNode.fromJson(node, nodeCollection)
    case 'BackAndForthAnimationNode':
      return BackAndForthAnimationNode.fromJson(node, nodeCollection)
    case 'RelativeMovementAnimationNode':
      return RelativeMovementAnimationNode.fromJson(node, nodeCollection)
    case 'ToggleKeybind':
      return ToggleKeybind.fromJson(node, nodeCollection)
    case 'PushKeybind':
      return PushKeybind.fromJson(node, nodeCollection)
  }
}
