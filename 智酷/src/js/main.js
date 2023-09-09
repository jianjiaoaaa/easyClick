//https://v.kuaishou.com/3Qxb3k"按时艰苦的嘎就开始豆瓣啊科技时代吧
let Ssdun = new SSDUNSDK("e4c67bd053bd9a9171a5fae33a5ccd7869be1d13dd81dbde4c4d8a173db975ac", 3968, 0, "");
Ssdun.debug = false;
Ssdun.SsdunConfig.verifyHeartbeatFirst = true;//是否开启 有上次心跳先退出在 验证

const 单视频时长 = 2 * 60 * 1000
var kuaishouhao = "";
var shipinMin = 30;
var shipinMax = 60;
var jishu = 9;
var startNum = 9;
var jixingIndex = 1;


function main() {
    laoleng.EC.init();
    laoleng.EC.initImage(false);
    检测更新();

    setExceptionCallback(function (msg) {
        logd("异常停止,重启脚本")
        restartScript(null, true, 3)
    });

    //保持设备唤醒
    device.keepScreenOn();
    //_________________________________________________________________________________________________________________________________________________________________________________________________________________________
    //卡密二次验证
    var kami = readConfigString("kami");
    if (kami) {
        var 卡密验证 = Ssdun.卡密验证(kami, Ssdun.读取机器码(true), 3968, true);
        if (卡密验证.code === 0) {
            toast("卡密二次验证通过")
        } else {
            toast("卡密验证：" + 卡密验证['data']['error_msg'])
            exit();
        }
    } else {
        toast("卡密为空")
        exit();
    }
    kuaishouhao = readConfigString("shipinlianjie2");

    if (kuaishouhao) {
        kuaishouhao = kuaishouhao.split(/\n/).map(e => e.trim()).filter(e => e);
        if (kuaishouhao && kuaishouhao.length) {
            toast("链接检测正常")
        } else {
            toast("没有链接")
            exit();
        }
    }
    else {
        toast("请输入连接");
        exit();
    }

    全局弹窗();
    shipinMin = readConfigInt("shipinMin") || 5;
    shipinMax = readConfigInt("shipinMax") || 10;
    jishu = readConfigInt("jishu") || 9;
    startNum = readConfigInt("startNum") || 9;

    var 未知页面次数 = 0;
    var 重新观看次数 = 0;

    var 当前app索引 = 0;
    var 快手app总数=0;
    var 当前链接索引 = 0;
    //先切到首页
    // home();
    sleep(2000);
    toast("--开始运行--")
    homes()
    //主程序
    var close次数=0;
    while (true) {
        if (findNode(id("com.smile.gifmaker:id/nasa_slide_shoot_refresh_view"))) {
            toast("等待加载")
        }
        else if (findNodeAll(textMatch("^快手"))) {
            toast("系统主页:"+gNodeAll.length)
            快手app总数=gNodeAll.length
            清理后台();
            if(kuaishouhao.length){
                utils.setClipboardText(kuaishouhao[当前链接索引||0])
                sleep(1000)
            }
            //打开app
            if(gNodeAll.length===1){
                当前app索引=0
            }
            else if((gNodeAll.length<1)){
                logd("主界面没有快手app")
                ui.toast("主界面没有快手app")
                exit()
            }else{
                当前app索引+=1
            }
            if (当前app索引 < gNodeAll.length) {
                gNodeAll[当前app索引].click();
                var 等待去看看 = textMatch("^去看看$").getOneNodeInfo(60000);
                if (等待去看看) {
                    等待去看看.click();
                } else {
                    //进入视频分享失败          //口令未生效(已经识别过)
                    toast("进入视频分享失败")
                    // logd("更换下个链接");
                    home();
                }
            } else
            {
                toast("当前app索引结束")
                当前app索引=0
            }
        }
        else if (findNode(textMatch("打开看看"))) {
            toast("打开看看")
            sleep(2000)
            g_ret.click();
        }
        else if (findNode(text("感谢您的支持,本章解锁后可继续观看"))) {
            findNode(id("com.smile.gifmaker.miniapp:id/toolbar_close_btn_container"), true, true)
        }
        else if (findNode(text("确定放弃支付么"))) {
            findNode(text("暂时放弃"), true, true)
        }
        else if (findNode(textMatch("感谢您支持作者"))) {
            toast("检测到弹窗");
            sleep(2000);
            g_ret.nextSiblings()[0].click()
            // 点击广告=true;
            var 等待文本_免费看本集_5s = text("看视频免费观看本集").getOneNodeInfo(5000);

            if (等待文本_免费看本集_5s) {
                toast("看广告");
                sleep(2000);
                g_ret.click();
            } else {
                logi("疑似没有广告了_" + 重新观看次数);
                if (重新观看次数 > 1) {
                    toast("没有广告了")//2次没广告就退出
                    findNode(id("com.smile.gifmaker.miniapp:id/toolbar_close_btn_container"), true, true);
                    切换链接();
                    sleep(2000);
                    home();
                    continue;
                }
                var cx = device.getScreenWidth() / 2;
                var cy = device.getScreenHeight() / 2;
                var sx = random(cx * 0.5, cx * 1.5);
                var ey = random(cy * 1.4, cy * 1.5)
                var ex = random(sx - 50, sx + 50)
                var sy = random(cy * 0.5, cy * 0.6);
                var duration = random(300, 600);
                logd("上滑:" + swipeToPoint(sx, sy, ex, ey, duration));
                重新观看次数++
            }
        }
        else if (findNode(text("看视频免费观看本集"))) {
            toast("看广告");
            sleep(2000);
            g_ret.click();
        }
        else if (findNode(textMatch("\\d+s后可领取奖励"))) {
            toast("广告中");
            var 广告结束info = getOneNodeInfo(textMatch("已成功领取奖励"), 5000);
            if (广告结束info) {
                logd("广告结束1");
                sleep(1000);
                findNode(id("com.smile.gifmaker.neo_video:id/video_countdown_end_icon"), true, true)
                // 广告结束info.click()
            }
        }
        else if (findNode(textMatch("已成功领取奖励"))) {
            logd("广告结束2");
            sleep(1000);
            findNode(id("com.smile.gifmaker.neo_video:id/video_countdown_end_icon"), true, true)
        }
        else if (findNode(id("com.smile.gifmaker:id/group_right_action_bar_root_layout"))) { //视频右侧布局
            if (findNode(textMatch("^来自分享$")) || findNode(idMatch("com.smile.gifmaker:id/camera_btn_layout"))) {
                toast("视频详情界面")
                if (findNode(text("短剧"))) {
                    var timer = random(10000, 20000);
                    toast("有短剧链接，先观看:" + timer + " 再点击")
                    sleep(timer);
                    g_ret.click();
                    var 等待小程序加载 = textMatch("第\\d+集").getOneNodeInfo(10000);
                    if (!等待小程序加载) {
                        //小程序加载卡住了
                        findNode(id("com.smile.gifmaker.miniapp:id/toolbar_close_btn_container"), true, true)
                        sleep(3000);
                        continue;
                    }
                } else {
                    toast("没有短剧");
                    sleep(2000);
                    home();
                }
            }
        }
        else if (findNode(textMatch("第\\d+集"))) {
            // var l = random(shipinMin, shipinMax)
            var 当前集数 = laoleng.String.getNumbers(g_ret.text, 1, 3)
            toast("当前第" + 当前集数 + "集")
            var l;
            if (当前集数 < startNum) {
                //前置 剧集
                l = random(2, 4)
                toast(g_ret.text + "|" + l);
            } else {
                //正式剧集
                l = random(shipinMin, shipinMax);
                // l = random(5, 8);
                toast("刷剧中。。" + l);
            }
            // logd("正在观看：" + g_title);
            sleep(l * 1000);
            var cx = device.getScreenWidth() / 2;
            var cy = device.getScreenHeight() / 2;
            var sx = random(cx * 0.5, cx * 1.5);
            var sy = random(cy * 1.4, cy * 1.5)
            var ex = random(sx - 50, sx + 50)
            var ey = random(cy * 0.5, cy * 0.6);
            var duration = random(300, 600);
            logd("滑动:" + swipeToPoint(sx, sy, ex, ey, duration));
        }
        else if (findNode(id("toolbar_right_menu"))) {
            toast("在小程序界面,点击中心点")
            clickPoint(device.getScreenWidth() * 0.5, device.getScreenHeight() * 0.5)
        }
        else if (findNode(textMatch("^去看看$"), true, true)) {
            toast("去看看");
            sleep(5000)
        }
        else if(findNode(id("com.smile.gifmaker:id/close"))){
            toast("检测到close:"+JSON.stringify(g_ret.visibleBounds))
            if(close次数>2){
                g_ret.click()
                close次数=0
            }
        }
        else {
            // loge("未知界面");
            if (未知页面次数 > 2) {
                未知页面次数 = 0
                homes()
            } else {
                toast("等待:" + 未知页面次数)
                未知页面次数++;
            }
            // exit();
        }
        sleep(random(4000, 6000));
    }


    /*function 切换app索引(){
        homes()
        if(findNodeAll(textMatch("^快手"))){
            快手app总数=gNodeAll.length
        }
        if(快手app总数){
            当前app索引=当前app索引+1;
            if(当前app索引>快手app总数-1){
                //越界
                当前app索引=0
            }
        }else{
            while(true){
                if(laoleng.Alert.dialog("提示","没有检测到快手app,是否重新检测?")){
                    home();
                    sleep(2000);
                    if(findNodeAll(textMatch("^快手"))){
                        if(gNodeAll&&gNodeAll.length){
                            //界面有快手
                            快手app总数=gNodeAll.length
                            break;
                        }
                    }
                }else{
                    exit()
                }
            }
        }
        logi("切换app:"+"|"+快手app总数+"|"+当前app索引)
    }*/

    function 切换链接(){
        utils.setClipboardText("尖叫")
        var 当前链接总数=kuaishouhao.length
        if(当前链接总数){
            当前链接索引+=1;
            if(当前链接索引>当前链接总数-1){
                //越界
                当前链接索引=0
            }
        }else{
            logd("当前没有快手链接");
            exit();
        }
        logi("当前链接索引:"+当前链接索引)
        utils.setClipboardText(当前链接索引)
    }

    function 清理后台(){
        utils.setClipboardText("尖叫")
        homes();
        recentApps()
        sleep(random(2000, 3000))
        findNode(idMatch("clear"), true, true)
        sleep(random(2000, 3000))
        homes()
    }
}

