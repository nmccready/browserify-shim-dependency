_       = require 'lodash'
gulp    = require "gulp"
coffee  = require 'gulp-coffee'
concat  = require "gulp-concat"
rename  = require "gulp-rename"
log     = require("gulp-util").log
clean   = require "gulp-rimraf"
replace = require 'gulp-replace'
gulpif  = require "gulp-if"

jsToMin = (fileName) ->
  fileName.replace('.', '.min.')

#handle globals
String.prototype.toMin = ->
  jsToMin this

String.prototype.js = ->
  this + ".js"

String.prototype.css = ->
  this + ".css"

myClean = (fileORDirName, doMin) ->
  gulp.src(fileORDirName, read: false)
  .pipe do ->
    c = clean()
    log "cleaned #{fileORDirName}"
    c

module.exports =

  jsToMin: jsToMin

  myClean: myClean


#Only include files to prevent empty directories http://stackoverflow.com/questions/23719731/gulp-copying-empty-directories
  onlyDirs: (es) ->
    es.map (file, cb) ->
      if file?.stat?.isFile()
        cb(null, file)
      else
        cb()
        
  logEs : (es, toLog) ->
    es.map (file, cb) ->
      log toLog
      cb()

  logFile : (es) ->
    es.map (file, cb) ->
      log file.path
      cb()
  bang: "!!!!"
