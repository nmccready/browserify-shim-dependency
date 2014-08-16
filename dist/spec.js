/**
 *  browserify-shim-dependency
 *
 * @version: 0.0.1
 * @author: Nicholas McCready
 * @date: Sat Aug 16 2014 12:57:50 GMT-0400 (EDT)
 * @license: MIT
 */
var isNode =
  !(typeof window !== "undefined" && window !== null);


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

describe('browserfy extensions', function() {
  return describe('dependency', function() {
    beforeEach(function() {
      var dep;
      dep = proj;
      return this.subject = dep;
    });
    it('exists', function() {
      return this.subject.should.be.ok;
    });
    it('creates location', function() {
      var test;
      test = 'loc';
      return (new this.subject(test, 'val')).location.should.be.eql(test);
    });
    it('creates exports', function() {
      var test;
      test = 'val';
      return (new this.subject(void 0, test)).exports.should.be.eql(test);
    });
    it('basic bfy', function() {
      return (new this.subject('location', 'val')).bfy().should.be.eql({
        location: {
          exports: 'val'
        }
      });
    });
    return describe('dependsOn', function() {
      beforeEach(function() {
        this.obj = new this.subject('jquery.js', '$');
        this.obj2 = new this.subject('angular.js', 'angular');
        this.obj3 = new this.subject('boostrap.js', 'bootstrap');
        return this.deps = [this.obj2, this.obj3];
      });
      describe('single dep', function() {
        it('returns same object', function() {
          return this.obj.dependsOn(this.obj2).should.be.eql(this.obj);
        });
        it('depends set correctly', function() {
          return this.obj.dependsOn(this.obj2).depends.should.be.eql(this.obj2.bfy());
        });
        return it('final dependency obj', function() {
          var copy, obj;
          copy = _.clone(this.obj, true);
          obj = copy.bfy();
          obj[this.obj.location].depends = _.extend(this.obj2.bfy(), {});
          return this.obj.dependsOn(this.obj2).bfy().should.be.eql(obj);
        });
      });
      describe('multiple dep', function() {
        it('returns same object', function() {
          return this.obj.dependsOn(this.deps).should.be.eql(this.obj);
        });
        it('depends set correctly, chained', function() {
          return this.obj.dependsOn(this.obj2).dependsOn(this.obj3).depends.should.be.eql(_["extends"]([this.obj2.bfy(), this.obj3.bfy()]));
        });
        it('depends set correctly, array', function() {
          return this.obj.dependsOn(this.deps).depends.should.be.eql(_["extends"]([this.obj2.bfy(), this.obj3.bfy()]));
        });
        return it('final dependency obj', function() {
          var copy, obj;
          copy = _.clone(this.obj, true);
          obj = copy.bfy();
          obj[this.obj.location].depends = _["extends"]([this.obj2.bfy(), this.obj3.bfy()]);
          return this.obj.dependsOn(this.deps).bfy().should.be.eql(obj);
        });
      });
      return describe('full blown example', function() {
        it('works from self', function() {
          var $, angular, bootstrap, bower, dep, dependencies, str;
          dep = this.subject;
          bower = '../../app/components/';
          $ = new dep("" + bower + "jquery/dist/jquery.js", '$');
          bootstrap = new dep("" + bower + "bootstrap/dist/bootstrap.js", 'bootstrap');
          angular = new dep("" + bower + "angular/angular.js", 'angular').dependsOn($);
          dependencies = $.combine([bootstrap, angular]);
          str = "{\n  \"" + $.location + "\" : {\"exports\" :  \"" + $.exports + "\" },\n  \"" + bootstrap.location + "\" : {\"exports\" : \"" + bootstrap.exports + "\" },\n  \"" + angular.location + "\" : {\"exports\" : \"" + angular.exports + "\", \"depends\" : { \"" + $.location + "\" : {\"exports\" : \"" + $.exports + "\" }}}\n}";
          return dependencies.should.be.eql(JSON.parse(str));
        });
        return it('works from combiner/class', function() {
          var $, angular, bootstrap, bower, dep, dependencies, str;
          dep = this.subject;
          bower = '../../app/components/';
          $ = new dep("" + bower + "jquery/dist/jquery.js", '$');
          bootstrap = new dep("" + bower + "bootstrap/dist/bootstrap.js", 'bootstrap');
          angular = new dep("" + bower + "angular/angular.js", 'angular').dependsOn($);
          dependencies = dep.combine([$, bootstrap, angular]);
          str = "{\n  \"" + $.location + "\" : {\"exports\" :  \"" + $.exports + "\" },\n  \"" + bootstrap.location + "\" : {\"exports\" : \"" + bootstrap.exports + "\" },\n  \"" + angular.location + "\" : {\"exports\" : \"" + angular.exports + "\", \"depends\" : { \"" + $.location + "\" : {\"exports\" : \"" + $.exports + "\" }}}\n}";
          return dependencies.should.be.eql(JSON.parse(str));
        });
      });
    });
  });
});
