lazySizes.cfg.init = false;
customScroll();

$(document).ready(function(){
  hoverTouchEvents();
  navigation();
  homeBanner();
  inputs();
  search();
  popup.init();
  //обработать изображения после инициализации слайдеров
  setTimeout(()=>{
    lazy();
  },500)
})


const brakepoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1280
}


//hover/touch custom events
function hoverTouchEvents() {
  $(document).on('mouseenter mouseleave touchstart touchend mousedown mouseup contextmenu', 'a[class],button,label,input,textarea,tr,.js-touch-hover', function(event) {
    let $target = $(this);
    //mobile events
    if(!device.desktop()) {
      if(event.type=='touchstart') {
        $target.addClass('touch');
      } 
      else if(event.type=='touchend' || event.type=='contextmenu') {
        $target.removeClass('touch');
      }
    } 
    //desktop events
    else {
      if(event.type=='mouseenter') {
        $target.addClass('hover');
      } 
      else if(event.type=='mousedown') {
        $target.addClass('mousedown');
      } 
      else if(event.type=='mouseup') {
        $target.removeClass('mousedown');
      } 
      else {
        $target.removeClass('hover');
        $target.removeClass('mousedown');
      }
    }  
  })
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
      e.target.style.backgroundImage = 'url(' + bg + ')';
    }
  });
  lazySizes.init();
}

function navigation() {
  let flag;
  
  function checkPosition() {
    let $buttons = $('.header__buttons-group'),
        $mobileContainer = $('.header__top .container'),
        $desktopContainer = $('.header__bottom .container');

    if($(window).width()<brakepoints.md && !flag) {
      $buttons.appendTo($mobileContainer);
      flag = true;
    } 
    else if($(window).width()>=brakepoints.md && flag) {
      $buttons.appendTo($desktopContainer);
      flag = false;
    }
  }

  checkPosition();
  $(window).on('resize', function() {
    checkPosition();
  })
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
        console.log('++')
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

function homeBanner() {
  let $slider = $('.home-banner');

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
    console.log('check')
    $input.each(function() {
      let value = $(this).val();
      if(value=='') {
        $(this).removeClass('filled');
      } else {
        $(this).addClass('filled');
      }
    })
  }
  check();
      
  let namspaces = {
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

      console.log(resault)

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
        console.log('submit!');
        $inputs.val('').trigger('change');
        popup.open($('#succes'));
      }
    })

  })
}

function search() {
  let $parent = $('.header-search'),
      $input = $parent.find('.header-search__input'),
      $content = $parent.find('.header-search__content'),
      focus = false,
      mouseenter = false;

  $input.on('input', function() {
    let val = $(this).val();
    if(val!=='') {
      $parent.addClass('active').addClass('active-content');
    } else {
      $parent.removeClass('active').removeClass('active-content');
    }
  })

  $content.on('mouseenter mouseleave', function(event) {
    if(event.type=='mouseenter') {
      mouseenter=true;
    } else {
      mouseenter=false;
      if(!focus) {
        $parent.removeClass('active-content');
      }
    }
  })

  $input.on('blur focus input', function(event) {
    if(event.type=='blur') {
      focus = false;
      if(!mouseenter) {
        $parent.removeClass('active-content');
      }
    } else if(event.type=='focus' || event.type=='input') {
      focus = true;
      let val = $(this).val();
      if(val!=='') {
        $parent.addClass('active').addClass('active-content');
      } else {
        $parent.removeClass('active').removeClass('active-content');
      }
    }
  })

}

function customScroll() {
  let $containers = document.querySelectorAll('.scrollbar');
  $containers.forEach(($target)=>{
    let $parent = $($target),
        $content = $parent.find('.scrollbar__content'),
        simpleBar = new SimpleBar($target);
    
    simpleBar.getScrollElement().addEventListener('scroll', function() {
      gradientCheck();
    });
    gradientCheck();
    
    function gradientCheck() {
      let scrollHeight = $content.outerHeight() - $parent.outerHeight(),
          scroll = $parent.offset().top - $content.offset().top;

      if(scroll > 0) {
        $parent.removeClass('scrollbar_start')
      } else {
        $parent.addClass('scrollbar_start')
      }
      if(scroll < scrollHeight) {
        $parent.removeClass('scrollbar_end')
      } else {
        $parent.addClass('scrollbar_end')
      }
    }

  })
}

