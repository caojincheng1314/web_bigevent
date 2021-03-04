$(function() {
        getUserInfo();
        // 提示用户是否退出
        var layer = layui.layer;
        $('#btnLogout').on('click', function() {
            layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
                //do something
                // 1.清空本地存储中的token
                localStorage.removeItem('token');
                // 2.重新跳转到等录页面
                location.href = '/login.html';
                // 关闭confirm询问框
                layer.close(index);
            });
        })
    })
    // 获取用户信息的函数
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers: {
        // Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用渲染用户头像的函数
            renderAvatar(res.data);
        },
        // complete: function(res) {
        // if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        // 1.强制清空token
        // localStorage.removeItem('token');
        // 2.强制跳转到登录页面
        // location.href = '/login.html';
        // }
        // }
    })
}
// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username;
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp' + name);
    // 3.渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show;
        $('.text-avatar').hide();
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}