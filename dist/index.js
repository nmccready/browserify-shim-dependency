/**
 *  browserify-shim-dependency
 *
 * @version: 0.0.1
 * @author: Nicholas McCready
 * @date: Sat Aug 16 2014 12:22:09 GMT-0400 (EDT)
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

var BaseObject, Dependency, combiner, dep,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if (isNode) {
  BaseObject = require('ns2').BaseObject;
}

combiner = {
  combine: function(deps) {
    return _["extends"](deps.map(function(b) {
      return b.bfy();
    }));
  }
};

dep = Dependency = (function(_super) {
  var thisClass;

  __extends(Dependency, _super);

  Dependency.extend(combiner);

  thisClass = Dependency;

  function Dependency(location, exports) {
    this.location = location;
    this.exports = exports;
    this.combine = __bind(this.combine, this);
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

  Dependency.prototype.combine = function(deps) {
    return thisClass.combine(deps.concat([this]));
  };

  return Dependency;

})(BaseObject);

if (isNode) {
  module.exports = dep;
} else {
  getGlobal().namespace('browserfy-shim');
  getGlobal()['browserfy-shim'].Dependency = dep;
}
