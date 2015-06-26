'use strict';

describe('setting plain value properties', function() {

    var Class, props;
    beforeEach(function() {
        Class = function() {};
        props = {
            number: 1,
            text: 'abc',
            null: null,
            obj: {},
            array: []
        };
        proto(Class, props);
    });

    it('should set the properties, specified as plain values', function() {
        var obj = new Class();

        expect(obj.number).toBe(props.number);
        expect(obj.text).toBe(props.text);
        expect(obj.null).toBe(props.null);
        expect(obj.obj).toBe(props.obj);
        expect(obj.array).toBe(props.array);
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