jQuery(function($) {
  
  // Theme specific scripts
  var Brisk = {
    // Anchored + Shrinking header
    header: function(header) {
      $(header).waypoint('sticky');  
      $('body').waypoint(function() {
        $(header).toggleClass('minimize');
      }, { offset: -5 });
    },
    // Mobile Accordion
    accordion: function(menu) {
      $(menu).each(function(){
        var submenu = $(this);
        submenu.addClass("accordion");
        submenu.prepend(submenu.prev("a.wsite-menu-item"));
        submenu.prepend('<span></span>');
        submenu.children('span').click(function(){
          submenu.toggleClass('open');
        });
      });      
    },
    // Mobile Cart
    cartRefresh: function() {
      $("#mobile-cart span").text($("#wsite-nav-cart-num").text());
      $("#mobile-cart").addClass("highlight");
      setTimeout(function(){
        $("#mobile-cart").attr("href", $("#wsite-com-minicart-checkout-button").attr("href")).removeClass("highlight");
      }, 800);
    },
    cartInit: function() {
      if ($("#wsite-nav-cart-a").length) {
        $("#header").append('<a id="mobile-cart" href="#"><span>0</span></a>').addClass("commerce");
        $("#wsite-nav-cart-a").on('DOMSubtreeModified propertychange', function() {
          Brisk.cartRefresh();
        });
      }      
    },
    // Storefront sidebar dropdown
    storeSidebar: function(){
      var sidebar = $('.wsite-com-sidebar'),
          categories =  $("#wsite-com-hierarchy");

      sidebar.click(function(){
        sidebar.hasClass('sidebar-expanded') ? null : sidebar.addClass('sidebar-expanded');
      });

      categories.prepend('<a id="close" href="#">CLOSE</a>');
      $('#close').click(function(e){
        e.preventDefault();
        setTimeout(function() {sidebar.removeClass('sidebar-expanded');}, 50);
      });
    },
    // Form Styling
    formstyle: function(){
      // Sublabels into placeholders
      $(".wsite-form-sublabel").each(function(){
        var sublabel = $(this).text();
        $(this).prev('input').attr("placeholder", sublabel);
      });
    },
    // Side Swiping Galleries
    swipeGallery: function(){
      setTimeout(function(){
        var touchGallery = document.getElementsByClassName("fancybox-wrap")[0];
        var mc = new Hammer(touchGallery);
        mc.on("panleft panright", function(ev) {
          if (ev.type == "panleft") {
            $("a.fancybox-next").trigger("click");
          }
          else if (ev.type == "panright") {
            $("a.fancybox-prev").trigger("click");
          }
          Brisk.swipeGallery();
        });
      }, 500);
    },
    swipeInit: function(){
      if ('ontouchstart' in window) {
        $("body").on( "click", "a.w-fancybox", function(){
          Brisk.swipeGallery();
        });
      }
    },
    interval: function(condition, action, duration, limit) {
      var counter = 0;
      var looper = setInterval(function(){
        if (counter >= limit || Brisk.checkElement(condition)) {
          clearInterval(looper);
        } else {
          action();
          counter++;
        }
      }, duration);
    },
    checkElement: function(selector) {
      return $(selector).length;
    },
    moveMinicart: function() {
      var move = $("#wsite-mini-cart").detach();
      $("#header-wrap").append(move);
    },
    moveFlyout: function() {
      var move = $("#wsite-menus").detach();
      $("#header-wrap").append(move);
    },
    moveLogin: function() {
      var login = $('#member-login').detach();
      $("#mobile-nav .wsite-menu-default li:last-child").after(login);
    }
  }

  $(document).ready(function() {
    $('body').addClass("postload");
     // Timeout for benefit of iframe editor 
    setTimeout(function(){
      Brisk.accordion('#mobile-nav .wsite-menu-item-wrap .wsite-menu-wrap');
      Brisk.header('body:not(.wsite-native-mobile-editor) #header-wrap');
    }, 600);
    Brisk.formstyle();
    Brisk.swipeInit();
    Brisk.cartInit();
    Brisk.storeSidebar();
    Brisk.interval("#header-wrap #wsite-mini-cart", Brisk.moveMinicart, 800, 5);
    Brisk.interval("#header-wrap #wsite-menus", Brisk.moveFlyout, 800, 5);
    if ($(window).width() <= 992) {
      Brisk.interval("#mobile-nav #member-login", Brisk.moveLogin, 800, 5);
    }
  });

});
