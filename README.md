browserify-shim-dependency
===

[![Dependencies](https://david-dm.org/nmccready/browserify-shim-dependency.png)](https://david-dm.org/nmccready/browserify-shim-dependency)&nbsp;
[![Dependencies](https://david-dm.org/nmccready/browserify-shim-dependency.png)](https://david-dm.org/nmccready/browserify-shim-dependency)&nbsp;
[![Build Status](https://travis-ci.org/nmccready/browserify-shim-dependency.png?branch=master)](https://travis-ci.org/nmccready/browserify-shim-dependency)

###About:
Dependency initialization in browserfy-shim is very terse and repetitive. This library aim to help eliminate that.

In short a shim definition like
```
obj = JSON.parse('{
  "../../app/components/jquery/dist/jquery.js" : {"exports" :  "$" },
  "../../app/components/bootstrap/dist/bootstrap.js" : {"exports" : "bootstrap" },
  "../../app/components/angular/angular.js" : {"exports" : "angular", "depends" : { "../../app/components/jquery/dist/jquery.js" : {"exports" : "$" }}}
}')
```

becomes..
```
bower = '../../app/components/'
$ = new dep "#{bower}jquery/dist/jquery.js", '$'
bootstrap = new dep "#{bower}bootstrap/dist/bootstrap.js", 'bootstrap'
angular = new dep("#{bower}angular/angular.js", 'angular').dependsOn $

dependencies = $.combine [bootstrap, angular] #or dep.combine [$,bootstrap, angular]
```

where
```
dependencies == obj
```
