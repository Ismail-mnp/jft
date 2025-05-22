window.$ = jQuery;

let vh;

function setViewport() {
	vh = window.innerHeight * 0.01;
	$('html').css({
		'--vh': vh + 'px',
		'--overlay-size': $('.first-wave .wave-svg').width() + 'px'
	});
}

var ua = window.navigator.userAgent.toLowerCase(),
	md = new MobileDetect(ua),
	is_mobile = md.mobile(),
	is_ipad = ua.indexOf('ipad') > -1 || ua.indexOf('macintosh') > -1 && 'ontouchend' in document;

if (is_mobile == null && !is_ipad) {
	mobile_check = false;
	$('html').addClass('no-touch');
} else {
	mobile_check = true;
	$('html').addClass('touch');
}

let controller = null, wh;

// Scroll Animations

function setController() {
	
	controller = new ScrollMagic.Controller();
	wh = vh * 100;
	
	if ($('.animate').length) {
		$('.animate').each(function(){
			var obj = $(this);
			new ScrollMagic.Scene({triggerElement: $(this)[0], duration: 100, triggerHook: 0.9})
				.on('enter', function(e){
					obj.removeClass('animate').addClass('animated');
				})
				.addTo(controller);
		});
	}
	
	if (page == 'home') {
		
		let hero = $('.hero-video .video.for-desktop');
		if ($('.hero-video .video.for-desktop').is(':hidden')) {
			hero = $('.hero-video .video.for-mobile');
		}
		
		new ScrollMagic.Scene({triggerElement: ".artist-wall", duration: $('.artist-wall').height(), triggerHook: 0.5})
			.setClassToggle('body', 'wall-revealed')
			.on('enter', function(e) {
				if ($('.sound-toggle').attr('data-sound-status') == 'on') {
					hero.animate({volume: 0.2}, 600);
				}
			})
			.on('leave', function(e) {
				if ($('.sound-toggle').attr('data-sound-status') == 'on') {
					hero.animate({volume: 1}, 600);
				}
			})
			.addTo(controller);
	}
	
	if (page == 'artist') {
		new ScrollMagic.Scene({triggerElement: ".site-main", duration: $('.cover-image').outerHeight() + $('.cover-image').offset().top, triggerHook: 0})
			.setTween(TweenMax.to('.cover-image img', 1, {y: -($('.cover-image img').outerHeight() - $('.cover-image').outerHeight()), ease:Linear.easeNone}))
			.addTo(controller);
	}
	
	if (page == 'about') {
		
		//new ScrollMagic.Scene({triggerElement: ".page-main", duration: wh * 1.5, triggerHook: 0, offset: wh * 0.5})
		//	.setTween(TweenMax.to('.slogan', 1, {opacity: 0, ease: Back.easeOut}))
		//	.addTo(controller);
		
		var tween = new TimelineMax()
		.add([
			TweenMax.to(".outer-wave svg", 1, {rotation: 90, ease: Linear.easeNone}),
			TweenMax.to(".inner-wave svg", 1, {rotation: 60, ease: Linear.easeNone})
		]);
			
		new ScrollMagic.Scene({triggerElement: ".page-main", duration: wh * 2, triggerHook: 0.65})
			.setTween(tween)
			//.addIndicators()
			.addTo(controller);
	}
}

// Home

function setLogoAnimation() {
	const hero_intro = $('.hero-clip-intro .video'),
	hero_loop = $('.hero-clip-loop .video');

	hero_intro[0].play();
	hero_loop[0].play();
	hero_loop[0].pause();
	
	setTimeout(function(){
		$('body').addClass('copy-revealed');
	}, 1000);
	
	setTimeout(function(){
		$('html').removeClass('page-init');
	}, 3200);
	
	hero_intro.on('ended', function(){
		
		$('.hero').removeClass('playing-intro').addClass('playing-loop');
		
		hero_intro[0].pause();
		hero_loop[0].play();
	});
	
	$('.home-button[data-home="type-a"]').addClass('is-selected');
	$('.home-button[data-home="type-b"]').removeClass('is-selected');
}

