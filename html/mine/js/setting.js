/**
 * Created by WFY2016 on 2017/10/19.
 */
$(function () {
    $('body').hammer().on('tap','#backBtn',function (event) {
        event.stopPropagation();

        wfy.pagegoto("../home/index");
    });

    $('body').hammer().on("tap",'#modify_pass',function( event){
        event.stopPropagation();

        wfy.pagegoto('modify_pass');
    });

})
window.uexOnload =function () {
    $('body').hammer().on('tap','#bluetooth',function () {
        Components.bluetoothPrint.init('#bluetooth');
    })
}