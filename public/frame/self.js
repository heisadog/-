document.write('<link rel="stylesheet" type="text/css" href="../../public/css/weui.min.css"/>');
document.write('<link rel="stylesheet" type="text/css" href="../../public/css/jquery-weui.min.css"/>');
document.write('<link rel="stylesheet" type="text/css" href="../../public/css/reset.css"/>');
document.write('<link rel="stylesheet" type="text/css" href="../../public/css/public.css"/>');


document.write('<script type="text/javascript" src="../../public/frame/jq2.2.3.js"></script>');
document.write('<script type="text/javascript" src="../../public/frame/jquery-weui.min.js"></script>');
document.write('<script type="text/javascript" src="../../public/frame/const.js"></script>');
document.write('<script type="text/javascript" src="../../public/frame/jquery-lgx.js"></script>');
document.write('<script type="text/javascript" src="../../public/frame/basic.js"></script>');
document.write('<script type="text/javascript" src="../../public/frame/dao.js"></script>');
document.write('<script type="text/javascript" src="../../public/frame/hammer.js"></script>');
document.write('<script type="text/javascript" src="../../public/frame/public.js"></script>');
document.write('<script type="text/javascript" src="../../public/frame/iconfont.js"></script>');
document.write('<script type="text/javascript" src="../../public/frame/components.js"></script>');

// document.write('<style></style>')
document.title = '小驹';
// localStorage.color = 'rgba(0,159,93,1)'
// document.write('<style>.main_color{color:'+localStorage.color+'}.main_bgcolor{background-color:'+localStorage.color+'}.border_bot{border-bottom:'+localStorage.color+' solid 1px}</style>');

var wxid = "wx71523d308b4c2563";
var netshopid="cqwx";
var apiList = new Array("getLocation","openLocation","scanQRCode","onMenuShareTimeline","onMenuShareAppMessage","previewImage");
var system = "android";
var version = "0.0.1";
var eventFlag = false;
var app = {};
var gps = {
    x : 0,
    y : 0,
    csmc : localStorage.cityname,
    flag : true,
}
app.check_wx= function(){
	var ua = navigator.userAgent.toLowerCase();
            var isWeixin = ua.indexOf('micromessenger') != -1;
            var isAndroid = ua.indexOf('android') != -1;
            var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
            if (!isWeixin) {
                document.head.innerHTML = '<title>抱歉，出错了</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"><link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/libs/weui/0.4.1/weui.css">';
                document.body.innerHTML = '<div class="weui_msg"><div class="weui_icon_area"><i class="weui_icon_info weui_icon_msg"></i></div><div class="weui_text_area"><h4 class="weui_msg_title">请在微信客户端打开链接</h4></div></div>';
            }
}
app.scanner = function(selProdCallBack)
{
    try {
        uexScanner.cbOpen = function (opCode, dataType, data) {
            if (opCode !== 0) alert("调用摄像头失败，请检查是否禁止了摄像头权限！");
            try { data = JSON.parse((data).toString()); } catch (e) { data = {}; }
            if (typeof selProdCallBack === "function") selProdCallBack(data.code, data.type);
        };
        uexScanner.open();
    } catch (err) {
    }
}
app.gpsfun = function(){
    //alert(JSON.stringify(gps))
}
app.location = function()
{
    uexLocation.closeLocation();
    uexLocation.openLocation();
    uexLocation.cbGetAddress = function(opCode, dataType, data)
    {
        var d = eval('(' + data + ')');
        localStorage.cityname = d.addressComponent.city;//市
        localStorage.district = d.addressComponent.district;//区
        localStorage.street = d.addressComponent.street;//街道
        localStorage.street_number = d.addressComponent.street_number;//街道号码
        gps.csmc = localStorage.cityname;
        gps.district = localStorage.district;
        gps.street = localStorage.street;
        gps.street_number = localStorage.street_number;
        app.gpsfun();
    }
    uexLocation.onChange = function(inLat, inLog)
    {
        if(gps.flag)
        {
            gps.flag = false;
            gps.x = inLat;
            gps.y = inLog;
            uexLocation.getAddress(gps.x, gps.y, 1);
        }
    }
}

