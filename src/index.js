export class SuDialog {

    constructor(options) {
        if (typeof SuDialog.uid$3 === 'undefined') {
            SuDialog.uid$3 = 2000;
        }
        this.inBrowser = typeof window !== 'undefined';
        this._init(options);
    }

    _init(options) {
        this._uid = SuDialog.uid$3;
        SuDialog.uid$3 = SuDialog.uid$3 + 3;
        this.$options = this._deepExtend({
            sdsd: 's孙东升'
        }, options || {});
        if (this.$options.el) {
            this._mount(this.$options.el);
        }
    }

    _deepExtend(destination, source) {
        for (let property in source) {
            if (source[property] && source[property].constructor && source[property].constructor === Object) {
                destination[property] = destination[property] || {};
                this._deepExtend(destination[property], source[property]);
            } else {
                destination[property] = source[property];
            }
        }
        return destination;
    }

    _mount(el) {
        let vm = this;
        // wrapper
        this.$wrapper = el && this.inBrowser ? this._query(el) : undefined;
        this.$wrapper.classList.add('su-dialog__wrapper');
        this.$wrapper.innerHTML = '' +
            '<div class="su-dialog">\n' +
            '    <div class="su-dialog__header"></div>\n' +
            '    <div class="su-dialog__content"></div>\n' +
            '    <div class="su-dialog__footer"></div>\n' +
            '    <div class="su-dialog__resize">\n' +
            '        <div class="su-dialog__resize-top"></div>\n' +
            '        <div class="su-dialog__resize-left"></div>\n' +
            '        <div class="su-dialog__resize-left-top"></div>\n' +
            '        <div class="su-dialog__resize-right-top"></div>\n' +
            '        <div class="su-dialog__resize-left-bottom"></div>\n' +
            '        <div class="su-dialog__resize-right"></div>\n' +
            '        <div class="su-dialog__resize-bottom"></div>\n' +
            '        <div class="su-dialog__resize-right-bottom"></div>\n' +
            '    </div>\n' +
            '</div>\n' +
            '<div class="su-dialog__mask"></div>\n' +
            '<div class="su-dialog__proxy"></div>';
        this.$wrapper.style.zIndex = this._uid + 2;

        this.$dialog = this._query('.su-dialog', this.$wrapper);
        if (this.$options.style) {
            for (let key in this.$options.style) {
                this.$dialog.style[key] = this.$options.style[key];
            }
        }
        let rect = this.$dialog.getBoundingClientRect();
        this.$dialog.style.top = 'calc((100% - ' + rect.height + 'px) / 2)';
        this.$dialog.style.left = 'calc((100% - ' + rect.width + 'px) / 2)';
        this.$dialog.style.zIndex = this._uid + 2;

        this.$dialog.querySelector('.su-dialog__header').innerHTML = this.$options.title || '';

        this.$dialog.querySelector('.su-dialog__content').innerHTML = this.$options.content || '';

        (this.$options.buttons || []).forEach((but) => {
            let $button = document.createElement('button');
            $button.classList.add('su-dialog__footer-button');
            $button.title = but.text;
            $button.innerHTML = but.text;
            $button.onclick = but.handler;
            this.$dialog.querySelector('.su-dialog__footer').appendChild($button);
        });

        this.$title = this._query('.su-dialog__header', this.$dialog);

        this.$resize = this._query('.su-dialog__resize', this.$wrapper);

        this.$mask = this._query('.su-dialog__mask', this.$wrapper);
        this.$mask.style.zIndex = this._uid;

        this.$proxy = this._query('.su-dialog__proxy', this.$wrapper);
        this.$proxy.style.zIndex = this._uid + 1;
        return this._initEvents();
    }

    _query(el, $parent) {
        if (typeof el === 'string') {
            let selected = ($parent || document).querySelector(el);
            /*if (!selected) {
                console.warn('Cannot find element: ' + el);
                return document.createElement('div');
            }*/
            return selected;
        } else {
            return el;
        }
    }

    _initEvents() {
        let vm = this;
        if (typeof this._data === 'undefined') {
            this._data = {
                left: 0,
                top: 0,
                dragging: false
            };
        }

        const downFn = function (event) {
                let trect = vm.$title.getBoundingClientRect();
                let drect = vm.$dialog.getBoundingClientRect();
                vm._data.top = event.clientY - trect.top;
                vm._data.left = event.clientX - trect.left;
                vm.$proxy.style.display = 'block';
                vm.$proxy.style.top = drect.top + 'px';
                vm.$proxy.style.left = drect.left + 'px';
                vm.$proxy.style.width = drect.width + 'px';
                vm.$proxy.style.height = drect.height + 'px';
            },
            moveFn = function (event) {
                let rect = vm.$dialog.getBoundingClientRect();

                let left = event.clientX - vm._data.left;
                left = Math.min(left, vm.$wrapper.clientWidth - rect.width);
                left = Math.max(0, left);
                vm.$proxy.style.left = left + 'px';

                let top = event.clientY - vm._data.top;
                top = Math.min(top, vm.$wrapper.clientHeight - rect.height);
                top = Math.max(0, top);
                vm.$proxy.style.top = top + 'px';
            },
            upFn = function () {
                document.removeEventListener('mousedown', downFn);
                document.removeEventListener('mousemove', moveFn);
                document.removeEventListener('mouseup', upFn);
                document.onselectstart = null;
                document.ondragstart = null;
                vm._data.top = 0;
                vm._data.left = 0;
                vm._data.dragging = false;
                let rect = vm.$proxy.getBoundingClientRect();
                vm.$dialog.style.left = rect.left + 'px';
                vm.$dialog.style.top = rect.top + 'px';
                vm.$proxy.style.display = 'none';
            };

        vm.$wrapper.querySelectorAll('.su-dialog__resize>div').forEach(($el) => {
            $el.addEventListener('mousedown', function (event) {
                let rect = vm.$dialog.getBoundingClientRect(),
                    _options = {
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height,
                        clientX: 0,
                        clientY: 0,
                        current: ''
                    };
                for (let i = 0; i < $el.classList.length; i++) {
                    let cla = $el.classList[i].replace('su-dialog__resize-', '');
                    if (cla) {
                        _options.current = cla;
                        break;
                    }
                }

                function down(e1) {
                    _options.clientX = e1.clientX;
                    _options.clientY = e1.clientY;
                }

                function move(e2) {
                    let width = _options.width;
                    if (-1 != _options.current.indexOf('left')) {
                        width = _options.width + (_options.clientX - Math.max(0, e2.clientX));
                    }
                    if (-1 != _options.current.indexOf('right')) {
                        width = _options.width + (Math.min(vm.$wrapper.clientWidth, e2.clientX) - _options.clientX);
                    }
                    width = Math.min(vm.$wrapper.clientWidth, width);
                    width = Math.max(200, width);
                    vm.$dialog.style.width = width + 'px';
                    if (-1 != _options.current.indexOf('left')) {
                        vm.$dialog.style.left = Math.max(0, _options.left - (width - _options.width)) + 'px';
                    }

                    let height = _options.height;
                    if (-1 != _options.current.indexOf('top')) {
                        height = _options.height + (_options.clientY - Math.max(0, e2.clientY));
                    }
                    if (-1 != _options.current.indexOf('bottom')) {
                        height = _options.height + (Math.min(vm.$wrapper.clientHeight, e2.clientY) - _options.clientY);
                    }
                    height = Math.min(vm.$wrapper.clientHeight, height);
                    height = Math.max(200, height);
                    vm.$dialog.style.height = height + 'px';
                    if (-1 != _options.current.indexOf('top')) {
                        vm.$dialog.style.top = Math.max(0, _options.top - (height - _options.height)) + 'px';
                    }
                }

                function up() {
                    document.removeEventListener('mousedown', down);
                    document.removeEventListener('mousemove', move);
                    document.removeEventListener('mouseup', up);
                    document.onselectstart = null;
                    document.ondragstart = null;
                }

                document.onselectstart = function () {
                    return false;
                };
                document.ondragstart = function () {
                    return false;
                };
                document.addEventListener('mousedown', down);
                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', up);
            });
        });

        vm.$title.addEventListener('mousedown', function (event) {
            if (vm._data.dragging) {
                return false;
            }
            vm._data.top = 0;
            vm._data.left = 0;
            vm._data.dragging = true;

            document.onselectstart = function () {
                return false;
            };
            document.ondragstart = function () {
                return false;
            };
            document.addEventListener('mousedown', downFn);
            document.addEventListener('mousemove', moveFn);
            document.addEventListener('mouseup', upFn);
        });

        return this;
    }

}