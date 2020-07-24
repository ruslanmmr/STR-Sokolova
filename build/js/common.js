"use strict";

lazySizes.cfg.init = false;
customScroll();
$(document).ready(function () {
  hoverTouchEvents(); //homeBanner();

  inputs();
  search();
  popup.init();
  slider.init();
  header(); //обработать изображения после инициализации слайдеров

  setTimeout(function () {
    lazy();
  }, 500);
});
var brakepoints = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1280
}; //hover/touch custom events

function hoverTouchEvents() {
  $(document).on('mouseenter mouseleave touchstart touchend mousedown mouseup contextmenu', 'a[class],button,label,input,textarea,tr,.js-touch-hover', function (event) {
    var $target = $(this); //mobile events

    if (!device.desktop()) {
      if (event.type == 'touchstart') {
        $target.addClass('touch');
      } else if (event.type == 'touchend' || event.type == 'contextmenu') {
        $target.removeClass('touch');
      }
    } //desktop events
    else {
        if (event.type == 'mouseenter') {
          $target.addClass('hover');
        } else if (event.type == 'mousedown') {
          $target.addClass('mousedown');
        } else if (event.type == 'mouseup') {
          $target.removeClass('mousedown');
        } else {
          $target.removeClass('hover');
          $target.removeClass('mousedown');
        }
      }
  });
} //lazyload


function lazy() {
  //add lazy backgrounds
  document.addEventListener('lazybeforeunveil', function (e) {
    var el = e.target.tagName,
        bg = e.target.getAttribute('data-src'),
        parent = e.target.parentNode;

    if (el !== 'IMG') {
      var _bg = e.target.getAttribute('data-src');

      e.target.style.backgroundImage = "url('".concat(_bg, "')");
    }
  });
  lazySizes.init();
}

window.popup = {
  init: function init() {
    this.$trigger = $('[data-popup-open]');
    this.$close = $('[data-popup-close]');
    this.$trigger.on('click', function (event) {
      event.preventDefault();
      var $popup = $($(this).attr('href'));

      if ($popup.length) {
        popup.open($popup);
      }
    });
    $(document).on('click', function (event) {
      var $target = $(event.target);

      if ($target.closest(popup.$close).length || $target.closest('.popup').length && $target.closest('.popup-block__container').length == 0) {
        console.log('++');
        event.preventDefault();
        var $popup = $target.closest('.popup').length ? $target.closest('.popup') : $('.city-question-popup');
        popup.close($popup);
      }
    });
  },
  open: function open($popup) {
    var _this = this;

    var event = function event() {
      _this.active = $popup;
      scrollLock.disablePageScroll();
      $popup.addClass('active');
    };

    if (this.active) {
      popup.close(this.active, function () {
        event();
      });
    } else {
      event();
    }
  },
  close: function close($popup, callback) {
    var _this2 = this;

    scrollLock.enablePageScroll();
    $popup.removeClass('active');
    setTimeout(function () {
      _this2.active = undefined;
      typeof callback === 'function' && callback();
    }, 250);
  }
};

function homeBanner() {
  var $slider = $('.home-banner');
  $slider.slick({
    rows: 0,
    speed: 500,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: '<button class="home-banner__arrow home-banner__next" aria-label="Next" type="button"><svg viewBox="0 0 15 26"><path d="M1.99869 0.292969L0.584473 1.70718L11.8774 13.0001L0.584472 24.293L1.99869 25.7072L14.7058 13.0001L1.99869 0.292969Z"/></svg></button>',
    prevArrow: '<button class="home-banner__arrow home-banner__prev" aria-label="Previous" type="button"><svg viewBox="0 0 15 26"><path d="M13.286 0.292969L14.7002 1.70718L3.4073 13.0001L14.7002 24.293L13.286 25.7072L0.578877 13.0001L13.286 0.292969Z"/></svg></button>',
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000
  });
}

