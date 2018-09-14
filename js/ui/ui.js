/* global $, window, FileReader, Blob */

import { Settings } from './settings.js'
import { JsonSerializer } from '../scenegraph/JsonSerializer.js'

export let settings = new Settings()
const radiobuttons = ['renderer', 'renderResolution']
const textfields = ['backgroundColor']
const fileselectors = ['scenegraph']
const validSettings = radiobuttons.concat(textfields)

/**
 * Helper function to wrap FileReader into Promise
 * @param  {File} inputFile - File to be read into text
 * @return {Promise<String>}  Resolves to the text inside
 */
function readUploadedFileAsText (inputFile) {
  const temporaryFileReader = new FileReader()

  return new Promise((resolve, reject) => {
    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result)
    }
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort()
      reject(temporaryFileReader.error)
    }
    temporaryFileReader.readAsText(inputFile)
  })
}

/**
 * Helper function to download the scene graph as a JSON file
 * @param  scenegraph     - Reference to the scene graph
 * @param  animationNodes - Reference to the animation nodes
 */
export function saveScenegraphToJson (scenegraph, animationNodes) {
  scenegraph = addID(scenegraph)
  id = 0
  let json = JSON.stringify(JsonSerializer.serialize(scenegraph, animationNodes), null, 2)
  let url = URL.createObjectURL(new Blob([json], {type: 'application/json'}))
  let pom = document.createElement('a')
  document.body.appendChild(pom) // required in FF, optional for Chrome
  pom.href = url
  pom.download = 'scenegraph.json'
  pom.target = '_self' // required in FF, optional for Chrome
  pom.click()
}

let id = 0

/**
 * adds an unique id to everyone of the scenegraph
 * @param node      - current node in scenegraph
 * @return {<Node>} - current node in scenegraph
 */
function addID (node) {
  node.id = id
  if (Array.isArray(node.children)) {
    node.children.forEach(child => {
      id++
      addID(child)
    })
  }
  return node
}

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
export function setInputElementValues () {
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
 * @param {Object} settingsObj      - Settings object, has a child object "settings" which holds the real settings
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

/**
 * Sets up the file selectors to set the settings object when changed
 * @param {Array.string} fileselectors - Array of names of file selectors
 * @param {Object} settingsObj         - Settings object, has a child object "settings" which holds the real settings
 */
function setupFileselectors (fileselectors, settingsObj) {
  for (let fileselector of fileselectors) {
    $('#' + fileselector).change(async (event) => {
      const fileContents = await readUploadedFileAsText(event.target.files[0])
      let newSettings = {}
      newSettings[fileselector] = fileContents
      settingsObj.settings = newSettings
    })
  }
}

function setupDownloadButton () {
  $('#saveScenegraph').click(function () {
    saveScenegraphToJson(settings.settings.scenegraph, settings.settings.animationNodes)
  })
}

$(document).ready(function () {
  setFromURL()
  setInputElementValues()
  setupSidebars()
  setupSceneGraphSortable()
  setupColorpickers()
  setupRadiobuttons(radiobuttons, settings)
  setupTextfields(textfields, settings)
  setupFileselectors(fileselectors, settings)
  setupDownloadButton()
})
