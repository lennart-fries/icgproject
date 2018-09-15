import { NodePlacement, GroupNode, SphereNode, AABoxNode, PyramidNode, CameraNode, LightNode } from './nodes.js'
import {
  AnimationNode,
  BackAndForthAnimationNode,
  RelativeMovementAnimationNode
} from '../animation/animation-nodes.js'

export class JsonSerializer {
  static serialize (scenegraphStructure, nodes, animationNodes) {
    let serializer = new JsonSerializer()
    serializer.scenegraphStructure = scenegraphStructure
    serializer.nodes = nodes
    serializer.animationNodes = animationNodes
    return serializer
  }
}

export class JsonDeserializer {
  static fromJson (json) {
    let deserializer = new JsonDeserializer()
    deserializer.nodes = new Map()
    json.nodes.forEach(node => deserializer.nodes.set(node.name, getNodeType(node)))
    deserializer.scenegraphStructure = NodePlacement.fromJson(json.scenegraphStructure, deserializer.nodes)
    deserializer.animationNodes = []
    json.animationNodes.forEach(node => deserializer.animationNodes.push(getAnimationNodeType(node, deserializer.nodes)))
    return deserializer
  }
}

function getAnimationNodeType (animationNode, nodes) {
  switch (animationNode.type) {
    case 'AnimationNode':
      return AnimationNode.fromJson(animationNode, nodes)
    case 'BackAndForthAnimationNode':
      return BackAndForthAnimationNode.fromJson(animationNode, nodes)
    case 'RelativeMovementAnimationNode':
      return RelativeMovementAnimationNode.fromJson(animationNode, nodes)
  }
}

function getNodeType (node) {
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
  }
}
