/*
 * @Author: ace-海涛
 * @Date:   2018-01-04 14:02:19
 * @Last Modified by:   ace-海涛
 * @Last Modified time: 2018-01-07 12:05:48
   因为是依赖于jQuery，所以必须在jq之后引用
 * ace：这是一个简单的工具类对象，里面包括一些常用的工具函数
 * 比如：加载loading显示，alert弹出框，confirm弹出框，获取地址栏参数，
 * 对jq的ajax二次封装，本地数据的读取封装
 */
 

(function(window, $) {

    var ace = {
        baseApi: '',
		/*
            message     string      要显示的loading文字提示
            time        number      多少时间后自动消失
        */
        showLoading: function(message,time) {
			
            var loadingStr = '<div id="ace-loading" style="position:fixed;left: 0;top: 0;width: 100%;height: 100%;background:rgba(0,0,0,0.8);text-align: center; padding-top:150px; box-sizing: border-box; z-index:888;"><img src="images/loading.gif" width="55" alt="" /><p style="color:#fff;font-size: 18px; margin-top:5px;">加载中...</p></div>';
            if ($('#ace-loading').length) {
                $('#ace-loading').show();
				if(message){
					$('#ace-loading p').text(message);
				}
            } else {
				loadingStr = message ? loadingStr.replace('加载中...',message) : loadingStr;
                $('body').append($(loadingStr));
            }
			
			time && setTimeOut(function(){ $('#ace-loading').hide(); },time);
        },
        hideLoading: function() {
            if ($('#ace-loading').length) {
                $('#ace-loading').hide();
            }
        },
        /*
            message     string      要显示的信息
            callback    function    点击确认按钮后执行的回调方法。
        */
        showMessage: function(message, callback) {
            var messageString = '<div id="ace-message" style="position:fixed;left: 0;top: 0;width: 100%;height: 100%;background:rgba(0,0,0,0.8); z-index:888;"><div class="ace-message-wrap" style="position:absolute;left: 50%;top: 50%; transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);max-width: 400px;width:250px;height: 120px; border-radius:8px;background:#fff; padding:15px; box-sizing: border-box; overflow-y:scroll;"><div class="ace-message-content">' + message + '</div><div class="ace-message-btns" style="padding: 30px 0 10px; text-align: center;"><button class="ace-message-btn" style="display:inline-block;width:90px;height:40px; font-size:18px;border-radius:15px;background:#27ae60;color:#fff;text-align:center;line-height:40px; cursor:pointer;">确定</button></div></div></div>';

            if ($('#ace-message').length) {
                $('#ace-message').show();
                $('#ace-message .ace-message-content').html(message);
            } else {
                $('body').append($(messageString));
            }

            $('body').on('click', '#ace-message .ace-message-btn', function(ev) {
                ev.stopPropagation();
                $('body').off('click', '#ace-message .ace-message-btn');
                $('#ace-message').hide();
                callback && callback(ev);
            });

        },
        /*
        message     string      要显示的信息
        confirmFun  function    点击确认按钮后执行的回调方法。
        cancelFun   function    点击取消按钮后执行的回调方法。
        */
        showConfirmBox: function(message, confirmFun, cancelFun) {
            var messageString = '<div id="ace-confirm" style="position:fixed;left: 0;top: 0;width: 100%;height: 100%;background:rgba(0,0,0,0.8); z-index:888;"><div class="ace-confirm-wrap" style="position:absolute;left: 50%;top: 50%; transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);max-width: 400px;width:250px;height: 120px; border-radius:8px;background:#fff; padding:15px; box-sizing: border-box; overflow-y:scroll;"><div class="ace-confirm-wrap">' + message + '</div><div class="ace-confirm-btns" style="padding: 30px 0 10px; text-align: center;"><button class="ace-confirm-cancel" style="display:inline-block;width:90px;height:40px; font-size:18px;border-radius:15px;background:#ddd;color:#fff;text-align:center;line-height:40px; cursor:pointer;">取消</button><button class="ace-confirm-ok" style="display:inline-block;margin-left:10px;width:90px;height:40px; font-size:18px;border-radius:15px;background:#27ae60;color:#fff;text-align:center;line-height:40px; cursor:pointer;">确定</button></div></div></div>';

            if ($('#ace-confirm').length) {
                $('#ace-confirm').show();
                $('#ace-confirm .ace-confirm-content').html(message);
            } else {
                $('body').append($(messageString));
            }
            //点击确定
            $('body').on('click', '#ace-confirm .ace-confirm-ok', function(ev) {
                ev.stopPropagation();
                $('body').off('click', '#ace-confirm .ace-confirm-ok');
                $('#ace-confirm').hide();
                confirmFun && confirmFun(ev);
            });
            //点击取消
            $('body').on('click', '#ace-confirm .ace-confirm-cancel', function(ev) {
                ev.stopPropagation();
                $('body').off('click', '#ace-confirm .ace-confirm-cancel');
                $('#ace-confirm').hide();
                cancelFun && cancelFun(ev);
            });
        },
        /*
         * 对jq的ajax方法进行二次封装
         *  opts 对象
		 *  增加这几个参数
         *  isShowLoading    Boolean    是否显示加载loading,默认是true
         *  loadingText      String     loading文字说明,当isShowLoading为true时才生效
         *  isToken          Boolean    请求体是否要带上token，做服务端验证,默认是false
         *  isFileUpload     Boolean    是否文件上传,采用formData方式上传,默认是false
         */
        $http: function(opts, callback) {
            var that = this;
            var options = {};
            var isShowLoading = opts.isShowLoading || true;
            var isToken = opts.isToken || false;
            var isFileUpload = opts.isFileUpload || false;
            if (opts.loadingText && isShowLoading) {
                $('#ace-loading p').text(opts.loadingText);
            }
            options.type = opts.type || 'GET';
            options.url = this.baseApi + opts.url;
            options.dataType = opts.dataType || 'json';
            options.data = opts.data || {};
            var token = '';
            if (isToken) {
                token = this.storage('token');
                if (!token) {
                    this.showMessage('请先登录，再操作',function () {
                        window.location.href = 'login.html';
                    });
                    return;
                }
                //加上token验证
                options.headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization':'Bearer '+token
                };

            }
            //文件上传
            if(isFileUpload){
                //因为data值是FormData对象，不需要对数据做处理
                options.processData = false;
                options.contentType = false;
                //上传文件不需要缓存。
                options.cache = false;
            }
            options.beforeSend = function () {
                isShowLoading && that.showLoading();
            }
            options.success = function (data) {
                isShowLoading && that.hideLoading();
                if(data.success){
                    callback && callback(data);
                }else{
                    if(data.errorMessage){
                        that.showMessage(data.errorMessage);
                    }else{
                        callback && callback(data);
                    }
                }
            };
            options.error = function (err) {
                isShowLoading && that.hideLoading();
                that.showMessage(err.responseJSON.errorMessage+','+err.status,function () {
                    window.location.href = 'login.html';
                });
            }
            $.ajax(options);


        },
        storage: function(key, val) {
            if (val) {
                //存储
                if (typeof val == 'object') {
                    val = JSON.stringify(val);
                }
                window.localStorage.setItem(key, val);
            } else if (val == '') {
                //清空
                window.localStorage.removeItem(key);
            } else {
                //获取值
                var value = window.localStorage.getItem(key);
                try {
                    value = JSON.parse(value);
                    return value;
                } catch (err) {
                    return value;
                }
            }
        },
		queryString : function (name){
			if(!name) return '';
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r!=null)return  unescape(r[2]); return null;
		}
    };

    window.ace = ace;

})(window, jQuery);