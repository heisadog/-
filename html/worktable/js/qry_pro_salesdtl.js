localStorage.his = 'qry_pro_salesdtl';
localStorage.prev = 'qry_pro_sales';
//季节
var seasonArr=[
    {code: '01', title: '春'},
    {code: '02', title: '夏'},
    {code: '03', title: '秋'},
    {code: '04', title: '冬'},
    {code: '05', title: '春夏'},
    {code: '06', title: '秋冬'},
];
//计量单位
var unitArr=[
    {code: '01', title: '件'},
    {code: '02', title: '双'},
    {code: '03', title: '条'},
    {code: '04', title: '个'},
    {code: '05', title: '套'},
];

//颜色
var colorArr=[];
//尺码
var sizeArr=[];
//品牌
var brandArr=[];
//厂商
var companyArr=[];
//类别
var categoryArr=[];

//物品代码
var recordcode=localStorage.recordcode;

var saveObj={};//数据保存对象
var windowType="";//新增弹窗类型
var pageFlag="";//页面标识：新增/编辑
var colorgroup="";//颜色组
var sizegroup="";//尺码组

var data={};

var flag="list";//颜色尺码新增点击页面的类型，默认为列表点击
var img = '';
var extname = ''
$(function () {

    //选择图片
    $('body').hammer().on('change','#uploadImage',function (event) {
        event.stopPropagation();
        // $(this).imgloadsize();
        // extname = $('#fileId').attr('extname');
        localStorage.isupdataImg = 'Y';//是否换过图片
    });
    //获取下拉、弹窗列表的数据
    getComboList();

    //颜色
    $('body').hammer().on('tap', '#color', function (event) {
        event.stopPropagation();

        var code=$(this).attr("data-code");
        windowType="color";
        createWindow(windowType,code);
        $("#tosttop").removeClass('y100');
    });

    //尺码
    $('body').hammer().on('tap', '#size', function (event) {
        event.stopPropagation();

        var code=$(this).attr("data-code");
        windowType="size";
        createWindow(windowType,code);
        $("#tosttop").removeClass('y100');
    });

    //选择弹出层 点击关闭按钮
    $('body').hammer().on('tap','#tost_cancel',function (event) {
        event.stopPropagation();
        $("#tosttop").addClass('y100');
    });

    //选择弹出层 点击某个按钮
    $('body').hammer().on('tap','.tost_title_list',function (event) {
        event.stopPropagation();

        if(!$(this).hasClass('noedit')){
            if(!$(this).hasClass('addcheck')){
                $(this).addClass('addcheck');
            }else {
                $(this).removeClass('addcheck');
            }
        }

    });

    //选择弹出层 确定按钮
    $('body').hammer().on('tap','#tost_true',function (event) {
        event.stopPropagation();

        var groupArr=[];
        var codeArr=[];
        var nameArr=[];
        var serialArr=[];
        $('#tosttop_cont .addcheck').each(function () {
            groupArr.push($(this).attr('data-group'));
            codeArr.push($(this).attr('data-code'));
            nameArr.push($(this).html());

            if(windowType=="size"){
                serialArr.push($(this).attr('data-serial'));
            }
        });

        //$("#"+windowType).attr("data-group",groupArr.join());
        $("#"+windowType).attr("data-code",codeArr.join());
        $("#"+windowType).val(nameArr.join());

        if(windowType=="size"){
            $("#"+windowType).attr("data-serial",serialArr.join());
        }


        $("#tosttop").addClass('y100');
    })


    //品牌
    $('body').hammer().on('tap', '#brand', function (event) {
        event.stopPropagation();
        var html = '';
        for(var i = 0; i <brandArr.length; i++){
            html+='<div class="item" style="text-align: center;" data-code="'+brandArr[i].xtwppp+'" data-type="brand">'+brandArr[i].xtppmc+'</div>'
        }
        $("#multi_box").html(html);
        wfy.openWin('multi_box');
    });

    //厂商
    $('body').hammer().on('tap', '#company', function (event) {
        event.stopPropagation();

        var html = '';
        for(var i = 0; i <companyArr.length; i++){
            html+='<div class="item" style="text-align: center;" data-code="'+companyArr[i].xtwldm+'" data-type="company">'+companyArr[i].xtwlmc+'</div>'
        }
        $("#multi_box").html(html);
        wfy.openWin('multi_box');
    });

    //季节
    $('body').hammer().on('tap', '#season', function (event) {
        event.stopPropagation();
        var html = '';
        for(var i = 0; i <seasonArr.length; i++){
            html+='<div class="item" style="text-align: center;" data-code="'+seasonArr[i].code+'" data-type="season">'+seasonArr[i].title+'</div>'
        }
        $("#multi_box").html(html);
        wfy.openWin('multi_box');
    });

    //类别
    $('body').hammer().on('tap', '#category', function (event) {
        event.stopPropagation();
        var html = '';
        for(var i = 0; i <categoryArr.length; i++){
            html+='<div class="item" style="text-align: center;" data-code="'+categoryArr[i].xtwplb+'" data-type="category">'+categoryArr[i].xtlbmc+'</div>'
        }
        $("#multi_box").html(html);
        wfy.openWin('multi_box');
    });

    //计量单位
    $('body').hammer().on('tap', '#unit', function (event) {
        event.stopPropagation();
        var html = '';
        for(var i = 0; i <unitArr.length; i++){
            html+='<div class="item" style="text-align: center;" data-code="'+unitArr[i].code+'" data-type="unit">'+unitArr[i].title+'</div>'
        }
        $("#multi_box").html(html);
        wfy.openWin('multi_box');
    });

    //点击选择弹出的模式
    $('body').hammer().on('tap','#multi_box .item',function (event) {
        event.stopPropagation();
        var nodeId= $(this).attr('data-type');
        var selCode= $(this).attr('data-code');
        var selName= $(this).html();

        $("#"+nodeId).attr("data-code",selCode);
        $("#"+nodeId).val(selName);

        wfy.closeWin();
    });

    //点击 新增按钮 弹出窗口
    $('body').hammer().on('tap', '.comboadd', function (event) {
        event.stopPropagation();
        var typdcode=$(this).parent().find('input')[0].name;
        var typeid=$(this).parent().find('input')[0].id;

        var window_title="";
        var field_code_title="";
        var field_name_title="";

        if(typdcode=="color"){
            window_title="新增颜色";
            field_code_title="颜色代码";
            field_name_title="颜色";
            $("#code_div").addClass("none");
            $("#name_div").removeClass("none");
            $("#addwindow").attr("style","height:153px;");

        }else if(typdcode=="size"){
            window_title="新增尺码";
            field_code_title="尺码代码";
            field_name_title="尺码";
            $("#code_div").addClass("none");
            $("#name_div").removeClass("none");
            $("#addwindow").attr("style","height:153px;");

        }else if(typdcode=="brand"){
            window_title="新增品牌";
            field_code_title="品牌代码";
            field_name_title="品牌";
            $("#code_div").addClass("none");
            $("#name_div").removeClass("none");
            $("#addwindow").attr("style","height:153px;");

        }else if(typdcode=="category"){
            window_title="新增类别";
            field_code_title="类别代码";
            field_name_title="类别";
            $("#code_div").addClass("none");
            $("#name_div").removeClass("none");
            $("#addwindow").attr("style","height:153px;");
        }

        $("#window_title").html(window_title);
        $("#field_code_title").html(field_code_title);
        $("#field_name_title").html(field_name_title);

        wfy.openWin("addwindow");
        $('#addwindow').attr("data-type",typdcode);
        $('#addwindow').css("bottom","240px");

        if(typdcode!=typeid){
            flag="win";//弹窗点击
            $("#coverBack").attr("style","z-index:150;");
        }

        $("#field_name").focus();
    });

    //新增弹窗 确认按钮
    $('body').hammer().on('tap', '#btn_sure', function (event) {
        event.stopPropagation();

        var type=$("#addwindow").attr("data-type");
        var code=getValidStr($("#field_code").val());
        var name=getValidStr($("#field_name").val());
        if(name==""){
            wfy.alert("名称不能为空");
            return;
        }
        addData_save(type,code,name);
        addWindowReset();
        getComboList();
        wfy.closeWin("addwindow");
        $('#addwindow').css("bottom","-270px");

    });

    //新增弹窗 取消按钮
    $('body').hammer().on('tap', '#btn_cancel', function (event) {
        event.stopPropagation();

        addWindowReset();

        wfy.closeWin("addwindow");
        $('#addwindow').css("bottom","-270px");
    });
    //查询明细信息
    if(recordcode==""){
        pageFlag="add";
        $("#unit").val("件");
        $("#unit").attr("data-code","01");
        $("#girard").removeAttr("readonly");
        $("#name").removeAttr("readonly");
        $("#price").removeAttr("readonly");
        $("#saleprice").removeAttr("readonly");
    }else{
        pageFlag="edit";
        getDataDtl(recordcode);
        $("#name").removeAttr("readonly");
        $("#price").removeAttr("readonly");
        $("#saleprice").removeAttr("readonly");
    }


    //点击保存按钮
    //onkeyup="this.value=this.value.replace(/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/g,'')"
    $('body').hammer().on('tap', '#pro_save', function (event) {
        event.stopPropagation();
        saveObj.girard=getValidStr($("#girard").val());
        saveObj.name=getValidStr($("#name").val());
        saveObj.productcode=getValidStr($("#productcode").attr("data-code")).split(";");
        saveObj.colorgroup=getValidStr($("#color").attr("data-group"));
        saveObj.color=getValidStr($("#color").attr("data-code")).split(",");
        saveObj.colorname=getValidStr($("#color").val()).split(",");
        saveObj.sizegroup=getValidStr($("#size").attr("data-group"));
        saveObj.size=getValidStr($("#size").attr("data-code")).split(",");
        saveObj.sizeserial=getValidStr($("#size").attr("data-serial")).split(",");
        saveObj.brand=getValidStr($("#brand").attr("data-code"));
        saveObj.company=getValidStr($("#company").attr("data-code"));
        saveObj.price=getValidStr($("#price").val());
        saveObj.saleprice=getValidStr($("#saleprice").val());
        saveObj.season=getValidStr($("#season").attr("data-code"));
        saveObj.category=getValidStr($("#category").attr("data-code"));
        saveObj.unit=getValidStr($("#unit").attr("data-code"));

        if(saveObj.girard==""){
            wfy.alert("款号不能为空");
            return;
        }else {
            var flag=checkkshi(saveObj.girard);
            if(!flag){
                wfy.alert("只能输入字母和数字");
                return;
            }
        }
        if(saveObj.name==""){
            wfy.alert("名称不能为空");
            return;
        }else {
            var flag=saveObj.name.length;
            if(flag>10){
                wfy.alert("最多输入10位");
                return;
            }
        }
        if(saveObj.price==""){
            wfy.alert("进价不能为空");
            return;
        }else{
            var flag=priceVali(saveObj.price);
            if(!flag){
                wfy.alert("请填写有效的进价");
                return;
            }
        }
        if(saveObj.saleprice==""){
            wfy.alert("售价不能为空");
            return;
        }else{
            var flag=priceVali(saveObj.saleprice);
            if(!flag){
                wfy.alert("请填写有效的售价");
                return;
            }
        }
        if(pageFlag == "add"){
            checkKS(function (res) {
                console.log(res)
                if(res == 'N'){
                    wfy.alert('此款商品已存在,请通过原商品修改');
                    return;
                }
                if(localStorage.isupdataImg == 'Y'){
                    imgupdate();
                }else {
                    dataSave();
                }

            })
        }else {
            if(localStorage.isupdataImg == 'Y'){
                imgupdate();
            }else {
                dataSave();
            }

        }
        //如果 换过图片 就执行 图片上传

    });
});
//验证 款式是否存在
var checkKS = function (callback) {
    var vBiz = new FYBusiness("biz.ctlitem.item.save.kscheck");
    var vOpr1 = vBiz.addCreateService("svc.ctlitem.item.save.kscheck", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID",LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.item.save.kscheck");
    vOpr1Data.setValue("AS_XTWPKS", saveObj.girard);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    //console.error(JSON.stringify(ip))
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            // todo...
            var res = vOpr1.getOutputPermeterMapValue(d, 'AS_CKRELT');
            //console.error(res)
            if(typeof callback === 'function'){
                callback(res);
            }
        } else {
            // todo...[d.errorMessage]
            wfy.alert(d.errorMessage);
            return;
        }
    })
}







