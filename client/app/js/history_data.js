var month_status_echart = echarts.init(document.getElementById("month_status"))
	month_status_option = {
		title: {
				text: '起卧次数变化折线图',
				subtext: '本月数据',
				left: 'center'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				crossStyle: {
					color: '#999'
				}
			}
		},
		toolbox: {
			feature: {
				dataView: {show: true, readOnly: false},
				// magicType: {show: true, type: ['line', 'bar']},
				// restore: {show: true},
				saveAsImage: {show: true}
			}
		},
		xAxis: {
			type: 'category',
			data: [],
			name:'日',
			axisPointer: {
				type: 'shadow'
			}
		},
		yAxis: {
			type: 'value',
			name:'次',
			axisLabel: {
				formatter: '{value}'
			}
		},
		series: [{
			data: [],
			type: 'line',
			name:'次数',
			smooth: true
		}]
	};
mui.get('http://www.cgblogs.top:5000/get_status/api/v1.0/this_month',function(data){
	let temp = get_every_day(data["status"])
	let keys = Object.keys(temp)
	let x_data = []
	let y_data = []
	for(let i=0,len=keys.length;i<len;i++){
		x_data.push(keys[i].split("-")[2])
		y_data.push(temp[keys[i]].length)
	}
	month_status_option.xAxis.data = x_data.reverse()
	month_status_option.series[0].data = y_data.reverse()
	month_status_echart.setOption(month_status_option)
	},'json'
);


var pie_num_echart = echarts.init(document.getElementById("pie_num"))
	pie_num_option = {
		title: {
				text: '起卧持续时间统计饼图',
				subtext: '今日数据',
				left: 'center'
			},
		 tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b}: {c} 秒({d}%)'
			},
		legend: {
			orient: 'vertical',
			left: 10,
			top:30,
			data: [ '卧床', '离床']
		},
		toolbox: {
			feature: {
				dataView: {show: true, readOnly: false},
				// magicType: {show: true, type: ['line', 'bar']},
				// restore: {show: true},
				saveAsImage: {show: true}
			}
		},
		series: [
			{
				name: '持续时间',
				type: 'pie',
				radius: ['50%', '75%'],
				avoidLabelOverlap: false,
				top:'35px',
				label: {
					normal: {
						show: false,
						position: 'center'
					},
					emphasis: {
						show: true,
						textStyle: {
							fontSize: '30',
							fontWeight: 'bold'
						}
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: []
			}
		]
	}

mui.get('http://www.cgblogs.top:5000/get_status/api/v1.0/today_status',function(data){
	let true_time = get_true_time(data["status"])
	let false_time = 24*60*60-true_time
	pie_num_option.series[0]['data'] = [{'value':true_time,'name':"卧床"},{'value':false_time,'name':"离床"}]
	pie_num_echart.setOption(pie_num_option)
	},'json'
);

var status_time_echart = echarts.init(document.getElementById("status_time"))
	status_time_option = {
		title: {
				text: '本周在床时间',
				subtext: '本周数据',
				left: 'center'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				crossStyle: {
					color: '#999'
				}
			}
		},
		toolbox: {
			feature: {
				dataView: {show: true, readOnly: false},
				magicType: {show: true, type: ['line', 'bar']},
				// restore: {show: true},
				saveAsImage: {show: true}
			}
		},
		// legend: {
		//     data: ['在床时间']
		// },
		xAxis: [
			{
				type: 'category',
				data: [],
				axisPointer: {
					type: 'shadow'
				}
			}
		],
		yAxis: [
			{
				type: 'value',
				name: '秒',
				// min: 0,
				// max: 24*60*60,
				// interval: 60,
				axisLabel: {
					formatter: '{value}'
				}
			}
		],
		series: [
			{
				name: '在床',
				type: 'bar',
				data: []
			}
		]
	};
mui.get('http://www.cgblogs.top:5000/get_status/api/v1.0/this_week',function(data){
	temp =  get_every_day(data["status"])
	keys_list = Object.keys(temp)
	status_time_option.xAxis[0].data = time_to_week(keys_list).reverse() 
	let y_data = []
	for(let i=0,len=keys_list.length;i<len;i++){
		y_data.push(get_true_time(temp[keys_list[i]]))
	}
	status_time_option.series[0].data = y_data.reverse() 
	status_time_echart.setOption(status_time_option)
	},'json'
);

