lazySizes.cfg.init = false;
customScroll();

$(document).ready(function(){
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
  diagram();
  rating();
  calculator();
  stagesToggle();
  jsRange();
  gridToggle();
  //обработать изображения после инициализации слайдеров
  setTimeout(()=>{
    lazy();
  },500)
})


const brakepoints = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1280
}


//hover/touch custom events
function touchHoverEvents() {
  document.addEventListener('touchstart', event);
  document.addEventListener('touchend', event);
  document.addEventListener('mouseenter', event, true);
  document.addEventListener('mouseleave', event, true);
  document.addEventListener('mousedown', event);
  document.addEventListener('mouseup', event);
  document.addEventListener('contextmenu', event)

  let targets = 'a[class], button, label, input, textarea, tr, .js-touch-hover, .selectric-items li, .selectric .label, .button',
      touchEndDelay = 250, //ms    
      touch, 
      timeout;

  //$target = event.target.closest(targets)==event.target?event.target:false;

  function event(event) {
    let $target = event.target!==document?event.target.closest(targets):false;
    if($target) {

      if(event.type=='touchstart') {
        touch = true;
        for(let $this of document.querySelectorAll(targets)) {
          $this.classList.remove('touch');
        }
        clearTimeout(timeout)
        $target.classList.add('touch');
      } else if(event.type=='touchend') {
        setTimeout(()=>{
          $target.classList.remove('touch');
        }, touchEndDelay)
        timeout = setTimeout(()=>{
          touch = false;
        }, 1000)
      } else if(event.type=='contextmenu') {
        $target.classList.remove('touch');
        timeout = setTimeout(()=>{
          touch = false;
        }, 1000)
      }

      if(event.type=='mouseenter' && !touch && $target==event.target) {
        $target.classList.add('hover');
      } else if(event.type=='mouseleave' && !touch && $target==event.target) {
        $target.classList.remove('hover');
        $target.classList.remove('focus');
      }
      
      if(event.type=='mousedown') {
        $target.classList.add('focus');
      } else if(event.type=='mouseup') {
        $target.classList.remove('focus');
      }

    }
  }

}

//lazyload
function lazy() {
  //add lazy backgrounds
  document.addEventListener('lazybeforeunveil', function(e){
    let el = e.target.tagName,
        bg = e.target.getAttribute('data-src'),
        parent = e.target.parentNode;

    if(el!=='IMG') {
      let bg = e.target.getAttribute('data-src');
      e.target.style.backgroundImage = `url('${bg}')`;
    }
  });
  lazySizes.init();
}

window.popup = {
  init: function() {
    this.$trigger = $('[data-popup-open]');
    this.$close = $('[data-popup-close]')

    this.$trigger.on('click', function(event) {
      event.preventDefault();
      let $popup = $($(this).attr('href'));
      if($popup.length) {
        popup.open($popup);
      }
    })

    $(document).on('click', function(event) {
      let $target = $(event.target);
      if(
        ($target.closest(popup.$close).length) ||
        ($target.closest('.popup').length && $target.closest('.popup-block__container').length==0)
      ) 
      {
        event.preventDefault();
        let $popup = $target.closest('.popup').length ? $target.closest('.popup') : $('.city-question-popup');
        popup.close($popup);
      }
    })

  }, 
  open: function($popup) {
    let event = () => {
      this.active = $popup;
      scrollLock.disablePageScroll();
      $popup.addClass('active');
    }

    if(this.active) {
      popup.close(this.active, function() {
        event();
      });
    } else {
      event();
    }

  }, 
  close: function($popup, callback) {
    scrollLock.enablePageScroll();
    $popup.removeClass('active');
    setTimeout(()=>{
      this.active = undefined;
      typeof callback === 'function' && callback();
    }, 250)
  }
}

