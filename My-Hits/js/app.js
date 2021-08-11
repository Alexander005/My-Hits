"use strict";
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle


function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();
//BildSlider
let sliders = document.querySelectorAll('._swiper');
if (sliders) {
	for (let index = 0; index < sliders.length; index++) {
		let slider = sliders[index];
		if (!slider.classList.contains('swiper-bild')) {
			let slider_items = slider.children;
			if (slider_items) {
				for (let index = 0; index < slider_items.length; index++) {
					let el = slider_items[index];
					el.classList.add('swiper-slide');
				}
			}
			let slider_content = slider.innerHTML;
			let slider_wrapper = document.createElement('div');
			slider_wrapper.classList.add('swiper-wrapper');
			slider_wrapper.innerHTML = slider_content;
			slider.innerHTML = '';
			slider.appendChild(slider_wrapper);
			slider.classList.add('swiper-bild');

			if (slider.classList.contains('_swiper_scroll')) {
				let sliderScroll = document.createElement('div');
				sliderScroll.classList.add('swiper-scrollbar');
				slider.appendChild(sliderScroll);
			}
		}
		if (slider.classList.contains('_gallery')) {
			//slider.data('lightGallery').destroy(true);
		}
	}
	sliders_bild_callback();
}

function sliders_bild_callback(params) { }

let sliderScrollItems = document.querySelectorAll('._swiper_scroll');
if (sliderScrollItems.length > 0) {
	for (let index = 0; index < sliderScrollItems.length; index++) {
		const sliderScrollItem = sliderScrollItems[index];
		const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
		const sliderScroll = new Swiper(sliderScrollItem, {
			observer: true,
			observeParents: true,
			direction: 'vertical',
			slidesPerView: 'auto',
			freeMode: true,
			scrollbar: {
				el: sliderScrollBar,
				draggable: true,
				snapOnRelease: false
			},
			mousewheel: {
				releaseOnEdges: true,
			},
		});
		sliderScroll.scrollbar.updateSize();
	}
}


function sliders_bild_callback(params) { }



// SWIPER=========================================================================================================
let sliderSlider = new Swiper('.slider', {

	//Кол-во слайдов для показа
	slidesPerView: 2, //можно указать 1.5

	// Автовысота
	// autoHeight: true,

	//Отступ между слайдами
	spaceBetween: 30,

	//Свободный режим
	// freeMode: true,

	//Бесконечный слайдер
	// loop: true, //Рекомендуется отключать скролл

	//Кол-во пролистываемых слайдов
	// slidesPerGroup: 1,

	//Активный слайд по центру
	// centeredSlides: true,

	//Стартовый слайд
	// initialSlide: 2, //отсчетидет от 0

	//Мултирядность (несколько рядов)
	// slidesPerColumn: 2, //Для корректной работы необходимо отключить автовысоту, также нужно установить 2 в разделе кол-во слайдов для показа, а также смотри в css

	//Отключать подгрузку всех картинок
	// preloadImage: false,

	// lazy: {
	// 	//Подгружать при перелистывании слайда
	// 	loadOnTransitionStart: false,
	// 	//Подгружать предыдущую и слудующую картинки
	// 	loadPrevNext: false,
	// },

	// //Слежка за видными слайдами
	// watchSlidesProgress: true,
	// //Добавление класса видимым слайдами
	// watchSlidesVisibility: true,

	//Автопрокрутка
	// effect: 'fade',
	// fadeEffect: {
	// 	crossFade: true,
	// },
	// autoplay: {
	// 	// Пауза между прокруткой
	// 	delay: 1000,
	// 	// Закончить на последнем слайде
	// 	stopOnLastSlide: true,
	// 	// Отключить после ручного переключения
	// 	disableOnInteraction: false,
	// },

	// Эффект с прозрачным переходом
	// effect: 'fade',
	// fadeEffect: {
	// 	crossFade: true,
	// },

	//Скорость переключения слайдов
	speed: 800,

	//Отключение функционала, если слайдов меньше чем нужно
	watchOverflow: true,

	observer: true,
	observeParents: true,


	//touchRatio: 0,
	//simulateTouch: false,
	//loop: true,
	//preloadImages: false,

	//Навигация========================================================================================================

	//Стрелки-----------------------------------------------------------------------------------------
	navigation: {
		nextEl: '.arrows-slider__arrow-right',
		prevEl: '.arrows-slider__arrow-left',
	},

	//Буллеты-----------------------------------------------------------------------------------------
	// pagination: {
	// 	el: '.arrows-slider__dots',

	// 	//Буллеты-----------------------------------------------------------------------------------------
	// 	clickable: true,
	// 	// Динамический буллет
	// 	// dynamicBullets: true,
	// 	// // Кастомные буллеты
	// 	// renderBullet: function (index, className) {
	// 	// 	return '<span class="' + className + '">' + (index + 1) + '</span>';
	// 	// }

	// 	//Фракции (1/5)-----------------------------------------------------------------------------------------
	// 	// type: 'fraction',
	// 	// //Кастомные фракции
	// 	// renderFraction: function (currentClass, totalClass) {
	// 	// 	return 'Фото <span class="' + currentClass + '"></span>' +
	// 	// 	' из ' +
	// 	// 	'<span class="' + totalClass + '"></span>';
	// 	// }

	// 	//Прогрессор (линии)-----------------------------------------------------------------------------------------
	// 	// type: 'progressbar'
	// },

	// Скролл-----------------------------------------------------------------------------------------
	// scrollbar: {
	// 	el: '.arrows-slider__scrollbar',
	// 	//Возможность перетаскивать скролл-----------------------------------------------------------------------------------------
	// 	draggable: true,
	// },

	//Перетескивание на пк-----------------------------------------------------------------------------------------
	// simulateTouch: false,
	//Чувствительность свайпа
	// touchRatio: 1,
	//Угол срабатывания свайпа
	// touchAngle: 45,
	//Курсор перетаскивания
	// grabCursor: true,

	//Переключение при клике на слайд-----------------------------------------------------------------------------------------
	// slideToClickedSlide: true,

	//Управление клавиатурой-----------------------------------------------------------------------------------------
	keyboard: {
		//Включить/выключить
		enabled: true,
		//Включить/выключить, только когда спойлер в пределах вьюпорта
		onlyInViewport: true,
		//Включить/выключить, управление клавишами pageUp, pageDown
		pageUpDown: true,
	},

	/*
	breakpoints: {
		320: {
			slidesPerView: 1.1,
			spaceBetween: 20,
		},
		768: {
			slidesPerView: 2,
			spaceBetween: 20,
		},
		992: {
			slidesPerView: 3,
			spaceBetween: 20,
		},
		1268: {
			slidesPerView: 4,
			spaceBetween: 30,
		},
	},
	*/

	on: {
		lazyImageReady: function () {
			ibg();
		},
	}

});

