const common = {
    // js正则实现数字格式化,每三位加逗号
    getNumberFormatter(value) {
        if (!value) return '0';
        /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
        var intPart = Number(value) | 0; //获取整数部分
        var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
        var floatPart = ""; // ".0" 预定义小数部分
        var value2Array = value.split(".");

        //=2表示数据有小数位
        if (value2Array.length == 2) {
            floatPart = value2Array[1].toString().substr(0, 2); //拿到小数部分
            if (floatPart == '0' || floatPart == 0) { //补0,实际上用不着
                return intPartFormat // parseFloat(intPartFormat + "." + floatPart) // + '0';
            } else {
                return (intPartFormat + "." + floatPart) //parseFloat(intPartFormat + "." + floatPart);
            }
        } else {
            return intPartFormat // + floatPart;
        }
    },
    /**
     * 时间格式转换
     * @param {*} data
     */
    getWeekDay(dateStr) {
        var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        var myDate = new Date(Date.parse(dateStr.replace(/-/g, "/")));
        return weekDay[myDate.getDay()]
    },
    getTime5(date) {
        let d = new Date(date)
        let str = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds()
        return str
    },
    getTime3(date) {
        let d = new Date(date)
        let str = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
        return str
    },
    getTime4(date) {
        let d = new Date(date)
        let str = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()
        return str
    },
    /**
     * 时间格式转换
     * @param {*} data
     */
    getTime(date) {
        let d = new Date(date)
        let str = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() // + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
        return str
    },
    getTime2(date) {
        let d = new Date(date)
        let str = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日' // + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
        return str
    },
    getTime6(date) {
        let d = new Date(date)
        let str = (d.getMonth() + 1) + '月' + d.getDate() + '日' // + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
        return str
    },
    getEndTime(date) {
        let d = new Date(date)
        let str = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + '23:59:59'
        return str
    },
    getPickerStartTime(date) {
        let str = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + '00:00:00'
        return str
    },
    getPickerEndTime(date) {
        let str = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + '23:59:59'
        return str
    },
    // 保留1位小数
    formatDecimal(value) {
        if (!value) return '0';
        /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
        var intPart = Number(value) | 0; //获取整数部分
        var floatPart = ""; // ".0" 预定义小数部分
        var value2Array = value.split(".");
        if (value2Array.length == 2) {
            floatPart = value2Array[1].toString().substr(0, 2); //拿到小数部分
            if (floatPart == '0' || floatPart == 0) { //补0,实际上用不着
                return intPart // parseFloat(intPartFormat + "." + floatPart) // + '0';
            } else {
                return (intPart + "." + floatPart) //parseFloat(intPartFormat + "." + floatPart);
            }
        } else {
            return intPart
        }
    },
    // 保留两位小数
    toDecimal2(x) {
        var f = parseFloat(x)
        if (isNaN(f)) {
            return false
        }
        var f = Math.round(x * 100) / 100
        var s = f.toString()
        var rs = s.indexOf('.')
        if (rs < 0) {
            return s
        }
        // if (rs < 0) {
        //   rs = s.length
        //   s += '.'
        // }
        // while (s.length <= rs + 2) {
        //     s += '0'
        // }
        return parseFloat(s)
    },
    getNewDate(data) {
        let str = null
        if (typeof(data) !== 'undefined' && data != null) {
            str = /\d{4}-\d{1,2}-\d{1,2}/g.exec(data)
        }
        return str
    },

    compareDateToNow(date) {
        let result = new Date(date.replace(/\-/g, '\/')) < new Date() - 86400000
        return result
    },
    formatTime(date, fmt) { // 格式化时间
        let d = new Date(date)
        var o = {
            'M+': d.getMonth() + 1, // 月份
            'd+': d.getDate(), // 日
            'H+': d.getHours(), // 小时
            'm+': d.getMinutes(), // 分
            's+': d.getSeconds(), // 秒
            'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
            'S': d.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt
    },
    // 加密参数 跳转页面方法
    toJump(event, path, query) {
        for (var key in query) {
            query[key] = encodeURIComponent(query[key])
        }
        event.$router.push({
            path: path,
            query: query
        });
    },
    // 解密参数 获取路由中的参数
    getQuery(event) {
        let query = event.$route.query
        for (var key in query) {
            query[key] = decodeURIComponent(query[key])
        }
        return query
    }
}

export default common