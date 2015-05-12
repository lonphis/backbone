define(['jquery','backbone'], function($, Backbone){
	//建立模型
	var historyDetail = Backbone.Model.extend({
		defaults:function(){
			return {
				time: '',
				count: 0,
				doneCount: 0
			};
		},
		getProgressValue:function(){
			return (this.get('doneCount')/this.get('count'))*100;
		}
	});
	return historyDetail;
});