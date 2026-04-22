/*!
 * dom-navigator - v1.1.0 - 2026-04-22
 *
 * https://github.com/rmariuzzo/dom-navigator
 * Copyright (c) 2014, 2026 Rubens Mariuzzo Licensed MIT
 */
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return factory(window.jQuery);
        });
    } else {
        // Browser globals
        factory(window.jQuery);
    }
})(function ($) {

    'use strict';

    /* Utilities methods. */

    /**
     * Extend one or more object properties.
     *
     * @param {Object} out
     * @returns {Object}
     */

    var _this5 = this;

    function extend(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i]) {
                continue;
            }

            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    out[key] = arguments[i][key];
                }
            }
        }

        return out;
    }

    /**
     * Add a class name to an element.
     *
     * @param {Element} el The element.
     * @param {string} className The class.
     */
    function addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    }

    /**
     * Remove a class from an element.
     *
     * @param {Element} el The element.
     * @param {string} className The class.
     */
    function removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    /**
     * Unbox an object from jQuery or an array.
     *
     * @param {jQuery|Array|Element} obj The object to unbox.
     *
     * @return {Element} An element.
     */
    function unboxElement(obj) {
        if (obj.jquery || Array.isArray(obj)) {
            return obj[0];
        }
        return obj;
    }

    /**
     * Indicates if a given element is fully visible in the viewport.
     *
     * @param {Element} el The element to check.
     *
     * @return {Boolean} True if the given element is fully visible in the viewport, otherwise false.
     */
    function inViewport(el) {
        var rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;
    }

    /**
     * Return the absolute offset top of an element.
     *
     * @param el {Element} The element.
     *
     * @return {Number} The offset top.
     */
    function absoluteOffsetTop(el) {
        var offsetTop = 0;
        do {
            if (!isNaN(el.offsetTop)) {
                offsetTop += el.offsetTop;
            }
        } while (el = el.offsetParent);
        return offsetTop;
    }

    /**
     * Return the absolute offset left of an element.
     *
     * @param el {Element} The element.
     *
     * @return {Number} The offset left.
     */
    function absoluteOffsetLeft(el) {
        var offsetLeft = 0;
        do {
            if (!isNaN(el.offsetLeft)) {
                offsetLeft += el.offsetLeft;
            }
        } while (el = el.offsetParent);
        return offsetLeft;
    }

    /* Class definition. */

    var DomNavigator = function () {
        _createClass(DomNavigator, null, [{
            key: 'DIRECTION',


            /**
             * Directions.
             *
             * @returns {{left: string, up: string, right: string, down: string}}
             * @constructor
             */
            get: function get() {
                return {
                    left: 'left',
                    up: 'up',
                    right: 'right',
                    down: 'down'
                };
            }

            /**
             * Navigation modes.
             *
             * @returns {{auto: string, horizontal: string, vertical: string, grid: string}}
             * @constructor
             */

        }, {
            key: 'MODE',
            get: function get() {
                return {
                    auto: 'auto',
                    horizontal: 'horizontal',
                    vertical: 'vertical',
                    grid: 'grid'
                };
            }

            /**
             * Default options.
             *
             * @returns {{mode: string, selected: string, left: number, up: number, right: number, down: number, cols: number}}
             * @constructor
             */

        }, {
            key: 'DEFAULTS',
            get: function get() {
                return {
                    mode: DomNavigator.MODE.auto,
                    selected: 'selected',
                    left: 37,
                    up: 38,
                    right: 39,
                    down: 40,
                    tab: 9,
                    cols: 0,
                    autofocus: false
                };
            }

            /**
             * Create a new DOM Navigator.
             *
             * @param container {Element} The container of the element to navigate.
             * @param options {Object} The options to configure the DOM navigator.
             *
             * @return void.
             */

        }]);

        function DomNavigator(container, options) {
            _classCallCheck(this, DomNavigator);

            this.$doc = window.document;
            this.$container = container;
            this.$options = extend({}, DomNavigator.DEFAULTS, options);
            this.init();
        }

        /**
         * Initialize the navigator.
         */


        _createClass(DomNavigator, [{
            key: 'init',
            value: function init() {
                this.validateOptions();
                this.$selected = null;
                this.$keydownHandler = null;

                // Create hotkeys map.
                this.$keys = {};
                this.$keys[this.$options.left] = this.left;
                this.$keys[this.$options.up] = this.up;
                this.$keys[this.$options.right] = this.right;
                this.$keys[this.$options.down] = this.down;
                this.$keys[this.$options.tab] = this.tab;

                // Calculate cols if needed for grid mode.
                if (this.$options.mode === DomNavigator.MODE.grid && !this.$options.cols) {
                    var els = this.elements();
                    var count = [];
                    for (var i = 0; i < els.length; i++) {
                        if (i > 0 && count[i - 1] !== els[i].offsetTop) {
                            break;
                        }
                        count[i] = els[i].offsetTop;
                    }
                    this.$options.cols = count.length;
                }

                this.enable();
            }

            /**
             * Validate current options.
             *
             * @return void.
             */

        }, {
            key: 'validateOptions',
            value: function validateOptions() {
                var validMode = false;
                for (var m in DomNavigator.MODE) {
                    validMode = validMode || this.$options.mode === DomNavigator.MODE[m];
                }
                if (!validMode) {
                    throw new Error('Unsupported navigation mode: ' + this.$options.mode);
                }
            }

            /**
             * Enable this navigator.
             *
             * @return void.
             */

        }, {
            key: 'enable',
            value: function enable() {
                var self = this;
                this.$keydownHandler = function (event) {
                    self.handleKeydown.call(self, event);
                };
                this.$doc.addEventListener('keydown', this.$keydownHandler);
            }

            /**
             * Disable this navigator.
             *
             * @return void.
             */

        }, {
            key: 'disable',
            value: function disable() {
                if (this.$keydownHandler) {
                    this.$doc.removeEventListener('keydown', this.$keydownHandler);
                }
            }

            /**
             * Destroy this navigator removing any event registered and any other data.
             *
             * @return void.
             */

        }, {
            key: 'destroy',
            value: function destroy() {
                this.disable();
                if (this.$container.domNavigator) {
                    delete this.$container.domNavigator;
                }
            }

            /**
             * Navigate left to the next element if any.
             *
             * @return void.
             */

        }, {
            key: 'left',
            value: function left() {
                var _this = this;

                var next = null;

                switch (this.$options.mode) {

                    case DomNavigator.MODE.auto:
                        if (!this.$selected && !this.$options.autofocus) {
                            next = this.elements()[0];
                            break;
                        }
                        if (!this.$selected && this.$options.autofocus) {
                            this.$selected = document.activeElement;
                        }
                        if (this.$options.autofocus && this.$selected.dataset.domNavigatorLeft) {
                            next = document.querySelector(this.$selected.dataset.domNavigatorLeft);
                            break;
                        }

                        var left = this.$selected.offsetLeft;
                        var width = this.$selected.offsetWidth;
                        var top = this.$selected.offsetTop;
                        var height = this.$selected.offsetHeight;

                        next = this.elements().filter(function (el) {
                            //at least to the left
                            return el.offsetLeft < _this.$selected.offsetLeft && (
                            //non-disabled (when we care)
                            !_this.$options.autofocus || !el.disabled);
                        })
                        //closest
                        .reduce(this.closest.bind(null, top, left, height, width), {
                            distance: Infinity
                        });
                        next = next.element;
                        break;

                    case DomNavigator.MODE.horizontal:
                        if (!this.$selected) {
                            next = this.elements()[0];
                            break;
                        }

                        next = this.$selected.previousElementSibling;
                        break;

                    case DomNavigator.MODE.vertical:
                        break;

                    case DomNavigator.MODE.grid:
                        if (!this.$selected) {
                            next = this.elements()[0];
                            break;
                        }

                        var index = this.elements().indexOf(this.$selected);
                        if (index % this.$options.cols !== 0) {
                            next = this.$selected.previousElementSibling;
                        }

                        break;
                }

                this.select(next, DomNavigator.DIRECTION.left);
            }

            /**
             * Navigate up to the next element if any.
             *
             * @return void.
             */

        }, {
            key: 'up',
            value: function up() {
                var _this2 = this;

                var next = null;

                switch (this.$options.mode) {

                    case DomNavigator.MODE.auto:
                        if (!this.$selected && !this.$options.autofocus) {
                            next = this.elements()[0];
                            break;
                        }
                        if (!this.$selected && this.$options.autofocus) {
                            this.$selected = document.activeElement;
                        }
                        if (this.$options.autofocus && this.$selected.dataset.domNavigatorUp) {
                            next = document.querySelector(this.$selected.dataset.domNavigatorUp);
                            break;
                        }

                        var left = this.$selected.offsetLeft;
                        var width = this.$selected.offsetWidth;
                        var top = this.$selected.offsetTop;
                        var height = this.$selected.offsetHeight;

                        next = this.elements().filter(function (el) {
                            //at least above
                            return el.offsetTop < _this2.$selected.offsetTop && (
                            //non-disabled (when we care)
                            !_this2.$options.autofocus || !el.disabled);
                        })
                        //closest
                        .reduce(this.closest.bind(null, top, left, height, width), {
                            distance: Infinity
                        });
                        next = next.element;
                        break;

                    case DomNavigator.MODE.horizontal:
                        break;

                    case DomNavigator.MODE.vertical:
                        if (!this.$selected) {
                            next = this.elements()[0];
                            break;
                        }

                        next = this.$selected.previousElementSibling;
                        break;

                    case DomNavigator.MODE.grid:
                        if (!this.$selected) {
                            next = this.elements()[0];
                            break;
                        }

                        next = this.$selected;
                        for (var i = 0; i < this.$options.cols; i++) {
                            next = next && next.previousElementSibling;
                        }

                        break;
                }

                this.select(next, DomNavigator.DIRECTION.up);
            }

            /**
             * Navigate right to the next element if any.
             *
             * @return void.
             */

        }, {
            key: 'right',
            value: function right() {
                var _this3 = this;

                var next = null;

                switch (this.$options.mode) {

                    case DomNavigator.MODE.auto:
                        if (!this.$selected && !this.$options.autofocus) {
                            next = this.elements()[0];
                            break;
                        }
                        if (!this.$selected && this.$options.autofocus) {
                            this.$selected = document.activeElement;
                        }
                        if (this.$options.autofocus && this.$selected.dataset.domNavigatorRight) {
                            next = document.querySelector(this.$selected.dataset.domNavigatorRight);
                            break;
                        }

                        var left = this.$selected.offsetLeft;
                        var width = this.$selected.offsetWidth;
                        var top = this.$selected.offsetTop;
                        var height = this.$selected.offsetHeight;

                        next = this.elements().filter(function (el) {
                            //at least to the right
                            return el.offsetLeft > _this3.$selected.offsetLeft && (
                            //non-disabled (when we care)
                            !_this3.$options.autofocus || !el.disabled);
                        })
                        //closest
                        .reduce(this.closest.bind(null, top, left, height, width), {
                            distance: Infinity
                        });
                        next = next.element;
                        break;

                    case DomNavigator.MODE.horizontal:
                        if (!this.$selected) {
                            next = this.elements()[0];
                            break;
                        }

                        next = this.$selected.nextElementSibling;
                        break;

                    case DomNavigator.MODE.vertical:
                        break;

                    case DomNavigator.MODE.grid:
                        if (!this.$selected) {
                            next = this.elements()[0];
                            break;
                        }

                        var index = this.elements().indexOf(this.$selected);
                        if (index === 0 || (index + 1) % this.$options.cols !== 0) {
                            next = this.$selected.nextElementSibling;
                        }

                        break;
                }

                this.select(next, DomNavigator.DIRECTION.right);
            }

            /**
             * Navigate down to the next element if any.
             */

        }, {
            key: 'down',
            value: function down() {
                var _this4 = this;

                var next = null;

                switch (this.$options.mode) {

                    case DomNavigator.MODE.auto:
                        if (!this.$selected && !this.$options.autofocus) {
                            next = this.elements()[0];
                            break;
                        }
                        if (!this.$selected && this.$options.autofocus) {
                            this.$selected = document.activeElement;
                        }
                        if (this.$options.autofocus && this.$selected.dataset.domNavigatorDown) {
                            next = document.querySelector(this.$selected.dataset.domNavigatorDown);
                            break;
                        }

                        var left = this.$selected.offsetLeft;
                        var width = this.$selected.offsetWidth;
                        var top = this.$selected.offsetTop;
                        var height = this.$selected.offsetHeight;

                        next = this.elements().filter(function (el) {
                            //at least below
                            return el.offsetTop > _this4.$selected.offsetTop && (
                            //non-disabled (when we care)
                            !_this4.$options.autofocus || !el.disabled);
                        })
                        //closest
                        .reduce(this.closest.bind(null, top, left, height, width), {
                            distance: Infinity
                        });
                        next = next.element;
                        break;

                    case DomNavigator.MODE.horizontal:
                        break;

                    case DomNavigator.MODE.vertical:
                        if (!this.$selected) {
                            next = this.elements()[0];
                            break;
                        }

                        next = this.$selected.nextElementSibling;
                        break;

                    case DomNavigator.MODE.grid:
                        if (!this.$selected) {
                            next = this.elements()[0];
                            break;
                        }

                        next = this.$selected;
                        for (var i = 0; i < this.$options.cols; i++) {
                            next = next && next.nextElementSibling;
                        }

                        break;
                }

                this.select(next, DomNavigator.DIRECTION.down);
            }
        }, {
            key: 'tab',
            value: function tab(e) {
                var focusableSelectors = ['a[href]', 'button:not([disabled])', 'input:not([disabled])', 'textarea:not([disabled])', 'select:not([disabled])', '[tabindex]:not([tabindex="-1"])'];

                var focusable = Array.from(document.querySelectorAll(focusableSelectors.join(','))).filter(function (el) {
                    return el.offsetParent !== null;
                }); // visible only

                var current = document.activeElement;
                var index = focusable.indexOf(current);

                var nextIndex = void 0;

                if (e.shiftKey) {
                    // Shift + Tab → backward
                    nextIndex = index <= 0 ? focusable.length - 1 : index - 1;
                } else {
                    // Tab → forward
                    nextIndex = index === focusable.length - 1 ? 0 : index + 1;
                }

                this.select(focusable[nextIndex]);
            }
        }, {
            key: 'closest',
            value: function closest(top, left, height, width, prev, curr) {
                var currDistance = Math.abs(top - curr.offsetTop) + Math.abs(left - curr.offsetLeft);
                //isn't closer
                if (currDistance > prev.distance) {
                    return prev;
                }
                return {
                    distance: currDistance,
                    element: curr
                };
            }

            /**
             * Return the selected DOM element.
             *
             * @return {Element} The selected DOM element.
             */

        }, {
            key: 'selected',
            value: function selected() {
                return this.$selected;
            }

            /**
             * Select the given element.
             *
             * @param {Element} el The DOM element to select.
             * @param {string} direction The direction.
             * @return void
             */

        }, {
            key: 'select',
            value: function select(el, direction) {

                // Is there an element or is it selected?
                if (!el || el === this.$selected) {
                    return; // Nothing to do here.
                }
                el = unboxElement(el);

                // Unselect previous element.
                if (this.$selected) {
                    removeClass(this.$selected, this.$options.selected);
                    if (this.$options.autofocus) {
                        this.$selected.blur();
                    }
                }

                // Scroll to given element.
                this.scrollTo(el, direction);

                // Select given element.
                addClass(el, this.$options.selected);
                this.$selected = el;
                if (this.$options.autofocus) {
                    this.$selected.focus();
                }
            }

            /**
             * Scroll the container to an element.
             *
             * @param el {Element} The destination element.
             * @param direction {String} The direction of the current navigation.
             *
             * @return void.
             */

        }, {
            key: 'scrollTo',
            value: function scrollTo(el, direction) {
                el = unboxElement(el);
                if (!this.inContainerViewport(el)) {
                    switch (direction) {
                        case DomNavigator.DIRECTION.left:
                            this.$container.scrollLeft = el.offsetLeft - this.$container.offsetLeft;
                            break;
                        case DomNavigator.DIRECTION.up:
                            this.$container.scrollTop = el.offsetTop - this.$container.offsetTop;
                            break;
                        case DomNavigator.DIRECTION.right:
                            this.$container.scrollLeft = el.offsetLeft - this.$container.offsetLeft - (this.$container.offsetWidth - el.offsetWidth);
                            break;
                        case DomNavigator.DIRECTION.down:
                            this.$container.scrollTop = el.offsetTop - this.$container.offsetTop - (this.$container.offsetHeight - el.offsetHeight);
                            break;
                    }
                } else if (!inViewport(el)) {
                    switch (direction) {
                        case DomNavigator.DIRECTION.left:
                            document.body.scrollLeft = absoluteOffsetLeft(el) - document.body.offsetLeft;
                            break;
                        case DomNavigator.DIRECTION.up:
                            document.body.scrollTop = absoluteOffsetTop(el) - document.body.offsetTop;
                            break;
                        case DomNavigator.DIRECTION.right:
                            document.body.scrollLeft = absoluteOffsetLeft(el) - document.body.offsetLeft - (document.documentElement.clientWidth - el.offsetWidth);
                            break;
                        case DomNavigator.DIRECTION.down:
                            document.body.scrollTop = absoluteOffsetTop(el) - document.body.offsetTop - (document.documentElement.clientHeight - el.offsetHeight);
                            break;
                    }
                }
            }

            /**
             * Indicate if an element is in the container viewport.
             *
             * @param el {Element} The element to check.
             *
             * @return {Boolean} true if the given element is in the container viewport, otherwise false.
             */

        }, {
            key: 'inContainerViewport',
            value: function inContainerViewport(el) {
                el = unboxElement(el);
                // Check on left side.
                if (el.offsetLeft - this.$container.scrollLeft < this.$container.offsetLeft) {
                    return false;
                }
                // Check on top side.
                if (el.offsetTop - this.$container.scrollTop < this.$container.offsetTop) {
                    return false;
                }
                // Check on right side.
                if (el.offsetLeft + el.offsetWidth - this.$container.scrollLeft > this.$container.offsetLeft + this.$container.offsetWidth) {
                    return false;
                }
                // Check on down side.
                if (el.offsetTop + el.offsetHeight - this.$container.scrollTop > this.$container.offsetTop + this.$container.offsetHeight) {
                    return false;
                }
                return true;
            }

            /**
             * Return an array of the navigable elements.
             *
             * @return {Array} An array of elements.
             */

        }, {
            key: 'elements',
            value: function elements() {
                var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

                if (container === null) {
                    container = this.$container;
                }
                var children = [];
                for (var i = container.children.length; i--;) {
                    // Skip comment nodes on IE8
                    if (container.children[i].nodeType === 8) {
                        continue;
                    }
                    if (container.children[i].dataset.domNavigatorRecursive === "true") {
                        children.unshift.apply(children, _toConsumableArray(this.elements(container.children[i])));
                        continue;
                    }
                    children.unshift(container.children[i]);
                }
                return children;
            }

            /**
             * Return an array of navigable elements after an offset.
             *
             * @param {number} left The left offset.
             * @param {number} top The top offset.
             *
             * @return {Array} An array of elements.
             */

        }, {
            key: 'elementsAfter',
            value: function elementsAfter(left, top) {
                return this.elements().filter(function (el) {
                    return el.offsetLeft >= left && el.offsetTop >= top;
                });
            }

            /**
             * Return an array of navigable elements before an offset.
             *
             * @param {number} left The left offset.
             * @param {number} top The top offset.
             *
             * @return {Array} An array of elements.
             */

        }, {
            key: 'elementsBefore',
            value: function elementsBefore(left, top) {
                return this.elements().filter(function (el) {
                    return el.offsetLeft <= left && el.offsetTop <= top;
                });
            }

            /**
             * Handle the key down event.
             *
             * @param {Event} event The event object.
             *
             * @return void.
             */

        }, {
            key: 'handleKeydown',
            value: function handleKeydown(event) {
                if (this.$selected && ['INPUT'].includes(this.$selected.nodeName) && ['INPUT'].includes(document.activeElement)) {
                    this.$selected = null;return;
                }
                if (this.$keys[event.which]) {
                    event.preventDefault();
                    this.$keys[event.which].call(this, event);
                }
            }
        }]);

        return DomNavigator;
    }();

    /* Export DomNavigator class */

    window.DomNavigator = DomNavigator;

    /* jQuery plugin definition */

    if ($) {

        var old = $.fn.domNavigator;

        $.fn.domNavigator = function (method) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            // Parse arguments.
            var retval = void 0;

            this.each(function (i, el) {

                // Create DomNavigator instance.
                if (!el.domNavigator) {
                    el.domNavigator = new DomNavigator(el, (typeof method === 'undefined' ? 'undefined' : _typeof(method)) === 'object' && method);
                }

                // Invoke given method with given arguments.
                if (typeof method === 'string' && el.domNavigator[method]) {
                    retval = el.domNavigator[method].apply(el.domNavigator, args);
                }
            });

            if (retval === undefined) {
                retval = this;
            }

            return retval;
        };

        /* Expose constructor. */

        $.fn.domNavigator.Constructor = DomNavigator;

        /* jQuery plugin no conflict. */

        $.fn.domNavigator.noConflict = function () {
            $.fn.domNavigator = old;
            return _this5;
        };
    }
});