function inputs() {
  var $form = $('.js-validation'),
      $input = $('input, textarea');
  $input.on('focus', function () {
    $(this).addClass('focused');
  });
  $input.on('blur', function () {
    $(this).removeClass('focused');
  });
  $input.on('input change', function () {
    check();
  });

  function check() {
    console.log('check');
    $input.each(function () {
      var value = $(this).val();

      if (value == '') {
        $(this).removeClass('filled');
        $(this).parent().removeClass('filled');
      } else {
        $(this).addClass('filled');
        $(this).parent().addClass('filled');
      }
    });
  }

  check();
  var namspaces = {
    phone: '[name="phone"]',
    email: '[name="email"]',
    name: '[name="name"]',
    message: '[name="message"]'
  },
      conditions = {
    phone: {
      format: {
        pattern: /^\+7 \d{3}\ \d{3}\-\d{4}$|()/,
        message: '^Некорректный номер телефона'
      },
      presence: {
        allowEmpty: false,
        message: '^Введите номер телефона'
      }
    },
    email: {
      email: {
        message: '^Неправильный формат. Попробуйте что-то с @'
      }
    },
    name: {
      presence: {
        allowEmpty: false,
        message: '^Введите ваше имя'
      },
      length: {
        minimum: 2,
        tooShort: "^Имя слишком короткое (минимум %{count} символа)",
        maximum: 20,
        tooLong: "^Имя слишком длинное (максимум %{count} символов)"
      }
    },
    message: {
      length: {
        maximum: 200,
        tooLong: "^Сообщение слишком длинное (максимум %{count} символов)"
      }
    }
  },
      mask = Inputmask({
    mask: "+7 999 999-9999",
    showMaskOnHover: false,
    clearIncomplete: false
  }).mask(namspaces.phone); //validation events

  $form.each(function () {
    var $form = $(this),
        $inputs = $form.find('input, textarea');
    $inputs.on('input', function () {
      var _this3 = this;

      setTimeout(function () {
        validateForm($(_this3));
      }, 100);
    });

    function validateForm($input) {
      var values = {};
      var constraints = {};
      $inputs.each(function () {
        var $input = $(this);

        for (var key in namspaces) {
          if ($input.is(namspaces[key]) && ($(this).hasClass('required') || $(this).hasClass('filled'))) {
            values[key] = $input.val();
            constraints[key] = conditions[key];
          }
        }
      });
      var resault = validate(values, constraints);
      console.log(resault);

      if (resault !== undefined) {
        if ($input !== undefined) {
          var flag = true;

          for (var key in resault) {
            if ($input.is(namspaces[key]) && ($input.hasClass('required') || $input.hasClass('filled'))) {
              flag = false;
            }
          }

          if (flag) {
            $input.removeClass('error');
          }
        } else {
          $inputs.removeClass('error');
          $inputs.parent().find('.input__message').remove();

          var _loop = function _loop(_key) {
            $inputs.each(function () {
              var $input = $(this);

              if ($input.is(namspaces[_key]) && ($input.hasClass('required') || $input.hasClass('filled'))) {
                $input.addClass('error');
                $input.parent().append("<span class=\"input__message\">".concat(resault[_key][0], "</span>"));
              }
            });
          };

          for (var _key in resault) {
            _loop(_key);
          }
        }

        return false;
      } else {
        $inputs.removeClass('error');
        $inputs.parent().find('.input__message').remove();
        return true;
      }
    }

    $form.on('submit', function (event) {
      event.preventDefault();

      if (validateForm()) {
        console.log('submit!');
        $inputs.val('').trigger('change');
        popup.open($('#succes'));
      }
    });
  });
}

function search() {
  var $parent = $('.header-search'),
      $input = $parent.find('.header-search__input'),
      $content = $parent.find('.header-search__content'),
      focus = false,
      mouseenter = false;
  $input.on('input', function () {
    var val = $(this).val();

    if (val !== '') {
      $parent.addClass('active').addClass('active-content');
    } else {
      $parent.removeClass('active').removeClass('active-content');
    }
  });
  $content.on('mouseenter mouseleave', function (event) {
    if (event.type == 'mouseenter') {
      mouseenter = true;
    } else {
      mouseenter = false;

      if (!focus) {
        $parent.removeClass('active-content');
      }
    }
  });
  $input.on('blur focus input', function (event) {
    if (event.type == 'blur') {
      focus = false;

      if (!mouseenter) {
        $parent.removeClass('active-content');
      }
    } else if (event.type == 'focus' || event.type == 'input') {
      focus = true;
      var val = $(this).val();

      if (val !== '') {
        $parent.addClass('active').addClass('active-content');
      } else {
        $parent.removeClass('active').removeClass('active-content');
      }
    }
  });
}

