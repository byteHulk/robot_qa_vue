// 兼容IE9及以下的 classlist,DOMTokenList[待补] 不存在问题
if (!("classList" in document.documentElement)) {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
        get: function() {
            var self = this;

            function update(fn) {
                return function(value) {
                    var classes = self.className.split(/\s+/g),
                        index = classes.indexOf(value);

                    fn(classes, index, value);
                    self.className = classes.join(" ");
                }
            }

            return {
                add: update(function(classes, index, value) {
                    if (!~index) classes.push(value);
                }),

                remove: update(function(classes, index) {
                    if (~index) classes.splice(index, 1);
                }),

                toggle: update(function(classes, index, value) {
                    if (~index)
                        classes.splice(index, 1);
                    else
                        classes.push(value);
                }),

                contains: function(value) {
                    return !!~self.className.split(/\s+/g).indexOf(value);
                },

                item: function(i) {
                    return self.className.split(/\s+/g)[i] || null;
                }
            };
        }
    });
}

if (!("DOMTokenList" in window)) {

    window.DOMTokenList = function(ids) {
        'use strict';
        var idsArray = [],
            self = this,
            parse = function(id, functionName, cb) {
                var search = id.toString();
                if (search.split(' ').length > 1) {
                    throw new Error("Failed to execute '" + functionName + "' on 'TokenList': The token provided ('" + search + "') contains HTML space characters, which are not valid in tokens.');");
                } else {
                    cb(search);
                }
            };

        function triggerAttributeChange() {
            if (self.tokenChanged && typeof self.tokenChanged === 'function') {
                self.tokenChanged(idsArray.toString());
            }
        }

        if (ids && typeof ids === 'string') {
            idsArray = ids.split(' ');
        }
        self.item = function(index) {
            return idsArray[index];
        };

        self.contains = function(id) {
            parse(id, 'contains', function(search) {
                return idsArray.indexOf(search) !== -1;
            });
        };

        self.add = function(id) {
            parse(id, 'add', function(search) {
                if (idsArray.indexOf(search) === -1) {
                    idsArray.push(search);
                }
                triggerAttributeChange();
            });
        };

        self.remove = function(id) {
            parse(id, 'remove', function(search) {
                idsArray = idsArray.filter(function(item) {
                    return item !== id;
                });
                triggerAttributeChange();
            });
        };

        self.toggle = function(id) {
            parse(id, 'toggle', function(search) {
                if (!self.contains(search)) {
                    self.add(search);
                } else {
                    self.remove(search);
                }
            });
        };

        self.tokenChanged = null;

        self.toString = function() {
            var tokens = '',
                i;
            if (idsArray.length > 0) {
                for (i = 0; i < idsArray.length; i = i + 1) {
                    tokens = tokens + idsArray[i] + ' ';
                }
                tokens = tokens.slice(0, tokens.length - 1);
            }
            return tokens;
        };
    };

}




