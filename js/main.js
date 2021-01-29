$(document).ready(() => {

  function animateFadeIn(){
    let isObserver = true;
    let observer;
    // let controller = new ScrollMagic.Controller();
    let isTouch;
  
    if (
      !('IntersectionObserver' in window) ||
      !('IntersectionObserverEntry' in window) ||
      !('isIntersecting' in window.IntersectionObserverEntry.prototype)
    ) {
      isObserver = false;
      $('html').removeClass('is-observer');
    }
  
    if (isObserver) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -15% 0px' }
      );
    }
  
    if (isObserver) {
      $('.js-visibility').each((i, el) => {
        observer.observe(el);
      });
    }
  }
  
  let wWidth = $(window).width();
  let navState = false;
  const $header = $('.page-header');
  const $nav = $header.find('.nav');
  const $parentLi = $nav.find('.menu-item-has-children');
  const $parentLinks = $parentLi.children('a');
  const $subMenu = $parentLi.children('.sub-menu');
  let isObserver = true;
  let observer;
  let isTouch;

  if (
    !('IntersectionObserver' in window) ||
    !('IntersectionObserverEntry' in window) ||
    !('isIntersecting' in window.IntersectionObserverEntry.prototype)
  ) {
    isObserver = false;
    $('html').removeClass('is-observer');
  }

  if (isObserver) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -15% 0px' }
    );
  }

  function isTouchDevice() {
    const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    const mq = (query) => {
      return window.matchMedia(query).matches;
    };

    if (
      'ontouchstart' in window ||
      // eslint-disable-next-line no-undef
      (window.DocumentTouch && document instanceof DocumentTouch)
    ) {
      return true;
    }

    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(
      ''
    );
    return mq(query);
  }

  if (isTouchDevice()) {
    isTouch = true;
    $('html').addClass('is-touch');
  }

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate, ...args) {
    let timeout;
    return function () {
      const context = this;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // function once(fn, context) {
  //   var result;

  //   return function() {
  //     if (fn) {
  //       result = fn.apply(context || this, arguments);
  //       fn = null;
  //     }

  //     return result;
  //   };
  // }

  // // Usage
  // var canOnlyFireOnce = once(function() {
  //   console.log('Fired!');
  // });

  function disableScrolling() {
    if ($(document).height() > $(window).height()) {
      const scrollTop = $('html').scrollTop()
        ? $('html').scrollTop()
        : $('body').scrollTop(); // Works for Chrome, Firefox, IE...
      $('html').addClass('disable-scrolling').css('top', -scrollTop);
    }
  }

  function enableScrolling() {
    const scrollTop = parseInt($('html').css('top'), 10);
    $('html').removeClass('disable-scrolling');
    $('html,body').scrollTop(-scrollTop);
  }

  function updateNav() {
    $header.removeClass('is-opened');
    $parentLi.removeClass('is-active');
    $parentLinks.attr('aria-expanded', 'false');

    if (wWidth < 1280) {
      $subMenu.slideUp();
    } else {
      $subMenu.show();
    }
  }

  function handleNavTouch(e) {
    const $item = $(e.target);
    const $submenu = $item.siblings('.sub-menu');

    if ($item.parent().hasClass('is-active')) {
      $item.attr('aria-expanded', 'false').parent().removeClass('is-active');

      if (wWidth < 1280) {
        $submenu.slideUp();
      }
    } else {
      $parentLi.removeClass('is-active');
      $item.attr('aria-expanded', 'true').parent().addClass('is-active');

      if (wWidth < 1280) {
        $subMenu.slideUp();
        $submenu.slideDown();
      }
    }
  }

  function bindEvents() {
    $('.hamburger').on('click', () => {
      if (navState) {
        $header.removeClass('is-opened');
        enableScrolling();
      } else {
        $header.addClass('is-opened');
        disableScrolling();
      }

      navState = !navState;
    });

    $parentLinks.on('touchend', (e) => {
      e.preventDefault();
      handleNavTouch(e);
    });

    /* Navigation with tabbing */
    $(window).keyup((e) => {
      const code = e.keyCode ? e.keyCode : e.which;

      if (code === 9) {
        if ($parentLinks.filter(':focus').length) {
          handleNavTouch(e);
        } else if ($nav.find('>li>a:focus').length) {
          $parentLi.removeClass('is-active');

          if (wWidth < 1280) {
            $parentLi.children('.sub-menu').slideUp();
          }
        }
      }
    });

    // FOCUS STYLING
    // Let the document know when the mouse is being used
    document.body.addEventListener('mousedown', () => {
      document.body.classList.remove('is-tab');
    });

    // Re-enable focus styling when Tab is pressed
    document.body.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        document.body.classList.add('is-tab');
      }
    });
  }


  const doneResizing = debounce(() => {
    const width = $(window).width();

    if (wWidth !== width) {
      wWidth = width;
    }
  }, 500);

  function header(){
    const header = $('.page-header');
    let scrollHeight = $(document).scrollTop();

    if(!$(header).length){
      return;
    }


    var lastScrollTop = 0;
    $(window).scroll(function(event){
      var st = $(this).scrollTop();
      if (st > lastScrollTop){
          $(header).css("transform", "translate(0px, -120px)")
      } else {
        $(header).css("transform", "translate(0px, 0px)")
      }
      lastScrollTop = st;

      if (st < 20){
        $(header).css("transform", "translate(0px, 0px)")   
      }
    });
  }

  function mobileMenu(){
    const btn = $('.mobile-page-header__hamburger')
    const menu = $('.mobile-page-header__menu')
    const bg = $('.mobile-page-header__buttons')
    

    if(!$(menu).length){
      return;
    }

    $(btn).on('click', function(){
      $(menu).toggleClass('active')
      $(bg).toggleClass('active')
      console.log('clicked');
      
      if ($(menu).hasClass('active')){
        disableScrolling() 
        $(btn).addClass('active')
        $(bg).addClass('active')
      }
      else{
        enableScrolling()
        $(btn).removeClass('active')
        $(bg).removeClass('active')
      }      
    })


  }

  function initHomeLoader(){
    const svg = $('.loader__inner svg path');
    const subtitle = $('.loader__sub-heading h2')
    const wrap = $('.loader')




    if(homeLoaded == false){
      const line = $('.artist-hero .animated-line-show')
      const title = $('.artist-hero__title h1')

      $(title).addClass('delay')
      $(line).css("animation-delay", "5.5s")     
      homeLoaded = true
    }
    

    if(!$(subtitle).length){
      console.log('not found');
      return;
    }

    if(!wrap.length){
      return
    }
    disableScrolling()


    let tl = gsap.timeline();
    tl.to(svg, {duration: 0.5, stagger: 0.3, opacity: 0.2, scale: 1.05})
      .to(svg, {duration: 1, stagger: 0.3, opacity: 1, scale: 1.0}, '-=3')
      .to(subtitle, {duration: 1,  opacity: 1, y: 0}, '+=0')
      .to(wrap, {duration: 1, onComplete: enableScrolling, opacity: 1, y: '-100%'}, '+=1')

  }

  function initTimeline(){
    const centerLine = $('.author-timeline__center-line')
    const verticleLines = $('.author-timeline__leading-line')
    const date = $('.author-timeline__inner h3')

    if(!$(centerLine).length){
      return;
    }   

    let tl = gsap.timeline(  {
      scrollTrigger: {
        trigger: centerLine,
        start: 'top 50%',
        toggleActions: 'play',
        markers: false
      }     

    });

    tl.to(centerLine, {duration: 10, stagger: 0.3, height: '90%'})
      .to(verticleLines, {duration: 1, stagger: 1, scale: 1}, '-=9.2')
      .to(date, {duration: 1, stagger: 1, opacity: 1, y: 0 }, '-=9.2')
  }

  function initTimelineMobile(){
    const centerLine = $('.mobile-author-timeline__center-line')
    const leadingLines = $('.mobile-author-timeline__leading-line')

    

    let tl = gsap.timeline(  {
      scrollTrigger: {
        trigger: centerLine,
        start: 'top 80%',
        toggleActions: 'play',
        markers: false
      }     

    });

    tl.to(centerLine, {duration: 6, stagger: 0.3, width: '98%'})
      .to(leadingLines, {duration: 1, stagger: 0, height: '48%'}, '-=5.2')
      // .to(date, {duration: 1, stagger: 1, opacity: 1, y: 0 }, '-=9.2')
  }

  function initAuthorVideoZoom(){
    const video = $('.full-width-video__video-container video');
    let scale = 0

    if(!$(video).length){
      return;
    }

    $(window).scroll(function(){
      var scrollPos = $(document).scrollTop();
      let height = $(window).height();

      if(scrollPos < height){
        let newScroll = Math.abs(scrollPos - height)        

        if (newScroll > 99) {
          console.log(Math.abs(newScroll));
          scale = newScroll
        }
      }    
      
      $(video).css("transform", `scale(1.${scale})`)
    });
  }

  function initLightbox(){
    const image = $('.js-lightbox')
    const lightbox = $('.lightbox')
    const close = $('.lightbox__close svg')
    let count = 1

    let width = $(window).width();


    if(!$(image).length){
      return;
    }



    $(image).on('click', function(){ 
      count ++
      let showImage = $(this).attr('src')
      let src = $(lightbox).find('img')[0]
      let caption = $(this).attr('alt')
      $(lightbox).find('p').text(caption)
      $(src).attr("src", showImage)
      disableScrolling()      
      $(lightbox).fadeIn()     


      if(width > 768){
        $('#thumb-lens').remove()
        let evt = new Event(),
        m = new Magnifier(evt);     
    
        m.attach({
            thumb: '#thumb',
            large: showImage,
            mode: 'inside',
            zoom: 2.5,
            zoomable: true
        });   
        
      }


    })

    $(close).on('click', function(){
      $(lightbox).fadeOut()
      enableScrolling()

    })
  }

  function initVideoControls(){
    const play = $('.full-width-video__play')
    const pause = $('.full-width-video__pause')
    const video = $('.full-width-video__video-container video')
    let timeoutid = 0;

    if(!$(play).length){
      return;
    }

    function myFunctionToHideMenu(){
      $(pause).hide()
    }
    

    $(play).on('click', function(){
      $(video)[0].play()
      $(play).hide()
      $(pause).show()

      $(video).mousemove(function(event){
        $(pause).show()
        clearTimeout(timeoutid);
        timeoutid = setTimeout(myFunctionToHideMenu, 1000);
      })
    })

    $(pause).on('click', function(){
      $(video)[0].pause()
      $(play).show()
      $(pause).hide()

      $(video).mousemove(function(event){
        $(pause).hide()
      })
    })
  }

  function initBarba(){

    function delay(n) {
      n = n || 2000;
      return new Promise((done) => {
          setTimeout(() => {
              done();
          }, n);
      });
  }

    function pageTransition(){
      const transition = $('.page-tranition')

      let tl = gsap.timeline();
      tl.to(transition, {duration: 0.4, stagger: 0.3, opacity: 1, x: 0})
    }

    function contentAnimation() {
      const transition = $('.page-tranition')
      $('.mobile-page-header__menu').removeClass('active')
      $('.mobile-page-header__hamburger').removeClass('active')

      let tl = gsap.timeline();
      tl.to(transition, {duration: 0.2, stagger: 0.3, opacity: 1, x: "100%"})
    } 




    barba.init({
      sync: true,
      debug: true,

    transitions: [
        {
            async leave(data) {
                const done = this.async();
                pageTransition();
                await delay(1000);
                done();
            },

            async enter(data) {
              contentAnimation();  
              initAll() 
          },

          async once(data) {
              contentAnimation();
          },
        },
      ],
    });
  }

  function initArtistSearch(){
    let searchTerm = ""
    const searchGrid = $('.artists__grid')
    const searchIcon = $('.artists__search-bar svg')
    enableScrolling()

    if(!$(searchGrid).length){
      return
    }

    $('#artists__search-input').focus(function(){
      $(searchIcon).hide()
    });

    $('#artists__search-input').on('keyup', function() {
      let searchString = $(this).val();
      searchTerm = searchString
      artistList.search(searchString);

      if(searchString == ""){
        $(searchIcon).show()
      }
      else{
        $(searchIcon).hide()
      }
    });

    var artistList = new List('artist__search', { 
      valueNames: ['artist-name']
    });


    artistList.on('searchComplete', function (e) {
      if (e.matchingItems.length == 0) {    
       $(searchGrid).append(`sorry ${searchTerm} not found`)
    
      } else {    
      }    
    });
  }

  function initArtGrid(){    
    function resizeGridItem(item){
      const artGrid = $('.art__grid')

      if(!$(artGrid).length){
        return;
      }

      grid = document.getElementsByClassName("art__grid")[0];
      rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
      rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
      rowSpan = Math.ceil((item.querySelector('.art__img-container').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
      item.style.gridRowEnd = "span "+rowSpan;
    }
    
    function resizeAllGridItems(){
      allItems = document.getElementsByClassName("art__item");
      for(x=0;x<allItems.length;x++){
        resizeGridItem(allItems[x]);
      }
    }
    
    function resizeInstance(instance){
      item = instance.elements[0];
      resizeGridItem(item);
    }
    
    window.onload = resizeAllGridItems();
    window.addEventListener("resize", resizeAllGridItems);    
    allItems = document.getElementsByClassName("art__item");
    for(x=0;x<allItems.length;x++){
      imagesLoaded( allItems[x], resizeInstance);
    }
  }

  function updateArtRadios(visibleItems){
    let mediumArr = []
    let sizeArr = []
    let priceArr = []
    const container = $('.art__filter-radios')

    $(visibleItems).each(function(){
      mediumArr.push(this.values().medium) 
      sizeArr.push(this.values().size)  
      priceArr.push(this.values().price)
    })

    function removeDulpicates(set){
      let uniqueMedium = new Set(set)
      return [...uniqueMedium]
    }

    function appendRadios(arr, container){
      $(arr).each(function(){
        let wrap = '.art__filter-'+ container

        if(this != window){
          $(wrap).append(`
          <div class="art__filter-radio-container">
            <input type="radio" id="${this}" name="${container}" >
            <label for="${this}">${this}</label>
          </div>
          `)  
        }
      })  
    }

    appendRadios(removeDulpicates(mediumArr), 'medium')
    appendRadios(removeDulpicates(priceArr), 'price')
    appendRadios(removeDulpicates(sizeArr), 'size')


  }



  function initArtFilter(){
    const filterBtn = $('.art__filter')
    const sortBtn = $('.art__sort')
    const filterContainer = $('.art__filter-conatainer')
    const sortContainer = $('.art__sort-conatainer')

    $(filterBtn).on('click', function(){
      $(sortContainer).removeClass('active')
      $(sortBtn).removeClass('active')
      $(filterContainer).toggleClass('active')
      $(this).toggleClass('active')
    })

    $(sortBtn).on('click', function(){
      $(filterContainer).removeClass('active')
      $(filterBtn).removeClass('active')
      $(sortContainer).toggleClass('active')
      $(this).toggleClass('active')
    })

    var sortList = new List('items', { valueNames: [
      { data: ['price'] },
      { data: ['medium'] },
      { data: ['size'] },    
    ] });  

    updateArtRadios(sortList.items)

    function updateList(){
      let values_medium = $("input[name=medium]:checked").attr('id')
      let values_size = $("input[name=size]:checked").attr('id')
      let values_price = $("input[name=price]:checked").attr('id')    

      sortList.filter(function (item) {
        var mediumFilter = false;
        var sizeFilter = false;
        let priceFilter = false

        
        if(values_medium == null || values_medium == "all medium")
        { 
          mediumFilter = true;
        } else {
          mediumFilter = item.values().medium == values_medium;          
        }

        if(values_size == null || values_size == "all size")
        { 
          sizeFilter = true;
        } else {
          sizeFilter = item.values().size == values_size;
        }

        if(values_price == null || values_price == "all price")
        { 
          priceFilter = true;
        } else {
          priceFilter = item.values().price == values_price;
        }        

        return mediumFilter && sizeFilter && priceFilter
      });

      let visibleItems = sortList.visibleItems

      let medium = $('.art__filter-medium input')
      let price = $('.art__filter-price input')
      let size = $('.art__filter-size input')
      let thisCategory = $(this).parent().parent().attr('data-category')



      function hideUnavlaibleRadios(catgory){        
        let name = $(catgory).attr('name')
          let x = this
          
          $(catgory).each(function(){
            if($(this).attr('all') != "true"){
              $(this).parent().hide()
            }            
          })
          $(catgory).each(function(){
            let x = this
            $(visibleItems).each(function(){    
              if($(x).attr('id') == this.values()[name]){
                $(x).parent().show()
              }
            })
          })  
      }

      hideUnavlaibleRadios(medium)
      hideUnavlaibleRadios(price)
      hideUnavlaibleRadios(size)
    }

    $('input[name=medium]').change(updateList);
    $('input[name=size]').change(updateList);
    $('input[name=price]').change(updateList);
  }

  function initArtSingleCarousel(){
    const carousel = $('.art-single__carousel')

    if(!$(carousel).length){
      return;
    }
    


    $(carousel).not('.slick-initialized').slick({
      dots: true,
      nextArrow: '.art-single__slide-right',
      prevArrow: '.art-single__slide-left'
    });

  }

  function initArtworkPopup(){
    const close = $('.art-single__popup-inner svg')
    const container = $('.art-single__popup')
    const btn = $('.js-artworks-form')

    $(btn).on('click', function(){
      $(container).addClass('active')
      disableScrolling()
    })

    $(close).on('click', function(){
      $(container).removeClass('active')
      enableScrolling()
    })
  }

  function initHeroArrow() {
    const arrow = $('.artist-hero__arrow svg')

    $(arrow).on('click', function(){
      var n = $(window).height() + 50;
      $('html, body').animate({ scrollTop: n }, 800);
    })    
  }

  function initFooterArrow() {
    const arrow = $('.page-footer__arrow svg')

    $(arrow).on('click', function(){
      // var n = $(window).height() + 50;
      $('html, body').animate({ scrollTop: 0 }, 800);
    })
    
  }




  /* FUNCTION CALLS */
  /* ============= */
  let homeLoaded = false
  initAll()
  initBarba()
  mobileMenu()
  function initAll(){
    console.log('initall');
    animateFadeIn()
    enableScrolling()
    bindEvents();
    initHomeLoader()
    initTimeline()
    initAuthorVideoZoom()
    initLightbox()
    initVideoControls()
    header()
    initArtistSearch()
    initArtGrid()
    initArtFilter()
    initArtSingleCarousel()
    initTimelineMobile()
    initArtworkPopup()
    initHeroArrow()
    initFooterArrow()
  }

  

  if (isObserver) {
    $('.js-visibility').each((i, el) => {
      observer.observe(el);
    });
  }

  $(window).on('scroll', () => {});
  $(window).on('load', () => {});
  $(window).on('resize', doneResizing);
});