function inputs() {
  let $form = $('.js-validation'),
      $input = $('input, textarea');


  $input.on('focus', function() {
    $(this).addClass('focused');
  })
  $input.on('blur', function() {
    $(this).removeClass('focused');
  })
  $input.on('input change', function() {
    check();
  })
  function check() {
    $input.each(function() {
      let value = $(this).val();
      if(value=='') {
        $(this).removeClass('filled');
        $(this).parent().removeClass('filled');
      } else {
        $(this).addClass('filled');
        $(this).parent().addClass('filled');
      }
    })
  }
  check();
      
  let namspaces = {
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
  }).mask(namspaces.phone);

  //validation events
  $form.each(function() {
    let $form = $(this),
        $inputs = $form.find('input, textarea');

    $inputs.on('input', function() {
      setTimeout(()=>{
        validateForm($(this));
      }, 100)
    })

    function validateForm($input) {
      let values = {};
      let constraints = {};

      $inputs.each(function() {
        let $input = $(this);
        for(let key in namspaces) {
          if($input.is(namspaces[key]) && ($(this).hasClass('required') || $(this).hasClass('filled'))) {
            values[key] = $input.val();
            constraints[key] = conditions[key];
          }
        }
      })

      let resault = validate(values, constraints);

      if(resault!==undefined) {
        if($input!==undefined) {
          let flag=true;
          for(let key in resault) {
            if($input.is(namspaces[key]) && ($input.hasClass('required') || $input.hasClass('filled'))) {
              flag=false;
            }
          }
          if(flag) {
            $input.removeClass('error');
          }
        } else {
          $inputs.removeClass('error');
          $inputs.parent().find('.input__message').remove();
          for(let key in resault) {
            $inputs.each(function() {
              let $input = $(this);
              if($input.is(namspaces[key]) && ($input.hasClass('required') || $input.hasClass('filled'))) {
                $input.addClass('error');
                $input.parent().append(`<span class="input__message">${resault[key][0]}</span>`);
              }
            })
          }
        }
        return false;
      } else {
        $inputs.removeClass('error');
        $inputs.parent().find('.input__message').remove();
        return true;
      }
    }

    $form.on('submit', function(event) {
      event.preventDefault();
      if(validateForm()) {
        /* $inputs.val('').trigger('change');
        popup.open($('#succes'));  */
      }
    })

  })
}

function search() {
  let $parent = $('.search');

  $parent.each(function() {
    let $this = $(this),
        $input = $this.find('.search__input'),
        $content = $this.find('.search__content'),
        focus = false,
        mouseenter = false;

    $content.on('mouseenter mouseleave', function(event) {
      if(device.desktop()) {
        if(event.type=='mouseenter') {
          mouseenter=true;
        } else {
          mouseenter=false;
          if(!focus) {
            $this.removeClass('active-content');
          }
        }
      }
    })
    $input.on('blur focus input', function(event) {
      if(event.type=='blur') {
        focus = false;
        if(!mouseenter && device.desktop()) {
          $this.removeClass('active-content');
        }
      } else if(event.type=='focus') {
        focus = true;
      } else {
        let val = $(this).val();
        if(val!=='') {
          $this.addClass('active').addClass('active-content');
        } else {
          $this.removeClass('active').removeClass('active-content');
        }
      }
    })

    $(document).on('touchstart', function(event) {
      let $target = $(event.target);
      if($target.closest($this).length==0) {
        $this.removeClass('active-content');
      }
    }) 
    
  })

}

