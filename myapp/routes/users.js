var express = require('express');
var router = express.Router();
var async = require('async');

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = "mongodb://127.0.0.1:27017/project";


// 登录处理
router.all('/login', function(req, res) {

	// console.log('登录的处理')

	// 需要做sm？
	// 1. 获取传过来的参数
		// get req.query
		// post req.body
		// console.log(req.body);
		// console.log(req.query);
	// 2. 做数据库的处理
	MongoClient.connect(DB_CONN_STR, function(err, db) {
		if (err) {
			res.send('<h1>网络异常，请稍候重试</h1>');
		} else {

			// 得到 集合的对象
			var conn = db.collection('users');

			// conn.find(req.body).count(function(err, num) {

			// 	console.log(num);

			// 	if (err || num <= 0) {
			// 		res.send('用户名或密码错误');
			// 	} else {

			// 		// if (num > 0) {
			// 		// 	// chengg 
			// 		// } else {
			// 		// 	// shibai 
			// 		// }

			// 		// 登录成功
			// 		// 写一个cookie
			// 		// res.cookie(cookie的名字， cookie的值， 配置选项)
			// 		res.cookie('isLogin', true, {
			// 			maxAge: 10 * 60 * 1000
			// 		});

			// 		// 跳回首页
			// 		res.redirect('/');
			// 	}

			// 	// 关闭链接
			// 	db.close();

			// })

			// 因为需要当前登录用户的 nickname
			conn.find(req.body).toArray(function(err, arr) {
				if (err) {
					res.send('查询出错');
				} else {
					console.log(arr);

					if (arr.length > 0) {
						// 登录成功
						// 直接讲这个人的 昵称 给存入 cookie
						res.cookie('isLogin', arr[0].nickname, {
							maxAge: 10 * 60 * 1000
						});
						res.redirect('/');
					} else {
						res.send('用户名或密码错误')
					}
				}

				// 关闭链接
				db.close();
			})
		}
	})

})

// 注册
router.post('/reg', function(req, res) {

	MongoClient.connect(DB_CONN_STR, function(err, db) {
		if (err) {
			res.send('网络异常');
		} else {
			var conn = db.collection('users');

			async.series([
				// 先做查询
				function(cb) {
					conn.find({email: req.body.email}).count(function(err, num) {
						if (err) {
							cb('err', '查询失败');
						} else {

							if (num > 0) {
								// 不能注册
								cb('err', '用户名名已存在');
							} else {
								// 可以注册
								cb(null);
							}
						}
					})
				},
				// 根据上一个查询 cb方法，看cb方法第一个参数 如果传的是  null, 就可以走到下面这一个异步操作。如果不是传的 null, 下面这个方法是不执行的。
				function(cb) {
					// 新增的操作
					conn.save(req.body, function(err, info) {

						if (err) {
							cb('err', '新增失败');
						} else {
							cb(null, '新增成功');
						}

					})
				}
			], function(err, result) {
				if (err) {
					res.send(result);
				} else {
					// 注册成功之后的处理
					// 重定向到 登录页面
					res.redirect('/login');
				}
			})

			// 这里注册。。。。
			// 先判断一下是否能够注册。
			// 如果能注册就注册，不能注册就直接告诉，用户民被占用。

			// conn.find({email: req.body.emial}).count(function(err, num) {
			// 	if (err) {
			// 		res.send('失败');
			// 	} else {
			// 		if (num > 0) {
			// 			// 不能注册
			// 			res.send('用户名已存在，请更换用户名');
			// 		} else {
			// 			// 可以注册

			// 			conn.save()
			// 		}
			// 	}
			// })

			// conn.save()
		}
	})
})

// 注销
router.get('/logout', function(req, res) {

	// 怎么注销
	// 删除cookie
	res.cookie('isLogin', '', {
		maxAge: -100
	});
	// 再跳回首页
	res.redirect('/');
})

module.exports = router;










