/**
 *  browserify-shim-dependency
 *
 * @version: 0.0.1
 * @author: Nicholas McCready
 * @date: Sat Aug 16 2014 11:34:02 GMT-0400 (EDT)
 * @license: MIT
 */
var blockExport = true;

var isNode =
  !(typeof window !== "undefined" && window !== null);


var blockExport, getGlobal, isNode, _;

if (typeof isNode === "undefined" || isNode === null) {
  isNode = typeof window === "undefined" || window === null;
}

if (typeof blockExport === "undefined" || blockExport === null) {
  blockExport = false;
}

getGlobal = function() {
  if (isNode) {
    return global;
  } else {
    return window;
  }
};

if (isNode) {
  _ = require('lodash');
}

_["extends"] = function(arrayOfObjectsToCombine) {
  return _.reduce(arrayOfObjectsToCombine, function(combined, toAdd) {
    return _.extend(combined, toAdd);
  }, {});
};

if (isNode && !blockExport) {
  module.exports = _;
}

var Dependency, dep,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

dep = Dependency = (function() {
  function Dependency(location, exports) {
    this.location = location;
    this.exports = exports;
    this.bfy = __bind(this.bfy, this);
    this.dependsOn = __bind(this.dependsOn, this);
  }

  Dependency.prototype.dependsOn = function(deps) {
    if (!deps) {
      return this;
    }
    if (!_.isArray(deps)) {
      deps = [deps];
    }
    deps = deps.map(function(d) {
      if ((d.dependsOn != null) && (d.bfy != null)) {
        return d.bfy();
      }
      return d;
    });
    this.depends = this.depends == null ? _["extends"](deps) : _.extend(this.depends, _["extends"](deps));
    return this;
  };

  Dependency.prototype.bfy = function() {
    var obj;
    obj = {};
    obj["" + this.location] = {
      exports: this.exports
    };
    if (this.depends) {
      obj["" + this.location].depends = this.depends;
    }
    return obj;
  };

  return Dependency;

})();

if (isNode) {
  module.exports = dep;
} else {
  getGlobal().namespace('browserfy-shim');
  getGlobal()['browserfy-shim'].Dependency = dep;
}
