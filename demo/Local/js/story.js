// 诊所故事 - 延迟加载
$(function(){
    var scroll_flag = false;
    var winH = $(window).height(); //页面可视区域高度 
    var str = '';
    var size = 0;
    var page = 2;
    $(window).scroll(function () {
        var pageH = $(document.body).height();
        var pageW = $(document.body).width();
        var scrollT = $(window).scrollTop(); //滚动条top
        var aa = (pageH-winH-scrollT)/winH;
        if(scroll_flag){
            return false;
        }
        if(pageW < 750) {
            size = 0.02;
        } else {
            size = 0.75;
        }
        if(aa < size){
            scroll_flag = true;
            var host = document.location.origin;
            var url = host + '/getStory';
            $.ajax({
                type : 'get',
                url : url,
                data : {
                    "p" : page,
                    "pageSize" : 9
                },
                error : function(){
                    scroll_flag = true;
                },
                success : function(res){
                    res = JSON.parse(res);
                    if(res.length == 0){
                        scroll_flag = true;
                        return false;
                    }
                    var len = res.length;
                    for(var i = 0 ; i < len ; i ++) {
                        str += '<li>';
                        str += '<div class="story_calendar"><div class="story_calendar_day"> '+res[i]["day"]+' </div><div class="story_calendar_mon"> '+ res[i]["month"] +' </div></div><div class="story_intro"><a href="'+ res[i]["cover_link"] +'"><img src="'+ res[i]["cover"] +'" alt=""></a><h1 class="story_intro_title_mobile"><a href="'+ res[i]["cover_link"] +'">'+ res[i]["title"] +'</a></h1><div class="story_from"><span>'+ res[i]["time"] +'&nbsp;</span><a href="'+ res[i]["from_link"] +'">'+ res[i]["from"] +'</a></div><h1 class="story_intro_title"><a href="'+ res[i]["cover_link"] +'">'+ res[i]["title"] +'</a></h1><div class="story_intro_content"><p>'+ res[i]["description"] +'</p></div><a href="'+ res[i]["cover_link"] +'" class="story_more">查看更多</a></div>';
                        str += '</li>'
                    }
                    $('.pc_story_list').append(str);
                    str = '';
                    scroll_flag = false;
                    page++;

                    $(".story_intro_title").each(function(i){
                        var divH = $(this).height();
                        var $p = $("a", $(this)).eq(0);
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
                }
            });
        }
    });
})