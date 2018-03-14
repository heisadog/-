localStorage.his = "bill_noend";
localStorage.prev = "worktable";

var pageSize = 10,pageNum = 1,hasMore = false, isLoading = false;
var pageName = 'msa030_0900';
$(function () {
    getOrderList();
    //取消
    $("body").hammer().on("tap", ".btnde", function (event) {
        event.stopPropagation();
        var czhm = $(this).parent().attr("data-kcczhm");//操作号码
        wfy.confirm("是否取消预订单？",function () {
            cancelOrd(czhm);
        },function () {});
    });
    //支付
    $("body").hammer().on("tap", ".btnpay", function (event) {
        event.stopPropagation();
        orderAmount = $(this).parent().attr("data-ddyfje");//订单金额
        if(orderAmount < 0){
            wfy.alert('此未结订单金额小于0，建议直接删除重新做单！')
        }else {
            czhm = $(this).parent().attr("data-kcczhm");//操作号码
            var yhkh = $(this).parent().attr("data-khhyxm");//客户
            xtxphm = $(this).parent().attr("data-xtxphm");//
            kyed = wfy.empty($(this).parent().attr("data-hykyed")) ? 0 : Number($(this).parent().attr("data-hykyed"));//可用额度
            $('#pay_style li').eq(1).find('i').html('可用：'+kyed);
            ishykh = !wfy.empty(yhkh);
            if(ishykh){
                $('#pay_style li[data-type="fukuan"]').removeClass('none');
            }
            $('#totalMoney').html(orderAmount);
            wfy.openPay('pay_alert_box');
        }

    });
    //取消支付
    $("body").hammer().on("tap", "#cannoend", function (event) {
        event.stopPropagation();
        $('#wfyContList .list_item_1').removeClass('x_left_160');
        wfy.closePay();
    });
    //点击选择 支付方式(当以预付款方式为主要支付方式的时候，需要验证 额度和商品金额)
    $('body').hammer().on('tap','#pay_style li .pay_inputandicon',function (event) {
        event.stopPropagation();
        var paytype = $(this).parent().attr('data-type');
        if(paytype == "tencent" || paytype == "ali" || paytype=="card"){
            var li_val = $(this).find('.billInput').val();
            $('#pay_style li:gt(1)').children('.pay_inputandicon').removeClass('poschecked').find('.billInput').val("");
            $('#pay_style li:gt(1)').removeClass('poschecked');
            $(this).find('.billInput').val(li_val);
            $(this).addClass('poschecked');
            $(this).parent('li').addClass('poschecked');
        }else {
            $(this).addClass('poschecked');
            $(this).parent('li').addClass('poschecked');
        }
    })
    //转单
    $("body").hammer().on("tap", ".btngo", function (event) {
        event.stopPropagation();
        var czhm = $(this).parent().attr("data-kcczhm");//操作号码
        saveFinalOrd(czhm);
    });
    //进入明细页
    $('body').hammer().on("tap",'.wfyContList .list_item_1',function (event) {
        event.stopPropagation();
        var clicked = $(event.target);//触发元素
        console.log(clicked);
        var czhm = $(this).attr('data-czhm');
        localStorage.yd_czhm = czhm;
        wfy.goto('bill_noend_dtl');
    })

});

function getOrderList(){//获取订单列表
    var vBiz = new FYBusiness("biz.pos.unfinishord.page.qry");
    var vOpr1 = vBiz.addCreateService("svc.pos.unfinishord.page.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.unfinishord.page.qry");
    vOpr1Data.setValue("AS_OPRER", LoginName);
    vOpr1Data.setValue("AN_PSIZE", pageSize);
    vOpr1Data.setValue("AN_PINDEX", pageNum);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    //console.log(JSON.stringify(ip))
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var res = vOpr1.getResult(d, "AC_UNFINISHORD").rows;
            console.log(res);
            pageCreate(res);
        } else {
            wfy.alert("获取订单列表失败！");
        }
    }) ;
}