document.getElementById('select_time').addEventListener('tap',function () {
	mui.ajax('http://www.cgblogs.top:5000/get_status/api/v1.0/all_status',{
		data:{
		},
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:3000,//超时时间设置为3秒；
		headers:{'Content-Type':'application/json'},	              
		success:function(data){
			//服务器返回响应，根据响应结果，分析是否登录成功；
			let len = data["status"].length
			if(len){
				let start_time = gmt_to_beijing(GMTToStr(data["status"][len-1][1]))
				let start_list = select_time(start_time)
				var dtpicker = new mui.DtPicker({
				    type: "datetime",//设置日历初始视图模式 
				    beginDate: new Date(start_list[0]),//设置开始日期 
				    endDate: new Date(),//设置结束日期 
				    labels: ['年', '月', '日', '时', '分'],//设置默认标签区域提示语 
				}) 
				dtpicker.show(function(e) {
					update_echart_data(e.toString())
					
				}) 
			}else{
				mui.toast("获取可查看时间区间失败")
			}
			
		},
		error:function(xhr,type,errorThrown){
			//异常处理；
			mui.toast("获取可查看时间区间失败")
		}
	});
})

function update_echart_data(start_time){
	mui.get('http://www.cgblogs.top:5000/get_status/api/v1.0/duration_time',{left_time:start_time,right_time:now_time()},function(data){
			//获得服务器响应
			let true_time = get_true_time(data["status"])
			let now_timestamp = Date.parse(new Date())/1000
			let start_timestamp = Date.parse(new Date(start_time))/1000
			let false_time = now_timestamp-start_timestamp-true_time
			pie_num_option.series[0]['data'] = [{'value':true_time,'name':"卧床"},{'value':false_time,'name':"离床"}]
			pie_num_option.title.subtext = start_time+"至"+now_time()
			pie_num_echart.setOption(pie_num_option)
			
			let temp = get_every_day(data["status"])
			let keys = Object.keys(temp)
			let x_data = []
			let y_data = []
			for(let i=0,len=keys.length;i<len;i++){
				x_data.push(keys[i].split("-")[2])
				y_data.push(temp[keys[i]].length)
			}
			month_status_option.xAxis.data = x_data.reverse()
			month_status_option.series[0].data = y_data.reverse()
			month_status_option.title.subtext = start_time+"至"+now_time()
			month_status_echart.setOption(month_status_option)
			
		},'json'
	);
}

function create_dir(dir){
	var File = plus.android.importClass("java.io.File")
	var file = new File(dir)
	if(!file.exists()){
		file.mkdirs()
	}
}

function write_file(fileName,content){
	var FileOutputStream = plus.android.importClass("java.io.FileOutputStream")
	var BufferedWriter = plus.android.importClass("java.io.BufferedWriter")
	var OutputStreamWriter = plus.android.importClass("java.io.OutputStreamWriter")
	var environment = plus.android.importClass("android.os.Environment");
	var File = plus.android.importClass("java.io.File")
	if(environment.getExternalStorageState() === environment.MEDIA_MOUNTED){
		var sdRoot = environment.getExternalStorageDirectory().getPath()+"/data_box";
		create_dir(sdRoot)
		var file = new File(sdRoot+"/"+fileName+".txt")
		file.createNewFile()
		fileOutputStream = new FileOutputStream(file)
		bufferedWriter = new BufferedWriter(new OutputStreamWriter(fileOutputStream))
		bufferedWriter.write(content)
		bufferedWriter.close()
		return true
	}else{
		return false
	}
	
}

document.getElementById('export_data').addEventListener('tap',function () {
	mui.get('http://www.cgblogs.top:5000/get_status/api/v1.0/all_status',function(data){
			//获得服务器响应
			// console.log(JSON.stringify(data))
			let fileName = now_time()
			let content = JSON.stringify(data)
			if(write_file(fileName,content)){
				mui.toast("数据已导出在/data_box/"+fileName+".txt")
			}else{
				mui.toast("导出失败")
			}
			
			
		},'json'
	);
})