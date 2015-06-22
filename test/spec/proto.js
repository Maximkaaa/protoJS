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

    describe('setting plain value properties', function() {

        var Class, props;
        beforeEach(function() {
            Class = function() {};
            props = {
                number: 1,
                text: 'abc',
                null: null
            };
            proto(Class, props);
        });

        it('should set the properties, specified as plain values', function() {
            var obj = new Class();

            expect(obj.number).toBe(props.number);
            expect(obj.text).toBe(props.text);
            expect(obj.null).toBe(props.null);
        });

        it('should make the properties enumerable by default', function() {
            var obj = new Class();

            for (var i in obj) {
                expect(obj[i]).toBe(props[i]);
            }
        });

        it('should make the properties writable', function() {
            var obj = new Class();
            obj.number = 2;
            var obj1 = new Class();
            expect(obj1.number).toBe(1);
            expect(obj.number).toBe(2);
        });

    });
});