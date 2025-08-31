import "../../assets/less/main.less";

(function ($) {
  "use strict";

    const initHeroSlider = () => {
    $(".hero__slider").slick({
      arrows: true,
      prevArrow: `<button class="hero__arrow hero__arrow--prev" aria-label="Poprzedni slajd"><svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="35.5" y="35.5" width="35" height="35" rx="17.5" transform="rotate(-180 35.5 35.5)" stroke="white"/>
<path d="M16.7005 24L17.4354 23.2651L12.01 17.8396L17.4354 12.4141L16.7005 11.6792L10.5401 17.8396L16.7005 24Z" fill="white"/>
<path d="M26 17.3192L11.2663 17.3192L11.2663 18.3592L26 18.3592L26 17.3192Z" fill="white"/>
</svg>
</button>`,
      nextArrow: `<button class="hero__arrow hero__arrow--next" aria-label="Następny slajd"><svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="35" height="35" rx="17.5" stroke="white"/>
<path d="M19.2995 12L18.5646 12.7349L23.99 18.1604L18.5646 23.5859L19.2995 24.3208L25.4599 18.1604L19.2995 12Z" fill="white"/>
<path d="M10 18.6808L24.7337 18.6808L24.7337 17.6408L10 17.6408L10 18.6808Z" fill="white"/>
</svg>
</button>`,
      dots: true,
      autoplay: true,
      autoplaySpeed: 4500,
      pauseOnHover: false,
      adaptiveHeight: false,
      responsive: [
        {
          breakpoint: 576,
          settings: {
             arrows: false,
          },
        },
      ],
    });
  };

  const initProductsSlider = () => {
    $(".products__slider").slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: true,
      dots: true,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 3 } },
        { breakpoint: 992, settings: { slidesToShow: 2 } },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            centerMode: false,
          },
        },
      ],
    });
  };

  const initProductCards = () => {
    const $products = $(".products__slider .product, .search__results .product");
    if ($products.length === 0) return;

    $products.each(function () {
      const $card = $(this);
      // Promo layout based on badge
      const isPromo = $card.find('.product__badges-item--red').length > 0;
      if (isPromo) {
        $card.addClass('product--promo');
        const $body = $card.find('.product__body');
        if ($body.length) {
          $body.find('.product__price').remove();
          const $priceRow = $('<div>', { class: 'product__price-row' });
          const $newPrice = $('<span>', { class: 'product__price-new', text: '350,10zł' });
          const $oldPrice = $('<span>', { class: 'product__price-old', text: '399,99zł' });
          $priceRow.append($newPrice, ' ', $oldPrice);
          const $note = $('<div>', {
            class: 'product__note',
            text: 'Najniższa cena z 30 dni przed obniżką: 399,99zł',
          });
          $body.append($priceRow, $note);
        }
      }
    });
  };

  function refreshBodyLock() {
    const anyOpen =
      $("#search.is-open, #cart.is-open, #mobileMenu.is-open").length > 0;
    $("body").toggleClass("is-locked", anyOpen);
  }

  // Accessibility: focus trapping helpers
  const getFocusableElements = ($root) =>
    $root
      .find(
        'a[href],area[href],input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),iframe,object,embed,[contenteditable],[tabindex]:not([tabindex="-1"])'
      )
      .filter(":visible");

  const setupFocusTrap = ($root) => {
    const previousActive = document.activeElement;
    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;
      
      const $focusables = getFocusableElements($root);

      if ($focusables.length === 0) {
        e.preventDefault();
        const rootEl = $root.get(0); 
        if (rootEl) {
          $root.attr("tabindex", "-1");
          try {
            rootEl.focus({ preventScroll: true });
          } catch (_) {
            rootEl.focus();
          }
        }
        return;
      }

      const first = $focusables.get(0);
      const last = $focusables.get($focusables.length - 1);
      const active = document.activeElement;
      const containsActive = $root.has(active).length > 0;

      if (e.shiftKey) {
        if (!containsActive || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (!containsActive || active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    $(document).on("keydown", onKeyDown);

    return function teardown() {
      $(document).off("keydown", onKeyDown);

      if ($root.attr("tabindex") === "-1") {
        $root.removeAttr("tabindex");
      }
      
      if (previousActive && typeof previousActive.focus === "function") {
        try {
          previousActive.focus({ preventScroll: true });
        } catch (_) {
          previousActive.focus();
        }
      }
    };
  };

  const initCartDrawer = () => {
    const $cart = $("#cart");
    if ($cart.length === 0) return;
    const $open = $("#btn-cart, #btn-mobile-cart");
    const $close = $cart.find(".cart__close");
    const $backdrop = $cart.find(".cart__backdrop");
    let teardownFocusTrap = null;

    function open() {
      $cart.addClass("is-open").attr("aria-hidden", "false");
      refreshBodyLock();
      setTimeout(function () {
        const el = $close.get(0);
        if (el && typeof el.focus === "function") {
          try {
            el.focus({ preventScroll: true });
          } catch (_) {
            el.focus();
          }
        }
        if (teardownFocusTrap) {
          teardownFocusTrap();
        }
        teardownFocusTrap = setupFocusTrap($cart);
      }, 50);
    }

    function close() {
      $cart.removeClass("is-open").attr("aria-hidden", "true");
      if (teardownFocusTrap) {
        teardownFocusTrap();
        teardownFocusTrap = null;
      }
      refreshBodyLock();
    }

    $open.on("click", function (e) {
      e.preventDefault();
      open();
    });
    $close.on("click", function (e) {
      e.preventDefault();
      close();
    });
    $backdrop.on("click", function () {
      close();
    });

    $cart.on("click", ".cart__remove", function (e) {
      e.preventDefault();
      $(this).closest(".cart__item").remove();
      recalc();
    });

    $(document).on("keydown", function (e) {
      if (e.key === "Escape" && $cart.hasClass("is-open")) close();
    });
  };

  const initMobileMenu = () => {
    const $menu = $("#mobileMenu");
    const $btn = $("#btn-menu");

    if ($menu.length === 0 || $btn.length === 0) return;

    const $close = $menu.find(".mobile-menu__close");
    const $back = $menu.find(".mobile-menu__back");
    const $heading = $menu.find(".mobile-menu__heading");
    const $rootView = $menu.find('#mobileMenuRoot');
    const $catsView = $menu.find('#mobileMenuCats');
    const $subcatsView = $menu.find('#mobileMenuSubcats');
    const $views = {
      root: $menu.find(".mobile-menu__view--root"),
      cats: $menu.find(".mobile-menu__view--cats"),
      subcats: $menu.find(".mobile-menu__view--subcats"),
    };

    let stack = [];
    let teardownFocusTrap = null;

    function setAriaForView($view, isActive) {
      $view.attr('aria-hidden', isActive ? 'false' : 'true');
      if (isActive) $view.removeAttr('hidden');
      else $view.attr('hidden', '');
    }

    function showView(name) {
      $menu.find(".mobile-menu__view").removeClass("is-active");
      if ($views[name]) $views[name].addClass("is-active");
      // aria-hidden/hidden management
      setAriaForView($rootView, name === 'root');
      setAriaForView($catsView, name === 'cats');
      setAriaForView($subcatsView, name === 'subcats');
      if (name === "root") {
        $back.addClass("d-none");
        if ($heading.length) $heading.text("Menu").focus();
        // collapse any expanded triggers
        $menu.find('.mobile-menu__link[aria-expanded="true"]').attr('aria-expanded','false');
      } else if (name === "cats") {
        $back.removeClass("d-none");
        if ($heading.length) $heading.text("Damskie buty skórzane").focus();
        $menu.find('.mobile-menu__link[aria-controls="mobileMenuCats"]').attr('aria-expanded','true');
      } else if (name === "subcats") {
        $back.removeClass("d-none");
        $menu.find('.mobile-menu__link[aria-controls="mobileMenuSubcats"]').attr('aria-expanded','true');
      }
    }

    function open() {
      $menu.addClass("is-open").attr("aria-hidden", "false");
      stack = ["root"];

      showView("root");
      refreshBodyLock();

      setTimeout(function () {
        const el = $close.get(0) || $menu.get(0);
        if (el && typeof el.focus === "function") {
          try {
            el.focus({ preventScroll: true });
          } catch (_) {
            el.focus();
          }
        }
        if (teardownFocusTrap) {
          teardownFocusTrap();
        }
        teardownFocusTrap = setupFocusTrap($menu);
      }, 50);
    }

    function close() {
      $menu.removeClass("is-open").attr("aria-hidden", "true");

      if (teardownFocusTrap) {
        teardownFocusTrap();
        teardownFocusTrap = null;
      }

      refreshBodyLock();
    }

    $btn.on("click", function (e) {
      e.preventDefault();
      open();
    });

    $close.on("click", function (e) {
      e.preventDefault();
      close();
    });

    $menu.find(".mobile-menu__backdrop").on("click", function () {
      close();
    });

    // Forward navigation
    $menu.on("click", ".mobile-menu__link[data-view]", function () {
      var v = $(this).data("view");
      if (!v) return;
      if (v === "cats") {
        stack.push("cats");
        showView("cats");
        return;
      }
      if (v === "subcats") {
        const cat = $(this).data("cat");
        const title = $(this).data("title") || $(this).text().trim();
        const $subs = $views.subcats.find(".mobile-menu__subcats");
        $subs.removeClass("is-active");
        if (cat) {
          $views.subcats
            .find('.mobile-menu__subcats[data-cat="' + cat + '"]')
            .addClass("is-active");
        }
        stack.push("subcats");
        showView("subcats");
        if ($heading.length && title) $heading.text(title).focus();
        return;
      }
    });

    // Back behavior
    $back.on("click", function () {
      if (stack.length > 1) {
        stack.pop();
        showView(stack[stack.length - 1]);
      } else {
        close();
      }
    });

    $(document).on("keydown", function (e) {
      if (e.key === "Escape" && $menu.hasClass("is-open")) close();
    });
  };

  const initMegaMenu = () => {
    // Hover on desktop, click handled by Bootstrap 5 on mobile
    const $mega = $(".dropdown.mega");

    if (window.matchMedia("(min-width: 992px)").matches) {
      $mega
        .on("mouseenter", function () {
          const $dd = $(this);

          $dd.addClass("show");
          $dd
            .find("> .dropdown-toggle")
            .attr("aria-expanded", "true")
            .addClass("show");
          $dd.find("> .dropdown-menu").addClass("show");
        })
        .on("mouseleave", function () {
          const $dd = $(this);

          $dd.removeClass("show");
          $dd
            .find("> .dropdown-toggle")
            .attr("aria-expanded", "false")
            .removeClass("show");
          $dd.find("> .dropdown-menu").removeClass("show");
        });
    }

    // Persist selected panel while moving the mouse to subcategories
    $mega.on("mouseenter focusin", ".mega__cats-item", function () {
      const $item = $(this);
      const cat = $item.data("cat");
      if (!cat) return;

      // Toggle active state on category items
      $item
        .addClass("mega__cats-item--active")
        .siblings(".mega__cats-item")
        .removeClass("mega__cats-item--active");

      // Switch visible panel to match current category
      const $content = $item.closest(".mega__content");

      if ($content.length === 0) return;

      const $panels = $content.find(".mega__panel");

      $panels.removeClass("is-active");
      $panels.filter('[data-cat="' + cat + '"]').addClass("is-active");
    });
  };

  const initSearchOverlay = () => {
    const $search = $("#search");
    if ($search.length === 0) return;
    const $open = $("#btn-search");
    const $close = $search.find(".search__close");
    const $backdrop = $search.find(".search__backdrop");
    const $input = $search.find(".search__input");
    const $desktopForm = $(".search-form").not(".search-form--mobile");
    let teardownFocusTrap = null;

    function open() {
      $search.addClass("is-open").attr("aria-hidden", "false");
      refreshBodyLock();
      setTimeout(function () {
        const el = $input.get(0);
        if (el && typeof el.focus === "function") {
          try {
            el.focus({ preventScroll: true });
          } catch (e) {
            el.focus();
          }
        }
        if (teardownFocusTrap) {
          teardownFocusTrap();
        }
        teardownFocusTrap = setupFocusTrap($search);
      }, 50);
    }

    function close() {
      $search.removeClass("is-open is-closing").attr("aria-hidden", "true");
      if (teardownFocusTrap) {
        teardownFocusTrap();
        teardownFocusTrap = null;
      }
      refreshBodyLock();
    }

    $open.on("click", function (e) {
      e.preventDefault();
      open();
    });
    // Desktop: clicking the readonly input or button opens overlay
    $desktopForm.on("click", function (e) {
      e.preventDefault();
      open();
    });
    $desktopForm.on("submit", function (e) {
      e.preventDefault();
      open();
    });
    $close.on("click", function (e) {
      e.preventDefault();
      close();
    });
    $backdrop.on("click", function () {
      close();
    });

    $(document).on("keydown", function (e) {
      if (e.key === "Escape" && $search.hasClass("is-open")) close();
    });
  };

    const initFooterAccordion = () => {
    const $footer = $(".footer");
    if ($footer.length === 0) return;

    const mq = window.matchMedia("(max-width: 576px)");

    function setup() {
      // Reset state
      $footer.find(".footer__nav").removeClass("is-open");
      $footer.find(".footer__nav > ul").attr("style", "");
      // If mobile, collapse by default
      if (mq.matches) {
        $footer.find(".footer__nav").each(function () {
          const $section = $(this);
          const $list = $section.children("ul");
          $list.hide();
          $section.removeClass("is-open");
        });
      } else {
        // Desktop always expanded
        $footer.find(".footer__nav > ul").show();
      }
    }

    setup();

    // Toggle on click when mobile
    $footer.on("click", ".footer__heading", function () {
      if (!mq.matches) return; // only mobile
      const $section = $(this).closest(".footer__nav");
      const $list = $section.children("ul");
      const isOpen = $section.hasClass("is-open");
      $section.toggleClass("is-open", !isOpen);
      if (isOpen) {
        $list.slideUp(180);
        $(this).attr("aria-expanded", "false");
      } else {
        $list.slideDown(180);
        $(this).attr("aria-expanded", "true");
      }
    });

    // Re-evaluate on resize/orientation
    $(window).on("resize", function () {
      setup();
    });
  }; 

  $(function () {
    initHeroSlider();
    initProductCards();
    initMobileMenu();
    initCartDrawer();
    initProductsSlider();
    initMegaMenu();
    initSearchOverlay();
    initFooterAccordion();
  });
})(jQuery);
