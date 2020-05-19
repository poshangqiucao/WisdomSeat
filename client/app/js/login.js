document.getElementById('login').addEventListener('tap', function() {
	var check = true;
	mui(".mui-input-group input").each(function () {
	  //若当前input为空，则alert提醒
	  if(!this.value||this.value.trim()==""){
		var label = this.previousElementSibling;
	    mui.toast(label.innerText+"不允许为空");
	    check = false;
	    return false;
	  }
	});
	//校验通过，继续执行业务逻辑
	if(check){
	  let username = document.getElementById("username").value
	  let password = document.getElementById("password").value
	  if(username.trim() == password.trim()){
		  mui.toast("不允许用户名和密码相同");
		  return 
	  }
	  mui.ajax('http://www.cgblogs.top:5000/get_status/api/v1.0/login',{
	  	data:{
	  		username:username,
	  		password: hex_md5(password)
	  	},
	  	dataType:'json',//服务器返回json格式数据
	  	type:'post',//HTTP请求类型
	  	timeout:3000,//超时时间设置为10秒；
	  	headers:{'Content-Type':'application/json'},	              
	  	success:function(data){
	  		//服务器返回响应，根据响应结果，分析是否登录成功；
	  		if(data["status"]){
				mui.toast("登录成功")
				//plus.storage.setItem("username",username);
				mui.openWindow({
				  url: 'index.html', 
				  id:'index.html',
				});
			}else{
				mui.toast("登录失败")
			}
	  	},
	  	error:function(xhr,type,errorThrown){
	  		//异常处理；
	  		mui.toast("登录失败")
	  	}
	  });
	}
});

document.getElementById('register').addEventListener('tap', function() {
  //打开注册页面
  mui.openWindow({
	url: 'register.html', 
	id:'register.html'
  });
});

document.getElementById('forgetPassword').addEventListener('tap', function() {
  mui.toast("功能正在升级中...")
});

document.getElementById("autoLogin").addEventListener("toggle",function(event){
	let username = document.getElementById("username").value
	let password = document.getElementById("password").value
	if(event.detail.isActive){
	  console.log("你启动了开关");
	  plus.storage.setItem("autoLogin","true")
	  plus.storage.setItem("username",username)
	  plus.storage.setItem("password",password)
	}else{
	  console.log("你关闭了开关");
	  plus.storage.setItem("autoLogin","false")
	  plus.storage.removeItem("username")
	  plus.storage.removeItem("password")
	}
})