//生成页面
function pageCreate(rows) {
    var html = "";
    var result = rows;
    var b = '';
    if(pageNum == 1 && rows.length == 0){
        html= wfy.zero();
    }
    for (var i = 0; i<result.length; i++){
        if(result[i].kcczzt == '20'){
            b = '<div class="list_item_btn btngo">转单</div>';
        }else {
            b = '<div class="list_item_btn btnde">取消</div>' +
                '<div class="list_item_btn btnpay" style="background-color:#04BE02;">支付</div>';
        }
        html+='<div class="list_1 list_swiper" style="height:90px; font-size:13px;" ' +
            'data-hykyed="'+result[i].hykyed+'" ' +
            'data-khhyxm="'+result[i].khhyxm+'" ' +
            'data-kcczhm="'+result[i].kcczhm+'" ' +
            'data-ddyfje="'+result[i].ddyfje+'" ' +
            'data-xtwldm="'+result[i].xtwldm+'">'+
                '<div class="list_item_1 thd ts200" data-czhm="'+result[i].kcczhm+'">'+
                    '<div class="item_line">'+
                        '<span class="">小票号码：<span style="color:#000">'+result[i].xtxphm+'</span></span>'+
                         '<span class="fr">客户：' +
             '<span>'+(result[i].khhyxm || '<i style="visibility: hidden">刘光祥</i>')+'</span></span>'+
                    '</div>'+
                    '<div class="item_line">'+
                        '<span class="">支付状态：<span>'+result[i].czztmc+'</span></span>'+
                         '<span class="fr">开单人：<span>'+result[i].lrrymc+'</span></span>'+
                    '</div>'+
                    '<div class="item_line">'+
                        '<span class="">商品数量：<span>'+result[i].kcczsl+'</span></span>'+
                        '<span class="fr">应付金额：<span>'+wfy.setTwoNum(result[i].ddyfje,2)+'</span></span>'+
                    '</div>'+
                '</div>'+
                '<div class="list_drap"' +
                    'data-hykyed="'+result[i].hykyed+'" ' +
                    'data-khhyxm="'+result[i].khhyxm+'" ' +
                    'data-kcczhm="'+result[i].kcczhm+'" ' +
                    'data-ddyfje="'+result[i].ddyfje+'" ' +
                    'data-xtxphm="'+result[i].xtxphm+'" ' +
                    'data-xtwldm="'+result[i].xtwldm+'">'+b+
                '</div>'+
             '</div>';
    }
    $('#wfyContList').append(html);
    //分页 10个一组 ，加载动画初始化 不显示。带有none
    if(rows.length ==10){//一次性取10个，达到10个的时候，显示 加载动画
        $("#scrollload").removeClass("none");
    }
    if( pageNum > 1 && rows.length ==0){
        $("#scrollload span").html("没有更多了...");
        setTimeout(function () {
            $("#scrollload").addClass("none");
            $("#scrollload span").html("正在加载");
        },1000);
    }
    
    $("#wfyCont").scroll(function () {
        //console.log($("#wfyContList").Scroll());
        //loading 是根据 加载动画是否显示 判断
        if($("#wfyContList").Scroll() < 10){
            if(!$("#scrollload").hasClass("none")){
                isLoading = true;
            }
            setTimeout(function () {
                if(isLoading ){
                    pageNum ++;
                    getOrderList();
                    isLoading = false;
                }
            },1000);
        }

    });
}

//================================================================================










function factPay()
{
    var poppayid = $("#poppayid").val();
    var popauthcode = $("#popauthcode").val();

    if(!poppayid)
    {
        wfy.alert("未能获取到支付码");
        return false;
    }

    if(!popauthcode)
    {
        wfy.alert("未能获取到验证码信息");
        return false;
    }

    var payobj = {
        "requestName"    :"posPaymentService",
        "out_request_no" : poppayid,
        "identityId"     : curpreordno,
        "authCode"       : popauthcode,
        "opruser"        : LoginName
    };
    console.log(payobj);
    //支付内容
    var callPay = new CallService("posPaymentService", _wfy_order_svr); //创建一个调用外部服务的方法
    wfy.loading("cover", "", "正在发起支付请稍后...");
    callPay.invoke(payobj, function(d)
        {
            wfy.unload();
            if(d.success) //调用成功微信支付成功
            {
//              console.info(d);
                if(d.payStatus == "USERPAYING") //支付中可能需要输入密码延迟10秒后关闭结果
                {
                    wfy.loading("正在等待密码验证...");
                    setTimeout(function(){qryPayResult(poppayid);}, 15000 )
                }else if(d.payStatus=="SUCCESS")  //成功直接回执结果
                {
                    //执行订单执行服务
                    saveFinalOrd();
                    // setPayStatus();
                }
            }
            else
            {
                alert(d.errorMessage);
            }
        },
        function()
        {
            alert(JSON.stringify(data));
        },
        true);
}

