/* global $ */

import { Raster } from './rendering/raster.js'
import { Ray } from './rendering/ray.js'

export let renderer = Raster
export let renderResolution = 1

const renderersToClasses = {'Raster': Raster, 'Ray': Ray}
const renderers = Object.keys(renderersToClasses)

$(document).ready(function () {
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
  $('input[name=renderer]').change(function () {
    let rendererName = $('input[name=renderer]:checked').val()
    if (renderers.includes(rendererName)) {
      renderer = renderersToClasses[rendererName]
    }
    // console.log('Switching to ' + rendererName)
  })
  $('input[name=render-resolution]').change(function () {
    renderResolution = parseInt($('input[name=render-resolution]:checked').val())
  })
})
