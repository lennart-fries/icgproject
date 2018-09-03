/* global $ */

import { GroupNode } from './nodes.js'

$('#blubb').click(saveScenegraphToJson)
$('#blib').click(loadScenegraph)

function loadScenegraph (event) {
  let file = $('#loadScenegraph')[0].children[0].files[0]
  let fr = new FileReader()
  fr.onload = function (e) {
    let result = GroupNode.fromJson(JSON.parse(e.target.result).GroupNode)
    window.setScenegraph(result)
  }
  fr.readAsText(file)
}

function saveScenegraphToJson () {
  let sgJson = JSON.stringify(window.getScenegraph(), null, 2)

  console.dir('end')
  let url = URL.createObjectURL(new Blob([sgJson], {type: 'text/plain'}))
  let sgDownload = document.createElement('a')
  sgDownload.href = url
  sgDownload.download = 'scenegraph.json'
  sgDownload.click()
}
