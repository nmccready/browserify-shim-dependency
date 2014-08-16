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
