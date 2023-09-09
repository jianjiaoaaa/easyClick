function main() {
    // ui.layout("", "http://192.168.2.10:8080/");
    ui.layout("", "index.html");

    //检测自动化服务
    ui.registeH5Function("isServiceOk", function () {
        ui.isServiceOk()
        return ui.isServiceOk();
    })

    //开启自动化服务
    ui.registeH5Function("startEnv", function () {
        return ui.startEnv();
    })

    //检测悬浮窗权限
    ui.registeH5Function("hasFloatViewPermission", function () {
        return ui.hasFloatViewPermission();
    })
    //请求悬浮窗权限
    ui.registeH5Function("requestFloatViewPermissionAsync", function () {
        ui.requestFloatViewPermissionAsync(20000, function (e) {
            logd("请求悬浮窗callback:" + JSON.stringify(e))
        })
    })
}

main();