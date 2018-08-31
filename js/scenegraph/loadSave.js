/* global $, */

function loadScenegraph (event) {
  let file = $('#loadScenegraph')[0].children[0].files[0]
  let fr = new FileReader()
  fr.onload = function (e) {
    let result = JSON.parse(e.target.result)
    let origin = window.getScenegraph()
    window.setScenegraph(result)
  }
  fr.readAsText(file)
}

function saveScenegraphToJson () {
  let sg = window.getScenegraph()
  let sgJson = JSON.stringify(sg, null, 2)

  let sgDownload = document.createElement('sgDownload')
  sgDownload.href = 'data:attachment/text,' + encodeURI(sgJson)
  sgDownload.target = '_blank'
  sgDownload.download = 'scenegraph.json'
  sgDownload.click()
}
