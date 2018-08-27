/* global $, window */

import { Settings } from './settings.js'

export let settings = new Settings()
const radiobuttons = ['renderer', 'renderResolution']
const textfields = ['backgroundColor']
const validSettings = radiobuttons.concat(textfields) // todo scenegraph and animation-nodes from url

/**
 * Reads the URL and sets valid given search parameters in the settings object
 */
function setFromURL () {
  let urlSearchParams = (new URL(document.location)).searchParams
  let newSettings = {}
  for (let name of validSettings) {
    if (urlSearchParams.has(name)) {
      newSettings[name] = urlSearchParams.get(name)
    }
  }
  settings.settings = newSettings
}

/**
 * Sets the input elements on the site to their current values
 */
function setInputElementValues () {
  for (let radiobutton of radiobuttons) {
    let radioelement = $('input[name=' + radiobutton + '][value=' + settings.settingsStr[radiobutton] + ']')
    radioelement.prop('checked', true)
    radioelement.parent().addClass('active')
  }
  for (let textfield of textfields) {
    $('#' + textfield).prop('value', settings.settingsStr[textfield])
  }
}

/**
 * Sets up the sidebar toggles to hide and show the sidebars
 */
function setupSidebars () {
  $('#collapse-left').on('click', function () {
    $('#sidebar-left').toggleClass('active')
  })
  $('#collapse-right').on('click', function () {
    $('#sidebar-right').toggleClass('active')
  })
}

/**
 * Sets up the sortable draggable nestable list that represents the scene graph
 */
function setupSceneGraphSortable () {
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
}

/**
 * Sets up the color pickers attached to text boxes
 */
function setupColorpickers () {
  const defaultSettings = {
    autoInputFallback: false,
    fallbackColor: '000000',
    format: 'hex',
    useHashPrefix: false
  }
  $('#backgroundColorPicker').colorpicker(Object.assign({useAlpha: false}, defaultSettings))
  // $('.colorpicker').colorpicker()
}

/**
 * Sets up the radio buttons to set the settings object when changed
 * @param {Array.string} radiobuttons - Array of names of radio buttons
 * @param {Object} settingsObj        - Settings object, has a child object "settings" which holds the real settings
 */
function setupRadiobuttons (radiobuttons, settingsObj) {
  for (let radiobutton of radiobuttons) {
    $('input[name=' + radiobutton + ']').change(function () {
      let newSettings = {}
      newSettings[this.name] = this.value
      settingsObj.settings = newSettings
    })
  }
}

/**
 * Sets up the text fields to set the settings object when changed
 * @param {Array.string} textfields - Array of names of text fields
 * @param {Object} settingsObj        - Settings object, has a child object "settings" which holds the real settings
 */
function setupTextfields (textfields, settingsObj) {
  for (let textfield of textfields) {
    $('#' + textfield).change(function () {
      let newSettings = {}
      newSettings[this.id] = this.value
      settingsObj.settings = newSettings
    })
  }
}

$(document).ready(function () {
  setFromURL()
  setInputElementValues()
  setupSidebars()
  setupSceneGraphSortable()
  setupColorpickers()
  setupRadiobuttons(radiobuttons, settings)
  setupTextfields(textfields, settings)
})