//查询支付结果
function qryPayResult(paytradeno) {
    var qryPayResult =
        {   "out_request_no":paytradeno,
            "identityId":curpreordno,
            "requestNo":paytradeno,
            "requestName":"posTradeQryService"
        };
    var callpayqry = new CallService("posTradeQryService", _wfy_order_svr); //创建一个调用外部服务的方法
    wfy.loading("cover", "正在等待输入密码并等待查询支付结果...", "正在等待输入密码并等待查询支付结果...");
    callpayqry.invoke(qryPayResult, function(d)
        {
            wfy.unload();
            if(d.success) //调用成功
            {
                console.info(d);
                saveFinalOrd();
                ///setPayStatus(); //设置状态
                //funs.goto("orderFinish");
            }
            else
            {
                alert(d.errorMessage);
            }
        },
        function()
        {
            alert(JSON.stringify(data));
        },
        true);
};
//保存现金支付




//销售收银更新支付状态  （用于现金 和 预付款 支付）
function updatePayStatus(AS_KCCZHM) {
    var biz = new FYBusiness('biz.pos.paystatus.upt');
    var svc = biz.addCreateService("svc.pos.paystatus.upt",false);
    var data = svc.addCreateData();
    data.setValue("AS_USERID", LoginName);
    data.setValue("AS_WLDM", DepartmentCode);
    data.setValue("AS_FUNC", "svc.pos.paystatus.upt");
    data.setValue("AS_KCCZHM",AS_KCCZHM);
    var ip = new InvokeProc("true","proc");
    ip.addBusiness(biz);
    ip.invoke(function (res) {
        if(res && res.success)
        {
            wfy.closePay();
            console.info(res);
            saveFinalOrd(czhm); //支付成功将订单转换为正式订单
        }else{
            wfy.closePay();
            wfy.hideload();
            wfy.alert("支付状态更新失败！");
            //funs.goto("myOrder");
        }
    });
}

//将预订单转换为最终的订单保存最终的订单信息
function saveFinalOrd(czhm) {
    wfy.showload();
    var biz = new FYBusiness("biz.pos.preposexec.save");
    var svc = biz.addCreateService("svc.pos.preposexec.save", false);
    var data = svc.addCreateData();
    data.setValue("AS_USERID", LoginName);
    data.setValue("AS_WLDM", DepartmentCode);
    data.setValue("AS_FUNC", "svc.pos.preposexec.save");
    data.setValue("AS_PRECZHM", czhm);
    data.setValue("AS_KCCZHM","");
    data.setValue("AS_KCPDHM","");
    data.setValue("AS_THCZHM","");
    data.setValue("AS_THXPHM","");
    var ip = new InvokeProc("ture","proc");
    ip.addBusiness(biz);
    console.log(JSON.stringify(ip))
    ip.invoke(function (res) {
        wfy.hideload();
        if (res && res.success) {
            wfy.hideload();
            wfy.alert("订单生成成功",function () {
                $('#wfyContList').html("");
                pageNum=1;
                getOrderList();
            });
        } else {
            wfy.hideload();
            wfy.alert("预订单转换为正式订单失败！");
        }
    });
}

function cancelOrd(czhm){//取消预订单
    var vBiz = new FYBusiness("biz.pos.preposord.cancle");
    var vOpr1 = vBiz.addCreateService("svc.pos.preposord.cancle", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.preposord.cancle");
    vOpr1Data.setValue("AS_PRE_OPRER_NO", czhm);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    console.log(JSON.stringify(ip))
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            $('#wfyContList').html("");
            pageNum=1;
            getOrderList();
        } else {
            wfy.alert(d.errorMessage);
        }
    }) ;
}






