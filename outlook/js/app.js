OFI_2018_OUTLOOK.namespace('app');

OFI_2018_OUTLOOK.app = (function($) {
  var $WIN,
    $ROOT,
    $HTML,
    $BODY,
    $HEADER,
    $FOOTER,
    $CONTENT,
    $HERO_IMG,
    $NAV,
    $NAV_DOWNLOAD_CONTAINER,
    $NAV_LANG_OPTION,
    $MODAL,
    $MODAL_CONTENT,
    $INSTRUCTIONS;

  var myURL,
    DOMAIN,
    CHANNEL,
    CODE_PATH,
    deeplink,
    codeLoaded = false,
    isLocal = false;

  var init = function() {
    cache_dom();

    myURL = window.top.location;
    DOMAIN = window.top.location.protocol + '//' + window.top.location.hostname + (window.top.location.port ? ':' + window.top.location.port : '') + "/";
    CHANNEL = window.top.location.pathname.split('/')[1];
    CODE_PATH = "";

    if (CHANNEL == "ofi-web") isLocal = true;

    deeplink = util.get_query_value("section", myURL);

    $HTML.addClass('noResize');
    $HTML.addClass('noTouch');
    $BODY.addClass(CHANNEL);

    user_agent.init();
    w_resize.init();
    w_scroll.init();

    nav.init();
    landing.init();
    map.init();
    regions.init();
    assets.init();
    instructions.init();

    if (user_agent.is_IE() !== false) {
      $HTML.addClass('ie');
    }

    setTimeout(function() {
      codeLoaded = true;

      if (deeplink) {

        var id = nav.region_name.indexOf(deeplink);

        landing.$cont.addClass('skip-animation');

        if (id > -1) {
          // regions.id = id;

          // regions.$nav_btns.removeClass('on');
          // regions.$nav_btns.eq(id).addClass('on');
          // regions.expand(id);

          // nav.anchor_anim(2); //1000);

          if (nav.id !== 2) {
            if (w_resize.height > 580) {
              nav.$regional_nav_sect.addClass('quick-open');

              setTimeout(function() {
                nav.anchor_anim(2);
              }, 500);

              setTimeout(function() {
                regions.open_region(id);
              }, 1700);
            } else {
              // w_scroll.sticky_nav_disable = true;
              regions.id = id;

              regions.expand(id);

              setTimeout(function() {
                nav.anchor_anim(2);
              }, 250);

              $BODY.addClass('no-scroll');
              $MODAL.addClass('on');
              $MODAL.attr('data-active-region', id);
              $MODAL.css('transition-delay', '0s');
              $MODAL_CONTENT.scrollTop(0);
            }
          } else {
            if (w_resize.height > 580) {
              nav.$regional_nav_sect.addClass('quick-open');
              setTimeout(function() {
                regions.open_region(id);
              }, 500);
            } else {
              regions.id = id;

              regions.expand(id);

              setTimeout(function() {
                nav.anchor_anim(2);
              }, 250);

              $BODY.addClass('no-scroll');
              $MODAL.addClass('on');
              $MODAL.attr('data-active-region', id);
              $MODAL.css('transition-delay', '0s');
              $MODAL_CONTENT.scrollTop(0);
            }
          }

          // setTimeout(function() { regions.open_region(id); }, 700);
          // regions.quick_open_region(id);
        }

        if (deeplink == "global-heatmap") {
          nav.anchor_anim(1, nav.section_pos[1] + 30); //500);
          nav.set_section_pos();
        }

        if (deeplink == "asset-allocation-views") {
          nav.anchor_anim(3); //750);
          nav.set_section_pos();
        }

        landing.build_in("no-delay");
      } else {
        // landing.build_in("no-delay");
        landing.build_in();
      }

    }, 250);
  };

  var cache_dom = function() {
    $WIN = $(window);
    $ROOT = $('html, body');
    $HTML = $('html');
    $BODY = $('body');
    $HEADER = $('header .header');
    $FOOTER = $('footer .footer');
    $CONTENT = $BODY.find('.main-section #main-content');
    $HERO_IMG = $CONTENT.find('.fixed-bg-img');
    $NAV = $BODY.find('.main-section nav#main-menu');
    $NAV_DOWNLOAD_CONTAINER = $NAV.find('.download-btn-container.international-only');
    $NAV_LANG_OPTION = $NAV_DOWNLOAD_CONTAINER.find('ul.lang-option');
    $MODAL = $BODY.find('#modal'),
    $MODAL_CONTENT = $MODAL.find('.modal-content'),
    $INSTRUCTIONS = $CONTENT.find('.sect-tooltip');
  };

  var user_agent = {
    isTouch: false,

    init: function() {
      if (navigator.appVersion.indexOf("Win") != -1) $HTML.addClass('os-win');

      if (this.is_touch_device()) {
        this.isTouch = true;
        $HTML.removeClass('noTouch');
        document.addEventListener("touchstart", function() {}, true);
      }

      if (this.is_iOS()) {
        $HTML.addClass('ios-device');
      }

      if (this.is_safari()) {
        $HTML.addClass('safari');
      }
    },

    is_touch_device: function() {
      return 'ontouchstart' in window || navigator.maxTouchPoints;
    },

    is_IE: function() {
      var ua = window.navigator.userAgent,
        msie = ua.indexOf('MSIE '),
        trident = ua.indexOf('Trident/'),
        edge = ua.indexOf('Edge/');

      if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      }

      if (trident > 0) {
        // IE 11 => return version number
        const rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      }

      if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
      }

      // other browser
      return false;
    },

    is_iOS: function() {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;

      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return true;
      } else {
        return false;
      }
    },

    is_safari: function() {
      var isSafari = false;

      if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        isSafari = true;
      }

      return isSafari;
    }
  };

  var w_resize = {
    width: 0,
    height: 0,
    m_view: false,
    time: null,
    timeout: false,
    delta: 200,

    header_h: 0,
    footer_y: 0,
    sticky_y: 0,
    $landing: null,
    $landing_nav: null,

    init: function() {
      w_resize.width = $WIN.width();
      w_resize.height = $WIN.height();
      w_resize.header_h = $HEADER.height();
      // w_resize.footer_y = $FOOTER.offset().top;

      w_resize.$landing = $CONTENT.find('section.landing'); //.head');
      w_resize.$landing_nav = $CONTENT.find('.top-navbar');
      w_resize.sticky_y = w_resize.$landing_nav.offset().top + w_resize.$landing_nav.outerHeight(); // - 57 + 15;// + 11;//
      w_resize.set_img_ratio();

      if (w_resize.width <= 639) {
        w_resize.sticky_y = w_resize.$landing.offset().top + w_resize.$landing.outerHeight() - 60;
      }

      // if ($WIN.width() < 753) w_resize.m_view = true;
      if ($WIN.width() < 723) w_resize.m_view = true;
      else w_resize.m_view = false;

      if ($WIN.height() < 781) $HTML.addClass('short-vp');
      else $HTML.removeClass('short-vp');

      if (assets.detail_box_elm && assets.detail_content_elm) {
        assets.detail_box_elm.css('height', assets.detail_content_elm.outerHeight() + 'px');
      }

      if (!user_agent.isTouch) $WIN.on('resize', this.start.bind(this));
      else $WIN.on('orientationchange', this.start.bind(this));
    },

    start: function() {
      this.time = new Date();

      var global_sect_st = nav.$global_sect.offset().top - $WIN.scrollTop(),
        regional_sect_st = nav.$regional_sect.offset().top - $WIN.scrollTop(),
        asset_sect_st = nav.$assetclass_sect.offset().top - $WIN.scrollTop(),
        scroll_btn_st = landing.$scroll_btn.offset().top - $WIN.scrollTop();

      if (w_resize.timeout === false) {
        w_resize.timeout = true;
        $HTML.removeClass('noResize');
        setTimeout(this.end, this.delta);
      }

      if (global_sect_st < scroll_btn_st) {
        landing.$scroll_btn.addClass('dark');
      } else {
        landing.$scroll_btn.removeClass('dark');
      }

      if (regional_sect_st < scroll_btn_st) {
        landing.$scroll_btn.removeClass('dark');
      }

      if (asset_sect_st < scroll_btn_st) {
        landing.$scroll_btn.addClass('fade-out');
      } else {
        landing.$scroll_btn.removeClass('fade-out');
      }
    },

    end: function() {
      if (new Date() - this.time < this.delta) {
        setTimeout(this.end, this.delta);
      } else {
        w_resize.timeout = false;
        $HTML.addClass('noResize');

        // if ($WIN.width() < 753) w_resize.m_view = true;
        if ($WIN.width() < 723) w_resize.m_view = true;
        else w_resize.m_view = false;

        if ($WIN.height() < 781) $HTML.addClass('short-vp');
        else $HTML.removeClass('short-vp');

        w_resize.width = $WIN.width();
        w_resize.height = $WIN.height();
        w_resize.header_h = $HEADER.height();
        // w_resize.footer_y = $FOOTER.offset().top;
        w_resize.sticky_y = w_resize.$landing_nav.offset().top + w_resize.$landing_nav.outerHeight(); // + 15;// + 11;//
        w_resize.set_img_ratio();

        if (w_resize.width <= 639) {
          w_resize.sticky_y = w_resize.$landing.offset().top + w_resize.$landing.outerHeight() - 60;
        }

        if (assets.detail_box_elm && assets.detail_content_elm) {
          assets.detail_box_elm.css('height', assets.detail_content_elm.outerHeight() + 'px');
        }

        video.resize();

        nav.set_section_pos();
        map.resize();

        // if (regions.intro_played[0] || regions.intro_played[1]) chart.resize();
        // if (regions.intro_played[0] || regions.intro_played[1] || regions.intro_played[2]) column.resize();
        if (column.initiated) column.resize();
      }
    },

    orig_img_w: 1792,
    orig_img_h: 1008,

    set_img_ratio: function() {
      var aspect_h = $HERO_IMG.width() * w_resize.orig_img_h / w_resize.orig_img_w,
        $hero_item = $HERO_IMG.find('img');

      if (aspect_h < $HERO_IMG.height()) $hero_item.addClass('vert');
      else $hero_item.removeClass('vert');
    }
  };

  var w_scroll = {
    lastScrollTop: 0,
    st: 0,
    hash: false,
    sticky_nav_disable: false,

    init: function() {
      this.st = $WIN.scrollTop();

      if (this.st > w_resize.sticky_y) $NAV.addClass('on'); //(w_resize.sticky_y - 10)) $NAV.addClass('on');
      else $NAV.removeClass('on');

      $WIN.on('scroll', this.start.bind(this));
      $MODAL_CONTENT.on('scroll', this.modal_scroll.bind(this));
    },

    instructions_detect: function() {
      $INSTRUCTIONS.each(function(i) {
        var elementTop = $(this).offset().top,
          elementBottom = elementTop + $(this).outerHeight(),
          viewportTop = $WIN.scrollTop(),
          viewportBottom = viewportTop + $WIN.height(),
          instructionsInView = elementBottom > $WIN.scrollTop() && elementTop < viewportBottom,
          closeTooltip = $(this).find('.close-tooltip');

        if (instructionsInView) $(this).addClass('on');

        closeTooltip.on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();

          var tooltip = $(this).parent();

          tooltip.css('display', 'none');
        });
      });
    },

    start: function() {
      regions.scroll_anim_disable = true;
      
      this.st = $WIN.scrollTop();

      this.instructions_detect();

      var global_sect_st = nav.$global_sect.offset().top - this.st,
        regional_sect_st = nav.$regional_sect.offset().top - this.st,
        asset_sect_st = nav.$assetclass_sect.offset().top - this.st,
        scroll_btn_st = landing.$scroll_btn.offset().top - this.st;

      if (this.st > 50) {
        if (landing.$start_btn) landing.$start_btn.removeClass('on');
        if (!landing.started) landing.anim_in();
      }

      if (this.st > w_resize.sticky_y && !this.sticky_nav_disable) {
        $NAV.addClass('on');
      } else {
        if (!landing.$temp_disable_scroll) $NAV.removeClass('on');
        $NAV_DOWNLOAD_CONTAINER.removeClass('on');
        $NAV_LANG_OPTION.css('height', '0');
      }

      if (global_sect_st < scroll_btn_st) {
        landing.$scroll_btn.addClass('dark');
      } else {
        landing.$scroll_btn.removeClass('dark');
      }

      if (regional_sect_st < scroll_btn_st) {
        landing.$scroll_btn.removeClass('dark');
      }

      if (asset_sect_st < scroll_btn_st) {
        landing.$scroll_btn.addClass('fade-out');
      } else {
        landing.$scroll_btn.removeClass('fade-out');
      }

      /*
            if (map.$bg && this.st > (w_resize.sticky_y - (w_resize.height * 0.5)))
            {
              var per = (this.st >= w_resize.sticky_y) ? 120 : Math.round((this.st - (w_resize.sticky_y - (w_resize.height * 0.5))) * 120 / (w_resize.height * 0.5));
              map.$bg.css('transform', 'translateY(' + (per - 120) + 'px)');

              // console.log(this.st + ", per:" + per + ", " + w_resize.sticky_y);
            }
            else
            {
              // if (map.$bg) map.$bg.css('transform', 'translateY(-120px)');
              if (map.$bg) map.$bg.removeAttr('style');
            }
      */
      assets.scroll_checker(this.st);

      if (this.st >= this.lastScrollTop) nav.set_id_by_pos(this.st, 'down');
      else nav.set_id_by_pos(this.st, 'up');

      this.lastScrollTop = this.st;

      nav.$page_nav.attr('data-active-section', nav.id);

      // console.log('scrolling: ' + this.st + ', ' + (w_resize.sticky_y - 10));
      // console.log('scrolling: ' + this.st + ', nav id:' + nav.id);
    },

    touchScrollLock: function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    },

    modal_scroll: function() {
      regions.scroll_checker(this.st);
    }
  };

  var nav = {
    $regional_sect: null,
    $regional_nav_sect: null,
    $assetclass_sect: null,

    $stat: null,
    $stat_countries: null,
    $stat_gdp: null,
    $stat_pop: null,

    // $download_btn: null,
    $assetclass_btn: null,
    $regional_btn: null,

    $page_nav: null,
    $page_nav_btns: null,
    $mobile_active_sect: null,

    id: 0,
    id_len: 4,
    section_pos: null,
    region_name: ['us', 'inter', 'em'],

    init: function() {
      nav.$global_sect = $CONTENT.find('section.map');
      nav.$regional_sect = $CONTENT.find('section.regional-nav');
      nav.$regional_nav_sect = nav.$regional_sect.find('ul.btns');
      nav.$assetclass_sect = $CONTENT.find('section#asset-class');

      nav.$stat = $NAV.find('.map ul.stats li');
      nav.$stat_countries = nav.$stat.eq(0).find('p span');
      nav.$stat_gdp = nav.$stat.eq(1).find('p span');
      nav.$stat_pop = nav.$stat.eq(2).find('p span');

      // nav.$download_btn = $NAV.find('a.download-btn');
      nav.$assetclass_btn = $NAV.find('a.asset-class-btn');
      nav.$regional_btn = $NAV.find('a.regional-view');

      nav.$page_nav = $NAV.find('ul.page-nav');
      nav.$page_nav_btns = $NAV.find('ul.page-nav li a');
      nav.$mobile_active_sect = $NAV.find('#mobile-active-sect');
      nav.$mobile_active_text = $NAV.find('#mobile-active-sect span');
      nav.$mobile_download = $NAV.find('.page-nav .mobile-download-btn');

      if (w_resize.width < 341) nav.$mobile_active_text.text('Menu');

      this.set_section_pos();
      this.set_id_by_pos($WIN.scrollTop(), 'down');

      nav.$mobile_active_sect.on('click', this.mobile_nav_toggle.bind(this));

      // nav.$download_btn.on('click', this.download_pdf.bind(this));
      // nav.$assetclass_btn.on('click', this.assetclass_link.bind(this));
      // nav.$regional_btn.on('click', this.regional_link.bind(this));

      $.each(nav.$page_nav_btns, function(i, btn) {
        if (!$(btn).parent().hasClass('mobile-download-btn')) {
          $(btn).on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // var activeSect = i + 1;

            // if (w_resize.width < 738) activeSect = i + 2;

            if (!isLocal) {
              var $this = $(e.currentTarget),
                url = $this.attr("href"),
                f_url = myURL + url,
                c_url = (String(myURL).indexOf('?')) ? String(myURL).split("?")[0] : String(myURL),
                dockedNav = ($this.parent().parent().attr('class') === 'page-nav') ? true : false;

              // OppenCore.notify({
              //   type: "ui>iframe:interaction",
              //   data: {
              //     event_name: "Anchor Link",
              //     link_text: $this.text(),
              //     link_source: $this,
              //     link_type: "button",
              //     destination_url: f_url,
              //     destination_url_clean: c_url,
              //     destination_is_new_window: "false",
              //     is_menu_docked: dockedNav
              //   }
              // });
            }

            if ($BODY.hasClass('no-scroll')) $BODY.removeClass('no-scroll');
            if ($NAV.hasClass('mobile-active')) $NAV.removeClass('mobile-active');
            if (nav.$mobile_download.hasClass('btn-fade-in')) nav.$mobile_download.removeClass('btn-fade-in');

            if (nav.$mobile_active_sect.hasClass('open')) {
              nav.$mobile_active_sect.removeClass('open');
              nav.$page_nav.slideUp();
            }

            nav.$page_nav.attr('data-active-section', i);
            nav.anchor_anim(i);
          });
        }
      });
    },

    // download_pdf: function(e) {
    //  e.preventDefault();
    //  e.stopPropagation();

    //  var $this = $(e.currentTarget),
    //    link_txt = $this.text(),
    //    url = $this.attr("href");

    //  OppenCore.notify({
    //               event_name: "Digital Asset Link",
    //               destination_is_new_window: "true",
    //               destination_url: url, 
    //               destination_url_clean: url,
    //               content_format: "digital asset",
    //               digital_asset_format: "pdf",
    //               digital_asset_url: url,
    //               link_text: link_txt,
    //               link_type: "button",
    //               trigger_metrics: true
    //           });

    //           parent.callDA(url);
    // },

    mobile_btn_fade: function() {
      nav.$mobile_download.addClass('btn-fade-in');
    },

    mobile_nav_toggle: function(e) {
      e.preventDefault();
      e.stopPropagation();

      var toggle = nav.$mobile_active_sect;

      if ($BODY.hasClass('no-scroll')) {
        $BODY.off('touchmove', w_scroll.touchScrollLock(e));
      } else {
        $BODY.on('touchmove', w_scroll.touchScrollLock(e));
      }

      $NAV.toggleClass('mobile-active');
      $BODY.toggleClass('no-scroll');
      $(toggle).toggleClass('open');
      nav.$page_nav.slideToggle();

      if (nav.$mobile_download.hasClass('btn-fade-in')) {
        nav.$mobile_download.removeClass('btn-fade-in');
      } else {
        clearTimeout(nav.mobile_btn_fade);

        setTimeout(function(){
          nav.mobile_btn_fade();
        }, 400);
      }

      if (w_resize.width > 341) {
        if ($(toggle).hasClass('open')) {
          nav.$mobile_active_text.text('Close Menu');
        } else {
          if (nav.id === 1) nav.$mobile_active_text.text('Global Landscape');
          else if (nav.id === 2) nav.$mobile_active_text.text('Global Landscape');
          else nav.$mobile_active_text.text('Asset Allocation Views');
        }
      } else {
        nav.$mobile_active_text.text('Menu');
      }
    },

    assetclass_link: function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!isLocal) {
        var $this = $(e.currentTarget),
          url = $this.attr("href"),
          f_url = myURL + url,
          c_url = (String(myURL).indexOf('?')) ? String(myURL).split("?")[0] : String(myURL),
          dockedNav = ($this.parent().attr('class') === 'top-navbar') ? false : true;

        if (c_url.indexOf('#')) c_url.split("?")[0];

        // OppenCore.notify({
        //   type: "ui>iframe:interaction",
        //   data: {
        //     event_name: "Anchor Link",
        //     link_text: $this.text(),
        //     link_source: $this,
        //     link_type: "button",
        //     destination_url: f_url,
        //     destination_url_clean: c_url,
        //     destination_is_new_window: "false",
        //     is_menu_docked: dockedNav
        //   }
        // });
      }

      nav.anchor_anim(4);
    },

    regional_link: function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!isLocal) {
        var $this = $(e.currentTarget),
          url = $this.attr("href"),
          f_url = myURL + url,
          c_url = (String(myURL).indexOf('?')) ? String(myURL).split("?")[0] : String(myURL);

        if (c_url.indexOf('#')) c_url.split("?")[0];

        // OppenCore.notify({
        //   type: "ui>iframe:interaction",
        //   data: {
        //     event_name: "Anchor Link",
        //     link_text: $this.text(),
        //     link_source: $this,
        //     link_type: "button",
        //     destination_url: f_url,
        //     destination_url_clean: c_url,
        //     destination_is_new_window: "false",
        //     is_menu_docked: "true"
        //   }
        // });
      }

      if ($BODY.is('.us, .inter, .em')) nav.anchor_anim(2);
      else nav.anchor_anim(2, Math.round(nav.$regional_sect.offset().top - 60));
    },

    set_section_pos: function() {
      nav.section_pos = [];

      var nav_offset = 60; //(w_resize.m_view) ? 60 : 60;

      nav.section_pos.push(0);
      // nav.section_pos.push(w_resize.sticky_y);
      nav.section_pos.push(Math.round(nav.$global_sect.offset().top - nav_offset));
      nav.section_pos.push(Math.round(nav.$regional_sect.offset().top - nav_offset));
      // nav.section_pos.push(Math.round(nav.$regional_sect.offset().top + nav.$regional_sect.height() - nav_offset) + 1);
      nav.section_pos.push(Math.round(nav.$assetclass_sect.offset().top - nav_offset));
    },

    set_id_by_pos: function(n, dir) {
      if (dir == 'down') {
        if (nav.id < (nav.id_len - 1) && n >= (nav.section_pos[nav.id + 1] - (w_resize.height * .25))) {
          nav.set_id(nav.id + 1);
        }
      } else {
        if (nav.id > 0 && n < (nav.section_pos[nav.id] - (w_resize.height * .25))) {
          nav.set_id(nav.id - 1);
        }
      }

      // console.log('nav.id:' + nav.id + ", dir:" + dir + ", n:" + n + " len:" + nav.id_len);

      if (codeLoaded) {
        // if (nav.id == 0) landing.anim_in();
        if (nav.id == 1) {
          if (!map.$bg_img.hasClass('on')) map.$bg_img.addClass('on');

          if (n >= (nav.section_pos[nav.id] - (w_resize.height * .25))) {
            if (map.intro_played) map.intro_end();
          }

          if (w_resize.width > 341) nav.$mobile_active_text.text('Global Landscape');
        }

        if (nav.id == 2) {
          if (w_resize.width > 341) nav.$mobile_active_text.text('Regional Views');
          nav.$regional_sect.addClass('on');
          setTimeout(function(){
            nav.$regional_sect.addClass('remove-text-delay');
          }, 1000);
        }

        if (nav.id == 3) {
          if (w_resize.width > 341) nav.$mobile_active_text.text('Asset Allocation Views');
        }

        if (nav.id == 4) {
          if (n >= (nav.section_pos[nav.id] - (w_resize.height * .75))) {
            assets.anim_in();
          }
        }
      }
    },

    set_id: function(n) {
      nav.id = n;
    },

    anchor_anim: function(n_id, f_y) {
      var y = (f_y) ? f_y : nav.section_pos[n_id],
        speed = (n_id && (Math.abs(n_id - nav.id) >= 2)) ? 1000 : 500;

      // console.log(Math.abs(n_id - nav.id));
      $ROOT.animate({
        scrollTop: y
      }, speed, 'easeInOutCubic');
    }
  };

  var landing = {

    $cont: null,
    $bg: null,
    $head: null,
    $title: null,
    $assetclass_btn: null,
    $start_btn: null,
    $scroll_btn: null,
    $download_btn: null,
    download_btn_h: 0,
    download_btn_h_lg: 0,

    started: false,

    init: function() {
      landing.$cont = $CONTENT.find('section.landing');
      landing.$bg = landing.$cont.find('.bg-container');
      landing.$head = landing.$bg.find('.head');
      landing.$title = landing.$head.find('.title');

      landing.$assetclass_btn = landing.$cont.find('a.asset-class-btn');
      landing.$start_btn = $BODY.find('span.start-btn');
      landing.$download_btn = (CHANNEL === "international") ? $BODY.find('.download-btn-container.international-only') : $BODY.find('.download-btn-container'); //landing.$cont.find('.download-btn-container');
      landing.$scroll_btn = $CONTENT.find('#scroll-btn');

      landing.$assetclass_btn.on('click', landing.asset_scroll.bind(this));
      landing.$scroll_btn.on('click', landing.scroll_down.bind(this));
      landing.$temp_disable_scroll = false;

      landing.download_btn_h = 52; // 104, 156 landing.$download_btn.find('ul.lang-option').height() + 5;
      landing.download_btn_h_lg = 208;

      if (user_agent.isTouch) landing.$download_btn.find('a.download-btn').on('click', landing.download_option.bind(this));
      else landing.$download_btn.on('mouseover mouseout', landing.download_option.bind(this));

      landing.$download_btn.find('ul.lang-option').addClass('ready');

      $HERO_IMG.addClass('img-on');
    },

    download_option: function(e) {
      e.preventDefault();
      e.stopPropagation();

      var type = e.type,
        $this, $option, $hoverHeight;

      if (type === 'click') {
        $this = $(e.currentTarget).parent(); //.parent();
        $option = $this.find('ul.lang-option');

        if ($this.hasClass('international-only')) {
          $hoverHeight = landing.download_btn_h;
        } else {
          $hoverHeight = landing.download_btn_h_lg;
        }

        if ($this.hasClass('on')) {
          $this.removeClass('on');
          $option.removeAttr('style');
        } else {
          $this.addClass('on');
          $option.css('height', $hoverHeight + 'px');
        }
      } else {
        $this = $(e.currentTarget);
        $option = $this.find('ul.lang-option');

        if (type === 'mouseover') {
          if ($this.hasClass('international-only')) {
            $hoverHeight = landing.download_btn_h;
          } else {
            $hoverHeight = landing.download_btn_h_lg;
          }

          $this.addClass('on');
          $option.css('height', $hoverHeight + 'px');
        } else if (type === 'mouseout') {
          $this.removeClass('on');
          $option.removeAttr('style');
        }
      }
    },

    asset_scroll: function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!isLocal)
      {
        var $this = $(e.currentTarget),
          url = $this.attr("href"),
          f_url = myURL + url,
          c_url = (String(myURL).indexOf('?')) ? String(myURL).split("?")[0] : String(myURL),
          dockedNav = ($this.parent().attr('class') === 'top-navbar') ? false : true;

        if (c_url.indexOf('#')) c_url.split("?")[0];

        // OppenCore.notify({
        //   type: "ui>iframe:interaction",
        //   data: {
        //     event_name: "Anchor Link",
        //     link_text: $this.text(),
        //     link_source: $this,
        //     link_type: "button",
        //     destination_url: f_url,
        //     destination_url_clean: c_url,
        //     destination_is_new_window: "false",
        //     is_menu_docked: dockedNav
        //   }
        // });
      }

      nav.anchor_anim(3);
    },

    scroll_down: function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (!isLocal) {
        var $this = $(e.currentTarget);

        // OppenCore.notify({
        //   type: "ui>iframe:interaction",
        //   data: {
        //     event_name: "Anchor Link",
        //     link_text: $this.text(),
        //     link_source: $this,
        //     link_type: "button",
        //     is_menu_docked: true
        //   }
        // });
      }

      landing.$temp_disable_scroll = true;

      setTimeout(function() {
        landing.$temp_disable_scroll = false;
      }, 500);

      setTimeout(function() {
        $NAV.addClass('on');
      }, 250);

      nav.anchor_anim(nav.id + 1);
    },

    build_in: function(param) {
      if (param === 'no-delay') {
        landing.$head.addClass('on no-delay');
        landing.anim_in();
        landing.$start_btn.addClass('on no-delay');
        $HERO_IMG.addClass('video-done');
      }

      if (user_agent.isTouch) {
        setTimeout(function() {
          landing.$head.addClass('on');

          setTimeout(function(){
            if (w_resize.width <= 639) {
              w_resize.sticky_y = w_resize.$landing.offset().top + w_resize.$landing.outerHeight() - 60;
            } else {
              w_resize.sticky_y = w_resize.$landing_nav.offset().top + w_resize.$landing_nav.outerHeight();
            }
          }, 1650);
        }, 1400);
        setTimeout(function() {
          landing.anim_in();
        }, 1200);
        setTimeout(function() {
          landing.$start_btn.addClass('on');
        }, 1750);
        setTimeout(function() {
          $HERO_IMG.addClass('video-done');
        }, 1500);
        //$HERO_IMG.addClass('video-done');

        //if (user_agent.isTouch) $HERO_IMG.addClass('static-hero');
      } else {
        // video.init();
        setTimeout(function() {
          landing.$head.addClass('on');

          setTimeout(function() {
            if (w_resize.width <= 639) {
              w_resize.sticky_y = w_resize.$landing.offset().top + w_resize.$landing.outerHeight() - 60;
            } else {
              w_resize.sticky_y = w_resize.$landing_nav.offset().top + w_resize.$landing_nav.outerHeight();
            }
          }, 1650);
        }, 1000); 
        setTimeout(function() {
          landing.anim_in();
        }, 1200);
        setTimeout(function() {
          landing.$start_btn.addClass('on');
        }, 1750);
        setTimeout(function() {
          $HERO_IMG.addClass('video-done');
        }, 1500);
      }
    },

    anim_in: function() {
      if (!landing.started) {
        landing.started = true;
        landing.$head.addClass('start');

        setTimeout(function() {
          landing.$scroll_btn.removeClass('scroll-intro');
        }, 1600);
      }
    }
  };

  var instructions = {
    init: function() {
      $INSTRUCTIONS.each(function() {
        var close = $(this).find('.bb-close');

        close.on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();

          var instruction = $(this).parent();

          instruction.css('display', 'none');
        });
      });
    }
  };

  var video = {
    $player: null,
    myPlayer: null,

    p_data: {
      'accountId': '24488480001',
      'playerId': 'ryQ1wVtwl', //'4yZAvrR5e',//
      'videoId': '5365799838001',
      'preload': 'auto',
      'allowfullscreen': 'true',
      'webkitallowfullscreen': 'true',
      'mozallowfullscreen': 'true',
      'oallowfullscreen': 'true',
      'msallowfullscreen': 'true',
      'htmlFallback': 'false'
    },

    init: function() {
      video.$player = $HERO_IMG.find('.video');

      var new_video_id = (video.$player.attr('src-id')) ? video.$player.attr('src-id') : video.p_data.videoId,
        new_playerId = (video.$player.attr('player-id')) ? video.$player.attr('player-id') : video.p_data.playerId;

      var v_code = '<video id="vPlayer" data-video-id="' + new_video_id + '" data-account="' + video.p_data.accountId + '" data-player="' + new_playerId + '" data-embed="default"';
      v_code += ' preload="' + video.p_data.preload + '" allowfullscreen="' + video.p_data.allowfullscreen + '" webkitallowfullscreen="' + video.p_data.webkitallowfullscreen + '" mozallowfullscreen="' + video.p_data.mozallowfullscreen + '"';
      v_code += ' oallowfullscreen="' + video.p_data.oallowfullscreen + '" msallowfullscreen="' + video.p_data.msallowfullscreen + '" htmlFallback="' + video.p_data.htmlFallback + '"';
      v_code += ' autoplay class="video-js" muted="true" loop="true" controls="false"></video>';
      // v_code += ' poster="' + new_poster + '" class="video-js"></video>';

      video.$player.html(v_code);

      $.getScript("//players.brightcove.net/" + video.p_data.accountId + "/" + new_playerId + "_default/index.min.js", function(data, textStatus, jqxhr) {
        console.log(data); // Data returned
        console.log(textStatus); // Success
        console.log(jqxhr.status); // 200
        console.log("Load was performed.");

        video.run();
        video.resize();
      });

      video.resize();
    },

    resize: function() {
      if (!video.$player) return;

      var new_height = video.$player.height(),
        new_width = (new_height * 16) / 9, //(new_width * 9) / 16,
        offset_num = (w_resize.m_view) ? 120 : 190; //210 : 280;

      if (new_width < w_resize.width) {
        new_width = w_resize.width;
        new_height = (new_width * 9) / 16;
      }

      if (new_height <= w_resize.height) {
        new_height = w_resize.height;
        new_width = (new_height * 16) / 9;
      }

      if (video.$player.find('.video-js .vjs-tech')) {
        video.$player.find('.video-js .vjs-tech').css({
          'width': new_width + 'px',
          'height': new_height + 'px'
        });
      } else {
        video.$player.find('.video-js video').css({
          'width': new_width + 'px',
          'height': new_height + 'px'
        });
      }
    },

    run: function() {
      // videojs("vPlayer").ready(function(){
      //  video.myPlayer = this;
      //  video.myPlayer.currentTime(0);
      //  video.myPlayer.play();
      //          });

      videojs('vPlayer').on('loadedmetadata', function() {
        var v_dur,
          v_cur_T;

        video.myPlayer = this;
        v_dur = video.myPlayer.duration();

        video.resize();
        video.myPlayer.currentTime(0);
        video.myPlayer.play();
        $HERO_IMG.addClass('video-on');

        video.myPlayer.on('timeupdate', function() {
          v_cur_T = Math.round(this.currentTime());
          // var n = Math.round(v_cur_T * 100 / v_dur);
          // console.log(v_cur_T + " : " + v_dur);
          // if ((v_dur - v_cur_T) < 2) $HERO_IMG.addClass('video-done');
        });
      });
    },

    stop: function() {
      video.myPlayer.pause();
    }
  };


  var map = {
    $bg: null,
    $cont: null,
    $instructions: null,
    $heat_btns: null,
    $heat_legend: null,
    $heat_legend_item: null,
    $heat_legend_label: null,
    $heat_sources: null,

    projection: null,
    path: null,
    svg: null,
    tooltip: null,
    attribute_array: [],
    cur_attribute: 0,

    intro_played: false,
    intro_ending: false,
    intro_timer: null,

    width: 0,
    height: 0,
    timer: null,
    heat_change_done: true,
    heat_btn_ready: true,

    heat_id: 0,
    heat_color: [
      ['#eaeaea', '#4c5901', '#728300', '#99b000', '#abc500', '#bfd916'],
      ['#eaeaea', '#003d5a', '#015c89', '#007bb4', '#009ae2', '#009ae2'],
      ['#eaeaea', '#63330b', '#944d0f', '#c66610', '#df7311', '#f88012']
    ],
    legend_text: [
      ['Contracting', 'Expanding'],
      ['Tightening', 'Easing'],
      ['-1% &gt;', '&lt; 1%']
    ],
    policy_val: [
      'Easing, last move easing', 'Easing, last move tightening', 'Tightening, last move easing', 'Tightening, last move tightening'
    ],
    sources: [
      'Haver, 9/30/2018.', 'Haver, 9/30/2018.', 'Bloomberg, 9/30/2018.'
    ],

    // region_us: ['USA'],
    // region_international: ['AUS', 'AUT', 'BEL', 'CAN', 'CHE', 'DNK', 'DEU', 'ESP', 'FIN', 'FRA', 'GBR', 'IRL', 'ISR', 'ITA', 'JPN', 'NLD', 'NOR', 'NZL', 'PRT', 'SWE'],
    // region_em: ['ARE', 'BRA', 'CHL', 'CHN', 'COL', 'CZE', 'EGY', 'GRC', 'HUN', 'IDN', 'IND', 'KOR', 'MYS', 'MEX', 'PER', 'PHL', 'POL', 'QAT', 'RUS', 'THA', 'TUR', 'TWN', 'ZAF'],

    init: function() {
      map.$bg = $CONTENT.find('section.map .bg-container');
      map.$bg_img = $CONTENT.find('section.map .bg-global');
      map.$cont = $CONTENT.find('section.map .map-wrapper');
      map.$instructions = $CONTENT.find('section.map .bb-tool-tip');
      map.$heat_btns = $CONTENT.find('section.map ul.heat-btns li');
      map.$heat_legend = $CONTENT.find('section.map .heat-legend');
      map.$heat_legend_item = map.$heat_legend.find('ul li');
      map.$heat_legend_label = map.$heat_legend.find('span.heat-label');
      map.$heat_sources = $CONTENT.find('section.map .map-container p.footnote');
      map.set();

      var $heat_btn = map.$heat_btns.find('a');

      $heat_btn.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $this = $(e.currentTarget),
          id = $this.parent().index();

        // if (map.heat_change_done && !map.$heat_btns.eq(id).hasClass('on')) {
        if (map.heat_btn_ready && !map.$heat_btns.eq(id).hasClass('on')) {
          map.heat_btn_ready = false;

          if (map.intro_played) {
            if (!map.heat_change_done) map.heat_map(id, true);
            else map.heat_map(id, false);

            map.legend(id);
            map.heat_change_done = false;

            map.$heat_btns.removeClass('on');
            map.$heat_btns.eq(id).addClass('on');

            setTimeout(function() {
              map.heat_id = id;
            }, 1050);

            if (!isLocal) {
              // OppenCore.notify({
              //   type: "ui>iframe:interaction",
              //   data: {
              //     event_name: "Content Change",
              //     content_transition_type: "Tab",
              //     content_trigger_name: e.currentTarget.innerText,
              //     content_container_name: '#map'
              //   }
              // });
            }
          } else {
            // map.intro();
            // map.intro_begin();
            map.intro_end();
          }

          setTimeout(function() {
            map.heat_change_done = true;
          }, 1250); //1050);
          setTimeout(function() {
            map.heat_btn_ready = true;
          }, 500);
        }

        map.$instructions.css('display', 'none');
      });
    },

    legend: function(id) {
      map.$heat_legend.removeClass('legend-1 legend-2 legend-3');
      map.$heat_legend.addClass('legend-' + (id + 1));

      map.$heat_legend_label.eq(0).html(map.legend_text[id][0]);
      map.$heat_legend_label.eq(1).html(map.legend_text[id][1]);
      map.$heat_legend_label.eq(2).html(map.legend_text[id][0]);
      map.$heat_legend_label.eq(3).html(map.legend_text[id][1]);
    },

    set: function() {
      // d3.select(window).on("resize", resize);
      map.width = map.$cont.width(), map.height = map.$cont.height();

      // map.height = $CONTENT.find('section.map').height() - $CONTENT.find('section.map .heat-nav').height() - $CONTENT.find('section.map .footnote').height() - 350;

      map.projection = d3.geo.eckert3()
        .scale(200)
        .translate([map.width / 2, map.height / 2])
        .precision(.1);

      map.path = d3.geo.path()
        .projection(map.projection);

      map.svg = d3.select("#map").append("svg")
        .attr("width", map.width)
        .attr("height", map.height);

      map.tooltip = d3.select('.map-container').append('div') //#map
        .attr('class', 'hidden map-box');

      map.load_data();
    },

    resize: function() {
      var mapH = map.$cont.width() * 0.517;
      map.$cont.css('height', mapH + 'px');

      map.width = map.$cont.width(), map.height = map.$cont.height();

      map.svg.attr('width', map.width).attr('height', map.height);

      map.projection
        .translate([map.width / 2, map.height / 2])
        // .translate([map.width / 2, map.height])
        .scale((map.width * 200) / 1040);

      d3.selectAll('.country').attr('d', map.path);
      nav.set_section_pos();
    },

    load_data: function() {
      queue()
        .defer(d3.json, CODE_PATH + "../outlook/data/world-topo.json") //countries.json")//world-continents.json")//
        .defer(d3.tsv, CODE_PATH + "../outlook/data/heatmap-data-2018-12-4.tsv")
        .await(map.process_data);
    },

    process_data: function(error, world, country_data) {
      if (error) throw error;

      var countries = world.objects.countries.geometries;

      for (var i in countries) {
        for (var j in country_data) {
          if (countries[i].properties.id == country_data[j].id) {
            for (var k in country_data[j]) {
              if (k != 'name' && k != 'id') {
                if (map.attribute_array.indexOf(k) == -1) {
                  map.attribute_array.push(k);
                }

                countries[i].properties[k] = country_data[j][k]; //Number(country_data[j][k]);
              }
            }

            break;
          }
        }
      }

      map.draw_map(world);
      map.resize();
    },

    draw_map: function(world) {
      map.svg.selectAll(".country")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append("path")
        .attr("class", "country")
        .attr("id", function(d) {
          return "code_" + d.properties.id;
        }, true)
        .attr("d", map.path);

      d3.selectAll('.country')
        .attr('fill-opacity', 0);

      d3.select('#code_ATA').style({
        'display': 'none'
      });
      d3.select('#code_ATF').style({
        'display': 'none'
      });

      d3.selectAll('.country')
        .attr('fill', function(d) {
          // var color_id = Number(d.properties[map.attribute_array[0]]);
          // color_id = (!color_id) ? 0 : color_id;
          return '#ffffff'; //'#818181';//map.heat_color[map.heat_id][color_id];
        })
        .attr({
          'fill-opacity': 0,
          'stroke': '#2f2f2f', //'#ffffff',//
          'stroke-opacity': 0.1 //0.9//0.75//0.35
        });
      // .on("mouseover", map.hover)
      // .on("mouseout", map.hout);

      d3.selectAll('.country').each(function(d, i) {
        var rand_n = util.randomNum(0, 35);
        rand_n = (rand_n > 30) ? 35 : rand_n;
        rand_n = (rand_n < 5) ? 5 : rand_n;

        rand_n = rand_n * 0.01;

        d3.select(this).attr('stroke-opacity', Number(rand_n));
      });

      // if (nav.id == 1) map.intro();
      // if (nav.id == 1) map.intro_begin();
      map.intro_begin();
    },

    intro_begin: function() {
      if (map.intro_played == false) {
        map.intro_played = true;

        if (!user_agent.isTouch) {
          if (!map.$cont.hasClass('intro')) {
            map.$cont.addClass('intro');
          }

          // var delay = 500;

          // clearInterval(map.intro_timer);
          // map.intro_timer = null;

          // map.intro_timer = setInterval(function () {
          //  d3.selectAll('.country').each(function (d,i) {
          //    var rand_n = util.randomNum(0, 50);
          //    rand_n = ( rand_n > 45 ) ? 50 : rand_n - 15;
          //    rand_n = ( rand_n < 0 ) ? 0 : rand_n;

          //    rand_n = rand_n * 0.01;


          //    var rand_n2 = util.randomNum(0, 50);
          //    rand_n2 = rand_n2 - 15;
          //    rand_n2 = ( rand_n2 < 0 ) ? 0 : rand_n2;

          //    rand_n2 = rand_n2 * 0.01;


          //    d3.select(this)
          //      .attr('stroke-opacity', Number(rand_n))
          //      .attr('fill-opacity', Number(rand_n2));
          //  });
          // }, delay);

          d3.selectAll('.country').each(function(d, i) {
            var rand_n = util.randomNum(0, 50);
            rand_n = (rand_n > 45) ? 50 : rand_n - 15;
            rand_n = (rand_n < 0) ? 0 : rand_n;

            rand_n = rand_n * 0.01;


            var rand_n2 = util.randomNum(0, 50);
            rand_n2 = rand_n2 - 15;
            rand_n2 = (rand_n2 < 0) ? 0 : rand_n2;

            rand_n2 = rand_n2 * 0.01;


            d3.select(this)
              .attr('stroke-opacity', Number(rand_n))
              .attr('fill-opacity', Number(rand_n2));
          });

          map.$heat_sources.html('<strong>Sources:&nbsp;&nbsp;</strong>' + map.sources[0]);
        } else {
          map.intro_ending = true;

          // clearInterval(map.intro_timer);
          // map.intro_timer = null;

          map.$cont.addClass('intro-done');
          map.$cont.removeClass('intro');
          map.$cont.removeClass('intro-ending');

          d3.selectAll('.country')
            .attr('fill', function(d) {
              var color_id = Number(d.properties[map.attribute_array[0]]);
              color_id = (!color_id) ? 0 : color_id;

              return map.heat_color[map.heat_id][color_id];
            })
            .attr({
              'fill-opacity': 1,
              'stroke': '#bdbdbd',
              'stroke-opacity': 0.5
            });

          if ($HTML.hasClass('noTouch')) {
            d3.selectAll('.country')
              .on("mouseover", map.hover)
              .on("mouseout", map.hout);
          }

          $CONTENT.find('section.map .heat-nav').animate({
            'opacity': 1
          }, 250);

          $HERO_IMG.addClass('video-done');

          map.$cont.removeClass('intro-done');
          map.$cont.removeClass('intro');

          map.$heat_sources.html('<strong>Sources:&nbsp;&nbsp;</strong>' + map.sources[0]);

          map.$heat_btns.eq(0).addClass('on');
          map.$heat_legend.addClass('on');
          map.legend(0);
        }
      }
    },

    intro_end: function() {
      if (map.intro_ending == false) {
        map.intro_ending = true;

        if (map.$cont.hasClass('intro')) {
          map.$cont.addClass('intro-done')
          map.$cont.removeClass('intro');
        }

        // clearInterval(map.intro_timer);
        // map.intro_timer = null;

        d3.selectAll('.country')
          .attr('fill', function(d) {
            var color_id = Number(d.properties[map.attribute_array[0]]);
            color_id = (!color_id) ? 0 : color_id;

            return map.heat_color[map.heat_id][color_id];
          })
          .attr({
            'fill-opacity': 1,
            'stroke': '#bdbdbd',
            'stroke-opacity': 0.5
          });

        if ($HTML.hasClass('noTouch')) {
          d3.selectAll('.country')
            .on("mouseover", map.hover)
            .on("mouseout", map.hout);
        }

        $CONTENT.find('section.map .heat-nav').animate({
          'opacity': 1
        }, 250);

        map.$heat_btns.eq(0).addClass('on');
        map.$heat_legend.addClass('on');
        map.legend(0);

        $HERO_IMG.addClass('video-done');

        // setTimeout(function() {
        map.$cont.removeClass('intro-done');
        map.$cont.removeClass('intro');
        // });

        map.$heat_sources.html('<strong>Sources:&nbsp;&nbsp;</strong>' + map.sources[0]);
      }
    },

    intro: function() {
      if (map.intro_played == false) {
        map.intro_played = true;

        $CONTENT.find('section.map .heat-nav').animate({
          'opacity': 1
        }, 150);
        $CONTENT.find('section.landing .bg-container').animate({
          'background-color': 'rgba(255,255,255,0.95)'
        }, 1500, 'easeInOutCubic');

        $CONTENT.find('section.map .bg-container').animate({
          'background-color': 'rgba(255,255,255,0.95)'
        }, 1500, 'easeInOutCubic');

        if (user_agent.isTouch) {
          map.$heat_legend.addClass('on');

          map.$heat_btns.eq(0).addClass('on');
          map.legend(0);

          d3.selectAll('.country').each(function(d, i) {
            d3.select(this)
              .attr({
                'fill-opacity': 1,
                'stroke-opacity': 0.5
              });
          });
          map.$heat_sources.html('<strong>Sources:&nbsp;&nbsp;</strong>' + map.sources[0]);
        } else {
          setTimeout(function() {
            map.$heat_legend.addClass('on');
          }, 250);

          setTimeout(function() {
            map.$heat_btns.eq(0).addClass('on');
            map.legend(0);
          }, 1250);

          var intro_count = 0,
            cur_intro_count = 0,
            intro_timer;

          clearInterval(intro_timer);
          intro_timer = null;

          intro_timer = setInterval(function() {
            if (cur_intro_count < 100) {
              cur_intro_count = intro_count + 25; //15;
              d3.selectAll('.country').each(function(d, i) {
                var rand_n = util.randomNum(intro_count, cur_intro_count + 10);
                rand_n = (rand_n > 100) ? 100 : rand_n;

                d3.select(this)
                  .attr('fill-opacity', Number(rand_n * .01));
              });

              intro_count = cur_intro_count;
            } else {
              clearInterval(intro_timer);
              intro_timer = null;

              d3.selectAll('.country').each(function(d, i) {
                d3.select(this)
                  .attr({
                    'fill-opacity': 1,
                    'stroke-opacity': 0.5
                  });
              });
              map.$heat_sources.html('<strong>Sources:&nbsp;&nbsp;</strong>' + map.sources[0]);

              // map.$heat_btns.eq(0).addClass('on');
              // map.legend(0);
            }
          }, 150); //250);
        }
      }
    },

    heat_map: function(id, interrupt) {
      if (map.intro_played == false) map.intro_played = true;

      map.$heat_sources.html('<strong>Sources:&nbsp;&nbsp;</strong>' + map.sources[id]);

      d3.selectAll('.country').each(function(d, i) {
        var cur_color = map.heat_color[map.heat_id].indexOf(d3.select(this).attr('fill')),
          new_color = Number(d.properties[map.attribute_array[id]]);

        new_color = (!new_color || new_color == "" || new_color == undefined) ? 0 : new_color;

        if (interrupt) map.heat_id = id;

        if (user_agent.isTouch) d3.select(this).attr('fill', map.heat_color[id][new_color]);
        else map.remove_color_anim(this, cur_color, new_color, id, interrupt);

        // if($(this).attr('id') == 'code_CAN') console.log(map.heat_id+" / "+d.properties.admin + ": " + cur_color + ", " + new_color);
        d3.select(this)
          .attr('fill-opacity', 1);
      });
    },

    remove_color_anim: function(_obj, _cur, _new, new_id, _interrupt) {
      if (_interrupt) {
        setTimeout(function() {
          if (_new > 0) d3.select(_obj).attr('fill', '#2f2f2f');
          else d3.select(_obj).attr('fill', map.heat_color[new_id][_new]);
        }, 250);

        setTimeout(function() {
          map.add_color_anim(_obj, 0, _new, new_id);
        }, 500);
      } else {
        if (_cur > 0) {
          var this_id = _cur - 1;

          if (this_id <= 0) d3.select(_obj).attr('fill', '#2f2f2f');
          else d3.select(_obj).attr('fill', map.heat_color[map.heat_id][this_id]);

          setTimeout(function() {
            map.remove_color_anim(_obj, this_id, _new, new_id, false);
          }, 50); //100);
        } else {
          setTimeout(function() {
            map.add_color_anim(_obj, 0, _new, new_id);
          }, 50); //100);
        }
      }
    },

    add_color_anim: function(_obj, _cur, _new, new_id) {
      if (_cur < _new) {
        var this_id = _cur + 1;
        d3.select(_obj).attr('fill', map.heat_color[new_id][this_id]);
        setTimeout(function() {
          map.add_color_anim(_obj, this_id, _new, new_id);
        }, 50); //100);
      } else {
        d3.select(_obj).attr('fill', map.heat_color[new_id][_new]);
      }
    },

    map_hover_timer: null,

    hover: function(d, i) {
      if (!w_resize.m_view) {
        var mouse = d3.mouse(d3.select('.map-container').node()).map(function(d) { //map.svg.node()).map(function(d) {
          return parseInt(d);
        });

        // console.log(mouse[0] + ", " + mouse[1]);

        var cur_label = map.$heat_btns.eq(map.heat_id).find('a').html(),
          cur_data = d.properties[cur_label + " val"],
          cur_array;

        if (cur_label == "Real Yields") {
          cur_array = [];
          cur_array.push(d.properties[cur_label + " val2"]);
          cur_array.push(d.properties[cur_label + " val3"]);
        }

        if (cur_data !== "" && cur_data !== undefined && cur_data !== "n/a") {
          d3.select(this).attr({
            'stroke': '#4c4c4c',
            'stroke-opacity': 1 //0.75
          });

          var output = '<div class="name">' + d.properties.admin + '</div>';

          if (cur_label == "Real Yields") {
            cur_label = cur_label.substr(0, cur_label.length - 1);
            output += '<div class="stat col">' + cur_label + ': <strong>' + util.roundNum(cur_data, 1) + '<sub>%</sub></strong></div>';
            output += '<div class="stat col">CPI: <strong>' + util.roundNum(cur_array[0], 1) + '<sub>%</sub></strong></div>';
            output += '<div class="stat col">Nominal Yield: <strong>' + util.roundNum(cur_array[1], 1) + '<sub>%</strong></div></div>';
          } else if (cur_label == "Policy") {
            // output += '<div class="stat"><div class="value">' + cur_data + '</div></div>';
            output += '<div class="stat dark">' + cur_data + '</div>';
          } else {
            output += '<div class="stat col">' + cur_label + ': <strong>' + util.roundNum(cur_data, 1) + '</strong>';
            if (cur_data > 50) output += '<span>(Expanding economy)</span></div>';
            else output += '<span>(Contracting economy)</span></div>';

          }

          map.tooltip.classed('hidden', false)
            .html(output)
            .attr('style', function() {
              var output = 'left: ',
                mW = $(this).width();
              // console.log('YO: '+(mouse[0] + mW) + ", "+w_resize.width);
              if ((mouse[0] + mW + 100) > w_resize.width) output += ((mouse[0] - (mW + 75)) + 'px; ');
              else output += ((mouse[0] + 25) + 'px; ');

              output += ('top: ' + (mouse[1] - 60) + 'px;');

              return output;
            });

          window.clearTimeout(map.map_hover_timer);

          if (!isLocal) {
            map.map_hover_timer = window.setTimeout(function() {
              // OppenCore.notify({
              //   type: "ui>iframe:interaction",
              //   data: {
              //     event_name: "Chart Interaction",
              //     chart_name: 'Global Landscape Heat Map',
              //     chart_type: 'Heat Map',
              //     chart_interaction_value: d.properties.admin,
              //     chart_interaction_type: 'Hover',
              //     chart_interaction_area: 'Country',
              //     chart_tooltip_type: 'Content'
              //   }
              // });
            }, 1000);
          }
        }
      }
    },

    hout: function(d, i) {
      window.clearTimeout(map.map_hover_timer);

      d3.select(this).attr({
        'stroke': '#bdbdbd',
        'stroke-opacity': 0.5
      });

      map.tooltip.classed('hidden', true).html('');
    }

  };


  var regions = {
    $cont: null,
    $nav: null,
    $nav_btns: null,
    $head: null,
    $chart_top: null,
    $chart_title: null,
    $infograph_top: null,
    $column_top: null,
    $region_btns: null,

    $modal_close: null,
    $modal_nav: null,

    scroll_anim_disable: false,
    region_click_disable: false,

    id: 0,

    intro_played: [false, false, false],

    init: function() {
      this.$cont = $CONTENT.find('section.regional');
      regions.$nav = $CONTENT.find('section.regional-nav ul.btns');
      regions.$nav_btns = regions.$nav.find('li');
      regions.$instructions = $CONTENT.find('section.regional-nav .bb-tool-tip');

      regions.$head = $MODAL.find('ul.head > li');
      regions.$chart_top = $MODAL.find('.chart-wrapper');
      regions.$chart_title = regions.$chart_top.find('h6.title');
      regions.$infograph_top = $MODAL.find('.infograph-wrapper');
      regions.$column_top = $MODAL.find('.column-wrapper .column-wrap');

      regions.$modal_close = $MODAL.find('.modal-close');
      regions.$modal_sections = $MODAL.find('.row');
      regions.$modal_nav_btns = $MODAL.find('.modal-nav li a');

      regions.$region_btns = regions.$nav_btns.find('a');

      regions.$region_btns.on('click', regions.select.bind(this));
      regions.$modal_close.on('click', regions.close.bind(this));
      regions.$modal_nav_btns.on('click', regions.modal_nav_select.bind(this));
    },

    select: function(e) {
      e.preventDefault();
      e.stopPropagation();

      var $this = $(e.currentTarget),
        $parent = $this.parent(),
        id = $parent.index();

      if (w_resize.height > 580) {
        if (!this.region_click_disable) {
          this.region_click_disable = true;

          $BODY.removeClass('us inter em');

          if (!isLocal) {
            // OppenCore.notify({
            //   type: "ui>iframe:interaction",
            //   data: {
            //     event_name: "Close Content",
            //     content_container_name: ".regional .bg-container",
            //     trigger_type: "Block",
            //     trigger_text: $this.text(),
            //     content_container: '.regional',
            //     content_type: "Block"
            //   }
            // });
          }

          regions.open_region(id);
        }
      } else {
          w_scroll.sticky_nav_disable = true;
          regions.id = id;

          regions.expand(id);
          
          $BODY.addClass('no-scroll');
          $MODAL.addClass('on');
          $MODAL.attr('data-active-region', id);
          $MODAL.css('transition-delay', '0s');
          $MODAL_CONTENT.scrollTop(0);
      }
    },

    open_region: function(id) {
      w_scroll.sticky_nav_disable = true;
      regions.id = id;

      setTimeout(function() {
        regions.expand(id);
        nav.$regional_nav_sect.addClass('modal-bg-anim');
        regions.region_click_disable = false;
      }, 1000); //900

      setTimeout(function() {
        nav.$regional_nav_sect.addClass('hide-text');
      }, 500);

      nav.$regional_nav_sect.attr('data-active-btn', id);
      nav.$regional_nav_sect.addClass('sibling-slider');
      nav.$regional_sect.addClass('regional-full-height');

      nav.anchor_anim(2);

      landing.$scroll_btn.css('display', 'none');
      $BODY.addClass('no-scroll');
      $HTML.addClass('noAnim');
      $MODAL.addClass('on');
      $MODAL.attr('data-active-region', id);
      $MODAL_CONTENT.scrollTop(0);

      if (w_resize.width < 640) {
        setTimeout(function() {
          $NAV.removeClass('on');
        }, 935);
      } else {
        setTimeout(function() {
          $NAV.removeClass('on');
        }, 500);
      }
    },

    expand: function(id) {
      $BODY.addClass(nav.region_name[id]);

      // if (id > 1 && !regions.intro_played[id]) infograph.init();
      // if (id <= 1) chart.init(id);

      if (!column.initiated) column.init(id);
      else column.update(id);

      if (!regions.intro_played[id]) regions.intro(id);
    },

    intro: function(id) {
      regions.intro_played[id] = true;

      var $obj = regions.$head.eq(id).find('.stats p'),
        $num = $obj.eq(0).find('span'),
        $gdp = $obj.eq(1).find('span'),
        $pop = $obj.eq(2).find('span'),
        final_num = $num.html(),
        final_gdp = $gdp.html(),
        final_pop = $pop.html(),
        gdp_unit = final_gdp.substr(final_gdp.length - 1),
        pop_unit = final_pop.substr(final_pop.length - 1);

      final_gdp = final_gdp.substring(1, final_gdp.length - 1);
      final_pop = final_pop.substring(0, final_pop.length - 1);

      if (user_agent.isTouch) {
        $num.html(final_num);
        $gdp.html("$" + final_gdp + gdp_unit);
        $pop.html(final_pop + pop_unit);

        if (!$num.hasClass('on')) $num.addClass('on');
        if (!$gdp.hasClass('on')) $gdp.addClass('on');
        if (!$pop.hasClass('on')) $pop.addClass('on');
      } else {
        regions.intro_anim($num, final_num, "", "", 0);
        regions.intro_anim($gdp, final_gdp, gdp_unit, "$", 500);
        regions.intro_anim($pop, final_pop, pop_unit, "", 750);
      }
    },

    intro_anim: function(elm, _val, _unit, _sign, _delay) {
      elm.removeClass('on');

      var num = 0,
        total = _val,
        unit = (_unit == "") ? null : _unit,
        sign = (_sign == "") ? null : _sign,
        hasDecimal = (total % 1 != 0) ? true : false,
        add = (hasDecimal) ? 0.1 : 1;

      if (total > 100) num = total - util.randomNum(30, 60);
      if (hasDecimal && total > 15) num = total - (util.randomNum(20, 50) * 0.1);

      num = (num % 1 != 0) ? Math.round(num * 10) / 10 : num;

      var init_val = (sign) ? sign + num : num;
      init_val = (unit) ? init_val + unit : init_val;
      elm.html(init_val);

      setTimeout(function() {

        var myInterval = setInterval(function() {

          if (num >= total) {
            num = total;

            clearInterval(myInterval);
            myInterval = null;
          } else {
            num += add;
          }

          num = (num % 1 != 0) ? Math.round(num * 10) / 10 : num;

          var output = (sign) ? sign + num : num;
          if (hasDecimal && num % 1 == 0) output = output + '.0';
          output = (unit) ? output + unit : output;

          elm.html(output);

        }, 30);

        if (!elm.hasClass('on')) elm.addClass('on');

      }, _delay);
    },

    scroll_checker: function(y) {
      if (regions.intro_played[regions.id]) {
        // console.log((regions.$chart_top.offset().top + regions.$chart_top.height() - w_resize.height) + ", " + y);
        // if (y >= (regions.$chart_top.offset().top + (regions.$chart_top.height() * 0.5) - w_resize.height) && codeLoaded && !$BODY.hasClass('em')) chart.draw();
        // if (y >= (regions.$infograph_top.offset().top + (regions.$infograph_top.height() * 0.5) - w_resize.height) && codeLoaded && $BODY.hasClass('em')) infograph.draw();
        if (y >= (regions.$column_top.offset().top + (regions.$column_top.height() * 0.5) - w_resize.height) && codeLoaded && column.initiated) column.draw();
      }
    },

    close: function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (w_resize.height > 580) {
        if (!this.region_click_disable) {
          if (!isLocal) {
            // OppenCore.notify({
            //   type: "ui>iframe:interaction",
            //   data: {
            //     event_name: "Close Content",
            //     content_container_name: ".regional .bg-container",
            //     trigger_type: "Block",
            //     trigger_text: "X",
            //     content_container: '.regional',
            //     content_type: "Block"
            //   }
            // });
          }

          this.scroll_anim_disable = false;
          this.region_click_disable = true;
          w_scroll.sticky_nav_disable = false;

          nav.$regional_nav_sect.removeClass('sibling-slider modal-bg-anim');

          setTimeout(function() {
            nav.$regional_sect.removeClass('regional-full-height');
            nav.$regional_nav_sect.attr('data-active-btn', '');
            nav.$regional_nav_sect.removeClass('hide-text');
            $HTML.removeClass('noAnim');
            nav.set_section_pos();

            regions.region_click_disable = false;
            
            if (!regions.scroll_anim_disable) nav.anchor_anim(2);
          }, 1400); //900

          landing.$scroll_btn.css('display', 'block');
          nav.$regional_nav_sect.removeClass('quick-open');
          $NAV.addClass('on');
          $BODY.removeClass('no-scroll');
          $MODAL.removeClass('on');
          $MODAL.attr('data-active-region', '');
        }
      } else {
        regions.$nav.attr('data-active-btn', '');
        regions.$nav.removeClass('sibling-slider hide-text modal-bg-anim quick-open');

        nav.$regional_sect.attr('data-section-number', '');
        nav.$regional_sect.removeClass('remove-text-delay regional-full-height');

        $BODY.removeClass('no-scroll');
        $MODAL.removeClass('on');
        $MODAL.attr('data-active-region', '');
      }
    },

    modal_nav_select: function(e) {
      e.preventDefault();
      e.stopPropagation();

      var $this = $(e.currentTarget),
        $parent = $this.parent(),
        id = $parent.index();

      if (w_resize.height > 580) {
        regions.id = id;
        regions.$modal_sections.css('opacity', '0');

        nav.$regional_nav_sect.attr('data-active-btn', id);

        setTimeout(function() {
          regions.expand(id);
          $MODAL.attr('data-active-region', id);
        }, 900);

        setTimeout(function() {
          $MODAL_CONTENT.animate({
            scrollTop: 0
          }, 700, 'easeInOutCubic');
        }, 200);

        setTimeout(function() {
          regions.$modal_sections.css('opacity', '1');
        }, 900);
      } else {
        regions.$modal_sections.css('opacity', '0');

        setTimeout(function() {
          $MODAL.attr('data-active-region', id);
          regions.$modal_sections.css('opacity', '1');
        }, 900);

        setTimeout(function() {
          $MODAL_CONTENT.animate({
            scrollTop: 0
          }, 700, 'easeInOutCubic');
        }, 200);
      }
    }
  };


  var chart = {
    obj: null,
    legend_g: null,
    tooltip: null,
    footnote: null,

    width: 0,
    height: 0,
    parseDate: null,
    x: 0,
    y: 0,
    color: null,
    xAxis: null,
    yAxis: null,
    line: null,
    svg: null,

    data: null,
    avg_data: null,
    group: null,
    item: null,

    path: null,
    totalLength: 0,
    id: 0,

    init: function(id) {
      chart.id = id;
      chart.obj = (id == 0) ? chart1 : chart2;
      chart.legend_g = d3.select('.chart-wrapper > .chart-legend-box');
      chart.tooltip = d3.select('.chart-wrapper > .chart-tooltip');
      chart.footnote = d3.select('.chart-wrapper > p.footnote');

      chart.reset();

      // chart.width = regions.$chart_top.width() - chart.obj.margin.left - chart.obj.margin.right;//w_resize.width - chart1.margin.left - chart1.margin.right;//630 - chart1.margin.left - chart1.margin.right;

      if (w_resize.m_view && chart.id == 0) chart.width = regions.$chart_top.width() - (chart.obj.margin.left * 0.75) - (chart.obj.margin.right * 0.75);
      else if (w_resize.m_view && chart.id == 1) chart.width = regions.$chart_top.width() - (chart.obj.margin.left * 0.65) - (chart.obj.margin.right * 0.25);
      else chart.width = regions.$chart_top.width() - chart.obj.margin.left - chart.obj.margin.right;

      // if (w_resize.m_view && chart.id == 0) chart.height = regions.$chart_top.height() - chart.obj.margin.top - (chart.obj.margin.bottom * 1.5);
      // else chart.height = regions.$chart_top.height() - chart.obj.margin.top - chart.obj.margin.bottom;
      chart.height = regions.$chart_top.height() - chart.obj.margin.top - chart.obj.margin.bottom;

      regions.$chart_title.html(chart.obj.title);
      chart.set_var('#line-chart', 'line-chart');
      chart.load_data(CODE_PATH + chart.obj.data_path, '#line-chart', chart.obj.key2);
    },

    reset: function() {
      d3.select("#line-chart > .line-chart").remove();
      chart.legend_g.selectAll("div").remove();

      regions.$chart_top.find('#line-chart').removeAttr('style');

      chart.width = 0;
      chart.height = 0;
      chart.parseDate = null;
      chart.x = 0;
      chart.y = 0;
      chart.color = null;
      chart.xAxis = null;
      chart.yAxis = null;
      chart.line = null;
      chart.svg = null;

      chart.data = null;
      // chart.avg_data = null;
      chart.group = null;
      chart.item = null;

      chart.path = null;
      chart.totalLength = 0;
    },

    set_var: function(_name, _class) {
      chart.footnote.html('');
      chart.footnote.html('<strong>Sources:&nbsp;&nbsp;</strong>' + chart.obj.footnote);

      chart.parseDate = d3.time.format("%Y-%m-%d").parse;

      chart.x = d3.time.scale()
        .range([0, chart.width]);

      chart.y = d3.scale.linear()
        .range([chart.height, 0]);

      chart.color = d3.scale.category10();

      var tickNum = (w_resize.m_view) ? 4 : 10;

      chart.xAxis = d3.svg.axis()
        .scale(chart.x)
        .ticks(tickNum)
        .innerTickSize(5)
        .outerTickSize(0)
        .orient("bottom");

      chart.yAxis = d3.svg.axis()
        .scale(chart.y)
        .tickFormat(function(d) {
          if (chart.obj.y_symbol) return d + chart.obj.y_symbol;
          else return d;
        })
        .ticks(10)
        .innerTickSize(5)
        .outerTickSize(0)
        .orient("left");

      chart.line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) {
          return chart.x(d.date);
        })
        .y(function(d) {
          return chart.y(d.price);
        });

      chart.svg = d3.select(_name).append("svg").attr('class', _class)
        // .attr("width", chart.width + chart.obj.margin.left + chart.obj.margin.right)
        .attr("width", function() {
          if (w_resize.m_view && chart.id == 0) return chart.width + (chart.obj.margin.left * 0.75) + (chart.obj.margin.right * 0.75);
          else if (w_resize.m_view && chart.id == 1) return chart.width + (chart.obj.margin.left * 0.65) + (chart.obj.margin.right * 0.25);
          else return chart.width + chart.obj.margin.left + chart.obj.margin.right;
        })
        .attr("height", chart.height + chart.obj.margin.top + chart.obj.margin.bottom)
        // .attr("height", function() {
        //  if (w_resize.m_view && chart.id == 0) return chart.height + chart.obj.margin.top + (chart.obj.margin.bottom * 1.5);
        //  else return chart.height + chart.obj.margin.top + chart.obj.margin.bottom;
        // })
        .append("g")
        .attr("transform", function() {
          if (w_resize.m_view && chart.id == 0) return "translate(" + (chart.obj.margin.left * 0.75) + "," + chart.obj.margin.top + ")";
          else if (w_resize.m_view && chart.id == 1) return "translate(" + (chart.obj.margin.left * 0.65) + "," + chart.obj.margin.top + ")";
          else return "translate(" + chart.obj.margin.left + "," + chart.obj.margin.top + ")";
        });
    },

    load_data: function(_path, _name, _legend) {
      d3.tsv(_path, function(error, d) {
        chart.data = d;
        // chart1.color.domain(d3.keys(chart1.data[0]).filter(function(key) { return key !== "date"; }));
        chart.color.domain(d3.keys(chart.data[0]).filter(function(key) {
          // return key !== "date";
          // return (key !== "date" && key !== "2017" && key !== "2018" && key !== "2019");
          return (key == chart.obj.key0 || key == chart.obj.key1);
        }));

        chart.data.forEach(function(d) {
          d.date = chart.parseDate(d.date);
        });

        chart.group = chart.color.domain().map(function(name) {
          return {
            name: name,
            values: chart.data.map(function(d) {
              return {
                date: d.date,
                price: +d[name]
              };
            })
          };
        });

        chart.x.domain(d3.extent(chart.data, function(d) {
          return d.date;
        }));

        chart.y.domain([
          d3.min(chart.group, function(c) {
            return d3.min(c.values, function(v) {
              return v.price + chart.obj.y_offset_min;
            });
          }), // - 0.25; }); }),
          d3.max(chart.group, function(c) {
            return d3.max(c.values, function(v) {
              return v.price + chart.obj.y_offset_max;
            });
          }) //+ 1; }); })
        ]);

        chart.svg.append("rect")
          .attr({
            "class": "bg",
            "x": 0,
            "y": 0,
            "width": chart.width,
            "height": chart.height,
            "fill": '#f9f9f9'
          });

        chart.svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0, " + (chart.height - 0.5) + ")")
          .call(chart.xAxis)
          .selectAll('text')
          .attr("transform", "translate(0, 5)");

        chart.svg.append("g")
          .attr("class", "y axis")
          .call(chart.yAxis)
          .selectAll('text')
          .attr("transform", "translate(-5, 0)");

        chart.svg.append("line")
          .attr({
            "class": "x-blocker",
            "x1": 0,
            "x2": chart.width,
            "y1": 0,
            "y2": 0,
            "fill": "none",
            "shape-rendering": "crispEdges",
            "stroke": "#dfdfdf",
            "stroke-width": "1px"
          });

        chart.svg.append("line")
          .attr({
            "class": "y-blocker",
            "x1": chart.width,
            "x2": chart.width,
            "y1": 0,
            "y2": chart.height,
            "fill": "none",
            "shape-rendering": "crispEdges",
            "stroke": "#dfdfdf",
            "stroke-width": "1px"
          });

        chart.svg.append("line")
          .attr({
            "class": "controlled-xAxis",
            "x1": 0,
            "x2": chart.width,
            "y1": chart.y(0),
            "y2": chart.y(0),
            "fill": "none",
            "shape-rendering": "crispEdges",
            "stroke-width": "1px"
          })
          .attr("stroke", function() {
            if (chart.obj.x_origin == 'bottom') return '#dfdfdf';
            else return '#eaeaea';
          });

        chart.svg.append("text")
          .attr("class", "axis-label")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + (-1 * chart.obj.margin.left * 0.5) + ", " + (chart.height * 0.5 + 5) + ") rotate(-90)")
          .text(chart.obj.axis_label);

        if (chart.obj.x_origin == 'bottom') {
          chart.svg.select(".sub-xAxis").remove();
        } else {
          chart.svg.append("line")
            .attr({
              "class": "sub-xAxis",
              "x1": 0,
              "x2": chart.width,
              "y1": chart.height - 0.5,
              "y2": chart.height - 0.5,
              "fill": "none",
              "shape-rendering": "crispEdges",
              "stroke": "#dfdfdf", //"#2f2f2f",//
              "stroke-width": "1px"
            });
        }

        if (_legend) {

          var avg_items = d3.scale.linear()
            .domain(d3.keys(chart.data[0]).filter(function(key) {
              return (key !== "date" && key !== chart.obj.key0 && key !== chart.obj.key1);
            }));

          chart.avg_data = avg_items.domain().map(function(name) {
            return {
              name: name,
              value: chart.data[0][name]
            };
          });

          // console.log(chart.avg_data);

          for (var i in chart.avg_data) {
            chart.svg.append("line")
              .attr({
                "class": "horizontalGrid" + i,
                "x1": 0,
                "x2": chart.width + 24,
                "y1": chart.y(chart.avg_data[i].value),
                "y2": chart.y(chart.avg_data[i].value),
                "fill": "none",
                "shape-rendering": "crispEdges",
                "stroke": "#7c7c7c", //"#dfdfdf",//
                "stroke-width": "1px",
                "stroke-dasharray": ("2, 3")
              });

            var grid_item = chart.svg.append("g");

            grid_item.append('circle')
              .attr({
                "class": "gridCir" + i,
                "cx": chart.width + 24,
                "cy": Math.floor(chart.y(chart.avg_data[i].value)), // - 1),
                "r": 3,
                "fill": '#7c7c7c'
              });

            grid_item.append("text")
              .text(chart.avg_data[i].name)
              .attr({
                "class": "gridText" + i,
                "x": chart.width + 32,
                // "y": Math.floor(chart.y(chart.avg_data[i].value)),
                "dy": 3,
                "fill": "#7c7c7c",
                "stroke": "none"
              })
              .attr('y', function() {
                if (i >= (chart.avg_data.length - 1)) return Math.floor(chart.y(chart.avg_data[i].value)) - 2;
                else if (i == 2) return Math.floor(chart.y(chart.avg_data[i].value)) + 2;
                else return Math.floor(chart.y(chart.avg_data[i].value));
              });
          }
        }

        chart.set_ui(_name, _legend);
      });
    },

    set_ui: function(_name, _legend) {
      for (var i in chart.group) {
        chart.legend_g.append('div')
          .attr("class", "items id" + i)
          .html(chart.group[i].name)
          .append('span')
          .style('background-color', function() {
            if (i <= 0) return "#bfd916";
            else return "#000000";
          });
      }

      if (_legend) {
        chart.legend_g.append('div')
          .attr({
            "class": "items circ",
          })
          .html(_legend)
          .append('span');
      }

      function tweenDash() {
        var l = this.getTotalLength(),
          i = d3.interpolateString("0," + l, l + "," + l);
        return function(t) {
          return i(t);
        };
      }

      // console.log(chart.group);
      chart.item = chart.svg.selectAll(".item")
        .data(chart.group)
        .enter().append("g")
        .attr("class", "item");

      chart.path = chart.svg.selectAll(".item").append("path")
        .attr("class", "data-line-bold")
        .attr("d", function(d) {
          return chart.line(d.values);
        });

      chart.path = chart.svg.selectAll(".item").append("path")
        .attr("class", "data-line")
        .attr("d", function(d) {
          return chart.line(d.values);
        })
        // .attr("fill", "steelblue")
        .style("stroke", function(d) {
          if (d.name == chart.obj.key1) return "#000"; //"#fff";//
          else return "#bfd916";
        });

      chart.totalLength = [chart.path[0][0].getTotalLength(), chart.path[0][1].getTotalLength()];
      // console.log(chart1.totalLength);

      d3.select(chart.path[0][0])
        .attr("stroke-dasharray", chart.totalLength[0] + " " + chart.totalLength[0])
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

      d3.select(chart.path[0][1])
        .attr("stroke-dasharray", chart.totalLength[1] + " " + chart.totalLength[1])
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

      if (chart.obj.intro_played) {
        d3.select(chart.path[0][0])
          .attr("stroke-dashoffset", 0);

        d3.select(chart.path[0][1])
          .attr("stroke-dashoffset", 0);
      } else {
        d3.select(chart.path[0][0])
          .attr("stroke-dashoffset", chart.totalLength[0]);

        d3.select(chart.path[0][1])
          .attr("stroke-dashoffset", chart.totalLength[1]);
      }

      if (w_resize.m_view) {
        if (w_resize.width < 360) regions.$chart_top.find('#line-chart').css('height', '470px');
        else regions.$chart_top.find('#line-chart').css('height', '400px');
      } else {
        regions.$chart_top.find('#line-chart').removeAttr('style');
      }

      var $item = $(_name).find('.item').eq(0);
      var chart_hover_timer;

      chart.item.on("mousemove", function(d) {
        if (!w_resize.m_view) {
          var mX = d3.event.pageX - $item.offset().left,
            mY = d3.event.pageY - $item.offset().top,
            per = 0,
            total = 0,
            data_p;

          total = d.values.length;
          if (mX < 0) mX = 0;

          per = ((mX * 100) / chart.width);
          data_p = Math.floor((per * total) / 100);

          if (data_p < 0) data_p = 0;
          if (data_p >= total) data_p = total - 1;

          chart.tooltip.style("display", "inline-block");

          var tooltip_text = '<span class="date">' + util.dateFormat(chart.group[0].values[data_p].date) + '</span>';

          tooltip_text += '<span class="data-item">' + chart.group[0].name + ': <strong>' + util.roundNum(chart.group[0].values[data_p].price, 2);
          if (chart.obj.y_symbol) tooltip_text += chart.obj.y_symbol;
          tooltip_text += '</strong></span><span class="data-item">' + chart.group[1].name + ': <strong>' + util.roundNum(chart.group[1].values[data_p].price, 2);
          if (chart.obj.y_symbol) tooltip_text += chart.obj.y_symbol;
          tooltip_text += '</strong></span>';

          chart.tooltip.html(tooltip_text)
            .style("left", function() {
              var tW = $(this).width() + 20;

              if (mX < (chart.width - tW)) return (mX + chart.obj.tooltip_offset1) + "px";
              else return "auto";
            })
            .style("right", function() {
              var tW = $(this).width() + 20;

              if (mX < (chart.width - tW)) return "auto";
              else return ((chart.width - mX) + chart.obj.tooltip_offset2) + "px";
            })
            .style("top", (mY + chart.obj.tooltip_offset3) + "px");

          window.clearTimeout(chart_hover_timer);

          if (!isLocal) {
            chart_hover_timer = window.setTimeout(function() {
              // OppenCore.notify({
              //   type: "ui>iframe:interaction",
              //   data: {
              //     event_name: "Chart Interaction",
              //     chart_name: chart.obj.title,
              //     chart_type: 'Line',
              //     chart_interaction_value: chart.group[0].name,
              //     chart_interaction_type: 'Hover',
              //     chart_tooltip_type: 'Content'
              //   }
              // });
            }, 1000);
          }
        }
      }).on("mouseout", function(d) {
        window.clearTimeout(chart_hover_timer);
        chart.tooltip.style("display", "none");
      });
    },

    resize: function() {
      if (w_resize.m_view && chart.id == 0) chart.width = regions.$chart_top.width() - (chart.obj.margin.left * 0.75) - (chart.obj.margin.right * 0.75);
      else if (w_resize.m_view && chart.id == 1) chart.width = regions.$chart_top.width() - (chart.obj.margin.left * 0.65) - (chart.obj.margin.right * 0.25);
      else chart.width = regions.$chart_top.width() - chart.obj.margin.left - chart.obj.margin.right;

      chart.x = d3.time.scale()
        .range([0, chart.width]);

      var tickNum = (w_resize.m_view) ? 4 : 10;

      // chart.xAxis = d3.svg.axis()
      chart.xAxis
        .scale(chart.x)
        .ticks(tickNum);

      chart.svg.selectAll("g.x.axis > g.tick > text")
        .attr("transform", "translate(0, 5)");

      chart.x.domain(d3.extent(chart.data, function(d) {
        return d.date;
      }));

      d3.select('g.x.axis')
        .attr("transform", "translate(0, " + (chart.height - 0.5) + ")")
        // .attr("transform", "translate(0," + chart.y(0) + ")")
        .call(chart.xAxis);

      for (var i in chart.avg_data) {
        d3.select('.horizontalGrid' + i)
          .attr({
            "x2": chart.width + 24
          });

        d3.select('.gridCir' + i)
          .attr({
            "cx": chart.width + 24,
          });

        d3.select('.gridText' + i)
          .attr({
            "x": chart.width + 32,
          });
      }

      chart.svg.select(".bg")
        .attr("width", chart.width);

      d3.select('.controlled-xAxis')
        .attr({
          "x1": 0,
          "x2": chart.width
        });

      d3.select('.sub-xAxis')
        .attr({
          "x1": 0,
          "x2": chart.width
        });

      d3.select('.x-blocker')
        .attr({
          "x1": 0,
          "x2": chart.width
        });

      d3.select('.y-blocker')
        .attr({
          "x1": chart.width,
          "x2": chart.width,
          "y1": 0,
          "y2": chart.height
        });

      d3.selectAll("path.data-line")
        .attr("d", function(d) {
          return chart.line(d.values);
        });

      d3.selectAll("path.data-line-bold")
        .attr("d", function(d) {
          return chart.line(d.values);
        });

      d3.select('svg.line-chart')
        .attr("width", function() {
          if (w_resize.m_view && chart.id == 0) return chart.width + (chart.obj.margin.left * 0.75) + (chart.obj.margin.right * 0.75);
          else if (w_resize.m_view && chart.id == 1) return chart.width + (chart.obj.margin.left * 0.65) + (chart.obj.margin.right * 0.25);
          else return chart.width + chart.obj.margin.left + chart.obj.margin.right;
        })
        .attr("height", chart.height + chart.obj.margin.top + chart.obj.margin.bottom);
      // .attr("height", function() {
      //  if (w_resize.m_view && chart.id == 0) return chart.height + chart.obj.margin.top + (chart.obj.margin.bottom * 1.5);
      //  else return chart.height + chart.obj.margin.top + chart.obj.margin.bottom;
      // });

      d3.select('svg.line-chart > g')
        .attr("transform", function() {
          if (w_resize.m_view && chart.id == 0) return "translate(" + (chart.obj.margin.left * 0.75) + "," + chart.obj.margin.top + ")";
          else if (w_resize.m_view && chart.id == 1) return "translate(" + (chart.obj.margin.left * 0.65) + "," + chart.obj.margin.top + ")";
          else return "translate(" + chart.obj.margin.left + "," + chart.obj.margin.top + ")";
        });

      if (w_resize.m_view) {
        if (w_resize.width < 360) regions.$chart_top.find('#line-chart').css('height', '470px');
        else regions.$chart_top.find('#line-chart').css('height', '400px');
      } else {
        regions.$chart_top.find('#line-chart').removeAttr('style');
      }

      chart.totalLength = [chart.path[0][0].getTotalLength(), chart.path[0][1].getTotalLength()];

      d3.select(chart.path[0][0])
        .attr("stroke-dasharray", chart.totalLength[0] + " " + chart.totalLength[0]);
      // .attr("stroke-dashoffset", 0);

      d3.select(chart.path[0][1])
        .attr("stroke-dasharray", chart.totalLength[1] + " " + chart.totalLength[1]);
      // .attr("stroke-dashoffset", 0);

      // console.log(chart1.totalLength);
    },

    draw: function() {
      if (!chart.obj.intro_played && codeLoaded) {
        chart.obj.intro_played = true;

        if (user_agent.isTouch) {
          d3.select(chart.path[0][0])
            .attr("stroke-dasharray", chart.totalLength[0] + " " + chart.totalLength[0])
            .attr("stroke-dashoffset", 0);

          d3.select(chart.path[0][1])
            .attr("stroke-dasharray", chart.totalLength[1] + " " + chart.totalLength[1])
            .attr("stroke-dashoffset", 0);
        } else {
          d3.select(chart.path[0][0])
            .attr("stroke-dasharray", chart.totalLength[0] + " " + chart.totalLength[0])
            .attr("stroke-dashoffset", chart.totalLength[0])
            .transition()
            .duration(Math.round(chart.width * 2))
            .ease(d3.easeSinInOut) //easeQuadInOut//easeCubicInOut//easeExpInOut
            // .ease("linear")
            .attr("stroke-dashoffset", 0);

          d3.select(chart.path[0][1])
            .attr("stroke-dasharray", chart.totalLength[1] + " " + chart.totalLength[1])
            .attr("stroke-dashoffset", chart.totalLength[1])
            .transition()
            .duration(Math.round(chart.width * 2))
            .ease(d3.easeSinInOut) //easeQuadInOut//easeCubicInOut//easeExpInOut
            // .ease("linear")
            .attr("stroke-dashoffset", 0);
        }

      }
    }
  };

  var chart1 = {
    title: 'All Cycles End with Inverted Yield Curves, but the U.S. Yield Curve Is Steep', //'All Cycles End with Inverted Yield Curves',
    margin: {
      top: 30,
      right: 90,
      bottom: 175,
      left: 89.5
    }, //110, left: 84.5},
    data_path: 'data/policy-us-20171121.tsv',

    key0: 'Federal Funds Rate Target',
    key1: '10-Year U.S. Treasury Yield',
    key2: '<div class="desktop-only">Fed Funds Rate: </div>Median Projection of FOMC Members',
    y_symbol: null,
    y_offset_min: -0.25,
    y_offset_max: 1,
    x_origin: 'bottom',
    footnote: 'Source: Bloomberg 10/31/2017.',
    axis_label: 'Year-over-year Point Change',

    tooltip_offset1: 105, //100,
    tooltip_offset2: 105,
    tooltip_offset3: 80,

    intro_played: false,
  };

  var chart2 = {
    title: 'Eurozone Stocks and Forward Earnings Improving',
    margin: {
      top: 30,
      right: 50,
      bottom: 175,
      left: 134.5
    }, //bottom: 110, left: 69.5},
    data_path: 'data/policy-international-20171121.tsv',

    key0: 'MSCI Euro Index',
    key1: 'MSCI Euro Index 12-Month Forward EPS',
    key2: null,
    y_symbol: '%',
    y_offset_min: -10,
    y_offset_max: 10,
    x_origin: '0',
    footnote: 'Bloomberg 10/31/2017.',
    axis_label: 'Year-over-year % Change',

    tooltip_offset1: 150, //95,
    tooltip_offset2: 65,
    tooltip_offset3: 80,

    intro_played: false,
  };


  var infograph = {
    $cont: null,
    $item: null,
    $btn: null,

    val_old: [2.3, 756, 140, 11.9],
    val_current: [31.3, 1320, 520, 21.0],
    val_unit: ['billion', 'million', 'million', 'million'],
    val_decimal: [true, false, false, true],

    init: function() {
      this.$cont = $BODY.find('section.regional .infograph-wrapper');
      this.$item = this.$cont.find('ul.canvas li');
      this.$btn = this.$cont.find('ul.selector li a');
      infograph.btn_on();
    },

    btn_on: function() {
      infograph.$btn.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $this = $(e.currentTarget),
          id = $this.parent().index();

        if (id > 0 && !infograph.$cont.hasClass('current')) {
          infograph.$cont.addClass('current');

          infograph.$item.each(function(i) {
            var $this = $(this).find('.value');
            infograph.val_update($this, infograph.val_current[i], infograph.val_unit[i], infograph.val_decimal[i]);
          });
        } else {
          infograph.$cont.removeClass('current');

          infograph.$item.each(function(j) {
            var $this = $(this).find('.value');
            infograph.val_update($this, infograph.val_old[j], infograph.val_unit[j], infograph.val_decimal[j]);
          });
        }

        if (!isLocal) {
          // OppenCore.notify({
          //   type: "ui>iframe:interaction",
          //   data: {
          //     event_name: "Content Change",
          //     content_transition_type: "Tab", // if the tab is aligned vertically, value should be "Spinal Tab"
          //     content_trigger_name: e.currentTarget.innerText,
          //     content_container_name: '.infograph-wrapper'
          //   }
          // });
        }
      });
    },

    draw: function() {
      if (!infograph.$cont.hasClass('on')) {
        infograph.$cont.addClass('on');

        infograph.$item.each(function(i) {
          var $this = $(this).find('.value');

          if (user_agent.isTouch) {
            $this.html(infograph.val_old[i] + ' ' + infograph.val_unit[i]);
            if (!$this.hasClass('on')) $this.addClass('on');
          } else {
            infograph.val_anim($this, infograph.val_old[i], infograph.val_unit[i], 125 * i);
          }
        });
      }
    },

    val_anim: function(elm, _val, _unit, _delay) {
      var num = 0,
        total = _val,
        unit = _unit,
        hasDecimal = (total % 1 != 0) ? true : false,
        add = (hasDecimal) ? 0.1 : 1;

      if (total > 100) num = total - util.randomNum(30, 60);
      if (hasDecimal) num = total - (util.randomNum(40, 70) * 0.1);

      if (num < 0) num = 0;

      num = (num % 1 != 0) ? Math.round(num * 10) / 10 : num;

      var init_val = num + ' ' + unit;
      elm.html(init_val);

      setTimeout(function() {

        var myInterval = setInterval(function() {

          if (num >= total) {
            num = total;

            clearInterval(myInterval);
            myInterval = null;
          } else {
            num += add;
          }

          num = (num % 1 != 0) ? Math.round(num * 10) / 10 : num;

          var output = num;
          if (hasDecimal && num % 1 == 0) output = output + '.0';

          elm.html(output + ' ' + unit);

        }, 30);

        if (!elm.hasClass('on')) elm.addClass('on');

      }, _delay);
    },

    val_update: function(elm, _val, _unit, _decimal) {
      var cur = elm.html(),
        num = Number(cur.substr(0, cur.length - 7)),
        total = _val,
        unit = _unit,
        hasDecimal = _decimal,
        diff = (hasDecimal) ? 0.1 : 1,
        add = true;

      // if (cur.substr(cur.length - 7, cur.length) == 'billion') num = num * 1000;

      if (total > num) add = true;
      else add = false;

      // diff = Math.abs(total - num) / util.randomNum(10, 20);
      // if (hasDecimal) diff = diff * 0.1;

      if (hasDecimal) diff = (util.randomNum(15, 20) * 0.1);
      else diff = util.randomNum(40, 50);

      // console.log(num + ", " + total + ", " + hasDecimal + ", " + diff);
      num = (num % 1 != 0) ? Math.round(num * 10) / 10 : num;

      if (user_agent.isTouch) {
        num = total;
        num = (num % 1 != 0) ? Math.round(num * 10) / 10 : num;

        var output = num;

        if (num >= 1000) {
          output = num * 0.001;
          output = Math.round(output * 100) / 100;
          unit = 'billion';
        }

        if (hasDecimal && num % 1 == 0) output = output + '.0';
        elm.html(output + ' ' + unit);
      } else {
        var myInterval = setInterval(function() {
          if (add) {
            if (num >= total) {
              num = total;

              clearInterval(myInterval);
              myInterval = null;
            } else {
              num += diff;
            }
          } else {
            if (num <= total) {
              num = total;

              clearInterval(myInterval);
              myInterval = null;
            } else {
              num -= diff;
            }
          }

          num = (num % 1 != 0) ? Math.round(num * 10) / 10 : num;

          var output = num;

          if (num >= 1000) {
            output = num * 0.001;
            output = Math.round(output * 100) / 100;
            unit = 'billion';
          }


          if (hasDecimal && num % 1 == 0) output = output + '.0';
          elm.html(output + ' ' + unit);

        }, 30);
      }
    }
  };


  var column = {
    tooltip: null,
    initiated: false,

    id: 0,
    data_path: 'data/valuation-2018-11-30.tsv',

    // margin: {top: 20, right: 60, bottom: 80, left: 74.5},
    // margin: {top: 30, right: 20, bottom: 40, left: 39.5},
    // margin: {top: 30, right: 20, bottom: 70, left: 39.5},
    margin: {
      top: 30,
      right: 20,
      bottom: 70,
      left: 74.5
    },

    width: 0,
    height: 0,
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
    xAxis1: null,
    xAxis2: null,
    yAxis1: null,
    yAxis2: null,
    line1: null,
    line2: null,
    svg1: null,
    svg2: null,

    data: null,
    group: null,
    item1: null,
    item2: null,
    point1: null,
    point2: null,
    pattern1: null,
    pattern2: null,
    bar1: null,
    bar2: null,

    intro_played: [false, false, false],

    init: function(id) {
      if (!column.initiated) {
        // column.initiated = true;

        column.id = id;
        column.tooltip = d3.select('.column-wrapper > .chart-tooltip');

        column.width = regions.$column_top.width() - column.margin.left - column.margin.right;
        column.height = regions.$column_top.height() - column.margin.top - column.margin.bottom;

        column.set_var('#column-chart-', 'column-chart');
        column.load_data(CODE_PATH + column.data_path); //, '#column-chart-');
      }
    },

    set_var: function(_name, _class) {
      column.x1 = d3.scale.ordinal().rangeBands([0, column.width], 0); //0.1);
      // .range([0, column.width]);
      column.x2 = d3.scale.ordinal().rangeBands([0, column.width], 0); //0.1);

      column.y1 = d3.scale.linear().range([column.height, 0]);
      column.y2 = d3.scale.linear().range([column.height, 0]); //[0, column.height]);

      column.xAxis1 = d3.svg.axis()
        .scale(column.x1)
        .innerTickSize(0)
        .outerTickSize(0)
        .orient("bottom");

      column.xAxis2 = d3.svg.axis()
        .scale(column.x2)
        .innerTickSize(0)
        .outerTickSize(0)
        .orient("bottom");

      column.yAxis1 = d3.svg.axis()
        .scale(column.y1)
        .ticks(5)
        .innerTickSize(5)
        .outerTickSize(0)
        .orient("left");

      var orientDir = (w_resize.m_view) ? "left" : "right";

      column.yAxis2 = d3.svg.axis()
        .scale(column.y2)
        .ticks(5)
        .innerTickSize(5)
        .outerTickSize(0)
        .orient(orientDir);

      column.line1 = d3.svg.line()
        .interpolate("basis")
        .x(function(d) {
          return column.x1(d.item);
        })
        .y(function(d) {
          return column.y1(d.value);
        });

      column.line2 = d3.svg.line()
        .interpolate("basis")
        .x(function(d) {
          return column.x2(d.item);
        })
        .y(function(d) {
          return column.y2(d.value);
        });

      column.svg1 = d3.select(_name + 'left').append("svg").attr('class', _class)
        .attr("width", column.width + column.margin.left + column.margin.right)
        .attr("height", column.height + column.margin.top + column.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + column.margin.left + "," + column.margin.top + ")");

      column.svg2 = d3.select(_name + 'right').append("svg").attr('class', _class)
        .attr("width", column.width + column.margin.left + column.margin.right)
        .attr("height", column.height + column.margin.top + column.margin.bottom)
        .append("g")
        // .attr("transform", "translate(" + column.margin.left + "," + column.margin.top + ")");
        .attr("transform", function() {
          if (w_resize.m_view) return "translate(" + column.margin.left + "," + column.margin.top + ")";
          else return "translate(" + column.margin.right + "," + column.margin.top + ")";
        });
    },

    load_data: function(_path) {
      d3.tsv(_path, function(error, d) {
        column.data = d;

        column.group = {
          equity: [],
          fixed_income: []
        };

        column.data.map(function(d, i) {
          if (i <= 2) {
            column.group.equity.push({
              name: d.item,
              values: {
                "Current": +d.Current,
                "Average": +d.Average,
                "Discount/Premium": +d['Discount/Premium']
              },
              tooltip: d.Tooltip
            });
          } else {
            column.group.fixed_income.push({
              name: d.item,
              values: {
                "Current": +d.Current,
                "Average": +d.Average,
                "Discount/Premium": +d['Discount/Premium']
              },
              tooltip: d.Tooltip
            });
          }
        });

        column.x1.domain(column.group.equity.map(function(d) {
          return d.name;
        }));
        column.x2.domain(column.group.fixed_income.map(function(d) {
          return d.name;
        }));

        column.y1.domain([
          d3.min(column.group.equity, function(d) {
            return 0;
          }),
          d3.max(column.group.equity, function(d) {
            return d.values.Current + 0.035;
          })
        ]);

        column.y2.domain([
          d3.min(column.group.fixed_income, function(d) {
            return 0;
          }),
          d3.max(column.group.fixed_income, function(d) {
            return d.values.Current + 0.035;
          })
        ]);



        column.svg1.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0, " + (column.height - 0.5) + ")")
          .call(column.xAxis1)
          .selectAll('text')
          .attr("transform", "translate(0, 20)") //-10)")
          .call(column.wrapper, column.x1.rangeBand());

        column.svg2.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0, " + (column.height - 0.5) + ")")
          .call(column.xAxis2)
          .selectAll('text')
          .attr("transform", "translate(0, 20)") //-10)")
          .call(column.wrapper, column.x2.rangeBand());



        column.svg1.append("g")
          .attr("class", "y axis")
          .call(column.yAxis1)
          .selectAll('text')
          .attr("transform", "translate(-10, 0)");

        column.svg2.append("g")
          .attr("class", "y axis")
          .attr("transform", function() {
            if (!w_resize.m_view) return "translate(" + (column.width - 0) + ", 0)";
          })
          .call(column.yAxis2)
          .selectAll('text')
          .attr("transform", function() {
            if (w_resize.m_view) return "translate(-10, 0)";
            else return "translate(10, 0)";
          });



        for (var i = 0; i < (column.group.equity.length - 1); i++) {
          column.svg1.append("line")
            .attr({
              "class": "divider-line" + i,
              "x1": column.width * (0.3333 * (i + 1)),
              "x2": column.width * (0.3333 * (i + 1)),
              "y1": 0, //20,
              "y2": column.height, // - 20,
              "fill": "none",
              "shape-rendering": "crispEdges",
              "stroke": "#f3f3f3", //"#2f2f2f",//
              "stroke-width": "1px"
            });
        }

        for (var i = 0; i < (column.group.fixed_income.length - 1); i++) {
          column.svg2.append("line")
            .attr({
              "class": "divider-line" + i,
              "x1": column.width * (0.3333 * (i + 1)),
              "x2": column.width * (0.3333 * (i + 1)),
              "y1": 0, //20,
              "y2": column.height, // - 20,
              "fill": "none",
              "shape-rendering": "crispEdges",
              "stroke": "#f3f3f3", //"#2f2f2f",//
              "stroke-width": "1px"
            });
        }



        column.svg1.append("line")
          .attr({
            "class": "controlled-xAxis",
            "x1": 0,
            "x2": column.width,
            "y1": column.y1(0),
            "y2": column.y1(0),
            "fill": "none",
            "shape-rendering": "crispEdges",
            "stroke": "#cfcfcf", //"#dfdfdf",//"#1f1f1f",//
            "stroke-width": "1px"
          });

        column.svg2.append("line")
          .attr({
            "class": "controlled-xAxis",
            "x1": 0,
            "x2": column.width,
            "y1": column.y2(0),
            "y2": column.y2(0),
            "fill": "none",
            "shape-rendering": "crispEdges",
            "stroke": "#cfcfcf", //"#dfdfdf",//"#2f2f2f",//
            "stroke-width": "1px"
          });



        column.svg1.append("text")
          .attr("class", "axis-label")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + (-1 * column.margin.left * 0.75) + ", " + (column.height * 0.5 + 5) + ") rotate(-90)")
          .text('Price-to-Sales Ratio');

        column.svg2.append("text")
          .attr("class", "axis-label")
          .attr("text-anchor", "middle")
          .attr("transform", function() {
            if (w_resize.m_view) return "translate(" + (-1 * column.margin.left * 0.75) + ", " + (column.height * 0.5 + 5) + ") rotate(-90)";
            else return "translate(" + (column.width + (column.margin.left * 0.75) + 10) + ", " + (column.height * 0.5 + 5) + ") rotate(-90)";
          })
          .text('Basis points');



        column.item1 = column.svg1.selectAll(".bar")
          .data(column.group.equity)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) {
            return column.x1(d.name) + (column.x1.rangeBand() * 0.3);
          })
          .attr("width", column.x1.rangeBand() * 0.4)
          .attr("fill", function(d, i) {
            if (i == column.id) return '#bfd916';
            else return '#dfdfdf';
          })
          .attr("height", function(d) {
            if (column.intro_played[column.id]) return Math.abs(column.y1(d.values.Current) - column.y1(0));
            else return 0;
          })
          .attr("y", function(d) {
            if (column.intro_played[column.id]) {
              if (d.values.Current > 0) return column.y1(d.values.Current);
              else return column.y1(0);
            } else {
              return column.y1(0);
            }
          });

        column.item2 = column.svg2.selectAll(".bar")
          .data(column.group.fixed_income)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) {
            return column.x2(d.name) + (column.x2.rangeBand() * 0.3);
          })
          .attr("width", column.x2.rangeBand() * 0.4)
          .attr("fill", function(d, i) {
            if (i == column.id) return '#bfd916';
            else return '#dfdfdf';
          })
          .attr("height", function(d) {
            if (column.intro_played[column.id]) return Math.abs(column.y2(d.values.Current) - column.y2(0));
            else return 0;
          })
          .attr("y", function(d) {
            if (column.intro_played[column.id]) {
              if (d.values.Current > 0) return column.y2(d.values.Current);
              else return column.y2(0);
            } else {
              return column.y2(0);
            }
          });



        column.svg1.append('defs')
          .append('pattern')
          .attr('id', 'diagonalHatch')
          .attr('patternUnits', 'userSpaceOnUse')
          // .attr('width', 4)
          // .attr('height', 4)
          .attr('width', 8)
          .attr('height', 8)
          .append('path')
          // .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
          .attr('d', 'M-1,1 l4,-4 M0,8 l8,-8 M6,10 l4,-4')
          .attr('stroke', '#000000')
          .attr('stroke-width', 1)
          .attr('stroke-opacity', 0.5);



        column.pattern1 = column.svg1.selectAll(".pattern")
          .data(column.group.equity)
          .enter().append("rect")
          .attr("class", "pattern")
          .attr("x", function(d) {
            return column.x1(d.name) + (column.x1.rangeBand() * 0.3);
          })
          .attr("y", function(d) {
            if (column.intro_played[column.id]) {
              if (d.values.Current > d.values.Average) return column.y1(d.values.Current);
              else return column.y1(d.values.Average);
            } else {
              if (d.values.Current > d.values.Average) return column.y1(d.values.Average);
              else return column.y1(d.values.Current);
            }
          })
          .attr("width", column.x1.rangeBand() * 0.4)
          .attr("height", function(d) {
            if (column.intro_played[column.id]) return Math.abs(column.y1(d.values.Current) - column.y1(d.values.Average));
            else return 0;
          })
          .attr('fill', 'url(#diagonalHatch)')
          .attr('stroke', '#afafaf')
          .attr('stroke-width', 1)
          .attr('stroke-opacity', 1);

        column.pattern2 = column.svg2.selectAll(".pattern")
          .data(column.group.fixed_income)
          .enter().append("rect")
          .attr("class", "pattern")
          .attr("x", function(d) {
            return column.x2(d.name) + (column.x2.rangeBand() * 0.3);
          })
          .attr("y", function(d) {
            if (column.intro_played[column.id]) {
              if (d.values.Current > d.values.Average) return column.y2(d.values.Current);
              else return column.y2(d.values.Average);
            } else {
              if (d.values.Current > d.values.Average) return column.y2(d.values.Average);
              else return column.y2(d.values.Current);
            }
          })
          .attr("width", column.x2.rangeBand() * 0.4)
          .attr("height", function(d) {
            if (column.intro_played[column.id]) return Math.abs(column.y2(d.values.Current) - column.y2(d.values.Average));
            else return 0;
          })
          .attr('fill', 'url(#diagonalHatch)')
          .attr('stroke', '#afafaf')
          .attr('stroke-width', 1)
          .attr('stroke-opacity', 1);



        column.point1 = column.svg1.selectAll(".point")
          .data(column.group.equity)
          .enter().append("path")
          .attr("class", "point")
          .attr("d", d3.svg.symbol().type("circle"))
          .attr("transform", function(d, i) {
            var myHalf = (column.width * 0.3333) * 0.5,
              myX = myHalf + (column.width * (0.3333 * i));

            return "translate(" + myX + ", " + column.y1(d.values.Average) + ")";
          });

        column.point2 = column.svg2.selectAll(".point")
          .data(column.group.fixed_income)
          .enter().append("path")
          .attr("class", "point")
          .attr("d", d3.svg.symbol().type("circle"))
          .attr("transform", function(d, i) {
            var myHalf = (column.width * 0.3333) * 0.5,
              myX = myHalf + (column.width * (0.3333 * i));

            return "translate(" + myX + ", " + column.y2(d.values.Average) + ")";
          });



        column.bar1 = column.svg1.selectAll(".bar-frame")
          .data(column.group.equity)
          .enter().append("rect")
          .attr("class", "bar-frame")
          .attr("x", function(d) {
            return column.x1(d.name) + (column.x1.rangeBand() * 0.3);
          })
          .attr("width", column.x1.rangeBand() * 0.4)
          .attr("fill", '#ffffff')
          .attr("fill-opacity", 0)
          .style("stroke", '#000000') //'#afafaf')
          .attr("stroke-opacity", function() {
            if (column.intro_played[column.id]) return 0.25; //1;
            else return 0;
          })
          .attr("y", function(d) {
            if (d.values.Current > d.values.Average) return column.y1(d.values.Current);
            else return column.y1(d.values.Average);
          })
          .attr("height", function(d) {
            if (d.values.Current > d.values.Average) return Math.abs(column.y1(d.values.Current) - column.y1(0));
            else return Math.abs(column.y1(d.values.Average) - column.y1(0));
          });

        column.bar2 = column.svg2.selectAll(".bar-frame")
          .data(column.group.fixed_income)
          .enter().append("rect")
          .attr("class", "bar-frame")
          .attr("x", function(d) {
            return column.x2(d.name) + (column.x2.rangeBand() * 0.3);
          })
          .attr("width", column.x2.rangeBand() * 0.4)
          .attr("fill", '#ffffff')
          .attr("fill-opacity", 0)
          .style("stroke", '#000000') //'#afafaf')
          .attr("stroke-opacity", function() {
            if (column.intro_played[column.id]) return 0.25; //1;
            else return 0;
          })
          .attr("y", function(d) {
            if (d.values.Current > d.values.Average) return column.y2(d.values.Current);
            else return column.y2(d.values.Average);
          })
          .attr("height", function(d) {
            if (d.values.Current > d.values.Average) return Math.abs(column.y2(d.values.Current) - column.y2(0));
            else return Math.abs(column.y2(d.values.Average) - column.y2(0));
          });


        column.initiated = true;
        column.set_ui();
      });
    },

    column_hover_timer: null,

    set_ui: function() {
      column.bar1.on("mouseover", function(d, i) {
        if (!w_resize.m_view) {
          var mW = column.width * 0.3333,
            mDiff = mW * 0.7;

          var mX = mW * i + column.margin.left + mDiff,
            mY = column.y1(d.values.Current * 0.5);

          if (mX < 0) mX = 0;

          column.tooltip.style("display", "inline-block");
          // d3.select(this).style('stroke', '#4c4c4c');
          d3.select(this).attr('stroke-opacity', 0.75);

          var data_diff = util.roundNum(d.values['Discount/Premium'], 2),
            tooltip_text = '<div class="name">' + d.name + '</div>';

          tooltip_text += '<div class="stat">Current: <div class="value">' + util.roundNum(d.values.Current, 2) + '</div></div>';
          tooltip_text += '<div class="stat">Average: <div class="value">' + util.roundNum(d.values.Average, 2) + '</div></div>';
          tooltip_text += '<div class="stat">' + ((data_diff >= 0) ? 'Premium' : 'Discount') + ': <div class="value">' + data_diff + '</div></div>';
          tooltip_text += '<p>' + d.tooltip + '</p>';
          // tooltip_text += '<div class="stat">Current: <div class="value">' + util.roundNum(d.values.Current) + '</div></div>';

          column.tooltip.html(tooltip_text)
            .style("left", function() {
              return (mX + 20) + "px";
            })
            .style("top", function() {
              var tH = $(this).outerHeight();
              return (mY - (tH * 0.15)) + "px";

            });

          column.tooltip.classed('right', false);

          window.clearTimeout(column.column_hover_timer);

          if (!isLocal) {
            column.column_hover_timer = window.setTimeout(function() {
              // OppenCore.notify({
              //   type: "ui>iframe:interaction",
              //   data: {
              //     event_name: "Chart Interaction",
              //     chart_name: 'Equity',
              //     chart_type: 'Column',
              //     chart_interaction_value: d.name,
              //     chart_interaction_type: 'Hover',
              //     chart_interaction_area: 'Bar',
              //     chart_tooltip_type: 'Content'
              //   }
              // });
            }, 1000);
          }
        }
      }).on("mouseout", function(d) {
        window.clearTimeout(column.column_hover_timer);
        column.tooltip.style("display", "none");
        // d3.select(this).style('stroke', '#afafaf');
        d3.select(this).attr('stroke-opacity', 0.25);
      });

      column.bar2.on("mouseover", function(d, i) {
        if (!w_resize.m_view) {
          var mW = column.width * 0.3333,
            mDiff = mW * 0.7;

          var mX = mW * (i + 3) + column.margin.right + column.margin.right + column.margin.left + mDiff,
            mY = column.y2(d.values.Current * 0.5);

          if (mX < 0) mX = 0;

          column.tooltip.style("display", "inline-block");
          // d3.select(this).style('stroke', '#4c4c4c');
          d3.select(this).attr('stroke-opacity', 0.75);

          var data_diff = util.roundNum(d.values['Discount/Premium']),
            tooltip_text = '<div class="name">' + d.name + '</div>';

          tooltip_text += '<div class="stat">Current: <div class="value">' + util.roundNum(d.values.Current, 2) + '</div></div>';
          tooltip_text += '<div class="stat">Average: <div class="value">' + util.roundNum(d.values.Average, 2) + '</div></div>';
          tooltip_text += '<div class="stat">' + ((data_diff >= 0) ? 'Premium' : 'Discount') + ': <div class="value">' + data_diff + '</div></div>';
          tooltip_text += '<p>' + d.tooltip + '</p>';

          column.tooltip.html(tooltip_text)
            .style("left", function() {
              var tW = 390; //420;
              return (mX - tW - (mW * 0.4) - 20) + "px";
              // if (i < 1)
              // {
              //  return (mX + 20) + "px";
              // }
              // else
              // {
              //  var tW = 380;//420;
              //  return (mX - tW - (mW * 0.4) - 20) + "px";
              // }
            })
            .style("top", function() {
              var tH = $(this).outerHeight();
              return (mY - (tH * 0.15)) + "px";

            });

          // if (i < 1) column.tooltip.classed('right', false);
          // else column.tooltip.classed('right', true);
          column.tooltip.classed('right', true);

          window.clearTimeout(column.column_hover_timer);

          if (!isLocal) {
            column.column_hover_timer = window.setTimeout(function() {
              // OppenCore.notify({
              //   type: "ui>iframe:interaction",
              //   data: {
              //     event_name: "Chart Interaction",
              //     chart_name: 'Fixed Income',
              //     chart_type: 'Column',
              //     chart_interaction_value: d.name,
              //     chart_interaction_type: 'Hover',
              //     chart_interaction_area: 'Bar',
              //     chart_tooltip_type: 'Content'
              //   }
              // });
            }, 1000);
          }
        }
      }).on("mouseout", function(d) {
        window.clearTimeout(column.column_hover_timer);
        column.tooltip.style("display", "none");
        // d3.select(this).style('stroke', '#afafaf');
        d3.select(this).attr('stroke-opacity', 0.25);
      });

    },

    update: function(id) {
      column.id = id;


      column.item1
        .attr("fill", function(d, i) {
          if (i == column.id) return '#bfd916';
          else return '#dfdfdf';
        })
        .attr("height", function(d) {
          if (column.intro_played[column.id]) return Math.abs(column.y1(d.values.Current) - column.y1(0));
          else return 0;
        })
        .attr("y", function(d) {
          if (column.intro_played[column.id]) {
            if (d.values.Current > 0) return column.y1(d.values.Current);
            else return column.y1(0);
          } else {
            return column.y1(0);
          }
        });

      column.item2
        .attr("fill", function(d, i) {
          if (i == column.id) return '#bfd916';
          else return '#dfdfdf';
        })
        .attr("height", function(d) {
          if (column.intro_played[column.id]) return Math.abs(column.y2(d.values.Current) - column.y2(0));
          else return 0;
        })
        .attr("y", function(d) {
          if (column.intro_played[column.id]) {
            if (d.values.Current > 0) return column.y2(d.values.Current);
            else return column.y2(0);
          } else {
            return column.y2(0);
          }
        });


      column.pattern1
        .attr("y", function(d) {
          if (column.intro_played[column.id]) {
            if (d.values.Current > d.values.Average) return column.y1(d.values.Current);
            else return column.y1(d.values.Average);
          } else {
            if (d.values.Current > d.values.Average) return column.y1(d.values.Average);
            else return column.y1(d.values.Current);
          }
        })
        .attr("height", function(d) {
          if (column.intro_played[column.id]) return Math.abs(column.y1(d.values.Current) - column.y1(d.values.Average));
          else return 0;
        });

      column.pattern2
        .attr("y", function(d) {
          if (column.intro_played[column.id]) {
            if (d.values.Current > d.values.Average) return column.y2(d.values.Current);
            else return column.y2(d.values.Average);
          } else {
            if (d.values.Current > d.values.Average) return column.y2(d.values.Average);
            else return column.y2(d.values.Current);
          }
        })
        .attr("height", function(d) {
          if (column.intro_played[column.id]) return Math.abs(column.y2(d.values.Current) - column.y2(d.values.Average));
          else return 0;
        });


      column.bar1
        .attr("stroke-opacity", function() {
          if (column.intro_played[column.id]) return 0.25; //1;
          else return 0;
        });

      column.bar2
        .attr("stroke-opacity", function() {
          if (column.intro_played[column.id]) return 0.25; //1;
          else return 0;
        });
    },

    resize: function() {
      column.width = regions.$column_top.width() - column.margin.left - column.margin.right;

      column.x1 = d3.scale.ordinal().rangeBands([0, column.width], 0);
      column.x2 = d3.scale.ordinal().rangeBands([0, column.width], 0);

      column.xAxis1.scale(column.x1);
      column.xAxis2.scale(column.x2);

      var orientDir = (w_resize.m_view) ? "left" : "right";

      column.yAxis2
        .scale(column.y2)
        .orient(orientDir);

      column.x1.domain(column.group.equity.map(function(d) {
        return d.name;
      }));
      column.x2.domain(column.group.fixed_income.map(function(d) {
        return d.name;
      }));

      column.y1.domain([
        d3.min(column.group.equity, function(d) {
          return 0;
        }),
        d3.max(column.group.equity, function(d) {
          return d.values.Current + 0.035;
        })
      ]);

      column.y2.domain([
        d3.min(column.group.fixed_income, function(d) {
          return 0;
        }),
        d3.max(column.group.fixed_income, function(d) {
          return d.values.Current + 0.035;
        })
      ]);


      column.svg1.select("g.x.axis")
        .attr("transform", "translate(0, " + (column.height - 0.5) + ")")
        .call(column.xAxis1)
        .selectAll('text')
        .attr("transform", "translate(0, 20)")
        .call(column.wrapper, column.x1.rangeBand());

      column.svg2.select("g.x.axis")
        .attr("transform", "translate(0, " + (column.height - 0.5) + ")")
        .call(column.xAxis2)
        .selectAll('text')
        .attr("transform", "translate(0, 20)")
        .call(column.wrapper, column.x2.rangeBand());


      column.svg1.select("g.y.axis")
        .call(column.yAxis1);

      column.svg2.select("g.y.axis")
        .attr("transform", function() {
          if (!w_resize.m_view) return "translate(" + (column.width - 0) + ", 0)";
        })
        .call(column.yAxis2)
        .selectAll('text')
        .attr("transform", function() {
          if (w_resize.m_view) return "translate(-10, 0)";
          else return "translate(10, 0)";
        });


      column.line1 = d3.svg.line()
        .interpolate("basis")
        .x(function(d) {
          return column.x1(d.item);
        });

      column.line2 = d3.svg.line()
        .interpolate("basis")
        .x(function(d) {
          return column.x2(d.item);
        });


      for (var i = 0; i < (column.group.equity.length - 1); i++) {
        column.svg1.select("line.divider-line" + i)
          .attr({
            "x1": column.width * (0.3333 * (i + 1)),
            "x2": column.width * (0.3333 * (i + 1)),
            "y1": 0, //20,
            "y2": column.height
          });

        column.svg2.select("line.divider-line" + i)
          .attr({
            "x1": column.width * (0.3333 * (i + 1)),
            "x2": column.width * (0.3333 * (i + 1)),
            "y1": 0, //20,
            "y2": column.height
          });
      }


      column.svg1.select("line.controlled-xAxis")
        .attr({
          "x1": 0,
          "x2": column.width,
          "y1": column.y1(0),
          "y2": column.y1(0)
        });

      column.svg2.select("line.controlled-xAxis")
        .attr({
          "x1": 0,
          "x2": column.width,
          "y1": column.y2(0),
          "y2": column.y2(0)
        });


      column.svg2.select("text.axis-label")
        .attr("transform", function() {
          if (w_resize.m_view) return "translate(" + (-1 * column.margin.left * 0.75) + ", " + (column.height * 0.5 + 5) + ") rotate(-90)";
          else return "translate(" + (column.width + (column.margin.left * 0.75) + 10) + ", " + (column.height * 0.5 + 5) + ") rotate(-90)";
        });


      column.item1
        .attr("x", function(d) {
          return column.x1(d.name) + (column.x1.rangeBand() * 0.3);
        })
        .attr("width", column.x1.rangeBand() * 0.4)
        .attr("height", function(d) {
          if (column.intro_played[column.id]) return Math.abs(column.y1(d.values.Current) - column.y1(0));
          else return 0;
        })
        .attr("y", function(d) {
          if (column.intro_played[column.id]) {
            if (d.values.Current > 0) return column.y1(d.values.Current);
            else return column.y1(0);
          } else {
            return column.y1(0);
          }
        });

      column.item2
        .attr("x", function(d) {
          return column.x2(d.name) + (column.x2.rangeBand() * 0.3);
        })
        .attr("width", column.x2.rangeBand() * 0.4)
        .attr("height", function(d) {
          if (column.intro_played[column.id]) return Math.abs(column.y2(d.values.Current) - column.y2(0));
          else return 0;
        })
        .attr("y", function(d) {
          if (column.intro_played[column.id]) {
            if (d.values.Current > 0) return column.y2(d.values.Current);
            else return column.y2(0);
          } else {
            return column.y2(0);
          }
        });


      column.pattern1
        .attr("x", function(d) {
          return column.x1(d.name) + (column.x1.rangeBand() * 0.3);
        })
        .attr("y", function(d) {
          if (column.intro_played[column.id]) {
            if (d.values.Current > d.values.Average) return column.y1(d.values.Current);
            else return column.y1(d.values.Average);
          } else {
            if (d.values.Current > d.values.Average) return column.y1(d.values.Average);
            else return column.y1(d.values.Current);
          }
        })
        .attr("width", column.x1.rangeBand() * 0.4)
        .attr("height", function(d) {
          if (column.intro_played[column.id]) return Math.abs(column.y1(d.values.Current) - column.y1(d.values.Average));
          else return 0;
        });

      column.pattern2
        .attr("x", function(d) {
          return column.x2(d.name) + (column.x2.rangeBand() * 0.3);
        })
        .attr("y", function(d) {
          if (column.intro_played[column.id]) {
            if (d.values.Current > d.values.Average) return column.y2(d.values.Current);
            else return column.y2(d.values.Average);
          } else {
            if (d.values.Current > d.values.Average) return column.y2(d.values.Average);
            else return column.y2(d.values.Current);
          }
        })
        .attr("width", column.x2.rangeBand() * 0.4)
        .attr("height", function(d) {
          if (column.intro_played[column.id]) return Math.abs(column.y2(d.values.Current) - column.y2(d.values.Average));
          else return 0;
        });


      column.bar1
        .attr("x", function(d) {
          return column.x1(d.name) + (column.x1.rangeBand() * 0.3);
        })
        .attr("width", column.x1.rangeBand() * 0.4);

      column.bar2
        .attr("x", function(d) {
          return column.x2(d.name) + (column.x2.rangeBand() * 0.3);
        })
        .attr("width", column.x2.rangeBand() * 0.4);


      column.point1
        .attr("transform", function(d, i) {
          var myHalf = (column.width * 0.3333) * 0.5,
            myX = myHalf + (column.width * (0.3333 * i));

          return "translate(" + myX + ", " + column.y1(d.values.Average) + ")";
        });

      column.point2
        .attr("transform", function(d, i) {
          var myHalf = (column.width * 0.3333) * 0.5,
            myX = myHalf + (column.width * (0.3333 * i));

          return "translate(" + myX + ", " + column.y2(d.values.Average) + ")";
        });


      column.svg1.attr("width", (column.width + column.margin.left + column.margin.right) + 'px');

      column.svg2
        .attr("width", (column.width + column.margin.left + column.margin.right) + 'px')
        .attr("transform", function() {
          if (w_resize.m_view) return "translate(" + column.margin.left + "," + column.margin.top + ")";
          else return "translate(" + column.margin.right + "," + column.margin.top + ")";
        });

      d3.selectAll('svg.column-chart').attr("width", (column.width + column.margin.left + column.margin.right) + 'px');
    },

    draw: function() {
      if (!column.intro_played[column.id]) {
        column.intro_played[column.id] = true;

        if (user_agent.isTouch) {
          column.item1
            .attr("height", function(d) {
              return Math.abs(column.y1(d.values.Current) - column.y1(0));
            })
            .attr("y", function(d) {
              if (d.values.Current > 0) return column.y1(d.values.Current);
              else return column.y1(0);
            });

          column.item2
            .attr("height", function(d) {
              return Math.abs(column.y2(d.values.Current) - column.y2(0));
            })
            .attr("y", function(d) {
              if (d.values.Current > 0) return column.y2(d.values.Current);
              else return column.y2(0);
            });


          column.pattern1
            .attr("height", function(d) {
              return Math.abs(column.y1(d.values.Current) - column.y1(d.values.Average));
            })
            .attr("y", function(d) {
              if (d.values.Current > d.values.Average) return column.y1(d.values.Current);
              else return column.y1(d.values.Average);
            });

          column.pattern2
            .attr("height", function(d) {
              return Math.abs(column.y2(d.values.Current) - column.y2(d.values.Average));
            })
            .attr("y", function(d) {
              if (d.values.Current > d.values.Average) return column.y2(d.values.Current);
              else return column.y2(d.values.Average);
            });


          column.bar1
            .attr("stroke-opacity", 0.25); //1);

          column.bar2
            .attr("stroke-opacity", 0.25); //1);
        } else {
          column.item1
            .attr("y", column.y1(0))
            .attr("height", 0)
            .transition()
            .duration(500)
            .delay(function(d, i) {
              return (i * 250);
            })
            .ease(d3.easeSinInOut)
            .attr("height", function(d) {
              return Math.abs(column.y1(d.values.Current) - column.y1(0));
            })
            .attr("y", function(d) {
              if (d.values.Current > 0) return column.y1(d.values.Current);
              else return column.y1(0);
            });

          column.item2
            .attr("y", column.y2(0))
            .attr("height", 0)
            .transition()
            .duration(500)
            .delay(function(d, i) {
              return (i * 250);
            })
            .ease(d3.easeSinInOut)
            .attr("height", function(d) {
              return Math.abs(column.y2(d.values.Current) - column.y2(0));
            })
            .attr("y", function(d) {
              if (d.values.Current > 0) return column.y2(d.values.Current);
              else return column.y2(0);
            });


          column.pattern1
            .attr("y", function(d) {
              if (d.values.Current > d.values.Average) return column.y1(d.values.Average);
              else return column.y1(d.values.Current);
            })
            .attr("height", 0)
            .transition()
            .duration(250)
            .delay(function(d, i) {
              return (i * 250) + 250;
            })
            .ease(d3.easeSinInOut)
            .attr("height", function(d) {
              return Math.abs(column.y1(d.values.Current) - column.y1(d.values.Average));
            })
            .attr("y", function(d) {
              if (d.values.Current > d.values.Average) return column.y1(d.values.Current);
              else return column.y1(d.values.Average);
            });

          column.pattern2
            .attr("y", function(d) {
              if (d.values.Current > d.values.Average) return column.y2(d.values.Average);
              else return column.y2(d.values.Current);
            })
            .attr("height", 0)
            .transition()
            .duration(250)
            .delay(function(d, i) {
              return (i * 250) + 250;
            })
            .ease(d3.easeQuadInOut)
            .attr("height", function(d) {
              return Math.abs(column.y2(d.values.Current) - column.y2(d.values.Average));
            })
            .attr("y", function(d) {
              if (d.values.Current > d.values.Average) return column.y2(d.values.Current);
              else return column.y2(d.values.Average);
            });


          column.bar1
            .attr("stroke-opacity", 0)
            .transition()
            .duration(250)
            .delay(function(d, i) {
              return (i * 250) + 500;
            })
            .ease(d3.easeQuadInOut)
            .attr("stroke-opacity", 0.25); //1);

          column.bar2
            .attr("stroke-opacity", 0)
            .transition()
            .duration(250)
            .delay(function(d, i) {
              return (i * 250) + 500;
            })
            .ease(d3.easeQuadInOut)
            .attr("stroke-opacity", 0.25); //1);
        }
      }
    },

    wrapper: function(text, width) {
      text.each(function() {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.2, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));

          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }
  };


  var assets = {

    $cont: null,
    $table: null,
    $row_btn: null,
    $detail_btn: null,
    $fund_btn: null,
    $detail_all: null,
    $detail_close: null,

    detail_box_elm: null,
    detail_content_elm: null,

    table_data: [
      ['left', 'left', 'right'],
      ['left', 'left', 'left']
    ],

    init: function() {
      this.$cont = $CONTENT.find('section#asset-class');
      this.$table = this.$cont.find('.table');
      this.$instructions = this.$cont.find('.bb-tool-tip');

      this.$row_btn = this.$table.find('.asset-row');
      this.$detail_btn = this.$table.find('.asset-row .asset-column a.asset-detail');
      this.$fund_btn = this.$table.find('.asset-row .asset-column a.fund');
      this.$detail_all = this.$table.find('.detail-row');
      this.$detail_close = this.$table.find('.detail-row a.close-btn');

      this.$detail_all.css('height', 0);

      this.$row_btn.on('click', this.detail_box_open.bind(this));
      this.$detail_btn.on('click', this.detail_box_open.bind(this));

      this.$detail_close.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $this = $(e.currentTarget);

        assets.detail_box_close();
        assets.$cont.removeClass('detail-opened');

        if (!isLocal) {
          // OppenCore.notify({
          //   type: "ui>iframe:interaction",
          //   data: {
          //     event_name: "Close Content",
          //     content_container_name: "#asset-class .detail-content", //Description of the Content being closed. Eg: Banner / Video
          //     trigger_type: "Icon", // Anchor/ Button / Icon / Block / Image / Text
          //     trigger_text: $this.text(), // Text
          //     content_container: '.detail-row', // target
          //     content_type: "Block" // Target type. Can be Table / Table Rows / List / Block / Other
          //   }
          // });
        }
        setTimeout(function() {
          nav.set_section_pos();
        }, 525);
      });

      this.$fund_btn.on('mouseover', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $this = $(e.currentTarget),
          $prev = $this.prev();

        if (!$prev.hasClass('off')) $prev.addClass('off');
      });

      this.$fund_btn.on('mouseout', function(e) {
        e.preventDefault();
        e.stopPropagation();

        assets.$detail_btn.removeClass('off');
      });

      this.$fund_btn.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $this = $(e.currentTarget),
          url = DOMAIN + CHANNEL + $this.attr("href").substring(2); //util.escapeHTML($this.attr("href"));

        if (!isLocal) {
          // OppenCore.notify({
          //   type: "ui>iframe:interaction",
          //   data: {
          //     event_name: "Link", // link_destination_type + ' Link'
          //     link_text: e.currentTarget.innerText, //Link Text
          //     link_source: $this, //(optional) Link src if available
          //     link_type: "Inline-text", // Link type -> button / select / tile / quick link / image / inline-text / list / focus text / other
          //     destination_url: url,
          //     destination_url_clean: url,
          //     destination_is_new_window: "false" //should be a string
          //   }
          // });
        }

        window.open(url, "_top");
      });
    },

    detail_box_open: function(e) {
      e.preventDefault();
      e.stopPropagation();

      var $this = $(e.currentTarget),
        $detail_box,
        $asset_box,
        table_id;

      if ($this.hasClass('asset-detail')) {
        $detail_box = $this.parent().parent().parent().find('.detail-row');
        $asset_box = $this.parent().parent();
      } else {
        $detail_box = $this.parent().find('.detail-row');
        $asset_box = $this;
      }

      table_id = $asset_box.parent().parent().parent().index() - 2;
      if (!assets.$table.eq(table_id).hasClass('on')) assets.anim_in_table(table_id);

      if (!$detail_box.hasClass('on')) {
        assets.detail_box_close();

        if (!assets.$cont.hasClass('detail-opened')) {
          setTimeout(function() {
            assets.$cont.addClass('detail-opened');
          }, 250);

          setTimeout(function() {
            nav.set_section_pos();
          }, 525);
          setTimeout(function() {
            nav.anchor_anim(null, ($detail_box.offset().top - 140));
          }, 10);
        } else {
          setTimeout(function() {
            nav.set_section_pos();
          }, 1025);
          setTimeout(function() {
            nav.anchor_anim(null, ($detail_box.offset().top - 140));
          }, 760);
        }

        $detail_box.removeAttr('style');
        var detail_box_h = $detail_box.outerHeight();
        assets.detail_box_elm = $detail_box;
        assets.detail_content_elm = $detail_box.find('.detail-content');

        $detail_box.css('height', 0);
        $detail_box.addClass('on');

        $asset_box.addClass('on');

        setTimeout(function() {
          $detail_box.css('height', detail_box_h + 'px');
          // setTimeout(function() { nav.anchor_anim(null, ($detail_box.offset().top - 200)); }, 250);///TODO

          if (!isLocal) {
            // OppenCore.notify({
            //   type: "ui>iframe:interaction",
            //   data: {
            //     event_name: "Open Content",
            //     content_container_name: "Text", //Description of the Content being closed. Eg: Banner / Video
            //     trigger_type: "Icon", // Anchor/ Button / Icon / Block / Image / Text
            //     trigger_text: $this.text(), // Text
            //     content_container: '#asset-class .detail-content', // target
            //     content_type: "Block" // Target type. Can be Table / Table Rows / List / Block / Other
            //   }
            // });
          }
        }, 10);
      } else {
        if (!isLocal) {
          // OppenCore.notify({
          //   type: "ui>iframe:interaction",
          //   data: {
          //     event_name: "Close Content",
          //     content_container_name: "Text", //Description of the Content being closed. Eg: Banner / Video
          //     trigger_type: "Icon", // Anchor/ Button / Icon / Block / Image / Text
          //     trigger_text: $this.text(), // Text
          //     content_container: '#asset-class .detail-content', // target
          //     content_type: "Block" // Target type. Can be Table / Table Rows / List / Block / Other
          //   }
          // });
        }

        assets.detail_box_close();
        assets.$cont.removeClass('detail-opened');

        setTimeout(function() {
          nav.set_section_pos();
        }, 525);
      }

      this.$instructions.css('display', 'none');
    },

    detail_box_close: function() {
      assets.$detail_all.css('height', 0);
      assets.$detail_all.removeClass('on');
      assets.$row_btn.removeClass('on');

      assets.detail_box_elm = null;
      assets.detail_content_elm = null;
    },

    scroll_checker: function(y) {
      if (y > ((this.$table.eq(0).offset().top + (this.$table.eq(0).height() * 0.75) + 50) - w_resize.height)) assets.anim_in_table(0);
      if (y > ((this.$table.eq(1).offset().top + (this.$table.eq(1).height() * 0.75) + 50) - w_resize.height)) assets.anim_in_table(1);
    },

    anim_in_table: function(id) {
      if (assets.$table && !assets.$table.eq(id).hasClass('on')) {
        assets.$table.eq(id).addClass('on');
        var delay = 0;

        this.$table.eq(id).find('div.asset-row').each(function(i) {
          var $this = $(this);
          delay = i * 75;

          assets.add_class($this, assets.table_data[id][i], delay);
        });
      }
    },

    add_class: function(elm, className, delay) {
      setTimeout(function() {
        if (!elm.hasClass(className)) elm.addClass(className);
      }, delay);
    }
  };


  var util = {

    days_of_week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    months_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

    query_components: function(component, data) {
      return data.filter(function(item) {
        return item.components.filter(function(contentType) {
          return contentType.name == component;
        }).length > 0;
      }).map(function(item) {
        return item.content;
      });
    },

    hasHTML: function(str) {
      return /<p\b[^>]*>/ig.test(str) && !!$(str)[0];
    },

    dateFromUTCString: function(s) {
      s = s.split(/[\D]/ig);
      return new Date(Date.UTC(s[0], --s[1], s[2], s[3], s[4], s[5], s[6] || 0));
    },

    dSort: function(prop) {
      var sortOrder = 1;
      if (prop[0] === "-") {
        sortOrder = -1;
        prop = prop.substr(1);
      }
      return function(a, b) {
        var result = (a[prop] < b[prop]) ? -1 : (a[prop] > b[prop]) ? 1 : 0;
        return result * sortOrder;
      }
    },

    roundNum: function(num, d) {
      var depth = (d) ? Math.pow(10, d) : 100,
        rounded = Math.round((Number(num) + 0.00001) * depth) / depth,
        dec_match = ('' + rounded).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/),
        dec_num = (!dec_match) ? 0 : Math.max(0, (dec_match[1] ? dec_match[1].length : 0) - (dec_match[2] ? +dec_match[2] : 0)),
        value = (d > dec_num) ? rounded.toFixed(d) : rounded;

      // console.log(rounded + ", " + value);
      return value;
    },

    randomNum: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    dateFormat: function(date) {
      var d = (new Date(date) + '').split(' '),
        n = util.months_short.indexOf(d[1]);
      d[1] = util.months[n] + ',';
      return [d[1], d[3]].join(' '); //[d[0], d[1], d[2], d[3]].join(' ');
    },

    shuffleArray: function(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    },

    extractDomain: function(url) {
      var domain;

      if (url.indexOf("://") > -1) domain = url.split('/')[2];
      else domain = url.split('/')[0];

      domain = domain.split(':')[0];

      return domain;
    },

    get_query_value: function(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    },

    escapeHTML: function(href) {
      var link = document.createElement("a");
      link.href = href;
      return (link.protocol + "//" + link.host + link.pathname + link.search + link.hash);
    }

  };

  $.easing.jswing = $.easing.swing;

  $.extend($.easing, {
    def: 'easeOutQuad',
    swing: function(x, t, b, c, d) {
      //alert($.easing.default);
      return $.easing[$.easing.def](x, t, b, c, d);
    },
    easeInQuad: function(x, t, b, c, d) {
      return c * (t /= d) * t + b;
    },
    easeOutQuad: function(x, t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(x, t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t + b;
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInCubic: function(x, t, b, c, d) {
      return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(x, t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function(x, t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
      return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeInSine: function(x, t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(x, t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(x, t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(x, t, b, c, d) {
      return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function(x, t, b, c, d) {
      return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOutExpo: function(x, t, b, c, d) {
      if (t == 0) return b;
      if (t == d) return b + c;
      if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
  });

  return {
    init: init
  };

})(jQuery);