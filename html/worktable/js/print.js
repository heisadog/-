localStorage.his = 'print';
localStorage.prev = 'index';
var currentTab="POSS";
if(!localStorage.printFormat){
    localStorage.printFormat = "57";
}
var index = 1 ;//页码
var loading = false;

$(function () {
    var cfg = {
        cont:["POS销售","POS退货"/*,"发货单","退货单"*/],
        data:["POSS","POST"/*,"FHD","THD"*/],
        callback:dov
    };
    $("#cs").taber(cfg);
    //滑动
    ajaxListData(currentTab);
    //打印
    $('body').hammer().on('tap','#wfyContList .list_item_btn',function (event) {
        event.stopPropagation();
        var czhm = $(this).parents('.list_1').attr('data-czhm');
        var xphm = $(this).parents('.list_1').attr('data-xphm');
        Components.bluetoothPrint.printSaleTicket(czhm, xphm,localStorage.printFormat);
    })
    
})
function dov(d) {
    $("#wfyContList").html("");
    $("#scrollload").addClass("none");
    currentTab=$(d).attr("data-type");
    ajaxListData(currentTab);
}
function ajaxListData(record) {
    wfy.showload();
    var vBiz = new FYBusiness('biz.sa.work.djbd.qry');
    var vOpr1 = vBiz.addCreateService('svc.sa.work.djbd.qry', false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue('AS_USERID', LoginName);
    vOpr1Data.setValue('AS_WLDM', DepartmentCode);
    vOpr1Data.setValue('AS_FUNC', 'svc.sa.work.djbd.qry');
    vOpr1Data.setValue('AS_XTWLDM', "");
    vOpr1Data.setValue('ADT_CZRQQS', "");//searchCondition['start_date']
    vOpr1Data.setValue('ADT_CZRQJZ', "");//searchCondition['end_date']
    vOpr1Data.setValue('AS_ZFFS', "");
    vOpr1Data.setValue('AS_TYPE', record);
    vOpr1Data.setValue("AN_PSIZE", "10");
    vOpr1Data.setValue("AN_PINDEX", index);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function (d) {
        wfy.hideload();
        if ((d.iswholeSuccess === 'Y' || d.isAllBussSuccess === 'Y')) {
            var res = vOpr1.getResult(d, 'AC_DJBD').rows || [];
            var html = '';
            if(res.length == 0 && index == 1){
                html = wfy.zero();
            }
            for(var i = 0; i< res.length; i++){
                html+='<div class="list_1 list_swiper" style="height: 60px;" data-czhm="'+res[i].kcczhm+'" data-xphm="'+res[i].xtxphm+'">' +
                            '<div class="list_item_1 thd ts200" >'+
                                '<div class="item_line">' +
                                    '<span class="black">'+(res[i].kcckmc || '')+'</span>' +
                                    '<span class="fr">'+(res[i].xtxphm || '')+'</span>' +
                                '</div>'+
                                '<div class="item_line" style="font-size:12px;">' +
                                    '<span class="">数量：'+(res[i].kcczsl || 0) +'</span>' +
                                    '<span class="" style="padding-left: 40px;">金额：'+wfy.setTwoNum(res[i].kcssje || 0, 2) +'</span>' +
                                    '<span class="fr">'+(res[i].kcczrq || '') +'</span>' +
                                '</div>' +
                            '</div>'+
                            '<div class="list_drap">' +
                                '<div class="list_item_btn" style="height: 60px;line-height: 60px;">打印小票</div>' +
                            '</div>' +
                        '</div>';
            }

            $("#wfyContList").append(html);
            if(res.length ==10){//一次性取10个，达到10个的时候，显示 加载动画
                $("#scrollload").removeClass("none");
            }
            if( index > 1 && res.length ==0){
                $("#scrollload span").html("没有更多了...");
                setTimeout(function () {
                    $("#scrollload").addClass("none");
                    $("#scrollload span").html("正在加载");
                },1000);
            }


            $("#wfyCont").scroll(function () {
                //loading 是根据 加载动画是否显示 判断
                if($("#wfyContList").Scroll() < 0){
                    if(!$("#scrollload").hasClass("none")){
                        loading = true;
                    }
                    setTimeout(function () {
                        if(loading ){
                            index ++;
                            ajaxListData(currentTab);
                            loading = false;
                        }
                    },1000);
                }

            });
        } else {
            wfy.alert(d.errorMessage);
        }
    });
}