// Остановка автопрокрутки при наведении
// let sliderBlock = document.querySelector('.slider');

// if (sliderBlock) {
// 	sliderBlock.addEventListener('mouseenter', function (e) {
// 		sliderSlider.autoplay.stop();
// 	});

// 	sliderBlock.addEventListener('mouseleave', function (e) {
// 		sliderSlider.autoplay.start();
// 	});
// }
var ua = window.navigator.userAgent;
var msie = ua.indexOf("MSIE ");
var isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
function isIE() {
	ua = navigator.userAgent;
	var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
	return is_ie;
}
if (isIE()) {
	document.querySelector('html').classList.add('ie');
}
if (isMobile.any()) {
	document.querySelector('html').classList.add('_touch');
}

function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
	if (support === true) {
		document.querySelector('html').classList.add('_webp');
	} else {
		document.querySelector('html').classList.add('_no-webp');
	}
});

function ibg() {
	if (isIE()) {
		let ibg = document.querySelectorAll("._ibg");
		for (var i = 0; i < ibg.length; i++) {
			if (ibg[i].querySelector('img') && ibg[i].querySelector('img').getAttribute('src') != null) {
				ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
			}
		}
	}
}
ibg();

window.addEventListener("load", function () {
	if (document.querySelector('.wrapper')) {
		setTimeout(function () {
			document.querySelector('.wrapper').classList.add('_loaded');
		}, 0);
	}
});

let unlock = true;


//=================
//Menu
let iconMenu = document.querySelector(".icon-menu");
let menuBody = document.querySelector(".menu__body");
let paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
if (iconMenu != null) {
	let delay = 400;
	iconMenu.addEventListener("click", function (e) {
		if (unlock) {
			document.body.classList.toggle('_lock');
			iconMenu.classList.toggle("_active");
			menuBody.classList.toggle("_active");
			if (window.innerWidth > 768 && !isMobile.any()) {
				if (menuBody.classList.contains('_active')) {
					body_lock_add();
				}
				if (!menuBody.classList.contains('_active')) {
					body_lock_remove();
				}
			}
		}
	});
};

function menu_close() {
	let iconMenu = document.querySelector(".icon-menu");
	let menuBody = document.querySelector(".menu__body");
	iconMenu.classList.remove("_active");
	menuBody.classList.remove("_active");
}

function body_lock_remove(delay) {
	let body = document.querySelector("body");
	if (unlock) {
		let lock_padding = document.querySelectorAll("._lp");
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = '0px';
			}
			body.style.paddingRight = '0px';
			body.classList.remove("_lock");
		}, delay);

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
}
function body_lock_add(delay) {
	let body = document.querySelector("body");
	if (unlock) {
		let lock_padding = document.querySelectorAll("._lp");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight = paddingRight;
		}
		body.style.paddingRight = paddingRight;
		body.classList.add("_lock");

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
}


//=================
// Header Sub-List
let headerSubList = document.querySelectorAll('.menu__sublist-wrap');

if (headerSubList.length > 0) {
	window.onload = function () {
		addEventListener('click', documentActions);
		function documentActions(e) {
			const targetElement = e.target;
			if (window.innerWidth > 768 && isMobile.any()) {
				if (targetElement.classList.contains('menu__arrow')) {
					targetElement.closest('.menu__sublist-wrap').classList.toggle('_active');
				}
				if (!targetElement.closest('.menu__sublist-wrap') && document.querySelectorAll('.menu__sublist-wrap._active').length > 0) {
					_removeClasses(document.querySelectorAll('.menu__sublist-wrap._active'), '_active');
				}
			}
		}
	}
}


//=================
//SearchInList
function search_in_list(input) {
	let ul = input.parentNode.querySelector('ul')
	let li = ul.querySelectorAll('li');
	let filter = input.value.toUpperCase();

	for (i = 0; i < li.length; i++) {
		let el = li[i];
		let item = el;
		txtValue = item.textContent || item.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			el.style.display = "";
		} else {
			el.style.display = "none";
		}
	}
}


//=================
//DigiFormat
function digi(str) {
	var r = str.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
	return r;
}


