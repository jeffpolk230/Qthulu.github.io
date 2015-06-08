///<reference path="World.ts"/>
///<reference path="lib/node.d.ts"/>
var Parser;
(function (Parser) {
    //////////////////////////////////////////////////////////////////////
    // exported functions, classes and interfaces/types
    function parse(input) {
        var nearleyParser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
        var parsestr = input.toLowerCase().replace(/\W/g, "");
        try {
            var results = nearleyParser.feed(parsestr).results;
        }
        catch (err) {
            if ('offset' in err) {
                throw new Parser.Error('Parsing failed after ' + err.offset + ' characters', err.offset);
            }
            else {
                throw err;
            }
        }
        if (!results.length) {
            throw new Parser.Error('Incomplete input', parsestr.length);
        }
        return results.map(function (c) {
            return { input: input, prs: clone(c) };
        });
    }
    Parser.parse = parse;
    function objToString(obj) {
        var description = "";
        if (obj.size) {
            description = description + obj.size + " ";
        }
        if (obj.color) {
            description = description + obj.color + " ";
        }
        if (obj.form) {
            description = description + obj.form;
        }
        return description;
    }
    Parser.objToString = objToString;
    function parseToString(res) {
        return JSON.stringify(res.prs);
    }
    Parser.parseToString = parseToString;
    var Error = (function () {
        function Error(message, offset) {
            this.message = message;
            this.offset = offset;
            this.name = "Parser.Error";
        }
        Error.prototype.toString = function () {
            return this.name + ": " + this.message;
        };
        return Error;
    })();
    Parser.Error = Error;
    //////////////////////////////////////////////////////////////////////
    // Utilities
    function clone(obj) {
        if (obj != null && typeof obj == "object") {
            var result = obj.constructor();
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    result[key] = clone(obj[key]);
                }
            }
            return result;
        }
        else {
            return obj;
        }
    }
})(Parser || (Parser = {}));
if (typeof require !== 'undefined') {
    // Node.JS way of importing external modules
    // In a browser, they must be included from the HTML file
    var nearley = require('./lib/nearley.js');
    var grammar = require('./grammar.js');
}
///<reference path="Parser.ts"/>
// Copyright 2013 Basarat Ali Syed. All Rights Reserved.
//
// Licensed under MIT open source license http://opensource.org/licenses/MIT
//
// Orginal javascript code was by Mauricio Santos
/**
 * @namespace Top level namespace for collections, a TypeScript data structure library.
 */
