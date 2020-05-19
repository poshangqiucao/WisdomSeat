function second_to_min(arr){
	var min = []
	for(let i=0,len=arr.length;i<len;i++){
		min.push(arr[i]/60)
	}
}
function toTimestr(time_stamp){
	const time = new Date(time_stamp * 1000);
	const Y = time.getFullYear()
	const M = (time.getMonth() + 1).toString().padStart(2, '0')
	const D = time.getDate().toString().padStart(2, '0')
	const h = time.getHours().toString().padStart(2, '0')
	const m = time.getMinutes().toString().padStart(2, '0')
	const s = time.getSeconds().toString().padStart(2, '0')
	return `${Y}/${M}/${D} ${h}:${m}:${s}`
}
function gmt_to_beijing(timestr){
	beijing_timestamp = new Date(timestr).getTime()/1000+8*60*60
	return toTimestr(beijing_timestamp)
}
function secondsFormat(s){ 
	var day = Math.floor( s/ (24*3600) ); // Math.floor()向下取整 
	var hour = Math.floor( (s - day*24*3600) / 3600); 
	var minute = Math.floor( (s - day*24*3600 - hour*3600) /60 ); 
	var second = s - day*24*3600 - hour*3600 - minute*60;
	if(day == 0 && hour == 0 && minute == 0 && second != 0){
		return second + "秒";
	}else if(day == 0 && hour == 0 && minute != 0 && second != 0){
		return minute + "分" + second + "秒"; 
	}else if(day == 0 && hour != 0 && minute != 0 && second != 0){
		return hour + "小时" + minute + "分" + second + "秒";
	}else if(day != 0 && hour != 0 && minute != 0 && second != 0){
		return day + "天"  + hour + "小时" + minute + "分" + second + "秒";
	}else{
		return "无"
	}
}

function GMTToStr(ss){
	var time_list = ss.split(",")[1].split(" ").splice(1,4)
	var month = null
	switch(time_list[1]){
		case "Jan":
			month = 1
			break
		case "Feb":
			month = 2
			break
		case "Mar":
			month = 3
			break
		case "Apr":
			month = 4
			break
		case "May":
			month = 5
			break
		case "Jun":
			month = 6
			break
		case "Jul":
			month = 7
			break
		case "Aug":
			month = 8
			break
		case "Sep":
			month = 9
			break
		case "Oct":
			month = 10
			break
		case "Nov":
			month = 11
			break
		case "Dec":
			month = 12
			break
		
	}
	return time_list[2]+"-"+month+"-"+time_list[0]+" "+time_list[3]
}

function get_true_time(status_list){
	let true_list = []
	let false_list = []
	let sum_time = 0
	for(let i=0,len=status_list.length;i<len;i++){
		if(status_list[i][2] == "False"){
			false_list.push(status_list[i])
		}else{
			true_list.push(status_list[i])
		}
	}
	for(let i=0,len=true_list.length;i<len;i++){
		for(let j=0,len2=false_list.length;j<len2;j++){
			if(false_list[j][0] == true_list[i][0]+1){
				let start = Date.parse(GMTToStr(true_list[i][1]))/1000
				let end = Date.parse(GMTToStr(false_list[j][1]))/1000
				let val = end - start
				sum_time += val
				break
			}
		}
	}
	return sum_time
}

function uniq(array){
    var temp = [];
    var index = [];
    var l = array.length;
    for(var i = 0; i < l; i++) {
        for(var j = i + 1; j < l; j++){
            if (array[i] === array[j]){
                i++;
                j = i;
            }
        }
        temp.push(array[i]);
        index.push(i);
    }
    return [index,temp];
}

function get_every_day(status_list){
	let days = []
	let days_status = {}
	let temp
	for(let i=0,len=status_list.length;i<len;i++){
		days.push(GMTToStr(status_list[i][1]).split(" ")[0])
	}
	let index = uniq(days)[0]
	let value = uniq(days)[1]
	for(let i=0,len=index.length;i<len;i++){
		temp = status_list
		if(i ==0 ){
			days_status[value[i]] = temp.slice(0,index[i]+1)			
		}else{
			days_status[value[i]] = temp.slice(index[i-1]+1,index[i]+1)
		}
	}
	return days_status
}

function time_to_week(arr){
	let temp = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
	let week = []
	for(let i=0,len=arr.length;i<len;i++){
		let num = new Date(arr[i]).getDay()
		week.push(temp[num])
	}
	return week
}

function select_time(dt){
	return dt.split(" ")[0].split("/")
}

function now_time(){
	now = new Date()
	return now.getFullYear()+"-"+ (parseInt(now.getMonth())+1)+"-"+now.getDate()+" "+now.getHours()+":"+now.getMinutes()
}

function time_to_second(time_str){
	let hour = parseInt(time_str.split(":")[0])
	let min = parseInt(time_str.split(":")[1])
	return hour*3600+min*60
}

function format_timestamp(timestamp){
	 var now = new Date(timestamp)
	 var year=now.getFullYear(); 
	 var month=now.getMonth()+1; 
	 var date=now.getDate(); 
	 var hour=now.getHours(); 
	 var minute=now.getMinutes(); 
	 return year+"-"+month+"-"+date+" "+hour+":"+minute; 
}