
var pageNum = 1, loading = false;

/*window.uexOnload = function () {
    uexWindow.setReportKey(0, 1); // 物理返回键接管
    uexWindow.onKeyPressed = function (keyCode) {
        if (keyCode === 0){
            var back = $('#back').attr('data-back');
            if(back == "home"){
                wfy.goto(back);
            }else {
                $("#p1").removeClass("x_100");
                $("#p2").addClass("x100");
                $('#backs').attr('data-back','home');
                $("#title").html('会员信息查询');
                html1 ='';
                html2 ='';
                html3 ='';
                html4 ='';
            }
        }
    };
}*/

$(function () {
    $('#backs').tap(function () {
        wfy.pagegoto('../home/index');
    })
    getList("");
    wfy.tap('#sear',function () {
        $('header').addClass('none');
        $('.header_search').removeClass('none');
    })
    wfy.tap('.header_search_right',function () {
        $('header').removeClass('none');
        $('.header_search').addClass('none');
    })
    // 区 新增
    $('body').hammer().on('tap', '#add', function (event) {
     event.stopPropagation();
        localStorage.wdhykh = "";
     wfy.pagegoto('qry_coutomer_info')
     });
    //监控 input 搜索事件
    $("#search").on('keypress',function(e) {
        var keycode = e.keyCode;
        var searchName = $(this).val();
        if(keycode=='13') {
            e.preventDefault();
            //请求搜索接口
            getList(searchName);
        }
    });
    /*-----------------------------------------去详情----------*/
    $('body').hammer().on('tap', '#list .list_swiper', function (event) {
        event.stopPropagation();
        var hykh = $(this).attr('data-hykh');
        localStorage.wdhykh = hykh;
        wfy.pagegoto('qry_coutomer_dtl')
    });
});
function getList(AS_KEYWORD) {
    var vBiz = new FYBusiness("biz.crm.crminfo.list");
    var vOpr1 = vBiz.addCreateService("svc.crm.crminfo.list", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID",LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.crm.crminfo.list");
    vOpr1Data.setValue("AS_CXCS", AS_KEYWORD);
    vOpr1Data.setValue("AS_KHHYKH","");
    vOpr1Data.setValue("AN_PSIZ", 20);
    vOpr1Data.setValue("AN_PINDEX",1);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var restult = vOpr1.getResult(d, 'AC_RESULT').rows || [];
            //alert(JSON.stringify(res));
            var htmlStr ="";
            if( pageNum == 1 && restult.length ==0){
                htmlStr = wfy.zero();
                $(".search_input").val("");
            }
            for(var i =0; i<restult.length;i++){
                var item=restult[i];
                var str = '';
                if(item.hydqye < 0){
                    str = '<span style="color: red">余额：'+(item.hydqye)+'</span>';
                }else {
                    str = '<span>余额：'+(item.hydqye)+'</span>';
                }
                htmlStr += '<div class="list_1 list_swiper" style="height: 120px" data-hykh="'+item.khhykh+'">'+
                                '<div class="list_item_1 thd ts200">'+
                                    '<div class="item_line">'+
                                        '<span class="black">'+item.khhyxm+'</span>'+
                                    '</div>'+
                                    '<div class="item_line">'+
                                        '<span class="fl w50">手机：'+item.khhysj+'</span>'+
                                        '<span>生日：'+(item.khcsny || '')+'</span>'+
                                    '</div>'+
                                    '<div class="item_line">'+
                                        '<span class="fl w50">授信额度：'+item.khxyed+'</span>'+str+
                                    '</div>'+
                                    '<div class="item_line">'+
                                        '<span>地址：'+(item.khlxdz || "|").replace('|','')+'</span>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="list_drap">'+
                                '</div>'+
                            '</div>'
            }
            $("#list").html(htmlStr);
        } else {
            // todo...[d.errorMessage]
            wfy.alert('没有查询到会员信息！' + (d.errorMessage || ''));
        }
    }) ;
}
