gui-mobile-plugin
=================

移动端 webApp 插件, 基于 jQuery, iScroll


Confirm
-------
#Usage:

> //无 new 实例化一个myConfirm
> var myConfirm = $.mobileConfirm();
> //初始化
> myConfirm.init(options);
> //显示
> myConfirm.show();

#options:

> appendTo: 'body', //String 插入到，默认 body
> title: null, //String 标题文字
> footer: true, //是否显示 footer 的按钮
> abletouchmove: false,//是否阻止底层 div 滚动
> content: null, //Function | String | DOM element 设置 confirm 的内容
> callback: null //Function 回调



Datepicker
-----------
基于 $.mobileConfirm 的扩展

#Usage

> datePicker = $.mobileDatePicker(options);

#options:
> setDate: new Date(), //设置初始时间
> format: 'Y/m/d H:i', //格式化
> yearRange: [2013, 2040], //年范围
> hasTime: true, //是否显示时间，需要配合 format , 比如设置 false,需要设置 format: 'Y/m/d'
> onBeforeCreate: null,
> onChange: null

