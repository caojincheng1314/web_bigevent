$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    // 获取文章列表信息
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    var indexAdd = null;
    $('#btnAdd').on('click', function() {
            indexAdd = layer.open({
                type: 1,
                area: ['500px', '248px'],
                title: '添加文章分类',
                content: $('#dialog-add').html()
            });
        })
        // 通过代理的形式为form-add表单绑定事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList();
                layer.msg('新增分类成功！');
                layer.close(indexAdd);
            }
        })
    })
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
            // 弹出修改文章分类的额弹出层
            indexEdit = layer.open({
                type: 1,
                area: ['500px', '248px'],
                title: '修改文章分类',
                content: $('#dialog-edit').html()
            });
            var id = $(this).attr('data-id');
            // console.log(id);
            // 发起请求获取对应的数据
            $.ajax({
                method: 'get',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    form.val('form-edit', res.data)
                }
            })
        })
        // 通过代理的形式为修改分类的表单绑定事件
    $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'post',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类数据失败！');
                    }
                    layer.msg('更新分类数据成功！');
                    layer.close(indexEdit);
                    initArtCateList();
                }
            })
        })
        // 通过代理的形式为删除按钮绑定事件
    $('tbody').on('click', '.btn-del', function() {
        var id = $(this).attr('data-id');
        // 提示用户是否删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!');
                    }
                    layer.msg('删除文章成功!');
                    layer.close(index);
                    initArtCateList();
                }
            })
        });
    })
})