function imgname() {
    var time = new Date();
    var name = 'upload'+time.getTime();
    return name;
}
//获取下拉弹唱数据值
function getComboList() {
    var vBiz = new FYBusiness("biz.ctlitem.baseitem.list");

    var vOpr1 = vBiz.addCreateService("svc.ctlitem.baseitem.list", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.baseitem.list");


    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            colorArr = vOpr1.getResult(d, "AC_COLOR").rows || [];
            colorgroup=colorArr[0].wpyszb;
            sizeArr = vOpr1.getResult(d, "AC_SIZE").rows || [];
            sizegroup=sizeArr[0].wpxhzb;
            brandArr = vOpr1.getResult(d, "AC_BRAND").rows || [];
            categoryArr = vOpr1.getResult(d, "AC_CATEGORY").rows || [];
            companyArr = vOpr1.getResult(d, "AC_SUPPLIER").rows || [];

        } else {
            wfy.alert("获取数据失败,"+d.errorMessage);
        }
    }) ;
}

//生成颜色尺码弹窗数据
function createWindow(type,selData) {
    var selArr=selData.split(",");

    var html='<input type="hidden" id="win_type" name="'+type+'"/>';

    if(type=="color"){
        //颜色
        if(colorArr.length != 0){
           /* html= '无可选颜色，请新增';
        }else {*/
            outer:
            for(var i = 0;i<colorArr.length; i++){

                for(var j=0;j<selArr.length;j++){
                    if(colorArr[i].xtwpys==selArr[j]){
                        if(pageFlag=="edit"){
                            html+= '<div class="tost_title_list addcheck noedit" data-group="'+colorArr[i].wpyszb+'" data-code="'+colorArr[i].xtwpys+'">'+colorArr[i].xtysmc+'</div>';

                        } else{
                            html+= '<div class="tost_title_list addcheck" data-group="'+colorArr[i].wpyszb+'" data-code="'+colorArr[i].xtwpys+'">'+colorArr[i].xtysmc+'</div>';

                        }

                        continue outer;
                    }
                }

                html+= '<div class="tost_title_list" data-group="'+colorArr[i].wpyszb+'" data-code="'+colorArr[i].xtwpys+'">'+colorArr[i].xtysmc+'</div>';
            }

        }

        html+= '<div class="tost_title_list comboadd" style="border: dashed 1px #999;color: #999;">&#xe6b9;</div>';

    }else{
        //尺码
        if(sizeArr.length != 0){
           /* html= '无可选尺码，请新增';
        }else {*/

            outer:
                for(var i = 0;i<sizeArr.length; i++){

                    for(var j=0;j<selArr.length;j++){
                        if(sizeArr[i].xtwpxh==selArr[j]){

                            if(pageFlag=="eidt"){
                                html+= '<div class="tost_title_list addcheck noedit" data-group="'+sizeArr[i].wpxhzb+'" data-code="'+sizeArr[i].xtwpxh+'" data-serial="'+sizeArr[i].xtxhxh+'">'+sizeArr[i].xtwpxh+'</div>';

                            } else{
                                html+= '<div class="tost_title_list addcheck" data-group="'+sizeArr[i].wpxhzb+'" data-code="'+sizeArr[i].xtwpxh+'" data-serial="'+sizeArr[i].xtxhxh+'">'+sizeArr[i].xtwpxh+'</div>';
                            }

                            continue outer;
                        }
                    }

                    html+= '<div class="tost_title_list" data-group="'+sizeArr[i].wpxhzb+'" data-code="'+sizeArr[i].xtwpxh+'" data-serial="'+sizeArr[i].xtxhxh+'">'+sizeArr[i].xtwpxh+'</div>';
                }
        }

        html+= '<div class="tost_title_list comboadd" style="border: dashed 1px #999;color: #999;">&#xe6b9;</div>';

    }

    $("#tosttop_cont").html(html);

}

