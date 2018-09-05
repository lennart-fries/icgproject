import { GroupNode } from './nodes.js'
import { AnimationNode, BackAndForthAnimationNode } from '../animation/animation-nodes.js'

export class JsonSerializer {
  static serialize (sg, animationNodes) {
    let serializer = new JsonSerializer()
    serializer.scenegraph = sg
    serializer.animationNodes = animationNodes
    return serializer
  }
}

export class JsonDeserializer {
  static fromJson (json) {
    let deserializer = new JsonDeserializer()
    deserializer.scenegraph = GroupNode.fromJson(json.scenegraph)
    deserializer.animationNodes = []
    json.animationNodes.forEach(node => deserializer.animationNodes.push(getAnimationNodeType(node)))
    return deserializer
  }
}

function getAnimationNodeType (node) {
  switch (node.type) {
    case 'AnimationNode':
      return AnimationNode.fromJson(node)
    case 'BackAndForthAnimationNode':
      return BackAndForthAnimationNode.fromJson(node)
  }
}
