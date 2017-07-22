var express = require('express');
var router = express.Router();
var async = require('async');

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = "mongodb://127.0.0.1:27017/project";


// 评论列表的路由      localhost:3000/pinglun
router.get('/', function(req, res) {

	// 获取数据库里面的所有的评论
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		if (err) {
			res.send('出错');
		} else {
			var conn = db.collection('pinglun');

			// conn.find().toArray(function(err, arr) {
			// 	if (err) {
			// 		res.send('出错');
			// 	} else {
			// 		// 渲染页面
			// 		// 将 arr 做遍历，每一个元素的 time 都进行一个  format 方法 ,,,,

			// 		// 分页需要的东西
			// 		// 自己构建分页的信息
			// 		// 1. 每页显示多少条 自己定义好
			// 		// 2. 一共有多少数据	arr.length
			// 		// 3. 一共有多少页		Math.ceil(arr.length / 每页显示的条数)
			// 		// 4. 当前显示第几页	前端传递过来的。。

			// 		// var pageSize = 10;			// 每页显示的条数
			// 		// var total = arr.length; 	// 总条数
			// 		// var pages = Math.ceil(total / pageSize);	// 总页数
			// 		// var pageNo = req.query.pageNo || 1;			// 当前显示第几页的数据


			// 		// var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

			// 		// arr.substr(0, 10)					// 第一页
			// 		// arr.substr(10, 10);					// 第二页
			// 		// arr.substr(20, 10);
			// 		// arr.substr(30, 10);

			// 		// ...
			// 		// arr.substr( (pageNo - 1) * pageSize, pageSize)



			// 		res.render('pinglun/list', {list: arr});
			// 	}
			// })

			// 做两次数据库的查询操作

			async.waterfall([
				// 得到评论集合的总条数
				function(cb) {

					conn.find().count(function(err, num) {
						if (err) {
							cb('查询失败');
						} else {
							cb(null, num);
						}
					})
				},
				// 根据上一个步骤里面给我的 num 做计算，计算出，总的 页数
				function(num, cb) {

					var total = num;	// 总页数
					var pageSize = 10;	// 每页显示条数
					var pages = Math.ceil(total / pageSize);	// 总页数
					var pageIndex = req.query.pageIndex || 1;	// 当前需要显示第几页的数据

					// 1  skip(0).limit(10)
					// 2  skip(10).limit(10)
					// 3  skip(20).limit(10)
					// ...

					// skip( (pageIndex - 1) * pageSize ).limit(pageSize)

					conn.find().skip( (pageIndex - 1) * pageSize ).limit( pageSize ).toArray(function(err, arr) {
						if (err) {
							cb('查询失败');
						} else {
							cb(null, {
								list: arr,
								pages: pages,
								pageIndex: pageIndex
							});
						}
					})
				}
			], function(err, result) {
				if (err) {
					res.send(err);
				} else {

					// console.log(result);

					res.render('pinglun/list', result)
				}
			})
		}
	})
})

// 添加评论的路由		localhost:3000/pinglun/addpl
router.get('/addpl', function(req, res) {

	// 先做一个判断。是否还是登录状态。。

	if (req.cookies.isLogin) {
		// 还在登录状态，就直接去 评论添加页面
		res.render('pinglun/add');	
	} else {
		// 去登录页面
		res.redirect('/login');
	}
	
})

// 添加评论的按钮点击的时候干的事情  localhost:3000/pinglun/confirm
router.post('/confirm', function(req, res) {

	MongoClient.connect(DB_CONN_STR, function(err, db) {
		if (err) {
			res.send('错误');
		} else {
			var conn = db.collection('pinglun');

			async.waterfall([
				// 查询当前评论集合里面 _id 最大的那个数字 arr arr[arr.length - 1]
				function(cb) {
					conn.find().toArray(function(err, arr) {

						if (err) {
							cb('查询失败');
						} else {
							// 得到 arr 数组里面 _id 最大的那个数

							var max = arr[arr.length - 1]._id;
							max++;

							cb(null, max);
						}

					})
				},
				// 新增一条评论的操作
				function(max, cb) {
					var obj = {
						_id: max,
						content: req.body.content,
						nickname: req.cookies.isLogin,
						time: new Date().getTime()
					}

					conn.save(obj, function(err, info) {
						if (err) {
							cb('新增失败');
						} else {
							cb(null, '成功');
						}
					})
				},
			], function(err, result) {
				if (err) {
					res.send(err);
				} else {
					// 回到评论列表页面
					res.redirect('/pinglun');
				}
			})

		}
	})
})




module.exports = router;












