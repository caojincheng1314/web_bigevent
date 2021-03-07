$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    // 加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎渲染文章分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    // 初始化富文本编辑器
    initEditor();
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);
    $('#btnChooseImg').on('click', function() {
            $('#coverfile').click();
        })
        // 监听coverfile的change事件，获取用户选择的文件
    $('#coverfile').on('change', function(e) {
            // 获取到文件的列表数组
            var file = e.target.files[0];
            console.log(file);
            // 判断用户是否选择了文件
            if (file.length == 0) {
                return
            }
            // 根据文件创建对应的图片url
            var newImgURL = URL.createObjectURL(file);
            // 为裁剪区域重新设置图片
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        // 定义文章的发布状态
    var art_state = '已发布';
    $('.layui-btn-primary').on('click', function() {
            art_state = '存为草稿';
        })
        // 1.为表单绑定submit事件
    $('#form-pub').on('submit', function(e) {
            e.preventDefault();
            // 2.基于form创建formData对象
            var fd = new FormData($(this)[0]); // 将jQuery对象转换为dom对象
            // 3.将发布状态添加到fd中
            fd.append('state', art_state);
            // fd.forEach(function(v, k) {
            // console.log(k, v);
            // })
            // 4.将封面裁剪后的图片输出为一个对象
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    // 5.将文件对象存储到fd中
                    fd.append('cover_img', blob);
                    // 6.发起ajax请求
                    publishArticle(fd);
                })
        })
        // 定义发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器发送的是FormData格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！');
                // 发布成功后跳转到文章列表页面
                location.href = '/article/art_list.html';
            }
        })
    }
})