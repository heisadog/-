
$(function () {
    $('body').hammer().on('tap','#back',function (event) {
        event.stopPropagation();
        wfy.goto('bill_noend');
    });

    dtl();
})
function dtl() {
    var vBiz = new FYBusiness("biz.pos.order.msg.qry");
    var vOpr1 = vBiz.addCreateService("svc.pos.order.msg.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.pos.order.msg.qry");
    vOpr1Data.setValue("AS_PRECZHM", localStorage.yd_czhm);//00171000085441
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            //AC_HEAD,AC_PAYTYPE,AC_COUPON,AC_PREPAY,AC_PRODUCT,AC_GUIDE
            var AC_HEAD = vOpr1.getResult(d, "AC_HEAD").rows;
            var AC_PAYTYPE = vOpr1.getResult(d, "AC_PAYTYPE").rows;
            var AC_COUPON = vOpr1.getResult(d, "AC_COUPON").rows;
            var AC_PREPAY = vOpr1.getResult(d, "AC_PREPAY").rows;
            var AC_PRODUCT = vOpr1.getResult(d, "AC_PRODUCT").rows;
            var AC_GUIDE = vOpr1.getResult(d, "AC_GUIDE").rows;
            if(AC_HEAD.length != 0){
                $("#xiaopiao").html(AC_HEAD[0].xtxphm || "");
            }else {
                $("#xiaopiao").html("获取失败");
            }
            var html = "";
            if(AC_PRODUCT.length ==0){
                html = wfy.zero();
            }
            for (var i = 0 ; i<AC_PRODUCT.length ; i++){
                html +='<div class="pos_list">\
                    <div class="pos_item_dtl">\
	                    <div class="pos_item_dtl_img">\
	                    	<img src="'+AC_PRODUCT[i].xtwplj+'" alt=""/>\
	                    </div>\
	                    <div class="dsdsarig">\
		                    <div class="wfyitem_line" style="height:20px;line-height:20px;font-size:12px;">\
		                    	<span class="wfyitemTitle"><span class="black">'+(i+1)+'、'+AC_PRODUCT[i].xtwpdm+'</span></span>\
		                		<span class="wfyitemTitle fr"><span>'+AC_PRODUCT[i].kcczsl+'</span></span>\
		                    </div>\
		                	<div class="wfyitem_line" style="height:20px;line-height:20px;font-size:12px;">\
			                    <span class="wfyitemTitle"><span>'+AC_PRODUCT[i].xtwpmc+'</span></span>\
			                    <span class="wfyitemTitle fr"><span>'+wfy.setTwoNum(AC_PRODUCT[i].kcssje,2)+'</span></span>\
			                </div>\
			                <div class="wfyitem_line" style="height:20px;line-height:20px;font-size:12px;">\
			                    <span class="wfyitemTitle"><span>'+(AC_PRODUCT[i].xtysmc || "")+'</span></span>\
			                    <span class="wfyitemTitle"><span>'+(AC_PRODUCT[i].xtwpxh || "")+'</span></span>\
			                    <span class="wfyitemTitle fr">折扣：<span>'+AC_PRODUCT[i].zk+' </span></span>\
			                </div>\
			                <div class="wfyitem_line none" style="height:20px;line-height:20px;font-size:12px;">\
			                    <span class="wfyitemTitle">促销原因：<span>'+(AC_PRODUCT[i].xszsmc || "")+'</span></span>\
			                </div>\
		                </div>\
                	</div>\
                </div>';
            }
            $("#pos_list").html(html);

            //处理页脚
            var zffs ="";
            for (var k = 0; k<AC_PAYTYPE.length; k++ ){
                zffs +='<span class="wfytle">'+AC_PAYTYPE[k].xsjssm+'：<span>'+wfy.setTwoNum(AC_PAYTYPE[k].xszfje,2)+'</span></span>'
            }
            var daogou ="";
            for (var x = 0; x<AC_GUIDE.length; x++ ){
                daogou +='<div class="wfyitem_line"><span class="wfyitemTitle">'+AC_GUIDE[x].xtyhxm+'<span style="padding-left: 50px">'+AC_GUIDE[x].kcftbl+'</span></span></div>';
            }

            var dtlfoot ='';
            dtlfoot = '<div class="wfyitem_line">\
                         '+zffs+'\
                       </div>\
                        '+daogou;
            //$("#pos_dtl_foot").html(dtlfoot);
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage)
        }
    }) ;
}