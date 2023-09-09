//(二指仿真滑动) qx, qy, zx, zy, time 代表起点x,起点y,终点x,终点y,times,timess =随机时间(times,timess)
function rnd_SwipeTwo(qx, qy, zx, zy, time, time1, times) {
    var x = [], ti
    ti = random(time, time1)
    x.push(rndSwipe(qx, qy, zx, zy), rndSwipe(qx, qy, zx, zy))
    gestureTwo(x, ti, times)
}

//(仿真滑动)qx, qy, zx, zy, time 代表起点x,起点y,终点x,终点y,times,timess =随机时间(times,timess)
function rnd_Swipe(qx, qy, zx, zy, time, time1, times, cx, cy) {
    var ti
    ti = random(time, time1)
    gesture(rndSwipe(qx, qy, zx, zy), rndSwipe(zx, zy, cx, cy), ti, times)
}

function bezier_curves(cp, t) {
    var cx, bx, ax, cy, by, ay, tSquared, tCubed, result
    cx = 3.0 * (cp[1].x - cp[0].x);
    bx = 3.0 * (cp[2].x - cp[1].x) - cx;
    ax = cp[3].x - cp[0].x - cx - bx;
    cy = 3.0 * (cp[1].y - cp[0].y);
    by = 3.0 * (cp[2].y - cp[1].y) - cy;
    ay = cp[3].y - cp[0].y - cy - by;

    tSquared = t * t;
    tCubed = tSquared * t;
    result = {
        "x": 0,
        "y": 0
    }
    result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
    result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
    return result;
}


function rndSwipe(qx, qy, zx, zy) {
    var time1, xxy, point, dx0, dx1, dx2, dx3, xxyy, xxxy = []

    // updateConfig("shipinlianjie2","https://v.kuaishou.com/4t9fWo\nhttps://v.kuaishou.com/KRFR2")

    xxy = [];
    point = [];
    dx0 = {
        "x": random(qx, qx + 50),
        "y": random(qy, qy + 50)
    }

    dx1 = {
        "x": random(qx - 100, qx + 100),
        "y": random(qy, qy + 50)
    }
    dx2 = {
        "x": random(zx - 100, zx + 100),
        "y": random(zy, zy + 50),
    }
    dx3 = {
        "x": zx,
        "y": zy
    }

    for (var i = 0; i < 4; i++) {

        eval("point.push(dx" + i + ")");

    }

    for (let i = 0; i < 1; i += 0.01) {
        xxyy = [parseInt(bezier_curves(point, i).x), parseInt(bezier_curves(point, i).y)]
        xxy.push(xxyy);
    }

    return xxy

}


function gesture(swipeList, swipeList1, time, time1) {
    var touch1, touch2, x, i
    touch1 = [{"action": 0, "x": swipeList[0][0], "y": swipeList[0][1], "pointer": 1, "delay": time}]

    for (i in swipeList) {
        ++i;
        if (i === swipeList.length - 1) {
            break;
        }
        touch1.push({"action": 2, "x": swipeList[i][0], "y": swipeList[i][1], "pointer": 1, "delay": time});

    }
    for (i in swipeList1) {
        ++i;
        if (i === swipeList1.length - 2) {
            break;
        }
        touch1.push({"action": 2, "x": swipeList1[i][0], "y": swipeList1[i][1], "pointer": 1, "delay": time});

    }


    touch1.push({
        "action": 1,
        "x": swipeList1[swipeList1.length - 1][0],
        "y": swipeList1[swipeList1.length - 1][1],
        "pointer": 1,
        "delay": time
    })

    logd(JSON.stringify(touch1))

    x = multiTouch(touch1, null, null, time1);
    logd('仿真滑动:' + x);
}

