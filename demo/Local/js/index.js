$(function(){
    // 首页移动端导航效果
    $('.topbar_nav_btn').eq(0).toggle(function(){
        $(this).parent().find(".topbar_nav").eq(0).animate({height: 'toggle', opacity: 'toggle'}, "fast");
        $(this).addClass('active');
        return false;
    },function(){
        $(this).parent().find(".topbar_nav").eq(0).animate({height: 'toggle', opacity: 'toggle'}, "fast");
        $(this).removeClass('active');
        return false;
    });

    // 导航栏-城市
    // 点击文字显示城市列表
    $('.topbar_local_btn').find('.topbar_local_btn_click').click(function(){
        var city = $('.topbar_local_btn_click').html().slice(0, 2);
        var area = $('.topbar_local_btn_click').html().slice(2, 5);
        $(this).parent().find('a:contains("'+ city +'")').addClass('nav_active');
        $(this).parent().find('a:contains("'+ area +'")').addClass('nav_active');
        $(this).parent().find(".topbar_local_list").animate({height: 'toggle', opacity: 'toggle'}, "fast");
        return false;
    });

    // 导航 - 点击箭头显示城市列表
    $('.topbar_local_btn').find('.topbar_local_icon').click(function(){
        $(this).parent().find(".topbar_local_list").animate({height: 'toggle', opacity: 'toggle'}, "fast");
        return false;
    });

    // 导航 - 下拉菜单移出隐藏
    $('.topbar_local_list').hover(function(){
        $(this).show();
    },function(){
        $(this).slideUp(100);
    })

    // 导航 - 点击页面任意一处隐藏下拉菜单
    $(document).on('click', function(){
        $(".topbar_local_list").hide();
    })

    // 导航- 级联菜单隐现
    $('.topbar_local_list>li').hover(function(){
        $(this).find("ul").animate({height: 'toggle', opacity: 'toggle'}, "fast");
        $(this).find('a').eq(0).addClass('nav_active');
    },function(){
        $(this).find("ul").animate({height: 'toggle', opacity: 'toggle'}, "fast");
        $(this).find('a').eq(0).removeClass('nav_active');
    })

    // 导航栏设置 最新动态 和 医学科普 打开新标签
    $('.topbar_nav').find('.topbar_nav_list:eq(2)').attr('target', '_blank');
    $('.topbar_nav').find('.topbar_nav_list:eq(4)').attr('target', '_blank');


    // 预约动画效果
    $('.index_appoint').waypoint(function() {
        $('.index_appoint').addClass("appoint_active");
    }, { offset: '99%' });

    // welcome动画效果
    $('.index_welcome_comtent').waypoint(function() {
        if($(window).width() > 770){
            $('.index_welcome_comtent').addClass("index_welcome_active");
        }
    }, { offset: '99%' });

    // 医疗服务动画效果
    $('.index_serve_content').waypoint(function() {
        if($(window).width() > 770){
            $('.index_serve_content').addClass("index_serve_active");
        }
    }, { offset: '99%' });

    // 地图动画效果
    // 杭州城西店
    $('.index_local_hz_1').hover(function(){
        $(this).find('.index_local_intro_1').animate({height: 'toggle', opacity: 'toggle'}, "fast");
    },function(){
        $(this).find('.index_local_intro_1').animate({height: 'toggle', opacity: 'toggle'}, "fast");
    })
    // 杭州滨江店
    $('.index_local_hz_2').hover(function(){
        $(this).find('.index_local_intro_1').animate({height: 'toggle', opacity: 'toggle'}, "fast");
    },function(){
        $(this).find('.index_local_intro_1').animate({height: 'toggle', opacity: 'toggle'}, "fast");
    })


    //首页图片轮播调用js 
    $('.bxslider').bxSlider({
        captions: true,//自动控制 
        auto: true,
        pause: 6000,
        controls: false,//隐藏左右按钮
    });

    //关于我们图片轮播调用js 
    var about_auto = true;
    if($('.about_bxslider').find('li').length <= 3){
        about_auto = false;
    }
    $('.about_bxslider').bxSlider({
        captions: true,//自动控制 
        auto: about_auto,
        pause: 6000,
        controls: false//隐藏左右按钮
    });

    $('.about_mobile_bxslider').bxSlider({
        controls: false//隐藏左右按钮 
    });

    // 合作单位轮播
    if($(".index_cooperate").find('#listBox').length > 0){
        var auto = false;
        if($('.index_cooperate').find('li').length > 4) {
            auto = true;
        }
        $(".index_cooperate").find('#listBox').imageScroller({
            next: "btnNext",
            prev: "btnPrev",
            frame: "list",
            child: "li",
            auto: auto,
            size: 246 
        });
    } else if($(".about_cooperate").find('ul').length > 0){
        var auto = false;
        if($('.about_cooperate').find('li').length > 4) {
            auto = true;
        }
        $(".about_cooperate").find('#listBox').imageScroller({
            next: "btnNext",
            prev: "btnPrev",
            frame: "list",
            child: "li",
            auto: auto,
            size: 185 
        });
    }

    // 文本超出用省略号表示
    $(".service_list_content div").each(function(i){
        var divH = $(this).height();
        var $p = $("p", $(this)).eq(0);
        while ($p.outerHeight() > divH) {
            $p.text($p.text().replace(/(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/, "..."));
        };
    });

    $(".story_intro_content").each(function(i){
        $(this).css('overflow', 'visible');
        var p = $(this).find('p')[0];
        p.style.textAlign = "justify";
        p.style.letterSpacing = '-.15em';
        p.innerHTML = p.innerHTML.split("").join(" ");
        var divH = $(this).height();
        var $p = $("p", $(this)).eq(0);
        while ($p.outerHeight() > divH) {
            $p.text($p.text().replace(/(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/, "..."));
        };
    });

    // 诊所故事pc
    $(".story_intro_title").each(function(i){
        var divH = $(this).height();
        var $p = $("a", $(this)).eq(0);
        while ($p.outerHeight() > divH) {
            $p.text($p.text().replace(/(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/, "..."));
        };
    });

    // 诊所故事详情判断是否显示ps
    if($('.detail_doctors_block').find('li').length == 0 ){
        $('.detail_doctors_ps').hide();
    }

    // 回到顶部效果
    $(".scroll_to_top").click(function(e) {
            $('body,html').animate({scrollTop:0},1000);
    });
    goTop();
});

// 回到顶部调用函数
function goTop(){
    $(window).scroll(function(e) {
        //若滚动条离顶部大于100元素
        if($(window).scrollTop()>200)
            $(".scroll_to_top").addClass('show');
        else
            $(".scroll_to_top").removeClass('show');
    });
}