function customScroll() {
  let $containers = document.querySelectorAll('.scrollbar');
  $containers.forEach(($element)=>{
    let $this = $($element),
        $container, $content;

    if(device.desktop() && !$this.is('.scrollbar_mobile-only')) {
      let simpleBar = new SimpleBar($element);
      $container = $this;
      $content = $this.find('.scrollbar__content');
      //event
      simpleBar.getScrollElement().addEventListener('scroll', function() {
        gradientCheck();
      });
    } 
    else {
      $this.addClass('scrollbar_mobile');
      $container = $this.find('.scrollbar__content');
      $content = $this.find('.scrollbar__inner');
      //event
      $container.on('scroll',function(){
        gradientCheck();
      });
    }

    $container.add($content).attr('data-scroll-lock-scrollable', '')
  
    gradientCheck();
  
    function gradientCheck() {
      let scrollHeight = $content.outerHeight() - $container.outerHeight(),
          scroll = $container.offset().top - $content.offset().top;

      if(scroll > 0) {
        $this.removeClass('scrollbar_start')
      } else {
        $this.addClass('scrollbar_start')
      }
      if(scroll < scrollHeight) {
        $this.removeClass('scrollbar_end')
      } else {
        $this.addClass('scrollbar_end')
      }
    }

  })
}

let slider = {
  el: $('.slider'),
  init: function() {
    slider.el.each(function () {
      let slideCount = 1,
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
      
      if($(this).is('.slider_dots')) {
        dots=true;
      } 
      
      if($(this).is('.slider_arrows')) {
        arrows=true;
      }

      if($(this).is('.slider_grid')) {
        arrows=true;
        dots=true;
      } 

      if($(this).is('.popular-projects__slider')) {
        slideCount = 2;
        slideCountLg = 2;
        slideCountMd = 2;
        slideCountSm = 2;
        slideCountXs = 1;
        if($(this).is('.popular-projects__slider_mobile-only')) {
          let initialized=false;
          let check =()=> {
            if($(window).width()<brakepoints.md && !initialized) {
              initialized=true;
              initSlider($(this));
            } else if($(window).width()>=brakepoints.md && initialized) {
              initialized=false;
              setTimeout(()=>{
                $(this).slick('unslick');
              },500)
            }
          }
          check();
          $(window).on('resize', function() {
            check();
          })
        } 
        else {
          initSlider($(this));
        }
      } 
      
      else if($(this).is('.home-banner')) {
        autoplay = true;
        nextArrow = '<button class="home-banner__arrow home-banner__next" aria-label="Next" type="button"><svg viewBox="0 0 15 26"><path d="M1.99869 0.292969L0.584473 1.70718L11.8774 13.0001L0.584472 24.293L1.99869 25.7072L14.7058 13.0001L1.99869 0.292969Z"/></svg></button>';
        prevArrow = '<button class="home-banner__arrow home-banner__prev" aria-label="Previous" type="button"><svg viewBox="0 0 15 26"><path d="M13.286 0.292969L14.7002 1.70718L3.4073 13.0001L14.7002 24.293L13.286 25.7072L0.578877 13.0001L13.286 0.292969Z"/></svg></button>';
        initSlider($(this));
      }  
      
      else if($(this).is('.photo-slider')) {
        initSlider($(this));
      }
      
      else if($(this).is('.news-preview-section__slider')) {
        slideCount = 3;
        slideCountLg = 3;
        slideCountMd = 2;
        slideCountSm = 2;
        slideCountXs = 1;
        initSlider($(this));
      } 
      
      else if($(this).is('.section-partners__slider')) {
        autoplay = true;
        slideCount = 6;
        slideCountLg = 5;
        slideCountMd = 4;
        slideCountSm = 3;
        slideCountXs = 1;
        initSlider($(this));
      }

      else if($(this).is('.projects-slider') || $(this).is('.progress-projects-slider')) {
        slideCount = 4;
        slideCountLg = 3;
        slideCountMd = 2;
        slideCountSm = 2;
        slideCountXs = 1;
        initSlider($(this));
      }

      else if($(this).is('.product-slider')) {
        if($(this).is('.product-slider_style-2')) {
          slideCount = 4;
          slideCountLg = 3;
        } else {
          slideCount = 5;
          slideCountLg = 4;
        }
        slideCountMd = 3;
        slideCountSm = 2;
        slideCountXs = 1;
        initSlider($(this));
      }

      else if($(this).is('.wiki-slider')) {
        slideCount = 4;
        slideCountLg = 3;
        slideCountMd = 3;
        slideCountSm = 2;
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
            },
            {
              breakpoint: brakepoints.md,
              settings: {
                slidesToShow: slideCountMd,
                slidesToScroll: slideCountMd
              }
            },
            {
              breakpoint: brakepoints.sm,
              settings: {
                slidesToShow: slideCountSm,
                slidesToScroll: slideCountSm
              }
            },
            {
              breakpoint: brakepoints.xs,
              settings: {
                slidesToShow: slideCountXs,
                slidesToScroll: slideCountXs
              }
            }
          ]
        });
      }
    
    });

  }
}
//select
let select = {
  init: function() {
    this.items = $('select');
    if(this.items.length) {
      this.items.selectric({
        disableOnMobile: false,
        nativeOnMobile: false,
        arrowButtonMarkup: '<svg class="icon" viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg"><path d="M9.72606 -1.19209e-07L11.1403 1.41421L5.57036 6.98453L4.15614 5.57031L9.72606 -1.19209e-07Z"/><path d="M0 1.41421L1.41421 1.19209e-07L6.98434 5.57047L5.57036 6.98453L0 1.41421Z"/></svg>'
      });
    }
  }
}