//获取数据明细
function getDataDtl(record) {
    var vBiz = new FYBusiness("biz.ctlitem.itemdetail.qry");
    var vOpr1 = vBiz.addCreateService("svc.ctlitem.itemdetail.qry", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.itemdetail.qry");
    vOpr1Data.setValue("AS_XTWPKS", record);
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            var result = vOpr1.getResult(d, "AC_RESULT").rows || [];
            console.log(result)
            queryDataDeal(result);

        } else {
            wfy.alert("数据查询失败,"+d.errorMessage);
        }
    }) ;
}

//查询数据处理
function queryDataDeal(rows) {
    //qsgymc: nullwpcbdj: 1wpqsgy: nullwpxhzb: "A0"wpxsdj: 1xtjldw: "01"xtjlmc: "件"xtlbmc: nullxtppmc: nullxtpzgg: "01"xtwpdm: "A011101L"xtwpjj: nullxtwpks: "111"xtwplb: nullxtwpmc: "111"xtwppp: nullxtwpxh: "L"xtxhxh: 12xtysmc: "白色"xtyszb: "A0"
    data={
        girard:rows[0].xtwpks,
        name:rows[0].xtwpmc,
        productcode:"",
        //colorgroup:colorgroup,
        color:[],
        colorname:[],
        //sizegroup:sizegroup,
        sizecode:[],
        size:[],
        brand:rows[0].xtwppp,
        brandname:rows[0].xtppmc,
        company:rows[0].wpqsgy,
        companyname:rows[0].qsgymc,
        price:rows[0].wpcbdj,
        saleprice:rows[0].wpxsdj,
        season:rows[0].xtwpjj,
        seasonname:"",
        category:rows[0].xtwplb,
        categoryname:rows[0].xtlbmc,
        unit:rows[0].xtjldw,
        unitname:rows[0].xtjlmc,
        img:rows[0].xtwplj
    };

    for(var i=0;i<seasonArr.length;i++){
        if(data.season==seasonArr[i].code){
            data.seasonname=seasonArr[i].title;
        }
    }

    var productStr="";
    var code="";
    for(var i=0;i<rows.length;i++){
        var temp=rows[i];
        code=temp.xtpzgg;

        if($.inArray(temp.xtwpxh,data.size)<0){
            data.sizecode.push(temp.xtxhxh);
            data.size.push(temp.xtwpxh);
        }

        if($.inArray(temp.xtpzgg,data.color)<0){
            data.color.push(temp.xtpzgg);
            data.colorname.push(temp.xtysmc);
        }

        productStr+=temp.xtpzgg+","+temp.xtwpxh+","+temp.xtwpdm+";";

    }

    data.productcode=productStr.substring(0,productStr.length-1);

    $("#girard").val(data.girard);
    $("#name").val(data.name);
    $("#productcode").attr("data-code",data.productcode);
    $("#color").val(data.colorname.join(","));
    $("#color").attr("data-code",data.color.join(","));
    $("#color").attr("data-group",colorgroup);
    $("#size").val(data.size.join(","));
    $("#size").attr("data-code",data.size.join(","));
    $("#size").attr("data-group",sizegroup);//尺码组别
    $("#size").attr("data-serial",data.sizecode.join(","));//尺码序号
    $("#brand").val(data.brandname);
    $("#brand").attr("data-code",data.brand);
    $("#company").val(data.companyname);
    $("#company").attr("data-code",data.company);
    $("#price").val(data.price);
    $("#saleprice").val(data.saleprice);
    $("#season").val(data.seasonname);
    $("#season").attr("data-code",data.season);
    $("#category").val(data.categoryname);
    $("#category").attr("data-code",data.category);
    $("#unit").val(data.unitname);
    $("#unit").attr("data-code",data.unit);
    console.log($('#check_img').attr('src'))
    $('#check_img').attr('src',_wfy_pic_ip+data.img)

}

