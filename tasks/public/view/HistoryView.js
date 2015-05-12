define(['jquery', 'backbone', 'underscore', 'HistoryModel','jqDatepicker'], function($, Backbone, _, History){
    var history = new History();
//historyView
    var historyView = Backbone.View.extend({
        el:'#history-page',
        template:_.template($('#historyView').html()),
        events:{
            'click #btn-moreDetail':'changePage',
            'change #dateinput':'checkTask'
        },
        initialize: function(param){
            //设置模型
            this.model = history;
            //获取数据后产生渲染模板，不能直接调用render方法
            this.listenTo(this.model,'change',this.render);
            //获取任务数据,param为视图传入的参数{time:time,id:id}
            this.checkTask(param);
        },
        render:function(){
            //加载和解析模板
            this.$el.html(this.template({
                time:this.getTime(this.model.get('time')),
                progressValue:this.model.getProgressValue()
            }));
//            this.$('#dateinput').datepicker({onSelect:function(date,inst){
//                alert(date);
//            }});
            //页面跳转渲染,并阻止hash改变
            $.mobile.changePage('#history-page',{changeHash: false});
           // $.pageContainer.change('#history-page',{changeHash: false});
        },
        changePage:function(param){
            Backbone.history.navigate('/tasks/'+ this.model.get('time'),{trigger:true});
        },
        checkTask:function(param){
            //用于空模型，或者保持模型是最新的状态
            this.model.fetch({
                url:'/history/'+param.time
            });
        },
        getTime: function(time){
            var time1 = new Date(parseInt(time));
            return time1.getFullYear()+'年'+time1.getMonth()+'月'+time1.getDate()+'日';
        }
    });

    return historyView;
});