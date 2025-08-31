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
      prevArrow: `<button class="products__arrow products__arrow--prev" aria-label="Poprzedni slajd"><svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="35.5" y="35.5" width="35" height="35" rx="17.5" transform="rotate(-180 35.5 35.5)" stroke="white"/>
<path d="M16.7005 24L17.4354 23.2651L12.01 17.8396L17.4354 12.4141L16.7005 11.6792L10.5401 17.8396L16.7005 24Z" fill="white"/>
<path d="M26 17.3192L11.2663 17.3192L11.2663 18.3592L26 18.3592L26 17.3192Z" fill="white"/>
</svg>
</button>`,
      nextArrow: `<button class="products__arrow products__arrow--next" aria-label="Następny slajd"><svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="35" height="35" rx="17.5" stroke="white"/>
<path d="M19.2995 12L18.5646 12.7349L23.99 18.1604L18.5646 23.5859L19.2995 24.3208L25.4599 18.1604L19.2995 12Z" fill="white"/>
<path d="M10 18.6808L24.7337 18.6808L24.7337 17.6408L10 17.6408L10 18.6808Z" fill="white"/>
</svg>
</button>`,
      dots: true,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 3, arrows: true } },
        { breakpoint: 992, settings: { slidesToShow: 2, arrows: true } },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            centerMode: false,
            arrows: false,
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

  const initProductsTabs = () => {
    const $section = $(".products");
    if ($section.length === 0) return;
    const $tabs = $section.find('.products__tab');

    $section.on('click', '.products__tab', function () {
      const $tab = $(this);
      if ($tab.hasClass('is-active')) return;
      $tabs.removeClass('is-active').attr('aria-selected', 'false');
      $tab.addClass('is-active').attr('aria-selected', 'true');
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

  const initNewsletterValidation = () => {
    const $form = $(".newsletter-form");
    if ($form.length === 0) return;
    const $group = $form.find('.newsletter-form__group');
    const $input = $form.find('.newsletter-form__input');

    // Inject tooltip element if missing
    if ($group.find('.newsletter-form__error').length === 0) {
      const $error = $('<div>', { class: 'newsletter-form__error', html: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_855_395)">
<path d="M13.7881 10.9252L8.3534 1.51203C8.07091 1.02274 7.56494 0.730652 6.99999 0.730652C6.43504 0.730652 5.92907 1.02277 5.64658 1.51203L0.211867 10.9252C-0.0706222 11.4145 -0.0706222 11.9987 0.211867 12.488C0.494355 12.9773 1.0003 13.2694 1.56528 13.2694H12.4347C12.9997 13.2694 13.5057 12.9773 13.7881 12.488C14.0706 11.9987 14.0706 11.4145 13.7881 10.9252ZM13.0772 12.0775C12.9431 12.3098 12.7029 12.4485 12.4347 12.4485H1.56528C1.29709 12.4485 1.0569 12.3098 0.922806 12.0775C0.788712 11.8453 0.788712 11.5679 0.922806 11.3357L6.35752 1.92246C6.49164 1.6902 6.7318 1.55154 6.99999 1.55154C7.26818 1.55154 7.50837 1.6902 7.64246 1.92246L13.0772 11.3357C13.2113 11.5679 13.2113 11.8453 13.0772 12.0775Z" fill="#C82020"/>
<path d="M6.99998 9.71204C6.69822 9.71204 6.4527 9.95756 6.4527 10.2593C6.4527 10.5611 6.69822 10.8066 6.99998 10.8066C7.30175 10.8066 7.54727 10.5611 7.54727 10.2593C7.54727 9.95756 7.30175 9.71204 6.99998 9.71204Z" fill="#C82020"/>
<path d="M7.41042 4.64966H6.58951V8.89109H7.41042V4.64966Z" fill="#C82020"/>
</g>
<defs>
<clipPath id="clip0_855_395">
<rect width="14" height="14" fill="white"/>
</clipPath>
</defs>
</svg>
 <span>Wprowadź poprawny adres email</span>` });
      $group.prepend($error);
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());
    }

    $form.on('submit', function(e){
      const value = $input.val();
      if (!isValidEmail(value)) {
        e.preventDefault();
        $group.addClass('is-invalid');
        $input.attr('aria-invalid', 'true');
      } else {
        $group.removeClass('is-invalid');
        $input.removeAttr('aria-invalid');
      }
    });

    $input.on('input blur', function(){
      const value = $input.val();
      if (isValidEmail(value)) {
        $group.removeClass('is-invalid');
        $input.removeAttr('aria-invalid');
      }
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
    initProductsTabs();
    initMobileMenu();
    initCartDrawer();
    initProductsSlider();
    initMegaMenu();
    initSearchOverlay();
    initFooterAccordion();
    initNewsletterValidation();
  });
})(jQuery);