//清空新增弹窗页面的数据
function addWindowReset() {
    $("#window_title").html("");
    $("#field_code_title").html("");
    $("#field_name_title").html("");
    $("#field_code").val("");
    $("#field_name").val("");
}

//价格验证
function priceVali(price) {
    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

    if (reg.test(price)) {
        return true;
    }else{
        return false;
    };
}
//  款式验证
function checkkshi(style) {
    //var reg = /^[A-Za-z0-9]+$/;
    var reg = /^[A-Za-z0-9\-]+$/;
    if (reg.test(style)) {
        return true;
    }else{
        return false;
    };
}

//新增保存
function addData_save(type,code,name) {
    if(type=="color"){
        save_color(code,name);
    }else if(type=="size"){
        save_size(code,name);
    }else if(type=="brand"){
        save_brand(code,name);
    }else if(type=="category"){
        save_category(code,name);
    }
}

//新增保存之 颜色
function save_color(code,name) {
    if(name.length>5){
        wfy.alert("颜色不宜超过5个汉字");
        return;
    }
    var vBiz = new FYBusiness("biz.ctlitem.color.save");

    var vOpr1 = vBiz.addCreateService("svc.ctlitem.color.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.color.save");
    vOpr1Data.setValue("AS_XTYSZB", colorgroup);
    vOpr1Data.setValue("AS_XTPZGG", code);
    vOpr1Data.setValue("AS_XTYSMC", name);
    vOpr1Data.setValue("AS_XTYSMS", "");


    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            addWindowReset();
            wfy.closeWin("addwindow");
            $('#addwindow').css("bottom","-270px");
            getComboList();

            wfy.alert("新增成功",function () {
                if(flag=="win"){
                    var code=$("#"+windowType).attr("data-code");
                    $("#tosttop_cont").html("");
                    createWindow(windowType,code);

                    flag="list";
                }
            });

        } else {
            wfy.alert("新增失败,"+d.errorMessage);
        }
    }) ;
}

