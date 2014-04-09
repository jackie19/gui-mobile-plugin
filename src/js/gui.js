/**
 * Created by cgx on 14-4-8.
 */

(function (window, undefined) {

    function sub(str, data) {
        //模板
        return str.replace(/{(.*?)}/igm, function ($, $1) {
            //                return data[$1] ? data[$1] : '';
            return data[$1] || '';
        });
    }

    /********from coffee*************/
    var __super,
        __hasProp = {}.hasOwnProperty,
        __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key)) child[key] = parent[key];
            }
            if (typeof parent === 'object') return;

            function Ctor() {
                this.constructor = child;
            }

            child.Init = function (o) {
                this.init(o);
            };
            child.__super__ = Ctor.prototype = parent.prototype;
            child.fn = child.Init.prototype = child.prototype = new Ctor();
            return child;
        };
    /************************/
    __super = (function () {
        function __super() {
        }

        __super.prototype.init = function (o) {
            this.init(o);
        };
        return __super;
    })();

// 更新：
// 05.27: 1、保证回调执行顺序：error > ready > load；2、回调函数this指向img本身
// 04-02: 1、增加图片完全加载后的回调 2、提高性能
    /**
     * 图片头数据加载就绪事件 - 更快获取图片尺寸
     * @version  2011.05.27
     * @author  TangBin
     * @see    http://www.planeart.cn/?p=1121
     * @param  {String}  图片路径
     * @param  {Function}  尺寸就绪
     * @param  {Function}  加载完毕 (可选)
     * @param  {Function}  加载错误 (可选)
     * @example imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function () {
    alert('size ready: width=' + this.width + '; height=' + this.height);
  });
     */
    var imgReady = (function () {
        var list = [], intervalId = null,

        // 用来执行队列
            tick = function () {
                var i = 0;
                for (; i < list.length; i++) {
                    list[i].end ? list.splice(i--, 1) : list[i]();
                }
                !list.length && stop();
            },

        // 停止所有定时器队列
            stop = function () {
                clearInterval(intervalId);
                intervalId = null;
            };

        return function (url, ready, load, error) {
            var onready, width, height, newWidth, newHeight,
                img = new Image();

            img.src = url;

            // 如果图片被缓存，则直接返回缓存数据
            if (img.complete) {
                ready.call(img);
                load && load.call(img);
                return;
            }

            width = img.width;
            height = img.height;

            // 加载错误后的事件
            img.onerror = function () {
                error && error.call(img);
                onready.end = true;
                img = img.onload = img.onerror = null;
            };

            // 图片尺寸就绪
            onready = function () {
                newWidth = img.width;
                newHeight = img.height;
                if (newWidth !== width || newHeight !== height ||
                    // 如果图片已经在其他地方加载可使用面积检测
                    newWidth * newHeight > 1024
                    ) {
                    ready.call(img);
                    onready.end = true;
                }
            };
            onready();

            // 完全加载完毕的事件
            img.onload = function () {
                // onload在定时器时间差范围内可能比onready快
                // 这里进行检查并保证onready优先执行
                !onready.end && onready();

                load && load.call(img);

                // IE gif动画会循环执行onload，置空onload即可
                img = img.onload = img.onerror = null;
            };

            // 加入队列中定期执行
            if (!onready.end) {
                list.push(onready);
                // 无论何时只允许出现一个定时器，减少浏览器性能损耗
                if (intervalId === null) intervalId = setInterval(tick, 40);
            }
        };
    })();
    /**********imgReady**************/

    /*confirm************************/
    var mobileConfirm;

    mobileConfirm = (function (_super) {
        __extends(mobileConfirm, _super);

        function mobileConfirm(o) {
            return new mobileConfirm.Init(o);
        }

        __extends(mobileConfirm.fn, {
            init: function (options) {
                var opts,
                    htmlTpl = '<div class="ui-mask" data-role="footer" date-position="fixed"></div>' +
                        '<div class="ui-confirm" data-role="footer" date-position="fixed">' +
                        '<header class="ui-confirm-header"> ' +
                        '<div class="ui-title"></div>' +
                        '</header>' +
                        '<div class="ui-confirm-content"></div>' +
                        '<footer class="ui-confirm-footer ui-confirm-btngroup ui-grid">' +
                        '<a class="ui-btn ui-block cancel" > <span class="ui-btn-inner"> <span class="ui-btn-txt">取消</span></span></a>' +
                        '<a class="ui-btn ui-block ok"> <span class="ui-btn-inner"> <span class="ui-btn-txt">确定</span></span></a>' +
                        '</footer>' +
                        '</div>';
                var _this = this;

                if (options) {
                    opts = $.extend({ }, $.mobileConfirm_defaults, options);
                } else {
                    return;
                }

                if (!_this.$self) {
                    _this.$self = $(htmlTpl);
                    if (opts.baseConentExtend) {
                        _this.$self.css('visibility', 'hidden');
                    } else {
                        _this.$self.hide();
                    }
                    $(opts.appendTo).append(_this.$self);
                    _this.mask = $(_this.$self[0]);
                    _this.confirm = $(_this.$self[1]);
                    _this.setPos(_this);
                    _this.btn = $('.ui-btn', _this.$self);
                    _this.content = $('.ui-confirm-content', _this.$self);
                    _this.header = $('.ui-confirm-header', _this.$self);
                    _this.footer = $('.ui-confirm-footer', _this.$self);
                    _this._unbind = true;
                    _this.speed = 1;
                }

                if (!opts.title) {
                    _this.header.hide();
                } else {
                    _this.setTitle(opts.title, _this);
                }

                if (!opts.footer) {
                    _this.footer.hide();
                }
                _this.callback = opts.callback;
//                set content
                _this.setContent(opts.content, _this);

                //bind btn
                _this.bind(opts, _this);

                if (!options.abletouchmove) {
                    document.addEventListener('touchmove', _this.handle, false);
                }
                return _this;
            },

            bind: function (opts, _this) {

                if (this._unbind) {
                    _this._unbind = false;
                    _this.btn.bind('click', function (event) {
                        _this.result = $(this).hasClass('ok');
                        if (_this.callback) {
                            _this.callback.call(_this);
                        }
                        event.stopPropagation();
                        event.preventDefault();
                        _this.hide(_this);
                    });
                }
                return this;
            },
            setTitle: function (title, _this) {
                _this.header.show();
                $('.ui-title', _this.header).text(title);
            },
            setContent: function (content, _this) {
                //设置confirm 的内容
                _this = _this || this;
                if ($.isFunction(content)) {
                    content.call(_this);
                } else {
                    _this.content.html(content);
                }
                return this;
            },
            setPos: function (_this) {
                if ($.browser.webkit) {
                    _this.confirm.css('-webkit-transform', 'translateY(-50%)');
                } else {
                    var marginTop = -(_this.confirm.height() / 2);
                    _this.confirm.css('marginTop', marginTop);
                }
            },
            show: function () {
                this.mask.show();
                this.confirm.show();
                this.$self.css('visibility', 'visible');
                return this;
            },
            hide: function (_this) {
                _this.confirm.css('visibility', 'hidden');
                _this.mask.fadeOut(201);
//                this.confirm.hide();
                return _this;
            },
            wait: function () {
                var arg;
                arg = [].slice.call(arguments);
                while (arg.length != 0) {
                    var func = arg.shift();
                    setTimeout(func.bind(this), this.speed);
                }
            },
            destroy: function () {
                this.btn.unbind();
                this._unbind = true;
                this.mask.fadeOut(201, function () {
                    $(this).remove();
                });
                this.confirm.remove();
                this.$self = null;
                document.removeEventListener('touchmove', this.handle, false);
                return this;
            },
            handle: function (event) {
                event.preventDefault();
//                document.body.style.overflowY = document.body.style.overflowX = 'hidden';
            }
        });
        return mobileConfirm;
    })(__super);

    $.mobileConfirm = mobileConfirm;
    $.mobileConfirm_defaults = {
        appendTo: 'body', //String
        title: null, //String
        footer: true,
        abletouchmove: false,
        content: null, //Function | String | DOM element
//        cancelBtnTxt:'取消',
//        okBtnTxt:'确定',
        callback: null //Function
    };
    /***************confirm*/
    /*datepicker************************/
    var mobileDatePicker;

    mobileDatePicker = (function (_super) {
        __extends(mobileDatePicker, _super);

        function mobileDatePicker(o) {
            return new mobileDatePicker.Init(o);
        }

        __extends(mobileDatePicker.fn, {
            init: function (options) {
                var boxHeight, itemHeight,
                    opts ,
                    arr_id = [], //5个 isroll
                    arr_mday = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                    _this = this;

                _this.html = '<ul class="ui-date-top ui-grid">' +
                    '<li class="ui-date-li ui-block">年</li>' +
                    '<li class="ui-date-li ui-block">月</li>' +
                    '<li class="ui-date-li ui-block">日</li>' +
                    '<li class="ui-date-li ui-block" id="txt-hour">时</li>' +
                    '<li class="ui-date-li ui-block" id="txt-min">分</li>' +
                    '</ul>' +
                    '<div class="ui-datepicker ui-grid">' +
                    '<div class="ui-date-selectbox ui-block">' +
                    '<ul class="ui-date-list" id="year"> </ul>' +
                    '</div>' +
                    '<div class="ui-date-selectbox ui-block">' +
                    '<ul class="ui-date-list" id="month"></ul>' +
                    '</div>' +
                    '<div class="ui-date-selectbox ui-block">' +
                    '<ul class="ui-date-list" id="day"></ul>' +
                    '</div>' +
                    '<div class="ui-date-selectbox ui-block">' +
                    '<ul class="ui-date-list" id="hour"></ul>' +
                    '</div>' +
                    '<div class="ui-date-selectbox ui-block">' +
                    '<ul class="ui-date-list" id="minute"></ul>' +
                    '</div>' +
                    '</div>';

                if (options) {
                    opts = $.extend({}, $.mobileDatePicker_defaults, options);
                    _this.options = opts;
                    options = opts;
                }

                if (options.onBeforeCreate) {
//                options.onBeforeCreate(_this);
                    options.onBeforeCreate.call(_this);
                }

                _this._defaultTime = [];

                var year = $('#' + options.yearId)[0],
                    month = $('#' + options.monthId)[0],
                    day = $('#' + options.dayId)[0],
                    hour = $('#' + options.hourId)[0],
                    minute = $('#' + options.minuteId)[0];

                arr_id.push(year, month, day);

                if (options.hasTime) {
                    arr_id.push(hour);
                    arr_id.push(minute);
                } else {
                    $(hour).closest().hide();
                    $(minute).closest().hide();
                }

                boxHeight = $(year).closest('.ui-date-selectbox').height();
                itemHeight = Math.floor(boxHeight / 3);//数字高

                document.documentElement.style.webkitUserSelect = 'none';

                function AppendHtml(from, to, appendTo) {
                    //插入 li
                    appendTo.innerHTML = '';
                    var i,
                        li,
                        html = '';
                    for (i = from; i <= to; i++) {
                        li = document.createElement("li");
                        li.className = 'ui-date-li';
                        if (i < 10) {
                            i = '0' + i;
                        }
                        li.innerHTML = i;
                        html += li.outerHTML;
                    }
                    appendTo.innerHTML = html;
                }

                //获取当月天数
                /**
                 * @return {number}
                 */
                function getMDay(year, month) {
                    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                        arr_mday[1] = 29;
                    } else {
                        arr_mday[1] = 28;
                    }
                    return arr_mday[month - 1];
                }

                /**
                 * @return {string}
                 */
                function toString(str) {
                    return str < 10 ? '0' + str : str.toString();
                }

                //todo 增加格式
                var DateFormat = {};
                $.extend(DateFormat, {
                    init: function (formatString, dateObj) {
                        this._str = formatString;
                        this._date = dateObj ? dateObj : new Date();
                        return this;
                    },
                    /**
                     * @return {string}
                     */
                    Y: function () {
                        return toString(this._date.getFullYear());
                    },
                    m: function () {
                        return toString(this._date.getMonth() + 1);
                    },
                    d: function () {
                        return toString(this._date.getDate());
                    },
                    H: function () {
                        return toString(this._date.getHours());
                    },
                    i: function () {
                        return toString(this._date.getMinutes());
                    },
                    _get: function (match) {
                        return DateFormat[match]();
                    },
                    get: function () { //return  string of date
                        return this._str.replace(/\b(\w+)\b/g, this._get);
                    }
                });
                _this.SetDate = {};
                $.extend(_this.SetDate, {
                    init: function () {
                        this._date = new Date();
                        return this;
                    },
                    year: function (newYear) {
                        this._date.setFullYear(newYear);
                    },
                    month: function (newMonth) {
                        var val = newMonth - 1;
                        this._date.setMonth(val);
                    },
                    day: function (newDay) {
                        this._date.setDate(newDay);
                    },
                    hour: function (newHour) {
                        this._date.setHours(newHour);
                    },
                    minute: function (newMinute) {
                        this._date.setMinutes(newMinute);
                    },
                    get: function () {
                        return this._date;
                    }
                });
                _this.html = options.html;

                if (typeof options.setDate == "object") {
//                    DateFormat.init(options.format, options.setDate); // 'Y/m/d H:i' , Date Object
                    this.date = DateFormat.init(options.format, options.setDate).get();  //this.date = "2013/04/15 10:41";
                } else if (typeof options.setDate == "string") {
                    this.date = options.setDate; //this.date = "2013/04/15 10:41";
                }
                _this.SetDate.init();

                this.date.replace(/\b(\w+)\b/g, _this._pushDefault.bind(_this));

                for (var i = 0; i < arr_id.length; i++) {
                    var defaulTime = _this._defaultTime[i];

                    arr_id[i].dataset.v = defaulTime;
                    _this.SetDate[arr_id[i].id](defaulTime);

                    switch (arr_id[i].id) {
                        case options.yearId:
                            AppendHtml(options.yearRange[0], options.yearRange[1], year);
                            break;
                        case options.monthId:
                            AppendHtml(1, 12, month);
                            break;
                        case options.dayId:
                            AppendHtml(1, getMDay(year.dataset.v, month.dataset.v), day);
                            break;
                        case options.hourId:
                            AppendHtml(0, 24, hour);
                            break;
                        case options.minuteId:
                            AppendHtml(0, 59, minute);
                            break;
                    }
                    _this[arr_id[i].id] = new iScroll($(arr_id[i]).parent()[0], {
                        hScrollbar: false,
                        vScrollbar: false,
                        hScroll: false,
                        onBeforeScrollStart: function () { //onBeforeScrollStart  onBeforeScrollMove
                            this.stop();
                            return false;
                            var _tthis = this;
                            var end = function () {
                                if (_tthis.distY != undefined) {
//                                    _tthis.distY = undefined;
                                    var scrollTo = _tthis.scroller.dataset.v;
                                    var scrollTo1 = _this.getNewDate();
                                    return;
                                    $.each($('.ui-date-li', _tthis.scroller), function (idx, v) {
                                        if (scrollTo == v) {
                                            scrollTo *= itemHeight;
                                        }
                                    });
                                    _this[_tthis.scroller.id].scrollTo(0, -parseInt(scrollTo), 20, false);
                                    console.log(scrollTo);
                                }
                            };
                            setTimeout(end, 500);
                        },
                        onScrollMove: function () {
                            $('li', this.scroller).removeClass('ui-active');
                        },
                        onScrollEnd: function () {

                            if (this.distY != undefined) {
                                var current,
                                    currentElement,
                                    $ui_list = $(this.scroller),
                                    top = parseInt(this.y),
                                    itemSize;

                                if (this.distY > 0) { //由上向下滚动
                                    itemSize = Math.ceil(top / itemHeight);
                                    if (Math.abs(top % itemHeight) > itemHeight / 4 && top < 0) {
                                        itemSize -= 1;
                                    }
                                } else {//由下向上滚动
                                    itemSize = parseInt(top / itemHeight);
                                    if (Math.abs(top % itemHeight) > itemHeight / 4 && itemSize * itemHeight > this.maxScrollY) {
                                        itemSize -= 1;
                                    }
                                }

                                top = itemSize * itemHeight > 0 ? 0 : itemSize * itemHeight;

                                current = ( top > 0 ? 0 : Math.ceil(Math.abs(top / itemHeight)));
                                currentElement = $('.ui-date-li', $ui_list).get(current);
                                $(currentElement).addClass('ui-active');

                                this.scroller.dataset.v = currentElement.innerHTML;
                                _this.SetDate[this.scroller.id](this.scroller.dataset.v);

                                this.distY = undefined;
                                _this[this.scroller.id].scrollTo(0, top, 110, false);

                                if (this.scroller.id == options.monthId || this.scroller.id == options.yearId) {
                                    var tempDay = day.dataset.v,
                                        index = 0,
                                        scrollTo,
                                        day_index;
                                    AppendHtml(1, getMDay(year.dataset.v, month.dataset.v), day);
                                    $('.ui-date-li', day).each(function (idx, v) {
                                        if (this.innerHTML == tempDay) {
                                            index = idx;
                                        }
                                    });
                                    if (_this['day']) {
                                        _this['day'].refresh();
                                        day_index = getMDay(year.dataset.v || '', month.dataset.v || '') - 1;
                                        scrollTo = -parseInt(( index || day_index ) * itemHeight);
                                        _this['day'].scrollTo(0, scrollTo);
                                        $($('.ui-date-li', day)[index || day_index]).addClass('ui-active');
                                        _this.SetDate.day($('.ui-date-li', day)[index || day_index].innerHTML);
                                        day.dataset.v = $('.ui-date-li', day)[index || day_index].innerHTML;
                                    }
                                    _this.SetDate[this.scroller.id](this.scroller.dataset.v);
                                }
                                _this.date = DateFormat.init(options.format, _this.getNewDate()).get();  //this.date = "2013/04/15 10:41";
                                if (options.onChange) {
                                }
                            }
                        }
                    });

                    $('.ui-date-li', arr_id[i]).each(function () {
                        if (this.innerHTML == defaulTime) {
                            $(this).addClass('ui-active');
                            var to = -parseInt($(this).index() * itemHeight);
                            _this[arr_id[i].id].scrollTo(0, to, 1, false);
                        }
                    });
                }
            },
            _pushDefault: function (match) {
                this._defaultTime.push(match);
            },
            getNewDate: function () {
                return this.SetDate.get();
            },
            destroy: function () {
                document.removeEventListener('touchmove', this.handle, false);
            },
            handle: function (event) {
                event.preventDefault();
            }
        });
        return mobileDatePicker;
    })(__super);

    $.mobileDatePicker = mobileDatePicker;
    $.mobileDatePicker_defaults = {
        yearId: 'year', //DOM id
        monthId: 'month',
        dayId: 'day',
        hourId: 'hour',
        minuteId: 'minute',
        setDate: new Date(), //设置初始时间
        format: 'Y/m/d H:i', //格式化
        yearRange: [2013, 2040], //年范围
        hasTime: true, //是否显示时间，需要配合 format
        onBeforeCreate: null,
        onChange: null
    };
    /***************datepicker*/

})(window);