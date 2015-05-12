define(['jquery','backbone'], function($, Backbone){
	//建立模型
	var task = Backbone.Model.extend({
       // url:'/task/'+ this.get('id'),
		defaults:function(){
			return {
				title :'new task',
				content:'',
				state:'undone'
			};
		},
		//change the state
		toggle:function(){
			this.state = (this.state=="undone")?'done':'undone';
			//注意要保存
			this.save({state:this.state});
		}
	});
	//模型集合
	var tasks = Backbone.Collection.extend({
		url:'/tasks',
		model:task
	});
	return tasks;
});