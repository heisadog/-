/**
 * Created by WFY02 on 2017/12/8.
 */
/*
 * 关于 销售，未结订单的支付，开单，收银的 支付
 * 1.支付的html
 * */
//收款
var payCollHtml = '<li data-type="cash" data-typedm="01" class="">'+
                    '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe637</div>'+
                        '<span style="width: 100px">现<i class="hidden">大</i>金</span>'+
                     '</div>'+
                     '<div class="bill_radio"></div>'+
                    '</li>'+
                    '<li class="none" data-type="fukuan" data-typedm="08">'+
                     '<i class="bill_kyed"></i>'+
                     '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe61e</div>'+
                        '<span style="width: 100px">钱<em class="hidden">大</em>包</span>'+
                        '</div>'+
                        '<div class="bill_radio"></div>'+
                    '</li>'+
                    '<li data-type="card" data-typedm="02">'+
                     '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe606</div>'+
                        '<span style="width: 100px">刷<i class="hidden">大</i>卡</span>'+
                        '</div>'+
                        '<div class="bill_radio"></div>'+
                    '</li>'+
                    '<li data-type="tencent" data-typedm="04">'+
                     '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe677</div>'+
                        '<span style="width: 100px">微<i class="hidden">大</i>信</span>'+
                        '</div>'+
                        '<div class="bill_radio"></div>'+
                    '</li>'+
                    '<li data-type="ali" data-typedm="03">'+
                     '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe67c</div>'+
                        '<span style="width: 100px">支付宝</span>'+
                        '</div>'+
                        '<div class="bill_radio"></div>'+
                    '</li>';
//付款 可输入
var payHtml = '<li data-type="cash" data-typedm="01" class="">'+
                    '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe637</div>'+
                        '<span>现<i class="hidden">大</i>金</span>'+
                        '<div class="bill_inp_bx">'+
                             '<input type="number" class="billInput" placeholder="￥" >'+
                        '</div>'+
                    '</div>'+
                    '<div class="bill_radio_close">&#xe69a</div>'+
                '</li>'+
                '<li class="none" data-type="fukuan" data-typedm="08">'+
                    '<i class="bill_kyed"></i>'+
                    '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe61e</div>'+
                        '<span>钱<em class="hidden">大</em>包</span>'+
                        '<div class="bill_inp_bx">'+
                             '<input type="number" class="billInput" placeholder="￥">'+
                        '</div>'+
                    '</div>'+
                    '<div class="bill_radio_close">&#xe69a</div>'+
                '</li>'+
                '<li data-type="card" data-typedm="02">'+
                    '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe606</div>'+
                        '<span>刷<i class="hidden">大</i>卡</span>'+
                        '<div class="bill_inp_bx">'+
                             '<input type="number" class="billInput" placeholder="￥">'+
                        '</div>'+
                    '</div>'+
                    '<div class="bill_radio_close">&#xe69a</div>'+
                '</li>'+
                '<li data-type="tencent" data-typedm="04">'+
                    '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe677</div>'+
                        '<span>微<i class="hidden">大</i>信</span>'+
                        '<div class="bill_inp_bx">'+
                             '<input type="number" class="billInput" placeholder="￥">'+
                        '</div>'+
                    '</div>'+
                    '<div class="bill_radio_close">&#xe69a</div>'+
                '</li>'+
                '<li data-type="ali" data-typedm="03">'+
                    '<div class="pay_inputandicon">'+
                        '<div class="bill_pay_icon">&#xe67c</div>'+
                        '<span>支付宝</span>'+
                        '<div class="bill_inp_bx">'+
                             '<input type="number" class="billInput" placeholder="￥">'+
                        '</div>'+
                    '</div>'+
                    '<div class="bill_radio_close">&#xe69a</div>'+
                '</li>';

var botBtnHtml ='<div class="pub_num">总数：<span id="totalNum">0</span></div>'+
                '<div class="pub_num">总额：<span>￥</span><span id="totalMoney">0</span></div>'+
                '<div class="pub_num pub_btn" id="sub" style="width: 120px">提交</div>';
var botBtnHtml_dtl ='<div class="pub_num">总数：<span id="totalNum">0</span></div>'+
    '<div class="pub_num">总额：<span>￥</span><span id="totalMoney">0</span></div>'+
    '<div class="pub_num pub_btn cabsdot_bosdt" id="sub_save" style="width: 60px">提交</div>'+
    '<div class="pub_num pub_btn" id="sub_sale" style="width: 60px">收银</div>';