function setLogoAnimation_Alt() {
	
	let hero = $('.hero-video .video.for-desktop');
	if ($('.hero-video .video.for-desktop').is(':hidden')) {
		hero = $('.hero-video .video.for-mobile');
	}
	
	$('html').removeClass('page-init');
	hero[0].play();
	
	$('.home-button[data-home="type-b"]').addClass('is-selected');
	$('.home-button[data-home="type-a"]').removeClass('is-selected');
}

// Page Init

function initPage() {
	
	page = $('.site-main').data('page-name');
	lang = $('.site-main').data('page-lang');
	
	if (page == 'home') { 
	
		$('html').addClass('page-init');
		$('body').addClass('home');
		setLogoAnimation_Alt();
		
	} else {
		
		$('html').removeClass('page-init');
	}
	
	const singlePages = ['about', 'artists', 'artist', 'discography', 'audition', 'contact'],
		  archivePages = ['news', 'notice'];
		  
	if (singlePages.indexOf(page.trim()) > -1) {
		$('body').addClass(page);
	} else if (archivePages.indexOf(page.trim()) > -1) {
		$('body').addClass('archive');
	}
	
	if (page == 'artist') {
		
		const swiper_members = new Swiper('.swiper-members', {
			slidesPerView: 'auto',
			navigation: {
				nextEl: ".members .next-button",
				prevEl: ".members .prev-button",
			}
		});
		
		const swiper_albums = new Swiper('.swiper-albums', {
			slidesPerView: 'auto',
			navigation: {
				nextEl: ".discography .next-button",
				prevEl: ".discography .prev-button",
			}
		});
		
		const swiper_videos = new Swiper('.swiper-videos', {
			slidesPerView: 'auto',
			centeredSlides: true,
			navigation: {
				nextEl: ".videos .next-button",
				prevEl: ".videos .prev-button",
			},
			on: {
				slideChange: function(){
					$('.video-container').removeClass('is-playing');
					$('.video-container').each(function(){
						$(this).find('iframe')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
					});
				}
			}
		});
		
	}
		
	if (page == 'photos') {
		initPhotoSwipe('.gallery');
	}
	
	if (page == 'audition') {
		
		$('.how-to-apply a').each(function(){
			$(this).attr('download', '').addClass('no-barba');
		});
		
		$('.answer').each(function(){
			$(this).attr('data-height', $(this).find('.answer-content').outerHeight());
		});
	}
	
	setViewport();
	setController();
	
	$('.site-languages').html($('.site-languages-clone').html());
	
	// Revise Nav Links
	
	if (lang == 'kr') {
		$('.wakeone-logo').attr('href', '/');
	} else {
		$('.wakeone-logo').attr('href', '/' + lang + '/');
	}
	
	$('.site-menu .menu-item').each(function(){
		let label = $(this).data('menu-label'), link;
		if (lang == 'kr') {
			link = '/' + label + '/';
		} else {
			link = '/' + lang + '/' + label + '/';
		}
		$(this).find('a').attr('href', link);
	});
}


// Page Transition

let page = $('.site-main').attr('data-page-name');
let lang = $('.site-main').attr('data-page-lang');
let leave_time = 1200, enter_time_1 = 300, enter_time_2 = 900, enter_time_3 = 1200;