//=================
//SlideToggle
let _slideUp = (target, duration = 500) => {
	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = duration + 'ms';
	target.style.height = target.offsetHeight + 'px';
	target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout(() => {
		target.style.display = 'none';
		target.style.removeProperty('height');
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.classList.remove('_slide');
	}, duration);
}
let _slideDown = (target, duration = 500) => {
	target.style.removeProperty('display');
	let display = window.getComputedStyle(target).display;
	if (display === 'none')
		display = 'block';

	target.style.display = display;
	let height = target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + 'ms';
	target.style.height = height + 'px';
	target.style.removeProperty('padding-top');
	target.style.removeProperty('padding-bottom');
	target.style.removeProperty('margin-top');
	target.style.removeProperty('margin-bottom');
	window.setTimeout(() => {
		target.style.removeProperty('height');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.classList.remove('_slide');
	}, duration);
}
let _slideToggle = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (window.getComputedStyle(target).display === 'none') {
			return _slideDown(target, duration);
		} else {
			return _slideUp(target, duration);
		}
	}
}


//========================================
//Wrap
function _wrap(el, wrapper) {
	el.parentNode.insertBefore(wrapper, el);
	wrapper.appendChild(el);
}


//========================================
//RemoveClasses
function _removeClasses(el, class_name) {
	for (var i = 0; i < el.length; i++) {
		el[i].classList.remove(class_name);
	}
}


//========================================
//IsHidden
function _is_hidden(el) {
	return (el.offsetParent === null)
}

