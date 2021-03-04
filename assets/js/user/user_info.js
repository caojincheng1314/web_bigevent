$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '用户昵称必须在1~6个字符之间'
            }
        }
    })
    initUserInfo();
    // 初始化用户基本信息的函数 
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }
                // console.log(res);
                // 调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }
    // 重置表单数据
    $('#btnReset').on('click', function(e) {
            // 阻止表单的默认重置行为
            e.preventDefault();
            initUserInfo();
        })
        // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(), //快速获取表单数据 
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }
                layer.msg('更新用户信息成功！')
                window.parent.getUserInfo()
            }
        })
    })
})