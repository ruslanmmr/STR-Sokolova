"use strict";

lazySizes.cfg.init = false;
customScroll();
$(document).ready(function () {
  select.init();
  hoverTouchEvents();
  inputs();
  search();
  nav();
  toggle();
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
  var $targets = 'a[class], button, label, input, textarea, tr, .js-touch-hover, .selectric-items li, .selectric .label, .button';
  $(document).on('mouseenter mouseleave touchstart touchend mousedown mouseup contextmenu', $targets, function (event) {
    var $target = $(this),
        touchTimer; //mobile events

    if (!device.desktop()) {
      if (event.type == 'touchstart') {
        if (touchTimer) clearTimeout(touchTimer);
        $target.addClass('touch');
      } else if (event.type == 'touchend') {
        touchTimer = setTimeout(function () {
          $target.removeClass('touch');
        }, 150);
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
  var $parent = $('.search');
  $parent.each(function () {
    var $this = $(this),
        $input = $this.find('.search__input'),
        $content = $this.find('.search__content'),
        focus = false,
        mouseenter = false;
    $content.on('mouseenter mouseleave', function (event) {
      if (device.desktop()) {
        if (event.type == 'mouseenter') {
          mouseenter = true;
        } else {
          mouseenter = false;

          if (!focus) {
            $this.removeClass('active-content');
          }
        }
      }
    });
    $input.on('blur focus input', function (event) {
      console.log('++');

      if (event.type == 'blur') {
        focus = false;

        if (!mouseenter && device.desktop()) {
          $this.removeClass('active-content');
        }
      } else if (event.type == 'focus') {
        focus = true;
      } else {
        var val = $(this).val();

        if (val !== '') {
          $this.addClass('active').addClass('active-content');
        } else {
          $this.removeClass('active').removeClass('active-content');
        }
      }
    });
    $(document).on('touchstart', function (event) {
      var $target = $(event.target);

      if ($target.closest($this).length == 0) {
        $this.removeClass('active-content');
      }
    });
  });
}

function customScroll() {
  var $containers = document.querySelectorAll('.scrollbar');

  if (device.desktop()) {
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
    setTimeout(function () {
      $('.simplebar-wrapper, .simplebar-height-auto-observer-wrapper, .simplebar-mask, .simplebar-offset, .simplebar-content-wrapper, .simplebar-content').attr('data-scroll-lock-scrollable', '');
    }, 500);
  } else {
    $containers.forEach(function ($this) {
      $this.classList.add('scrollbar_mobile');
    });
  }
}

var slider = {
  el: $('.slider'),
  init: function init() {
    slider.el.each(function () {
      var _this4 = this;

      var slideCount = 1,
          slideCountLg = 1,
          slideCountMd = 1,
          slideCountSm = 1,
          slideCountXs = 1,
          arrows = false,
          dots = false,
          centerMode = false,
          autoplay = false,
          nextArrow = '<button type="button" class="button button_style-1 slider__next"><svg class="icon" viewBox="0 0 12 20"><path d="M2.18 19.05L.77 17.64 8.4 10 .77 2.36 2.18.95 11.23 10l-9.05 9.05z"></path></svg></button>',
          prevArrow = '<button type="button" class="button button_style-1 slider__prev"><svg class="icon" viewBox="0 0 12 20"><path d="M2.18 19.05L.77 17.64 8.4 10 .77 2.36 2.18.95 11.23 10l-9.05 9.05z"></path></svg></button>';

      if ($(this).is('.popular-projects__slider')) {
        arrows = true;
        slideCount = 2;
        slideCountLg = 2;
        slideCountMd = 2;
        slideCountSm = 2;
        slideCountXs = 1;

        if ($(this).is('.popular-projects__slider_mobile-only')) {
          var initialized = false;

          var check = function check() {
            if ($(window).width() < brakepoints.md && !initialized) {
              initialized = true;
              initSlider($(_this4));
            } else if ($(window).width() >= brakepoints.md && initialized) {
              initialized = false;
              setTimeout(function () {
                $(_this4).slick('unslick');
              }, 500);
            }
          };

          check();
          $(window).on('resize', function () {
            check();
          });
        } else {
          initSlider($(this));
        }
      } else if ($(this).is('.home-banner')) {
        arrows = true;
        dots = true;
        autoplay = true;
        nextArrow = '<button class="home-banner__arrow home-banner__next" aria-label="Next" type="button"><svg viewBox="0 0 15 26"><path d="M1.99869 0.292969L0.584473 1.70718L11.8774 13.0001L0.584472 24.293L1.99869 25.7072L14.7058 13.0001L1.99869 0.292969Z"/></svg></button>';
        prevArrow = '<button class="home-banner__arrow home-banner__prev" aria-label="Previous" type="button"><svg viewBox="0 0 15 26"><path d="M13.286 0.292969L14.7002 1.70718L3.4073 13.0001L14.7002 24.293L13.286 25.7072L0.578877 13.0001L13.286 0.292969Z"/></svg></button>';
        initSlider($(this));
      } else if ($(this).is('.news-preview-section__slider')) {
        arrows = true;
        slideCount = 3;
        slideCountLg = 3;
        slideCountMd = 2;
        slideCountSm = 2;
        slideCountXs = 1;
        initSlider($(this));
      } else if ($(this).is('.section-partners__slider')) {
        arrows = true;
        autoplay = true;
        slideCount = 6;
        slideCountLg = 5;
        slideCountMd = 4;
        slideCountSm = 3;
        slideCountXs = 1;
        initSlider($(this));
      }

      function initSlider($target) {
        $target.slick({
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
      }
    });
  }
}; //select

var select = {
  init: function init() {
    this.items = $('select');

    if (this.items.length) {
      this.items.selectric({
        disableOnMobile: false,
        nativeOnMobile: false,
        arrowButtonMarkup: '<svg class="icon" viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg"><path d="M9.72606 -1.19209e-07L11.1403 1.41421L5.57036 6.98453L4.15614 5.57031L9.72606 -1.19209e-07Z"/><path d="M0 1.41421L1.41421 1.19209e-07L6.98434 5.57047L5.57036 6.98453L0 1.41421Z"/></svg>'
      });
    }
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

  function check() {
    if ($(window).width() < brakepoints.md) {
      scroll = $(window).scrollTop();
      height = 130;

      if (scroll > height) {
        $header.addClass('fixed');
      } else {
        $header.removeClass('fixed');
      }
    }
  }
}

function nav() {
  var $toggle = $('.nav-toggle'),
      $nav = $('.mobile-nav'),
      state;
  $toggle.on('click', function (event) {
    event.preventDefault();

    if (!state) {
      open();
    } else {
      close();
    }
  });

  function open() {
    state = true;
    scrollLock.disablePageScroll();
    $nav.add($toggle).addClass('active');
  }

  function close() {
    state = false;
    scrollLock.enablePageScroll();
    $nav.add($toggle).removeClass('active');
  }
}

function toggle() {
  var $section = $('.toggle-section'),
      speed = 250;
  $section.each(function () {
    var $this = $(this),
        $toggle = $this.children('.toggle-section__head'),
        $content = $this.children('.toggle-section__content'),
        state = $this.hasClass('active') ? true : false,
        initialized,
        timeout,
        height = $content.height();

    if ($this.is('[data-out-hide]')) {
      $(document).on('click touchstart', function (event) {
        var $target = $(event.target);

        if (!$target.closest($content).length && !$target.closest($toggle).length && state) {
          state = false;
          check();
        }
      });
    }

    $toggle.on('click', function () {
      state = !state ? true : false;
      check();
    });

    function check() {
      if (state) {
        $this.add($content).add($toggle).addClass('active');

        if (!$this.is('[data-class-only]')) {
          $content.height(height);
          $content.stop().slideDown(speed);
        }
      } else {
        $this.add($toggle).add($content).removeClass('active');

        if (!$this.is('[data-class-only]')) {
          if (initialized) {
            $content.stop().slideUp(speed);
          } else {
            $content.hide(0);
          }
        }
      }
    }

    check();
    initialized = true;
  });
  /* function check() {
    $section.each(function(){
      if($(this).hasClass('active')) {
        $(this).find('.toggle-section__content').addClass('active');
      } else {
        $(this).find('.toggle-section__content').removeClass('active');
      }
    })
  }
  check(); */
}