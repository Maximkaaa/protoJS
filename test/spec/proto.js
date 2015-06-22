describe('protoJS', function () {
    describe('inheritance', function() {

        var Class;
        beforeEach(function() {
            Class = function() {};
            proto(Class, {});
        });

        it ('should inherit from Object by default', function() {
            var obj = new Class();

            expect(obj instanceof Object).toBe(true);
            expect(obj instanceof Class).toBe(true);
        });

        it('should inherit from the _proto Class if specified', function() {
            var SubClass = function() {};
            proto(SubClass, {_proto: Class});
            var obj = new SubClass();

            expect(obj instanceof Object).toBe(true);
            expect(obj instanceof Class).toBe(true);
            expect(obj instanceof SubClass).toBe(true);
        });

        it('should inherit from the _proto object if specified', function() {
            var prototype = new Class();
            prototype.prop = 1;

            var SubClass = function() {};
            proto(SubClass, {_proto: prototype});
            var obj = new SubClass();

            expect(obj instanceof Class).toBe(true);
            expect(obj.prop).toBe(prototype.prop);
        });
    });
});