define(['jquery', 'backbone', 'underscore', 'TaskModel'], function($, Backbone, _, Tasks){
	var tasks = new Tasks;
	//缓存模板
	//var stringTemplate = $('#taskpage').html();
	//var domTemplate = $('<div>'+stringTemplate+'</div>');

	//任务视图
	var TaskView = Backbone.View.extend({
		tagName:'li',
		template:_.template($('#taskView').html()),
		//backbone使用事件代理绑定事件处理器，一个键值对只能处理之中事件
		events:{
			'click .task-content':'toggleState',
			'click #taskControl':'showPopup'
		},
		initialize:function(){
			this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.removeElement);
		},
		render:function(){
			this.$el.html(this.template(this.model.toJSON()));
            return this;
		},
		showPopup:function(){
			new popupView({model:this.model}); 
		},
		//状态切换
		toggleState:function(){
			this.model.toggle();
		},
		removeElement:function(){
			//该操作包含两个动作，清除绑定元素$el,取消事件监听stopListening
			this.remove();
		}

	});
//状态视图
	var statebarView = Backbone.View.extend({
		tagName:'li',
		attributes:{'data-role':'list-divider'},
		template:_.template($('#taskTitleView').html()),
		initialize:function(){
      this.listenTo(tasks, 'add remove', this.render);
		},
		render:function(){
			this.$el.html(this.template({time:this.getTime(), count:tasks.length}));
      return this;
		},
		getTime:function(){
			var time = new Date();
			return time.getFullYear()+"年"+(time.getMonth()+1)+"月"+time.getDate()+'日';
		}

	});
//任务表单
	var panelView = Backbone.View.extend({
		el:'#main-page',
		template:_.template($('#form-panel').html()),
		initialize:function(){
			this.render();
		},
		render:function(){
			var temp = this.model ? this.template(this.model.toJSON()) : this.template({title:'',content:'',state:''});
			this.$el.append(temp);
			//注意this作用域
			$( "#addTask" ).on( "panelclose", this.close.bind(this));
			// $(this.panel).panel();无效，不知道怎么回事？
			//使用全局渲染方法
			$.mobile.pageContainer.trigger("create");
			this.title = this.$('#title');
			this.content = this.$('#content');
			this.state = this.$('#state');
			return this;
		},
		//编辑任务
		edit:function(){
			//控制器逻辑
			var data = {};
			if(this.title.val()!=this.model.title){
				data.title= this.title.val()
			}
			if(!this.content.val()!=this.model.content){
				data.content = this.content.val();
			}
			if(this.state.val()=='0'){
				data.state = 'undone';
			}else{
				data.state = 'done';
			}
            //更新模型，如果模型中有id，则put请求，反之，post请求
			this.model.save(data);
			this.close();
		},
		//创建任务
		createTask: function() {
      //控制器逻辑
			var data = {};
			if(this.title.val()){
				data.title= this.title.val();
			}
			if(this.content.val()){
				data.content = this.content.val();
			}
			if(this.state.val()=='0'){
				data.state = 'undone';
			}else{
				data.state = 'done';
			}
			//在集合中创建
			tasks.create(data,{wait: true});
			this.close();
    },
    close:function(){
    	//直接dom操作会报错
    	$('#addTask').panel('close').remove();
    	//注意事件要取消，因为该事件是绑定在$el上的，删除dom元素并不能取消事件绑定
  		//可能这种方式不是backbone推荐的视图使用方法，需要手动j解除事件代理
		this.undelegateEvents();
    	//this.remove();不能使用，这将清除$el指定的dom元素
    }

	});
//需要传入model
	var popupView = Backbone.View.extend({
		el:'#main-page',
		template:_.template($('#popup-controlTask').html()),
		events:{
			'click #taskControl-del':'remove',
			'click #taskControl-edit':'showPanel'
		},
		initialize:function(){
			this.render();
		},
		render:function(){
			this.dom = $(this.template());
			this.$el.append(this.dom);
			$.mobile.pageContainer.trigger("create");
			$( "#popupControl" ).popup({afterclose: this.close.bind(this)});
			return this;
		},
		//删除任务
		remove:function(){
			this.model.destroy();
			this.close();
		},
		showPanel:function(){
			new panelView({model:this.model,events:{'click #newTask-confirm': 'edit'}});
			$( "#addTask" ).panel('open');
			this.close();	
		},
		close:function(){
			$( "#popupControl" ).popup('destroy').remove();
			this.undelegateEvents();
		}
	});
//主视图
	var appView = Backbone.View.extend({
		//绑定元素
		el:'#main-page',
		template:_.template($('#page-Task').html()),
		//定义dom事件
		events:{
			'click #bt-addPanel':'showPanel',
			'click #bt-history':'showHistory'
		},
		//初试化
		initialize:function(){
			//将主模板文件加入文档
			this.$el.html(this.template());
			this.taskpanel = this.$('#addTask');
			this.tasklist = this.$("#tasklist");
			this.btShowPanel = this.$('bt-addPanel');

			this.listenTo(tasks, 'add', this.addTask);
            this.listenTo(tasks, 'reset', this.addAll);
            this.listenTo(tasks, 'all', this.render);

            this.statebar = (new statebarView).render().el;
			this.$("#tasklist").append(this.statebar);
            //从服务器端获取数据，并自动加入集合当中
			tasks.fetch({success:function(){
                //注意，一定是在数据准备完毕的时候在渲染页面
               //$.mobile.pageContainer.trigger("create");
                $.mobile.initializePage();
               // $.mobile.changePage('#main-page',{changeHash: false})
            }});
		},
		//渲染方法
		render:function(){
			//this.$("#tasklist").listview('refresh');
            //处理局部渲染的问题
            $("#tasklist").listview().listview('refresh');
		},
		//添加任务
		addTask:function(dataModel){
			var view = new TaskView({model: dataModel});
            this.$("#tasklist").append(view.render().el);
		},
		addAll:function(){
			tasks.each(this.addOne, this);
		},
		showPanel:function(){
			new panelView({model:null,events:{'click #newTask-confirm': 'createTask'}});
		},
        showHistory:function(){
            Backbone.history.navigate('/history',{trigger:true});
        }
	});

	return appView;
});