"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

lazySizes.cfg.init = false;
customScroll();
$(document).ready(function () {
  select.init();
  touchHoverEvents();
  inputs();
  search();
  nav();
  toggle();
  scrollTo();
  popup.init();
  slider.init();
  fixedBlocks();
  tabs();
  scrollToReviews();
  header();
  rating();
  calculator(); //обработать изображения после инициализации слайдеров

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

function touchHoverEvents() {
  document.addEventListener('touchstart', event);
  document.addEventListener('touchend', event);
  document.addEventListener('mouseover', event);
  document.addEventListener('mouseout', event);
  document.addEventListener('mousedown', event);
  document.addEventListener('mouseup', event);
  document.addEventListener('contextmenu', event);
  var $elements = 'a[class], button, label, input, textarea, tr, .js-touch-hover, .selectric-items li, .selectric .label, .button',
      touch,
      timeout;

  function event(event) {
    if (event.target !== document) {
      var $target = event.target.closest($elements);

      if ($target !== null) {
        if (event.type == 'touchstart') {
          var _iterator = _createForOfIteratorHelper(document.querySelectorAll($elements)),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var $this = _step.value;
              $this.classList.remove('touch');
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          touch = true;
          clearTimeout(timeout);
          $target.classList.add('touch');
        } else if (event.type == 'touchend') {
          $target.classList.remove('touch');
          timeout = setTimeout(function () {
            touch = false;
          }, 1000);
        } else if (event.type == 'contextmenu') {
          $target.classList.remove('touch');
          timeout = setTimeout(function () {
            touch = false;
          }, 1000);
        }

        if (event.type == 'mouseover' && !touch) {
          $target.classList.add('hover');
        } else if (event.type == 'mouseout' && !touch) {
          $target.classList.remove('hover');
          $target.classList.remove('focus');
        }

        if (event.type == 'mousedown') {
          $target.classList.add('focus');
        } else if (event.type == 'mouseup') {
          $target.classList.remove('focus');
        }
      } else {
        var _iterator2 = _createForOfIteratorHelper(document.querySelectorAll($elements)),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _$this = _step2.value;

            _$this.classList.remove('touch');
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    }
  }
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
    message: '[name="message"]',
    review: '[name="review"]'
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
      presence: {
        allowEmpty: false,
        message: '^Введите ваше сообщение'
      },
      length: {
        minimum: 10,
        tooShort: "^Сообщение слишком короткое (минимум %{count} символов)",
        maximum: 200,
        tooLong: "^Сообщение слишком длинное (максимум %{count} символов)"
      }
    },
    review: {
      presence: {
        allowEmpty: false,
        message: '^Напишите ваш отзыв'
      },
      length: {
        minimum: 10,
        tooShort: "^Отзыв слишком короткий (минимум %{count} символов)",
        maximum: 200,
        tooLong: "^Отзыв слишком длинный (максимум %{count} символов)"
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
  $containers.forEach(function ($element) {
    var $this = $($element),
        $container,
        $content;

    if (device.desktop() && !$this.is('.scrollbar_mobile-only')) {
      var simpleBar = new SimpleBar($element);
      $container = $this;
      $content = $this.find('.scrollbar__content'); //event

      simpleBar.getScrollElement().addEventListener('scroll', function () {
        gradientCheck();
      });
    } else {
      $this.addClass('scrollbar_mobile');
      $container = $this.find('.scrollbar__content');
      $content = $this.find('.scrollbar__inner'); //event

      $container.on('scroll', function () {
        gradientCheck();
      });
    }

    $container.add($content).attr('data-scroll-lock-scrollable', '');
    gradientCheck();

    function gradientCheck() {
      var scrollHeight = $content.outerHeight() - $container.outerHeight(),
          scroll = $container.offset().top - $content.offset().top;
      console.log($content.outerHeight());

      if (scroll > 0) {
        $this.removeClass('scrollbar_start');
      } else {
        $this.addClass('scrollbar_start');
      }

      if (scroll < scrollHeight) {
        $this.removeClass('scrollbar_end');
      } else {
        $this.addClass('scrollbar_end');
      }
    }
  });
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
          if ($content.is('.scrollbar')) {
            $content.height(height);
          }

          $content.slideDown(speed);
        }
      } else {
        $this.add($toggle).add($content).removeClass('active');

        if (!$this.is('[data-class-only]')) {
          if (initialized) {
            if ($content.is('.scrollbar')) {
              height = $content.height();
            }

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
} //tabs


function tabs() {
  var $tabs = $('.tabs');
  $tabs.each(function () {
    var $triggers = $(this).find('.tabs__toggle'),
        $tabs = $(this).find('.tabs__block'),
        index = $(this).find('.tabs__block.active').length > 0 ? $triggers.index($(this).find('.tabs__block.active')) : 0;
    changeTab();
    $triggers.on('click', function () {
      index = $triggers.index($(this));
      changeTab();
    });

    function changeTab() {
      $tabs.hide().eq(index).fadeIn(250);
      $triggers.removeClass('active').eq(index).addClass('active');
    }
  });
} //scroll


function scrollTo() {
  var $scrollbtn = $('[data-scroll]'),
      speed = 500; //ms

  $scrollbtn.on('click', function (event) {
    event.preventDefault();
    var href = $(this).attr('href'),
        $target = $(href);

    if ($target.length) {
      $('html, body').animate({
        scrollTop: $target.offset().top
      }, speed);
    }
  });
} //scroll to reviews


function scrollToReviews() {
  var $link = $('[data-reviews]'),
      speed = 500; //ms

  $link.on('click', function (event) {
    event.preventDefault();
    $('.item-info__reviews-toggle:visible').not('.active').trigger('click');
    var $target = $('.reviews__content'),
        y;

    if ($(window).width() < brakepoints.md) {
      y = $target.offset().top - 50;
    } else {
      y = $target.offset().top;
    }

    if ($target.length) {
      $('html, body').animate({
        scrollTop: y
      }, speed);
    }
  });
}

function fixedBlocks() {
  var $open = $('[data-fixed-toggle]');
  $open.on('click', function (event) {
    event.preventDefault();
    var href = $(this).attr('href'),
        $block = $(href);

    if ($block.length) {
      $block.addClass('active');
      scrollLock.disablePageScroll();
      var $close = $block.find('[data-fixed-close]');
      $close.on('click', function (event) {
        event.preventDefault();
        $block.removeClass('active');
        scrollLock.enablePageScroll();
      });
    }
  });
} //rate


function rating() {
  $(document).on('click', '.js-rating__star', function (event) {
    var $parent = $(event.target).closest('.js-rating'),
        $star = $(event.target).closest('.js-rating__star'),
        $stars = $star.parents('.js-rating').find('.js-rating__star'),
        $input = $star.parents('.js-rating').find('input'),
        count = +$star.attr('data-index'),
        $textItems = $parent.find('.js-rating__description-item');
    $input.val(count);
    $textItems.removeClass('active');
    $textItems.eq(count - 1).addClass('active');
    $stars.each(function (index) {
      if (index < count) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });
  });
  $(document).on('mousemove mouseleave', '.js-rating__list', function (event) {
    var $parent = $(event.target).closest('.js-rating'),
        $rating = $(event.target).closest('.js-rating__list'),
        $stars = $rating.find('.js-rating__star'),
        $input = $rating.parents('.js-rating').find('input'),
        $textItems = $parent.find('.js-rating__description-item');

    if (event.type == 'mousemove' && device.desktop() && $rating.length > 0) {
      var x = event.clientX - $rating.offset().left,
          w = $rating.width(),
          value = x / w * 5;
      $stars.each(function (index) {
        if (value > index) {
          $(this).addClass('active');
        } else {
          $(this).removeClass('active');
        }
      });
      $textItems.each(function (index) {
        if (value > index) {
          $textItems.removeClass('active');
          $(this).addClass('active');
        } else {
          return false;
        }
      });
    }

    if (event.type == 'mouseleave' && device.desktop() && $rating.length > 0) {
      var count = $input.val();
      $textItems.removeClass('active');

      if (count > 0) {
        $textItems.eq(count - 1).addClass('active');
        $stars.each(function (index) {
          if (index < count) {
            $(this).addClass('active');
          } else {
            $(this).removeClass('active');
          }
        });
      } else {
        $stars.removeClass('active');
      }
    }
  });
}

function calculator() {
  var $element = $('.calc-count-block');
  $element.each(function () {
    var $this = $(this),
        $plus = $this.find('.js-plus'),
        $minus = $this.find('.js-minus'),
        $input = $this.find('input'),
        val = +$input.val();
    check();
    $plus.on('click', function () {
      val++;
      check();
    });
    $minus.on('click', function () {
      val--;
      check();
    });
    $input.on('change input', function () {
      setTimeout(function () {
        val = +$input.val();
        check();
      }, 100);
    });

    function check() {
      if (val < 1 || val == 1) {
        val = 1;
        $minus.addClass('disabled');
      } else {
        $minus.removeClass('disabled');
      }

      $input.val(val);
    }
  });
}