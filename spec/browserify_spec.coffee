describe 'browserfy extensions', ->
  describe 'dependency', ->
    beforeEach ->
      dep = proj
      @subject = dep

    it 'exists', ->
      @subject.should.be.ok

    it 'creates location', ->
      test = 'loc'
      (new @subject test, 'val').location.should.be.eql test

    it 'creates exports', ->
      test = 'val'
      (new @subject undefined, test).exports.should.be.eql test

    it 'basic bfy', ->
      (new @subject('location', 'val')).bfy().should.be.eql(location: {exports: 'val'})

    describe 'dependsOn', ->
      beforeEach ->
        @obj = new @subject 'jquery.js', '$'
        @obj2 = new @subject 'angular.js', 'angular'
        @obj3 = new @subject 'boostrap.js', 'bootstrap'

        @deps = [@obj2, @obj3]

      describe 'single dep', ->
        it 'returns same object', ->
          @obj.dependsOn(@obj2).should.be.eql @obj

        it 'depends set correctly', ->
          @obj.dependsOn(@obj2).depends.should.be.eql @obj2.bfy()

        it 'final dependency obj', ->
          copy = _.clone @obj, true
          obj = copy.bfy()
          obj[@obj.location].depends = _.extend @obj2.bfy(), {}
          @obj.dependsOn(@obj2).bfy().should.be.eql obj


      describe 'multiple dep', ->

        it 'returns same object', ->
          @obj.dependsOn(@deps).should.be.eql @obj

        it 'depends set correctly, chained', ->
          @obj.dependsOn(@obj2).dependsOn(@obj3).depends.should.be.eql _.extends [@obj2.bfy(), @obj3.bfy()]

        it 'depends set correctly, array', ->
          @obj.dependsOn(@deps).depends.should.be.eql _.extends [@obj2.bfy(), @obj3.bfy()]

        it 'final dependency obj', ->
          copy = _.clone @obj, true
          obj = copy.bfy()
          obj[@obj.location].depends = _.extends [@obj2.bfy(), @obj3.bfy()]
          @obj.dependsOn(@deps).bfy().should.be.eql obj
#          console.log JSON.stringify(@obj.bfy())


      describe 'full blown example', ->
        it 'works from self', ->
          dep = @subject
          bower = '../../app/components/'
          $ = new dep "#{bower}jquery/dist/jquery.js", '$'
          bootstrap = new dep "#{bower}bootstrap/dist/bootstrap.js", 'bootstrap'
          angular = new dep("#{bower}angular/angular.js", 'angular').dependsOn $

          dependencies =  $.combine [bootstrap, angular]
          str = """
            {
              "#{$.location}" : {"exports" :  "#{$.exports}" },
              "#{bootstrap.location}" : {"exports" : "#{bootstrap.exports}" },
              "#{angular.location}" : {"exports" : "#{angular.exports}", "depends" : { "#{$.location}" : {"exports" : "#{$.exports}" }}}
            }
            """
          # console.log str
          dependencies.should.be.eql JSON.parse str

        it 'works from combiner/class', ->
          dep = @subject
          bower = '../../app/components/'
          $ = new dep "#{bower}jquery/dist/jquery.js", '$'
          bootstrap = new dep "#{bower}bootstrap/dist/bootstrap.js", 'bootstrap'
          angular = new dep("#{bower}angular/angular.js", 'angular').dependsOn $

          dependencies =  dep.combine [$,bootstrap, angular]
          str = """
            {
              "#{$.location}" : {"exports" :  "#{$.exports}" },
              "#{bootstrap.location}" : {"exports" : "#{bootstrap.exports}" },
              "#{angular.location}" : {"exports" : "#{angular.exports}", "depends" : { "#{$.location}" : {"exports" : "#{$.exports}" }}}
            }
            """
          # console.log str
          dependencies.should.be.eql JSON.parse str
