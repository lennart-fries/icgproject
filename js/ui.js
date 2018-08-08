/* global $ */

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
})
