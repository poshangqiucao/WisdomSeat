document.addEventListener("background",function(){
	// mui.toast("应用切换到后台运行事件")
})
document.addEventListener("foreground",function(){
	// mui.toast("应用切换到前台运行事件")
	if(plus.storage.getItem("status_btn") == "true"){
		mui("#status_btn").switch().toggle();
	}
})

document.addEventListener("plusscrollbottom",function(){
	mui.toast("已经到底喽")
})

document.addEventListener('error',function () {
    mui.toast("抱歉！我们遇到了一些问题")
})

document.addEventListener("trimmemory",function(){
	mui.toast("需要清理内存了呀")
	plus.runtime.quit()
})