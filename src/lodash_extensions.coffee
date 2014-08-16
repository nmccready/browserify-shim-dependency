unless isNode?
  isNode = !window?
unless blockExport?
  blockExport = false
  
getGlobal = ->
  if isNode then global else window

if isNode
  _ = require 'lodash'
_.extends = (arrayOfObjectsToCombine)->
  _.reduce arrayOfObjectsToCombine, (combined, toAdd)->
    _.extend(combined, toAdd)
  , {} #starting point empty object

module.exports = _ if isNode and !blockExport