barba.init({
	schema: {
		prefix: 'data-page',
		wrapper: 'body',
		container: 'main',
		namespace: 'name',
	},
	transitions: [{
		name: 'transition',
		leave() {
			
			const done = this.async();
			
			$('body').addClass('page-leave');
			
			if (page == 'notice') {
				load_more.current_page = 1;
			}
			
			setTimeout(function(){
				
				$(window).scrollTop(0);
				done();	
				
				if (controller != null) {
					controller.destroy();
					controller = null;
				}
					
			}, leave_time);
		},
		enter() {
			
			$('body').attr('class', '').addClass('page-ready');
			
			setTimeout(function(){
				
				initPage();
				
			}, enter_time_1);
			
			setTimeout(function(){
				$('body').removeClass('page-ready').addClass('page-loaded');
			}, enter_time_2);
			
			setTimeout(function(){
				$('body').removeClass('page-loaded');
			}, enter_time_3);
		}
	}]
});

// Morphing Waves

class morphingWaves {
	constructor(el) {
		this.DOM = {};
		this.DOM.el = el;
		this.DOM.paths = Array.from(this.DOM.el.querySelectorAll('path'));
		this.animate();
	}
	animate() {
		this.DOM.paths.forEach((path) => {
			setTimeout(() => {
				anime({
					targets: path,
					duration: anime.random(5000,8000),
					easing: [0.5,0,0.5,1],
					d: path.getAttribute('pathdata:id'),
					loop: true,
					direction: 'alternate'
				});
			}, anime.random(0,1000));
		});
	}
};

$(document).ready(function(){
	
	setViewport();
	initPage();
	
	new morphingWaves(document.querySelector('.background-waves'));
	
	// Hamburger
	
	$('.hamburger').click(function(){
		if ($('body').hasClass('nav-is-open')) {
			
			$('body').removeClass('nav-is-open').addClass('nav-is-closing');
			setTimeout(function(){
				$('body').removeClass('nav-is-closing');
			}, 900);
			
		} else if ($('body').hasClass('photo-is-open')) {
			
			$('.pswp__button--close').trigger('click');
			$('body').removeClass('photo-is-open');
		
		} else {
			
			$('body').addClass('nav-is-open');
		}		
	});
	
	// Dev menu
	
	$('.transition-button').click(function(){
		
		const current_type = $('body').attr('data-transition'), 
			  this_type = $(this).data('transition');
			  
		Cookies.set('transition_type', this_type, {expires: 1});
		transition_type = this_type;
		
		if (current_type != this_type) {
			
			$('body').attr('data-transition', $(this).data('transition'));
			$('.transition-button.is-selected').removeClass('is-selected');
			$(this).addClass('is-selected');
		}
		
		setViewport();
		setTransTime();
	});
	
	$(document).on('click', '.sound-toggle', function(){
		
		let hero = $('.hero-video .video.for-desktop');
		if ($('.hero-video .video.for-desktop').is(':hidden')) {
			hero = $('.hero-video .video.for-mobile');
		}
		
		if ($(this).attr('data-sound-status') == 'off') {
			$(this).attr('data-sound-status', 'on');
			hero.prop('muted', false);
		} else {
			$(this).attr('data-sound-status', 'off');
			hero.prop('muted', true);
		}
		
	});
	
	// Artist
	
	let video_id;
	
	$(document).on('click', '.play-button', function(){
		
		let parent = $(this).parent(),
			video = parent.find('iframe')[0];
		
		if (parent.hasClass('is-playing')) {
			
			video.contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
			parent.removeClass('is-playing');
			
		} else {
			
			$('.video-container').removeClass('is-playing');
			parent.addClass('is-playing');
			$('.video-container').each(function(){
				$(this).find('iframe')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
			});
			video.contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');	
			
			video_id = $(this).data('video-id');
		}
	});	
	
	// Audition
	
	$(document).on('click', '.question', function(){
		if ($(this).parent().hasClass('is-active')) {
			$(this).next().removeAttr('style').parent().removeClass('is-active');
		} else {
			$(this).next().css({'height': $(this).next().data('height')});
			$('.faq-block.is-active').removeClass('is-active').find('.answer').removeAttr('style');
			$(this).parent().addClass('is-active');
		}
	});
	
});

// Photoswipe

