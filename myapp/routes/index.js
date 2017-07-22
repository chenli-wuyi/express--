var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	// 判断是否有 isLogin 这个cookie 并且 isLogin 为true

	// 读cookie
	var isLogin = req.cookies.isLogin;

	console.log(isLogin);

  	res.render('index', { 
  		isLogin: isLogin
  	});
});


// 登录页面的路由		localhost:3000/login
router.get('/login', function(req, res, next) {
	res.render('login');
})

// 注册页面的路由		localhost:3000/reg
router.get('/reg', function(req, res) {
	res.render('reg');
})



module.exports = router;
