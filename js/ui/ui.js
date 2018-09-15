/* global $, window, FileReader, Blob */

import { Settings } from './settings.js'
import {
  AABoxNode,
  CameraNode,
  GroupNode,
  LightNode,
  PyramidNode,
  SphereNode
} from '../scenegraph/nodes.js'

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
 * @param  scenegraphStructure     - Reference to the scene graph
 * @param  nodes          - Array of all nodes from the scenegraph
 * @param  animationNodes - Reference to the animation nodes
 * @param  keybinds       - Array of all keybinds for navigation
 */
export function saveScenegraphToJson (scenegraphStructure, nodes, animationNodes, keybinds) {
  let scenegraphStructureString = '{ "scenegraphStructure": ' + JSON.stringify(scenegraphStructure.children, ['name', 'children'], 2)

  nodes = Array.from(nodes.entries())
  let nodesArray = []
  nodes.forEach(array => nodesArray.push(array[1]))
  let nodesString = ', "nodes": ' + JSON.stringify(nodesArray, replacer, 2)

  animationNodes = Array.from(animationNodes.entries())
  let animationNodesArray = []
  animationNodes.forEach(array => animationNodesArray.push(array[1]))
  let animationNodesString = ', "animationNodes":' + JSON.stringify(animationNodesArray, null, 2)

  keybinds = Array.from(keybinds.entries())
  let keybindsArray = []
  keybinds.forEach(array => keybindsArray.push(array[1]))
  let keybindsString = ', "keybinds": ' + JSON.stringify(keybindsArray, null, 2) + '}'

  let url = URL.createObjectURL(new Blob([scenegraphStructureString + nodesString + animationNodesString + keybindsString], {type: 'application/json'}))
  let pom = document.createElement('a')
  document.body.appendChild(pom) // required in FF, optional for Chrome
  pom.href = url
  pom.download = 'scenegraph.json'
  pom.target = '_self' // required in FF, optional for Chrome
  pom.click()
}

/**
 * replacer/filter for stringify function
 * @param key
 * @param value
 * @return {*}
 */
function replacer (key, value) {
  if (key === 'children') {
    return undefined
  } else {
    return value
  }
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

export function changeInputElementValues (val) {
  if (val === 'raster') {
    $('#raster').addClass('active')
    $('#ray').removeClass('active')
  } else {
    $('#ray').addClass('active')
    $('#raster').removeClass('active')
  }
}

export function updateActive (selected) {
  if (selected !== settings.settingsObj.selected) {
    settings.settingsObj.selected = selected
    let node = settings.settingsObj.nodes.get(selected)
    if (node.hasOwnProperty('materials')) {
      $('#ambient').change(function (e) {
        let newVal = parseInt($(e.target).val())
        if (!Number.isNaN(newVal)) {
          settings.settingsObj.nodes.get(selected).materials.x = newVal
          console.log(settings.settingsObj.nodes.get(selected))
        }
      })
      $('#diffuse').change(function (e) {
        let newVal = parseInt($(e.target).val())
        if (!Number.isNaN(newVal)) {
          settings.settingsObj.nodes.get(selected).materials.y = newVal
        }
      })
      $('#specular').change(function (e) {
        let newVal = parseInt($(e.target).val())
        if (!Number.isNaN(newVal)) {
          settings.settingsObj.nodes.get(selected).materials.z = newVal
        }
      })
      $('#shininess').change(function (e) {
        let newVal = parseInt($(e.target).val())
        if (!Number.isNaN(newVal)) {
          settings.settingsObj.nodes.get(selected).materials.w = newVal
        }
      })
    }
  }
}

/**
 * Sets the scene graph sortable on the site to the current structure of the scene graph
 */
export function setScenegraphStructure () {
  function makeItem (item) {
    let itemEl = $('<li />', {class: 'list-group-item list-group-item-action'})
    itemEl.attr('data-name', item.name)
    itemEl.text(item.name)
    let icon = $('<i />', {class: 'pr-2'})
    let node = settings.settingsObj.nodes.get(item.name)
    let iconClass
    if (node instanceof GroupNode) {
      iconClass = 'fas fa-shapes'
    } else if (node instanceof SphereNode) {
      iconClass = 'fas fa-circle'
    } else if (node instanceof AABoxNode) {
      iconClass = 'fas fa-square'
    } else if (node instanceof PyramidNode) {
      iconClass = 'fas fa-triangle'
    } else if (node instanceof LightNode) {
      iconClass = 'fas fa-lightbulb'
    } else if (node instanceof CameraNode) {
      iconClass = 'fas fa-video'
    }
    icon.addClass(iconClass)
    icon.prependTo(itemEl)
    if (item.hasOwnProperty('children')) {
      let children = $('<ul />', {class: 'sortable list-group list-group-compact'})
      for (let child of item.children) {
        makeItem(child).appendTo(children)
      }
      children.appendTo(itemEl)
    }
    itemEl.click(function (event) {
      updateActive($(event.target).attr('data-name'))
    })
    return itemEl
  }
  let sceneGraphRoot = $('ul.scene-graph-root')
  sceneGraphRoot.empty()
  for (let item of settings.settingsObj.scenegraphStructure) {
    makeItem(item).appendTo(sceneGraphRoot)
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
 * Sets up the sortable draggable nestable list that represents the scene graph
 * @param {Settings} settingsObj - Settings object, has a child object "settingsObj" which holds the real settings
 */
function setupSceneGraphSortable (settingsObj) {
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
      let sgStructure = sceneGraphList.sortable('serialize').get()
      console.log(sgStructure)
      settingsObj.settingsObj.scenegraphStructure = sgStructure
      _super($item, container)
    },
    serialize: function ($parent, $children, parentIsContainer) {
      var result = $.extend({}, $parent.data())
      if (parentIsContainer) {
        return $children
      } else if ($children[0]) {
        result.children = $children
      }
      delete result.subContainers
      delete result.sortable
      return result
    }
  })
}

/**
 * Sets up the radio buttons to set the settings object when changed
 * @param {Array.string} radiobuttons - Array of names of radio buttons
 * @param {Settings} settingsObj      - Settings object, has a child object "settings" which holds the real settings
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
 * @param {Settings} settingsObj    - Settings object, has a child object "settings" which holds the real settings
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
 * @param {Settings} settingsObj       - Settings object, has a child object "settings" which holds the real settings
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
    saveScenegraphToJson(settings.settings.scenegraphStructure, settings.settings.nodes, settings.settings.animationNodes, settings.settings.keybinds)
  })
}

$(document).ready(function () {
  setFromURL()
  setInputElementValues()
  setScenegraphStructure()
  setupSidebars()
  setupColorpickers()
  setupSceneGraphSortable(settings)
  setupRadiobuttons(radiobuttons, settings)
  setupTextfields(textfields, settings)
  setupFileselectors(fileselectors, settings)
  setupDownloadButton()
})
