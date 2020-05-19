document.getElementById('register').addEventListener('tap', function() {
	var check = true;
	mui(".mui-input-group input").each(function () {
	  //若当前input为空，则alert提醒
	  var label = this.previousElementSibling;
	  if(!this.value||this.value.trim()==""){
	    mui.alert(label.innerText+"不允许为空");
	    check = false;
	    return false;
	  }
	});
	//校验通过，继续执行业务逻辑
	if(check){
	    let username = document.getElementById("username").value
	    let password = document.getElementById("password").value
	    let password2 = document.getElementById("password2").value
	    let tel = document.getElementById("tel").value
		if(username.trim() == password.trim()){
				  mui.alert("不允许用户名和密码相同");
				  return 
		}
		if(password.trim() != password2.trim()){
				  mui.alert("两次输入密码不同");
				  return
		}
		mui.ajax('http://www.cgblogs.top:5000/get_status/api/v1.0/register',{
			data:{
				username:username,
				password:password,
					tel:tel
			},
			dataType:'json',//服务器返回json格式数据
			type:'post',//HTTP请求类型
			timeout:3000,//超时时间设置为10秒；
			headers:{'Content-Type':'application/json'},	              
			success:function(data){
				//服务器返回响应，根据响应结果，分析是否登录成功；
				if(data["status"]){
						mui.toast("注册成功")
						mui.openWindow({
						  url: 'login.html', 
						  id:'login.html',
						});
					}else{
						mui.toast("注册失败")
					}
			},
			error:function(xhr,type,errorThrown){
				//异常处理；
				mui.toast("注册失败")
			}
		});
	}
});

document.getElementById("username").addEventListener('change',function(){
	let username = this.value
	mui.get('http://www.cgblogs.top:5000/get_status/api/v1.0/check_username',{username:username},function(data){
			//获得服务器响应
				if(!data["status"]){
					mui.alert("此用户名已被注册");
					document.getElementById("username").value = ""
				}
		},'json'
	);
});

document.getElementById("tel").addEventListener('change',function(){
	let tel = this.value
	mui.get('http://www.cgblogs.top:5000/get_status/api/v1.0/check_tel',{tel:tel},function(data){
			//获得服务器响应
				if(!data["status"]){
					mui.alert("此手机号已被注册");
					document.getElementById("tel").value = ""
				}
		},'json'
	);
});