function gestureTwo(swipeList, time, time1) {
    var swipe = swipeList[0]
    var swipe1 = swipeList[1]

    var touch1, touch2, x, i
    touch1 = [{"action": 0, "x": swipe[0][0], "y": swipe[0][1], "pointer": 1, "delay": time}]
    touch2 = [{"action": 0, "x": swipe1[0][0], "y": swipe1[0][1], "pointer": 2, "delay": time}]
    for (i in swipe) {
        ++i;
        if (i === swipe.length - 2) {
            break;
        }
        touch1.push({"action": 2, "x": swipe[i][0], "y": swipe[i][1], "pointer": 1, "delay": time});
        touch2.push({"action": 2, "x": swipe1[i][0], "y": swipe1[i][1], "pointer": 2, "delay": time});
    }
    touch1.push({
        "action": 1,
        "x": swipe[swipe.length - 1][0],
        "y": swipe[swipe.length - 1][1],
        "pointer": 1,
        "delay": time
    })
    touch2.push({
        "action": 1,
        "x": swipe1[swipe1.length - 1][0],
        "y": swipe1[swipe1.length - 1][1],
        "pointer": 2,
        "delay": time
    })

    x = multiTouch(touch1, touch2, null, time1);

    logd('仿真滑动:' + x);
}

//qx, qy, zx, zy, time 代表起点x,起点y,终点x,终点y,times,timess =随机时间(times,timess)
// rnd_Swipe(600,1800,300,400,30,100,500)

