$(function(){
    var menuData,parentMenuData;
    var $table = $('.show-menu-table');
    if(!$table[0])return false;
    var $window = $('.permission-menu-window');
    var $dataForm = $window.find('form');
    function doSearch(){
        $.get('/permission/menu/data' , function(a){
            menuData = a.data;
            parentMenuData  = menuData && menuData.filter(function(a){
                return !a.parentCode
            });
            setPage();
            setParentList();
        });
    }
    function setParentList(){
        $('[name=parentCode]').each(function(){
            var $this = $(this).html('<option value="">请选择</option>');
            $.each(parentMenuData , function(i , o){
                $this.append('<option value="'+o.code+'">'+o.name+'</option>');
            });
        });
    }
    var showData;
    var $page;
    function setPage(page){
        page -= 1;
        page = page || 0;
        showData = menuData.slice(page * usePageSize , (page + 1) * usePageSize);
        $table.find('.data-list').remove();
        $.each(showData , function(i , o){
            var $tr = $('<tr>').addClass('data-list');
            $tr.append('<td>'+(i+1)+'</td>');
            $tr.append('<td>'+o.name+'</td>');
            $tr.append('<td>'+o.code+'</td>');
            $tr.append('<td>'+(o.parentCode || '')+'</td>');
            $tr.append('<td>'+useCommon.parseDate(o.updateTime)+'</td>');
            $tr.append('<td><div class="btn-group">' +
                '<a class="btn btn-sm btn-primary update-btn" index="'+i+'">修改</a>' +
                '<a class="btn btn-sm btn-primary delete-btn">删除</a>' +
                '</div></td>');
            $table.append($tr);
        });
        if(!$page){
            $table.after($page = $('<div>').addClass('table-page mt-30'));
        }
        $page.dataTablePage({
            page:page + 1,
            allNumber:menuData.length,
            allPage:Math.ceil(menuData.length / usePageSize),
            done:setPage
        });
    }
    $('.add-menu-btn').click(function(){
        $window.modal();
        $dataForm[0].reset();
        updateData = null;
    });
    var updateData;
    $table.on('click', '.update-btn' , function(){
        $window.modal();
        $dataForm.__formData(updateData = showData[$(this).attr('index')]);
    });
    $table.on('click', '.delete-btn' , function(){
    });
    $window.find('.this-submit-btn').click(function(){
        var data = $dataForm.__serializeJSON();
        if(updateData)data._id = updateData._id;
        $.post('/permission/menu/' + (updateData?'update':'add') , data , function(a){
            if(a.code ==0){
                $window.modal('hide');
                doSearch();
            }else{
                useCommon.toast(a.message);
            }
        });
    });
    doSearch();
});