// 获取当前页面名称
function getCurrentPageName() {
    var a = location.href;
    var b = a.split("/");
    var c = b.slice(b.length - 1, b.length).toString().split(".");
    return c.slice(0, 1).toString();
}
// 手机硬件控制
window.uexOnload = function (type) {
    // 设备完成事件分发
    if (typeof onDeviceReady === 'function') onDeviceReady(type);
    app.location();
    var name = getCurrentPageName();
    if (name == 'login') {
        uexWindow.setOrientation(1); // 设置不能横屏
        uexWindow.setReportKey(0, 1); // 物理返回键接管
        uexWindow.onKeyPressed = function (keyCode) {
            if (keyCode === 0){
                uexWindow.confirm({
                    title:"友情提示",
                    message:"确定退出程序吗?",
                    buttonLabels:"确定,取消"
                },function(index){
                    if(index == 0){
                        if(!localStorage.yhGuid || !localStorage.ztID){
                            uexWidgetOne.exit(0);
                        }else{
                            logout();
                        }
                    }
                });
            }
        };
        getInfo(16,function(err,data,dataType,optId){
            if(err){
                alert('get device error');
                return;
            }
            var d = eval('(' + data + ')');
            localStorage.golbalMac = d.macAddress;
            //alert(localStorage.golbalMac)
        });
    }else {
        uexWindow.setOrientation(1); // 设置不能横屏
        uexWindow.setReportKey(0, 1); // 物理返回键接管
        if( name !== 'index'){
            uexWindow.onKeyPressed = function (keyCode) {
                if (keyCode === 0) history.back();
            };
        }
    }
    // 蓝牙设备管理
    try {
        if (name === 'setting') {
            Components.bluetoothPrint.init('#bluetooth');
        } else {
            Components.bluetoothPrint.onConnectionLost();
        }
    } catch (err) {
    }
};
function getInfo(infoId,callback){
    if(typeof callback === 'function' ){
        uexDevice.cbGetInfo = function(optId,dataType,data){
            if(dataType != 1){
                return callback(new Error('get info error'+infoId));
            }
            callback(null,data,dataType,optId);
        };
    }
    uexDevice.getInfo(infoId);
}

function logout(){//注销账户的服务
	var vBiz = new FYBusiness("biz.com.logout");
	var vOpr1 = vBiz.addCreateService("svc.com.logout", false);
	var vOpr1Data = vOpr1.addCreateData();
	vOpr1Data.setValue("AS_USERID", LoginName);
	vOpr1Data.setValue("AS_WLDM", DepartmentCode);
	vOpr1Data.setValue("AS_FUNC", "svc.com.logout");
	vOpr1Data.setValue("AS_LOGINID", localStorage.yhGuid);
	vOpr1Data.setValue("AS_ZTID", localStorage.ztID);
	var ip = new InvokeProc();
	ip.addBusiness(vBiz);
	ip.invoke(function(d){
	    if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
	        uexWidgetOne.exit(0);
	    } else {
	        wfy.alert("注销失败，请重试！");
	    }
	}) ;
}

/*-------------------------------------微信------------------js sdk --------------------------*/
function wxStart()
{
    var pd = {
        netshopid : netshopid,
        noncestr : wfy.getRnd(16),
        timestamp : new Date().getTime(),
        url : encodeURIComponent(location.href)
    };
    $.ajax({
        type: "POST",
        url: _wfy_uni_url + "?method=getWxSignature",
        timeout: 30000,
        dataType: "json",
        async: true,
        data: 'data=' + JSON.stringify(pd),
        success: function(msg)
        {
            alert(JSON.stringify(msg));
            wx.config({
                debug : false,
                appId : wxid,
                timestamp : pd.timestamp,
                nonceStr : pd.noncestr,
                signature : msg.signature,
                jsApiList : apiList,
            });
            wx.ready(function(){
                wx.scanQRCode({
                    desc: 'scanQRCode desc',
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function (res) {
                        // 回调
                        alert('扫码是：'+JSON.stringify(res))
                    },
                    error: function(res){
                        if(res.errMsg.indexOf('function_not_exist') > 0){
                            alert('版本过低请升级')
                        }
                    }
                });
            });
        }
    });
}

window.onload = function () {
    //wxStart();
}

































