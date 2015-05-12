//require配置
require.config({
    paths:{
        jquery:'lib/jquery-1.10.2',
        jqm:'lib/jquery.mobile-1.4.5.min',
        underscore:'lib/underscore',
        backbone:'lib/backbone',
        localStorage:'lib/backbone.localStorage',
        'jquerymobile.config':'jquerymobile.config',
        TaskModel:'model/TaskModel',
        HistoryModel:'model/historyDetailModel',
        AppView:'view/AppView',
        HistoryView:'view/HistoryView',
        datepicker:'lib/date/datepicker',
        jqDatepicker:'lib/date/jquery.mobile.datepicker'
    },
    shim:{
        'underscore':{exports:'_'},
        'jqm':['jquery', 'jquerymobile.config'],
        'datepicker':{exports:'datepicker'}
    }
});
//启动应用程序
require(['jquery','backbone','underscore', 'AppView', 'HistoryView','jqm'],
    function ($, Backbone, _, AppView, HistoryView) {

        var Router = Backbone.Router.extend({
            routes : {//思考可视路由一般是get方法
                "" : "index",
                'task/:time':'getTaskByTime',
                'task(/:id)' : 'index',
                'history(/:time)':'history',
                '*path' : 'index'//匹配所有路由
            },
            index:function(){
                //将参数传到视图当中
                new AppView();
            },
            getTaskByTime:function(time){
                new AppView({time:time});
            },
            history:function(time){
                //如果没有时间，默认为当天
                if(!time) time = (new Date()).getTime();
                new HistoryView({time:time});
            }
        });

        $(function () {
            //开启路由
            window.BackboneRouter = new Router();
            Backbone.history.start({ pushState : true });
        });
    });