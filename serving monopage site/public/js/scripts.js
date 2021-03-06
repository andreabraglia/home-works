/*!
    * Start Bootstrap - Grayscale v6.0.3 (https://startbootstrap.com/theme/grayscale)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
    */
(function ($) {
  "use strict" // Start of use strict

  // Smooth scrolling using jQuery easing
  $("a.js-scroll-trigger[href*=\"#\"]:not([href=\"#\"])").click(function () {
    if (
      location.pathname.replace(/^\//, "") ==
                this.pathname.replace(/^\//, "") &&
            location.hostname == this.hostname
    ) {
      var target = $(this.hash)
      target = target.length
        ? target
        : $("[name=" + this.hash.slice(1) + "]")
      if (target.length) {
        $("html, body").animate(
          {
            scrollTop: target.offset().top - 70
          },
          1000,
          "easeInOutExpo"
        )
        return false
      }
    }
  })


})(jQuery) // End of use strict