describe('protoJS', function () {
    describe('inheritance', function() {

        var Class;
        beforeEach(function() {
            Class = proto({});
        });

        it ('should inherit from Object by default', function() {
            var obj = new Class();

            expect(obj instanceof Object).toBe(true);
            expect(obj instanceof Class).toBe(true);
        });

        it('should inherit from the _proto Class if specified', function() {
            var SubClass = proto({_proto: Class});
            var obj = new SubClass();

            expect(obj instanceof Object).toBe(true);
            expect(obj instanceof Class).toBe(true);
            expect(obj instanceof SubClass).toBe(true);
        });

        it('should inherit from the _proto object if specified', function() {
            var prototype = new Class();
            prototype.prop = 1;
            var SubClass = proto({_proto: prototype});
            var obj = new SubClass();

            expect(obj instanceof Class).toBe(true);
            expect(obj.prop).toBe(prototype.prop);
        });

        it('should set inheritance chain correctly event without new statement', function() {
            var SubClass = proto({_proto: Class});
            var obj = SubClass();

            expect(obj instanceof Object).toBe(true);
            expect(obj instanceof Class).toBe(true);
            expect(obj instanceof SubClass).toBe(true);
        });
    });

    describe('constructor', function() {

        var Class;
        beforeEach(function() {
            Class = proto({
                _construct: function(prop) {
                    this.prop = prop;
                }
            });
        });

        it('should call the constructor function on instantiation', function() {
            var obj1 = new Class(1);
            var obj2 = new Class(2);

            expect(obj1.prop).toBe(1);
            expect(obj2.prop).toBe(2);
        });

        it('should call the constructor correctly even without new statement', function() {
            var obj1 = Class(1);
            var obj2 = Class(2);

            expect(obj1.prop).toBe(1);
            expect(obj2.prop).toBe(2);
        });
    });
});