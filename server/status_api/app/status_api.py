from flask import Flask,jsonify,abort,make_response,request
from flask_cors import CORS,cross_origin
import pymysql
from config import config
import time
import datetime
from datetime import timedelta
import json
import hashlib

app = Flask(__name__)
CORS(app, supports_credentials=True, resources=r'/*')
#通过装饰路线具体CORS
@cross_origin()   

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'status': 'error'}), 404)

#   检查是否手机号已被注册
@app.route("/get_status/api/v1.0/check_tel",methods=['GET'])
def check_tel():
    res = None
    tel = request.args.get("tel")
    db = pymysql.connect(**config)
    cursor = db.cursor()
    sql = "SELECT count(*) FROM user_info WHERE tel = %s"
    cursor.execute(sql,[tel])
    result = cursor.fetchone()
    if result[0] >= 1:
        res = False
    else:
        res = True
    cursor.close()
    db.close()
    return jsonify({"status":res})
    
#   检查是否有重复用户名
@app.route("/get_status/api/v1.0/check_username",methods=['GET'])
def check_username():
    res = None
    username = request.args.get("username")
    db = pymysql.connect(**config)
    cursor = db.cursor()
    sql = "SELECT count(*) FROM user_info WHERE username = %s"
    cursor.execute(sql,[username])
    result = cursor.fetchone()
    if result[0] >= 1:
        res = False
    else:
        res = True
    cursor.close()
    db.close()
    return jsonify({"status":res})
    
#   用户登录
@app.route('/get_status/api/v1.0/login',methods=['POST'])
def login():
    res = None
    data = request.get_data()
    json_data = json.loads(data.decode("utf-8"))
    username = json_data.get("username")
    password = json_data.get("password")
    db = pymysql.connect(**config)
    cursor = db.cursor()
    sql_1 = "SELECT count(*) AS num FROM user_info WHERE username=%s AND password=%s"
    sql_2 = "SELECT count(*) AS num FROM user_info WHERE tel=%s AND password=%s"
    cursor.execute(sql_1,[username,password])
    result_1 = cursor.fetchone()
    if result_1[0] >= 1:
        res = True
    else:
        cursor.execute(sql_2,[username,password])
        result_2 = cursor.fetchone()
        if result_2[0] >= 1:
            res = True
        else:
            res = False
    cursor.close()
    db.close()
    return jsonify({"status":res})
    
#   用户注册
@app.route('/get_status/api/v1.0/register',methods=['POST'])
def register():
    res = True
    data = request.get_data()
    json_data = json.loads(data.decode("utf-8"))
    username = json_data.get("username")
    password = json_data.get("password")
    tel = json_data.get("tel")
    md = hashlib.md5()
    md.update(password.encode())
    md5_password = md.hexdigest()
    db = pymysql.connect(**config)
    cursor = db.cursor()
    sql = "INSERT INTO user_info(username,password,tel) VALUES (%s,%s,%s);"
    result = cursor.execute(sql,[username,md5_password,tel])
    db.commit()
    if result >= 1:
        res = True
    else:
        res = False
    cursor.close()
    db.close()
    return jsonify({"status":res})
    
#   返回全部数据
@app.route('/get_status/api/v1.0/all_status',methods=['GET'])
def all_status():
    res = None
    db = pymysql.connect(**config)
    cursor = db.cursor()
    sql = "SELECT * FROM status_data ORDER BY timestamp DESC"
    cursor.execute(sql)
    res = cursor.fetchall() 
    cursor.close()
    db.close()
    return jsonify({"status":res})

#   status_id 1表示有人状态 0表示无人状态
#   返回全部特定状态ID数据
@app.route('/get_status/api/v1.0/<int:status_id>',methods=['GET'])
def get_status(status_id):
    res = None
    db = pymysql.connect(**config)
    cursor = db.cursor()
    if status_id in [1,0]:
        sql = "SELECT * FROM status_data WHERE status=%s ORDER BY timestamp DESC"
        if status_id == 1:
            cursor.execute(sql,['True'])
        else:
            cursor.execute(sql,['False'])
        res = cursor.fetchall()
    else:
        abort(404)
    cursor.close()
    db.close()
    return jsonify({"status":res})

#   status_id 1表示有人状态 0表示无人状态
#   返回最近状态数据
@app.route('/get_status/api/v1.0/last_status/<int:status_id>',methods=['GET'])
def last_status(status_id):
    res = None
    db = pymysql.connect(**config)
    cursor = db.cursor()
    if status_id in [1,0]:
        sql = "SELECT * FROM status_data WHERE status=%s ORDER BY timestamp DESC LIMIT 1"
        if status_id == 1:
            cursor.execute(sql,['True'])
        else:
            cursor.execute(sql,['False'])
        res = cursor.fetchone()
    else:
        abort(404)
    cursor.close()
    db.close()
    return jsonify({"status":res})

#   返回今日数据
@app.route("/get_status/api/v1.0/today_status",methods=['GET'])
def today_status():
    res = None
    timestamp = time.strftime("%Y-%m-%d", time.localtime())
    db = pymysql.connect(**config)
    cursor = db.cursor()
    sql = "SELECT * FROM status_data WHERE timestamp >= %s ORDER BY timestamp DESC"
    cursor.execute(sql,[timestamp])
    res = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify({"status":res})

#   传送的时间格式 年-月-日 小时:分:秒 
#   返回任意时间间隔数据
@app.route("/get_status/api/v1.0/duration_time",methods=['GET'])
def left_and_right_time():
    res = None
    left_time = request.args.get("left_time")
    right_time = request.args.get("right_time")
    left = time.strptime(left_time,"%Y-%m-%d %H:%M")
    right = time.strptime(right_time,"%Y-%m-%d %H:%M")
    left_timestamp = time.strftime("%Y-%m-%d %H:%M:%S",left)
    right_timestamp = time.strftime("%Y-%m-%d %H:%M:%S",right)
    db = pymysql.connect(**config)
    cursor = db.cursor()
    sql = "SELECT * FROM status_data WHERE timestamp >= %s and timestamp <= %s ORDER BY timestamp DESC"
    cursor.execute(sql,[left_timestamp,right_timestamp])
    res = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify({"status":res})

#  返回本月数据
@app.route("/get_status/api/v1.0/this_month",methods=['GET'])
def this_month():
    res = None
    timestamp = time.strftime("%Y-%m", time.localtime())
    timestamp+="-01"
    db = pymysql.connect(**config)
    cursor = db.cursor()
    sql = "SELECT * FROM status_data WHERE timestamp >= %s ORDER BY timestamp DESC"
    cursor.execute(sql,[timestamp])
    res = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify({"status":res})
#   返回本周数据
@app.route("/get_status/api/v1.0/this_week",methods=['GET'])
def five_days():
    res = None
    now = datetime.datetime.now()
    this_week_start = now - timedelta(days=now.weekday())
    this_week_end = now + timedelta(days=6-now.weekday())
    start = this_week_start.isoformat().split("T")[0]
    end = this_week_end.isoformat().split("T")[0]
    db = pymysql.connect(**config)
    cursor = db.cursor()
    sql = "SELECT * FROM status_data WHERE timestamp >= %s and timestamp <= %s ORDER BY timestamp DESC"
    cursor.execute(sql,[start,end])
    res = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify({"status":res})
 
if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,debug=True)
