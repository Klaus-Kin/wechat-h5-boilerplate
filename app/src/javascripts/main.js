(function () {
    'use strict';

    // load dependencies
    var animationControl = require('./animation-control.js');


    $(document).ready(function () {
        var bgMusic = $('audio').get(0);
        var $btnMusic = $('.btn-music');
        var $upArrow = $('.up-arrow');

        // background music control
        $btnMusic.click(function () {
            if (bgMusic.paused) {
                bgMusic.play();
                $(this).removeClass('paused');
            } else {
                bgMusic.pause();
                $(this).addClass('paused');
            }
        });

        // init Swiper
        new Swiper('.swiper-container', {
            mousewheelControl: true,
            effect: 'coverflow',    // slide, fade, coverflow or flip
            speed: 400,
            direction: 'vertical',
            fade: {
                crossFade: false
            },
            coverflow: {
                rotate: 100,
                stretch: 0,
                depth: 300,
                modifier: 1,
                slideShadows: false     // 禁用阴影以获得更好的性能
            },
            flip: {
                limitRotation: true,
                slideShadows: false     // 禁用阴影以获得更好的性能
            },
            onInit: function (swiper) {
                animationControl.initAnimationItems();  // 为动画准备项目
                animationControl.playAnimation(swiper); // 播放第一张幻灯片的动画
            },
            onTransitionStart: function (swiper) {     // 在最后一张幻灯片上，隐藏 .btn-swipe
                if (swiper.activeIndex === swiper.slides.length - 1) {
                    $upArrow.hide();
                } else {
                    $upArrow.show();
                }
            },
            onTransitionEnd: function (swiper) {       // play animations of the current slide
                animationControl.playAnimation(swiper);
            },
            onTouchStart: function (swiper, event) {    // mobile devices don't allow audios to play automatically, it has to be triggered by a user event(click / touch).
                if (!$btnMusic.hasClass('paused') && bgMusic.paused) {
                    bgMusic.play();
                }
            }
        });

        // 在一切都已准备就绪后,再延迟隐藏加载动画;因为加载动画也挺好看的
        setTimeout(function () {
          $('.loading-overlay').slideUp();
        },2000)
    });
})();