var botBtnHtml_coll = '<div class="pub_num pub_btn" id="sub" style="width: 100%">提交</div>';

var botBtnHtml_noend =  '<div class="pub_num">总额：<span>￥</span><span id="totalMoney">0</span></div>'+
                        '<div class="pub_num" style="color: #fff;background-color: #f60" id="cannoend">取消</div>'+
                        '<div class="pub_num pub_btn" id="sub_noend" style="width: 120px">提交</div>';

var operNo = ""; //操作号
var noteNo = ""; //小票号码
var preOrdno=''; //生成预订单的 单号
var hykh = ''; //客户 卡号
var kyed = 0; // 会员可用额度
var ishykh = false;//是否选择了客户

var AppId = "201705041538001234567887654321";
var IsPrint = "true";

var orderAmount = 0;// 订单金额
var sk_typedm = '';// 收款--支付方式
var sk_paylx = '';// 收款 ---支付类型
var rescodeDate ='';//支付日期
var runningWater='';// 支付流水号码 ----参考号
var cardNo ='';//支付账号*（银行卡等）
var merchantNo = '';//商户编号
var mainPayType = '';//销售收银多组合 主体支付方式
var mainPayTypeJe = '';//销售收银多组合 主体支付金额

$(function () {
    if(pageName == 'msa030_0100'){//销售收银
        $('#pay_style').html(payHtml);
    }
    if(pageName == 'msa030_0200'){//收款
        $('#pay_style').html(payCollHtml);
    }
    if(pageName == 'msa030_0900'){//未结订单 de 收银弹窗
        $('#pay_style').html(payHtml).css({
            'padding-bottom':'70px'
        });
        // if(wfy.pageName() == 'bill_noend'){
        //     $('#pub_bottom_btn').html(botBtnHtml_noend);
        // }

    }
    $("body").hammer().on("tap", ".bill_radio_close", function (event) {
        event.stopPropagation();
        $(this).parent('li').removeClass('poschecked');
        $(this).prev().removeClass('poschecked');
        $(this).prev().find('.billInput').val("");
    });
    //---------------------------------------------------点击 提交（销售 和 收款。销售开单··）--------------------------
    $('body').hammer().on('tap','#sub',function (event) {
        event.stopPropagation();
        // 销售收银
        var cont = [];
        for(var a = 0; a<data.length;a++){
            cont = cont.concat(data[a].cont);
        }
        hykh = $('#createKehu').attr('data-hykh');
        //销售收银 he 关于未结订单 列表的
        if(pageName == 'msa030_0100' || pageName =="msa030_0900"){
            orderAmount = Number($('#totalMoney').html());
            var tipCont = '您选择的支付信息<br> ';
            var pay_check_dm = [];
            var pay_check_mc = [];
            var pay_check_je = [];
            var pay_check_je_total = 0;
            //
            $('#pay_style li.poschecked').each(function () {
                var dm = $(this).attr('data-typedm');
                var mc = $(this).find('span').html();
                var je = Number($(this).find('.billInput').val());
                if(je < 0){
                    je = je*(-1);
                }
                if(je != 0){
                    pay_check_dm.push(dm);
                    pay_check_mc.push(mc);
                    pay_check_je.push(je);
                    pay_check_je_total = Components.add(pay_check_je_total,je);
                }
                

            })
            if(cont.length == 0){
                wfy.alert('请先选择商品');
                return false;
            }
            if(pageName == 'msa030_0100'){//销售收银 验证支付方式
                if($('#pay_style li.poschecked').length == 0){
                    wfy.alert('请先设置支付方式');
                    return false;
                }
            }
            console.error(orderAmount);
            //-----------------------------对于金额的判断 分开执行----------------------------
            if(orderAmount <= 0){
                orderAmount = orderAmount*(-1);
                //涉及到负销售
                var is_fa = false;
                $('#pay_style li:gt(1)').each(function () {
                    if($(this).hasClass('poschecked')){
                        is_fa = true;
                        $(this).children('.pay_inputandicon').removeClass('poschecked')
                        $(this).removeClass('poschecked').find('.billInput').val("");
                    }
                })
                if(is_fa || ($('#pay_style li[data-type="cash"]').hasClass('poschecked') && $('#pay_style li[data-type="fukuan"]').hasClass('poschecked'))){
                    wfy.alert('销售金额为负数，只能选择现金或者钱包中的一种');
                    return false;
                }

                if( pay_check_je_total != orderAmount){
                    wfy.alert('销售金额为负数,输入金额与订单金额不相等，请重新输入！');
                    return false;
                }
            }else{
                //首先如果有选客户，验证客户的额度
                if(ishykh){
                    var val_yf =  $('#pay_style li[data-type="fukuan"]').find('.billInput').val();
                    if(val_yf > kyed){
                        wfy.alert("钱包金额大于用户可用额度！");
                        return false;
                    }
                }
                if(pay_check_je_total > orderAmount){
                    wfy.alert("输入的支付金额大于订单金额，请重新设置支付金额！");
                    return false;
                }
                //-----抹零
                if((orderAmount - pay_check_je_total) > 10){
                    wfy.alert("支付总金额与订单金额相差较大，请重新设置支付金额！");
                    return false;
                }
            }
            for(var i = 0; i<pay_check_dm.length;i++){
                if(pay_check_je[i]){
                    tipCont += '<div style="width: 100%;height:36px;overflow: hidden">' +
                        '<span style="float:left;width: 40%; margin-left: 10%">'+pay_check_mc[i]+':</span>' +
                        '<span style="float: left;width: 50%">'+pay_check_je[i]+'元</span>' +
                        '</div>';
                }
            }
            if((orderAmount - pay_check_je_total) != 0){
                tipCont +='支付金额与订单金额相差'+Components.sub(orderAmount , pay_check_je_total)+
                    '元,抹掉'+Components.sub(orderAmount , pay_check_je_total)+'元';
            }
            wfy.confirm(tipCont,function () {
                //如果用户取消 支付，再次点击的时候 生成预订单失败。需要验证预订单的存在
                if(preOrdno == ''){
                    createOrder();
                }else{
                    //直接走支付
                    updaState(getCommRequestBean()[2])
                }

            },function () {

            });

            
        }
        //销售开单
        if(pageName =="msa030_0800"){
            if(cont.length == 0){
                wfy.alert('请先选择商品');
                return false;
            }
            createOrder();
        }
        //收款
        if(pageName == 'msa030_0200'){
            sk_typedm = $('#pay_style li.poschecked').attr('data-typedm');//收款只有一个付款方式
            orderAmount = Number($('#createMoney').val());
            if(sk_typedm =='02'){//银行卡
                sk_paylx = '2';
            }
            if(sk_typedm =='04'){//微信
                sk_paylx = '6';
            }
            if(sk_typedm =='03'){//支付宝
                sk_paylx = '5';
            }
            if(wfy.empty(hykh)){
                wfy.alert('请先选择客户');
                return false;
            }
            if(orderAmount == ""){
                wfy.alert('请先输入金额');
                return false;
            }
            if(orderAmount < 0){
                wfy.alert('收款金额不能小于0');
                return false;
            }
            if($('#pay_style li.poschecked').length == 0){
                wfy.alert('请先设置支付方式');
                return false;
            }
            getorder("",function (res) {
                console.log(res)
                noteNo = res[0].orderid;
                if(sk_typedm == '01'){
                    //现金
                    payOverCallback(false);
                }
                if(sk_typedm == '04' || sk_typedm == '03' || sk_typedm == '02'){
                    //扫一扫deng
                    payOverCallback(true);
                }
            });
        }
    })

    //------------------------------------------点击 提交（关于未结订单 列表的）-------------------------------------------
    $("body").hammer().on("tap", "#sub_noend", function (event) {
        operNo = czhm;
        noteNo = xtxphm;
        preOrdno= czhm;
        if($('#pay_style li.poschecked').length == 0){
            wfy.alert('请先设置支付方式');
            return false;
        }
        //可能多个组合付款方式，先 做个支付信息的提示
        var pay_check_dm = [];
        var pay_check_mc = [];
        var pay_check_je = [];
        var pay_check_je_total = 0
        $('#pay_style li.poschecked').each(function () {
            var dm = $(this).attr('data-typedm');
            var mc = $(this).find('span').html();
            var je = Number($(this).find('.billInput').val());
            if(je < 0){
                je = je*(-1);
            }
            if(je != 0){
                pay_check_dm.push(dm);
                pay_check_mc.push(mc);
                pay_check_je.push(je);
                pay_check_je_total = Components.add(pay_check_je_total,je);
            }
        })
        var pay = [];
        $('#pay_style li.poschecked').each(function () {
            if(Number($(this).find('.billInput').val()) != 0){
                var payobj = {};
                payobj.payFee = $('#totalMoney').html();
                payobj.payType = $(this).attr('data-typedm');//支付方式
                payobj.payTypeMc = $(this).find('span').html();// 支付方式名称
                payobj.kyed = kyed;//可用额度
                payobj.payTypeFee = Number($(this).find('.billInput').val());
                pay.push(payobj);
            }

        })
        console.error(pay);
        //验证
        //首先如果有选客户，验证客户的额度
        if(ishykh){
            var val_yf =  Number($('#pay_style li[data-type="fukuan"]').find('.billInput').val());
            if(val_yf > kyed){
                wfy.alert("钱包金额大于用户可用额度！");
                return false;
            }
        }
        console.log(orderAmount)
        if(orderAmount <=0){
            orderAmount = orderAmount*(-1);
            var is_fa = false;
            $('#pay_style li:gt(1)').each(function () {
                if($(this).hasClass('poschecked')){
                    is_fa = true;
                    $(this).children('.pay_inputandicon').removeClass('poschecked')
                    $(this).removeClass('poschecked').find('.billInput').val("");
                }
            })
            if(is_fa || ($('#pay_style li[data-type="cash"]').hasClass('poschecked') && $('#pay_style li[data-type="fukuan"]').hasClass('poschecked'))){
                wfy.alert('销售金额为负数，只能选择现金或者钱包中的一种');
                return false;
            }

            if( pay_check_je_total != orderAmount){
                wfy.alert('销售金额为负数,输入金额与订单金额不相等，请重新输入！');
                return false;
            }
        }else {
            if(pay_check_je_total > orderAmount){
                wfy.alert("输入的支付金额大于订单金额，请重新设置支付金额！");
                return false;
            }
            if((orderAmount - pay_check_je_total) > 10){
                wfy.alert("支付总金额与订单金额相差较大，请重新设置支付金额！");
                return false;
            }
        }
        var tipCont = '您选择的支付信息<br> ';
        for(var i = 0; i<pay_check_dm.length;i++){
            if(pay_check_je[i]){
                tipCont += '<div style="width: 100%;height:36px;overflow: hidden">' +
                    '<span style="float:left;width: 40%; margin-left: 10%">'+pay_check_mc[i]+':</span>' +
                    '<span style="float: left;width: 50%">'+pay_check_je[i]+'元</span>' +
                    '</div>';
            }
        }
        if((orderAmount - pay_check_je_total) != 0){
            tipCont +='支付金额与订单金额相差'+Components.sub(orderAmount , pay_check_je_total)+
                '元,如果确认付款，相当于抹掉'+Components.sub(orderAmount , pay_check_je_total)+'元';
        }
        wfy.confirm(tipCont,function () {
            updaState(pay)
        },function () {

        });

    });
})
// 生成 预订单
function createOrder() {
    var cont = [];
    var list=[];
    for(var a = 0; a<data.length;a++){
        cont = cont.concat(data[a].cont);
    }
    console.error(cont)
    for (var i = 0 ; i< cont.length;i++){
        var obj ={};
        obj['actualFee'] = (cont[i].price)*(cont[i].num);// 神马价格？   //实收金额
        obj['discountReason'] = '';//
        obj['giftFlag'] = 'N';//赠品标志
        obj['khhyzk'] = '0';//zhe折扣？
        obj['lineNo'] = i+1;//行号？
        obj['mainGuide'] = guidedm;//
        obj['qty'] = cont[i].num;//
        obj['saleFee'] = cont[i].wpdj;//   销售金额
        obj['sku'] = cont[i].sku;//
        obj['wpxsdj'] = cont[i].wpdj;//
        obj['xtcxyy'] = '';//
        obj['xtcxzk'] = '1';//
        obj['xtssje'] = cont[i].price;//
        obj['xtwpdm'] = cont[i].sku;// 物品代码 = sku
        obj['xtwpks'] = cont[i].price;//
        obj['xtwplj'] = '';//
        obj['xtwpmc'] = cont[i].ksmc;//
        obj['xtwpsl'] = cont[i].num;//
        obj['xtwpxh'] = cont[i].style;//
        obj['xtysmc'] = cont[i].color;//
        list.push(obj);
    }
    var perOrder = {
        "requestName": "posMsgSave",
        "identityId": "",
        "requestNo": "PosMsgSave",
        "commRequestBean": getCommRequestBean()[0],//对象格式
        "posOrderHeadRequestBean": getCommRequestBean()[1],//对象格式
        "posPaymentList": [],//对象数组格式  getCommRequestBean()[2],修改：生成预订单--的时候支付为空。
        "posCouponList": null,
        "posPrePayCardList": null,
        "posCardList": null,
        "posOrderProductList": list,//对象数组格式
        "posGuideList": getCommRequestBean()[3]//对象数组格式
    }; //预订单信息
    console.log(perOrder);
    var callService = new CallService("posMsgSave", _wfy_order_svr); //创建一个调用外部服务的方法
    wfy.showload("正在保存预订单");
    callService.invoke(perOrder, function(d)
        {
            wfy.hideload();
            console.log(d);
            if(d.success) //调用成功
            {
                preOrdno = d.preOrdno; //预订单单号
                console.log('预订单单号+'+preOrdno);
                //在此区分  销售 还是 开单
                if(pageName == 'msa030_0800'){//销售开单
                    wfy.alert("单据开票成功",function () {
                        window.location.reload();
                    })
                }
                if(pageName == 'msa030_0100'){//销售收银
                    updaState(getCommRequestBean()[2]);
                }
            }
            else {
                wfy.alert(d.errorMessage);
            }
        },
        function()
        {
            alert(JSON.stringify(data));
        },
        true);
}



