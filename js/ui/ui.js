/* global $, window */

import { Settings } from './settings.js'

export let settings = new Settings()
const radiobuttons = ['renderer', 'renderResolution']
const validSettings = radiobuttons.concat([]) // todo scenegraph and animation-nodes from url

function setFromURL () {
  let urlSearchParams = (new URL(document.location)).searchParams
  let newSettings = {}
  for (let name of validSettings) {
    if (urlSearchParams.has(name)) {
      newSettings[name] = urlSearchParams.get(name)
    }
  }
  settings.settings = newSettings
  for (let radiobutton of radiobuttons) {
    let radioelement = $('input[name=' + radiobutton + '][value=' + settings.settingsStr[radiobutton] + ']')
    radioelement.prop('checked', true)
    radioelement.parent().addClass('active')
  }
}

$(document).ready(function () {
  setFromURL()
  $('#collapse-left').on('click', function () {
    $('#sidebar-left').toggleClass('active')
  })
  $('#collapse-right').on('click', function () {
    $('#sidebar-right').toggleClass('active')
  })
  let oldContainer
  let sceneGraphList = $('ul.scene-graph-root').sortable({
    afterMove: function (placeholder, container) {
      if (oldContainer !== container) {
        if (oldContainer) { oldContainer.el.removeClass('active') }
        container.el.addClass('active')
        oldContainer = container
      }
    },
    onDrop: function ($item, container, _super) {
      container.el.removeClass('active')
      console.log(sceneGraphList.sortable('serialize').get())
      _super($item, container)
    }
  })
  for (let radiobutton of radiobuttons) {
    $('input[name=' + radiobutton + ']').change(function () {
      let newSettings = {}
      newSettings[this.name] = this.value
      settings.settings = newSettings
    })
  }
})
