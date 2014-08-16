var getGlobal, proj, should, _;

getGlobal = function() {
  if (isNode) {
    return global;
  } else {
    return window;
  }
};

if (isNode) {
  proj = require('./index');
  should = require('should');
  _ = require('./src/lodash_extensions');
} else {
  proj = getGlobal()['browserfy-shim'].Dependency;
  should = getGlobal().Should;
  _ = getGlobal()._;
}

describe('sanity', function() {
  it('should.js exist', function() {
    if (!should) {
      throw new Error();
    }
  });
  it('lodash exists', function() {
    if (!_) {
      throw new Error('lodash or underscore undefined');
    }
  });
  return it('browserify-shim-dependency is loaded', function() {
    if (!proj) {
      throw new Error();
    }
  });
});
