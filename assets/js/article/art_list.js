$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function(date) {
            const dt = new Date(date);
            var y = dt.getFullYear(),
                m = PadZero(dt.getMonth() + 1),
                d = PadZero(dt.getDate()),
                hh = PadZero(dt.getHours()),
                mm = PadZero(dt.getMinutes()),
                ss = PadZero(dt.getSeconds());
            return y + '-' + m + '' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        // 定义补零的函数
    function PadZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查的参数对象，将来请求数据的时候需要将请求参数对象提交给服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的状态，可选值有：已发布、草稿
    }

    initTable();
    initCate();
    // 获取文章列表
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                // layer.msg('获取文章列表成功！');
                // console.log(res);
                // 使用模板引擎渲染页面
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }
    // 初始化文章分类
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                // 通知layui重新渲染表单区域的UI结构,否则页面上看不到任何效果
                form.render();
            }
        })
    }
    // 监听筛选表单的提交事件
    $('#form-search').on('submit', function(e) {
            e.preventDefault();
            // 获取表单中选中项的值
            var cate_id = $('[name=cate_id]').val(),
                state = $('[name=state]').val();
            // 为查询参数对象q中对应的属性赋值
            q.cate_id = cate_id;
            q.state = state;
            // 根据最新的筛选条件重新渲染表格数据
            initTable();
        })
        // 定义分页函数
    function renderPage(total) {
        // console.log(total);
        // 调用laypage.render方法渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的id，注意，这里的pageBox是ID不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示的条数
            curr: q.pagenum, // 默认的起始页
            layout: ['curr', 'limit', 'prev', 'page', 'next', 'skip'],
            // layout自定义排版。可选值有：
            // count（总条目输区域）、prev（上一页区域）、page（分页区域）、
            // next（下一页区域）、limit（条目选项区域）、refresh
            // （页面刷新区域。注意：layui 2.3.0 新增） 、skip（快捷跳页区域）
            limits: [2, 3, 5, 10], // 每页条数的选择项
            // 当分页被切换时触发，函数返回两个参数：
            // obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
            // 触发jump回调的方式有两种：
            // 1.点击页码值的时候会触发
            // 2.只要调用了laypage.render()方法就会触发
            jump: function(obj, first) {
                // 通过first的值可以判断是用哪种方式触发的jump，
                // 如果值为true证明是方式2触发的
                // console.log(obj.curr);               
                q.pagenum = obj.curr; // 把最新的页码值赋值到q中
                q.pagesize = obj.limit; // 把最新的条目数赋值到q中
                // 根据最新的q值获取对应的数据列表并重新渲染表格
                // initTable();
                if (!true) { // 判断是否通过方式2触发jump，避免死循环
                    // （方式2的触发会引起死循环）
                    initTable();
                }
            }
        });
    }
    // 通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click', function() {
        var len = $('.btn-del').length; // 获取页面上删除按钮的个数
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！');
                    }
                    layer.msg('删除成功！');
                    if (len == 1) {
                        // 如果len等于1证明删除完毕后页面上没有任何数据
                        // 页面值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })

            layer.close(index);
        });
    })
})