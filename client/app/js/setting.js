mui.init();
 //初始化单页的区域滚动
mui('.mui-scroll-wrapper').scroll();
 //退出操作
document.getElementById('exit').addEventListener('tap', function() {
	if (mui.os.ios) {
		app.setState({});
		mui.openWindow({
			url: 'login.html',
			id: 'login',
			show: {
				aniShow: 'pop-in'
			},
			waiting: {
				autoShow: false
			}
		});
		return;
	}
	var btnArray = [{
		title: "注销当前账号"
	}, {
		title: "直接关闭应用"
	}];
	plus.nativeUI.actionSheet({
		cancel: "取消",
		buttons: btnArray
	}, function(event) {
		var index = event.index;
		switch (index) {
			case 1:
				//注销账号
				plus.storage.removeItem("username")
				plus.storage.removeItem("password")
				plus.storage.setItem("autoLogin","false")
				mui.openWindow({
					url: 'login.html',
					id: 'login',
					show: {
						aniShow: 'pop-in'
					}
				});
				break;
			case 2:
				//直接关闭应用
				plus.runtime.quit();
				break;
		}
	});
}, false);

document.getElementById("status_btn").addEventListener("toggle",function(event){
  if(event.detail.isActive){
		plus.storage.setItem("status_btn","true")
  }else{
		plus.storage.setItem("status_btn","false")
  }
})

document.getElementById('sleep_time').addEventListener('tap',function () {
	var dtpicker = new mui.DtPicker({
		type: "time",//设置日历初始视图模式 
	}) 
	dtpicker.show(function(e) {
		// console.log(time_to_second(e.toString()))
		plus.storage.setItem("sleep_time",time_to_second(e.toString()).toString())
	}) 
})

document.getElementById('true_time').addEventListener('tap',function () {
    mui('#sheet1').popover('toggle');
})

document.getElementById('start_time').addEventListener('tap',function () {
	var dtpicker = new mui.DtPicker({
		type: "time",//设置日历初始视图模式 
	}) 
	dtpicker.show(function(e) {
		plus.storage.setItem("start_time",e.toString())
		
	}) 
})

document.getElementById('end_time').addEventListener('tap',function () {
	var dtpicker = new mui.DtPicker({
		type: "time",//设置日历初始视图模式 
	}) 
	dtpicker.show(function(e) {
		plus.storage.setItem("end_time",e.toString())
	}) 
})