//支付完 的回调  ----只用在收款模块（向数据库保存银行收款信息）
var payOverCallback = function (flag) {
    var vBiz = new FYBusiness("biz.vipremoney.cash.save");
    var vOpr1 = vBiz.addCreateService("svc.pos.cashreturn.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.cashreturn.save");
    vOpr1Data.setValue("AS_XTXPHM", noteNo);//小票号
    vOpr1Data.setValue("AS_KHHYKH", hykh);//会员卡号
    vOpr1Data.setValue("AN_KHCZJE", Number(orderAmount));//金额
    vOpr1Data.setValue("AS_XTWLDM", storewldm);//往来门店
    vOpr1Data.setValue("AS_KHCZLX", "00");//操作类型 00-收款 05退货
    var vOpr2 = vBiz.addCreateService("svc.pos.cashpay.save", false);
    var vOpr2Data = vOpr2.addCreateData();
    vOpr2Data.setValue("AS_USERID", LoginName);
    vOpr2Data.setValue("AS_WLDM", DepartmentCode);
    vOpr2Data.setValue("AS_FUNC", "svc.pos.cashpay.save");
    vOpr2Data.setValue("AS_KHCZID", noteNo);//小票号
    vOpr2Data.setValue("AS_XSZFFS", sk_typedm);//支付方式 ---只有收款传，其他模块是空
    vOpr2Data.setValue("AN_XSZFJE", Number(orderAmount));//支付金额

    // 只有 非现金支付的方式 才有第三个
    if(flag){
        var vOpr3 = vBiz.addCreateService("svc.pos.cashpaydtl.save", false);
        var vOpr3Data = vOpr3.addCreateData();
        vOpr3Data.setValue("AS_USERID", LoginName);
        vOpr3Data.setValue("AS_WLDM", DepartmentCode);
        vOpr3Data.setValue("AS_FUNC", "svc.pos.cashpaydtl.save");
        vOpr3Data.setValue("AS_KCCZHM", noteNo);//小票号
        vOpr3Data.setValue("AS_KCDJDH", noteNo);//小票号
        vOpr3Data.setValue("AS_YSDJDH", noteNo);//小票号
        vOpr3Data.setValue("AS_XSZFFS", sk_typedm);//支付方式
        vOpr3Data.setValue("AS_XTCZLX", "0");//操作类型  0--收款 1 --退款
        vOpr3Data.setValue("AS_XSJFLX", sk_paylx);//支付类型（5;支付宝  6：微信 2银行卡）
        vOpr3Data.setValue("AS_XSZFZH", "");//公司支付账号
        vOpr3Data.setValue("AS_XTXPHM", noteNo);//小票号码
        vOpr3Data.setValue("AS_YSXPHM", noteNo);//同上
        vOpr3Data.setValue("AS_DDZFJE", Number(orderAmount));// 支付金额
        vOpr3Data.setValue("AS_XSZFZT", "SUCCESS");//支付状态  FAILED：失败   SUCCESS：支付成功   UNKNOWN：异常    CREATE：支付创建等待客户输入密码
        vOpr3Data.setValue("AS_ZFSBYY", "");//失败愿因
        vOpr3Data.setValue("AS_MJZFTM", "");// 买家支付条码
        vOpr3Data.setValue("AS_MJZFZH", "");//买家支付号码
        vOpr3Data.setValue("AN_XTJYJE", Number(orderAmount));//交易金额 商品定价总金额 ，没有就空
        vOpr3Data.setValue("AN_XTSSJE", Number(orderAmount));// 实收金额 -----单据最后总金额
        vOpr3Data.setValue("AN_MJFKJE", Number(orderAmount));// 买家实际付款金额 ----刷卡等操作的金额（除现金）， 上述三个金额。收款模式下相同！！！
        vOpr3Data.setValue("AS_ZFLSHM", runningWater);// 支付流水号码 ----参考号
        vOpr3Data.setValue("AS_XSFKRQ", rescodeDate);//日期
        vOpr3Data.setValue("AS_ZFTJXX", "");//支付提交信息
        vOpr3Data.setValue("AS_ZFFHXX", "");//支付返回信息
    }
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    console.log(JSON.stringify(ip));
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            wfy.alert("收款成功！",function () {
                window.location.reload();
            })
        } else {
            // todo...[d.errorMessage]
            wfy.alert("回调失败"+d.errorMessage)
        }
    }) ;
}