var util = {
    checkBrowser: function() {
        var _userAgent = navigator.userAgent;

        // Opera 8.0+
        var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== 'undefined';

        // Safari 3.0+ "[object HTMLElementConstructor]"
        var isSafari = /constructor/i.test(window.HTMLElement) || (function(p) {
            return p.toString() === '[object SafariRemoteNotification]';
        }(!window.safari || safari.pushNotification));

        // Internet Explorer 6-11
        var getIeVersion = (function() {

            var userAgent = navigator.userAgent.toLowerCase(),
                uaMatch;
            if (userAgent.match(/msie ([\d.]+)/) != null) {
                //ie6--ie9
                uaMatch = userAgent.match(/msie ([\d.]+)/);
                return /9\.0|10\.0/gi.test(uaMatch);
            } else if (userAgent.match(/(trident)\/([\w.]+)/)) {
                uaMatch = userAgent.match(/trident\/([\w.]+)/);
                return /6\.0|7\.0/gi.test(uaMatch);
                // switch (uaMatch[1]) {
                //     case "4.0":
                //         return "IE8";
                //         break;
                //     case "5.0":
                //         return "IE9";
                //         break;
                //     case "6.0":
                //         return "IE10";
                //         break;
                //     case "7.0":
                //         return "IE11";
                //         break;
                //     default:
                //         return "undefined";
                // }
            }

        })();


        var isIE = /* @cc_on!@*/ false || !!document.documentMode;
        var isIE11 = getIeVersion;
        // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;

        // Chrome 1+
        var isChrome = !!window.chrome && !!window.chrome.csi && !!window.chrome.loadTimes;

        // Blink engine detection
        var isBlink = (isChrome || isOpera) && !!window.CSS;

        // isSougou
        var isSougou = /metasr/gi.test(window.navigator.userAgent);
        // alert(getIeVersion)
        return isChrome || isFirefox || isSafari || isSougou || isEdge || isOpera || isIE11;
    },
    isMSESupported: (function() {
        var mediaSource = typeof window !== 'undefined' ? window.MediaSource || window.WebKitMediaSource : null;
        var sourceBuffer = window.SourceBuffer || window.WebKitSourceBuffer;
        var isTypeSupported = mediaSource && typeof mediaSource.isTypeSupported === 'function' && mediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
        var sourceBufferValidAPI = !sourceBuffer ||
            (sourceBuffer.prototype &&
                typeof sourceBuffer.prototype.appendBuffer === 'function' &&
                typeof sourceBuffer.prototype.remove === 'function');
        return !!isTypeSupported && !!sourceBufferValidAPI;
    })(),
    supportsNativeHls: (function(){//移动设备对m3u8原生解析是否支持
        var a = document.createElement("video");
        var b = ["application/vnd.apple.mpegurl", "audio/mpegurl", "audio/x-mpegurl", "application/x-mpegurl", "video/x-mpegurl", "video/mpegurl", "application/mpegurl"];
        return b.some(function(b) {
            return /maybe|probably/i.test(a.canPlayType(b))
        });
    })(),
    isApp: (function(){
        var sUserAgent = navigator.userAgent.toLowerCase();
        return sUserAgent.match(/flutterapp/i) ? true : false;
    })(),
    isMobile: (function() {
        var sUserAgent = navigator.userAgent.toLowerCase(),
            bIsIpad = sUserAgent.match(/ipad/i) ? true : false,
            bIsIphoneOs = sUserAgent.match(/iphone os/i) ? true : false,
            bIsMidp = sUserAgent.match(/midp/i) ? true : false,
            bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) ? true : false,
            bIsUc = sUserAgent.match(/ucweb/i) ? true : false,
            bIsAndroid = sUserAgent.match(/android/i) ? true : false,
            bIsCE = sUserAgent.match(/windows ce/i) ? true : false,
            bIsWM = sUserAgent.match(/windows mobile/i) ? true : false,
            bIsWebview = sUserAgent.match(/webview/i) ? true : false,
            bIsFlutterApp = sUserAgent.match(/flutterapp/i) ? true : false;
        return (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM || bIsWebview || bIsFlutterApp);
    })(),
    isWeiXin: (function(){
        var ua = window.navigator.userAgent.toLowerCase();
        //通过正则表达式匹配ua中是否含有MicroMessenger字符串
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
            return false;
        }
    })(),
    checkBrowserResult: function() {
        document.write('<div class="alert" style="width:50%; text-align: center; top: 32%; position: absolute; left: 25%; padding: 40px;">为了更好地系统体验，建议您使用最新 谷歌/火狐/Safari/Edge/Opera 浏览器。</div>');
    },
    vueConfig: function(vue) {

        if (process.env.NODE_ENV == 'production') {
            // console.log('----',process.env.NODE_ENV,'----');
            vue.config.silent = true;
            vue.config.devtools = false;
            vue.config.productionTip = false;
        }
    },
    imgFormat: function (dataStr) {
		if(dataStr && typeof dataStr == 'string'){
			if(dataStr.indexOf('http://')>-1){
				if(dataStr.indexOf('http://storage.xuetangx.com')>-1){
					dataStr = dataStr.replace("http://storage.xuetangx.com", "https://storagecdn.xuetangx.com");
				}else if(dataStr.indexOf('http://www.xuetangx.com')>-1){
					dataStr = dataStr.replace("http://www.xuetangx.com", "https://www.xuetangx.com");
				}else if(dataStr.indexOf('http://qn-next.xuetangx.com')>-1){
					dataStr = dataStr.replace("http://qn-next.xuetangx.com", "https://qn-next.xuetangx.com");
				}else if(dataStr.indexOf('http://qn-st0.yuketang.cn')>-1){
					dataStr = dataStr.replace("http://qn-st0.yuketang.cn", "https://qn-st0.yuketang.cn");
                }
                // else{
                //     dataStr = dataStr.replace("http://", "https://");
                // }
			}
			if(dataStr.indexOf('qn-next.xuetangx.com')>-1 || dataStr.indexOf('qn-st0.yuketang.cn')>-1){
				dataStr = dataStr.indexOf("?") != -1 ? dataStr + "&imageslim" : dataStr + "?imageslim";
			}
		}
		return dataStr
	},
    parseQueryUrl: function(url){
        var url = url || window.location.href;
        //对非hash路由：为了防止误会：url所带参数中不要有：# , 因为location.hash是以#开始的。而且url中参数（？）和 hash（#）是有顺序的：先是 ？，后是 #
        //对hash路由，# 后面 ？有效
        //有三种情况：
        // 1. http://localhost:3003/manager?ctype=ykt#/teachercourselist?xxx=one
        // 2. http://localhost:3003/manager#/teachercourselist?xxx=one
        // 3. http://localhost:3003/manager?ctype=ykt#/teachercourselist
        var reg_url =/^[^\?]+\?([\w\W]+)$/,
            arr_url = reg_url.exec(url),
            reg_para=/([^&=]+)=([\w\W]*?)(&|$)/g, //g is very important
            ret = {};
        if(arr_url && arr_url[1]){
            if(url.indexOf("#") != -1){
                if(arr_url[1].indexOf("#") != -1){
                    ret['hash'] = arr_url[1].substr(arr_url[1].indexOf("#")+1);
                    arr_url[1] = arr_url[1].substring(0, arr_url[1].indexOf("#"));
                }else{
                    ret['hash'] = url.substr(url.indexOf("#")+1).split("?")[0];
                }
                var hashQuery = reg_url.exec(ret['hash']);
                if(hashQuery && hashQuery[1]){
                    var _str_para = hashQuery[1], _result;
                    ret['hash'] = ret['hash'].split("?")[0];
                    while((_result = reg_para.exec(_str_para)) != null){
                        ret[_result[1]] = _result[2];
                    }
                }
            }
            var str_para = arr_url[1],result;
            while((result = reg_para.exec(str_para)) != null){
                ret[result[1]] = result[2];
            }
        }
        return ret;
    },
    CountCharacters: function(Words) {//统计字数
        var _words = Words.replace(/(\s$)/g, "");//不将右空格计算到里面
        _words = _words.replace(/^(\s*)\r\n/g, "");//去除空行

        var sTotal = 0;//双字节的字符
        var iTotal = 0;//汉字
        var eTotal = 0;//非双字节的字符
        var iChar = 0;//字母
        var inum = 0;//数字
        
        for (i = 0; i < _words.length; i++) {
            var c = _words.charAt(i);
            if (c.match(/[\u4e00-\u9fa5]/)) {//中文
                iTotal++;//汉字
            }
            if (c.match(/[^\x00-\xff]/)) {//双字节的字符
                sTotal++;
            } else {
                eTotal++;//非双字节的字符
            }
            if(c.match(/[a-zA-Z]/)){
                iChar++;//字母
            }
            if (c.match(/[0-9]/)) {
                inum++;//数字
            }
        }
        // Math.ceil(iTotal + (sTotal - iTotal) + (eTotal - iChar - inum)*0.5 + iChar + inum);
        return Math.ceil(sTotal + eTotal*0.5);
    },
    secondSum: function(time="00:00:00"){
        time = time.split(":");
        return +time[0] * 60 * 60 + +time[1] * 60 + +time[2]
    }
};

// var _location = window.location;
// if(util.isMobile) {
//     if (/^\/$/gi.test(_location.pathname) && /^#\/(home)?$/gi.test(_location.hash)) {
//         window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.xuetangx.mobile.xuetangxcloud";
//     }
// }

export default util;
