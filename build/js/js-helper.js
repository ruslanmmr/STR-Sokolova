"use strict";

$(document).ready(function () {
  var $toggle = $('.js-helper-module__trigger '),
      $block = $('.js-helper-module'),
      $citytoggle = $('.js-helper-module__city-toggle');
  $toggle.on('click', function () {
    $block.toggleClass('active');
  });
  $citytoggle.on('click', function () {
    $('.city-question-popup').addClass('active');
  });
});