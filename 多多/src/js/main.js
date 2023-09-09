function main() {
    laoleng.EC.init();
    laoleng.EC.initImage(false)
    laoleng.EC.initScale(1400, 3200)
    // 主界面操作();
    test()
}

屏幕高度 = device.getScreenHeight();
任务省 = "江苏省";
任务市 = "苏州市";
任务品类 = "肉蛋";
bottomY = 0;
top_tab_bottom = 525;//分类底部y

function 主界面操作() {
    //先领取任务
    // 浏览器操作(1)
    // logd("浏览器操作完成")
    // sleep(1000)
    var step = 0;//0  切换地址  1切换分类   1.5开启录屏     2开始滑动     3滑动到底
    while (true) {
        sleep(2000);
        if (findNode(text("关闭弹窗"))) {
            g_ret.click();
        }

        if (findNode(textMatch("允许“拼多多”获取此设备的位置信息吗"))) {
            sleep(1000)
            findNode(textMatch("^拒绝$"), true, true)
        } else if (findNode(textMatch("^多多买菜$")) && findNode(textMatch("^个人中心$"))) {
            logd("首屏")
            findNode(textMatch("^多多买菜$"), true, true);
        } else if (findNode(textMatch("^切换自提点$"))) {
            logd("切换自提点界面");
            if (findNode(text("选择其他地址"), true, true)) {
                logd("选择其他地址")
            } else {
                findNode(text("点击进入选择其他自提点"), true, true)
                logd("点击进入选择其他自提点")
            }
        } else if (findNode(textMatch("^选择地址$"))) {
            logd("选择地址界面")
            if (findNode(id("region-selector-panel"))) {
                var g_list_fa = g_ret;
                //选择城市
                while (true) {
                    sleep(1000);
                    if (findNode(id("region-selector-list-1"))) {
                        var g_list1 = g_ret;
                        if (findNode(id("region-selector-list-1").child().child().text(任务省))) {
                            g_ret.click();
                            logd("已选择省")
                            break;
                        } else {
                            g_list1.scrollForward();
                        }
                    } else {
                        g_list_fa.child(0).child(0).click();
                    }
                }
                sleep(1000)
                while (true) {
                    if (findNode(id("region-selector-list-2"))) {
                        var g_list1 = g_ret;
                        if (findNode(id("region-selector-list-2").child().child().text(任务市))) {
                            g_ret.click();
                            logd("已选择市")
                            break;
                        } else {
                            g_list1.scrollForward();
                        }
                    } else {
                        break;
                    }
                }

                logd("省市选择完成");
                sleep(2000)
            }

            if (findNode(clz("android.widget.EditText"))) {
                g_ret.inputText("小区")
                sleep(2000);
                var g_editText = g_ret;
                if (findNode(textMatch(任务省 + 任务市 + ".*?"))) {
                    g_ret.click();
                    sleep(2000);
                    var 等待自提点列表 = textMatch("^点击确认选择自提点").getOneNodeInfo(10000)
                    if (等待自提点列表) {
                        if (findNode(id("filter-list-v3-dom").child().text("支持冷冻/冷藏"), true, true)) {
                            sleep(1000);
                            if (findNode(textMatch("^点击确认选择自提点"))) {
                                g_ret.click();
                                logd("已选择自提点");
                                sleep(2000);
                                step = 1;
                            }
                        } else {
                            sleep(1000);
                            if (findNode(textMatch("^点击确认选择自提点"))) {
                                g_ret.click();
                                logd("已选择自提点");
                                sleep(2000);
                                step = 1;
                            }
                        }
                        // var 等待冷冻冷藏=idMatch("vgt-store-item-prefix").child().
                    }
                    // filter-list-v3-dom
                    //点击确认选择自提点龙腾广告印管城回族区管城街66-3号管城街66―3龙腾广告距离最近步行58米
                } else {
                    //点击输入框前面的按钮
                    g_editText.parent().parent().previousSiblings()[0].click();
                }

            }

        } else if (findNode(clz("android.webkit.WebView").text("多多买菜"))) {
            logd("在多多买菜界面")

            switch (step) {
                case 0:
                    logd("0切换地址")
                    findNode(textMatch("点击进行自提点切换"), true)
                    logd(JSON.stringify(g_ret));
                    break;
                case 1:
                    logd("1切换分类");
                    if (findNode(id("mall_home_top_tab_list_id"))) {
                        g_ret.child(1).click();
                        sleep(2000);
                        if (findNode(text("全部分类"))) {
                            if (findNode(textMatch("^" + 任务品类 + "$"))) {
                                logd(JSON.stringify(g_ret))
                                g_ret.click();
                                step = 1.5;
                            } else {
                                logd(2)
                            }
                        } else {
                            logd(3)
                        }
                    }
                    break;
                case 1.5:
                    logd("1.5开启录屏");
                    closeCtrlWindow();
                    if (laoleng.Alert.dialog("点击确定5秒内开启录屏")) {
                        sleep(5000)
                        step = 2
                    }
                    if (findNode(id("mall_home_top_tab_list_id"))) {
                        top_tab_bottom = g_ret.bounds.bottom;
                        logd("分类底部布局:" + top_tab_bottom)
                    } else {
                        logd("退出")
                        exit();
                    }
                    /*for (let i = 0; i < 5; i++) {
                        sleep(1500)
                        if (findNode(id("com.fonelay.screenrecord:id/menu_item_start"))) {
                            logd("开始录屏")
                            g_ret.click();
                            step = 2
                            break;
                        } else if (findNode(id("com.fonelay.screenrecord:id/iv_logo"))) {
                            g_ret.click();
                        } else {
                            ui.toast("没找到录屏悬浮窗")
                        }
                    }*/
                    break;
                case 2:
                    logd("2开始滑动")
                    var start = true;
                    while (true) {
                        sleep(2000);
                        keepScreen();
                        if (findImageByColor1("jiagou.png", 0, 0, 0, 0, 0.6)) {
                            logd(2)
                            logd(JSON.stringify(gPoints))
                            if (start) {
                                // swipeToPoint(gPoints[0]['x'], gPoints[0]['y'] + 140, gPoints[0]['x'] + 10, top_tab_bottom, 2000)
                                swipeToPoint(gPoints[0]['x'], gPoints[0]['y'] + 140, gPoints[0]['x'] + 10, top_tab_bottom, 2000)
                                start = false
                            } else {
                                if (findImageByColor("cainixihuan.png|meiyou.png")) {
                                    logd("滑动结束:" + JSON.stringify(gPoint))
                                    bottomY = gPoint.y
                                    // logd(bottomY)
                                    step = 3
                                    break;
                                } else {
                                    // logd("滑动:" + swipeToPoint(gPoints[0]['x'], 2100, gPoints[0]['x'] + 10, 522, 2000))
                                    logd("滑动:" + swipeToPoint(gPoints[0]['x'], 2975, gPoints[0]['x'] + 10, 932, 2000))
                                }
                            }
                        }
                    }
                    /*laoleng.Alert.dialog("开始滑动", "请开启录屏后点击确认")
                    logd("录屏已开启")
                    sleep(5000)
                    swipeToPoint(random(200, 1000), 2950, random(200, 1000), 2278, random(1500, 2500))
                    sleep(random(3000, 4000))
                    while (true) {
                        keepScreen()
                        if (findImageByColor("cainixihuan.png|meiyou.png")) {
                            logd("结束:" + JSON.stringify(gPoint))
                            bottomY = gPoint.y
                            logd(bottomY)
                            step = 3
                            break;
                        } else {
                            logd("滑动:" + swipeToPoint(random(200, 1000), 2950, random(200, 1000), 934, random(1500, 2500)))
                        }
                        sleep(random(3000, 4000))
                    }*/
                    break;
                case 3://滑动结束,购物车操作
                    logd("滑动结束,加入购物车操作")
                    while (true) {
                        sleep(4000)
                        keepScreen();
                        var endItems
                        if (findImageByColor1("jiagou.png", 0, 0, 0, 0, 0.6)) {//当前界面有加购
                            logd("查到加购")
                            endItems = gPoints

                            logd(JSON.stringify(endItems) + "|" + bottomY);
                            var testArr = endItems.filter(e => e.y < bottomY)
                            logd(JSON.stringify(testArr) + "|" + bottomY);
                            var endItem;
                            if (testArr.length == 1) {
                                //1个加购
                                endItem = testArr[0]
                            } else if (testArr.length > 1) {
                                //多个加购
                                endItem = testArr.pop()
                            } else {
                                //没有符合
                                logd("没有符合");
                                exit();
                            }
                            /*exit();
                            while (true) {
                                keepScreen();
                                sleep(1000)
                                if (findImageByColor("jiagou.png", 500, endItem.y + 50, 1400, bottomY)) {
                                    logd(endItem.y + 50, bottomY)
                                    endItem = {x: gPoint.x, y: gPoint.y}
                                    logd("查询加购:" + JSON.stringify(endItem))
                                } else {
                                    //没有了
                                    logd("没有了")
                                    break;
                                }
                            }
                            logd("最后一个按钮的坐标:" + JSON.stringify(endItem));*/
                            clickPoint(endItem.x + 120, endItem.y + 26)
                            sleep(2000);
                            for (let i = 0; i < 5; i++) {
                                if (findNode(textMatch("点击去支付$"))) {
                                    logd(g_ret.text)
                                    g_ret.click();
                                    // step = 4
                                    sleep(60*1000*60);
                                    showCtrlWindow()
                                    exit();
                                    break;
                                } else {
                                    logd("没找到点击去支付")
                                }
                            }
                            image.recycle(gScreen)
                            break;
                        } else {
                            logd("没有加入购物车")
                            var timer = random(2000, 2500)
                            swipeToPoint(random(200, 1000), 932, random(200, 1000), 2975, timer)
                            sleep(timer)
                            bottomY = 屏幕高度
                        }
                        image.recycle(gScreen)
                    }
                    break;
                case 4:
                    logd("4录屏结束")
                    sleep(3000);
                    for (let i = 0; i < 10; i++) {
                        sleep(2000)
                        if (findNode(id("com.fonelay.screenrecord:id/menu_item_stop"))) {//停止录屏
                            logd("停止录屏")
                            g_ret.click();
                            step = 5
                            break;
                        } else if (findNode(id("com.fonelay.screenrecord:id/iv_logo"))) {//点击录屏悬浮窗
                            logd("点击录屏悬浮窗")
                            g_ret.click()
                        } else {
                            logd("未检测到录屏悬浮窗")
                        }
                    }
                    break;
                case 5://清除已选择的商品
                    for (let i = 0; i < 20; i++) {
                        sleep(2000);
                        if (findNode(text("确认删除"))) {
                            logd("确认删除")
                            g_ret.click()
                        } else if (findNode(text("点击把.*?从购物车中移除"))) {
                            logd("移除商品")
                            g_ret.click()
                        } else {
                            logd("购物车没有商品了,跳出循环,停止脚本")
                            break;
                        }
                    }
                    loge("脚本结束");
                    exit();
                    break;
                case 33333333://__________________________弃用__________________________
                    logd("滑动结束,购物车操作")
                    while (true) {
                        keepScreen();
                        sleep(1000)
                        var endItem
                        if (findImageByColor("jiagou.png", 0, 0, 1400, bottomY, 0.6)) {//当前界面有加购//
                            logd("查到购物车")
                            endItem = gPoint
                            while (true) {
                                keepScreen();
                                sleep(1000)
                                if (findImageByColor("jiagou.png", 500, endItem.y + 50, 1400, bottomY, 0.6)) {
                                    logd(endItem.y + 50, bottomY)
                                    endItem = {x: gPoint.x, y: gPoint.y}
                                    logd("查询加购:" + JSON.stringify(endItem))
                                } else {
                                    //没有了
                                    logd("没有了")
                                    break;
                                }
                            }
                            logd("最后一个按钮的坐标:" + JSON.stringify(endItem));
                            clickPoint(endItem.x + 120, endItem.y + 26)
                            sleep(2000);
                            for (let i = 0; i < 5; i++) {
                                if (findNode(textMatch("点击去支付$"))) {
                                    logd(g_ret.text)
                                    g_ret.click();
                                    exit();
                                    /*var 商品数 = Number(g_ret.text.match(/共(\d+)件/)[1])
                                    logd("购物车:" + 商品数);
                                    if (商品数 > 0) {
                                        g_ret.click();
                                        logd("完成!")
                                        exit();
                                    }*/
                                } else {
                                    logd("没找到点击去支付")
                                }
                            }
                            image.recycle(gScreen)
                            break;
                        } else {
                            swipeToPoint(random(200, 1000), 2950, random(200, 1000), 934, random(1500, 2500))
                        }
                        image.recycle(gScreen)
                    }
                    break;
                default:
                    logd("未知步骤操作")
                    break
            }
        } else {
            logd("未知界面");

            sleep(2000)
            lunchAPP("com.xunmeng.pinduoduo");
        }
    }
}

