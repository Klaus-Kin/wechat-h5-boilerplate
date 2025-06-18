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
      effect: 'fade',    // slide, fade, coverflow or flip
      speed: 400,
      direction: 'vertical',
      fade: {
        crossFade: false
      },
      coverflow: {
        // 旋转角度设置为100度
        rotate: 100,
        stretch: 0,
        // 深度设置为300
        depth: 300,
        modifier: 1,
        // 禁用阴影以获得更好的性能
        slideShadows: false
      },
      flip: {
        limitRotation: true,
        // 禁用阴影以获得更好的性能
        slideShadows: false
      },
      onInit: function (swiper) {
        // 为动画准备项目
        animationControl.initAnimationItems();
        // 播放第一张幻灯片的动画
        animationControl.playAnimation(swiper);
      },
      onTransitionStart: function (swiper) {
        // 在最后一张幻灯片上，隐藏 .btn-swipe
        if (swiper.activeIndex === swiper.slides.length - 1) {
          $upArrow.hide();
        } else {
          $upArrow.show();
        }
      },
      onTransitionEnd: function (swiper) {
        // 播放当前幻灯片的动画
        animationControl.playAnimation(swiper);
      },
      onTouchStart: function (swiper, event) {
        // 移动设备不允许音频自动播放，它必须由用户事件（点击/触摸）触发。
        if (!$btnMusic.hasClass('paused') && bgMusic.paused) {
          bgMusic.play();
        }
      }
    });

    // 在一切都已准备就绪后,再延迟隐藏加载动画;因为加载动画也挺好看的
    setTimeout(function () {
      $('.loading-overlay').slideUp();
    }, 2000)
  });
})();