var collections;
(function (collections) {
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var has = function (obj, prop) {
        return _hasOwnProperty.call(obj, prop);
    };
    /**
     * Default function to compare element order.
     * @function
     */
    function defaultCompare(a, b) {
        if (a < b) {
            return -1;
        }
        else if (a === b) {
            return 0;
        }
        else {
            return 1;
        }
    }
    collections.defaultCompare = defaultCompare;
    /**
     * Default function to test equality.
     * @function
     */
    function defaultEquals(a, b) {
        return a === b;
    }
    collections.defaultEquals = defaultEquals;
    /**
     * Default function to convert an object to a string.
     * @function
     */
    function defaultToString(item) {
        if (item === null) {
            return 'COLLECTION_NULL';
        }
        else if (collections.isUndefined(item)) {
            return 'COLLECTION_UNDEFINED';
        }
        else if (collections.isString(item)) {
            return '$s' + item;
        }
        else {
            return '$o' + item.toString();
        }
    }
    collections.defaultToString = defaultToString;
    /**
    * Joins all the properies of the object using the provided join string
    */
    function makeString(item, join) {
        if (join === void 0) { join = ","; }
        if (item === null) {
            return 'COLLECTION_NULL';
        }
        else if (collections.isUndefined(item)) {
            return 'COLLECTION_UNDEFINED';
        }
        else if (collections.isString(item)) {
            return item.toString();
        }
        else {
            var toret = "{";
            var first = true;
            for (var prop in item) {
                if (has(item, prop)) {
                    if (first)
                        first = false;
                    else
                        toret = toret + join;
                    toret = toret + prop + ":" + item[prop];
                }
            }
            return toret + "}";
        }
    }
    collections.makeString = makeString;
    /**
     * Checks if the given argument is a function.
     * @function
     */
    function isFunction(func) {
        return (typeof func) === 'function';
    }
    collections.isFunction = isFunction;
    /**
     * Checks if the given argument is undefined.
     * @function
     */
    function isUndefined(obj) {
        return (typeof obj) === 'undefined';
    }
    collections.isUndefined = isUndefined;
    /**
     * Checks if the given argument is a string.
     * @function
     */
    function isString(obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    }
    collections.isString = isString;
    /**
     * Reverses a compare function.
     * @function
     */
    function reverseCompareFunction(compareFunction) {
        if (!collections.isFunction(compareFunction)) {
            return function (a, b) {
                if (a < b) {
                    return 1;
                }
                else if (a === b) {
                    return 0;
                }
                else {
                    return -1;
                }
            };
        }
        else {
            return function (d, v) {
                return compareFunction(d, v) * -1;
            };
        }
    }
    collections.reverseCompareFunction = reverseCompareFunction;
    /**
     * Returns an equal function given a compare function.
     * @function
     */
    function compareToEquals(compareFunction) {
        return function (a, b) {
            return compareFunction(a, b) === 0;
        };
    }
    collections.compareToEquals = compareToEquals;
    /**
     * @namespace Contains various functions for manipulating arrays.
     */
    var arrays;
    (function (arrays) {
        /**
         * Returns the position of the first occurrence of the specified item
         * within the specified array.
         * @param {*} array the array in which to search the element.
         * @param {Object} item the element to search.
         * @param {function(Object,Object):boolean=} equalsFunction optional function used to
         * check equality between 2 elements.
         * @return {number} the position of the first occurrence of the specified element
         * within the specified array, or -1 if not found.
         */
        function indexOf(array, item, equalsFunction) {
            var equals = equalsFunction || collections.defaultEquals;
            var length = array.length;
            for (var i = 0; i < length; i++) {
                if (equals(array[i], item)) {
                    return i;
                }
            }
            return -1;
        }
        arrays.indexOf = indexOf;
        /**
         * Returns the position of the last occurrence of the specified element
         * within the specified array.
         * @param {*} array the array in which to search the element.
         * @param {Object} item the element to search.
         * @param {function(Object,Object):boolean=} equalsFunction optional function used to
         * check equality between 2 elements.
         * @return {number} the position of the last occurrence of the specified element
         * within the specified array or -1 if not found.
         */
        function lastIndexOf(array, item, equalsFunction) {
            var equals = equalsFunction || collections.defaultEquals;
            var length = array.length;
            for (var i = length - 1; i >= 0; i--) {
                if (equals(array[i], item)) {
                    return i;
                }
            }
            return -1;
        }
        arrays.lastIndexOf = lastIndexOf;
        /**
         * Returns true if the specified array contains the specified element.
         * @param {*} array the array in which to search the element.
         * @param {Object} item the element to search.
         * @param {function(Object,Object):boolean=} equalsFunction optional function to
         * check equality between 2 elements.
         * @return {boolean} true if the specified array contains the specified element.
         */
        function contains(array, item, equalsFunction) {
            return arrays.indexOf(array, item, equalsFunction) >= 0;
        }
        arrays.contains = contains;
        /**
         * Removes the first ocurrence of the specified element from the specified array.
         * @param {*} array the array in which to search element.
         * @param {Object} item the element to search.
         * @param {function(Object,Object):boolean=} equalsFunction optional function to
         * check equality between 2 elements.
         * @return {boolean} true if the array changed after this call.
         */
        function remove(array, item, equalsFunction) {
            var index = arrays.indexOf(array, item, equalsFunction);
            if (index < 0) {
                return false;
            }
            array.splice(index, 1);
            return true;
        }
        arrays.remove = remove;
        /**
         * Returns the number of elements in the specified array equal
         * to the specified object.
         * @param {Array} array the array in which to determine the frequency of the element.
         * @param {Object} item the element whose frequency is to be determined.
         * @param {function(Object,Object):boolean=} equalsFunction optional function used to
         * check equality between 2 elements.
         * @return {number} the number of elements in the specified array
         * equal to the specified object.
         */
        function frequency(array, item, equalsFunction) {
            var equals = equalsFunction || collections.defaultEquals;
            var length = array.length;
            var freq = 0;
            for (var i = 0; i < length; i++) {
                if (equals(array[i], item)) {
                    freq++;
                }
            }
            return freq;
        }
        arrays.frequency = frequency;
        /**
         * Returns true if the two specified arrays are equal to one another.
         * Two arrays are considered equal if both arrays contain the same number
         * of elements, and all corresponding pairs of elements in the two
         * arrays are equal and are in the same order.
         * @param {Array} array1 one array to be tested for equality.
         * @param {Array} array2 the other array to be tested for equality.
         * @param {function(Object,Object):boolean=} equalsFunction optional function used to
         * check equality between elemements in the arrays.
         * @return {boolean} true if the two arrays are equal
         */
        function equals(array1, array2, equalsFunction) {
            var equals = equalsFunction || collections.defaultEquals;
            if (array1.length !== array2.length) {
                return false;
            }
            var length = array1.length;
            for (var i = 0; i < length; i++) {
                if (!equals(array1[i], array2[i])) {
                    return false;
                }
            }
            return true;
        }
        arrays.equals = equals;
        /**
         * Returns shallow a copy of the specified array.
         * @param {*} array the array to copy.
         * @return {Array} a copy of the specified array
         */
        function copy(array) {
            return array.concat();
        }
        arrays.copy = copy;
        /**
         * Swaps the elements at the specified positions in the specified array.
         * @param {Array} array The array in which to swap elements.
         * @param {number} i the index of one element to be swapped.
         * @param {number} j the index of the other element to be swapped.
         * @return {boolean} true if the array is defined and the indexes are valid.
         */
        function swap(array, i, j) {
            if (i < 0 || i >= array.length || j < 0 || j >= array.length) {
                return false;
            }
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            return true;
        }
        arrays.swap = swap;
        function toString(array) {
            return '[' + array.toString() + ']';
        }
        arrays.toString = toString;
        /**
         * Executes the provided function once for each element present in this array
         * starting from index 0 to length - 1.
         * @param {Array} array The array in which to iterate.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        function forEach(array, callback) {
            var lenght = array.length;
            for (var i = 0; i < lenght; i++) {
                if (callback(array[i]) === false) {
                    return;
                }
            }
        }
        arrays.forEach = forEach;
    })(arrays = collections.arrays || (collections.arrays = {}));
    var LinkedList = (function () {
        /**
        * Creates an empty Linked List.
        * @class A linked list is a data structure consisting of a group of nodes
        * which together represent a sequence.
        * @constructor
        */
        function LinkedList() {
            /**
            * First node in the list
            * @type {Object}
            * @private
            */
            this.firstNode = null;
            /**
            * Last node in the list
            * @type {Object}
            * @private
            */
            this.lastNode = null;
            /**
            * Number of elements in the list
            * @type {number}
            * @private
            */
            this.nElements = 0;
        }
        /**
        * Adds an element to this list.
        * @param {Object} item element to be added.
        * @param {number=} index optional index to add the element. If no index is specified
        * the element is added to the end of this list.
        * @return {boolean} true if the element was added or false if the index is invalid
        * or if the element is undefined.
        */
        LinkedList.prototype.add = function (item, index) {
            if (collections.isUndefined(index)) {
                index = this.nElements;
            }
            if (index < 0 || index > this.nElements || collections.isUndefined(item)) {
                return false;
            }
            var newNode = this.createNode(item);
            if (this.nElements === 0) {
                // First node in the list.
                this.firstNode = newNode;
                this.lastNode = newNode;
            }
            else if (index === this.nElements) {
                // Insert at the end.
                this.lastNode.next = newNode;
                this.lastNode = newNode;
            }
            else if (index === 0) {
                // Change first node.
                newNode.next = this.firstNode;
                this.firstNode = newNode;
            }
            else {
                var prev = this.nodeAtIndex(index - 1);
                newNode.next = prev.next;
                prev.next = newNode;
            }
            this.nElements++;
            return true;
        };
        /**
        * Returns the first element in this list.
        * @return {*} the first element of the list or undefined if the list is
        * empty.
        */
        LinkedList.prototype.first = function () {
            if (this.firstNode !== null) {
                return this.firstNode.element;
            }
            return undefined;
        };
        /**
        * Returns the last element in this list.
        * @return {*} the last element in the list or undefined if the list is
        * empty.
        */
        LinkedList.prototype.last = function () {
            if (this.lastNode !== null) {
                return this.lastNode.element;
            }
            return undefined;
        };
        /**
         * Returns the element at the specified position in this list.
         * @param {number} index desired index.
         * @return {*} the element at the given index or undefined if the index is
         * out of bounds.
         */
        LinkedList.prototype.elementAtIndex = function (index) {
            var node = this.nodeAtIndex(index);
            if (node === null) {
                return undefined;
            }
            return node.element;
        };
        /**
         * Returns the index in this list of the first occurrence of the
         * specified element, or -1 if the List does not contain this element.
         * <p>If the elements inside this list are
         * not comparable with the === operator a custom equals function should be
         * provided to perform searches, the function must receive two arguments and
         * return true if they are equal, false otherwise. Example:</p>
         *
         * <pre>
         * var petsAreEqualByName = function(pet1, pet2) {
         *  return pet1.name === pet2.name;
         * }
         * </pre>
         * @param {Object} item element to search for.
         * @param {function(Object,Object):boolean=} equalsFunction Optional
         * function used to check if two elements are equal.
         * @return {number} the index in this list of the first occurrence
         * of the specified element, or -1 if this list does not contain the
         * element.
         */
        LinkedList.prototype.indexOf = function (item, equalsFunction) {
            var equalsF = equalsFunction || collections.defaultEquals;
            if (collections.isUndefined(item)) {
                return -1;
            }
            var currentNode = this.firstNode;
            var index = 0;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    return index;
                }
                index++;
                currentNode = currentNode.next;
            }
            return -1;
        };
        /**
           * Returns true if this list contains the specified element.
           * <p>If the elements inside the list are
           * not comparable with the === operator a custom equals function should be
           * provided to perform searches, the function must receive two arguments and
           * return true if they are equal, false otherwise. Example:</p>
           *
           * <pre>
           * var petsAreEqualByName = function(pet1, pet2) {
           *  return pet1.name === pet2.name;
           * }
           * </pre>
           * @param {Object} item element to search for.
           * @param {function(Object,Object):boolean=} equalsFunction Optional
           * function used to check if two elements are equal.
           * @return {boolean} true if this list contains the specified element, false
           * otherwise.
           */
        LinkedList.prototype.contains = function (item, equalsFunction) {
            return (this.indexOf(item, equalsFunction) >= 0);
        };
        /**
         * Removes the first occurrence of the specified element in this list.
         * <p>If the elements inside the list are
         * not comparable with the === operator a custom equals function should be
         * provided to perform searches, the function must receive two arguments and
         * return true if they are equal, false otherwise. Example:</p>
         *
         * <pre>
         * var petsAreEqualByName = function(pet1, pet2) {
         *  return pet1.name === pet2.name;
         * }
         * </pre>
         * @param {Object} item element to be removed from this list, if present.
         * @return {boolean} true if the list contained the specified element.
         */
        LinkedList.prototype.remove = function (item, equalsFunction) {
            var equalsF = equalsFunction || collections.defaultEquals;
            if (this.nElements < 1 || collections.isUndefined(item)) {
                return false;
            }
            var previous = null;
            var currentNode = this.firstNode;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    if (currentNode === this.firstNode) {
                        this.firstNode = this.firstNode.next;
                        if (currentNode === this.lastNode) {
                            this.lastNode = null;
                        }
                    }
                    else if (currentNode === this.lastNode) {
                        this.lastNode = previous;
                        previous.next = currentNode.next;
                        currentNode.next = null;
                    }
                    else {
                        previous.next = currentNode.next;
                        currentNode.next = null;
                    }
                    this.nElements--;
                    return true;
                }
                previous = currentNode;
                currentNode = currentNode.next;
            }
            return false;
        };
        /**
         * Removes all of the elements from this list.
         */
        LinkedList.prototype.clear = function () {
            this.firstNode = null;
            this.lastNode = null;
            this.nElements = 0;
        };
        /**
         * Returns true if this list is equal to the given list.
         * Two lists are equal if they have the same elements in the same order.
         * @param {LinkedList} other the other list.
         * @param {function(Object,Object):boolean=} equalsFunction optional
         * function used to check if two elements are equal. If the elements in the lists
         * are custom objects you should provide a function, otherwise
         * the === operator is used to check equality between elements.
         * @return {boolean} true if this list is equal to the given list.
         */
        LinkedList.prototype.equals = function (other, equalsFunction) {
            var eqF = equalsFunction || collections.defaultEquals;
            if (!(other instanceof collections.LinkedList)) {
                return false;
            }
            if (this.size() !== other.size()) {
                return false;
            }
            return this.equalsAux(this.firstNode, other.firstNode, eqF);
        };
        /**
        * @private
        */
        LinkedList.prototype.equalsAux = function (n1, n2, eqF) {
            while (n1 !== null) {
                if (!eqF(n1.element, n2.element)) {
                    return false;
                }
                n1 = n1.next;
                n2 = n2.next;
            }
            return true;
        };
        /**
         * Removes the element at the specified position in this list.
         * @param {number} index given index.
         * @return {*} removed element or undefined if the index is out of bounds.
         */
        LinkedList.prototype.removeElementAtIndex = function (index) {
            if (index < 0 || index >= this.nElements) {
                return undefined;
            }
            var element;
            if (this.nElements === 1) {
                //First node in the list.
                element = this.firstNode.element;
                this.firstNode = null;
                this.lastNode = null;
            }
            else {
                var previous = this.nodeAtIndex(index - 1);
                if (previous === null) {
                    element = this.firstNode.element;
                    this.firstNode = this.firstNode.next;
                }
                else if (previous.next === this.lastNode) {
                    element = this.lastNode.element;
                    this.lastNode = previous;
                }
                if (previous !== null) {
                    element = previous.next.element;
                    previous.next = previous.next.next;
                }
            }
            this.nElements--;
            return element;
        };
        /**
         * Executes the provided function once for each element present in this list in order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        LinkedList.prototype.forEach = function (callback) {
            var currentNode = this.firstNode;
            while (currentNode !== null) {
                if (callback(currentNode.element) === false) {
                    break;
                }
                currentNode = currentNode.next;
            }
        };
        /**
         * Reverses the order of the elements in this linked list (makes the last
         * element first, and the first element last).
         */
        LinkedList.prototype.reverse = function () {
            var previous = null;
            var current = this.firstNode;
            var temp = null;
            while (current !== null) {
                temp = current.next;
                current.next = previous;
                previous = current;
                current = temp;
            }
            temp = this.firstNode;
            this.firstNode = this.lastNode;
            this.lastNode = temp;
        };
        /**
         * Returns an array containing all of the elements in this list in proper
         * sequence.
         * @return {Array.<*>} an array containing all of the elements in this list,
         * in proper sequence.
         */
        LinkedList.prototype.toArray = function () {
            var array = [];
            var currentNode = this.firstNode;
            while (currentNode !== null) {
                array.push(currentNode.element);
                currentNode = currentNode.next;
            }
            return array;
        };
        /**
         * Returns the number of elements in this list.
         * @return {number} the number of elements in this list.
         */
        LinkedList.prototype.size = function () {
            return this.nElements;
        };
        /**
         * Returns true if this list contains no elements.
         * @return {boolean} true if this list contains no elements.
         */
        LinkedList.prototype.isEmpty = function () {
            return this.nElements <= 0;
        };
        LinkedList.prototype.toString = function () {
            return collections.arrays.toString(this.toArray());
        };
        /**
         * @private
         */
        LinkedList.prototype.nodeAtIndex = function (index) {
            if (index < 0 || index >= this.nElements) {
                return null;
            }
            if (index === (this.nElements - 1)) {
                return this.lastNode;
            }
            var node = this.firstNode;
            for (var i = 0; i < index; i++) {
                node = node.next;
            }
            return node;
        };
        /**
         * @private
         */
        LinkedList.prototype.createNode = function (item) {
            return {
                element: item,
                next: null
            };
        };
        return LinkedList;
    })();
    collections.LinkedList = LinkedList; // End of linked list 
    var Dictionary = (function () {
        /**
         * Creates an empty dictionary.
         * @class <p>Dictionaries map keys to values; each key can map to at most one value.
         * This implementation accepts any kind of objects as keys.</p>
         *
         * <p>If the keys are custom objects a function which converts keys to unique
         * strings must be provided. Example:</p>
         * <pre>
         * function petToString(pet) {
         *  return pet.name;
         * }
         * </pre>
         * @constructor
         * @param {function(Object):string=} toStrFunction optional function used
         * to convert keys to strings. If the keys aren't strings or if toString()
         * is not appropriate, a custom function which receives a key and returns a
         * unique string must be provided.
         */
        function Dictionary(toStrFunction) {
            this.table = {};
            this.nElements = 0;
            this.toStr = toStrFunction || collections.defaultToString;
        }
        /**
         * Returns the value to which this dictionary maps the specified key.
         * Returns undefined if this dictionary contains no mapping for this key.
         * @param {Object} key key whose associated value is to be returned.
         * @return {*} the value to which this dictionary maps the specified key or
         * undefined if the map contains no mapping for this key.
         */
        Dictionary.prototype.getValue = function (key) {
            var pair = this.table['$' + this.toStr(key)];
            if (collections.isUndefined(pair)) {
                return undefined;
            }
            return pair.value;
        };
        /**
         * Associates the specified value with the specified key in this dictionary.
         * If the dictionary previously contained a mapping for this key, the old
         * value is replaced by the specified value.
         * @param {Object} key key with which the specified value is to be
         * associated.
         * @param {Object} value value to be associated with the specified key.
         * @return {*} previous value associated with the specified key, or undefined if
         * there was no mapping for the key or if the key/value are undefined.
         */
        Dictionary.prototype.setValue = function (key, value) {
            if (collections.isUndefined(key) || collections.isUndefined(value)) {
                return undefined;
            }
            var ret;
            var k = '$' + this.toStr(key);
            var previousElement = this.table[k];
            if (collections.isUndefined(previousElement)) {
                this.nElements++;
                ret = undefined;
            }
            else {
                ret = previousElement.value;
            }
            this.table[k] = {
                key: key,
                value: value
            };
            return ret;
        };
        /**
         * Removes the mapping for this key from this dictionary if it is present.
         * @param {Object} key key whose mapping is to be removed from the
         * dictionary.
         * @return {*} previous value associated with specified key, or undefined if
         * there was no mapping for key.
         */
        Dictionary.prototype.remove = function (key) {
            var k = '$' + this.toStr(key);
            var previousElement = this.table[k];
            if (!collections.isUndefined(previousElement)) {
                delete this.table[k];
                this.nElements--;
                return previousElement.value;
            }
            return undefined;
        };
        /**
         * Returns an array containing all of the keys in this dictionary.
         * @return {Array} an array containing all of the keys in this dictionary.
         */
        Dictionary.prototype.keys = function () {
            var array = [];
            for (var name in this.table) {
                if (has(this.table, name)) {
                    var pair = this.table[name];
                    array.push(pair.key);
                }
            }
            return array;
        };
        /**
         * Returns an array containing all of the values in this dictionary.
         * @return {Array} an array containing all of the values in this dictionary.
         */
        Dictionary.prototype.values = function () {
            var array = [];
            for (var name in this.table) {
                if (has(this.table, name)) {
                    var pair = this.table[name];
                    array.push(pair.value);
                }
            }
            return array;
        };
        /**
        * Executes the provided function once for each key-value pair
        * present in this dictionary.
        * @param {function(Object,Object):*} callback function to execute, it is
        * invoked with two arguments: key and value. To break the iteration you can
        * optionally return false.
        */
        Dictionary.prototype.forEach = function (callback) {
            for (var name in this.table) {
                if (has(this.table, name)) {
                    var pair = this.table[name];
                    var ret = callback(pair.key, pair.value);
                    if (ret === false) {
                        return;
                    }
                }
            }
        };
        /**
         * Returns true if this dictionary contains a mapping for the specified key.
         * @param {Object} key key whose presence in this dictionary is to be
         * tested.
         * @return {boolean} true if this dictionary contains a mapping for the
         * specified key.
         */
        Dictionary.prototype.containsKey = function (key) {
            return !collections.isUndefined(this.getValue(key));
        };
        /**
        * Removes all mappings from this dictionary.
        * @this {collections.Dictionary}
        */
        Dictionary.prototype.clear = function () {
            this.table = {};
            this.nElements = 0;
        };
        /**
         * Returns the number of keys in this dictionary.
         * @return {number} the number of key-value mappings in this dictionary.
         */
        Dictionary.prototype.size = function () {
            return this.nElements;
        };
        /**
         * Returns true if this dictionary contains no mappings.
         * @return {boolean} true if this dictionary contains no mappings.
         */
        Dictionary.prototype.isEmpty = function () {
            return this.nElements <= 0;
        };
        Dictionary.prototype.toString = function () {
            var toret = "{";
            this.forEach(function (k, v) {
                toret = toret + "\n\t" + k.toString() + " : " + v.toString();
            });
            return toret + "\n}";
        };
        return Dictionary;
    })();
    collections.Dictionary = Dictionary; // End of dictionary
    // /**
    //  * Returns true if this dictionary is equal to the given dictionary.
    //  * Two dictionaries are equal if they contain the same mappings.
    //  * @param {collections.Dictionary} other the other dictionary.
    //  * @param {function(Object,Object):boolean=} valuesEqualFunction optional
    //  * function used to check if two values are equal.
    //  * @return {boolean} true if this dictionary is equal to the given dictionary.
    //  */
    // collections.Dictionary.prototype.equals = function(other,valuesEqualFunction) {
    //         var eqF = valuesEqualFunction || collections.defaultEquals;
    //         if(!(other instanceof collections.Dictionary)){
    //                 return false;
    //         }
    //         if(this.size() !== other.size()){
    //                 return false;
    //         }
    //         return this.equalsAux(this.firstNode,other.firstNode,eqF);
    // }
    var MultiDictionary = (function () {
        /**
         * Creates an empty multi dictionary.
         * @class <p>A multi dictionary is a special kind of dictionary that holds
         * multiple values against each key. Setting a value into the dictionary will
         * add the value to an array at that key. Getting a key will return an array,
         * holding all the values set to that key.
         * You can configure to allow duplicates in the values.
         * This implementation accepts any kind of objects as keys.</p>
         *
         * <p>If the keys are custom objects a function which converts keys to strings must be
         * provided. Example:</p>
         *
         * <pre>
         * function petToString(pet) {
           *  return pet.name;
           * }
         * </pre>
         * <p>If the values are custom objects a function to check equality between values
         * must be provided. Example:</p>
         *
         * <pre>
         * function petsAreEqualByAge(pet1,pet2) {
           *  return pet1.age===pet2.age;
           * }
         * </pre>
         * @constructor
         * @param {function(Object):string=} toStrFunction optional function
         * to convert keys to strings. If the keys aren't strings or if toString()
         * is not appropriate, a custom function which receives a key and returns a
         * unique string must be provided.
         * @param {function(Object,Object):boolean=} valuesEqualsFunction optional
         * function to check if two values are equal.
         *
         * @param allowDuplicateValues
         */
        function MultiDictionary(toStrFunction, valuesEqualsFunction, allowDuplicateValues) {
            if (allowDuplicateValues === void 0) { allowDuplicateValues = false; }
            this.dict = new Dictionary(toStrFunction);
            this.equalsF = valuesEqualsFunction || collections.defaultEquals;
            this.allowDuplicate = allowDuplicateValues;
        }
        /**
        * Returns an array holding the values to which this dictionary maps
        * the specified key.
        * Returns an empty array if this dictionary contains no mappings for this key.
        * @param {Object} key key whose associated values are to be returned.
        * @return {Array} an array holding the values to which this dictionary maps
        * the specified key.
        */
        MultiDictionary.prototype.getValue = function (key) {
            var values = this.dict.getValue(key);
            if (collections.isUndefined(values)) {
                return [];
            }
            return collections.arrays.copy(values);
        };
        /**
         * Adds the value to the array associated with the specified key, if
         * it is not already present.
         * @param {Object} key key with which the specified value is to be
         * associated.
         * @param {Object} value the value to add to the array at the key
         * @return {boolean} true if the value was not already associated with that key.
         */
        MultiDictionary.prototype.setValue = function (key, value) {
            if (collections.isUndefined(key) || collections.isUndefined(value)) {
                return false;
            }
            if (!this.containsKey(key)) {
                this.dict.setValue(key, [value]);
                return true;
            }
            var array = this.dict.getValue(key);
            if (!this.allowDuplicate) {
                if (collections.arrays.contains(array, value, this.equalsF)) {
                    return false;
                }
            }
            array.push(value);
            return true;
        };
        /**
         * Removes the specified values from the array of values associated with the
         * specified key. If a value isn't given, all values associated with the specified
         * key are removed.
         * @param {Object} key key whose mapping is to be removed from the
         * dictionary.
         * @param {Object=} value optional argument to specify the value to remove
         * from the array associated with the specified key.
         * @return {*} true if the dictionary changed, false if the key doesn't exist or
         * if the specified value isn't associated with the specified key.
         */
        MultiDictionary.prototype.remove = function (key, value) {
            if (collections.isUndefined(value)) {
                var v = this.dict.remove(key);
                return !collections.isUndefined(v);
            }
            var array = this.dict.getValue(key);
            if (collections.arrays.remove(array, value, this.equalsF)) {
                if (array.length === 0) {
                    this.dict.remove(key);
                }
                return true;
            }
            return false;
        };
        /**
         * Returns an array containing all of the keys in this dictionary.
         * @return {Array} an array containing all of the keys in this dictionary.
         */
        MultiDictionary.prototype.keys = function () {
            return this.dict.keys();
        };
        /**
         * Returns an array containing all of the values in this dictionary.
         * @return {Array} an array containing all of the values in this dictionary.
         */
        MultiDictionary.prototype.values = function () {
            var values = this.dict.values();
            var array = [];
            for (var i = 0; i < values.length; i++) {
                var v = values[i];
                for (var j = 0; j < v.length; j++) {
                    array.push(v[j]);
                }
            }
            return array;
        };
        /**
         * Returns true if this dictionary at least one value associatted the specified key.
         * @param {Object} key key whose presence in this dictionary is to be
         * tested.
         * @return {boolean} true if this dictionary at least one value associatted
         * the specified key.
         */
        MultiDictionary.prototype.containsKey = function (key) {
            return this.dict.containsKey(key);
        };
        /**
         * Removes all mappings from this dictionary.
         */
        MultiDictionary.prototype.clear = function () {
            this.dict.clear();
        };
        /**
         * Returns the number of keys in this dictionary.
         * @return {number} the number of key-value mappings in this dictionary.
         */
        MultiDictionary.prototype.size = function () {
            return this.dict.size();
        };
        /**
         * Returns true if this dictionary contains no mappings.
         * @return {boolean} true if this dictionary contains no mappings.
         */
        MultiDictionary.prototype.isEmpty = function () {
            return this.dict.isEmpty();
        };
        return MultiDictionary;
    })();
    collections.MultiDictionary = MultiDictionary; // end of multi dictionary 
    var Heap = (function () {
        /**
         * Creates an empty Heap.
         * @class
         * <p>A heap is a binary tree, where the nodes maintain the heap property:
         * each node is smaller than each of its children and therefore a MinHeap
         * This implementation uses an array to store elements.</p>
         * <p>If the inserted elements are custom objects a compare function must be provided,
         *  at construction time, otherwise the <=, === and >= operators are
         * used to compare elements. Example:</p>
         *
         * <pre>
         * function compare(a, b) {
         *  if (a is less than b by some ordering criterion) {
         *     return -1;
         *  } if (a is greater than b by the ordering criterion) {
         *     return 1;
         *  }
         *  // a must be equal to b
         *  return 0;
         * }
         * </pre>
         *
         * <p>If a Max-Heap is wanted (greater elements on top) you can a provide a
         * reverse compare function to accomplish that behavior. Example:</p>
         *
         * <pre>
         * function reverseCompare(a, b) {
         *  if (a is less than b by some ordering criterion) {
         *     return 1;
         *  } if (a is greater than b by the ordering criterion) {
         *     return -1;
         *  }
         *  // a must be equal to b
         *  return 0;
         * }
         * </pre>
         *
         * @constructor
         * @param {function(Object,Object):number=} compareFunction optional
         * function used to compare two elements. Must return a negative integer,
         * zero, or a positive integer as the first argument is less than, equal to,
         * or greater than the second.
         */
        function Heap(compareFunction) {
            /**
             * Array used to store the elements od the heap.
             * @type {Array.<Object>}
             * @private
             */
            this.data = [];
            this.compare = compareFunction || collections.defaultCompare;
        }
        /**
         * Returns the index of the left child of the node at the given index.
         * @param {number} nodeIndex The index of the node to get the left child
         * for.
         * @return {number} The index of the left child.
         * @private
         */
        Heap.prototype.leftChildIndex = function (nodeIndex) {
            return (2 * nodeIndex) + 1;
        };
        /**
         * Returns the index of the right child of the node at the given index.
         * @param {number} nodeIndex The index of the node to get the right child
         * for.
         * @return {number} The index of the right child.
         * @private
         */
        Heap.prototype.rightChildIndex = function (nodeIndex) {
            return (2 * nodeIndex) + 2;
        };
        /**
         * Returns the index of the parent of the node at the given index.
         * @param {number} nodeIndex The index of the node to get the parent for.
         * @return {number} The index of the parent.
         * @private
         */
        Heap.prototype.parentIndex = function (nodeIndex) {
            return Math.floor((nodeIndex - 1) / 2);
        };
        /**
         * Returns the index of the smaller child node (if it exists).
         * @param {number} leftChild left child index.
         * @param {number} rightChild right child index.
         * @return {number} the index with the minimum value or -1 if it doesn't
         * exists.
         * @private
         */
        Heap.prototype.minIndex = function (leftChild, rightChild) {
            if (rightChild >= this.data.length) {
                if (leftChild >= this.data.length) {
                    return -1;
                }
                else {
                    return leftChild;
                }
            }
            else {
                if (this.compare(this.data[leftChild], this.data[rightChild]) <= 0) {
                    return leftChild;
                }
                else {
                    return rightChild;
                }
            }
        };
        /**
         * Moves the node at the given index up to its proper place in the heap.
         * @param {number} index The index of the node to move up.
         * @private
         */
        Heap.prototype.siftUp = function (index) {
            var parent = this.parentIndex(index);
            while (index > 0 && this.compare(this.data[parent], this.data[index]) > 0) {
                collections.arrays.swap(this.data, parent, index);
                index = parent;
                parent = this.parentIndex(index);
            }
        };
        /**
         * Moves the node at the given index down to its proper place in the heap.
         * @param {number} nodeIndex The index of the node to move down.
         * @private
         */
        Heap.prototype.siftDown = function (nodeIndex) {
            //smaller child index
            var min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));
            while (min >= 0 && this.compare(this.data[nodeIndex], this.data[min]) > 0) {
                collections.arrays.swap(this.data, min, nodeIndex);
                nodeIndex = min;
                min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));
            }
        };
        /**
         * Retrieves but does not remove the root element of this heap.
         * @return {*} The value at the root of the heap. Returns undefined if the
         * heap is empty.
         */
        Heap.prototype.peek = function () {
            if (this.data.length > 0) {
                return this.data[0];
            }
            else {
                return undefined;
            }
        };
        /**
         * Adds the given element into the heap.
         * @param {*} element the element.
         * @return true if the element was added or fals if it is undefined.
         */
        Heap.prototype.add = function (element) {
            if (collections.isUndefined(element)) {
                return undefined;
            }
            this.data.push(element);
            this.siftUp(this.data.length - 1);
            return true;
        };
        /**
         * Retrieves and removes the root element of this heap.
         * @return {*} The value removed from the root of the heap. Returns
         * undefined if the heap is empty.
         */
        Heap.prototype.removeRoot = function () {
            if (this.data.length > 0) {
                var obj = this.data[0];
                this.data[0] = this.data[this.data.length - 1];
                this.data.splice(this.data.length - 1, 1);
                if (this.data.length > 0) {
                    this.siftDown(0);
                }
                return obj;
            }
            return undefined;
        };
        /**
         * Returns true if this heap contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this Heap contains the specified element, false
         * otherwise.
         */
        Heap.prototype.contains = function (element) {
            var equF = collections.compareToEquals(this.compare);
            return collections.arrays.contains(this.data, element, equF);
        };
        /**
         * Returns the number of elements in this heap.
         * @return {number} the number of elements in this heap.
         */
        Heap.prototype.size = function () {
            return this.data.length;
        };
        /**
         * Checks if this heap is empty.
         * @return {boolean} true if and only if this heap contains no items; false
         * otherwise.
         */
        Heap.prototype.isEmpty = function () {
            return this.data.length <= 0;
        };
        /**
         * Removes all of the elements from this heap.
         */
        Heap.prototype.clear = function () {
            this.data.length = 0;
        };
        /**
         * Executes the provided function once for each element present in this heap in
         * no particular order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        Heap.prototype.forEach = function (callback) {
            collections.arrays.forEach(this.data, callback);
        };
        return Heap;
    })();
    collections.Heap = Heap;
    var Stack = (function () {
        /**
         * Creates an empty Stack.
         * @class A Stack is a Last-In-First-Out (LIFO) data structure, the last
         * element added to the stack will be the first one to be removed. This
         * implementation uses a linked list as a container.
         * @constructor
         */
        function Stack() {
            this.list = new LinkedList();
        }
        /**
         * Pushes an item onto the top of this stack.
         * @param {Object} elem the element to be pushed onto this stack.
         * @return {boolean} true if the element was pushed or false if it is undefined.
         */
        Stack.prototype.push = function (elem) {
            return this.list.add(elem, 0);
        };
        /**
         * Pushes an item onto the top of this stack.
         * @param {Object} elem the element to be pushed onto this stack.
         * @return {boolean} true if the element was pushed or false if it is undefined.
         */
        Stack.prototype.add = function (elem) {
            return this.list.add(elem, 0);
        };
        /**
         * Removes the object at the top of this stack and returns that object.
         * @return {*} the object at the top of this stack or undefined if the
         * stack is empty.
         */
        Stack.prototype.pop = function () {
            return this.list.removeElementAtIndex(0);
        };
        /**
         * Looks at the object at the top of this stack without removing it from the
         * stack.
         * @return {*} the object at the top of this stack or undefined if the
         * stack is empty.
         */
        Stack.prototype.peek = function () {
            return this.list.first();
        };
        /**
         * Returns the number of elements in this stack.
         * @return {number} the number of elements in this stack.
         */
        Stack.prototype.size = function () {
            return this.list.size();
        };
        /**
         * Returns true if this stack contains the specified element.
         * <p>If the elements inside this stack are
         * not comparable with the === operator, a custom equals function should be
         * provided to perform searches, the function must receive two arguments and
         * return true if they are equal, false otherwise. Example:</p>
         *
         * <pre>
         * var petsAreEqualByName (pet1, pet2) {
         *  return pet1.name === pet2.name;
         * }
         * </pre>
         * @param {Object} elem element to search for.
         * @param {function(Object,Object):boolean=} equalsFunction optional
         * function to check if two elements are equal.
         * @return {boolean} true if this stack contains the specified element,
         * false otherwise.
         */
        Stack.prototype.contains = function (elem, equalsFunction) {
            return this.list.contains(elem, equalsFunction);
        };
        /**
         * Checks if this stack is empty.
         * @return {boolean} true if and only if this stack contains no items; false
         * otherwise.
         */
        Stack.prototype.isEmpty = function () {
            return this.list.isEmpty();
        };
        /**
         * Removes all of the elements from this stack.
         */
        Stack.prototype.clear = function () {
            this.list.clear();
        };
        /**
         * Executes the provided function once for each element present in this stack in
         * LIFO order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        Stack.prototype.forEach = function (callback) {
            this.list.forEach(callback);
        };
        return Stack;
    })();
    collections.Stack = Stack; // End of stack 
    var Queue = (function () {
        /**
         * Creates an empty queue.
         * @class A queue is a First-In-First-Out (FIFO) data structure, the first
         * element added to the queue will be the first one to be removed. This
         * implementation uses a linked list as a container.
         * @constructor
         */
        function Queue() {
            this.list = new LinkedList();
        }
        /**
         * Inserts the specified element into the end of this queue.
         * @param {Object} elem the element to insert.
         * @return {boolean} true if the element was inserted, or false if it is undefined.
         */
        Queue.prototype.enqueue = function (elem) {
            return this.list.add(elem);
        };
        /**
         * Inserts the specified element into the end of this queue.
         * @param {Object} elem the element to insert.
         * @return {boolean} true if the element was inserted, or false if it is undefined.
         */
        Queue.prototype.add = function (elem) {
            return this.list.add(elem);
        };
        /**
         * Retrieves and removes the head of this queue.
         * @return {*} the head of this queue, or undefined if this queue is empty.
         */
        Queue.prototype.dequeue = function () {
            if (this.list.size() !== 0) {
                var el = this.list.first();
                this.list.removeElementAtIndex(0);
                return el;
            }
            return undefined;
        };
        /**
         * Retrieves, but does not remove, the head of this queue.
         * @return {*} the head of this queue, or undefined if this queue is empty.
         */
        Queue.prototype.peek = function () {
            if (this.list.size() !== 0) {
                return this.list.first();
            }
            return undefined;
        };
        /**
         * Returns the number of elements in this queue.
         * @return {number} the number of elements in this queue.
         */
        Queue.prototype.size = function () {
            return this.list.size();
        };
        /**
         * Returns true if this queue contains the specified element.
         * <p>If the elements inside this stack are
         * not comparable with the === operator, a custom equals function should be
         * provided to perform searches, the function must receive two arguments and
         * return true if they are equal, false otherwise. Example:</p>
         *
         * <pre>
         * var petsAreEqualByName (pet1, pet2) {
         *  return pet1.name === pet2.name;
         * }
         * </pre>
         * @param {Object} elem element to search for.
         * @param {function(Object,Object):boolean=} equalsFunction optional
         * function to check if two elements are equal.
         * @return {boolean} true if this queue contains the specified element,
         * false otherwise.
         */
        Queue.prototype.contains = function (elem, equalsFunction) {
            return this.list.contains(elem, equalsFunction);
        };
        /**
         * Checks if this queue is empty.
         * @return {boolean} true if and only if this queue contains no items; false
         * otherwise.
         */
        Queue.prototype.isEmpty = function () {
            return this.list.size() <= 0;
        };
        /**
         * Removes all of the elements from this queue.
         */
        Queue.prototype.clear = function () {
            this.list.clear();
        };
        /**
         * Executes the provided function once for each element present in this queue in
         * FIFO order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        Queue.prototype.forEach = function (callback) {
            this.list.forEach(callback);
        };
        return Queue;
    })();
    collections.Queue = Queue; // End of queue
    var PriorityQueue = (function () {
        /**
         * Creates an empty priority queue.
         * @class <p>In a priority queue each element is associated with a "priority",
         * elements are dequeued in highest-priority-first order (the elements with the
         * highest priority are dequeued first). Priority Queues are implemented as heaps.
         * If the inserted elements are custom objects a compare function must be provided,
         * otherwise the <=, === and >= operators are used to compare object priority.</p>
         * <pre>
         * function compare(a, b) {
         *  if (a is less than b by some ordering criterion) {
         *     return -1;
         *  } if (a is greater than b by the ordering criterion) {
         *     return 1;
         *  }
         *  // a must be equal to b
         *  return 0;
         * }
         * </pre>
         * @constructor
         * @param {function(Object,Object):number=} compareFunction optional
         * function used to compare two element priorities. Must return a negative integer,
         * zero, or a positive integer as the first argument is less than, equal to,
         * or greater than the second.
         */
        function PriorityQueue(compareFunction) {
            this.heap = new Heap(collections.reverseCompareFunction(compareFunction));
        }
        /**
         * Inserts the specified element into this priority queue.
         * @param {Object} element the element to insert.
         * @return {boolean} true if the element was inserted, or false if it is undefined.
         */
        PriorityQueue.prototype.enqueue = function (element) {
            return this.heap.add(element);
        };
        /**
         * Inserts the specified element into this priority queue.
         * @param {Object} element the element to insert.
         * @return {boolean} true if the element was inserted, or false if it is undefined.
         */
        PriorityQueue.prototype.add = function (element) {
            return this.heap.add(element);
        };
        /**
         * Retrieves and removes the highest priority element of this queue.
         * @return {*} the the highest priority element of this queue,
         *  or undefined if this queue is empty.
         */
        PriorityQueue.prototype.dequeue = function () {
            if (this.heap.size() !== 0) {
                var el = this.heap.peek();
                this.heap.removeRoot();
                return el;
            }
            return undefined;
        };
        /**
         * Retrieves, but does not remove, the highest priority element of this queue.
         * @return {*} the highest priority element of this queue, or undefined if this queue is empty.
         */
        PriorityQueue.prototype.peek = function () {
            return this.heap.peek();
        };
        /**
         * Returns true if this priority queue contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this priority queue contains the specified element,
         * false otherwise.
         */
        PriorityQueue.prototype.contains = function (element) {
            return this.heap.contains(element);
        };
        /**
         * Checks if this priority queue is empty.
         * @return {boolean} true if and only if this priority queue contains no items; false
         * otherwise.
         */
        PriorityQueue.prototype.isEmpty = function () {
            return this.heap.isEmpty();
        };
        /**
         * Returns the number of elements in this priority queue.
         * @return {number} the number of elements in this priority queue.
         */
        PriorityQueue.prototype.size = function () {
            return this.heap.size();
        };
        /**
         * Removes all of the elements from this priority queue.
         */
        PriorityQueue.prototype.clear = function () {
            this.heap.clear();
        };
        /**
         * Executes the provided function once for each element present in this queue in
         * no particular order.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        PriorityQueue.prototype.forEach = function (callback) {
            this.heap.forEach(callback);
        };
        return PriorityQueue;
    })();
    collections.PriorityQueue = PriorityQueue; // end of priority queue
    var Set = (function () {
        /**
         * Creates an empty set.
         * @class <p>A set is a data structure that contains no duplicate items.</p>
         * <p>If the inserted elements are custom objects a function
         * which converts elements to strings must be provided. Example:</p>
         *
         * <pre>
         * function petToString(pet) {
         *  return pet.name;
         * }
         * </pre>
         *
         * @constructor
         * @param {function(Object):string=} toStringFunction optional function used
         * to convert elements to strings. If the elements aren't strings or if toString()
         * is not appropriate, a custom function which receives a onject and returns a
         * unique string must be provided.
         */
        function Set(toStringFunction) {
            this.dictionary = new Dictionary(toStringFunction);
        }
        /**
         * Returns true if this set contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this set contains the specified element,
         * false otherwise.
         */
        Set.prototype.contains = function (element) {
            return this.dictionary.containsKey(element);
        };
        /**
         * Adds the specified element to this set if it is not already present.
         * @param {Object} element the element to insert.
         * @return {boolean} true if this set did not already contain the specified element.
         */
        Set.prototype.add = function (element) {
            if (this.contains(element) || collections.isUndefined(element)) {
                return false;
            }
            else {
                this.dictionary.setValue(element, element);
                return true;
            }
        };
        /**
         * Performs an intersecion between this an another set.
         * Removes all values that are not present this set and the given set.
         * @param {collections.Set} otherSet other set.
         */
        Set.prototype.intersection = function (otherSet) {
            var set = this;
            this.forEach(function (element) {
                if (!otherSet.contains(element)) {
                    set.remove(element);
                }
                return true;
            });
        };
        /**
         * Performs a union between this an another set.
         * Adds all values from the given set to this set.
         * @param {collections.Set} otherSet other set.
         */
        Set.prototype.union = function (otherSet) {
            var set = this;
            otherSet.forEach(function (element) {
                set.add(element);
                return true;
            });
        };
        /**
         * Performs a difference between this an another set.
         * Removes from this set all the values that are present in the given set.
         * @param {collections.Set} otherSet other set.
         */
        Set.prototype.difference = function (otherSet) {
            var set = this;
            otherSet.forEach(function (element) {
                set.remove(element);
                return true;
            });
        };
        /**
         * Checks whether the given set contains all the elements in this set.
         * @param {collections.Set} otherSet other set.
         * @return {boolean} true if this set is a subset of the given set.
         */
        Set.prototype.isSubsetOf = function (otherSet) {
            if (this.size() > otherSet.size()) {
                return false;
            }
            var isSub = true;
            this.forEach(function (element) {
                if (!otherSet.contains(element)) {
                    isSub = false;
                    return false;
                }
                return true;
            });
            return isSub;
        };
        /**
         * Removes the specified element from this set if it is present.
         * @return {boolean} true if this set contained the specified element.
         */
        Set.prototype.remove = function (element) {
            if (!this.contains(element)) {
                return false;
            }
            else {
                this.dictionary.remove(element);
                return true;
            }
        };
        /**
         * Executes the provided function once for each element
         * present in this set.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one arguments: the element. To break the iteration you can
         * optionally return false.
         */
        Set.prototype.forEach = function (callback) {
            this.dictionary.forEach(function (k, v) {
                return callback(v);
            });
        };
        /**
         * Returns an array containing all of the elements in this set in arbitrary order.
         * @return {Array} an array containing all of the elements in this set.
         */
        Set.prototype.toArray = function () {
            return this.dictionary.values();
        };
        /**
         * Returns true if this set contains no elements.
         * @return {boolean} true if this set contains no elements.
         */
        Set.prototype.isEmpty = function () {
            return this.dictionary.isEmpty();
        };
        /**
         * Returns the number of elements in this set.
         * @return {number} the number of elements in this set.
         */
        Set.prototype.size = function () {
            return this.dictionary.size();
        };
        /**
         * Removes all of the elements from this set.
         */
        Set.prototype.clear = function () {
            this.dictionary.clear();
        };
        /*
        * Provides a string representation for display
        */
        Set.prototype.toString = function () {
            return collections.arrays.toString(this.toArray());
        };
        return Set;
    })();
    collections.Set = Set; // end of Set
    var Bag = (function () {
        /**
         * Creates an empty bag.
         * @class <p>A bag is a special kind of set in which members are
         * allowed to appear more than once.</p>
         * <p>If the inserted elements are custom objects a function
         * which converts elements to unique strings must be provided. Example:</p>
         *
         * <pre>
         * function petToString(pet) {
         *  return pet.name;
         * }
         * </pre>
         *
         * @constructor
         * @param {function(Object):string=} toStrFunction optional function used
         * to convert elements to strings. If the elements aren't strings or if toString()
         * is not appropriate, a custom function which receives an object and returns a
         * unique string must be provided.
         */
        function Bag(toStrFunction) {
            this.toStrF = toStrFunction || collections.defaultToString;
            this.dictionary = new Dictionary(this.toStrF);
            this.nElements = 0;
        }
        /**
        * Adds nCopies of the specified object to this bag.
        * @param {Object} element element to add.
        * @param {number=} nCopies the number of copies to add, if this argument is
        * undefined 1 copy is added.
        * @return {boolean} true unless element is undefined.
        */
        Bag.prototype.add = function (element, nCopies) {
            if (nCopies === void 0) { nCopies = 1; }
            if (collections.isUndefined(element) || nCopies <= 0) {
                return false;
            }
            if (!this.contains(element)) {
                var node = {
                    value: element,
                    copies: nCopies
                };
                this.dictionary.setValue(element, node);
            }
            else {
                this.dictionary.getValue(element).copies += nCopies;
            }
            this.nElements += nCopies;
            return true;
        };
        /**
        * Counts the number of copies of the specified object in this bag.
        * @param {Object} element the object to search for..
        * @return {number} the number of copies of the object, 0 if not found
        */
        Bag.prototype.count = function (element) {
            if (!this.contains(element)) {
                return 0;
            }
            else {
                return this.dictionary.getValue(element).copies;
            }
        };
        /**
         * Returns true if this bag contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this bag contains the specified element,
         * false otherwise.
         */
        Bag.prototype.contains = function (element) {
            return this.dictionary.containsKey(element);
        };
        /**
        * Removes nCopies of the specified object to this bag.
        * If the number of copies to remove is greater than the actual number
        * of copies in the Bag, all copies are removed.
        * @param {Object} element element to remove.
        * @param {number=} nCopies the number of copies to remove, if this argument is
        * undefined 1 copy is removed.
        * @return {boolean} true if at least 1 element was removed.
        */
        Bag.prototype.remove = function (element, nCopies) {
            if (nCopies === void 0) { nCopies = 1; }
            if (collections.isUndefined(element) || nCopies <= 0) {
                return false;
            }
            if (!this.contains(element)) {
                return false;
            }
            else {
                var node = this.dictionary.getValue(element);
                if (nCopies > node.copies) {
                    this.nElements -= node.copies;
                }
                else {
                    this.nElements -= nCopies;
                }
                node.copies -= nCopies;
                if (node.copies <= 0) {
                    this.dictionary.remove(element);
                }
                return true;
            }
        };
        /**
         * Returns an array containing all of the elements in this big in arbitrary order,
         * including multiple copies.
         * @return {Array} an array containing all of the elements in this bag.
         */
        Bag.prototype.toArray = function () {
            var a = [];
            var values = this.dictionary.values();
            var vl = values.length;
            for (var i = 0; i < vl; i++) {
                var node = values[i];
                var element = node.value;
                var copies = node.copies;
                for (var j = 0; j < copies; j++) {
                    a.push(element);
                }
            }
            return a;
        };
        /**
         * Returns a set of unique elements in this bag.
         * @return {collections.Set<T>} a set of unique elements in this bag.
         */
        Bag.prototype.toSet = function () {
            var toret = new Set(this.toStrF);
            var elements = this.dictionary.values();
            var l = elements.length;
            for (var i = 0; i < l; i++) {
                var value = elements[i].value;
                toret.add(value);
            }
            return toret;
        };
        /**
         * Executes the provided function once for each element
         * present in this bag, including multiple copies.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element. To break the iteration you can
         * optionally return false.
         */
        Bag.prototype.forEach = function (callback) {
            this.dictionary.forEach(function (k, v) {
                var value = v.value;
                var copies = v.copies;
                for (var i = 0; i < copies; i++) {
                    if (callback(value) === false) {
                        return false;
                    }
                }
                return true;
            });
        };
        /**
         * Returns the number of elements in this bag.
         * @return {number} the number of elements in this bag.
         */
        Bag.prototype.size = function () {
            return this.nElements;
        };
        /**
         * Returns true if this bag contains no elements.
         * @return {boolean} true if this bag contains no elements.
         */
        Bag.prototype.isEmpty = function () {
            return this.nElements === 0;
        };
        /**
         * Removes all of the elements from this bag.
         */
        Bag.prototype.clear = function () {
            this.nElements = 0;
            this.dictionary.clear();
        };
        return Bag;
    })();
    collections.Bag = Bag; // End of bag 
    var BSTree = (function () {
        /**
         * Creates an empty binary search tree.
         * @class <p>A binary search tree is a binary tree in which each
         * internal node stores an element such that the elements stored in the
         * left subtree are less than it and the elements
         * stored in the right subtree are greater.</p>
         * <p>Formally, a binary search tree is a node-based binary tree data structure which
         * has the following properties:</p>
         * <ul>
         * <li>The left subtree of a node contains only nodes with elements less
         * than the node's element</li>
         * <li>The right subtree of a node contains only nodes with elements greater
         * than the node's element</li>
         * <li>Both the left and right subtrees must also be binary search trees.</li>
         * </ul>
         * <p>If the inserted elements are custom objects a compare function must
         * be provided at construction time, otherwise the <=, === and >= operators are
         * used to compare elements. Example:</p>
         * <pre>
         * function compare(a, b) {
         *  if (a is less than b by some ordering criterion) {
         *     return -1;
         *  } if (a is greater than b by the ordering criterion) {
         *     return 1;
         *  }
         *  // a must be equal to b
         *  return 0;
         * }
         * </pre>
         * @constructor
         * @param {function(Object,Object):number=} compareFunction optional
         * function used to compare two elements. Must return a negative integer,
         * zero, or a positive integer as the first argument is less than, equal to,
         * or greater than the second.
         */
        function BSTree(compareFunction) {
            this.root = null;
            this.compare = compareFunction || collections.defaultCompare;
            this.nElements = 0;
        }
        /**
         * Adds the specified element to this tree if it is not already present.
         * @param {Object} element the element to insert.
         * @return {boolean} true if this tree did not already contain the specified element.
         */
        BSTree.prototype.add = function (element) {
            if (collections.isUndefined(element)) {
                return false;
            }
            if (this.insertNode(this.createNode(element)) !== null) {
                this.nElements++;
                return true;
            }
            return false;
        };
        /**
         * Removes all of the elements from this tree.
         */
        BSTree.prototype.clear = function () {
            this.root = null;
            this.nElements = 0;
        };
        /**
         * Returns true if this tree contains no elements.
         * @return {boolean} true if this tree contains no elements.
         */
        BSTree.prototype.isEmpty = function () {
            return this.nElements === 0;
        };
        /**
         * Returns the number of elements in this tree.
         * @return {number} the number of elements in this tree.
         */
        BSTree.prototype.size = function () {
            return this.nElements;
        };
        /**
         * Returns true if this tree contains the specified element.
         * @param {Object} element element to search for.
         * @return {boolean} true if this tree contains the specified element,
         * false otherwise.
         */
        BSTree.prototype.contains = function (element) {
            if (collections.isUndefined(element)) {
                return false;
            }
            return this.searchNode(this.root, element) !== null;
        };
        /**
         * Removes the specified element from this tree if it is present.
         * @return {boolean} true if this tree contained the specified element.
         */
        BSTree.prototype.remove = function (element) {
            var node = this.searchNode(this.root, element);
            if (node === null) {
                return false;
            }
            this.removeNode(node);
            this.nElements--;
            return true;
        };
        /**
         * Executes the provided function once for each element present in this tree in
         * in-order.
         * @param {function(Object):*} callback function to execute, it is invoked with one
         * argument: the element value, to break the iteration you can optionally return false.
         */
        BSTree.prototype.inorderTraversal = function (callback) {
            this.inorderTraversalAux(this.root, callback, {
                stop: false
            });
        };
        /**
         * Executes the provided function once for each element present in this tree in pre-order.
         * @param {function(Object):*} callback function to execute, it is invoked with one
         * argument: the element value, to break the iteration you can optionally return false.
         */
        BSTree.prototype.preorderTraversal = function (callback) {
            this.preorderTraversalAux(this.root, callback, {
                stop: false
            });
        };
        /**
         * Executes the provided function once for each element present in this tree in post-order.
         * @param {function(Object):*} callback function to execute, it is invoked with one
         * argument: the element value, to break the iteration you can optionally return false.
         */
        BSTree.prototype.postorderTraversal = function (callback) {
            this.postorderTraversalAux(this.root, callback, {
                stop: false
            });
        };
        /**
         * Executes the provided function once for each element present in this tree in
         * level-order.
         * @param {function(Object):*} callback function to execute, it is invoked with one
         * argument: the element value, to break the iteration you can optionally return false.
         */
        BSTree.prototype.levelTraversal = function (callback) {
            this.levelTraversalAux(this.root, callback);
        };
        /**
         * Returns the minimum element of this tree.
         * @return {*} the minimum element of this tree or undefined if this tree is
         * is empty.
         */
        BSTree.prototype.minimum = function () {
            if (this.isEmpty()) {
                return undefined;
            }
            return this.minimumAux(this.root).element;
        };
        /**
         * Returns the maximum element of this tree.
         * @return {*} the maximum element of this tree or undefined if this tree is
         * is empty.
         */
        BSTree.prototype.maximum = function () {
            if (this.isEmpty()) {
                return undefined;
            }
            return this.maximumAux(this.root).element;
        };
        /**
         * Executes the provided function once for each element present in this tree in inorder.
         * Equivalent to inorderTraversal.
         * @param {function(Object):*} callback function to execute, it is
         * invoked with one argument: the element value, to break the iteration you can
         * optionally return false.
         */
        BSTree.prototype.forEach = function (callback) {
            this.inorderTraversal(callback);
        };
        /**
         * Returns an array containing all of the elements in this tree in in-order.
         * @return {Array} an array containing all of the elements in this tree in in-order.
         */
        BSTree.prototype.toArray = function () {
            var array = [];
            this.inorderTraversal(function (element) {
                array.push(element);
                return true;
            });
            return array;
        };
        /**
         * Returns the height of this tree.
         * @return {number} the height of this tree or -1 if is empty.
         */
        BSTree.prototype.height = function () {
            return this.heightAux(this.root);
        };
        /**
        * @private
        */
        BSTree.prototype.searchNode = function (node, element) {
            var cmp = null;
            while (node !== null && cmp !== 0) {
                cmp = this.compare(element, node.element);
                if (cmp < 0) {
                    node = node.leftCh;
                }
                else if (cmp > 0) {
                    node = node.rightCh;
                }
            }
            return node;
        };
        /**
        * @private
        */
        BSTree.prototype.transplant = function (n1, n2) {
            if (n1.parent === null) {
                this.root = n2;
            }
            else if (n1 === n1.parent.leftCh) {
                n1.parent.leftCh = n2;
            }
            else {
                n1.parent.rightCh = n2;
            }
            if (n2 !== null) {
                n2.parent = n1.parent;
            }
        };
        /**
        * @private
        */
        BSTree.prototype.removeNode = function (node) {
            if (node.leftCh === null) {
                this.transplant(node, node.rightCh);
            }
            else if (node.rightCh === null) {
                this.transplant(node, node.leftCh);
            }
            else {
                var y = this.minimumAux(node.rightCh);
                if (y.parent !== node) {
                    this.transplant(y, y.rightCh);
                    y.rightCh = node.rightCh;
                    y.rightCh.parent = y;
                }
                this.transplant(node, y);
                y.leftCh = node.leftCh;
                y.leftCh.parent = y;
            }
        };
        /**
        * @private
        */
        BSTree.prototype.inorderTraversalAux = function (node, callback, signal) {
            if (node === null || signal.stop) {
                return;
            }
            this.inorderTraversalAux(node.leftCh, callback, signal);
            if (signal.stop) {
                return;
            }
            signal.stop = callback(node.element) === false;
            if (signal.stop) {
                return;
            }
            this.inorderTraversalAux(node.rightCh, callback, signal);
        };
        /**
        * @private
        */
        BSTree.prototype.levelTraversalAux = function (node, callback) {
            var queue = new Queue();
            if (node !== null) {
                queue.enqueue(node);
            }
            while (!queue.isEmpty()) {
                node = queue.dequeue();
                if (callback(node.element) === false) {
                    return;
                }
                if (node.leftCh !== null) {
                    queue.enqueue(node.leftCh);
                }
                if (node.rightCh !== null) {
                    queue.enqueue(node.rightCh);
                }
            }
        };
        /**
        * @private
        */
        BSTree.prototype.preorderTraversalAux = function (node, callback, signal) {
            if (node === null || signal.stop) {
                return;
            }
            signal.stop = callback(node.element) === false;
            if (signal.stop) {
                return;
            }
            this.preorderTraversalAux(node.leftCh, callback, signal);
            if (signal.stop) {
                return;
            }
            this.preorderTraversalAux(node.rightCh, callback, signal);
        };
        /**
        * @private
        */
        BSTree.prototype.postorderTraversalAux = function (node, callback, signal) {
            if (node === null || signal.stop) {
                return;
            }
            this.postorderTraversalAux(node.leftCh, callback, signal);
            if (signal.stop) {
                return;
            }
            this.postorderTraversalAux(node.rightCh, callback, signal);
            if (signal.stop) {
                return;
            }
            signal.stop = callback(node.element) === false;
        };
        /**
        * @private
        */
        BSTree.prototype.minimumAux = function (node) {
            while (node.leftCh !== null) {
                node = node.leftCh;
            }
            return node;
        };
        /**
        * @private
        */
        BSTree.prototype.maximumAux = function (node) {
            while (node.rightCh !== null) {
                node = node.rightCh;
            }
            return node;
        };
        /**
          * @private
          */
        BSTree.prototype.heightAux = function (node) {
            if (node === null) {
                return -1;
            }
            return Math.max(this.heightAux(node.leftCh), this.heightAux(node.rightCh)) + 1;
        };
        /*
        * @private
        */
        BSTree.prototype.insertNode = function (node) {
            var parent = null;
            var position = this.root;
            var cmp = null;
            while (position !== null) {
                cmp = this.compare(node.element, position.element);
                if (cmp === 0) {
                    return null;
                }
                else if (cmp < 0) {
                    parent = position;
                    position = position.leftCh;
                }
                else {
                    parent = position;
                    position = position.rightCh;
                }
            }
            node.parent = parent;
            if (parent === null) {
                // tree is empty
                this.root = node;
            }
            else if (this.compare(node.element, parent.element) < 0) {
                parent.leftCh = node;
            }
            else {
                parent.rightCh = node;
            }
            return node;
        };
        /**
        * @private
        */
        BSTree.prototype.createNode = function (element) {
            return {
                element: element,
                leftCh: null,
                rightCh: null,
                parent: null
            };
        };
        return BSTree;
    })();
    collections.BSTree = BSTree; // end of BSTree
})(collections || (collections = {})); // End of module 
///<reference path="World.ts"/>
///<reference path="Parser.ts"/>
///<reference path="lib/collections.ts"/>
var Interpreter;
(function (Interpreter) {
    //////////////////////////////////////////////////////////////////////
    // exported functions, classes and interfaces/types
    function interpret(parses, currentState) {
        var interpretations = [];
        parses.forEach(function (parseresult) {
            var intprt = parseresult;
            intprt.intp = interpretCommand(intprt.prs, currentState);
            interpretations.push(intprt);
        });
        // enhanching extension
        if (currentState.status[0] === "softambiguity") {
            currentState.previousCmd = parses;
        }
        else {
            // cleaning it up
            currentState.previousCmd = null;
        }
        console.log("DEBUG: " + interpretationToString(interpretations[0]));
        if (interpretations.length > 0) {
            //return interpretations; //Aha found the place for disolving HARD ambiguity!
            var existSolution = false;
            var validInterprets = [];
            interpretations.forEach(function (inter) {
                if (inter.intp.length > 0) {
                    existSolution = true;
                    validInterprets.push(inter);
                }
            });
            if (validInterprets.length > 1) {
                currentState.status.push("multiValidInterpret");
            }
            if (existSolution) {
                // return interpretations;
                return validInterprets;
            }
        }
        throw new Interpreter.Error("Found no legal interpretation");
    }
    Interpreter.interpret = interpret;
    function interpretationToString(res) {
        return res.intp.map(function (lits) {
            return lits.map(function (lit) { return literalToString(lit); }).join(" & ");
        }).join(" | ");
    }
    Interpreter.interpretationToString = interpretationToString;
    function literalToString(lit) {
        return (lit.pol ? "" : "-") + lit.rel + "(" + lit.args.join(",") + ")";
    }
    Interpreter.literalToString = literalToString;
    var Error = (function () {
        function Error(message) {
            this.message = message;
            this.name = "Interpreter.Error";
        }
        Error.prototype.toString = function () {
            return this.name + ": " + this.message;
        };
        return Error;
    })();
    Interpreter.Error = Error;
    function canSupport(above, below) {
        if (below == null) {
            throw new Interpreter.Error("Interpreter.canSupport(): below was NULL");
        }
        if (below.form == "floor") {
            // The floor can support any object
            return true;
        }
        var cs = compareSize(below.size, above.size);
        if (cs < 0) {
            // No small object can support a large(r) one.
            return false;
        }
        if (above.form == "ball") {
            // A ball can only be supported by the floor or a box.
            return below.form == "box";
        }
        if (below.form == "ball") {
            // A ball cannot support anything
            return false;
        }
        if (below.form == "box") {
            if (cs > 0) {
                return true;
            }
            switch (above.form) {
                case "box":
                case "pyramid":
                case "plank":
                    return false;
                default:
                    return true;
            }
        }
        if (above.form == "box") {
            if (above.form == "large") {
                // Large boxes cannot be supported by (large) pyramids
                return below.form != "pyramid";
            }
            else {
                // Small boxes cannot be supported by small bricks or pyramids
                if (below.form == "brick" || below.form == "pyramid") {
                    return below.size != "small";
                }
            }
        }
        // Otherwise, can support
        return true;
    }
    Interpreter.canSupport = canSupport;
    function isUndefined(a) {
        return typeof a === 'undefined';
    }
    Interpreter.isUndefined = isUndefined;
    //////////////////////////////////////////////////////////////////////
    // private functions
    /**
    * Compares two sizes.
    * returns positive if a > b, 0 if a == b and negative otherwise.
    */
    function compareSize(a, b) {
        if (a == b) {
            return 0;
        }
        if (a == "large") {
            return 1;
        }
        return -1;
    }
    function interpretCommand(cmd, state) {
        var intprt = [];
        if (!(cmd.cmd === "put") && cmd.ent.obj.form === "floor") {
            throw new Interpreter.Error("You cannot move the floor");
        }
        if (!(cmd.cmd === "take") && cmd.loc.ent.obj.form === "floor" && !(cmd.loc.rel === "ontop" || cmd.loc.rel === "inside")) {
            throw new Interpreter.Error("You can only put objects ON the floor");
        }
        switch (cmd.cmd) {
            case "take":
                var targets = findTargetEntities(cmd.ent, state).targets;
                if (targets.length == 0) {
                    throw new Interpreter.Error("Can't find such an object to grasp.");
                }
                for (var ix in targets) {
                    intprt.push([
                        { pol: true, rel: "holding", args: [targets[ix]] }
                    ]);
                }
                break;
            case "move":
                var targets = findTargetEntities(cmd.ent, state).targets;
                findMoveInterpretations(cmd, state, intprt, targets);
                break;
            case "put":
                if (state.holding === null) {
                    throw new Interpreter.Error("I don't understand what you mean with 'it'");
                }
                var target = new Array();
                target[0] = state.holding;
                findMoveInterpretations(cmd, state, intprt, target);
                break;
            default:
                throw new Interpreter.Error("Interpreter: UNKNOWN cmd: " + cmd.cmd);
        }
        return intprt;
    }
    function findMoveInterpretations(cmd, state, intprt, tar) {
        // if(tar.length == 0){
        //     throw new Interpreter.Error("Can't find such an object to move.");
        // }
        var location = cmd.loc;
        var locationTargets = findTargetEntities(location.ent, state).targets;
        switch (location.rel) {
            case "beside":
            case "rightof":
            case "leftof":
                moveObjBeside(state, intprt, location.rel, tar, locationTargets);
                break;
            case "ontop":
            case "inside":
                moveObjAbove(state, intprt, location.rel, tar, locationTargets, true);
                break;
            case "above":
                moveObjAbove(state, intprt, location.rel, tar, locationTargets, false);
                break;
            case "under":
                moveObjAbove(state, intprt, "above", locationTargets, tar, false);
                break;
            default:
                throw new Interpreter.Error("Unknown Relation in move: " + location.rel);
        }
    }
    function moveObjBeside(state, intprt, locationRel, fromList, toList) {
        for (var ix in fromList) {
            for (var jx in toList) {
                var object1 = fromList[ix];
                var object2 = toList[jx];
                if (object1 == object2) {
                    continue;
                }
                intprt.push([
                    { pol: true, rel: locationRel, args: [object1, object2] }
                ]);
            }
        }
    }
    function moveObjAbove(state, intprt, locationRel, fromList, toList, exactlyAbove) {
        for (var ix in fromList) {
            var supportiveAmbiguousTargets = [];
            for (var jx in toList) {
                var above = fromList[ix];
                var below = toList[jx];
                if (above == below) {
                    continue;
                }
                var objA = findObjDef(state, above);
                var objB = findObjDef(state, below);
                if (exactlyAbove) {
                    if (!canSupport(objA, objB)) {
                        continue;
                    }
                }
                else {
                    if (objB.form == "ball") {
                        continue;
                    }
                    if (compareSize(objA.size, objB.size) > 0) {
                        continue;
                    }
                }
                if (canSupport(objA, objB)) {
                    supportiveAmbiguousTargets.push(objB);
                }
                intprt.push([
                    { pol: true, rel: locationRel, args: [above, below] }
                ]);
            }
        }
        // make sure supportiveAmbiguousTargets is not undefined and more than one
        if (supportiveAmbiguousTargets && supportiveAmbiguousTargets.length > 1) {
            state.ambiguousObjs.push(supportiveAmbiguousTargets);
        }
    }
    function findObjDef(state, name) {
        if (name === "floor") {
            return { form: "floor", size: null, color: null };
        }
        else {
            return state.objects[name];
        }
    }
    Interpreter.findObjDef = findObjDef;
    function resolveObject(state, goalObj, loc) {
        var result = [];
        var possibleObjects = findTargetObjects(state, goalObj).targets;
        var possibleLocations = findTargetEntities(loc.ent, state).targets;
        for (var ox in possibleObjects) {
            var obj = possibleObjects[ox];
            for (var lx in possibleLocations) {
                if (isObjectInLocation(state, obj, possibleLocations[lx], loc.rel)) {
                    result.push(obj);
                    break;
                }
            }
        }
        return result;
    }
    // Returns a list of Object names that fits the goal Object.
    function findTargetObjects(state, goalObj) {
        var result = [];
        var com = new collections.Set();
        var searchResult = {
            status: "",
            targets: result,
            common: com,
            ambiguousObjs: []
        };
        if (goalObj.obj != null) {
            // Ie form, size etc are null.
            // Filter on location instead...
            //return resolveObject(state, goalObj.obj, goalObj.loc);
            searchResult.targets = resolveObject(state, goalObj.obj, goalObj.loc);
            return searchResult;
        }
        // The anyform case is handled in testObject.
        // if (goalObj.form === "anyform"){
        // }
        if (goalObj.form === "floor") {
            result.push("floor");
        }
        if (state.holding != null) {
            var objName = state.holding;
            if (testObject(state, state.holding, goalObj)) {
                result.push(state.holding);
            }
        }
        for (var stackNo in state.stacks) {
            var currentStack = state.stacks[stackNo];
            for (var heightNo in currentStack) {
                var objName = currentStack[heightNo];
                if (testObject(state, objName, goalObj)) {
                    var obj = state.objects[objName];
                    result.push(objName);
                    searchResult.ambiguousObjs.push(obj);
                }
            }
        }
        return searchResult;
    }
    function testObject(state, objName, goalObj) {
        var obj = state.objects[objName];
        if (goalObj.size != null) {
            if (goalObj.size != obj.size) {
                return false;
            }
        }
        if (goalObj.color != null) {
            if (goalObj.color != obj.color) {
                return false;
            }
        }
        if (goalObj.form != null) {
            if (goalObj.form != obj.form && goalObj.form != "anyform") {
                return false;
            }
        }
        return true;
    }
    /**
    * @return list of targets in the world that complies with the specified entity.
    */
    function findTargetEntities(en, state) {
        //var result : string[] = findTargetObjects(state, en.obj);
        var searchResult = findTargetObjects(state, en.obj);
        switch (en.quant) {
            case "any":
                break;
            case "the":
                if (searchResult.targets.length > 1) {
                    searchResult.status = "SoftAmbiguity";
                    console.log("found multiple objects fits description");
                    console.log(searchResult);
                    state.status.push("softambiguity");
                    state.ambiguousObjs.push(searchResult.ambiguousObjs);
                }
                break;
        }
        return searchResult;
    }
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    ////////// disambiguity //////////
    /// Ambiguity thrown as Special Error (will be catched in Shrdlite)
    var Ambiguity = (function () {
        function Ambiguity(message, c, previousSearch) {
            this.message = message;
            this.name = "Interpreter.Ambiguity";
            this.cmd = c;
            this.searchingResult = previousSearch;
        }
        Ambiguity.prototype.toString = function () {
            return this.name + ": " + this.message + " -> " + this.cmd;
        };
        return Ambiguity;
    })();
    Interpreter.Ambiguity = Ambiguity;
})(Interpreter || (Interpreter = {}));
/// <reference path="lib/collections.ts" />
var Astar;
(function (Astar) {
    var Search = (function () {
        function Search(start, f, h, isGoal, maxIter, multiPathPruning) {
            if (maxIter === void 0) { maxIter = 50000; }
            if (multiPathPruning === void 0) { multiPathPruning = true; }
            this.f = f;
            this.h = h;
            this.isGoal = isGoal;
            this.maxIter = maxIter;
            this.multiPathPruning = multiPathPruning;
            this.visited = new collections.Set();
            this.x = 0;
            this.order = [];
            this.prioQueue = new collections.PriorityQueue((function (a, b) {
                return b.cost + b.heur - a.cost - a.heur;
            }));
            this.bound = h(start);
            this.startVertex = {
                state: start,
                cost: 0,
                heur: this.bound,
                previous: -1,
                action: "init"
            };
        }
        return Search;
    })();
    Astar.Search = Search;
    function astarSearch(s) {
        console.log("Using Astar search...");
        var visited = new collections.Set();
        s.prioQueue.enqueue(s.startVertex);
        while (!s.prioQueue.isEmpty()) {
            if (s.x > s.maxIter) {
                throw new Planner.Error("Max iterations exceeded: " + s.x + " current cost: " + current.cost);
            }
            var current = s.prioQueue.dequeue();
            if (s.multiPathPruning) {
                if (visited.contains(current.state)) {
                    continue;
                }
                visited.add(current.state);
            }
            s.order[s.x] = current;
            if (s.isGoal(current.state)) {
                return postProcess(s.order, s.x);
            }
            var neighbours = s.f(current.state);
            for (var n in neighbours) {
                var next = neighbours[n];
                s.prioQueue.enqueue(neighbourVertex(s, current, next));
            }
            s.x = s.x + 1;
        }
        throw new Planner.Error("No solution found!");
    }
    Astar.astarSearch = astarSearch;
    function neighbourVertex(s, v, neighb) {
        return {
            state: neighb.state,
            cost: v.cost + neighb.transitionCost,
            heur: s.h(neighb.state),
            previous: s.x,
            action: neighb.action
        };
    }
    Astar.neighbourVertex = neighbourVertex;
    /**
    * Backtracks from the final state to the original state.
    *
    * returns the path as a list, ie from start to goal.
    */
    function postProcess(order, finish) {
        var result = Array();
        for (var x = finish; x >= 0; x = order[x].previous) {
            result.unshift(order[x].action);
        }
        result.shift();
        return result;
    }
    Astar.postProcess = postProcess;
})(Astar || (Astar = {}));
/// <reference path="lib/collections.ts" />
/// <reference path="Astar.ts"/>
var IDAstar;
(function (IDAstar) {
    var result;
    function idaSearch(s) {
        console.log("Using IDAstar search...");
        result = [];
        var t = 0;
        while (t >= 0) {
            t = searchUntil(s.startVertex, s);
            s.visited.clear();
            s.bound = t;
        }
        return result;
    }
    IDAstar.idaSearch = idaSearch;
    // Returns negative value if found the solution.
    // Otherwise, returns minimum f-value of its successors.
    function searchUntil(node, s) {
        s.x = s.x + 1;
        if (s.x > s.maxIter) {
            throw new Planner.Error("Max iterations exceeded: " + s.x);
        }
        var est = node.cost + node.heur;
        if (est > s.bound)
            return est;
        if (s.isGoal(node.state))
            return -1;
        var neighbours = s.f(node.state);
        var min = Infinity;
        for (var n in neighbours) {
            var neighb = neighbours[n];
            var vn = Astar.neighbourVertex(s, node, neighb);
            if (s.multiPathPruning) {
                if (s.visited.contains(vn.state)) {
                    continue;
                }
                s.visited.add(vn.state);
            }
            var t = searchUntil(vn, s);
            if (t < 0) {
                result.unshift(vn.action);
                return t;
            }
            if (t < min) {
                min = t;
            }
        }
        return min;
    }
})(IDAstar || (IDAstar = {}));
var PositionErrorX = (function () {
    function PositionErrorX(message) {
        this.message = message;
        this.name = "PositionErrorX";
    }
    PositionErrorX.prototype.toString = function () {
        return this.name + ": " + this.message;
    };
    return PositionErrorX;
})();
// Ducktyping subtype of WorldState :)
// should be sufficient.
var State = (function () {
    function State(arm, holding, stacks) {
        this.arm = arm;
        this.holding = holding;
        this.stacks = stacks;
    }
    State.prototype.toString = function () {
        return collections.makeString(this);
    };
    return State;
})();
var ObjectPosition = (function () {
    function ObjectPosition(stackNo, heightNo, objectsAbove, isHeld, isFloor) {
        this.stackNo = stackNo;
        this.heightNo = heightNo;
        this.objectsAbove = objectsAbove;
        this.isHeld = isHeld;
        this.isFloor = isFloor;
    }
    return ObjectPosition;
})();
/**
* Returns true iff object `a` has relation `rel` with `b` in the world `s`.
*/
function isObjectInLocation(s, a, b, rel) {
    switch (rel) {
        case "holding":
            return s.holding === a;
        case "inside":
        case "ontop":
            return heightDifference(s, a, b) === 1;
        case "above":
            return heightDifference(s, a, b) > 0;
        case "under":
            return heightDifference(s, b, a) > 0;
        case "beside":
            return Math.abs(stackDifference(s, a, b)) === 1;
        case "leftof":
            return stackDifference(s, a, b) === -1;
        case "rightof":
            return stackDifference(s, a, b) === 1;
        default:
            throw new PositionErrorX("!!! Unimplemented relation in isObjectInLocation: " + rel);
    }
}
function computeObjectPosition(s, objA) {
    var stackA = -1;
    var heightA = -1;
    var aboveA = -1;
    if (objA != "floor") {
        for (var stackNo in s.stacks) {
            if (stackA > -1) {
                break;
            }
            var stack = s.stacks[stackNo];
            for (var height in stack) {
                if (stack[height] === objA) {
                    stackA = stackNo;
                    heightA = height;
                }
            }
        }
        if (stackA > -1) {
            aboveA = s.stacks[stackA].length - 1 - heightA;
        }
    }
    if (s.holding === objA) {
        stackA = s.arm;
        heightA = 0;
        aboveA = 0;
    }
    return new ObjectPosition(stackA, heightA, aboveA, s.holding === objA, objA === "floor");
}
/**
* Returns negative value if in different stacks.
* Otherwise, returns the number of objects in between.
* Is negative if b is above a.
*/
function heightDifference(s, above, below) {
    var a = computeObjectPosition(s, above);
    var b = computeObjectPosition(s, below);
    if (b.isHeld || a.isHeld) {
        return -1;
    }
    if (a.isFloor) {
        throw new PositionErrorX("heightDiff: Floor cannot be above anything... " + "Should never happen.");
    }
    if (b.isFloor) {
        // Dont touch this line!!! Becomes string concatenation otherwise...
        return (+a.heightNo) + 1;
    }
    if (a.stackNo == b.stackNo) {
        return a.heightNo - b.heightNo;
    }
    return -1;
}
/**
* Returns negative value if o2 is left of o1.
* Returns positive value if o2 is right of o1.
* Value is the difference in stacks (1 or -1 if in stacks beside each other, 0 if same stack).
*/
function stackDifference(s, o1, o2) {
    var a = computeObjectPosition(s, o1);
    var b = computeObjectPosition(s, o2);
    if (b.isHeld || a.isHeld) {
        return 0;
    }
    if (b.isFloor || a.isFloor) {
        throw new PositionErrorX("Floor should not be tested as beside anything?, at least not in this manner...");
        return 0;
    }
    return a.stackNo - b.stackNo;
}
///<reference path="World.ts"/>
///<reference path="Interpreter.ts"/>
///<reference path="Astar.ts"/>
///<reference path="Position.ts"/>
var Heuristics;
(function (Heuristics) {
    /**
    * @return heuristic function for Astar.
    */
    function computeHeuristicFunction(intprt) {
        return function (s) {
            var hValue = Infinity;
            for (var ix in intprt) {
                var hc = heuristicConjunctiveClause(s, intprt[ix]);
                if (hValue > hc) {
                    hValue = hc;
                }
            }
            // Return minimum heuristic value of the disjunction.
            return hValue;
        };
    }
    Heuristics.computeHeuristicFunction = computeHeuristicFunction;
    //////////////////////////////////////////////////////////////////////
    // (mostly) private functions
    function heuristicConjunctiveClause(s, c) {
        var hValue = 0;
        for (var ix in c) {
            var hc = heuristicAtom(s, c[ix]);
            if (hValue < hc) {
                hValue = hc;
            }
        }
        // Return maximum heuristic value of the conjuction.
        return hValue;
    }
    // Returns heuristic value for this atom.
    // `atom.pol` is interpreted as negation, however, in the current code it is
    // always true: there is no grammar for negation as of yet.
    function heuristicAtom(s, atom) {
        switch (atom.rel) {
            case "holding":
                var target = atom.args[0];
                if (atom.pol) {
                    return heuristicGrab(s, target);
                }
                if (s.holding === target) {
                    return 1;
                }
                // Already done
                return 0;
            case "inside":
            case "ontop":
            case "above":
                var target = atom.args[0];
                var below = atom.args[1];
                if (atom.pol) {
                    return heuristicMoveOntop(s, target, below, atom.rel != "above");
                }
                // Same heuristic as for grabbing the target.
                return heuristicGrab(s, target);
            case "beside":
                var target = atom.args[0];
                var beside = atom.args[1];
                var rightSide = heuristicMoveLeftOf(s, beside, target);
                var leftSide = heuristicMoveLeftOf(s, target, beside);
                return min(rightSide, leftSide);
            case "leftof":
                var target = atom.args[0];
                var leftof = atom.args[1];
                return heuristicMoveLeftOf(s, target, leftof);
            case "rightof":
                var target = atom.args[0];
                var rightof = atom.args[1];
                return heuristicMoveLeftOf(s, rightof, target);
            default:
                throw new Planner.Error("!!! Unimplemented relation in heuristicAtom: " + atom.rel);
                return 0;
        }
        return 0;
    }
    // a should be leftof b.
    function heuristicMoveLeftOf(s, target, leftof) {
        var a = computeObjectPosition(s, target);
        var b = computeObjectPosition(s, leftof);
        var moveA = heuristicMoveToStack(s, a, b.stackNo - 1);
        var moveB = heuristicMoveToStack(s, b, a.stackNo + 1);
        // Move one of them to the other?
        return min(moveA, moveB);
    }
    /**
    * The heuristic cost of moving object `a` to the top of stackNo `stack`.
    */
    function heuristicMoveToStack(s, a, stack) {
        if (stack < 0 || stack >= s.stacks.length) {
            return Infinity;
        }
        if (a.stackNo === stack) {
            return 0;
        }
        // clear the way so can grab the object.
        var aboveCost = a.objectsAbove * 4;
        // move the arm to `a`
        // then move the arm to the correct stack
        var armCost = abs(a.stackNo - s.arm) + abs(a.stackNo - stack);
        if (!a.isHeld) {
            // pick up the object
            armCost = armCost + 1;
        }
        var stackObj = { stackNo: stack, heightNo: -1, objectsAbove: 0, isHeld: false, isFloor: false };
        // +1 for dropping the object or
        // if holding something else, drop that first.
        var holdCost = dropCost(s, a, stackObj, false);
        return aboveCost + armCost + holdCost;
    }
    function heuristicMoveOntop(s, above, below, exactlyOntop) {
        var somewhereAbove = !exactlyOntop;
        var a = computeObjectPosition(s, above);
        var b = computeObjectPosition(s, below);
        var holdCost = dropCost(s, a, b, exactlyOntop);
        var armCost = abs(s.arm - a.stackNo) + abs(a.stackNo - b.stackNo);
        // Number of objects that needs to be moved.
        var aboveCost;
        if (exactlyOntop) {
            if (a.stackNo === b.stackNo) {
                aboveCost = 4 * max(a.objectsAbove, b.objectsAbove);
            }
            else {
                aboveCost = 4 * (a.objectsAbove + b.objectsAbove);
            }
        }
        else {
            aboveCost = 4 * a.objectsAbove;
        }
        return holdCost + armCost + aboveCost;
    }
    /**
    * Wants to drop `a` on or above `b`.
    * Computes the heuristic cost of dropping whatever object the arm is currently holding.
    */
    function dropCost(s, a, b, exactlyOntop) {
        var somewhereAbove = !exactlyOntop;
        if (s.holding == null) {
            return 0;
        }
        else if (a.isHeld && s.arm == b.stackNo && (somewhereAbove || b.objectsAbove == 0)) {
            // Just drop `a` and we are done
            return 1;
        }
        else if (b.isHeld && s.arm != a.stackNo) {
            // Drop `b` here so it doesn't block `a`
            return 1;
        }
        else if (s.arm != b.stackNo && s.arm != a.stackNo) {
            // We are holding something else and we should drop it here
            // so it doesn't block `a` or `b`
            return 1;
        }
        else if (s.arm == b.stackNo && exactlyOntop && b.objectsAbove > 0) {
            // Drop somewhere else and come back to continue clearing the stack.
            return 3;
        }
        else if ((!a.isHeld) && s.arm == a.stackNo) {
            // Drop somewhere else and come back to get `a`.
            return 3;
        }
        // Drop somewhere else but go get `a`,
        // ie, don't return directly to the stack of `b`.
        return 2;
    }
    // Computes the expected number of actions to grab an object
    function heuristicGrab(s, target) {
        if (s.holding === target) {
            return 0;
        }
        var holdCost = 0;
        if (s.holding != null) {
            holdCost = 1;
        }
        if (target === "floor") {
            throw new Planner.Error("!!! Error in heuristicGrab: The Interpreter should never allow this to happen!");
        }
        for (var stackNo in s.stacks) {
            var stack = s.stacks[stackNo];
            for (var height in stack) {
                if (stack[height] === target) {
                    var objectsAbove = stack.length - 1 - height;
                    return abs(stackNo - s.arm) + 4 * objectsAbove + holdCost;
                }
            }
        }
        throw new Planner.Error("!!! Error in heuristicGrab: must be able to find the target somewhere in the world...");
    }
    ///////////////////////////////////////////////////////
    // Helper functions
    function max(a, b) {
        if (a > b) {
            return a;
        }
        return b;
    }
    function min(a, b) {
        if (a < b) {
            return a;
        }
        return b;
    }
    function abs(a) {
        if (a < 0) {
            return -a;
        }
        return a;
    }
})(Heuristics || (Heuristics = {}));
///<reference path="World.ts"/>
///<reference path="Interpreter.ts"/>
///<reference path="IDAstar.ts"/>
///<reference path="Astar.ts"/>
///<reference path="Heuristics.ts"/>
///<reference path="Position.ts"/>
var Planner;
(function (Planner) {
    //////////////////////////////////////////////////////////////////////
    // exported functions, classes and interfaces/types
    function plan(interpretations, currentState) {
        var plans = [];
        interpretations.forEach(function (intprt) {
            var plan = intprt;
            plan.plan = planInterpretation(plan.intp, currentState);
            plans.push(plan);
        });
        if (plans.length) {
            // if plans.length > 1 take the shortest one :)
            // Dont modify here; instead work on Shrdlite
            return plans;
        }
        else {
            throw new Planner.Error("Found no plans");
        }
    }
    Planner.plan = plan;
    function planToString(res) {
        return res.plan.join(", ");
    }
    Planner.planToString = planToString;
    var Error = (function () {
        function Error(message) {
            this.message = message;
            this.name = "Planner.Error";
        }
        Error.prototype.toString = function () {
            return this.name + ": " + this.message;
        };
        return Error;
    })();
    Planner.Error = Error;
    //////////////////////////////////////////////////////////////////////
    // private functions
    var worldDictionary = null;
    function planInterpretation(intprt, state) {
        worldDictionary = state.objects;
        var goal = computeGoalFunction(intprt);
        var heur = Heuristics.computeHeuristicFunction(intprt);
        var start = new State(state.arm, state.holding, state.stacks);
        console.log(" ");
        var search = new Astar.Search(start, neighbours, heur, goal);
        // var plan : string[] = IDAstar.idaSearch(search);
        var plan = Astar.astarSearch(search);
        var len = plan.length;
        plan.unshift("Completed in " + search.x + " iterations.");
        plan.unshift("This plan has " + len + " actions.");
        return plan;
    }
    /**
    * @return goal function for IDAstar.
    */
    function computeGoalFunction(intprt) {
        return function (s) {
            for (var ix in intprt) {
                if (testConjunctiveClause(s, intprt[ix])) {
                    return true;
                }
            }
            // None of them is true
            return false;
        };
    }
    function testConjunctiveClause(s, c) {
        for (var ix in c) {
            if (!testAtom(s, c[ix])) {
                return false;
            }
        }
        // They are all true
        return true;
    }
    function testAtom(s, atom) {
        var a = atom.args[0];
        var b = atom.args[1]; // Doesnt matter if b is undefined here...
        var result = isObjectInLocation(s, a, b, atom.rel);
        if (atom.pol) {
            return result;
        }
        else {
            return !result;
        }
    }
    function neighbours(s) {
        var result = [];
        var numStacks = s.stacks.length;
        if (s.arm > 0) {
            // Can move left
            result.push(performAction("l", s));
        }
        if (s.arm < numStacks - 1) {
            // Can move right
            result.push(performAction("r", s));
        }
        if (s.holding == null) {
            if (s.stacks[s.arm].length > 0) {
                // Can pick up
                result.push(performAction("p", s));
            }
        }
        else {
            var currStack = s.stacks[s.arm];
            if (currStack.length > 0) {
                var head = currStack[currStack.length - 1];
                if (canSupport(s.holding, head)) {
                    // Can drop here
                    result.push(performAction("d", s));
                }
            }
            else {
                // Floor
                result.push(performAction("d", s));
            }
        }
        return result;
    }
    function performAction(action, state) {
        var newState = cloneState(state);
        switch (action) {
            case "l":
                newState.arm = state.arm - 1;
                break;
            case "r":
                newState.arm = state.arm + 1;
                break;
            case "p":
                newState.holding = newState.stacks[newState.arm].pop();
                break;
            case "d":
                newState.stacks[newState.arm].push(newState.holding);
                newState.holding = null;
                break;
            default:
                throw new Planner.Error("ERROR: unknown action " + action);
                return undefined;
        }
        return { state: newState, action: action, transitionCost: 1 };
    }
    function canSupport(above, below) {
        var objA = worldDictionary[above];
        var objB = worldDictionary[below];
        return Interpreter.canSupport(objA, objB);
    }
    //////////////////////////////////////////////////////////////////////
    // Basic helper functions
    function cloneState(s) {
        var rs = [];
        for (var i in s.stacks) {
            rs.push(s.stacks[i].slice());
        }
        return new State(s.arm, s.holding, rs);
    }
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
})(Planner || (Planner = {}));
///<reference path="World.ts"/>
///<reference path="Parser.ts"/>
///<reference path="Interpreter.ts"/>
///<reference path="Planner.ts"/>
var Shrdlite;
(function (Shrdlite) {
    function interactive(world) {
        function endlessLoop(utterance) {
            if (utterance === void 0) { utterance = ""; }
            var inputPrompt = "What can I do for you today? ";
            // Clearing up after this prompt
            world.currentState.status = [];
            world.currentState.ambiguousObjs = [[]];
            var nextInput = function () { return world.readUserInput(inputPrompt, endlessLoop); };
            if (utterance.trim()) {
                try {
                    var plan = splitStringIntoPlan(utterance);
                    if (!plan) {
                        plan = parseUtteranceIntoPlan(world, utterance);
                    }
                    if (plan) {
                        world.printDebugInfo("Plan: " + plan.join(", "));
                        world.performPlan(plan, nextInput);
                        return;
                    }
                }
                catch (err) {
                    if (err instanceof Interpreter.Ambiguity) {
                        var question = "Do you mean ";
                        var index = world.currentState.ambiguousObjs.length - 1;
                        if (index != 0) {
                            index = 1; // always refine from head !
                        }
                        world.currentState.ambiguousObjs[index].forEach(function (obj) {
                            question = question + Parser.objToString(obj) + " ? ";
                        });
                        // clear up status or we will always come back here
                        world.currentState.status = [];
                        world.currentState.ambiguousObjs = [[]];
                        nextInput = function () { return world.readUserInput(question, endlessLoop); };
                    }
                    else {
                        throw err;
                    }
                }
            }
            nextInput();
        }
        world.printWorld(endlessLoop);
    }
    Shrdlite.interactive = interactive;
    // Generic function that takes an utterance and returns a plan:
    // - first it parses the utterance
    // - then it interprets the parse(s)
    // - then it creates plan(s) for the interpretation(s)
    function mergeCmd(world, previousCmd, utterance) {
        try {
            var parses = Parser.parse(utterance);
        }
        catch (err) {
            if (err instanceof Parser.Error) {
                var newInfo = utterance.toLowerCase().replace(/\W/g, "");
                var newResult = [];
                var index = previousCmd.length - 1;
                switch (newInfo) {
                    case "small":
                    case "tiny": {
                        if (!previousCmd[index].prs.ent.obj.size) {
                            previousCmd[index].prs.ent.obj.size = "small";
                            newResult.push(previousCmd[index]);
                            return newResult;
                        }
                        else {
                            return previousCmd;
                        }
                    }
                    case "large":
                    case "big": {
                        if (!previousCmd[index].prs.ent.obj.size) {
                            previousCmd[index].prs.ent.obj.size = "large";
                            newResult.push(previousCmd[index]);
                            return newResult;
                        }
                        else {
                            return previousCmd;
                        }
                    }
                    case "black":
                    case "white":
                    case "green":
                    case "yellow":
                    case "red":
                    case "blue": {
                        if (!previousCmd[index].prs.ent.obj.color) {
                            previousCmd[index].prs.ent.obj.color = newInfo;
                            newResult.push(previousCmd[index]);
                            return newResult;
                        }
                        else {
                            return previousCmd;
                        }
                    }
                    case "brick":
                    case "box":
                    case "plank":
                    case "pyramid":
                    case "table":
                    case "ball": {
                        if (previousCmd[index].prs.ent.obj.form == "anyform") {
                            previousCmd[index].prs.ent.obj.form = newInfo;
                            newResult.push(previousCmd[index]);
                            return newResult;
                        }
                        else {
                            return previousCmd;
                        }
                    }
                    default:
                        return previousCmd;
                }
            }
            else {
                throw err;
            }
        }
        return parses;
    }
    function parseUtteranceIntoPlan(world, utterance) {
        world.printDebugInfo('Parsing utterance: "' + utterance + '"');
        if (world.currentState.previousCmd !== null) {
            var index = world.currentState.previousCmd.length - 1;
            world.printSystemOutput("I've remembered you said: " + world.currentState.previousCmd[index].input);
            // since .input never gets updated; now seems bit silly
            var parses = mergeCmd(world, world.currentState.previousCmd, utterance);
        }
        else {
            try {
                var parses = Parser.parse(utterance);
            }
            catch (err) {
                if (err instanceof Parser.Error) {
                    world.printError("Parsing error", err.message);
                    return;
                }
                else {
                    throw err;
                }
            }
        }
        world.printDebugInfo("Found " + parses.length + " parses");
        parses.forEach(function (res, n) {
            world.printDebugInfo("  (" + n + ") " + Parser.parseToString(res));
        });
        try {
            var interpretations = Interpreter.interpret(parses, world.currentState);
        }
        catch (err) {
            if (err instanceof Interpreter.Error) {
                world.printError("Interpretation error", err.message);
                return;
            }
            else {
                throw err;
            }
        }
        //world.printDebugInfo(world.currentState.status);
        world.currentState.status.forEach(function (status) {
            if (status === "softambiguity") {
                throw new Interpreter.Ambiguity();
            }
            if (status === "multiValidInterpret") {
                world.printSystemOutput("There are multiple valid interpretation");
                world.printSystemOutput("But I am lazy and only performs minimum plan");
                // clean up for multiValidInterpret
                world.currentState.status = [];
            }
        });
        world.printDebugInfo("Found " + interpretations.length + " interpretations");
        interpretations.forEach(function (res, n) {
            world.printDebugInfo("  (" + n + ") " + Interpreter.interpretationToString(res));
        });
        try {
            var plans = Planner.plan(interpretations, world.currentState);
        }
        catch (err) {
            if (err instanceof Planner.Error) {
                world.printError("Planning error", err.message);
                return;
            }
            else {
                throw err;
            }
        }
        world.printDebugInfo("Found " + plans.length + " plans");
        var shortestPlan = plans[0].plan;
        plans.forEach(function (res, n) {
            if (res.plan.length < shortestPlan.length) {
                shortestPlan = res.plan;
            }
            ;
            world.printDebugInfo("  (" + n + ") " + Planner.planToString(res));
        });
        //var plan : string[] = plans[0].plan;
        //world.printDebugInfo("Final plan: " + plan.join(", "));
        //return plan;
        world.printDebugInfo("Final plan: " + shortestPlan.join(", "));
        return shortestPlan;
    }
    Shrdlite.parseUtteranceIntoPlan = parseUtteranceIntoPlan;
    // This is a convenience function that recognizes strings
    // of the form "p r r d l p r d"
    function splitStringIntoPlan(planstring) {
        var plan = planstring.trim().split(/\s+/);
        var actions = { p: "pick", d: "drop", l: "left", r: "right" };
        for (var i = plan.length - 1; i >= 0; i--) {
            if (!actions[plan[i]]) {
                return;
            }
            plan.splice(i, 0, actions[plan[i]]);
        }
        return plan;
    }
    Shrdlite.splitStringIntoPlan = splitStringIntoPlan;
})(Shrdlite || (Shrdlite = {}));
///<reference path="World.ts"/>
///<reference path="lib/jquery.d.ts" />
var SVGWorld = (function () {
    function SVGWorld(currentState, useSpeech) {
        var _this = this;
        if (useSpeech === void 0) { useSpeech = false; }
        this.currentState = currentState;
        this.useSpeech = useSpeech;
        //////////////////////////////////////////////////////////////////////
        // Public constants that can be played around with
        this.dialogueHistory = 100; // max nr. utterances
        this.floorThickness = 10; // pixels
        this.wallSeparation = 4; // pixels
        this.armSize = 0.2; // of stack width
        this.animationPause = 0.01; // seconds
        this.promptPause = 0.5; // seconds
        this.ajaxTimeout = 5; // seconds
        this.armSpeed = 1000; // pixels per second
        // There is no way of setting male/female voice,
        // so this is one way of having different voices for user/system:
        this.voices = {
            "system": { "lang": "en-GB", "rate": 1.1 },
            "user": { "lang": "en-US" }
        };
        // HTML id's for different containers
        this.containers = {
            world: $('#theworld'),
            dialogue: $('#dialogue'),
            inputform: $('#dialogue form'),
            userinput: $('#dialogue form input:text'),
            inputexamples: $('#dialogue form select')
        };
        this.svgNS = 'http://www.w3.org/2000/svg';
        //////////////////////////////////////////////////////////////////////
        // Object types
        this.objectData = {
            brick: { small: { width: 0.30, height: 0.30 }, large: { width: 0.70, height: 0.60 } },
            plank: { small: { width: 0.60, height: 0.10 }, large: { width: 1.00, height: 0.15 } },
            ball: { small: { width: 0.30, height: 0.30 }, large: { width: 0.70, height: 0.70 } },
            pyramid: { small: { width: 0.60, height: 0.25 }, large: { width: 1.00, height: 0.40 } },
            box: { small: { width: 0.60, height: 0.30, thickness: 0.10 }, large: { width: 1.00, height: 0.40, thickness: 0.10 } },
            table: { small: { width: 0.60, height: 0.30, thickness: 0.10 }, large: { width: 1.00, height: 0.40, thickness: 0.10 } }
        };
        if (!this.currentState.arm)
            this.currentState.arm = 0;
        if (this.currentState.holding)
            this.currentState.holding = null;
        this.canvasWidth = this.containers.world.width() - 2 * this.wallSeparation;
        this.canvasHeight = this.containers.world.height() - this.floorThickness;
        var dropdown = this.containers.inputexamples;
        dropdown.empty();
        dropdown.append($('<option value="">').text("(Select an example utterance)"));
        $.each(this.currentState.examples, function (i, value) {
            dropdown.append($('<option>').text(value));
        });
        dropdown.change(function () {
            var userinput = dropdown.val().trim();
            if (userinput) {
                _this.containers.userinput.val(userinput).focus();
            }
        });
        this.containers.inputform.submit(function () { return _this.handleUserInput.call(_this); });
        this.disableInput();
    }
    //////////////////////////////////////////////////////////////////////
    // Public methods
    SVGWorld.prototype.readUserInput = function (prompt, callback) {
        this.printSystemOutput(prompt);
        this.enableInput();
        this.inputCallback = callback;
    };
    SVGWorld.prototype.printSystemOutput = function (output, participant, utterance) {
        if (participant === void 0) { participant = "system"; }
        if (utterance == undefined) {
            utterance = output;
        }
        var dialogue = this.containers.dialogue;
        if (dialogue.children().length > this.dialogueHistory) {
            dialogue.children().first().remove();
        }
        $('<p>').attr("class", participant).text(output).insertBefore(this.containers.inputform);
        dialogue.scrollTop(dialogue.prop("scrollHeight"));
        if (this.useSpeech && utterance && /^\w/.test(utterance)) {
            try {
                // W3C Speech API (works in Chrome and Safari)
                var speech = new SpeechSynthesisUtterance(utterance);
                for (var attr in this.voices[participant]) {
                    speech[attr] = this.voices[participant][attr];
                }
                console.log("SPEAKING: " + utterance);
                window.speechSynthesis.speak(speech);
            }
            catch (err) {
            }
        }
    };
    SVGWorld.prototype.printDebugInfo = function (info) {
        console.log(info);
    };
    SVGWorld.prototype.printError = function (error, message) {
        console.error(error, message);
        if (message) {
            error += ": " + message;
        }
        this.printSystemOutput(error, "error");
    };
    SVGWorld.prototype.printWorld = function (callback) {
        this.containers.world.empty();
        this.printSystemOutput("Please wait while I populate the world.");
        var viewBox = [0, 0, this.canvasWidth + 2 * this.wallSeparation, this.canvasHeight + this.floorThickness];
        var svg = $(this.SVG('svg')).attr({
            viewBox: viewBox.join(' '),
            width: viewBox[2],
            height: viewBox[3]
        }).appendTo(this.containers.world);
        // The floor:
        $(this.SVG('rect')).attr({
            x: 0,
            y: this.canvasHeight,
            width: this.canvasWidth + 2 * this.wallSeparation,
            height: this.canvasHeight + this.floorThickness,
            fill: 'black'
        }).appendTo(svg);
        // The arm:
        $(this.SVG('line')).attr({
            id: 'arm',
            x1: this.stackWidth() / 2,
            y1: this.armSize * this.stackWidth() - this.canvasHeight,
            x2: this.stackWidth() / 2,
            y2: this.armSize * this.stackWidth(),
            stroke: 'black',
            'stroke-width': this.armSize * this.stackWidth()
        }).appendTo(svg);
        var timeout = 0;
        for (var stacknr = 0; stacknr < this.currentState.stacks.length; stacknr++) {
            for (var objectnr = 0; objectnr < this.currentState.stacks[stacknr].length; objectnr++) {
                var objectid = this.currentState.stacks[stacknr][objectnr];
                this.makeObject(svg, objectid, stacknr, timeout);
                timeout += this.animationPause;
            }
        }
        if (callback) {
            setTimeout(callback, (timeout + this.promptPause) * 1000);
        }
    };
    SVGWorld.prototype.performPlan = function (plan, callback) {
        var _this = this;
        if (this.isSpeaking()) {
            setTimeout(function () { return _this.performPlan(plan, callback); }, this.animationPause * 1000);
            return;
        }
        var planctr = 0;
        var performNextAction = function () {
            planctr++;
            if (plan && plan.length) {
                var item = plan.shift().trim();
                var action = _this.getAction(item);
                if (action) {
                    try {
                        action.call(_this, performNextAction);
                    }
                    catch (err) {
                        _this.printError(err);
                        if (callback)
                            setTimeout(callback, _this.promptPause * 1000);
                    }
                }
                else {
                    if (item && item[0] != "#") {
                        if (_this.isSpeaking()) {
                            plan.unshift(item);
                            setTimeout(performNextAction, _this.animationPause * 1000);
                        }
                        else {
                            _this.printSystemOutput(item);
                            performNextAction();
                        }
                    }
                    else {
                        performNextAction();
                    }
                }
            }
            else {
                if (callback)
                    setTimeout(callback, _this.promptPause * 1000);
            }
        };
        performNextAction();
    };
    SVGWorld.prototype.stackWidth = function () {
        return this.canvasWidth / this.currentState.stacks.length;
    };
    SVGWorld.prototype.boxSpacing = function () {
        return Math.min(5, this.stackWidth() / 20);
    };
    SVGWorld.prototype.SVG = function (tag) {
        return document.createElementNS(this.svgNS, tag);
    };
    SVGWorld.prototype.animateMotion = function (object, path, timeout, duration) {
        if (path instanceof Array) {
            path = path.join(" ");
        }
        var animation = this.SVG('animateMotion');
        $(animation).attr({
            begin: 'indefinite',
            fill: 'freeze',
            path: path,
            dur: duration + "s"
        }).appendTo(object);
        animation.beginElementAt(timeout);
        return animation;
    };
    //////////////////////////////////////////////////////////////////////
    // The basic actions: left, right, pick, drop
    SVGWorld.prototype.getAction = function (act) {
        var actions = { p: this.pick, d: this.drop, l: this.left, r: this.right };
        return actions[act.toLowerCase()];
    };
    SVGWorld.prototype.left = function (callback) {
        if (this.currentState.arm <= 0) {
            throw "Already at left edge!";
        }
        this.horizontalMove(this.currentState.arm - 1, callback);
    };
    SVGWorld.prototype.right = function (callback) {
        if (this.currentState.arm >= this.currentState.stacks.length - 1) {
            throw "Already at right edge!";
        }
        this.horizontalMove(this.currentState.arm + 1, callback);
    };
    SVGWorld.prototype.drop = function (callback) {
        if (!this.currentState.holding) {
            throw "Not holding anything!";
        }
        this.verticalMove('drop', callback);
        this.currentState.stacks[this.currentState.arm].push(this.currentState.holding);
        this.currentState.holding = null;
    };
    SVGWorld.prototype.pick = function (callback) {
        if (this.currentState.holding) {
            throw "Already holding something!";
        }
        this.currentState.holding = this.currentState.stacks[this.currentState.arm].pop();
        this.verticalMove('pick', callback);
    };
    //////////////////////////////////////////////////////////////////////
    // Moving around
    SVGWorld.prototype.horizontalMove = function (newArm, callback) {
        var xArm = this.currentState.arm * this.stackWidth() + this.wallSeparation;
        var xNewArm = newArm * this.stackWidth() + this.wallSeparation;
        var path1 = ["M", xArm, 0, "H", xNewArm];
        var duration = Math.abs(xNewArm - xArm) / this.armSpeed;
        var arm = $('#arm');
        this.animateMotion(arm, path1, 0, duration);
        if (this.currentState.holding) {
            var objectHeight = this.getObjectDimensions(this.currentState.holding).heightadd;
            var yArm = -(this.canvasHeight - this.armSize * this.stackWidth() - objectHeight);
            var path2 = ["M", xArm, yArm, "H", xNewArm];
            var object = $("#" + this.currentState.holding);
            this.animateMotion(object, path2, 0, duration);
        }
        this.currentState.arm = newArm;
        if (callback)
            setTimeout(callback, (duration + this.animationPause) * 1000);
        return;
    };
    SVGWorld.prototype.verticalMove = function (action, callback) {
        var altitude = this.getAltitude(this.currentState.arm);
        var objectHeight = this.getObjectDimensions(this.currentState.holding).heightadd;
        var yArm = this.canvasHeight - altitude - this.armSize * this.stackWidth() - objectHeight;
        var yStack = -altitude;
        var xArm = this.currentState.arm * this.stackWidth() + this.wallSeparation;
        var path1 = ["M", xArm, 0, "V", yArm];
        var path2 = ["M", xArm, yArm, "V", 0];
        var duration = (Math.abs(yArm)) / this.armSpeed;
        var arm = $('#arm');
        var object = $("#" + this.currentState.holding);
        this.animateMotion(arm, path1, 0, duration);
        this.animateMotion(arm, path2, duration + this.animationPause, duration);
        if (action == 'pick') {
            var path3 = ["M", xArm, yStack, "V", yStack - yArm];
            this.animateMotion(object, path3, duration + this.animationPause, duration);
        }
        else {
            var path3 = ["M", xArm, yStack - yArm, "V", yStack];
            this.animateMotion(object, path3, 0, duration);
        }
        if (callback)
            setTimeout(callback, 2 * (duration + this.animationPause) * 1000);
    };
    //////////////////////////////////////////////////////////////////////
    // Methods for getting information about objects 
    SVGWorld.prototype.getObjectDimensions = function (objectid) {
        var attrs = this.currentState.objects[objectid];
        var size = this.objectData[attrs.form][attrs.size];
        var width = size.width * (this.stackWidth() - this.boxSpacing());
        var height = size.height * (this.stackWidth() - this.boxSpacing());
        var thickness = size.thickness * (this.stackWidth() - this.boxSpacing());
        var heightadd = attrs.form == 'box' ? thickness : height;
        return {
            width: width,
            height: height,
            heightadd: heightadd,
            thickness: thickness
        };
    };
    SVGWorld.prototype.getAltitude = function (stacknr, objectid) {
        var stack = this.currentState.stacks[stacknr];
        var altitude = 0;
        for (var i = 0; i < stack.length; i++) {
            if (objectid == stack[i])
                break;
            altitude += this.getObjectDimensions(stack[i]).heightadd + this.boxSpacing();
        }
        return altitude;
    };
    //////////////////////////////////////////////////////////////////////
    // Creating objects
    SVGWorld.prototype.makeObject = function (svg, objectid, stacknr, timeout) {
        var attrs = this.currentState.objects[objectid];
        var altitude = this.getAltitude(stacknr, objectid);
        var dim = this.getObjectDimensions(objectid);
        var ybottom = this.canvasHeight - this.boxSpacing();
        var ytop = ybottom - dim.height;
        var ycenter = (ybottom + ytop) / 2;
        var yradius = (ybottom - ytop) / 2;
        var xleft = (this.stackWidth() - dim.width) / 2;
        var xright = xleft + dim.width;
        var xcenter = (xright + xleft) / 2;
        var xradius = (xright - xleft) / 2;
        var xmidleft = (xcenter + xleft) / 2;
        var xmidright = (xcenter + xright) / 2;
        var object;
        switch (attrs.form) {
            case 'brick':
            case 'plank':
                object = $(this.SVG('rect')).attr({
                    x: xleft,
                    y: ytop,
                    width: dim.width,
                    height: dim.height
                });
                break;
            case 'ball':
                object = $(this.SVG('ellipse')).attr({
                    cx: xcenter,
                    cy: ycenter,
                    rx: xradius,
                    ry: yradius
                });
                break;
            case 'pyramid':
                var points = [xleft, ybottom, xmidleft, ytop, xmidright, ytop, xright, ybottom];
                object = $(this.SVG('polygon')).attr({
                    points: points.join(" ")
                });
                break;
            case 'box':
                var points = [xleft, ytop, xleft, ybottom, xright, ybottom, xright, ytop, xright - dim.thickness, ytop, xright - dim.thickness, ybottom - dim.thickness, xleft + dim.thickness, ybottom - dim.thickness, xleft + dim.thickness, ytop];
                object = $(this.SVG('polygon')).attr({
                    points: points.join(" ")
                });
                break;
            case 'table':
                var points = [xleft, ytop, xright, ytop, xright, ytop + dim.thickness, xmidright, ytop + dim.thickness, xmidright, ybottom, xmidright - dim.thickness, ybottom, xmidright - dim.thickness, ytop + dim.thickness, xmidleft + dim.thickness, ytop + dim.thickness, xmidleft + dim.thickness, ybottom, xmidleft, ybottom, xmidleft, ytop + dim.thickness, xleft, ytop + dim.thickness];
                object = $(this.SVG('polygon')).attr({
                    points: points.join(" ")
                });
                break;
        }
        object.attr({
            id: objectid,
            stroke: 'black',
            'stroke-width': this.boxSpacing() / 2,
            fill: attrs.color
        });
        object.appendTo(svg);
        var path = ["M", stacknr * this.stackWidth() + this.wallSeparation, -(this.canvasHeight + this.floorThickness)];
        this.animateMotion(object, path, 0, 0);
        path.push("V", -altitude);
        this.animateMotion(object, path, timeout, 0.5);
    };
    //////////////////////////////////////////////////////////////////////
    // Methods for handling user input and system output
    SVGWorld.prototype.enableInput = function () {
        this.containers.inputexamples.prop('disabled', false).val('');
        this.containers.inputexamples.find("option:first").attr('selected', 'selected');
        this.containers.userinput.prop('disabled', false);
        this.containers.userinput.focus().select();
    };
    SVGWorld.prototype.disableInput = function () {
        this.containers.inputexamples.blur();
        this.containers.inputexamples.prop('disabled', true);
        this.containers.userinput.blur();
        this.containers.userinput.prop('disabled', true);
    };
    SVGWorld.prototype.handleUserInput = function () {
        var userinput = this.containers.userinput.val().trim();
        this.disableInput();
        this.printSystemOutput(userinput, "user");
        this.inputCallback(userinput);
        return false;
    };
    SVGWorld.prototype.isSpeaking = function () {
        return this.useSpeech && window && window.speechSynthesis && window.speechSynthesis.speaking;
    };
    return SVGWorld;
})();
///<reference path="World.ts"/>
var ExampleWorlds = {};
ExampleWorlds["complex"] = {
    "stacks": [["e"], ["a", "l"], ["i", "h", "j"], ["c", "k", "g", "b"], ["d", "m", "f"]],
    "holding": null,
    "arm": 0,
    "objects": {
        "a": { "form": "brick", "size": "large", "color": "yellow" },
        "b": { "form": "brick", "size": "small", "color": "white" },
        "c": { "form": "plank", "size": "large", "color": "red" },
        "d": { "form": "plank", "size": "small", "color": "green" },
        "e": { "form": "ball", "size": "large", "color": "white" },
        "f": { "form": "ball", "size": "small", "color": "black" },
        "g": { "form": "table", "size": "large", "color": "blue" },
        "h": { "form": "table", "size": "small", "color": "red" },
        "i": { "form": "pyramid", "size": "large", "color": "yellow" },
        "j": { "form": "pyramid", "size": "small", "color": "red" },
        "k": { "form": "box", "size": "large", "color": "yellow" },
        "l": { "form": "box", "size": "large", "color": "red" },
        "m": { "form": "box", "size": "small", "color": "blue" }
    },
    "examples": [
        "put an object that is under a box on a plank",
        "put the green plank left of the large brick",
        "put the red plank above the red box",
        "put the box beside a pyramid",
        "put a box in a box",
        "take the yellow box",
        "put a ball in a small box in a large box"
    ],
    "status": [],
    "ambiguousObjs": [[]],
    "previousCmd": null
};
ExampleWorlds["medium"] = {
    "stacks": [["e"], ["a", "l"], [], [], ["i", "h", "j"], [], [], ["k", "g", "c", "b"], [], ["d", "m", "f"]],
    "holding": null,
    "arm": 0,
    "objects": {
        "a": { "form": "brick", "size": "large", "color": "green" },
        "b": { "form": "brick", "size": "small", "color": "white" },
        "c": { "form": "plank", "size": "large", "color": "red" },
        "d": { "form": "plank", "size": "small", "color": "green" },
        "e": { "form": "ball", "size": "large", "color": "white" },
        "f": { "form": "ball", "size": "small", "color": "black" },
        "g": { "form": "table", "size": "large", "color": "blue" },
        "h": { "form": "table", "size": "small", "color": "red" },
        "i": { "form": "pyramid", "size": "large", "color": "yellow" },
        "j": { "form": "pyramid", "size": "small", "color": "red" },
        "k": { "form": "box", "size": "large", "color": "yellow" },
        "l": { "form": "box", "size": "large", "color": "red" },
        "m": { "form": "box", "size": "small", "color": "blue" }
    },
    "examples": [
        "put the brick that is to the left of a pyramid in a box",
        "put the white ball in a box on the floor",
        "move the large ball inside a yellow box on the floor",
        "move the large ball inside a red box on the floor",
        "take a red object",
        "take the white ball",
        "put the large plank under the blue brick"
    ],
    "status": [],
    "ambiguousObjs": [[]],
    "previousCmd": null
};
ExampleWorlds["small"] = {
    "stacks": [["e"], ["g", "l"], [], ["k"], ["m", "f"]],
    "holding": "a",
    "arm": 0,
    "objects": {
        "a": { "form": "brick", "size": "large", "color": "green" },
        "b": { "form": "brick", "size": "small", "color": "white" },
        "c": { "form": "plank", "size": "large", "color": "red" },
        "d": { "form": "plank", "size": "small", "color": "green" },
        "e": { "form": "ball", "size": "large", "color": "black" },
        "f": { "form": "ball", "size": "small", "color": "black" },
        "g": { "form": "table", "size": "large", "color": "blue" },
        "h": { "form": "table", "size": "small", "color": "red" },
        "i": { "form": "pyramid", "size": "large", "color": "yellow" },
        "j": { "form": "pyramid", "size": "small", "color": "red" },
        "k": { "form": "box", "size": "large", "color": "yellow" },
        "l": { "form": "box", "size": "large", "color": "red" },
        "m": { "form": "box", "size": "small", "color": "blue" }
    },
    "examples": [
        "put the ball on the floor",
        "put the small ball in a box on the floor",
        "put the black ball in a box on the floor",
        "take a blue object",
    ],
    "status": [],
    "ambiguousObjs": [[]],
    "previousCmd": null
};
ExampleWorlds["impossible"] = {
    "stacks": [["lbrick1", "lball1", "sbrick1"], [], ["lpyr1", "lbox1", "lplank2", "sball2"], [], ["sbrick2", "sbox1", "spyr1", "ltable1", "sball1"]],
    "holding": null,
    "arm": 0,
    "objects": {
        "lbrick1": { "form": "brick", "size": "large", "color": "green" },
        "sbrick1": { "form": "brick", "size": "small", "color": "yellow" },
        "sbrick2": { "form": "brick", "size": "small", "color": "blue" },
        "lplank1": { "form": "plank", "size": "large", "color": "red" },
        "lplank2": { "form": "plank", "size": "large", "color": "black" },
        "splank1": { "form": "plank", "size": "small", "color": "green" },
        "lball1": { "form": "ball", "size": "large", "color": "white" },
        "sball1": { "form": "ball", "size": "small", "color": "black" },
        "sball2": { "form": "ball", "size": "small", "color": "red" },
        "ltable1": { "form": "table", "size": "large", "color": "green" },
        "stable1": { "form": "table", "size": "small", "color": "red" },
        "lpyr1": { "form": "pyramid", "size": "large", "color": "white" },
        "spyr1": { "form": "pyramid", "size": "small", "color": "blue" },
        "lbox1": { "form": "box", "size": "large", "color": "yellow" },
        "sbox1": { "form": "box", "size": "small", "color": "red" },
        "sbox2": { "form": "box", "size": "small", "color": "blue" }
    },
    "examples": [
        "this is just an impossible world"
    ],
    "status": [],
    "ambiguousObjs": [[]],
    "previousCmd": null
};
///<reference path="Shrdlite.ts"/>
///<reference path="SVGWorld.ts"/>
///<reference path="ExampleWorlds.ts"/>
///<reference path="lib/jquery.d.ts" />
var defaultWorld = 'small';
var defaultSpeech = false;
$(function () {
    var current = getURLParameter('world');
    if (!(current in ExampleWorlds)) {
        current = defaultWorld;
    }
    var speech = (getURLParameter('speech') || "").toLowerCase();
    var useSpeech = (speech == 'true' || speech == '1' || defaultSpeech);
    $('#currentworld').text(current);
    $('<a>').text('reset').attr('href', '?world=' + current + '&speech=' + useSpeech).appendTo($('#resetworld'));
    $('#otherworlds').empty();
    for (var wname in ExampleWorlds) {
        if (wname !== current) {
            $('<a>').text(wname).attr('href', '?world=' + wname + '&speech=' + useSpeech).appendTo($('#otherworlds')).after(' ');
        }
    }
    $('<a>').text(useSpeech ? 'turn off' : 'turn on').attr('href', '?world=' + current + '&speech=' + (!useSpeech)).appendTo($('#togglespeech'));
    var world = new SVGWorld(ExampleWorlds[current], useSpeech);
    Shrdlite.interactive(world);
});
// Adapted from: http://www.openjs.com/scripts/events/exit_confirmation.php
function goodbye(e) {
    if (!e)
        e = window.event;
    // e.cancelBubble is supported by IE - this will kill the bubbling process.
    e.cancelBubble = true;
    // This is displayed in the dialog:
    e.returnValue = 'Are you certain?\nYou cannot undo this, you know.';
    // e.stopPropagation works in Firefox.
    if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
    }
}
window.onbeforeunload = goodbye;
// Adapted from: http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
function getURLParameter(sParam) {
    var sPageURL = window.location.search.slice(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}
