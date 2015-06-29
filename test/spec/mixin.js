describe('mixins', function() {

    describe('proto.mixin()', function() {

        var obj, mixin;
        beforeEach(function() {
            obj = {};
            mixin = proto({
                f: function() {},
                n: 1,
                t: 'a',
                g: {default: '2', set: null},
                s: {default: '3', set: function(v) { this._s = v * 2; }}
            });

            proto.mixin(obj, mixin);
        });

        it('should copy methods of the source to the target', function() {
            expect(obj.f).toBe(mixin.f);
        });

        it('should keep methods not enumerable, not writable', function() {
            var desc = Object.getOwnPropertyDescriptor(obj, 'f');
            expect(desc.enumerable).toBe(false);
            expect(desc.writable).toBe(false);
        });

        it('should copy the properties of the source to the target', function() {
            expect(obj.n).toBe(mixin.n);
            expect(obj.t).toBe(mixin.t);
        });

        it('should keep the properties enumerable, writable', function() {
            var desc = Object.getOwnPropertyDescriptor(obj, 'n');
            expect(desc.enumerable).toBe(true);
            expect(desc.writable).toBe(true);
        });

        it('should copy the getter/setter properties', function() {
            expect(obj.g).toBe(mixin.g);
            expect(obj.s).toBe(mixin.s);

            mixin.s = 10;
            expect(obj.s).not.toBe(mixin.s);
        });

        it('should keep the getter/setter properties enumerable, not writable', function() {
            var desc = Object.getOwnPropertyDescriptor(obj, 'g');
            expect(typeof desc.get).toBe('function');
            expect(desc.set).toBe(undefined);
            expect(desc.enumerable).toBe(true);
            expect(desc.writable).toBeFalsy();
        });

        //TODO: test for mixin of already existing properties
    });

    describe('mixin in proto function', function() {

        var Class, mixin;
        beforeEach(function() {
            Class = function() {};
            mixin = proto({
                f: function() {},
                n: 1,
                t: 'a',
                g: {default: '2', set: null},
                s: {default: '3', set: function(v) { this._s = v * 2; }}
            });
        });

        it('should mixin the second argument object to the prototype of the first argument if there are 3 arguments in proto function call', function() {
            proto(Class, mixin, {});
            expect(Class.prototype.n).toBe(1);
            expect(Class.prototype.f).toBe(mixin.f);
        });

        it('should mixin all the mixins in array', function() {
            var mixin2 = proto({
                n1: 2,
                f2: function() {}
            });

            proto(Class, [mixin, mixin2], {});
            expect(Class.prototype.n).toBe(1);
            expect(Class.prototype.f).toBe(mixin.f);
            expect(Class.prototype.n1).toBe(2);
            expect(Class.prototype.f2).toBe(mixin2.f2);
        });
    });

});