function 浏览器操作(step) {          //1     领取任务
    logd("开始运行")
    if (step === 1) {
        clickPoint(1109, 686)
        while (true) {
            sleep(random(2000, 4000))
            if (findNode(text("登录系统"))) {
                logd("登录页")
            } else if (findNode(text("领取今日任务"))) {
                logd("领取今日任务")
                sleep(2000)
                g_ret.click()
            } else if (findNode(textMatch("业务信息"))) {
                // 获取省
                if (findNode(textMatch("^账号省份$"))) {
                    var sib = g_ret.nextSiblings()
                    if (sib && sib.length) {
                        logd("任务省" + sib[0].text)
                        任务省 = sib[0].text
                    } else {
                        toast("省份获取失败1")
                        exit();
                    }
                } else {
                    toast("省份获取失败2")
                }

                // 获取市
                if (findNode(textMatch("^账号城市$"))) {
                    var sib = g_ret.nextSiblings()
                    if (sib && sib.length) {
                        logd("任务市" + sib[0].text)
                        任务市 = sib[0].text
                    } else {
                        toast("城市获取失败1")
                    }
                } else {
                    toast("城市获取失败2")
                }

                logd("省市获取完成,等待拉取任务")
                sleep(2000)
                findNode(text("确认并拉取任务"), true, true)
            }
            else if (findNode(textMatch("^任务信息$"))) {
                var 任务状态 = "";
                if (findNode(textMatch("^任务状态$"))) {
                    var sibs = g_ret.nextSiblings()
                    if (sibs && sibs.length) {
                        任务状态 = sibs[0].text;
                    }
                }
                // 获取品类
                if (findNode(textMatch("^品类$"))) {
                    var sib = g_ret.nextSiblings()
                    if (sib && sib.length) {
                        logd("任务品类" + sib[0].text)
                        任务品类 = sib[0].text
                    } else {
                        toast("任务品类获取失败1")
                    }
                } else {
                    toast("任务品类获取失败2")
                }
                if (任务状态 === "等待开始任务") {
                    toast("任务超时,获取下个任务")
                    sleep(1000)
                    findNode(textMatch("开始执行任务"), true, true)
                    var 等待操作结束 = textMatch("操作结束").getOneNodeInfo(10000);
                    if (等待操作结束) {
                        toast("任务开始");
                        sleep(2000);
                        break;
                    }
                } else if (任务状态 === "任务执行中") {
                    var 等待操作结束 = textMatch("操作结束").getOneNodeInfo(10000);
                    if (等待操作结束) {
                        toast("任务执行中");
                        sleep(2000);
                        break;
                    }
                } else if (任务状态 === "任务超时") {
                    toast("任务超时,获取下个任务")
                    sleep(1000)
                    findNode(textMatch("任务超时｜获取下个任务"), true, true)
                } else if (任务状态 === "任务异常") {
                    if (laoleng.Alert.dialog("提示", "获取任务失败,是否重试")) {
                        logd("确认,返回一下")
                        back();
                        continue;
                    } else {
                        logd("取消")
                        exit()
                    }
                } else {
                    logd("未知任务状态")
                    exit();
                }
            }
            else if(findNode(text("获取任务中｜请稍候..."))) {
                toast("等待中...")
                sleep(3000)
            } else {
                logd("未知界面");
                exit()
            }
        }
    } else {

    }
}

