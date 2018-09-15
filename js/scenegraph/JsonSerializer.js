import { NodePlacement, GroupNode, SphereNode, AABoxNode, PyramidNode, CameraNode, LightNode } from './nodes.js'
import {
  AnimationNode,
  BackAndForthAnimationNode,
  RelativeMovementAnimationNode
} from '../animation/animation-nodes.js'

export class JsonSerializer {
  static serialize (scenegraph, nodes, animationNodes) {
    let serializer = new JsonSerializer()
    serializer.scenegraph = scenegraph
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
    deserializer.scenegraph = NodePlacement.fromJson(json.scenegraph, deserializer.nodes)
    deserializer.animationNodes = []
    json.animationNodes.forEach(node => deserializer.animationNodes.push(getAnimationNodeType(node, deserializer.scenegraph)))
    return deserializer
  }
}

function getAnimationNodeType (node, sg) {
  switch (node.type) {
    case 'AnimationNode':
      return AnimationNode.fromJson(node, sg)
    case 'BackAndForthAnimationNode':
      return BackAndForthAnimationNode.fromJson(node, sg)
    case 'RelativeMovementAnimationNode':
      return RelativeMovementAnimationNode.fromJson(node, sg)
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