function customScroll() {
  var $containers = document.querySelectorAll('.scrollbar');
  $containers.forEach(function ($target) {
    var $parent = $($target),
        $content = $parent.find('.scrollbar__content'),
        simpleBar = new SimpleBar($target);
    simpleBar.getScrollElement().addEventListener('scroll', function () {
      gradientCheck();
    });
    gradientCheck();

    function gradientCheck() {
      var scrollHeight = $content.outerHeight() - $parent.outerHeight(),
          scroll = $parent.offset().top - $content.offset().top;

      if (scroll > 0) {
        $parent.removeClass('scrollbar_start');
      } else {
        $parent.addClass('scrollbar_start');
      }

      if (scroll < scrollHeight) {
        $parent.removeClass('scrollbar_end');
      } else {
        $parent.addClass('scrollbar_end');
      }
    }
  });
}

var slider = {
  el: $('.slider'),
  init: function init() {
    slider.el.each(function () {
      var slideCount = 1,
          slideCountLg = 1,
          slideCountMd = 1,
          slideCountSm = 1,
          slideCountXs = 1,
          arrows = false,
          dots = false,
          centerMode = false,
          adaptiveHeight = false,
          autoplay = false,
          nextArrow = '<button type="button" class="button button_style-1 slider__next"><svg class="icon" viewBox="0 0 12 20"><path d="M2.18 19.05L.77 17.64 8.4 10 .77 2.36 2.18.95 11.23 10l-9.05 9.05z"></path></svg></button>',
          prevArrow = '<button type="button" class="button button_style-1 slider__prev"><svg class="icon" viewBox="0 0 12 20"><path d="M2.18 19.05L.77 17.64 8.4 10 .77 2.36 2.18.95 11.23 10l-9.05 9.05z"></path></svg></button>';

      if ($(this).is('.popular-projects-section__slider')) {
        arrows = true;
        slideCount = 2;
        slideCountLg = 2;
        slideCountMd = 2;
        slideCountSm = 2;
        slideCountXs = 1;
      } else if ($(this).is('.home-banner')) {
        arrows = true;
        dots = true;
        autoplay = true;
        nextArrow = '<button class="home-banner__arrow home-banner__next" aria-label="Next" type="button"><svg viewBox="0 0 15 26"><path d="M1.99869 0.292969L0.584473 1.70718L11.8774 13.0001L0.584472 24.293L1.99869 25.7072L14.7058 13.0001L1.99869 0.292969Z"/></svg></button>';
        prevArrow = '<button class="home-banner__arrow home-banner__prev" aria-label="Previous" type="button"><svg viewBox="0 0 15 26"><path d="M13.286 0.292969L14.7002 1.70718L3.4073 13.0001L14.7002 24.293L13.286 25.7072L0.578877 13.0001L13.286 0.292969Z"/></svg></button>';
      } else if ($(this).is('.news-preview-section__slider')) {
        arrows = true;
        slideCount = 3;
        slideCountLg = 3;
        slideCountMd = 2;
        slideCountSm = 2;
        slideCountXs = 1;
      } else if ($(this).is('.section-partners__slider')) {
        arrows = true;
        autoplay = true;
        slideCount = 6;
        slideCountLg = 5;
        slideCountMd = 4;
        slideCountSm = 3;
        slideCountXs = 1;
      }

      $(this).slick({
        rows: 0,
        infinite: true,
        dots: dots,
        arrows: arrows,
        nextArrow: nextArrow,
        prevArrow: prevArrow,
        speed: 500,
        centerMode: centerMode,
        slidesToShow: slideCount,
        slidesToScroll: slideCount,
        autoplay: autoplay,
        autoplaySpeed: 5000,
        responsive: [{
          breakpoint: brakepoints.lg,
          settings: {
            slidesToShow: slideCountLg,
            slidesToScroll: slideCountLg
          }
        }, {
          breakpoint: brakepoints.md,
          settings: {
            slidesToShow: slideCountMd,
            slidesToScroll: slideCountMd
          }
        }, {
          breakpoint: brakepoints.sm,
          settings: {
            slidesToShow: slideCountSm,
            slidesToScroll: slideCountSm
          }
        }, {
          breakpoint: brakepoints.xs,
          settings: {
            slidesToShow: slideCountXs,
            slidesToScroll: slideCountXs
          }
        }]
      });
    });
  }
};

function header() {
  var $header = $('.header'),
      height,
      scroll;
  check();
  $(window).scroll(function () {
    check();
  });
  $(window).resize(function () {
    padding();
  });

  function check() {
    scroll = $(window).scrollTop();
    height = 130;

    if (scroll > height) {
      $header.addClass('fixed');
    } else {
      $header.removeClass('fixed');
    }
  }
}