function header() {
  let $header = $('.header'), 
      height,
      scroll;

  check();
  $(window).scroll(function() {
    check();
  });

  function check() {
    if($(window).width()<brakepoints.md) {
      scroll = $(window).scrollTop();
      height = 130;

      if(scroll>height){
        $header.addClass('fixed');
      } else {
        $header.removeClass('fixed');
      }
    }

  }
  
}

function nav() {
  let $toggle = $('.nav-toggle'),
      $nav = $('.mobile-nav'),
      state;
  $toggle.on('click', function(event){
    event.preventDefault();
    if(!state) {
      open();
    } else {
      close();
    }
  })

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
  let $section = $('.toggle-section'),
      speed = 250;

  $section.each(function() {
    let $this = $(this),
        $toggle = $this.children('.toggle-section__head'),
        $content = $this.children('.toggle-section__content'),
        state = $this.hasClass('active') ? true : false,
        initialized,
        height = $content.height();

    if($this.is('[data-out-hide]')) {
      $(document).on('click touchstart', function(event) {
        let $target = $(event.target);
        if(!$target.closest($content).length && !$target.closest($toggle).length && state) {
          state=false;
          check();
        }
      })
    }

    $toggle.on('click', function() {
      state = !state ? true : false;
      check();
    })

    function check() {
      if(state) {
        $this.add($content).add($toggle).addClass('active');
        if(!$this.is('[data-class-only]')) {
          if($content.is('.scrollbar')) {
            $content.height(height);
          }
          $content.slideDown(speed);
        }
      } 
      else {
        $this.add($toggle).add($content).removeClass('active');
        if(!$this.is('[data-class-only]')) {
          if(initialized) {
            if($content.is('.scrollbar')) {
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

    initialized=true;
  })
}

//tabs
function tabs() {
  let $tabs = $('.tabs');

  $tabs.each(function() {
    let $triggers = $(this).find('.tabs__toggle'),
        $tabs = $(this).find('.tabs__block'),
        index = $(this).find('.tabs__block.active').length>0 ? $tabs.index($(this).find('.tabs__block.active')) : 0;

    changeTab();

    $triggers.on('click', function() {
      index = $triggers.index($(this));
      changeTab();
    })

    function changeTab() {
      $tabs.hide().eq(index).fadeIn(250);
      $triggers.removeClass('active').eq(index).addClass('active');
    }

  })
}

//scroll
function scrollTo() {
  let $scrollbtn = $('[data-scroll]'),  
      speed = 500; //ms
  $scrollbtn.on('click', function(event) {
    event.preventDefault();
    let href = $(this).attr('href'),
        $target = $(href);

    if($target.length) {
      $('html, body').animate({
        scrollTop: $target.offset().top
      }, speed);
    }

  })
}
//scroll to reviews
function scrollToReviews() {
  let $link = $('[data-reviews]'),  
      speed = 500; //ms
  $link.on('click', function(event) {
    event.preventDefault();
    $('.item-info__reviews-toggle:visible').not('.active').trigger('click');
    let $target = $('.reviews__content'),
        y;
    if($(window).width()<brakepoints.md) {
      y = $target.offset().top - 50;
    } else {
      y = $target.offset().top;
    }

    if($target.length) {
      $('html, body').animate({
        scrollTop: y
      }, speed);
    }

  })
}

function fixedBlocks() {
  let $open = $('[data-fixed-toggle]');

  $open.on('click', function(event) {
    event.preventDefault();
    let href = $(this).attr('href'),
        $block = $(href);

    if($block.length) {
      $block.addClass('active');
      scrollLock.disablePageScroll();

      let $close = $block.find('[data-fixed-close]');

      $close.on('click', function(event) {
        event.preventDefault();
        $block.removeClass('active');
        scrollLock.enablePageScroll();
      });
    }
  })
}

//rate
function rating() {
  
  $(document).on('click', '.js-rating__star', function(event) {
    let $parent = $(event.target).closest('.js-rating'),
        $star = $(event.target).closest('.js-rating__star'),
        $stars = $star.parents('.js-rating').find('.js-rating__star'),
        $input = $star.parents('.js-rating').find('input'),
        count = +$star.attr('data-index'),
        $textItems = $parent.find('.js-rating__description-item');

    $input.val(count);
    $textItems.removeClass('active');
    $textItems.eq(count-1).addClass('active');
    $stars.each(function(index){
      if(index<count) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    })
  })
  
  $(document).on('mousemove mouseleave', '.js-rating__list', function(event) {
    let $parent = $(event.target).closest('.js-rating'),
        $rating = $(event.target).closest('.js-rating__list'),
        $stars = $rating.find('.js-rating__star'),
        $input = $rating.parents('.js-rating').find('input'),
        $textItems = $parent.find('.js-rating__description-item');

      if(event.type=='mousemove' && device.desktop() && $rating.length>0) {
        let x = event.clientX-$rating.offset().left,
            w = $rating.width(),
            value = x/w*5;

        $stars.each(function(index){
          if(value>index) {
            $(this).addClass('active');
          } else {
            $(this).removeClass('active');
          }
        })

        $textItems.each(function(index){
          if(value>index) {
            $textItems.removeClass('active');
            $(this).addClass('active');
          } else {
            return false;
          }
        })
        
      }
      
      if(event.type=='mouseleave' && device.desktop() && $rating.length>0) {
        let count = $input.val();
        $textItems.removeClass('active');
        if(count>0) {
          $textItems.eq(count-1).addClass('active');
          $stars.each(function(index){
            if(index<count) {
              $(this).addClass('active');
            } else {
              $(this).removeClass('active');
            }
          })
        } else {
          $stars.removeClass('active');
        }
      }
  })
}

function calculator() {
  let $element = $('.calc-count-block');

  $element.each(function() {
    let $this = $(this),
        $plus = $this.find('.js-plus'),
        $minus = $this.find('.js-minus'),
        $input = $this.find('input'),
        val = +$input.val();
    
    check();
    $plus.on('click', function() {
      val++;
      check();
    })
    $minus.on('click', function() {
      val--;
      check();
    })
    $input.on('change input', function() {
      setTimeout(function() {
        val = +$input.val();
        check();
      },100)
    })

    function check() {
      if(val<1 || val==1) {
        val=1;
        $minus.addClass('disabled');
      } else {
        $minus.removeClass('disabled');
      }
      $input.val(val);
    }
  })
}

function stagesToggle() {
  let $toggle = $('[data-stage-toggle]'), 
      $stages = $('[data-stage]'),
      stage = $('.active[data-stage-toggle]').length>0?$('.active[data-stage-toggle]').attr('data-stage-toggle'):'all';


  $toggle.on('click', function(event) {
    event.preventDefault();
    stage = $(this).attr('data-stage-toggle');
    check()
  })

  check();

  function check() {
    $toggle.removeClass('active').closest(`[data-stage-toggle='${stage}']`).addClass('active');
    if(stage=='all') {
      $stages.addClass('active');
    } else {
      $stages.each(function() {
        let attr = $(this).attr('data-stage');
        if(attr==stage) {
          $(this).addClass('active');
        } else {
          $(this).removeClass('active');
        }
      })
    }
  }
}

function diagram() {
  let $parent = $('.brigade-diagram__circle');

  function toRadians(value) {
    return value * (Math.PI / 180);
  }

  if($parent.length) {
    let $circle = $parent.find('.brigade-diagram__circle-item_style-2 circle'),
        percent = parseInt($parent.attr('data-percent')),
        $info1 = $('.brigade-diagram__info_style-1'),
        $info2 = $('.brigade-diagram__info_style-2'),
        radius = ($parent.height() - 30)/2,
        deg2 = 90-((360/100*percent)/2),
        deg1 = (360-deg2),
        rad2 = toRadians(deg2),
        rad1 = toRadians(deg1),
        w = $circle[0].getTotalLength();

    

    $circle.css('stroke-dasharray', w);
    $circle.css('stroke-dashoffset', w - (w/100*percent));

    let x1 = radius*Math.cos(rad1),
        y1 = radius*Math.sin(rad1),
        x2 = radius*Math.cos(rad2),
        y2 = radius*Math.sin(rad2);

    $info1.css({
      'transform': `translate(${-x1}px, ${-y1}px)`,
    })
    $info2.css({
      'transform': `translate(${x2}px, ${-y2}px)`,
    })
  }
}

function jsRange() {
  let $range = $('.filter-range');

  $range.each(function() {
    let $this = $(this),  
        $rangeItem = $this.find('.js-range'),
        $inputFrom = $this.find(".filter-range__input-from"),
        $inputTo = $this.find(".filter-range__input-to"),
        instance,
        min = +$rangeItem.attr('data-min'),
        max = +$rangeItem.attr('data-max'),
        from, to;

    $rangeItem.ionRangeSlider({
      skin: "round",
      type: "double",
      min: min,
      max: max,
      from: min,
      to: max,
      onStart: updateInputs,
      onChange: updateInputs,
      onFinish: updateInputs
    });
    instance = $rangeItem.data("ionRangeSlider");
    
    function updateInputs (data) {
        from = data.from;
        to = data.to;
    
        $inputFrom.prop("value", from);
        $inputTo.prop("value", to);
    }
    
    $inputFrom.on("change", function () {
        var val = $(this).prop("value");
    
        // validate
        if (val < min) {
            val = min;
        } else if (val > to) {
            val = to;
        }
    
        instance.update({
            from: val
        });
    
        $(this).prop("value", val);
    
    });
    
    $inputTo.on("change", function () {
        var val = $(this).prop("value");
    
        // validate
        if (val < from) {
          val = from;
        } else if (val > max) {
          val = max;
        }
    
        instance.update({
            to: val
        });
        $(this).prop("value", val);
    });

  })
}

function gridToggle() {
  let $container = $('.catalogue-blocks'),
      $btn = $('.line-sorting__view-toggle');

  $btn.on('click', function() {
    if($(this).hasClass('line-sorting__view-toggle_row')) {
      $container.addClass('catalogue-blocks_row');
      console.log('+')
    } else {
      $container.removeClass('catalogue-blocks_row');
    }
    check();
  })

  function check() {
    $btn.removeClass('active');
    if($container.hasClass('catalogue-blocks_row')) {
      $('.line-sorting__view-toggle_row').addClass('active');
    } else {
      $('.line-sorting__view-toggle_grid').addClass('active');
    }
  }

  check();
}