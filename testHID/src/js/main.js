function main() {
    let i = initHid()
    if (!i) {
        return
    }
}

const initImage = function () {
    image.releaseScreenCapture()
    sleep(10)
    let request = image.requestScreenCapture(10000, 1)
    if (!request) {
        request = image.requestScreenCapture(10000, 1)
    }
    logi("申请截图权限结果... " + request)
    if (!request) {
        toast("申请截图权限失败,结束脚本")
        loge("申请截图权限失败,结束脚本")
        exit()
    }
    sleep(1000)
}

function 开始脚本运行() {
    // initImage();
    // hidEvent.clickPoint(860, 1552);


    logd(2)







}

function initHid() {
    // 先设置一下局域网内的HID程序地址，也可以通过FRP软件映射到外网，然后填写外网地址
    hidEvent.setHidCenter("http://192.168.2.10:8988")
    hidEvent.closeUsbDevice();
    let init = hidEvent.initUsbDevice()
    if (init == null) {
        logd("初始化HID设备成功")
    } else {
        loge("初始化失败:" + init);
        return false
    }
    // 开始矫正屏幕坐标
    let po = hidEvent.checkFirstPoint()
    if (po == null) {
        logd("矫正坐标成功")
        开始脚本运行()
    } else {
        loge("矫正坐标失败:" + init);
        return false
    }
    return true;
}

main();