//新增保存之 尺码
function save_size(code,name) {
    var vBiz = new FYBusiness("biz.ctlitem.size.save");

    var vOpr1 = vBiz.addCreateService("svc.ctlitem.size.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.size.save");
    vOpr1Data.setValue("AS_WPXHZB", sizegroup);
    vOpr1Data.setValue("AS_XTWPXH", name);

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            addWindowReset();
            wfy.closeWin("addwindow");
            $('#addwindow').css("bottom","-270px");
            getComboList();

            wfy.alert("新增成功",function () {
                if(flag=="win"){
                    var code=$("#"+windowType).attr("data-code");
                    $("#tosttop_cont").html("");
                    createWindow(windowType,code);

                    flag="list";
                }
            });

        } else {
            wfy.alert("新增失败,"+d.errorMessage);
        }
    }) ;
}

//新增保存之 品牌
function save_brand(code,name) {
    var vBiz = new FYBusiness("biz.ctlitem.brand.save");

    var vOpr1 = vBiz.addCreateService("svc.ctlitem.brand.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.brand.save");
    vOpr1Data.setValue("AS_XTWPPP", code);
    vOpr1Data.setValue("AS_XTPPMC", name);

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            addWindowReset();
            wfy.closeWin("addwindow");
            $('#addwindow').css("bottom","-270px");
            getComboList();

            wfy.alert("新增成功");

        } else {
            wfy.alert("新增失败,"+d.errorMessage);
        }
    }) ;
}

