ui.layout("", "index.html");
// ui.layout("", "http://192.168.2.10:8080/");
const SSDUNSDK = (function () {

    /**
     * SSDUNSDK
     * @param userKey 平台(控制台)->复制UserKey
     * @param appSecret 平台(软件列表)->Id
     * @param encryptionMode    加密模式选择 0 无加密,1 AES加密 2 RSA加密
     * @param encryptionKey     平台(软件列表)->KEY文件  加密模式为AES没有则留空  加密模式为RSA没有则留空 //下载的rsa文件放在res目录内
     * @param crackDifficulty   加密等级 默认2  3 发送加密+获取本地时间 2发送加密+获取网络时间 1明文发送 +获取网络时间
     * @constructor
     */
    function SSDUNSDK(userKey, appSecret, encryptionMode, encryptionKey, crackDifficulty) {
        this.debug = true;
        this.version = "v4.5";
        this.HTTP = "http://";
        this.http_method = "POST";
        this.HOSTS = ["api.ssdun.cn:8520", "43.143.249.230:8520", "api1.ssdun.cn:8520"];
        this.HOST = this.HOSTS[0];
        this.IsPing = false;

        this.switchCount = 0;
        this.empowerInfo = false;
        this.cardInfo = false;
        this.experienceInfo = false;
        this.exceptionInfo = false;
        logw("https://ssdun.cn 免费安全高效网络验证 版本号", this.version);

        if (!userKey) {
            throw this.Exception("new SSDUNSDK", "`userKey`不能为空 提示：userKey为 平台(控制台)->复制UserKey")
        }
        if (!appSecret) {
            throw this.Exception("new SSDUNSDK", "`appSecret`不能为空 提示：appSecret为平台(软件列表)->Id ")
        }
        this.SsdunConfig = {}
        this.SsdunConfig.cardKey = "ssdun_card";
        this.SsdunConfig.retry_count = 5;
        this.SsdunConfig.returnData = true;
        this.SsdunConfig.verifyHeartbeatFirst = false;

        this.SsdunConfig.encryptionMode = encryptionMode | parseInt(encryptionMode) | 0
        this.SsdunConfig.crackDifficulty = crackDifficulty | parseInt(crackDifficulty) | 1
        this._key = null;
        if (this.SsdunConfig.encryptionMode === 1 && !encryptionKey) {
            throw this.Exception("new SSDUNSDK", "当前选择加密模式为 `AES` 提示： 请填写  `平台(软件列表)->KEY密钥`")
        } else if (this.SsdunConfig.encryptionMode === 1 && encryptionKey) {
            this._key = encryptionKey;
        }
        if (this.SsdunConfig.encryptionMode === 2 && !encryptionKey) {
            throw this.Exception("new SSDUNSDK", "当前选择加密模式为 `RSA` 提示：请填写  `平台(软件列表)->KEY文件`")
        } else if (this.SsdunConfig.encryptionMode === 2 && encryptionKey) {
            this._key = readResString(encryptionKey);

            if (!this._key) {
                throw this.Exception("new SSDUNSDK", "当前选择加密模式为 `RSA` 目录`res`未检测到`" + this.encryptionKey + "`提示： 请将 `" + this.encryptionKey + "`存放到`res`目录内")
            }
        }
        if (parseInt(this.SsdunConfig.encryptionMode) > 0 || parseInt(this.SsdunConfig.crackDifficulty) > 1) {
            if (!loadDex("SsdunUtils.apk")) {
                throw this.Exception("new SSDUNSDK", "Ssdun载入加密插件失败 提示：请确认`SsdunUtils.apk`是否在 `plugin` 内")
            } else {
                this.RSAUtils = new com.plugin.Ssdun.RSAUtils();
                this.AESUtils = new com.plugin.Ssdun.AESUtils();
            }
        }

        this.SsdunConfig.userKey = userKey;
        this.SsdunConfig.appSecret = appSecret;
        this.SsdunConfig.deduct = 0;

    }

    SSDUNSDK.prototype.getUserKey = function () { // 设置备用 api host
        return this.SsdunConfig.userKey
    }


    SSDUNSDK.prototype.setCard = function (card) {
        updateConfig(this.SsdunConfig.cardKey, card)

    }
    SSDUNSDK.prototype.设置卡密 = function (card) {
        this.setCard(card)
    }


    SSDUNSDK.prototype.获取验证信息 = function () {
        if (!this.empowerInfo) {
            this.ExceptionLog("获取验证信息", "请进行 `网络验证` 在执行 `获取验证信息`", 2)
            return false;
        }
        return this.empowerInfo;
    }
    SSDUNSDK.prototype.获取卡密信息 = function () {
        if (!this.cardInfo) {
            this.ExceptionLog("获取卡密信息", "请进行 `卡密验证` 在执行 `获取卡密信息`", 2)
            return false;
        }
        return this.cardInfo;
    }
    SSDUNSDK.prototype.获取试用信息 = function () {
        if (!this.experienceInfo) {
            this.ExceptionLog("获取试用信息", "请进行 `试用验证` 在执行 `获取试用信息`", 2)
            return false;
        }
        return this.experienceInfo;
    }
    /**
     * 一键运行卡密验证
     * @param heartbeatVerify 是否开启心跳验证
     * @param RetryCount    心跳失败重试几次
     */
    SSDUNSDK.prototype.一键运行卡密验证 = function (heartbeatVerify, RetryCount) {
        RetryCount = RetryCount || 2;
        let code = this.卡密验证();
        if (heartbeatVerify) {
            if (code && code !== 0) {
                this.心跳线程(11, 2, RetryCount);

            } else {
                logi("使用免费版本取消心跳线程");
            }
        }
    }
    /**
     * 一键运行网络验证
     * @param heartbeatVerify 是否开启心跳验证
     * @param RetryCount    心跳失败重试几次
     */
    SSDUNSDK.prototype.一键运行网络验证 = function (heartbeatVerify, RetryCount) {

        RetryCount = RetryCount || 2;
        let code = this.网络验证();
        if (heartbeatVerify) {
            if (code && code !== 0) {
                this.心跳线程(11, 1, RetryCount);

            } else {
                logi("使用免费版本取消心跳线程");
            }
        }

    }
    /**
     * 一键运行试用验证
     * @param heartbeatVerify 是否开启心跳验证
     * @param RetryCount    心跳失败重试几次
     */
    SSDUNSDK.prototype.一键运行试用验证 = function (heartbeatVerify, RetryCount) {

        RetryCount = RetryCount || 2;
        let code = this.试用验证();
        if (heartbeatVerify) {
            if (code && code !== 0) {
                this.试用心跳线程(1, 3, RetryCount);
            } else {
                logi("使用免费版本取消心跳线程");
            }
        }

    }

    /**
     * @Ssdun_网络验证
     */
    SSDUNSDK.prototype.网络验证 = function (appSecret) {
        let Namespace = "网络验证";//报错标识
        if (this.SsdunConfig.verifyHeartbeatFirst) {
            let token = readConfigString('ssdun_empower_heartbeat_token');
            if (token) {
                this.empowerLogoutHeartbeat(token);
                deleteConfig("ssdun_empower_heartbeat_token");
            }

        }
        appSecret = appSecret || this.SsdunConfig.appSecret;

        let result = this.empowerVerify(appSecret);
        this.empowerInfo = "";
        if (this.SsdunConfig.returnData) {
            //高手模式 自己做调整
            return result;
        }

        let code = result['code'];
        if (code === 1) {
            this.ExceptionLog(Namespace, "错误代码：" + result['data']['status_code'] + "  错误信息：" + result['data']['error_msg'], 3);
            this.结束脚本();
            return false;
        }
        let data = result['data'];
        let data1;

        switch (parseInt(this.SsdunConfig.encryptionMode)) {
            case 1:
                data1 = this.AES_decrypt(data, this._key);
                if (data1 == null) throw this.Exception(Namespace, "选择的加密模式与平台不符合 数据输出：" + data)

                data = data1;
                break;
            case 2:
                data1 = this.RSA_PublicDecrypt(data, this._key);
                if (data1 == null) throw this.Exception(Namespace, "选择的加密模式与平台不符合 数据输出：" + data)

                data = data1;
                break;


        }

        try {
            data = JSON.parse(data);
        } catch (e) {
            throw this.Exception(Namespace, "选择的加密模式与平台不符合 报错信息：" + e + "\n数据输出：" + data)
        }

        this.serverTimeCheck(data['server_time']);
        switch (parseInt(data['status'])) {
            case 0:
                logd("程序状态：禁用");
                this.结束脚本();
                break;
            case 1:
                logd("程序状态：正常");
                break;

        }
        if (data['is_end'] === 1) {
            logd("到期时间" + data['end_time']);
            logd("脚本已到期");
            this.结束脚本();
        }
        if (this.debug) {
            logd("软件状态码：" + data['status_code']);
            logd("程序标题：" + data['name']);
            logd("程序版本：" + data['version']);
            logd("程序状态：" + data['status']);
            logd("更新地址：" + data['updateurl']);
            logd("绑定模式：" + data['binding']);

            logd("心跳Token：" + data['token']);
            switch (data['binding']) {
                case "0":
                    logd("绑定模式：永久模式");
                    break;
                case "1":
                    logd("绑定模式：到期模式");
                    logd("是否到期：" + data['is_end']);
                    logd("到期时间：" + data['end_time']);
                    break;
                case "2":
                    logd("绑定模式：卡密模式");
                    break;
                case "3":
                    logd("绑定模式：到期+卡密模式");
                    logd("是否到期：" + data['is_end']);
                    logd("到期时间：" + data['end_time']);
                    break;

            }
        }
        logd("网络验证_通过验证");
        this.empowerInfo = data;

        updateConfig("ssdun_empower_heartbeat_token", data['token']);
        return data['token'];
    }
    /**
     * @Ssdun_网络心跳验证
     * @param token 心跳Token
     */
    SSDUNSDK.prototype.网络心跳验证 = function (token) {
        let Namespace = "网络心跳验证";//报错标识
        let result = this.empowerHeartbeat(token);
        if (this.SsdunConfig.returnData) {
            //高手模式 自己做调整
            return result;
        }

        let code = result['code'];


        if (code === 1) {
            this.ExceptionLog(Namespace, "错误代码：" + result['data']['status_code'] + "  错误信息：" + result['data']['error_msg']);
            return result['data']['status_code'];
        }

        let data = result['data'];
        let data1;
        switch (parseInt(this.SsdunConfig.encryptionMode)) {
            case 1:
                data1 = this.AES_decrypt(data, this._key);
                if (data1 == null) throw this.Exception(Namespace, "选择的加密模式与平台不符合 数据输出：" + data)

                data = data1;
                break;
            case 2:
                data1 = this.RSA_PublicDecrypt(data, this._key);
                if (data1 == null) throw this.Exception(Namespace, "选择的加密模式与平台不符合 数据输出：" + data)

                data = data1;
                break;


        }

        try {
            data = JSON.parse(data);
        } catch (e) {
            throw this.Exception(Namespace, "选择的加密模式与平台不符合 报错信息：" + e + "\n数据输出：" + data)
        }
        this.serverTimeCheck(data['server_time']);

        return data['status_code'];
    }
    /**
     * @Ssdun_网络退出心跳验证
     * @param token 心跳Token
     */
    SSDUNSDK.prototype.网络退出心跳验证 = function (token) {
        let Namespace = "网络退出心跳验证";//报错标识

        let result = this.empowerLogoutHeartbeat(token);
        if (this.SsdunConfig.returnData) {
            //高手模式 自己做调整
            return result;
        }

        if (!result) {
            let num = 0;
            while (!result) {
                sleep(1000);//一秒后重新请求一次 请求十次失败返回-1 避免假死
                toast("正在退出重试:" + num + "次");
                result = this.empowerLogoutHeartbeat(token);
                num++;
                if (num > 3) {
                    return -1;
                }

            }

        }
        let code = result['code'];

        if (code === 1) {
            let status_code = result['data']['status_code'];
            this.ExceptionLog(Namespace, "Ssdun_网络退出心跳验证 错误代码：" + status_code + "错误信息：" + result['data']['error_msg']);
            return status_code;
        }


        let data = result['data'];
        let data1;
        switch (parseInt(this.SsdunConfig.encryptionMode)) {
            case 1:
                data1 = this.AES_decrypt(data, this._key);
                if (data1 == null) throw this.Exception(Namespace, "选择的加密模式与平台不符合 数据输出：" + data)

                data = data1;
                break;
            case 2:
                data1 = this.RSA_PublicDecrypt(data, this._key);
                if (data1 == null) throw this.Exception(Namespace, "选择的加密模式与平台不符合 数据输出：" + data)

                data = data1;
                break;


        }

        try {
            data = JSON.parse(data);
        } catch (e) {
            throw this.Exception(Namespace, "选择的加密模式与平台不符合 报错信息：" + e + "\n数据输出：" + data)
        }
        this.serverTimeCheck(data['server_time']);


        return data['status_code'];
    }

    /**
     * @Ssdun_卡密验证

     */
    SSDUNSDK.prototype.卡密验证 = function (card, machineCode, appSecret) {
        let Namespace = "卡密验证";//报错标识
        if (this.SsdunConfig.verifyHeartbeatFirst) {
            let token = readConfigString('ssdun_card_heartbeat_token');
            if (token) {
                this.cardLogoutHeartbeat(token);
                deleteConfig("ssdun_card_heartbeat_token");
            }

        }
        appSecret = appSecret || this.SsdunConfig.appSecret;
        card = card || readConfigString(this.SsdunConfig.cardKey);
        machineCode = machineCode || this.读取机器码(true);

        let result = this.Card_Verify(appSecret, card, machineCode);
        this.cardInfo = "";
        if (this.SsdunConfig.returnData) {
            //高手模式 自己做调整
            return result;
        }
        if (!result) {
            this.ExceptionLog(Namespace, "请求失败");
            this.结束脚本();
            return false;
        }
        let code = result['code'];

        if (code === 1) {
            this.ExceptionLog(Namespace, "错误代码：" + result['data']['status_code'] + "  错误信息：" + result['data']['error_msg']);
            this.结束脚本();
            return false;
        }
        let data = result['data'];
        let data1;
        switch (parseInt(this.SsdunConfig.encryptionMode)) {
            case 1:
                data1 = this.AES_decrypt(data, this._key);
                if (data1 == null) throw this.Exception(Namespace, "选择的加密模式与平台不符合 数据输出：" + data)

                data = data1;
                break;
            case 2:
                data1 = this.RSA_PublicDecrypt(data, this._key);
                if (data1 == null) throw this.Exception(Namespace, "选择的加密模式与平台不符合 数据输出：" + data)

                data = data1;
                break;
        }

        try {
            data = JSON.parse(data);
        } catch (e) {
            throw this.Exception(Namespace, "选择的加密模式与平台不符合 报错信息：" + e + "\n数据输出：" + data)
        }
        this.serverTimeCheck(data['server_time']);


        this.卡密验证效验(appSecret, card, machineCode, data['server_time'], data['sign']);

        if (this.debug) {
            logd("卡密状态码：" + data['status_code']);
            logd("卡密激活时间：" + data['start_time']);
            logd("卡密到期时间：" + data['end_time']);
            logd("卡密剩余天数：" + data['remaining_days']);

            switch (data['card_status']) {
                case 0:
                    logd("卡密状态：初次绑定");
                    break;
                case 1:
                    logd("卡密状态：已绑定");
                    break;
                case 3:
                    logd("卡密状态：解绑后再次绑定");
                    break;
            }

        }

        this.cardInfo = data;
        updateConfig("ssdun_card_heartbeat_token", data['token']);
        logd("卡密验证_通过验证");
        return data['token'];
    }
    /**
     * @Ssdun_卡密心跳验证
     * @param token 心跳Token
     */
    SSDUNSDK.prototype.卡密心跳验证 = function (token) {
        let Namespace = "卡密心跳验证";//报错标识
        let result = this.cardHeartbeat(token);
        if (this.SsdunConfig.returnData) {
            //高手模式 自己做调整
            return result;
        }
        if (!result) {
            let num = 0;
            while (!result) {
                sleep(10000);//十秒后重新请求一次 请求十次失败返回-1

                result = this.cardHeartbeat(token);
                num++;
                if (num > 10) {
                    return -1;
                }

            }

        }

        let code = result['code'];
        if (code === 1) {
            this.ExceptionLog(Namespace, "错误代码：" + result['data']['status_code'] + "  错误信息：" + result['data']['error_msg']);
            return result['data']['status_code'];
        }

        let data = result['data'];
        let data1;

        switch (parseInt(this.SsdunConfig.encryptionMode)) {
            case 1:
                data1 = this.AES_decrypt(data, this._key);
                if (data1 == null) throw this.Exception(Namespace, "选择的加密模式与平台不符合 数据输出：" + data)

                data = data1;
                break;
            case 2:
                data1 = this.RSA_PublicDecrypt(data, this._key);
                if (data1 == null) throw this.Exception(Namespace, "选择的加密模式与平台不符合 数据输出：" + data)

                data = data1;
                break;


        }

        try {
            data = JSON.parse(data);
        } catch (e) {
            throw this.Exception(Namespace, "选择的加密模式与平台不符合 报错信息：" + e + "\n数据输出：" + data)
        }
        this.serverTimeCheck(data['server_time']);

        return data['status_code'];
    }
    /**
     * @Ssdun_卡密退出心跳验证
     * @param token 心跳Token
     */
    SSDUNSDK.prototype.卡密退出心跳验证 = function (token) {
        let Namespace = "卡密退出心跳验证";//报错标识

        let result = this.cardLogoutHeartbeat(token);
        if (this.SsdunConfig.returnData) {
            //高手模式 自己做调整
            return result;
        }


        let code = result['code'];

        if (code === 1) {
            let status_code = result['data']['status_code'];
            this.ExceptionLog(Namespace, " 错误代码：" + status_code + "错误信息：" + result['data']['error_msg']);
            return status_code;
        }


        let data = result['data'];
        let data1;
        switch (parseInt(this.SsdunConfig.encryptionMode)) {
            case 1:
                data1 = this.AES_decrypt(data, this._key);
                if (data1 == null) throw this.Exception(Namespace, "选择的加密模式与平台不符合 数据输出：" + data)

                data = data1;
                break;
            case 2:
                data1 = this.RSA_PublicDecrypt(data, this._key);
                if (data1 == null) throw this.Exception(Namespace, "选择的加密模式与平台不符合 数据输出：" + data)

                data = data1;
                break;


        }

        try {
            data = JSON.parse(data);
        } catch (e) {
            throw this.Exception(Namespace, "选择的加密模式与平台不符合 报错信息：" + e + "\n数据输出：" + data)
        }
        this.serverTimeCheck(data['server_time']);


        return data['status_code'];
    }
    SSDUNSDK.prototype.卡密验证效验 = function (appSecret, card, machineCode, server_time, sign) {
        let data = String(appSecret + card + machineCode + server_time);
        let localSign = UtilsWrapper.prototype.dataMd5(data);
        if (sign === localSign) {
            if (this.debug) {
                logd("卡密效验通过");
            }
            return true;
        }
        loge("卡密效验错误停止使用");
        this.结束脚本();
    }
    /**
     * @Ssdun_卡密解绑
     * @param password  解绑卡密密码 没有则留空
     */
    SSDUNSDK.prototype.卡密解绑 = function (password, deduct, appSecret, card, machineCode) {
        let Namespace = "卡密解绑"
        password = password || ""
        appSecret = appSecret || this.SsdunConfig.appSecret
        card = card || readConfigString(this.SsdunConfig.cardKey) || readConfigString("kami");
        machineCode = machineCode || this.读取机器码(true);
        deduct = deduct || this.SsdunConfig.deduct;

        let result = this.Card_Unset(appSecret, card, machineCode, deduct, password);
        if (this.SsdunConfig.returnData) {
            //高手模式 自己做调整
            return result;
        }
        if (!result) {
            return false;
        }


        let code = result['code'];
        if (code === 1) {
            this.ExceptionLog(Namespace, "错误代码：" + result['data']['status_code'] + "  错误信息：" + result['data']['error_msg']);
            return false;
        }
        this.serverTimeCheck(result['data']['server_time']);

        if (result['data']['status_code'] === 200) {
            loge("Ssdun_卡密解绑解绑成功");
            return true;
        }
        return false;
    }
    /**
     * @Ssdun_卡冲卡
     * @param use_card 充值卡
     */
    SSDUNSDK.prototype.充值卡密 = function (use_card, appSecret, card) {
        let Namespace = "充值卡密"
        appSecret = appSecret || this.SsdunConfig.appSecret;
        card = card || readConfigString(this.SsdunConfig.cardKey);

        let result = this.Card_Add(appSecret, card, use_card);
        if (this.SsdunConfig.returnData) {
            //高手模式 自己做调整
            return result;
        }
        if (!result) {
            return false;
        }

        let code = result['code'];
        if (code === 1) {
            this.ExceptionLog(Namespace, "错误代码：" + result['data']['status_code'] + "  错误信息：" + result['data']['error_msg']);
            return false;
        }
        this.serverTimeCheck(result['data']['server_time']);


        logi("卡充值成功 充值天数：", result['data']['recharge_days']);
        return true;


    }


    /**
     * @Ssdun_试用验证

     */
    SSDUNSDK.prototype.试用验证 = function (appSecret, machineCode) {

        let Namespace = "试用验证";
        appSecret = appSecret || this.SsdunConfig.appSecret;
        machineCode = machineCode || Ssdun.读取机器码(true);
        this.experienceInfo = "";

        let result = this.experienceVerify(appSecret, machineCode);
        if (this.SsdunConfig.returnData) {
            //高手模式 自己做调整
            return result;
        }

        let code = result['code'];
        if (code === 1) {
            this.ExceptionLog(Namespace, "错误代码：" + result['data']['status_code'] + "  错误信息：" + result['data']['error_msg']);
            this.结束脚本();
            return false;
        }
        let data = result['data'];
        let data1;
        switch (parseInt(this.SsdunConfig.encryptionMode)) {
            case 1:
                data1 = Ssdun.encryption.AES_decrypt(data, SsdunConfig.aesKey);
                data = data1;
                break;
            case 2:
                let rsaKey = readResString(SsdunConfig.rsaPath);
                data1 = Ssdun.encryption.RSA_PublicDecrypt(data, rsaKey);
                data = data1;
                break;
        }


        data = JSON.parse(data);
        this.serverTimeCheck(data['server_time']);


        this.试用验证效验(appSecret, machineCode, data['server_time'], data['sign']);
        if (this.debug) {
            logd("试用状态码：" + data['status_code']);
            logd("试用时间：" + data['experienceTime'] + "(分钟)");
            logd("试用到期时间：" + data['end_time']);
        }


        updateConfig("ssdun_experience_heartbeat_token", data['token']);
        this.experienceInfo = data;

        logd("试用验证_通过验证");
        return data['token'];
    }
    /**
     * @Ssdun_试用心跳验证
     * @param Token 心跳Token
     */
    SSDUNSDK.prototype.试用心跳验证 = function (Token, appSecret, machineCode) {


        let Namespace = "试用心跳验证";
        let result = this.experienceHeartbeat(Token);
        if (this.SsdunConfig.returnData) {
            //高手模式 自己做调整
            return result;
        }


        let code = result['code'];
        if (code === 1) {
            this.ExceptionLog(Namespace, "错误代码：" + result['data']['status_code'] + "  错误信息：" + result['data']['error_msg']);
            this.结束脚本();
            return false;
        }
        let data = result['data'];
        let data1;
        switch (parseInt(this.SsdunConfig.encryptionMode)) {
            case 1:
                data1 = Ssdun.encryption.AES_decrypt(data, SsdunConfig.aesKey);
                data = data1;
                break;
            case 2:
                let rsaKey = readResString(SsdunConfig.rsaPath);
                data1 = Ssdun.encryption.RSA_PublicDecrypt(data, rsaKey);
                data = data1;
                break;


        }


        data = JSON.parse(data);
        this.serverTimeCheck(data['server_time']);
        appSecret = appSecret || this.SsdunConfig.appSecret;
        machineCode = machineCode || this.读取机器码(true);

        this.试用验证效验(appSecret, machineCode, data['server_time'], data['sign']);

        return data['status_code'];

    }
    /**
     * @Ssdun_试用心跳线程
     * @param req_interval              请求间隔 单位分,最快1分钟心跳一次 建议1分钟心跳一次.
     * @param Type                       1 Ssdun_网络心跳验证，2 Ssdun_卡密心跳验证 3试用心跳验证
     * @param RetryCount                 默认一次 重试几次不成功则停止脚本
     */
    SSDUNSDK.prototype.试用心跳线程 = function (req_interval, Type, RetryCount) {

        req_interval = req_interval || 1;
        req_interval *= 1000 * 60;
        RetryCount = RetryCount || 1;
        Type = Type || 3;

        let HeartbeatStatus = 0;
        let RetryCounts = 0;

        thread.execAsync(() => {


            while (true) {
                let 心跳token
                switch (Type) {
                    case 1:
                        logd("===================Ssdun_网络心跳验证心跳====================");
                        HeartbeatStatus = this.网络心跳验证(readConfigString("ssdun_empower_heartbeat_token"));
                        switch (HeartbeatStatus) {
                            case 10100:
                                RetryCounts = 0;
                                logd("心跳正常");
                                break;
                            case -10101:
                                RetryCounts++;
                                if (RetryCounts > RetryCount) {
                                    logd("心跳频繁 重新验证");
                                    this.网络退出心跳验证(readConfigString("ssdun_empower_heartbeat_token"));
                                    心跳token = this.网络验证();
                                    if (心跳token) {
                                        logd("登录心跳:" + 心跳token);
                                        updateConfig("ssdun_empower_heartbeat_token", 心跳token);
                                    } else {
                                        this.结束脚本();
                                    }

                                }
                                break;
                            case -1:
                                logd("心跳请求失败");
                                RetryCounts++;
                                if (RetryCounts > RetryCount) {
                                    logd("心跳重试失败");
                                    this.结束脚本();
                                }
                                break;
                            case -10102:
                                logd("心跳过期或失效不存在");
                                this.结束脚本();
                                break;
                        }
                        break;
                    case 2:
                        logd("==================Ssdun_卡密心跳验证心跳====================");
                        HeartbeatStatus = this.卡密心跳验证(readConfigString("ssdun_card_heartbeat_token"));
                        switch (HeartbeatStatus) {
                            case 10100:
                                RetryCounts = 0;
                                logd("心跳正常");
                                break;
                            case -10101:
                                RetryCounts++;
                                if (RetryCounts > RetryCount) {
                                    logd("心跳频繁 重新登录卡密");
                                    this.卡密退出心跳验证(readConfigString("ssdun_card_heartbeat_token"));
                                    心跳token = this.卡密验证();
                                    if (心跳token) {
                                        logd("卡密登录心跳:" + 心跳token);
                                        updateConfig("ssdun_card_heartbeat_token", 心跳token);
                                    } else {
                                        this.结束脚本();
                                    }
                                }
                                break;
                            case -10102:
                                logd("心跳过期或失效不存在,重新登录卡密");
                                this.结束脚本();

                                break;
                            case -1:
                                logd("心跳请求失败");
                                RetryCounts++;
                                if (RetryCounts > RetryCount) {
                                    logd("心跳重试失败");
                                    this.结束脚本();
                                }
                                break;
                        }
                        break;
                    case 3:
                        logd("==================Ssdun_试用心跳====================");
                        HeartbeatStatus = this.试用心跳验证(readConfigString("ssdun_experience_heartbeat_token"));
                        switch (HeartbeatStatus) {
                            case 10100:
                                RetryCounts = 0;
                                logd("心跳正常");
                                break;
                            default:
                                this.结束脚本();
                                break;

                        }

                }
                sleep(req_interval);


            }
        })
    }
    SSDUNSDK.prototype.试用验证效验 = function (appSecret, machineCode, server_time, sign) {
        appSecret = appSecret || this.SsdunConfig.appSecret;
        machineCode = machineCode || this.读取机器码(true);
        let data = String(appSecret + machineCode + server_time);
        let localSign = UtilsWrapper.prototype.dataMd5(data);
        if (sign === localSign) {
            if (this.debug) {
                logd("试用效验通过");
            }
            return true;
        }

        loge("试用效验错误停止使用");
        this.结束脚本();
    }

    /**
     * @Ssdun_创建远程变量
     * @param name 变量昵称
     * @param Var 变量内容
     * 返回 变量appSecret
     */
    SSDUNSDK.prototype.创建远程变量 = function (name, Var) {

        let Namespace = "创建远程变量";

        let result = this.remoteVarCreate(name, Var);
        if (this.SsdunConfig.returnData) {
            //高手模式 自己做调整
            return result;
        }

        let code = result['code'];
        if (code === 1) {
            this.ExceptionLog(Namespace, "错误代码：" + result['data']['status_code'] + "  错误信息：" + result['data']['error_msg']);
            this.结束脚本();
            return false;
        }
        return result['data']['app_secret'];

    }
    /**
     * @Ssdun_删除远程变量
     * @param appSecret 变量列表的ID
     */
    SSDUNSDK.prototype.删除远程变量 = function (appSecret) {

        let Namespace = "删除远程变量";


        let result = this.remoteVarDelete(appSecret);
        if (this.SsdunConfig.returnData) {
            //高手模式 自己做调整
            return result;
        }


        let code = result['code'];
        if (code === 1) {
            this.ExceptionLog(Namespace, "错误代码：" + result['data']['status_code'] + "  错误信息：" + result['data']['error_msg']);
            this.结束脚本();
            return false;
        }

        return true;

    }
    /**
     * @Ssdun_获取远程变量
     * @param appSecret 变量列表的ID
     */
    SSDUNSDK.prototype.获取远程变量 = function (appSecret) {

        let Namespace = "获取远程变量";

        let result = this.remoteVarGet(appSecret);
        if (this.SsdunConfig.returnData) {
            //高手模式 自己做调整
            return result;
        }

        let code = result['code'];
        if (code === 1) {
            this.ExceptionLog(Namespace, "错误代码：" + result['data']['status_code'] + "  错误信息：" + result['data']['error_msg']);
            this.结束脚本();
            return false;
        }


        return result['data']['var'];

    }
    /**
     * @Ssdun_设置远程变量
     * @param appSecret 变量列表的ID
     * @param Var 要设置的值
     */
    SSDUNSDK.prototype.设置远程变量 = function (appSecret, Var) {

        let Namespace = "设置远程变量";
        let result = this.remoteVarSet(appSecret, Var);
        if (this.SsdunConfig.returnData) {
            //高手模式 自己做调整
            return result;
        }
        let code = result['code'];
        if (code === 1) {
            this.ExceptionLog(Namespace, "错误代码：" + result['data']['status_code'] + "  错误信息：" + result['data']['error_msg']);
            this.结束脚本();
            return false;
        }

        return true;

    }

    /**
     * @Ssdun_获取远程变量
     * @param appSecret 变量列表的ID
     * @param token 网络验证心跳或者卡密验证心跳 默认读取优先级 卡密心跳>网络验证心跳
     */
    SSDUNSDK.prototype.获取远程变量V5 = function (appSecret, token) {

        token = token || readConfigString("ssdun_card_heartbeat_token");
        token = token || readConfigString("ssdun_empower_heartbeat_token");
        let Namespace = "获取远程变量V5";
        let result = this.remoteVarGetV5(appSecret, token);
        if (this.SsdunConfig.returnData) {
            //高手模式 自己做调整
            return result;
        }


        let code = result['code'];
        if (code === 1) {
            this.ExceptionLog(Namespace, "错误代码：" + result['data']['status_code'] + "  错误信息：" + result['data']['error_msg']);
            this.结束脚本();
            return false;
        }


        return result['data']['var'];

    }


    /**
     * @Ssdun_运行远程函数
     * @param appSecret 变量列表的ID
     * @param funn_name 运行函数名与参数
     * @param parameters
     */
    SSDUNSDK.prototype.运行远程函数 = function (appSecret, funn_name, parameters) {

        let Namespace = "运行远程函数";
        let result = this.remoteFunGet(appSecret, funn_name, parameters);
        if (this.SsdunConfig.returnData) {
            //高手模式 自己做调整
            return result;
        }

        let code = result['code'];
        if (code === 1) {
            this.ExceptionLog(Namespace, "错误代码：" + result['data']['status_code'] + "  错误信息：" + result['data']['error_msg']);
            this.结束脚本();
            return false;
        }
        return result['data']['result'];

    }

    /**
     * @Ssdun_心跳线程
     * @param req_interval              请求间隔 单位分,最快10分钟心跳一次 建议30分钟心跳一次 最慢59分钟一次 .
     * @param Type                       1 Ssdun_网络心跳验证，2 Ssdun_卡密心跳验证
     * @param RetryCount                 默认一次 重试几次不成功则停止脚本
     */
    SSDUNSDK.prototype.心跳线程 = function (req_interval, Type, RetryCount) {

        req_interval = req_interval || 10;
        req_interval < 10 ? req_interval = 10 * 1000 * 60 : req_interval *= 1000 * 60;
        RetryCount = RetryCount || 1;
        RetryCount >= 5 ? RetryCount = 4 : RetryCount;

        let HeartbeatStatus = 0;
        let RetryCounts = 0;

        thread.execAsync(() => {


            while (true) {
                let 心跳token;
                switch (Type) {
                    case 1:
                        logd("===================Ssdun_网络心跳验证心跳====================");
                        HeartbeatStatus = this.网络心跳验证(readConfigString("ssdun_empower_heartbeat_token"));
                        switch (HeartbeatStatus) {
                            case 10100:
                                RetryCounts = 0;
                                logd("心跳正常");
                                break;
                            case -10101:
                                logd("心跳频繁拒绝");
                                RetryCounts++;
                                if (RetryCounts > RetryCount) {
                                    this.网络退出心跳验证(readConfigString("ssdun_empower_heartbeat_token"));
                                    心跳token = this.网络验证();
                                    if (心跳token) {
                                        logd("登录心跳:" + 心跳token)
                                        updateConfig("ssdun_empower_heartbeat_token", 心跳token)
                                    } else {
                                        this.结束脚本();
                                    }


                                }
                                break;
                            case -1:
                                logd("心跳请求失败");
                                RetryCounts++;
                                if (RetryCounts > RetryCount) {
                                    logd("心跳重试失败");
                                    this.结束脚本();
                                }
                                break;
                            case -10102:
                                logd("心跳过期或失效不存在,重新登录验证");
                                心跳token = this.网络验证();
                                if (心跳token) {
                                    logd("登录心跳:" + 心跳token);
                                    updateConfig("ssdun_empower_heartbeat_token", 心跳token);
                                }
                                break;
                        }


                        break;
                    case 2:
                        logd("==================Ssdun_卡密心跳验证心跳====================");
                        HeartbeatStatus = this.卡密心跳验证(readConfigString("ssdun_card_heartbeat_token"));
                        switch (HeartbeatStatus) {
                            case 10100:
                                RetryCounts = 0;
                                logd("心跳正常");
                                break;
                            case -10101:
                                logd("心跳频繁拒绝");
                                RetryCounts++;

                                if (RetryCounts > RetryCount) {
                                    this.卡密退出心跳验证(readConfigString("ssdun_card_heartbeat_token"));
                                    心跳token = this.卡密验证();
                                    if (心跳token) {
                                        logd("卡密登录心跳:" + 心跳token);
                                        updateConfig("ssdun_card_heartbeat_token", 心跳token);
                                    } else {
                                        this.结束脚本();
                                    }
                                }


                                break;
                            case -10102:
                                logd("心跳过期或失效不存在,重新登录卡密");
                                心跳token = this.卡密验证();
                                if (心跳token) {
                                    logd("卡密登录心跳:" + 心跳token);
                                    updateConfig("ssdun_card_heartbeat_token", 心跳token);
                                } else {
                                    this.结束脚本();
                                }
                                break;
                            case -1:
                                logd("心跳请求失败");
                                RetryCounts++;
                                if (RetryCounts > RetryCount) {
                                    logd("心跳重试失败");
                                    this.结束脚本();
                                }
                                break;
                        }
                        break;


                }
                sleep(req_interval);


            }
        })
    }
    SSDUNSDK.prototype.读取机器码 = function (readConfig) {
        let code;
        if (readConfig) {
            code = readConfigString('ssdun_machine_code');
            if (!code || code === "undefined") {
                code = this.getDeviceID();
                updateConfig("ssdun_machine_code", code);
                return String(code);
            }
            return String(code);
        }
        code = this.getDeviceID();
        updateConfig("ssdun_machine_code", code);
        return String(code);

    }
    SSDUNSDK.prototype.结束脚本 = function (delay) {
        delay = delay || 1000;

        sleep(delay);
        exit();

    }


//内部处理函数
    /*请求类*/
    SSDUNSDK.prototype.empowerVerify = function (appSecret) {
        let Namespace = "empowerVerify";//报错标识


        let path = '/V4/empower/verify';
        let timestamp;

        let max_retries = this.SsdunConfig.retry_count;
        let retry_count = 0, result;

        do {
            let delay = this.retryFib(retry_count);
            retry_count++;

            if (this.SsdunConfig.crackDifficulty === 3) {
                timestamp = this.GetLocalTimestamp();
            } else {
                timestamp = this.GetNetworkTimestamp();
            }
            /**
             * @sign排序
             * user_key
             * appSecret
             * timestamp
             **/
            //转换成字符串
            appSecret = String(appSecret);
            let params = "user_key=" + this.SsdunConfig.userKey + "&app_secret=" + appSecret + "&timestamp=" + timestamp;
            let sign = this.sign(path, params, appSecret);
            let sendData = {
                "app_secret": appSecret,
                'user_key': this.SsdunConfig.userKey,
                "timestamp": timestamp,
                "sign": sign
            };
            result = this.httpPost(Namespace, path, sendData);
            if (result.code !== -1) break;


            sleep(delay * 1000);
        } while (retry_count < max_retries)
        return result;
    }
    SSDUNSDK.prototype.empowerHeartbeat = function (token) {

        let Namespace = "empowerHeartbeat";//报错标识
        let path = '/V4/empower/heartbeat';


        let timestamp;
        let max_retries = this.SsdunConfig.retry_count;
        let retry_count = 0, result;

        do {
            let delay = this.retryFib(retry_count);
            retry_count++;
            if (this.SsdunConfig.crackDifficulty === 3) {
                timestamp = this.GetLocalTimestamp();
            } else {
                timestamp = this.GetNetworkTimestamp();
            }
            /**
             * @sign排序
             * token
             * timestamp
             **/
            //转换成字符串
            token = String(token);
            let params = "token=" + token + "&timestamp=" + timestamp;
            let sign = this.sign(path, params);
            let sendData = {"token": token, "timestamp": timestamp, "sign": sign};

            result = this.httpPost(Namespace, path, sendData);
            if (result.code !== -1) break;


            sleep(delay * 1000);
        } while (retry_count < max_retries)
        return result;


    }
    SSDUNSDK.prototype.empowerLogoutHeartbeat = function (token) {
        let Namespace = "empowerLogoutHeartbeat";//报错标识
        let path = '/V4/empower/logout_heartbeat';
        let timestamp;
        let max_retries = this.SsdunConfig.retry_count;
        let retry_count = 0, result;

        do {
            let delay = this.retryFib(retry_count);
            retry_count++;
            if (this.SsdunConfig.crackDifficulty === 3) {
                timestamp = this.GetLocalTimestamp();
            } else {
                timestamp = this.GetNetworkTimestamp();
            }

            /**
             * @sign排序
             * token
             * timestamp
             **/
            //转换成字符串
            token = String(token);
            let params = "token=" + token + "&timestamp=" + timestamp;
            let sign = this.sign(path, params);

            let sendData = {"token": token, "timestamp": timestamp, "sign": sign};


            result = this.httpPost(Namespace, path, sendData);
            if (result.code !== -1) break;


            sleep(delay * 1000);
        } while (retry_count < max_retries)
        return result;


    }
    SSDUNSDK.prototype.experienceVerify = function (appSecret, machine_code) {
        let Namespace = "experienceVerify";//报错标识
        let path = '/V4/empower/experience';
        let timestamp;
        let max_retries = this.SsdunConfig.retry_count;
        let retry_count = 0, result;

        do {
            let delay = this.retryFib(retry_count);
            retry_count++;
            if (this.SsdunConfig.crackDifficulty === 3) {
                timestamp = this.GetLocalTimestamp();
            } else {
                timestamp = this.GetNetworkTimestamp();
            }

            /**
             * @sign排序
             * user_key
             * appSecret
             * card
             * machine_code
             * timestamp
             *
             **/

            //转换成字符串
            appSecret = String(appSecret);

            machine_code = String(machine_code);
            let params = "user_key=" + this.SsdunConfig.userKey + "&app_secret=" + appSecret + "&machine_code=" + machine_code + "&timestamp=" + timestamp;
            let sign = this.sign(path, params, appSecret);

            let sendData = {
                "machine_code": machine_code,
                "app_secret": appSecret,
                'user_key': this.SsdunConfig.userKey,
                "timestamp": timestamp,
                "sign": sign
            };
            result = this.httpPost(Namespace, path, sendData);
            if (result.code !== -1) break;


            sleep(delay * 1000);
        } while (retry_count < max_retries)
        return result;


    }
    SSDUNSDK.prototype.experienceHeartbeat = function (token) {
        let Namespace = "experienceHeartbeat";//报错标识

        let path = '/V4/empower/experience_heartbeat';
        let timestamp;
        let max_retries = this.SsdunConfig.retry_count;
        let retry_count = 0, result;

        do {
            let delay = this.retryFib(retry_count);
            retry_count++;
            if (this.SsdunConfig.crackDifficulty === 3) {
                timestamp = this.GetLocalTimestamp();
            } else {
                timestamp = this.GetNetworkTimestamp();
            }

            /**
             * @sign排序
             * token
             * timestamp
             **/
            //转换成字符串
            token = String(token);
            let params = "token=" + token + "&timestamp=" + timestamp;
            let sign = this.sign(path, params);

            let sendData = {"token": token, "timestamp": timestamp, "sign": sign};
            result = this.httpPost(Namespace, path, sendData);
            if (result.code !== -1) break;


            sleep(delay * 1000);
        } while (retry_count < max_retries)
        return result;


    }

    SSDUNSDK.prototype.Card_Verify = function (appSecret, card, machine_code) {
        let Namespace = "Card_Verify";//报错标识
        let path = '/V4/card/verify';
        let timestamp;
        let max_retries = this.SsdunConfig.retry_count;
        let retry_count = 0, result;

        do {
            let delay = this.retryFib(retry_count);
            retry_count++;
            if (this.SsdunConfig.crackDifficulty === 3) {
                timestamp = this.GetLocalTimestamp();
            } else {
                timestamp = this.GetNetworkTimestamp();
            }
            /**
             * @sign排序
             * user_key
             * appSecret
             * card
             * machine_code
             * timestamp
             *
             **/

            //转换成字符串
            appSecret = String(appSecret);
            card = String(card);
            machine_code = String(machine_code);
            let params = "user_key=" + this.SsdunConfig.userKey + "&app_secret=" + appSecret + "&card=" + card + "&machine_code=" + machine_code + "&timestamp=" + timestamp;
            let sign = this.sign(path, params, appSecret);

            let sendData = {
                "card": card,
                "machine_code": machine_code,
                "app_secret": appSecret,
                'user_key': this.SsdunConfig.userKey,
                "timestamp": timestamp,
                "sign": sign
            };

            result = this.httpPost(Namespace, path, sendData);
            if (result.code !== -1) break;


            sleep(delay * 1000);
        } while (retry_count < max_retries)
        return result;


    }
    SSDUNSDK.prototype.cardHeartbeat = function (token) {
        let Namespace = "Card_Heartbeat";//报错标识


        let path = '/V4/card/heartbeat';
        let timestamp;
        let max_retries = this.SsdunConfig.retry_count;
        let retry_count = 0, result;

        do {
            let delay = this.retryFib(retry_count);
            retry_count++;
            if (this.SsdunConfig.crackDifficulty === 3) {
                timestamp = this.GetLocalTimestamp();
            } else {
                timestamp = this.GetNetworkTimestamp();
            }

            /**
             * @sign排序
             * token
             * timestamp
             **/
            //转换成字符串
            token = String(token);
            let params = "token=" + token + "&timestamp=" + timestamp;
            let sign = this.sign(path, params);

            let sendData = {"token": token, "timestamp": timestamp, "sign": sign};
            result = this.httpPost(Namespace, path, sendData);
            if (result.code !== -1) break;


            sleep(delay * 1000);
        } while (retry_count < max_retries)
        return result;


    }
    SSDUNSDK.prototype.cardLogoutHeartbeat = function (token) {
        let Namespace = "Card_LogoutHeartbeat";//报错标识


        let path = '/V4/card/logout_heartbeat';
        let timestamp;
        let max_retries = this.SsdunConfig.retry_count;
        let retry_count = 0, result;

        do {
            let delay = this.retryFib(retry_count);
            retry_count++;
            if (this.SsdunConfig.crackDifficulty === 3) {
                timestamp = this.GetLocalTimestamp();
            } else {
                timestamp = this.GetNetworkTimestamp();
            }

            /**
             * @sign排序
             * token
             * timestamp
             **/
            //转换成字符串
            token = String(token);
            let params = "token=" + token + "&timestamp=" + timestamp;
            let sign = this.sign(path, params);

            let sendData = {"token": token, "timestamp": timestamp, "sign": sign};

            result = this.httpPost(Namespace, path, sendData);
            if (result.code !== -1) break;


            sleep(delay * 1000);
        } while (retry_count < max_retries)
        return result;


    }
    SSDUNSDK.prototype.Card_Unset = function (appSecret, card, machine_code, deduct, password) {
        let Namespace = "Card_Uerify";//报错标识


        let path = '/V4/card/unset';
        let timestamp;
        let max_retries = this.SsdunConfig.retry_count;
        let retry_count = 0, result;

        do {
            let delay = this.retryFib(retry_count);
            retry_count++;
            if (this.SsdunConfig.crackDifficulty === 3) {
                timestamp = this.GetLocalTimestamp();
            } else {
                timestamp = this.GetNetworkTimestamp();
            }

            /**
             * @sign排序
             * user_key
             * appSecret
             * card
             * machine_code
             * timestamp
             *
             **/

            //转换成字符串
            appSecret = String(appSecret);
            card = String(card);
            machine_code = String(machine_code);
            let params = "user_key=" + this.SsdunConfig.userKey + "&app_secret=" + appSecret + "&card=" + card + "&machine_code=" + machine_code + "&deduct=" + deduct + "&password=" + password + "&timestamp=" + timestamp;
            let sign = this.sign(path, params, appSecret);
            let sendData = {
                "card": card,
                "machine_code": machine_code,
                "app_secret": appSecret,
                'user_key': this.SsdunConfig.userKey,
                "deduct": deduct,
                "timestamp": timestamp,
                "sign": sign,
                "password": password,
            };

            result = this.httpPost(Namespace, path, sendData);
            if (result.code !== -1) break;


            sleep(delay * 1000);
        } while (retry_count < max_retries)
        return result;


    }
    SSDUNSDK.prototype.Card_Add = function (appSecret, card, use_card) {
        let Namespace = "Card_Add";//报错标识

        let path = '/V4/card/add';
        let timestamp;
        let max_retries = this.SsdunConfig.retry_count;
        let retry_count = 0, result;

        do {
            let delay = this.retryFib(retry_count);
            retry_count++;
            if (this.SsdunConfig.crackDifficulty === 3) {
                timestamp = this.GetLocalTimestamp();
            } else {
                timestamp = this.GetNetworkTimestamp();
            }

            /**
             * @sign排序
             * user_key
             * appSecret
             * card
             * machine_code
             * timestamp
             *
             **/

            //转换成字符串
            appSecret = String(appSecret);
            card = String(card);

            let params = "user_key=" + this.SsdunConfig.userKey + "&app_secret=" + appSecret + "&card=" + card + "&use_card=" + use_card + "&timestamp=" + timestamp;
            let sign = this.sign(path, params, appSecret);

            let sendData = {
                "card": card,
                "use_card": use_card,
                "app_secret": appSecret,
                'user_key': this.SsdunConfig.userKey,
                "timestamp": timestamp,
                "sign": sign
            };
            result = this.httpPost(Namespace, path, sendData);
            if (result.code !== -1) break;


            sleep(delay * 1000);
        } while (retry_count < max_retries)
        return result;

    }

    SSDUNSDK.prototype.remoteVarGetV5 = function (appSecret, token) {
        let Namespace = "Get_Remote_VarV5";//报错标识
        let path = '/V5/remote/get_var';
        let timestamp;
        let max_retries = this.SsdunConfig.retry_count;
        let retry_count = 0, result;

        do {
            let delay = this.retryFib(retry_count);
            retry_count++;
            if (this.SsdunConfig.crackDifficulty === 3) {
                timestamp = this.GetLocalTimestamp();
            } else {
                timestamp = this.GetNetworkTimestamp();
            }

            /**
             * @sign排序
             * user_key
             * appSecret
             * timestamp
             **/
            //转换成字符串
            appSecret = String(appSecret);
            let params = "user_key=" + this.SsdunConfig.userKey + "&app_secret=" + appSecret + "&token=" + token + "&timestamp=" + timestamp;
            let sign = this.sign(path, params, appSecret);

            let sendData = {
                "app_secret": appSecret,
                "token": token,
                'user_key': this.SsdunConfig.userKey,
                "timestamp": timestamp,
                "sign": sign
            };

            result = this.httpPost(Namespace, path, sendData);
            if (result.code !== -1) break;


            sleep(delay * 1000);
        } while (retry_count < max_retries)
        return result;


    }

    SSDUNSDK.prototype.remoteVarCreate = function (name, Var) {
        let Namespace = "Create_Remote_Var";//报错标识
        let path = '/V4/remote/create_var';
        let timestamp;
        let max_retries = this.SsdunConfig.retry_count;
        let retry_count = 0, result;

        do {
            let delay = this.retryFib(retry_count);
            retry_count++;
            if (this.SsdunConfig.crackDifficulty === 3) {
                timestamp = this.GetLocalTimestamp();
            } else {
                timestamp = this.GetNetworkTimestamp();
            }

            /**
             * @sign排序
             * user_key
             * appSecret
             * timestamp
             **/
                //转换成字符串
            let params = "user_key=" + this.SsdunConfig.userKey + "&name=" + name + "&var=" + Var + "&timestamp=" + timestamp;
            let sign = this.sign(path, params);

            let sendData = {
                "name": name,
                'var': Var,
                'user_key': this.SsdunConfig.userKey,
                "timestamp": timestamp,
                "sign": sign
            };

            result = this.httpPost(Namespace, path, sendData);
            if (result.code !== -1) break;


            sleep(delay * 1000);
        } while (retry_count < max_retries)
        return result;


    }
    SSDUNSDK.prototype.remoteVarDelete = function (appSecret) {
        let Namespace = "Delete_Remote_Var";//报错标识
        let path = '/V4/remote/delete_var';
        let timestamp;
        let max_retries = this.SsdunConfig.retry_count;
        let retry_count = 0, result;

        do {
            let delay = this.retryFib(retry_count);
            retry_count++;
            if (this.SsdunConfig.crackDifficulty === 3) {
                timestamp = this.GetLocalTimestamp();
            } else {
                timestamp = this.GetNetworkTimestamp();
            }

            /**
             * @sign排序
             * user_key
             * appSecret
             * timestamp
             **/
                //转换成字符串
            let params = "user_key=" + this.SsdunConfig.userKey + "&app_secret=" + appSecret + "&timestamp=" + timestamp;
            let sign = this.sign(path, params, appSecret);

            let sendData = {
                "app_secret": appSecret,
                'user_key': this.SsdunConfig.userKey,
                "timestamp": timestamp,
                "sign": sign
            };

            result = this.httpPost(Namespace, path, sendData);
            if (result.code !== -1) break;


            sleep(delay * 1000);
        } while (retry_count < max_retries)
        return result;


    }
    SSDUNSDK.prototype.remoteVarGet = function (appSecret) {
        let Namespace = "Get_Remote_Var";//报错标识
        let path = '/V4/remote/get_var';
        let timestamp;
        let max_retries = this.SsdunConfig.retry_count;
        let retry_count = 0, result;

        do {
            let delay = this.retryFib(retry_count);
            retry_count++;
            if (this.SsdunConfig.crackDifficulty === 3) {
                timestamp = this.GetLocalTimestamp();
            } else {
                timestamp = this.GetNetworkTimestamp();
            }

            /**
             * @sign排序
             * user_key
             * appSecret
             * timestamp
             **/
            //转换成字符串
            appSecret = String(appSecret);
            let params = "user_key=" + this.SsdunConfig.userKey + "&app_secret=" + appSecret + "&timestamp=" + timestamp;
            let sign = this.sign(path, params, appSecret);

            let sendData = {
                "app_secret": appSecret,
                'user_key': this.SsdunConfig.userKey,
                "timestamp": timestamp,
                "sign": sign
            };

            result = this.httpPost(Namespace, path, sendData);
            if (result.code !== -1) break;


            sleep(delay * 1000);
        } while (retry_count < max_retries)
        return result;


    }
    SSDUNSDK.prototype.remoteVarSet = function (appSecret, Var) {
        let Namespace = "Set_Remote_Var";//报错标识
        let path = '/V4/remote/set_var';
        let timestamp;
        let max_retries = this.SsdunConfig.retry_count;
        let retry_count = 0, result;

        do {
            let delay = this.retryFib(retry_count);
            retry_count++;
            if (this.SsdunConfig.crackDifficulty === 3) {
                timestamp = this.GetLocalTimestamp();
            } else {
                timestamp = this.GetNetworkTimestamp();
            }

            /**
             * @sign排序
             * user_key
             * appSecret
             * var
             * timestamp
             **/
            //转换成字符串
            appSecret = String(appSecret);
            Var = String(Var);
            let params = "user_key=" + this.SsdunConfig.userKey + "&app_secret=" + appSecret + "&var=" + Var + "&timestamp=" + timestamp;
            let sign = this.sign(path, params, appSecret);

            let sendData = {
                "app_secret": appSecret,
                'user_key': this.SsdunConfig.userKey,
                "var": Var,
                "timestamp": timestamp,
                "sign": sign
            };

            result = this.httpPost(Namespace, path, sendData);
            if (result.code !== -1) break;


            sleep(delay * 1000);
        } while (retry_count < max_retries)
        return result;


    }
    SSDUNSDK.prototype.remoteFunGet = function (appSecret, funName, parameters) {
        let Namespace = "Get_Remote_Fun";//报错标识
        let path = '/V4/remote/call_fun';
        let timestamp;
        let max_retries = this.SsdunConfig.retry_count;
        let retry_count = 0, result;

        do {
            let delay = this.retryFib(retry_count);
            retry_count++;
            if (this.SsdunConfig.crackDifficulty === 3) {
                timestamp = this.GetLocalTimestamp();
            } else {
                timestamp = this.GetNetworkTimestamp();
            }

            /**
             * @sign排序
             * user_key
             * appSecret
             * fun_name
             * timestamp
             **/
            //转换成字符串
            appSecret = String(appSecret);
            funName = String(funName);
            let params = "user_key=" + this.SsdunConfig.userKey + "&app_secret=" + appSecret + "&funName=" + funName + "&parameters=" + parameters + "&timestamp=" + timestamp;
            let sign = this.sign(path, params, appSecret);
            let sendData = {
                "app_secret": appSecret,
                "funName": funName,
                "parameters": parameters,
                'user_key': this.SsdunConfig.userKey,
                "timestamp": timestamp,
                "sign": sign
            };
            result = this.httpPost(Namespace, path, sendData);
            if (result.code !== -1) break;


            sleep(delay * 1000);
        } while (retry_count < max_retries)
        return result;


    }


    SSDUNSDK.prototype.getVersion = function () {
        return this.version;
    }
//获取设备唯一设备ID
    SSDUNSDK.prototype.getDeviceID = function () {
        let id = device.getIMEI();

        if (!id || id === 'unknown') {
            id = device.getSerial();
        }
        if (!id || id === 'unknown') {
            id = device.getAndroidId();
        }
        if (!id || id === 'unknown') {
            id = device.tcDeviceId();
        }

        return String(id);
    }
    SSDUNSDK.prototype.serverTimeCheck = function (serverTime) {
        let nowTime;

        if (this.SsdunConfig.crackDifficulty === 3) {
            nowTime = this.GetLocalTimestamp();
        } else {
            nowTime = this.GetNetworkTimestamp();
        }

        if (SSDUNSDK.debug) {
            logd(" 本地时间戳：" + nowTime + " 服务器时间戳：" + serverTime + " 效验：" + (nowTime - serverTime));
        }

        if ((nowTime - serverTime) > 10 || (nowTime - serverTime) < -10) {
            loge("效验过期停止使用");
            this.结束脚本();
        }
    }

    SSDUNSDK.prototype.GetLocalTimestamp = function (millisecond) {
        try {
            if (millisecond) {
                return new Date().getTime();
            }
            return Math.floor(new Date().getTime() / 1000) - 3;

        } catch (error) {
            try {

                let res = http.httpGet("http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp");
                let data = JSON.parse(res);
                return Math.floor(data["data"]["t"] / 1000) - 3;
            } catch (error) {
                try {
                    let res = http.httpGet("https://tptm.hd.mi.com/gettimestamp");
                    let data = JSON.parse(res);
                    return parseInt(data.replace('var servertime=', '')) - 3;
                } catch (error) {
                    return Math.floor(new Date().getTime() / 1000) - 3;
                }
            }
        }
    }

    SSDUNSDK.prototype.GetNetworkTimestamp = function (millisecond) {

        try {
            //http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp
            let res = http.httpGet(this.HTTP + this.HOST);
            let data = JSON.parse(res);
            if (millisecond) {
                return (parseInt(data["data"]["server_time"]) - 3) * 1000;
            }
            return parseInt(data["data"]["server_time"]) - 3;

        } catch (error) {
            try {
                let res = http.httpGet("https://tptm.hd.mi.com/gettimestamp");
                let data = JSON.parse(res);
                if (millisecond) {
                    return (parseInt(data.replace('var servertime=', '')) - 3) * 1000;
                }
                return parseInt(data.replace('var servertime=', '')) - 3;


            } catch (error) {
                if (millisecond) {
                    return Math.floor(new Date().getTime()) - 3;
                }
                return Math.floor(new Date().getTime() / 1000) - 3;
            }
        }
    }


    //RSA解密 私钥解密
    SSDUNSDK.prototype.RSA_decrypt = function (decryptString, rsaPrivateKey) {


        return this.RSAUtils.PrivateDecrypt(decryptString, rsaPrivateKey);
    }
    //RSA解密 公钥解密
    SSDUNSDK.prototype.RSA_PublicDecrypt = function (decryptString, PublicKey) {

        try {
            return this.RSAUtils.PublicDecrypt(decryptString, PublicKey);
        } catch (e) {
            throw this.Exception("RSA_PublicDecrypt", "选择的加密模式与平台不符合 报错信息：" + e + "\n输出数据:" + decryptString)
        }

    }

    //AES解密
    SSDUNSDK.prototype.AES_decrypt = function (decryptString, aesPrivateKey) {
        try {
            return this.AESUtils.decrypt(decryptString, aesPrivateKey);
        } catch (e) {
            throw this.Exception("AES_decrypt", "选择的加密模式与平台不符合 报错信息：" + e + "\n输出数据:" + decryptString)
        }

    }
    //AES加密
    SSDUNSDK.prototype.AES_encrypt = function (encryptString, aesPrivateKey) {

        return this.AESUtils.encrypt(encryptString, aesPrivateKey);
    }


    /**
     *
     * @param Namespace 调用函数名
     * @param Message 消息日志
     * @param level     消息等级 默认 0 0 debug 1 info 2 waning  3 error
     * @returns {string}
     * @constructor
     */
    SSDUNSDK.prototype.ExceptionLog = function (Namespace, Message, level) {
        this.exceptionInfo = Message;
        level = level | parseInt(level) | 0
        switch (level) {
            case 1:
                logi("[SsdunSDK]【调用函数】" + Namespace + "【输出信息】" + Message);
                break;
            case 2:
                logw("[SsdunSDK]【调用函数】" + Namespace + "【输出信息】" + Message)
                break;
            case 3:


                loge("[SsdunSDK]【调用函数】" + Namespace + "【输出信息】" + Message);
                break;
            default:
                logd("[SsdunSDK]【调用函数】" + Namespace + "【输出信息】" + Message)

        }


        return "[SsdunSDK]【调用函数】" + Namespace + "【输出信息】" + Message
    }
    SSDUNSDK.prototype.Exception = function (Namespace, Message) {
        return "[SsdunSDK]【调用函数】" + Namespace + "【输出信息】" + Message
    }

    //发送加密相关
    SSDUNSDK.prototype.sign = function (path, params, appSecret) {
        this.Ping();
        let http_method = this.http_method, host = this.HOST;
        appSecret = appSecret || "";
        return UtilsWrapper.prototype.dataMd5(http_method + host + path + params + appSecret);
    }
    SSDUNSDK.prototype.BCC = function (str) {
        let a;
        for (let i = 0; i < str.length; i++) {
            a ^= str.charCodeAt(i);
        }
        return a.toString(16);
    }
    SSDUNSDK.prototype.generateKey = function () {
        //加密固定标识
        let key = "ssdun";
        //获取现在时间戳
        let timestamp
        if (this.SsdunConfig.crackDifficulty === 3) {
            timestamp = this.GetLocalTimestamp(true);
        } else {
            timestamp = this.GetNetworkTimestamp(true);
        }
        //格式化时间截至分钟
        let Date = this.formatDate(timestamp, true);
        //格式化时间到时间戳
        let minuteTimestamp = this.datetime_to_unix(Date);
        //取时间戳前九位;
        minuteTimestamp = String(minuteTimestamp).substring(0, 9);
        key += minuteTimestamp;
        //BCC效验
        let xor = this.BCC(key);
        key += xor.toUpperCase();
        //超出十六位 按十六位计算
        key = key.substr(0, 16);
        return key;
    }
    SSDUNSDK.prototype.formatDate = function (timestamp, minute) {
        let date = new Date(timestamp);
        let YY = date.getFullYear() + '-';
        let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        let hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        let ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        if (minute) {
            return YY + MM + DD + " " + hh + mm + ":00";
        }
        return YY + MM + DD + " " + hh + mm + ss;
    }
    SSDUNSDK.prototype.datetime_to_unix = function (datetime) {
        let tmp_datetime = datetime.replace(/:/g, '-');
        tmp_datetime = tmp_datetime.replace(/ /g, '-');
        let arr = tmp_datetime.split("-");
        let now = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
        return Math.floor(now.getTime() / 1000);
    }


    SSDUNSDK.prototype.httpPost = function (Namespace, path, data, options) {
        if (!path) return false;

        let x = null;
        let url = this.HTTP + this.HOST + path, postData;

        if (this.SsdunConfig.crackDifficulty > 1) {
            let key = this.generateKey();
            let encryptData = this.AES_encrypt(JSON.stringify(data), key);
            postData = {"data": String(encryptData)};

        } else {
            postData = data;
        }


        try {
            x = http.httpPost(url, postData, null, 10 * 1000, options ? options : {"User-Agent": "EasyClick(" + this.SsdunConfig.userKey + ")"});
        } catch (e) {
            if (this.debug) {
                this.ExceptionLog(Namespace, "request error:" + e + "正在重试", 2);
            }
            this.ExceptionLog(Namespace, "http连接失败 请检测网络是否正常 请求数据：\nurl:" + url + "\nparams:" + postData + "\nresult:" + x, 3);
        }
        if (!x) {
            this.ExceptionLog(Namespace, "http连接失败 请检测网络是否正常 请求数据：\nurl:" + url + "\nparams:" + postData + "\nresult:" + x, 3);

        } else {
            try {
                x = JSON.parse(x);
                return x;
            } catch (e) {
                this.ExceptionLog.Exception(Namespace, "请求解析json异常：" + e.message + "   \n请求数据：\nurl:" + url + "\nparams:" + postData + "\nresult:" + x);
            }
        }


        return {"code": -1, "data": {"status_code": -1, "error_msg": "连接服务器失败"}}

    }
    SSDUNSDK.prototype.retryFib = function (num) {
        if (num > 9) {
            return 34
        }
        let a = 0;
        let b = 1;
        for (let i = 0; i < num; i++) {
            let tmp = a + b;
            a = b;
            b = tmp;
        }
        return a
    }
    SSDUNSDK.prototype.updateHost = function () {
        try {
            let x = http.httpGet("https://ssdun-1253730168.cos.ap-beijing.myqcloud.com/hosts.json", {}, 10 * 1000)
            try {
                let hosts = JSON.parse(x);
                if (hosts.length > 0) this.HOSTS = hosts;
                else this.ExceptionLog("updateHost", "无HOST资源,更新错误", 3)
            } catch (e) {
                this.ExceptionLog("updateHost", "解析HOST失败,更新错误", 3)
            }
        } catch (e) {
            try {
                let x = http.httpGet("https://ssdun1-1253730168.cos.eu-frankfurt.myqcloud.com/hosts.json", {}, 10 * 1000)
                try {
                    let hosts = JSON.parse(x);
                    if (hosts.length > 0) this.HOSTS = hosts;
                    else this.ExceptionLog("updateHost", "无HOST资源,更新错误", 3)
                } catch (e) {
                    this.ExceptionLog("updateHost", "解析HOST失败,更新错误", 3)
                }
            } catch (e) {
                this.ExceptionLog("updateHost", "HTTP访问失败,更新错误", 3)

            }
        }

        return true;

    }
    SSDUNSDK.prototype.setBackupHosts = function (hosts) { // 设置备用 api host
        this.HOSTS.concat(hosts);
        this.HOST = hosts;

    }
    SSDUNSDK.prototype.switchHost = function () { // 切换备用 api host
        this.switchCount++;
        this.HOST = this.HOSTS[this.switchCount % this.HOSTS.length];
    }
    SSDUNSDK.prototype.Ping = function () {
        if (this.IsPing) return;
        try {
            let x = http.httpGet(this.HTTP + this.HOST, {}, 10 * 1000);
            if (JSON.parse(x).code === 0) {
                this.IsPing = true;
            }
        } catch (e) {
            this.switchHost()
        }
    }
    //保留最后一次异常消息
    SSDUNSDK.prototype.getExceptionInfo = function () {
        return this.exceptionInfo;


    }

    return SSDUNSDK
})()