function updaState(pay) {
    var vBiz = new FYBusiness("biz.pos.pay.status.save");
    var vOpr1 = vBiz.addCreateService("svc.pos.paymode.save", false);
    var vOpr1Data = [];
    for(var i =0; i<pay.length; i++){
        var o = {};
        o.AS_USERID = LoginName;
        o.AS_WLDM = DepartmentCode;
        o.AS_FUNC = "svc.pos.paymode.save";
        o.AS_KCCZHM =operNo; //操作号码
        o.AS_XSZFFS = pay[i].payType;//支付方式
        o.AN_XSZFJE = Number(pay[i].payTypeFee) ;//支付金额
        o.AN_XSDKJF = 0;
        o.AN_YDZFJE = 0;//原单支付金额 为0
        o.AN_YDDKJF = 0;
        o.AS_XSZFZH = '';//银行卡号
        o.AS_XTXPHM = noteNo;//x小票号码
        o.AS_ZFLSHM = '';//流水号（参考号）
        vOpr1Data.push(o);
    }
    vOpr1.addDataArray(vOpr1Data)
    var vOpr2 = vBiz.addCreateService("svc.pos.paystatus.upt", false);
    var vOpr2Data = vOpr2.addCreateData();
    vOpr2Data.setValue("AS_USERID", LoginName);
    vOpr2Data.setValue("AS_WLDM", DepartmentCode);
    vOpr2Data.setValue("AS_FUNC", "svc.pos.paystatus.upt");
    vOpr2Data.setValue("AS_KCCZHM",preOrdno);
    var vOpr3 = vBiz.addCreateService("svc.pos.preposexec.save", false);
    var vOpr3Data = vOpr3.addCreateData();
    vOpr3Data.setValue("AS_USERID", LoginName);
    vOpr3Data.setValue("AS_WLDM", DepartmentCode);
    vOpr3Data.setValue("AS_FUNC", "svc.pos.preposexec.save");
    vOpr3Data.setValue("AS_PRECZHM", preOrdno);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    console.log(JSON.stringify(ip));
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            Components.alert('生成订单成功！',function () {
                if(pageName =='msa030_0900'){
                    wfy.pagegoto('bill_noend');
                }else {
                    window.location.reload();
                }
            });
        } else {
            // todo...[d.errorMessage]
            wfy.alert('操作失败！'+d.errorMessage)
        }
    }) ;
}