//新增保存之 类别
function save_category(code,name) {
    var vBiz = new FYBusiness("biz.ctlitem.category.save");

    var vOpr1 = vBiz.addCreateService("svc.ctlitem.category.save", false);
    var vOpr1Data = vOpr1.addCreateData();
    vOpr1Data.setValue("AS_USERID", LoginName);
    vOpr1Data.setValue("AS_WLDM", DepartmentCode);
    vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.category.save");
    vOpr1Data.setValue("AS_XTWPLB", code);
    vOpr1Data.setValue("AS_XTLBMC", name);

    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {

            addWindowReset();
            wfy.closeWin("addwindow");
            $('#addwindow').css("bottom","-270px");
            getComboList();

            wfy.alert("新增成功");

        } else {
            wfy.alert("新增失败,"+d.errorMessage);
        }
    }) ;
}


function imgupdate() {
    img = imgname();
    wfy.showload("正在上传图片");
    formData = new FormData();
    formData.append("src",$('#check_img').attr('src'));
    //console.log(formData.get("src"))
    $.ajax({
        url: _wfy_mobile_api_url+"?filename="+img+ "&extname="+extname,
        type: "POST",
        data: formData,
        processData: false,  // 告诉jQuery不要去处理发送的数据
        contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
        success: function(xhr){
            //console.log(xhr);
            console.log('上传成');
            dataSave();
            wfy.hideload();
        }
    });
}
//保存数据
function dataSave(){
    wfy.showload("正在保存");

    var proArr=[];
    console.log(img)
    for(var i=0;i<saveObj.productcode.length;i++){
        var temp=saveObj.productcode[i];
        if(getValidStr(temp)!=""){
            var arr=temp.split(",");
            proArr.push([arr[0],arr[1],arr[2]]);
        }
    }
    var vBiz = new FYBusiness("biz.ctlitem.item.save");
    var vOpr1 = vBiz.addCreateService("svc.ctlitem.item.save", false);
    for(var i=0;i<saveObj.color.length;i++){
        for(var j=0;j<saveObj.size.length;j++){
            var temppro="";
            for(var k=0;k<proArr.length;k++){
                if(saveObj.color[i]==proArr[k][0]&&saveObj.size[j]==proArr[k][1]){
                    temppro=proArr[k][2];
                }
            }
            var vOpr1Data = vOpr1.addCreateData();
            vOpr1Data.setValue("AS_USERID", LoginName);
            vOpr1Data.setValue("AS_WLDM", DepartmentCode);
            vOpr1Data.setValue("AS_FUNC", "svc.ctlitem.item.save");
            vOpr1Data.setValue("AS_XTWPKS", saveObj.girard);//款式
            vOpr1Data.setValue("AS_XTWPMC", saveObj.name);//品名
            vOpr1Data.setValue("AS_XTYSZB", colorgroup);//颜色组
            vOpr1Data.setValue("AS_XTPZGG", saveObj.color[i]);//颜色
            vOpr1Data.setValue("AS_XTYSMC", saveObj.colorname[i]);//颜色名称
            vOpr1Data.setValue("AS_WPXHZB", sizegroup);//尺码组
            vOpr1Data.setValue("AS_XTWPXH", saveObj.size[j]);//尺码
            vOpr1Data.setValue("AN_XTXHXH", saveObj.sizeserial[j]);//尺码序号
            vOpr1Data.setValue("AS_XTWPPP", saveObj.brand);//品牌
            vOpr1Data.setValue("AS_WPQSGY", saveObj.company);//厂商
            vOpr1Data.setValue("AN_WPCBDJ", saveObj.price);//进价(成本价)
            vOpr1Data.setValue("AN_WPXSDJ", saveObj.saleprice);//售价
            vOpr1Data.setValue("AS_XTWPJJ", saveObj.season);//季节
            vOpr1Data.setValue("AS_XTWPLB", saveObj.category);//类别
            vOpr1Data.setValue("AS_XTJLDW", saveObj.unit);//计量单位
            vOpr1Data.setValue("AS_XTWPLJ",localStorage.isupdataImg == 'Y' ? (img+'.jpg'):$('#check_img').attr('src').split('/')[$('#check_img').attr('src').split('/').length-1]);//图片路径
            vOpr1Data.setValue("AS_XTWPDM", temppro);//物品代码
        }
    }
    var ip = new InvokeProc();
    ip.addBusiness(vBiz);
    console.log(JSON.stringify(ip))
    ip.invoke(function(d){
        if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
            wfy.hideload();
            localStorage.isupdataImg = 'N';
            wfy.alert("保存成功",function () {
                wfy.goto("qry_pro_sales");
            });

        } else {
            wfy.alert("保存失败,"+d.errorMessage);
        }
    }) ;
}