main();


function 全局弹窗() {
    var 弹窗tid = thread.execAsync(function () {
        while (true) {
            sleep(1500);
            findNodeS(textMatch("^隐藏$"), true, true)
            findNodeS(text("我知道了"), true, true)
            findNodeS(textMatch("^同意并"), true, true);
            findNodeS(textMatch("^同意，并"), true, true);
            findNodeS(text("保持私密"), true, true)
            findNodeS(text("设置为私密"), true, true)
            findNodeS(textMatch("^仅此一次$"), true, true)
            findNodeS(textMatch("^始终$"), true, true)

            if (findNodeS(textMatch("^允许$"))) {
                var i = g_ret2
                if (!findNodeS(textMatch("通知管理"))) {
                    i.click();
                }
            }

            findNodeS(textMatch("^始终允许$"), true, true)
            findNodeS(textMatch("^删除$"), true, true)
            findNodeS(textMatch("已阅读并同意服务协议和QQ隐私保护指引"), true, true)
            findNodeS(textMatch("^一键登录$"), true, true)

            if (findNodeS(text("快手权限管理"))) {
                findNodeS(text("确定"), true, true)
            }
            if (findNodeS(textMatch("安全警告"))) {
                findNodeS(textMatch("继续"), true, true)
            }

            if (findNodeS(textMatch("想要打开"))) {
                findNodeS(textMatch("打开"), true, true)
                findNodeS(textMatch("同意"), true, true)
                findNodeS(textMatch("确定"), true, true)
            }
        }
    })
}

function 检测更新() {
    thread.execAsync(function () {
        while (true) {
            sleep(1000 * 60 * 5)//5分钟检测
            // let version = '2.8.5';
            //请求服务器是否有新版本
            let updateResult = hotupdater.updateReq();
            logd("请求更新是否有: " + updateResult);
            if (updateResult) {
                //有更新
                logd("请求数据: " + hotupdater.getUpdateResp());
                //有更新得情况下进行下载新的版本
                let path = hotupdater.updateDownload();
                logd("下载路径为: " + path);
                if (!path) {
                    logw("下载IEC文件错误信息: " + hotupdater.getErrorMsg());
                } else {
                    restartScript(path, true, 3)
                    return;
                }
            }
        }
    })
}











