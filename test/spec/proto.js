describe('protoJS', function () {
    describe('inheritance', function() {
        it ('should inherit from Object by default', function() {
            var Class = proto({});
            var obj = new Class();

            expect(obj instanceof Object).toBe(true);
            expect(obj instanceof Class).toBe(true);
        });

        it('should inherit from the _proto Class if specified', function() {
            var Class = proto({});
            var SubClass = proto({_proto: Class});
            var obj = new SubClass();

            expect(obj instanceof Object).toBe(true);
            expect(obj instanceof Class).toBe(true);
            expect(obj instanceof SubClass).toBe(true);
        });
    });
});