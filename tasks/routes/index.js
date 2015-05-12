var express = require('express');
var router = express.Router();
var Task = require('../model/taskModel');
var util = require('../lib/util');

/* GET home page. */
router.get('/', function(req, res) {
 //res.render('index', { title: '任务管理' });
 res.redirect('index.html');
});
/*获取某一天的任务，默认为当天*/
router.get(['/tasks','/tasks/:time'], function (req, res){
	var time = req.param.time;
	if(!time) {
        //如果没有时间，默认为当天
		time = util.getTimestampOfDate((new Date()).getTime());
	}else{
		time = util.getTimestampOfDate(time);
	}
    Task.getByTime(time, function(err, result){
        if(err){
            res.json('error', 'get tasks failure');
        }else{
            res.json(result);
        }
    });
});
router.get('/history/:time', function(req, res){
    var time = req.param.time;
    if(!time) {
        //如果没有时间，默认为当天
        time = util.getTimestampOfDate((new Date()).getTime());
    }else{
        time = util.getTimestampOfDate(time);
    }
    Task.getTaskDetail(time, function(err, result){
        if(err){
            res.json('error', 'get history detail failure');
        }else{
            res.json(result);
        }
    });
});
router.post('/tasks',function(req, res){
        //获取数据
        var data = {
            title: req.body.title,
            content: req.body.content,
            state: req.body.state || 'undone',
            time:(new Date()).getTime()
        };
        //保存数据
        var task = new Task(data);
        task.save(function(err, result){
            if(!err){
                res.json({msg:'insert success'});
            }else{
                res.json({msg:'error'});
            }
        });
});

router.route('/tasks/:id').get(function(req, res){
  Task.get(req.params.id, function(err, result){
    if(err){
		res.json('error', 'no task');
	}else{
		res.json(result);
	}
  });
}).put(function(req, res){
	//获取参数，rest风格
    var data = {title: req.body.title,content:req.body.content,state:req.body.state};
	Task.update(req.params.id, data, function(err){
        if(err){
            res.json({error:'update failure'});
        }else{
            res.json({ok:'update success'});
        }
	});
}).delete(function(req, res){
    Task.delete(req.params.id, function(err){
        if(err){
            res.json({error:'delete failure'});
        }else{
            res.json({ok:'delete success'});
        }
    });
});

module.exports = router;