let Ssdun = new SSDUNSDK("e4c67bd053bd9a9171a5fae33a5ccd7869be1d13dd81dbde4c4d8a173db975ac", 3968, 0, "");
Ssdun.debug = false;
Ssdun.SsdunConfig.verifyHeartbeatFirst = true;//是否开启 有上次心跳先退出在 验证

function main() {
    // ui.layout("", "http://192.168.2.10:8082");
    //获取卡密 key
    ui.registeH5Function("getCardKey", function () {
        logd("h5 getCardKey");
        //返回给网页的数据
        return Ssdun.SsdunConfig.cardKey;
    })

    ui.registeH5Function("machine_code", function () {
        return Ssdun.读取机器码(true);
    })
    //一键认证
    ui.registeH5Function("yijianrenzheng", function (card) {
        // logd("card:"+card+"|" +code)
        return JSON.stringify(Ssdun.卡密验证(card, Ssdun.读取机器码(true), 3968, true));
    })
    //查询时间
    ui.registeH5Function("chaxunshijian", function () {
        var data = Ssdun.获取卡密信息();
        if (data) {
            return JSON.stringify(data);
        } else {
            return false;
        }
    })

    //解绑卡密
    ui.registeH5Function("unset", function () {
        let result = Ssdun.卡密解绑();
        return JSON.stringify(result)
    })

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