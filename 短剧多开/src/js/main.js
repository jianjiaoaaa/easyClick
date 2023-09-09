//https://v.kuaishou.com/3Qxb3k"按时艰苦的嘎就开始豆瓣啊科技时代吧
/*let Ssdun = new SSDUNSDK("e4c67bd053bd9a9171a5fae33a5ccd7869be1d13dd81dbde4c4d8a173db975ac", 3968, 0, "");
Ssdun.debug = false;
Ssdun.SsdunConfig.verifyHeartbeatFirst = true;//是否开启 有上次心跳先退出在 验证*/
// 本地存储 = storages.create("剧能量");


var g_title = null;
const 单视频时长 = 2 * 60 * 1000
var kuaishouhao = "";
var shipinMin = 30;
var shipinMax = 60;
var jishu = 9;
var startNum = 9;
var jixingIndex = 1;
var 当前账号索引 = 0;
let storage = storages.create("junengliang");

// logd(storage.getInt("当前账号索引", 0))

function 打开视频() {
    while (true) {
        sleep(4000);
        if (findNode(text("打开看看"))) {
            logd("webView")
            g_ret.click();
            break;
        } else {
            logd("打开视频分享链接" + utils.openActivity({
                "uri": "kwai://webview?url=" + kuaishouhao[当前视频索引]
            }))
        }
    }
}

