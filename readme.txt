昨日回顾


mongo 里面各种命令

show dbs;

use project

db.createCollection()
db.集合名.insertOne()
db.集合名.drop()

db.集合名.save({})
db.集合名.insertOne()
db.集合名.insert([])

db.jihe.update(条件, 修改的内容)    $set   $inc

db.jihe.remove(条件)

db.jihe.find(条件，只要它列出什么字段)
db.jihe.findOne()
db.jihe.find().count();

db.jihe.find().skip(从下标为几的地方开始数).limit(要几条)


nodejs 去链接 mongodb

1. 在项目下 安装 mongodb  --save
2. 在你需要链接数据库的代码哪里  
	1. 引入 mongodb
		var MongoClient = require('mongodb').MongoClient;
	2. 构建一个 连接的 字符串
		var DB_CONN_STR = "mongodb://127.0.0.1:27017/数据库的名字";
	3. 连接
		MongoClient.connect(DB_CONN_STR, function(err, db) {
			if (err) {} else {

				var conn = db.collection('集合的名字')

				conn.find()
				conn.update();
				conn.remove()
				conn.save()


				// 关闭链接
				db.close();

			}
		})


是用 express  来创建项目，快速一个开发

1. 全局 安装  了  express 生成器   npm install -g express-generator   
supervisor

2. 在你需要创建项目的目录下  打开cmd   express -e 项目的名称

3. cd 项目的名称

4. npm install 会根据当前文件夹下  的 packge.json 文件里面模块的依赖，自行去安装。。。

5. npm start		|| npm run start   || supervisor bin/www

6. 在浏览器 输入  localhost:3000

响应到了  router/index.js   '/'
	res.render('index', {})
	res.redirect() 重定向
	res.send()

ejs 模板引擎 数据 跟 视图分开 。

原文输出  <%= %>
解析输出  <%- %>
注释		<%# %>
引入模板  include
		<%- include('模板路径', {}) %>
		<% include 模板路径 %>
流程标签  <% %>


几个注意点：

	静态资源 全部放到  public 文件夹,
	页面上要访问的话  
	link href="/css/styel.css"	
	script src='/js/xxx.js'
	img src="/img/xxx.jpg"


	所有的视图模板都放到  views 文件夹里面。



express 
	获取get的参数
	req.query
	获取 post 的参数
	req.body

	写cookie
	res.cookie('key', 'value', {
		maxAge: 毫秒
	})
	
	读cookie
	req.cookies.key

	删cookie
	res.cookie('key', 'value', {
		maxAge: -1000
	})


	async
	分页













