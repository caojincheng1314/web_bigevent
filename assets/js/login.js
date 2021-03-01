$(function() {
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').on('click', function() {
            $('.reg-box').hide();
            $('.login-box').show();
        })
        // 自定义校验规则
    var form = layui.form; // 从layui中获取form对象
    var layer = layui.layer;
    form.verify({
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            repwd: function(value) {
                var pwd = $('.reg-box [name=password]').val();
                if (pwd !== value) {
                    return '两次密码不一致！'
                }
            }
        })
        // 监听注册表单提交事件
    $('#form-reg').on('submit', function(e) {
            e.preventDefault();
            var data = {
                username: $('#form-reg[name=username]').val(),
                password: $('#form-reg [name=password]').val()
            }
            $.post('http://ajax.frontend.itheima.net/api/reguser', data,
                function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('注册成功,请登录！');
                    // 注册成功后模拟人的点击行为
                    $('#link_login').click();
                })
        })
        // 监听登录表单的提交事件
    $('#form-login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'post',
            data: $(this).serialize(), // 快速获取表单中的数据
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败！');
                }
                layer.msg('登录成功！');
                // console.log(res.token);
                // 将登录成功得到的token保存到localStorage中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})