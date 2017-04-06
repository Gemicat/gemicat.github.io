var mp4URL = 'img/video-small.mp4';
var webmURL = 'img/video-small.webm';
var coverURL = 'img/video-cover.jpg';
var mobileBG = 'img/mobile-bg.png'
var video = $('#moon');
var videoImg = video.find('img');
var sources = video.find('source');
var maskImg = $('.mask img');
var localContent = $('.local-content');
var isSupport;

checkScreen();

$(window).resize(function() {
    checkScreen();
});

function checkScreen() {
    var screenWidth = $(window).width();
    var screenHeight = $(window).height();
    isSupport = checkVideo();

    // 如果浏览器支持html5
    if (isSupport) {

        // 如果屏幕宽度大于770px,展示视频。否则展示背景图片
        if (screenWidth > 750) {
            maskImg.attr('src', '');

            if (!sources.eq(0).attr('src')) {
                sources.eq(0).attr('src', mp4URL);
                sources.eq(1).attr('src', webmURL);
                video.get(0).load();
            }
        } else {
            maskImg.attr('src', mobileBG);
            if (screenWidth > screenHeight) {
                maskImg.addClass('screenW');
            } else {
                maskImg.removeClass('screenW');
            }
        }
    } else {
        maskImg.attr('src', coverURL).addClass('pcScreen');
        localContent.addClass('no-support');
        $('.local-logo').hide();
    }
}

//检测是否支持HTML5
function checkVideo() {
    if (!!document.createElement('video').canPlayType) {
        var vidTest = document.createElement("video");
        oggTest = vidTest.canPlayType('video/ogg; codecs="theora, vorbis"');
        if (!oggTest) {
            h264Test = vidTest.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
            if (!h264Test) {
                return false;
            }
            else {
                if (h264Test == "probably") {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else {
            if (oggTest == "probably") {
                return true;
            }
            else {
               return false;
            }
        }
    }
    else {
        return false;
    }
}