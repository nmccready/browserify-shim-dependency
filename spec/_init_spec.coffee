getGlobal = ->
  if isNode then global else window

if isNode
  proj = require './index'
  should = require 'should'
  _ = require './src/lodash_extensions'
else
  proj = getGlobal()['browserfy-shim'].Dependency
  should = getGlobal().Should
  _ = getGlobal()._

#deps be loaded by the browser or by node
describe 'sanity', ->
  it 'should.js exist', ->
    throw new Error() unless should

  it 'lodash exists', ->
    throw new Error 'lodash or underscore undefined' unless _

  it 'browserify-shim-dependency is loaded', ->
    throw new Error() if not proj