var initPhotoSwipe = function(gallerySelector) {
	
	var parseThumbnailElements = function(el) {
		var thumbElements = el.childNodes,
			numNodes = thumbElements.length,
			items = [],
			figureEl,
			linkEl,
			size,
			item;

		for(var i = 0; i < numNodes; i++) {

			figureEl = thumbElements[i];
			
			if(figureEl.nodeType !== 1) {
				continue;
			}
			linkEl = figureEl.children[0];
			size = linkEl.getAttribute('data-size').split('x');
			item = {
				src: linkEl.getAttribute('href'),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10)
			};

			if(figureEl.children.length > 1) {
				item.title = figureEl.children[1].innerHTML; 
			}

			if(linkEl.children.length > 0) {
				item.msrc = linkEl.children[0].getAttribute('src');
			} 

			item.el = figureEl;
			items.push(item);
		}

		return items;
	};

	var closest = function closest(el, fn) {
		return el && ( fn(el) ? el : closest(el.parentNode, fn) );
	};

	var onThumbnailsClick = function(e) {
		e.stopPropagation();
		e.preventDefault();

		var eTarget = e.target || e.srcElement;

		var clickedListItem = closest(eTarget, function(el) {
			return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
		});

		if(!clickedListItem) {
			return;
		}
		
		var clickedGallery = clickedListItem.parentNode,
			childNodes = clickedListItem.parentNode.childNodes,
			numChildNodes = childNodes.length,
			nodeIndex = 0,
			index;

		for (var i = 0; i < numChildNodes; i++) {
			if(childNodes[i].nodeType !== 1) { 
				continue; 
			}

			if(childNodes[i] === clickedListItem) {
				index = nodeIndex;
				break;
			}
			nodeIndex++;
		}

		if(index >= 0) {
			openPhotoSwipe( index, clickedGallery );
		}
		return false;
	};

	var photoswipeParseHash = function() {
		var hash = window.location.hash.substring(1),
		params = {};

		if(hash.length < 5) {
			return params;
		}

		var vars = hash.split('&');
		for (var i = 0; i < vars.length; i++) {
			if(!vars[i]) {
				continue;
			}
			var pair = vars[i].split('=');  
			if(pair.length < 2) {
				continue;
			}           
			params[pair[0]] = pair[1];
		}

		if(params.gid) {
			params.gid = parseInt(params.gid, 10);
		}

		return params;
	};

	var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
		var pswpElement = document.querySelectorAll('.pswp')[0],
			options,
			items;

		items = parseThumbnailElements(galleryElement);

		options = {
			galleryUID: galleryElement.getAttribute('data-pswp-uid'),

			getThumbBoundsFn: function(index) {
				var thumbnail = items[index].el.getElementsByTagName('img')[0],
					pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
					rect = thumbnail.getBoundingClientRect(); 

				return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
			}
		};

		if(fromURL) {
			if(options.galleryPIDs) {
				// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
				for(var j = 0; j < items.length; j++) {
					if(items[j].pid == index) {
						options.index = j;
						break;
					}
				}
			} else {
				options.index = parseInt(index, 10) - 1;
			}
		} else {
			options.index = parseInt(index, 10);
		}

		if( isNaN(options.index) ) {
			return;
		}

		if(disableAnimation) {
			options.showAnimationDuration = 0;
		}

		gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();
		
		$('body').addClass('photo-is-open');
		
		gallery.listen('close', function(){
			$('body').removeClass('photo-is-open').addClass('photo-is-closing');
			setTimeout(function(){
				$('body').removeClass('photo-is-closing');
			}, 500);
		});
	};

	var galleryElements = document.querySelectorAll( gallerySelector );

	for(var i = 0, l = galleryElements.length; i < l; i++) {
		galleryElements[i].setAttribute('data-pswp-uid', i+1);
		galleryElements[i].onclick = onThumbnailsClick;
	}

	var hashData = photoswipeParseHash();
	if(hashData.pid && hashData.gid) {
		openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
	}
};