function selectFileImage(fileObj) {
    var file = fileObj.files['0'];
    var agoimg=document.getElementById("ago");
    //图片方向角 added by lzk
    var Orientation = null;
    if (file) {
        var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式
        if (!rFilter.test(file.type)) {
            wfy.alert("请选择jpeg、png格式的图片");
            return;
        }
        // var URL = URL || webkitURL;
        //获取照片方向角属性，用户旋转控制
        EXIF.getData(file, function() {
            EXIF.getAllTags(this);
            Orientation = EXIF.getTag(this, 'Orientation');
        });
        var oReader = new FileReader();
        oReader.onload = function(e) {
            var image = new Image();
            image.src = e.target.result;
            agoimg.src = e.target.result;
            agoimg.onload = function() {
                var expectWidth = this.naturalWidth;
                var expectHeight = this.naturalHeight;
                var calc = expectWidth / expectHeight;
                var canvas = document.getElementById('myCanvas');
                var ctx = canvas.getContext("2d");
                canvas.width = 1200;
                canvas.height = (canvas.width)*calc;
                console.log('canvas数据'+canvas.width)
                var base64 = null;
                //修复ios
                if (Orientation == 6) {
                    //alert('需要顺时针（向左）90度旋转');
                    ctx.save(); //保存状态
                    ctx.translate(canvas.width/2, canvas.height/2); //设置画布上的(0,0)位置，也就是旋转的中心点
                    ctx.rotate(90 * Math.PI / 180); //把画布旋转90度
                    // 执行Canvas的drawImage语句
                    ctx.drawImage(image, -(canvas.width/2), -(canvas.height/2), canvas.width, canvas.height); //把图片绘制在画布translate之前的中心点，
                    ctx.restore(); //恢复状态
                }else {
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                }
                base64 = canvas.toDataURL("image/jpeg", 0.92);
                $("#check_img").attr("src", base64);
            };
        };
        oReader.readAsDataURL(file);
    }
    //$('#uploadImage').imgloadsize();

}



















































