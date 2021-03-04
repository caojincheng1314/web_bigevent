$.ajaxPrefilter(function(options) {
    // 再发起ajax请求前用以拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // console.log(options.url);
    // 统一为有权限的接口设置header请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    }
})