//Полифилы
(function () {
	// проверяем поддержку
	if (!Element.prototype.closest) {
		// реализуем
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();
(function () {
	// проверяем поддержку
	if (!Element.prototype.matches) {
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();
function email_test(input) {
	return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}
//let btn = document.querySelectorAll('button[type="submit"],input[type="submit"]');
let forms = document.querySelectorAll('form');
if (forms.length > 0) {
	for (let index = 0; index < forms.length; index++) {
		const el = forms[index];
		el.addEventListener('submit', form_submit);
	}
}
async function form_submit(e) {
	let btn = e.target;
	let form = btn.closest('form');
	let error = form_validate(form);
	if (error == 0) {
		let formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
		let formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
		const message = form.getAttribute('data-message');
		const ajax = form.getAttribute('data-ajax');
		const test = form.getAttribute('data-test');

		//SendForm
		if (ajax) {
			e.preventDefault();
			let formData = new FormData(form);
			form.classList.add('_sending');
			let response = await fetch(formAction, {
				method: formMethod,
				body: formData
			});
			if (response.ok) {
				let result = await response.json();
				form.classList.remove('_sending');
				if (message) {
					popup_open(message + '-message');
				}
				form_clean(form);
			} else {
				alert("Ошибка");
				form.classList.remove('_sending');
			}
		}
		// If test
		if (test) {
			e.preventDefault();
			popup_open(message + '-message');
			form_clean(form);
		}
	} else {
		let form_error = form.querySelectorAll('._error');
		if (form_error && form.classList.contains('_goto-error')) {
			_goto(form_error[0], 1000, 50);
		}
		e.preventDefault();
	}
}
function form_validate(form) {
	let error = 0;
	let form_req = form.querySelectorAll('._req');
	if (form_req.length > 0) {
		for (let index = 0; index < form_req.length; index++) {
			const el = form_req[index];
			if (!_is_hidden(el)) {
				error += form_validate_input(el);
			}
		}
	}
	return error;
}
function form_validate_input(input) {
	let error = 0;
	let input_g_value = input.getAttribute('data-value');

	if (input.getAttribute("name") == "email" || input.classList.contains("_email")) {
		if (input.value != input_g_value) {
			let em = input.value.replace(" ", "");
			input.value = em;
		}
		if (email_test(input) || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	} else if (input.getAttribute("type") == "checkbox" && input.checked == false) {
		form_add_error(input);
		error++;
	} else {
		if (input.value == '' || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	}
	return error;
}
function form_add_error(input) {
	input.classList.add('_error');
	input.parentElement.classList.add('_error');

	let input_error = input.parentElement.querySelector('.form__error');
	if (input_error) {
		input.parentElement.removeChild(input_error);
	}
	let input_error_text = input.getAttribute('data-error');
	if (input_error_text && input_error_text != '') {
		input.parentElement.insertAdjacentHTML('beforeend', '<div class="form__error">' + input_error_text + '</div>');
	}
}
function form_remove_error(input) {
	input.classList.remove('_error');
	input.parentElement.classList.remove('_error');

	let input_error = input.parentElement.querySelector('.form__error');
	if (input_error) {
		input.parentElement.removeChild(input_error);
	}
}
function form_clean(form) {
	let inputs = form.querySelectorAll('input,textarea');
	for (let index = 0; index < inputs.length; index++) {
		const el = inputs[index];
		el.parentElement.classList.remove('_focus');
		el.classList.remove('_focus');
		el.value = el.getAttribute('data-value');
	}
	let checkboxes = form.querySelectorAll('.checkbox__input');
	if (checkboxes.length > 0) {
		for (let index = 0; index < checkboxes.length; index++) {
			const checkbox = checkboxes[index];
			checkbox.checked = false;
		}
	}
	let selects = form.querySelectorAll('select');
	if (selects.length > 0) {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			const select_default_value = select.getAttribute('data-default');
			select.value = select_default_value;
			select_item(select);
		}
	}
}

let viewPass = document.querySelectorAll('.form__viewpass');
for (let index = 0; index < viewPass.length; index++) {
	const element = viewPass[index];
	element.addEventListener("click", function (e) {
		if (element.classList.contains('_active')) {
			element.parentElement.querySelector('input').setAttribute("type", "password");
		} else {
			element.parentElement.querySelector('input').setAttribute("type", "text");
		}
		element.classList.toggle('_active');
	});
}

//Select
let selects = document.getElementsByTagName('select');
if (selects.length > 0) {
	selects_init();
}
function selects_init() {
	for (let index = 0; index < selects.length; index++) {
		const select = selects[index];
		select_init(select);
	}
	//select_callback();
	document.addEventListener('click', function (e) {
		selects_close(e);
	});
	document.addEventListener('keydown', function (e) {
		if (e.code === 'Escape') {
			selects_close(e);
		}
	});
}
function selects_close(e) {
	const selects = document.querySelectorAll('.select');
	if (!e.target.closest('.select') && !e.target.classList.contains('_option')) {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			const select_body_options = select.querySelector('.select__options');
			select.classList.remove('_active');
			_slideUp(select_body_options, 100);
		}
	}
}
function select_init(select) {
	const select_parent = select.parentElement;
	const select_modifikator = select.getAttribute('class');
	const select_selected_option = select.querySelector('option:checked');
	select.setAttribute('data-default', select_selected_option.value);
	select.style.display = 'none';

	select_parent.insertAdjacentHTML('beforeend', '<div class="select select_' + select_modifikator + '"></div>');

	let new_select = select.parentElement.querySelector('.select');
	new_select.appendChild(select);
	select_item(select);
}
function select_item(select) {
	const select_parent = select.parentElement;
	const select_items = select_parent.querySelector('.select__item');
	const select_options = select.querySelectorAll('option');
	const select_selected_option = select.querySelector('option:checked');
	const select_selected_text = select_selected_option.text;
	const select_type = select.getAttribute('data-type');

	if (select_items) {
		select_items.remove();
	}

	let select_type_content = '';
	if (select_type == 'input') {
		select_type_content = '<div class="select__value"><input autocomplete="off" type="text" name="form[]" value="' + select_selected_text + '" data-value="' + select_selected_text + '" class="select__input"></div>';
	} else {
		select_type_content = '<div class="select__value">' + select_selected_text + '</div>';
	}

	select_parent.insertAdjacentHTML('beforeend',
		'<div class="select__item">' +
		'<div class="select__title">' + select_type_content + '</div>' +
		'<div class="select__options">' + select_get_options(select_options) + '</div>' +
		'</div></div>');

	select_actions(select, select_parent);
}
function select_actions(original, select) {
	const select_item = select.querySelector('.select__item');
	const selectTitle = select.querySelector('.select__title');
	const select_body_options = select.querySelector('.select__options');
	const select_options = select.querySelectorAll('.select__option');
	const select_type = original.getAttribute('data-type');
	const select_input = select.querySelector('.select__input');

	selectTitle.addEventListener('click', function (e) {
		selectItemActions();
	});

	function selectMultiItems() {
		let selectedOptions = select.querySelectorAll('.select__option');
		let originalOptions = original.querySelectorAll('option');
		let selectedOptionsText = [];
		for (let index = 0; index < selectedOptions.length; index++) {
			const selectedOption = selectedOptions[index];
			originalOptions[index].removeAttribute('selected');
			if (selectedOption.classList.contains('_selected')) {
				const selectOptionText = selectedOption.innerHTML;
				selectedOptionsText.push(selectOptionText);
				originalOptions[index].setAttribute('selected', 'selected');
			}
		}
		select.querySelector('.select__value').innerHTML = selectedOptionsText;
	}
	function selectItemActions(type) {
		if (!type) {
			let selects = document.querySelectorAll('.select');
			for (let index = 0; index < selects.length; index++) {
				const select = selects[index];
				const select_body_options = select.querySelector('.select__options');
				if (select != select_item.closest('.select')) {
					select.classList.remove('_active');
					_slideUp(select_body_options, 100);
				}
			}
			_slideToggle(select_body_options, 100);
			select.classList.toggle('_active');
		}
	}
	for (let index = 0; index < select_options.length; index++) {
		const select_option = select_options[index];
		const select_option_value = select_option.getAttribute('data-value');
		const select_option_text = select_option.innerHTML;

		if (select_type == 'input') {
			select_input.addEventListener('keyup', select_search);
		} else {
			if (select_option.getAttribute('data-value') == original.value && !original.hasAttribute('multiple')) {
				select_option.style.display = 'none';
			}
		}
		select_option.addEventListener('click', function () {
			for (let index = 0; index < select_options.length; index++) {
				const el = select_options[index];
				el.style.display = 'block';
			}
			if (select_type == 'input') {
				select_input.value = select_option_text;
				original.value = select_option_value;
			} else {
				if (original.hasAttribute('multiple')) {
					select_option.classList.toggle('_selected');
					selectMultiItems();
				} else {
					select.querySelector('.select__value').innerHTML = select_option_text;
					original.value = select_option_value;
					select_option.style.display = 'none';
				}
			}
			let type;
			if (original.hasAttribute('multiple')) {
				type = 'multiple';
			}
			selectItemActions(type);
		});
	}
}
function select_get_options(select_options) {
	if (select_options) {
		let select_options_content = '';
		for (let index = 0; index < select_options.length; index++) {
			const select_option = select_options[index];
			const select_option_value = select_option.value;
			if (select_option_value != '') {
				const select_option_text = select_option.innerHTML;
				select_options_content = select_options_content + '<div data-value="' + select_option_value + '" class="select__option">' + select_option_text + '</div>';
			}
		}
		return select_options_content;
	}
}
function select_search(e) {
	let select_block = e.target.closest('.select ').querySelector('.select__options');
	let select_options = e.target.closest('.select ').querySelectorAll('.select__option');
	let select_search_text = e.target.value.toUpperCase();

	for (let i = 0; i < select_options.length; i++) {
		let select_option = select_options[i];
		let select_txt_value = select_option.textContent || select_option.innerText;
		if (select_txt_value.toUpperCase().indexOf(select_search_text) > -1) {
			select_option.style.display = "";
		} else {
			select_option.style.display = "none";
		}
	}
}
function selects_update_all() {
	let selects = document.querySelectorAll('select');
	if (selects) {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			select_item(select);
		}
	}
}

//Placeholers
let inputs = document.querySelectorAll('input[data-value],textarea[data-value]');
inputs_init(inputs);

function inputs_init(inputs) {
	if (inputs.length > 0) {
		for (let index = 0; index < inputs.length; index++) {
			const input = inputs[index];
			const input_g_value = input.getAttribute('data-value');
			input_placeholder_add(input);
			if (input.value != '' && input.value != input_g_value) {
				input_focus_add(input);
			}
			input.addEventListener('focus', function (e) {
				if (input.value == input_g_value) {
					input_focus_add(input);
					input.value = '';
				}
				if (input.getAttribute('data-type') === "pass" && !input.parentElement.querySelector('.form__viewpass').classList.contains('_active')) {
					input.setAttribute('type', 'password');
				}
				if (input.classList.contains('_date')) {
					/*
					input.classList.add('_mask');
					Inputmask("99.99.9999", {
						//"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
					*/
				}
				if (input.classList.contains('_phone')) {
					//'+7(999) 999 9999'
					//'+38(999) 999 9999'
					//'+375(99)999-99-99'
					input.classList.add('_mask');
					Inputmask("+7 (999) 999-99-99", {
						//"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
				}
				if (input.classList.contains('_digital')) {
					input.classList.add('_mask');
					Inputmask("9{1,}", {
						"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
				}
				form_remove_error(input);
			});
			input.addEventListener('blur', function (e) {
				if (input.value == '') {
					input.value = input_g_value;
					input_focus_remove(input);
					if (input.classList.contains('_mask')) {
						input_clear_mask(input, input_g_value);
					}
					if (input.getAttribute('data-type') === "pass") {
						input.setAttribute('type', 'text');
					}
				}
			});
			if (input.classList.contains('_date')) {
				const calendarItem = datepicker(input, {
					customDays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
					customMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
					overlayButton: 'Применить',
					overlayPlaceholder: 'Год (4 цифры)',
					startDay: 1,
					formatter: (input, date, instance) => {
						const value = date.toLocaleDateString()
						input.value = value
					},
					onSelect: function (input, instance, date) {
						input_focus_add(input.el);
					}
				});
				const dataFrom = input.getAttribute('data-from');
				const dataTo = input.getAttribute('data-to');
				if (dataFrom) {
					calendarItem.setMin(new Date(dataFrom));
				}
				if (dataTo) {
					calendarItem.setMax(new Date(dataTo));
				}
			}
		}
	}
}
function input_placeholder_add(input) {
	const input_g_value = input.getAttribute('data-value');
	if (input.value == '' && input_g_value != '') {
		input.value = input_g_value;
	}
}
function input_focus_add(input) {
	input.classList.add('_focus');
	input.parentElement.classList.add('_focus');
}
function input_focus_remove(input) {
	input.classList.remove('_focus');
	input.parentElement.classList.remove('_focus');
}
function input_clear_mask(input, input_g_value) {
	input.inputmask.remove();
	input.value = input_g_value;
	input_focus_remove(input);
}

//QUANTITY
const quantity = document.querySelectorAll('.quantity');

if (quantity) {
	quantity.forEach(function (quantity) {
		const quantityInput = quantity.querySelector('.quantity__input');
		const quantityPlus = quantity.querySelector('.quantity__plus');
		const quantityMinus = quantity.querySelector('.quantity__minus');
		let quantityMaxValue = +quantityInput.dataset.max;
		let quantityMinValue = +quantityInput.dataset.min;
		let quantityValue = +quantityInput.value;
		quantityInput.value = quantityValue;

		quantityPlus.addEventListener('click', function () {
			if (quantityValue < quantityMaxValue) {
				quantityValue++;
				quantityInput.value = quantityValue;
			}
		});

		quantityMinus.addEventListener('click', function () {
			if (quantityValue > quantityMinValue) {
				quantityValue--;
				quantityInput.value = quantityValue;
			}
		});
	});
}

//RANGE
const range = document.querySelectorAll('.range');

if (range.length > 0) {
	range.forEach(function (range) {
		const inputResult = range.querySelector('.range__input-number_result');
		const inputRange = range.querySelector('.range__input-range');
		const numberMin = range.querySelector('.range__number-min');
		const numberMax = range.querySelector('.range__number-max');
		inputResult.value = inputRange.min;
		if (numberMax && numberMin) {
			numberMin.textContent = inputRange.min;
			numberMax.textContent = inputRange.max;
		}

		inputResult.addEventListener('input', function () {
			if (inputResult.value >= 0) {
				inputRange.value = this.value;
				const value = (inputRange.value - inputRange.min) / (inputRange.max - inputRange.min) * 100;
				inputRange.style.background = 'linear-gradient(to right, #4CAF50 0%, #4CAF50 ' + value + '%, #d3d3d3 ' + value + '%, #d3d3d3 100%)';
			}
			if (inputResult.value == '') {
				inputRange.value = inputRange.min;
				const value = (inputRange.value - inputRange.min) / (inputRange.max - inputRange.min) * 100;
				inputRange.style.background = 'linear-gradient(to right, #4CAF50 0%, #4CAF50 ' + value + '%, #d3d3d3 ' + value + '%, #d3d3d3 100%)';
			}
		});

		inputRange.addEventListener('input', function () {
			if (inputResult.value >= 0) {
				const value = (this.value - this.min) / (this.max - this.min) * 100;
				this.style.background = 'linear-gradient(to right, #4CAF50 0%, #4CAF50 ' + value + '%, #d3d3d3 ' + value + '%, #d3d3d3 100%)';
				inputResult.value = this.value;
			}
		});
	});
}


// Range-Tumbs

const rangeThumbs = document.querySelectorAll('.range-thumbs');

if (rangeThumbs.length > 0) {
	rangeThumbs.forEach(function (rangeThumbs) {
		const rangeOne = rangeThumbs.querySelector('.range-thumbs__input-range_one');
		const rangeTwo = rangeThumbs.querySelector('.range-thumbs__input-range_two');
		const rangeTrack = rangeThumbs.querySelector('.range-thumbs__track');
		const contentInputOne = rangeThumbs.querySelector('.range-thumbs__input-number_content-one');
		const contentInputTwo = rangeThumbs.querySelector('.range-thumbs__input-number_content-two');
		const numberMin = rangeThumbs.querySelector('.range-thumbs__number-min');
		const numberMax = rangeThumbs.querySelector('.range-thumbs__number-max');
		let minGap = 60;
		rangeOne.value = rangeOne.min;
		rangeTwo.value = rangeTwo.max;
		if (numberMin && numberMax) {
			numberMin.textContent = rangeOne.min;
			numberMax.textContent = rangeOne.max;
		}

		rangeSliderOne();
		rangeSliderTwo();
		fillColor();

		if (contentInputOne && contentInputTwo) {
			contentInputOne.value = rangeOne.min;
			contentInputTwo.value = rangeOne.max;

			contentInputOne.addEventListener('input', function () {
				checkContentInputOne();
				fillColor();
			});

			contentInputTwo.addEventListener('input', function () {
				checkContentInputTwo();
				fillColor();
			});

			function checkContentInputOne() {
				if (contentInputOne.value >= 0 && contentInputOne.value <= +rangeOne.max - minGap && contentInputOne.value <= +rangeTwo.value - minGap) {
					rangeOne.value = contentInputOne.value;
				}
				if (contentInputOne.value > rangeOne.max - minGap) {
					rangeOne.value = rangeOne.max - minGap;
				}
				if (contentInputOne.value > +rangeTwo.value - minGap) {
					rangeOne.value = +rangeTwo.value - minGap;
				}
				if (contentInputOne.value == '') {
					rangeOne.value = rangeOne.min;
				}
			}

			function checkContentInputTwo() {
				if (contentInputTwo.value <= 1000 && contentInputTwo.value >= +rangeTwo.min + minGap && contentInputTwo.value >= +rangeOne.value + minGap) {
					rangeTwo.value = contentInputTwo.value;
				}
				if (contentInputTwo.value < +rangeOne.min + minGap) {
					rangeTwo.value = rangeOne.min + minGap;
				}
				if (contentInputTwo.value < +rangeOne.value + minGap) {
					rangeTwo.value = +rangeOne.value + minGap;
				}
				if (contentInputTwo.value == '') {
					rangeTwo.value = rangeOne.max;
				}
			}
		}

		rangeOne.addEventListener('input', function () {
			rangeSliderOne();
			fillColor();
		});

		rangeTwo.addEventListener('input', function () {
			rangeSliderTwo();
			fillColor();
		});

		function rangeSliderOne() {
			if (parseInt(rangeTwo.value) - parseInt(rangeOne.value) <= minGap) {
				rangeOne.value = parseInt(rangeTwo.value) - minGap;
			}
			if (contentInputOne) {
				contentInputOne.value = rangeOne.value;
			}
		}

		function rangeSliderTwo() {
			if (parseInt(rangeTwo.value) - parseInt(rangeOne.value) <= minGap) {
				rangeTwo.value = parseInt(rangeOne.value) + minGap;
			}
			if (contentInputTwo) {
				contentInputTwo.value = rangeTwo.value;
			}
		}

		function fillColor() {
			let precentOne = (parseInt(rangeOne.value) / rangeOne.max) * 100;
			let precentTwo = (parseInt(rangeTwo.value) / rangeOne.max) * 100;
			rangeTrack.style.background = 'linear-gradient(to right, #d3d3d3 '+ precentOne +'%, #4CAF50 ' + precentOne + '%, #4CAF50 ' + precentTwo + '%, #d3d3d3 '+ precentTwo +'%)';
		}
	});
}
//ScrollOnScroll
window.addEventListener('scroll', scroll_scroll);
function scroll_scroll() {
	let currentScroll;
	let src_value = currentScroll = pageYOffset;
	let header = document.querySelector('header.header');
	if (header !== null) {
		if (src_value > 10) {
			header.classList.add('_scroll');
		} else {
			header.classList.remove('_scroll');
		}
	}
}
setTimeout(function () {
	scroll_scroll();
}, 100);



// Для ссылки дать класс _scrto или _scrto-section и всем секциямя поставить класс section
//=================
// scrollto-section
const scrollToItems = document.querySelectorAll('._scrto-section');

if (scrollToItems.length > 0) {
	const sections = document.querySelectorAll('.section');
	const observer = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				scrollToItems.forEach(function (link) {
					removeHash(link);
					if (removeHash(link) === entry.target.classList[0]) {
						link.classList.add('_active');
					} else {
						link.classList.remove('_active');
					}
				});
			}
		});
	}, {
		threshold: 0.65,
	});

	if (sections.length > 0) {
		sections.forEach(function (section) {
			observer.observe(section);
		});
	}

	scrollToItems.forEach(function (item) {
		item.addEventListener('click', function (e) {
			e.preventDefault();
			if (e.target.classList.contains('_scrto-section')) { // Добавить e.target.parentElement.classList.contains('_scrto-section') если что то не получается
				const itemId = removeHash(item);
				const headerHeight = document.querySelector('.header').clientHeight;

				if (itemId) {
					window.scrollTo({
						top: document.getElementsByClassName(itemId)[0].offsetTop - headerHeight,
						behavior: 'smooth',
					});
				}
			}
		});
	});

	function removeHash(link) {
		return link.getAttribute('href').replace('#', '');
	}
}


//=================
// scrollto
const scrollItems = document.querySelectorAll('._scrto');

if (scrollItems.length > 0) {
	scrollItems.forEach(function (item) {
		item.addEventListener('click', function (e) {
			e.preventDefault();
			if (e.target.classList.contains('_scrto')) { // Добавить e.target.parentElement.classList.contains('_scrto-section') если что то не получается
				const itemId = removeHash(item);
				const headerHeight = document.querySelector('.header').clientHeight;

				if (itemId) {
					window.scrollTo({
						top: document.getElementsByClassName(itemId)[0].offsetTop - headerHeight,
						behavior: 'smooth',
					});
				}
			}
		});
	});

	function removeHash(link) {
		return link.getAttribute('href').replace('#', '');
	}
}

// //Cast-scripts===================================================================================================================================

//=================
// Cursor
const cursor = document.querySelector('.cursor');
const hoverElements = document.querySelectorAll('._hover-element');
const body = document.body;

if (cursor) {
	document.addEventListener("mousemove", function (e) {
		const mouseX = e.clientX - 15;
		const mouseY = e.clientY - 15;
		cursor.classList.remove('_hidden');
		cursor.style.top = mouseY + 'px';
		cursor.style.left = mouseX + 'px';
	});
	body.addEventListener("mouseout", function () {
		cursor.classList.add('_hidden');
	});
	if (hoverElements.length > 0) {
		hoverElements.forEach(function (item) {
			item.addEventListener("mousemove", function () {
				cursor.classList.add('_active');
			});
			item.addEventListener("mouseout", function () {
				cursor.classList.remove('_active');
			});
		});
	}
}



//=================
// ProgressBar
const progress = document.querySelector('._progressbar');

if (progress) {
	window.addEventListener('scroll', progressBar );

	function progressBar(e) {
		let windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
		let windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
		let procent = windowScroll / windowHeight * 100;

		progress.style.width = procent + '%';
	}
}



//=================
// 3d cards (hover)
const cards = document.querySelectorAll('._card');

if (cards.length > 0) {
	cards.forEach(function (item) {
		item.addEventListener('mousemove', startRotate);
		item.addEventListener('mouseout', endRotate);
	});
	function startRotate(e) {
		const cardItem = this.querySelector('._card-item');
		const halfWidth = cardItem.offsetWidth / 2;
		const halfHeight = cardItem.offsetHeight / 2;
		cardItem.style.transform = 'rotateY(' + (e.offsetX - halfWidth) / 7 + 'deg) rotateX(' + -(e.offsetY - halfHeight) / 7 + 'deg)';
	}
	function endRotate() {
		const cardItem = this.querySelector('._card-item');
		cardItem.style.transform = 'rotateY(0deg) rotateX(0deg)';
	}
}



//=================
// dropdown-list
const listTotal = document.querySelectorAll('._list-drop');

listTotal.forEach(function (dropDownWrapper) {
	const listTitle = dropDownWrapper.querySelector('._list-title');
	const listBody = dropDownWrapper.querySelector('._list-body');

	const listItemsBefore = listBody.querySelectorAll('._list-item');
	let textTitle = listTitle.innerText;
	const listItemTitle = listItemsBefore[0].cloneNode();
	listItemTitle.innerHTML = textTitle;
	listBody.insertAdjacentElement('afterbegin', listItemTitle);
	listItemTitle.style.display = 'none';

	const listItems = listBody.querySelectorAll('._list-item');

	if (listTitle) {
		// По клику на заголовок открывать список
		listTitle.addEventListener('click', function (e) {
			e.preventDefault();
			listTitle.classList.toggle('_active');
			listBody.classList.toggle('_active');
		});

		// Выбор элемента списка и закрытие списка
		listItems.forEach(function (item) {
			let textTitle = listTitle.innerText;
			if (item.innerHTML == textTitle) {
				item.classList.add('_active');
			}
			item.addEventListener('click', function (e) {
				e.preventDefault();
				listItems.forEach(function (elem) {
					elem.classList.remove('_active');
					elem.style.display = 'block';
				});
				listTitle.innerText = this.innerText;
				this.classList.add('_active');
				listTitle.classList.remove('_active');
				listBody.classList.remove('_active');
				if (listItemTitle.classList.contains('_active')) {
					listItemTitle.style.display = 'none';
				}
				if (this.classList.contains('_active')) {
					this.style.display = 'none';
				}
			});
		});

		// По клику на пустое место, закрыть список
		document.addEventListener('click', function (e) {
			if (!e.target.closest('._list-drop')) {
				listTitle.classList.remove('_active');
				listBody.classList.remove('_active');
			}
		});
	}
});



//=================
// arrow-bottom
const arrowScroll = document.querySelector('._arrow-bottom');
const heightIntroArrow = document.querySelector('.intro').offsetHeight;
const heightHeaderArrow = document.querySelector('.header').offsetHeight;
const heightResult = heightIntroArrow - heightHeaderArrow;

if (arrowScroll) {
	arrowScroll.addEventListener('click', function (e) {
		e.preventDefault();
		window.scrollTo({
			top: heightResult,
			left: 0,
			behavior: "smooth",
		});
	});
}



//=================
// arrow-up
let scrollArrow = document.querySelector('._arrow-up');
if(scrollArrow) {
	scrollArrow.addEventListener('click', function (e) {
		e.preventDefault();
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth",
		});
	});
};



//=================
// Нужно кнопке добавить класс _btn-more и data аттрибут data-options="visible", а тексту добавить класс _text-more
// btn-more
let btnMore = document.querySelector("._btn-more");
let textMore = document.querySelectorAll("._content-more");

if (btnMore) {
	btnMore.addEventListener('click', function (e) {
		e.preventDefault();
		if (btnMore.dataset.options == "visible") {
			textMore.forEach(function (item) {
				item.style.display = 'none';
			});
			btnMore.innerText = 'Скрыть';
			btnMore.dataset.options = "hidden";
		} else if (btnMore.dataset.options == "hidden") {
			textMore.forEach(function (item) {
				item.style.display = 'block';
			});
			btnMore.innerText = 'Загрузить ещё';
			btnMore.dataset.options = "visible";
		}
	});
}

//======================================================================================================================================================
// //Spollers==================================================================================================================================================
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
	// Получение обычных слойлеров
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		return !item.dataset.spollers.split(",")[0];
	});
	// Инициализация обычных слойлеров
	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}

	// Получение слойлеров с медиа запросами
	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(",")[0];
	});

	// Инициализация слойлеров с медиа запросами
	if (spollersMedia.length > 0) {
		const breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		// Получаем уникальные брейкпоинты
		let mediaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});

		// Работаем с каждым брейкпоинтом
		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			// Объекты с нужными условиями
			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});
			// Событие
			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}
	// Инициализация
	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener("click", setSpollerAction);
			}
		});
	}
	// Работа с контентом
	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}
	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_active')) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				_slideToggle(spollerTitle.nextElementSibling, 450);
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_active');
			_slideUp(spollerActiveTitle.nextElementSibling, 450);
		}
	}
}
// //Popups====================================================================================================================================
let popup_link = document.querySelectorAll('._popup-link');
let popups = document.querySelectorAll('.popup');
for (let index = 0; index < popup_link.length; index++) {
	const el = popup_link[index];
	el.addEventListener('click', function (e) {
		if (unlock) {
			let item = el.getAttribute('href').replace('#', '');
			let video = el.getAttribute('data-video');
			popup_open(item, video);
		}
		e.preventDefault();
	})
}
for (let index = 0; index < popups.length; index++) {
	const popup = popups[index];
	popup.addEventListener("click", function (e) {
		if (!e.target.closest('.popup__body')) {
			popup_close(e.target.closest('.popup'));
		}
	});
}
function popup_open(item, video = '') {
	let activePopup = document.querySelectorAll('.popup._active');
	if (activePopup.length > 0) {
		popup_close('', false);
	}
	let curent_popup = document.querySelector('.popup_' + item);
	if (curent_popup && unlock) {
		if (video != '' && video != null) {
			let popup_video = document.querySelector('.popup_video');
			popup_video.querySelector('.popup__video').innerHTML = '<iframe src="https://www.youtube.com/embed/' + video + '?autoplay=1"  allow="autoplay; encrypted-media" allowfullscreen></iframe>';
		}
		if (!document.querySelector('.menu__body._active')) {
			body_lock_add(500);
		}
		curent_popup.classList.add('_active');
		history.pushState('', '', '#' + item);
	}
}
function popup_close(item, bodyUnlock = true) {
	if (unlock) {
		if (!item) {
			for (let index = 0; index < popups.length; index++) {
				const popup = popups[index];
				let video = popup.querySelector('.popup__video');
				if (video) {
					video.innerHTML = '';
				}
				popup.classList.remove('_active');
			}
		} else {
			let video = item.querySelector('.popup__video');
			if (video) {
				video.innerHTML = '';
			}
			item.classList.remove('_active');
		}
		if (!document.querySelector('.menu__body._active') && bodyUnlock) {
			body_lock_remove(500);
		}
		history.pushState('', '', window.location.href.split('#')[0]);
	}
}
let popup_close_icon = document.querySelectorAll('.popup__close,._popup-close');
if (popup_close_icon) {
	for (let index = 0; index < popup_close_icon.length; index++) {
		const el = popup_close_icon[index];
		el.addEventListener('click', function () {
			popup_close(el.closest('.popup'));
		})
	}
}
document.addEventListener('keydown', function (e) {
	if (e.code === 'Escape') {
		popup_close();
	}
});
// //Tabs=========================================================================================================================================
let tabs = document.querySelectorAll("._tabs");
for (let index = 0; index < tabs.length; index++) {
	let tab = tabs[index];
	let tabs_items = tab.querySelectorAll("._tabs-item");
	let tabs_blocks = tab.querySelectorAll("._tabs-block");
	for (let index = 0; index < tabs_items.length; index++) {
		let tabs_item = tabs_items[index];
		tabs_item.addEventListener("click", function (e) {
			for (let index = 0; index < tabs_items.length; index++) {
				let tabs_item = tabs_items[index];
				tabs_item.classList.remove('_active');
				tabs_blocks[index].classList.remove('_active');
			}
			tabs_item.classList.add('_active');
			tabs_blocks[index].classList.add('_active');
			e.preventDefault();
		});
	}
}
// //Gallery==================================================================================================================================
let gallery = document.querySelectorAll('._gallery');
if (gallery) {
	gallery_init();
}
function gallery_init() {
	for (let index = 0; index < gallery.length; index++) {
		const el = gallery[index];
		lightGallery(el, {
			counter: false,
			selector: 'a',
			download: false
		});
	}
}