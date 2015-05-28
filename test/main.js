require.config({
    baseUrl: '../',

    shim: {
        zepto: {
            exports: '$'
        },
        handlebars: {
            exports: 'Handlebars'
        }
    },

    paths: {
        zepto: 'common/lib/zepto/zepto',
        text: 'common/lib/requirejs/text',
        handlebars: 'common/lib/handlebars/handlebars'
    }
});
require(['flight_core/app'], function(app){
    //do something
    console.log('aaaaa');
    app.init();
});