function a() {
    //https://v.kuaishou.com/3Qxb3k"按时艰苦的嘎就开始豆瓣啊科技时代吧
    let Ssdun = new SSDUNSDK("e4c67bd053bd9a9171a5fae33a5ccd7869be1d13dd81dbde4c4d8a173db975ac", 3968, 0, "");
    Ssdun.debug = false;
    Ssdun.SsdunConfig.verifyHeartbeatFirst = true;//是否开启 有上次心跳先退出在 验证
// 本地存储 = storages.create("剧能量");


    /*utils.openActivity({
        "uri": "kwai://webview?url=https://v.kuaishou.com/BxNho"
    })
    exit();*/


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

        kuaishouhao = readConfigString("shipinlianjie2") || "";
        // logd("快手链接:" + kuaishouhao)
        if (kuaishouhao) {
            kuaishouhao = kuaishouhao.split(/\n/).filter(e => e);
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
        var 当前视频索引 = 0;//弃用
        toast("--开始运行--")
        重置账号(1)

        // /*
        // return;*/
        // loge("自身内存占用:" + laoleng.app.getSelfMemory())

        while (true) {
            if (findNode(textMatch("打开看看"))) {
                g_ret.click();
            } else if (findNode(text("感谢您的支持,本章解锁后可继续观看"))) {
                findNode(id("com.smile.gifmaker.miniapp:id/toolbar_close_btn_container"), true, true)
                /*if (当前账号索引 >= kuaishouhao.length) {
                    //所有账号已经完成
                    toast("所有视频已经完成")
                    exit();
                } else {
                    toast("切换下一个账号");
                    当前账号索引++;
                    sleep(2000);
                    findNode(id("com.smile.gifmaker.miniapp:id/toolbar_close_btn_container"), true, true)
                }*/
            } else if (findNode(text("确定放弃支付么"))) {
                findNode(text("暂时放弃"), true, true)
            }
            /*else if (findNode(text("支付宝支付"))) {
                if (findNode(text("剩余时间"))) {
                    g_ret.previousSiblings()[0].click();
                } else {
                    back();
                }
                var cx = device.getScreenWidth() / 2;
                var cy = device.getScreenHeight() / 2;
                var sx = random(cx * 0.5, cx * 1.5);
                var ey = random(cy * 1.4, cy * 1.5)
                var ex = random(sx - 50, sx + 50)
                var sy = random(cy * 0.5, cy * 0.6);
                var duration = random(300, 600);
                logd("上滑:" + swipeToPoint(sx, sy, ex, ey, duration));
            } */
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
                        重置账号();
                        重新观看次数 = 0;
                        sleep(5000)
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
                // 登录快手();
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
                /*if (findNode(text("首页")) && findNode(text("精选")) && findNode(text("我"))) {
                    logd("在主页");
                    findNode(textMatch("^我$"), true, true)
                }*/
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
                /*if (findNode(text(g_title))) {
                    var cx = device.getScreenWidth() / 2;
                    var cy = device.getScreenHeight() / 2;
                    var sx = random(cx * 0.5, cx * 1.5);
                    var sy = random(cy * 1.4, cy * 1.5)
                    var ex = random(sx - 50, sx + 50)
                    var ey = random(cy * 0.5, cy * 0.6);
                    var duration = random(300, 600);
                    logd("滑动:" + swipeToPoint(sx, sy, ex, ey, duration));
                } else {
                    logd("没找到title")
                }*/
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

        function 小米清理() {
            var 清理次数 = 0;
            utils.openActivity({
                "action": "android.settings.APPLICATION_DETAILS_SETTINGS",
                "uri": "package:com.smile.gifmaker"
            })
            while (true) {
                sleep(2000)
                //小米
                if (findNode(descMatch("清除数据")) || findNode(textMatch("清除数据"))) {
                    清理次数++;
                    logd("点击清除数据")
                    if (清理次数 > 4) {
                        break;
                    }
                    g_ret.click();
                } else if (findNode(text("清除全部数据"))) {
                    g_ret.click();
                } else if (findNode(text("要清除全部数据吗？"))) {
                    if (findNode(text("确定"), true, true)) {
                        sleep(2000);
                        清理次数 = 5
                        toast("清理成功")
                        break;
                    }
                }
            }
            back();
            sleep(500);
            back();
        }

        function oppo清理() {
            var 清理次数 = 0;
            utils.openActivity({
                "action": "android.settings.APPLICATION_DETAILS_SETTINGS",
                "uri": "package:com.smile.gifmaker"
            })
            while (true) {
                sleep(2000)
                if (findNode(textMatch("清除数据"))) {
                    g_ret.click();
                } else if (findNode(textMatch("^存储占用$"))) {
                    清理次数++;
                    logd("点击清除数据")
                    if (清理次数 > 4) {
                        break;
                    }
                    g_ret.click();
                } else if (findNode(textMatch("^要删除应用数据吗"))) {
                    if (findNode(id("android:id/button1").text("确定"), true, true)) {
                        sleep(2000);
                        清理次数 = 5
                        toast("清理成功")
                        break;
                    }
                } else if (findNode(textMatch("^清除$"))) {
                    logd("清除弹窗")
                } else {
                    logd("OPPO清理")
                }
            }
            back();
            sleep(500);
            back();
        }

        function 鸿蒙清理() {
            var 清理次数 = 0;
            var 删除次数 = 0;
            utils.openActivity({
                "action": "android.settings.APPLICATION_DETAILS_SETTINGS",
                "uri": "package:com.smile.gifmaker"
            })
            while (true) {
                sleep(2000)
                if (findNode(text("删除数据"))) {
                    删除次数++
                    toast("删除数据")
                    if (删除次数 > 3) {
                        break;
                    }
                    g_ret.click();
                } else if (findNode(text("是否删除所选应用数据？"))) {
                    if (findNode(id("android:id/button1").text("确定"), true, true)) {
                        sleep(2000);
                        清理次数 = 4
                        toast("清理成功")
                        break;
                    }
                } else if (findNode(textMatch("^存储$"), true, true)) {
                    清理次数++;
                    toast("清除数据")
                    if (清理次数 > 3) {
                        break;
                    }
                    g_ret.click();
                } else {
                    logd("鸿蒙清理")
                }
            }
            back();
            sleep(500);
            back();
        }

        function 登录快手() {
            var i = 0;
            while (true) {
                i++
                sleep(3000)
                if (i > 15) {
                    logd("登录快手超时")
                    break;
                } else if (findNode(id("com.smile.gifmaker:id/progress"))) {
                    logd("加载中")
                    sleep(2000)
                } else if (findNode(text("captcha"))) {
                    main2();
                } else if (findNode(textMatch("登录失败"))) {
                    findNode(textMatch("确定"), true, true);
                    sleep(1000);
                    back();
                    sleep(1000);
                    back();
                } else if (findNode(id("com.smile.gifmaker:id/user_name_tv"))) {
                    toast("已经登录");
                    break;
                } else if (findNode(id("com.smile.gifmaker:id/qq_login_view")) || findNode(id("com.smile.gifmaker:id/qq_login"))) {
                    toast("qq登录");
                    sleep(1000)
                    g_ret.click();
                } else if (findNode(textMatch("同意").descMatch("同意"))) {
                    toast("同意登录")
                    sleep(1000)
                    g_ret.click();
                } else if (findNode(textMatch("^确认"))) {
                    toast("确认登录")
                    sleep(1000)
                    g_ret.click();
                    sleep(4000)
                } else {
                    toast("打开快手登录页")
                    sleep(1000)
                    logd(utils.openActivity({
                        "uri": "kwai://myprofile"
                    }))
                }
            }
            toast("重登完成");
        }

        function 重置账号(n) {
            logd("===开始更新当前账号索引===" + 当前账号索引)

            if (n) {
                //程序开始运行
            } else {
                切换索引();
            }

            storage.putInt("当前账号索引", 当前账号索引)
            logd("===当前账号索引更新完成===|" + 当前账号索引 + "|" + storage.getInt("当前账号索引", 0))
            jixingIndex = Number(jixingIndex);
            toast("==重置账号==")
            switch (jixingIndex) {
                case 0:
                    小米清理();
                    toast("清理完成")
                    sleep(2000);
                    登录快手()
                    break;
                case 1:
                    鸿蒙清理()
                    toast("清理完成")
                    sleep(2000);
                    登录快手()
                    break;
                case 2:
                    oppo清理()
                    toast("清理完成")
                    sleep(2000);
                    登录快手()
                    break;
                case 3:
                default:
                    toast("无效选择机型");
                    // exit();
                    break;
            }

            // loge("自身内存占用:" + laoleng.app.getSelfMemory())
            // loge("===重启清理脚本===")
            if (n) {

            } else {
                logd("重启脚本")
                thread.stopAll();
                restartScript(null, true, 3)
            }
            // loge("自身内存占用:" + laoleng.app.getSelfMemory())
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

        /*var cx = (bounds.right - bounds.left) / 2 + bounds.left
            var cy = (bounds.bottom - bounds.top) / 2 + bounds.top;
            var sx = random(cx * 0.5, cx * 1.5);
            var sy = random(cy * 1.4, cy * 1.5)
            var ex = random(sx - 10, sx + 10)
            var ey = random(cy * 0.5, cy * 0.6);
            rSwipe.rndSwipe(sx, sy, ex, ey);*/

        /*utils.openActivity({
            action: "com.smile.gifmaker",
            uri: "kwai://profile/[用户UID]",	//打开用户主页,
            pkg: "com.tencent.mobileqq",
        })
        utils.openActivity({
            action: "com.smile.gifmaker",
            uri: "kwai://profile/" + path,
            type: "image/png",
            pkg: "com.android.gallery3d",
            className: "com.android.gallery3d.app.GalleryActivity"
        })*/

        // kwai://profile/[用户UID]	打开用户主页

        /*utils.openActivity({
            pkg: "com.smile.gifmaker",
            className: "com.yxcorp.gifshow.HomeActivity"
        })
        sleep(2000);
        findNode(text("打开"),true,true);*/

    }

    function main2() {
        logd("开始运行")
        var url = "http://api.ttshitu.com/predict";

        // var username = "q1250226357";
        // var password = "Shang521";

        var username = readConfigString("tujianzhanghao");
        var password = readConfigString("tujianmima");
        if (!(username && password)) {
            toast("图鉴账号或密码不对")
            exit();
        }
        var typeid = "33";//根据开发文档进行修改

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
        if (findNode(textMatch("^cutPic"))) {
            cuImg = g_ret;
        } else {
            if (findNode(text("captcha"))) {
                bigImg = g_ret.child(0).child(2)
            } else {
                logd("未找到小图片");
                exit();
            }
        }
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
                    // logd(滑块x + "|" + 滑块y + "|" + (滑块x + 距离) + "|" + ey + "|" + 1000 + "|" + 1500 + "|" + JSON.stringify(滑块.bounds))
                    rnd_Swipe(滑块x, 滑块y, 900, ey, 10, 20, 1000, 滑块x + 距离, ey * 2)
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

    main();

    function 全局弹窗() {
        var 弹窗tid = thread.execAsync(function () {
            while (true) {
                sleep(1500);
                findNodeS(textMatch("^隐藏$"), true, true)
                findNodeS(id("com.smile.gifmaker:id/close"), true, true);
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

}