function main() {
    laoleng.EC.init();
    laoleng.EC.initImage(false);
    检测更新();

    setExceptionCallback(function (msg) {
        toast("异常停止,重启脚本")
        restartScript(null, true, 3)
    });

    // main3()


    function main3() {
        //1014-60       最右-滑块一半

        //754+60        滑块结束中点
        rnd_Swipe(120, 929, 900, 1050, 10, 20, 1000, 905, 1150)


        return;
        var 轨道;
        var 滑块, 滑块宽度;
        if (findNode(text("向右拖动滑块填充拼图"))) {
            轨道 = g_ret;
            滑块 = g_ret.nextSiblings()[0];
            滑块宽度 = 滑块.bounds.right - 滑块.bounds.left

            起点X = 滑块.bounds.left + 滑块宽度 * 0.5
            起点Y = random(滑块.bounds.top + 2, 滑块.bounds.bottom - 2)

            终点X = 滑块.bounds.left + 滑块宽度 * 0.5 + 400;
            终点Y = random(轨道.bounds.top + 10, 轨道.bounds.top * 0.5)

            rnd_Swipe()

        }
        logd(2)

        return;
        logd("开始运行")

        var bigImg, cuImg;
        if (findNode(textMatch("^bgPic"))) {
            bigImg = g_ret;
        } else {
            if (findNode(text("captcha"))) {
                bigImg = g_ret.child(0).child(1)
            } else {
                logd("未找到大图片");
                exit();
            }
        }
        /*if (findNode(textMatch("^cutPic"))) {
            cuImg = g_ret;
        } else {
            if (findNode(text("captcha"))) {
                bigImg = g_ret.child(0).child(2)
            } else {
                logd("未找到小图片");
                exit();
            }
        }*/
        var bgimg = image.captureScreen(3, bigImg.bounds.left, bigImg.bounds.top, bigImg.bounds.right, bigImg.bounds.bottom);//截图

        var bg64 = image.toBase64(bgimg);//图片转base64
        //图片要回收
        image.recycle(bgimg);
        //下面是基本参数，需要其他参数的根据文档模仿添加
        //var pa = {"token": token, "type": type, "slide_image": cu64, "background_image": bg64};
        // var pa = {"token": token, "type": type, "image": bg64};
        // var x = http.postJSON(url, pa, 100 * 1000, null);
        var pa = {
            "username": username,
            "password": password,
            "softid": "4ae991411e694f89a203133ed4956c5b",
            "typeid": typeid,
            "image": bg64
        };
        var x = http.postJSON(url, pa, 100 * 1000, null);
        toast(" x返回数据->     " + x)
        var jsonResult = JSON.parse(x);
        logd(typeOf(jsonResult) + "|" + x);
        //对象
        if (jsonResult.code === "0") {
            if (jsonResult.data && jsonResult.data.result) {
                //识别成功
                toast("识别成功");
                var 距离 = Number(jsonResult.data.result);
                logd(距离)
                //获取滑块位置
                if (findNode(text("向右拖动滑块填充拼图"))) {
                    滑块 = g_ret.nextSiblings()[0];
                    var left = 滑块.bounds.left;
                    var right = 滑块.bounds.right;
                    var top = 滑块.bounds.top;
                    var bottom = 滑块.bounds.bottom;
                    滑块x = (right - left) / 2 + left;
                    滑块y = (bottom - top) / 2 + top;
                    ey = random(top, top * 1.5)
                    // rnd_Swipe(滑块x, 滑块y, 滑块x + 距离, ey);
                    logd(滑块x + "|" + 滑块y + "|" + (滑块x + 距离) + "|" + ey + "|" + 1000 + "|" + 1500 + "|" + JSON.stringify(滑块.bounds))
                    // rnd_Swipe(滑块x, 滑块y, 滑块x + 距离, ey, 1000, 1500);
                    // swipeToPoint(滑块x, 滑块y, 滑块x + 距离, ey, 2000)
                    // rSwipe.rndSwipe(滑块x, 滑块y, 滑块x + 距离 + (cuImg.bounds.left - bigImg.bounds.left), ey, 50);
                }
                sleep(3000);
            } else {
                //识别失败;
                toast("识别失败")
            }
        } else {
            toast(jsonResult.msg);
            exit();
        }
    }


    // return;


    /*if (findNode(text("请完成安全验证"))) {
        toast("滑块验证");
        var bgPic = textMatch("^bgPic").getOneNodeInfo(0);
        var cutPic = textMatch("curPic").getOneNodeInfo(0);
        if (bgPic && cutPic) {
            toast("获取图片信息");
        }
    }*/

    //保持设备唤醒
    device.keepScreenOn();
    //_________________________________________________________________________________________________________________________________________________________________________________________________________________________
    //卡密二次验证
    /*var kami = readConfigString("kami");
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
    }*/
    //解析配置
    /*kuaishouhao = readConfigString("kuaishouhao") || "";
    if (kuaishouhao) {
        var arr = kuaishouhao.split("\n").filter(e => e);
        if (arr) {
            kuaishouhao = arr
        } else {
            toast("请输入快手号");
            exit();
        }
    } else {
        toast("请输入快手号");
        exit();
    }*/

    //解析链接
    //kuaishouhao = 'https://v.kuaishou.com/3Qxb3k"按时艰苦的嘎就开始豆瓣啊科技时代吧'//readConfigString("kuaishouhao") || "";

    kuaishouhao = readConfigString("shipinlianjie2") || "http://v.kuaishou.com/4t9fWo\nhttp://v.kuaishou.com/3ipcEc\nhttp://v.kuaishou.com/2fbqsy\nhttp://v.kuaishou.com/KRFR2";
    // logd("快手链接:" + kuaishouhao)
    if (kuaishouhao) {
        kuaishouhao = kuaishouhao.split(/\n/).map(e => e.trim()).filter(e => e);
        if (kuaishouhao && kuaishouhao.length) {
            toast("链接检测正常")
        } else {
            toast("没有链接")
            exit();
        }
        /*if (arr) {
            kuaishouhao = arr.map(e => {
                var ar = e.match(/https\:\/\/v\.kuaishou\.com\/\w+/);
                if (ar) {
                    return ar[0]
                }
                return false;
            }).filter(e => e);
            // kuaishouhao.push("https://v.kuaishou.com/fAbLf", "https://v.kuaishou.com/2kQZ4B")
        } else {
            toast("请输入链接");
            exit();
        }*/
    } else {
        toast("请输入连接");
        exit();
    }

    logd("链接:" + JSON.stringify(kuaishouhao))

    全局弹窗();
    shipinMin = readConfigInt("shipinMin") || 5;
    shipinMax = readConfigInt("shipinMax") || 10;
    jishu = readConfigInt("jishu") || 9;
    startNum = readConfigInt("startNum") || 9;
    // 当前账号索引 = readConfigInt("当前索引") || 0
    当前账号索引 = storage.getInt("当前账号索引", 0) > kuaishouhao.length - 1 ? 0 : storage.getInt("当前账号索引", 0)
    logi("当前账号索引:" + 当前账号索引);
    jixingIndex = Number(readConfigString("jixingIndex") || 0);


    var 未知页面次数 = 0;
    var 重新观看次数 = 0;

    var 当前app索引 = 0;
    var 当前链接索引 = 0;
    //先切到首页
    home();
    sleep(2000);
    toast("--开始运行--")
    //获取app数量


    //主程序
    while (true) {
        if (findNodeAll(textMatch("^快手"))) {
            //到达首页
            toast(gNodeAll.length)

            //设置剪切板数据
            var curUrl = kuaishouhao[当前链接索引]
            if (curUrl) {
                utils.setClipboardText(curUrl);
                sleep(1000)
            } else {
                toast("当前链接索引已结束")
                exit();
            }

            //打开app
            if (当前app索引 <= gNodeAll.length - 1) {
                gNodeAll[当前app索引].click();
                var 等待去看看 = textMatch("^去看看$").getOneNodeInfo(10000);
                if (等待去看看) {
                    等待去看看.click();
                    //到达视频详情界面
                } else {
                    //进入视频分享失败
                    toast("进入视频分享失败")
                    exit()
                }
            } else {
                toast("当前app索引结束")
                exit();
            }
        } else if (findNode(textMatch("^去看看$"))) {
            g_ret.click();
        } else if (findNode(textMatch("打开看看"))) {
            g_ret.click();
        } else if (findNode(text("感谢您的支持,本章解锁后可继续观看"))) {
            findNode(id("com.smile.gifmaker.miniapp:id/toolbar_close_btn_container"), true, true)
        } else if (findNode(text("确定放弃支付么"))) {
            findNode(text("暂时放弃"), true, true)
        } else if (findNode(textMatch("感谢您支持作者"))) {
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
                    // 切换

                    当前app索引 += 1
                    当前链接索引 += 1;
                    findNode(id("com.smile.gifmaker.miniapp:id/toolbar_close_btn_container"), true, true);
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
        } else if (findNode(text("看视频免费观看本集"))) {
            toast("看广告");
            sleep(2000);
            g_ret.click();
        } else if (findNode(id("com.smile.gifmaker:id/qq_login_view")) || findNode(id("com.smile.gifmaker:id/qq_login"))) {
            登录快手();
        } else if (findNode(textMatch("\\d+s后可领取奖励"))) {
            toast("广告中");
            var 广告结束info = getOneNodeInfo(textMatch("已成功领取奖励"), 5000);
            if (广告结束info) {
                logd("广告结束1");
                sleep(1000);
                findNode(id("com.smile.gifmaker.neo_video:id/video_countdown_end_icon"), true, true)
                // 广告结束info.click()
            }
        } else if (findNode(textMatch("已成功领取奖励"))) {
            logd("广告结束2");
            sleep(1000);
            findNode(id("com.smile.gifmaker.neo_video:id/video_countdown_end_icon"), true, true)
        } else if (findNode(id("com.smile.gifmaker:id/header_follow_button")) || findNode(id("com.smile.gifmaker:id/header_follow_status_button"))) {
            //else if (getRunningActivity() === "com.yxcorp.gifshow.profile.activity.UserProfileActivity") {
            logd("用户界面");
            if (findNode(id("com.smile.gifmaker:id/tab_text"))) {
                toast(g_ret.text);
                sleep(2000)
            }

            toast("进入视频详情");
            if (findNodeAll(id("com.smile.gifmaker:id/player_cover_container"))) {
                var len = gNodeAll.length;
                var index = random(0, len - 1)
                logd("共找到" + len + "条视频,随机点:" + index);
                sleep(2000);
                gNodeAll[index].click();
            }
        } else if (findNode(id("com.smile.gifmaker:id/group_right_action_bar_root_layout"))) {

            if (findNode(text("首页")) && findNode(text("精选")) && findNode(text("我"))) {
                logd("在主页");
                findNode(textMatch("^我$"), true, true)
            }

            toast("视频详情界面")
            if (findNode(text("短剧"))) {
                var timer = random(5000, 8000);
                toast("有短剧链接，先观看:" + timer + " 再点击")
                //com.smile.gifmaker:id/plc_tv_title
                if (findNode(id("com.smile.gifmaker:id/plc_tv_title"))) {
                    var text1 = g_ret.text
                    if (text1) {
                        g_title = text1.replace("抢先看：", "")
                    }
                }
                sleep(timer);
                if (g_title) {
                    g_ret.click();
                    var 等待小程序加载 = textMatch("第\\d+集").getOneNodeInfo(10000);
                    if (!等待小程序加载) {
                        //小程序加载卡住了
                        findNode(id("com.smile.gifmaker.miniapp:id/toolbar_close_btn_container"), true, true)
                        sleep(3000);
                        continue;
                    }
                } else {
                    toast("没有获取到短剧标题");
                    back();
                }
                // 观看视频();
            } else {
                toast("没有短剧");
                sleep(2000);
                back();
            }
        } else if (findNode(textMatch("第\\d+集"))) {
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
        } else if (findNode(id("toolbar_right_menu"))) {
            logd("在小程序界面,点击中心点")
            clickPoint(device.getScreenWidth() * 0.5, device.getScreenHeight() * 0.5)
        } else {
            // loge("未知界面");
            if (未知页面次数 > 3) {
                var 当前url = kuaishouhao[当前账号索引]
                logi(当前账号索引 + "|" + "当前url:" + 当前url);
                if (当前url && 当前url != "undefined") {
                    if (utils.openActivity({
                        "uri": "kwai://webview?url=" + 当前url
                    })) {
                        未知页面次数 = 0;
                    }
                } else {
                    当前账号索引 = 0;
                    // var 当前url = kuaishouhao[当前账号索引]
                    storage.putInt("当前账号索引", 当前账号索引)
                }
            } else {
                toast("等待:" + 未知页面次数)
                未知页面次数++;
            }
            // exit();
        }
        sleep(2000);
    }

    function 切换索引() {
        if (kuaishouhao.length > 1) {
            if (当前账号索引 >= kuaishouhao.length - 1) {
                //1             2   -   1           //最后一个
                当前账号索引 = 0
            } else {
                当前账号索引 += 1
            }
        } else {
            当前账号索引 = 0
        }
        /*if (当前账号索引 < kuaishouhao.length - 2 && 当前账号索引 > -1) {
            //可以增加
            当前账号索引 = Number(当前账号索引 + 1)
        } else {
            当前账号索引 = 0
        }*/
    }

}

main();

function 全局弹窗() {
    var 弹窗tid = thread.execAsync(function () {
        while (true) {
            sleep(1500);
            findNodeS(textMatch("^隐藏$"), true, true)
            // findNodeS(id("com.smile.gifmaker:id/close"), true, true);
            findNodeS(id("com.smile.gifmaker:id/action").text("去看看"), true, true)
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