function lunchAPP(pkgName) {
    //启动app
    try {
        importPackage(android.content);
        importPackage(android.content.pm);
        importPackage(android.app);
        let pm = context.getPackageManager();
        let intent = pm.getLaunchIntentForPackage(pkgName);
        //        logd(intent);
        // 如果intent为空，就没有安装要跳转的app
        if (intent != null) {
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK |
                Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
            //intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);// 加上这个代表重启APP
            context.startActivity(intent)
            toast("正在启动》》" + pkgName);
        }
    } catch (e) {
        loge(e);
    }
}

function test() {
    var top_tab_bottom = 0;
    if (findNode(id("mall_home_top_tab_list_id"))) {
        top_tab_bottom = g_ret.bounds.bottom;
        logd("分类底部布局:" + top_tab_bottom)
    } else {
        logd("退出")
        exit();
    }

    for (let i = 0; i < 1; i++) {
        keepScreen();
        sleep(2000);
        if (findImageByColor1("jiagou.png"), 0, 0, 0, 0, 0.6) {
            logd(2)
            logd(JSON.stringify(gPoints))
            swipeToPoint(gPoints[0]['x'], gPoints[0]['y'] + 140, gPoints[0]['x'] + 10, top_tab_bottom, 2000)
        }
        logd("第一条")
    }


    for (let i = 0; i < 1000; i++) {
        keepScreen();
        sleep(4000);
        if (findImageByColor1("jiagou.png"), 0, 0, 0, 0, 0.6) {
            logd(2)
            logd(JSON.stringify(gPoints))
            swipeToPoint(gPoints[0]['x'], 2975, gPoints[0]['x'] + 10, 932, 2000)
        }
        logd(6)
    }
}


function test1() {
    sleep(2000)

}

main();
