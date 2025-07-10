"use strict"

/*----------Посилання на google карти-------------*/
window.addEventListener("DOMContentLoaded", () => {
    const adressBlock = document.querySelector(".header__adress");
	console.log(adressBlock);
    if (adressBlock) {
      const city = adressBlock.querySelector(".header__city")?.innerText.trim() || "";
      const street = adressBlock.querySelector(".header__street")?.innerText.trim() || "";
      const fullAdress = `${city} ${street}`.replace(/,$/, ""); // видаляємо кому в кінці
		adressBlock.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAdress)}`;
		console.log(adressBlock);
	}
});


/* ---------Урахування плаваючої панелі на мобильних пристроях при 100vh -------------------*/
function fullVHfix() {
	const fullScreens = document.querySelectorAll('[data-fullscreen]');
	if (fullScreens.length && isMobile.any()) {
		window.addEventListener('resize', fixHeight);
		function fixHeight() {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		}
		fixHeight();
	}
}
/* ---------Урахування плаваючої панелі на мобильних пристроях при 100vh -------------------*/

/* ---------------Прокрутка до розділу--------------- */

const menuLink = document.querySelector('.header__link[data-goto]');
console.log('Елемент посилання:');
console.log(menuLink);
if (menuLink) {
    console.log('Так');
	menuLink.addEventListener('click', function (e) {
		const link = e.target;
		console.log('Елемент призначення:');
		console.log(link);
		const target = document.querySelector(link.dataset.goto);
		console.log("куди треба перейти:");
		console.log(link.dataset.goto);
		console.log("елемент, куди треба перейти");
		console.log(target);
		if (link.dataset.goto && target){
			target.scrollIntoView({ behavior: "smooth" });
			e.preventDefault();
		}
	});
};

/* ---------------Прокрутка до розділу--------------- */
/*------------ Додавання класу _touch для HTML, якщо браузер мобільний ----------------- */
/* Перевірка мобільного браузера */
let isMobile = { 
    Android: function () { return navigator.userAgent.match(/Android/i); }, 
    BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, 
    iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, 
    Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, 
    Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, 
};
isMobile.any = function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); };
function addTouchClass() {
// Додавання класу _touch для HTML, якщо браузер мобільний
	if (isMobile.any()) document.documentElement.classList.add('_touch');
}
addTouchClass();

/*------------ Додавання класу _touch для HTML, якщо браузер мобільный ----------------- */


// === Body Lock Helpers ===
let bodyLockStatus = true;
const bodyLockToggle = (delay = 500) => {
	if (document.documentElement.classList.contains('lock')) {
		bodyUnlock(delay);
	} else {
		bodyLock(delay);
	}
};
const bodyUnlock = (delay = 500) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		setTimeout(() => {
			for (let el of lock_padding) {
				el.style.paddingRight = '0px';
			}
			body.style.paddingRight = '0px';
			document.documentElement.classList.remove("lock");
		}, delay);
		bodyLockStatus = false;
		setTimeout(() => { bodyLockStatus = true; }, delay);
	}
};
const bodyLock = (delay = 500) => {
	let body = document.querySelector("body");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		for (let el of lock_padding) {
			el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		}
		body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
		document.documentElement.classList.add("lock");
		bodyLockStatus = false;
		setTimeout(() => { bodyLockStatus = true; }, delay);
	}
};

// === PopupContentManager ===
class PopupContentManager {
	static fillContent(popup, trigger) {
		if (!popup || !trigger) return;
		const title = trigger.dataset.title;
		const price = trigger.dataset.price;
		const imgSrc = trigger.dataset.img;
		const picture = trigger.closest('.goods')?.querySelector('.goods__image-ibg');

		if (title) popup.querySelector('.popup__title').textContent = title;
		if (price) popup.querySelector('.popup__price').textContent = price + ' ₴/шт.';
		if (picture) popup.querySelector('.popup__image').innerHTML = picture.outerHTML;
	}
}

// === PopupYouTubeManager ===
class PopupYouTubeManager {
	static insert(popup, code, autoplay = true) {
		if (!popup || !code) return;
		const url = `https://www.youtube.com/embed/${code}?rel=0&showinfo=0&autoplay=${autoplay ? 1 : 0}`;
		const iframe = document.createElement('iframe');
		iframe.setAttribute('allowfullscreen', '');
		iframe.setAttribute('allow', `${autoplay ? 'autoplay;' : ''} encrypted-media`);
		iframe.setAttribute('src', url);

		let container = popup.querySelector('[data-popup-youtube-place]');
		if (!container) {
			container = document.createElement('div');
			container.setAttribute('data-popup-youtube-place', '');
			popup.querySelector('.popup__text')?.appendChild(container);
		}
		container.appendChild(iframe);
	}

	static clear(popup) {
		const container = popup?.querySelector('[data-popup-youtube-place]');
		if (container) container.innerHTML = '';
	}
}

// === PopupHashManager ===
class PopupHashManager {
	static getHash(selector) {
		return selector.includes('#') ? selector : selector.replace('.', '#');
	}

	static setHash(selector) {
		history.pushState('', '', this.getHash(selector));
	}

	static removeHash() {
		history.pushState('', '', window.location.href.split('#')[0]);
	}

	static openToHash(popupInstance, attributeOpenButton) {
		const rawHash = window.location.hash.replace('#', '');
		if (!rawHash) return;
		try {
			const classInHash = document.querySelector(`.${CSS.escape(rawHash)}`) ? `.${rawHash}` :
				document.querySelector(`#${CSS.escape(rawHash)}`) ? `#${rawHash}` : null;
			const button = document.querySelector(`[${attributeOpenButton}="${classInHash}"]`);
			if (button && classInHash) popupInstance.open(classInHash);
		} catch (e) {
			console.warn('Invalid hash selector', e);
		}
	}
}

// === Popup ===
class Popup {
	constructor(options) {
		const config = {
			init: true,
			attributeOpenButton: 'data-popup',
			attributeCloseButton: 'data-close',
			fixElementSelector: '[data-lp]',
			youtubeAttribute: 'data-popup-youtube',
			youtubePlaceAttribute: 'data-popup-youtube-place',
			setAutoplayYoutube: true,
			classes: {
				popup: 'popup',
				popupContent: 'popup__content',
				popupActive: 'popup_show',
				bodyActive: 'popup-show',
			},
			focusCatch: true,
			closeEsc: true,
			bodyLock: true,
			hashSettings: {
				location: true,
				goHash: true,
			},
			on: {
				beforeOpen: () => {},
				afterOpen: () => {},
				beforeClose: () => {},
				afterClose: () => {},
			},
		};
		this.options = {
			...config,
			...options,
			classes: {
				...config.classes,
				...options?.classes,
			},
			hashSettings: {
				...config.hashSettings,
				...options?.hashSettings,
			},
			on: {
				...config.on,
				...options?.on,
			},
		};

		this.isOpen = false;
		this.targetOpen = { selector: false, element: false };
		this.previousOpen = { selector: false, element: false };
		this.lastClosed = { selector: false, element: false };
		this._dataValue = false;
		this.youTubeCode = null;
		this._triggerButton = null;
		this._selectorOpen = false;
		this._reopen = false;
		this.lastFocusEl = false;
		this.bodyLock = false;
		this._focusEl = [
			'a[href]',
			'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
			'button:not([disabled]):not([aria-hidden])',
			'select:not([disabled]):not([aria-hidden])',
			'textarea:not([disabled]):not([aria-hidden])',
			'area[href]',
			'iframe',
			'object',
			'embed',
			'[contenteditable]',
			'[tabindex]:not([tabindex^="-"])',
		];

		if (this.options.init) this.initPopups();
	}

	initPopups() {
		this.eventsPopup();
		if (this.options.hashSettings.goHash) {
			window.addEventListener('hashchange', () => {
				if (window.location.hash) {
					PopupHashManager.openToHash(this, this.options.attributeOpenButton);
				} else {
					this.close(this.targetOpen.selector);
				}
			});
			window.addEventListener('load', () => {
				if (window.location.hash) {
					PopupHashManager.openToHash(this, this.options.attributeOpenButton);
				}
			});
		}
	}

	eventsPopup() {
		document.addEventListener("click", (e) => {
			const openBtn = e.target.closest(`[${this.options.attributeOpenButton}]`);
			if (openBtn) {
				e.preventDefault();
				this._dataValue = openBtn.getAttribute(this.options.attributeOpenButton);
				this._triggerButton = openBtn;
				this.youTubeCode = openBtn.getAttribute(this.options.youtubeAttribute);
				if (this._dataValue !== 'error') {
					if (!this.isOpen) this.lastFocusEl = openBtn;
					this.targetOpen.selector = this._dataValue;
					this._selectorOpen = true;
					this.open();
					return;
				}
			}

			const closeBtn = e.target.closest(`[${this.options.attributeCloseButton}]`);
			if (closeBtn || (!e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen)) {
				e.preventDefault();
				this.close();
				return;
			}
		});

		document.addEventListener("keydown", (e) => {
			if (this.options.closeEsc && e.key === 'Escape' && this.isOpen) {
				e.preventDefault();
				this.close();
			}
			if (this.options.focusCatch && e.key === 'Tab' && this.isOpen) {
				this._focusCatch(e);
			}
		});
		// === Close popup on form submit with AJAX ===
		document.addEventListener("submit", async (e) => {
			const form = e.target.closest(".popup__form");
			if (form) {
				e.preventDefault();
				const email = form.querySelector('#emailOrder').value.trim();
				const phone = form.querySelector('#phoneOrder').value.trim();
				const text = form.querySelector('#textOrder').value.trim();
				if ((!email && !phone) || !text) {
					alert("Будь ласка, заповніть або email, або телефон, і поле з замовленням.");
					return;
				}
				const formData = new FormData(form);
				try {
					await fetch(form.action, {
						method: form.method,
						body: formData
					});
					this.close();
					alert("Дякуємо! Ваше замовлення надіслано.");
				} catch (err) {
					console.error("Form submit error:", err);
				}
			}
		});
	}

	open(selectorValue) {
		if (selectorValue && typeof selectorValue === 'string') {
			this.targetOpen.selector = selectorValue;
			this._selectorOpen = true;
		}

		if (this.isOpen) {
			this._reopen = true;
			this.close();
		}

		this.targetOpen.element = document.querySelector(this.targetOpen.selector);
		if (!this.targetOpen.element) return;

		PopupContentManager.fillContent(this.targetOpen.element, this._triggerButton);
		if (this.youTubeCode) {
			PopupYouTubeManager.insert(this.targetOpen.element, this.youTubeCode, this.options.setAutoplayYoutube);
		}

		if (this.options.hashSettings.location) {
			this.hash = PopupHashManager.getHash(this.targetOpen.selector);
			PopupHashManager.setHash(this.hash);
		}

		this.options.on.beforeOpen(this);
		document.dispatchEvent(new CustomEvent("beforePopupOpen", { detail: { popup: this } }));

		this.targetOpen.element.classList.add(this.options.classes.popupActive);
		document.documentElement.classList.add(this.options.classes.bodyActive);
		this.targetOpen.element.setAttribute('aria-hidden', 'false');

		if (!this._reopen) !this.bodyLock ? bodyLock() : null;
		else this._reopen = false;

		this.previousOpen.selector = this.targetOpen.selector;
		this.previousOpen.element = this.targetOpen.element;
		this._selectorOpen = false;
		this.isOpen = true;

		setTimeout(() => this._focusTrap(), 50);

		this.options.on.afterOpen(this);
		document.dispatchEvent(new CustomEvent("afterPopupOpen", { detail: { popup: this } }));
	}

	close(selectorValue) {
		if (selectorValue && typeof selectorValue === 'string') {
			this.previousOpen.selector = selectorValue;
		}
		if (!this.isOpen) return;

		this.options.on.beforeClose(this);
		document.dispatchEvent(new CustomEvent("beforePopupClose", { detail: { popup: this } }));

		PopupYouTubeManager.clear(this.previousOpen.element);
		this.previousOpen.element.classList.remove(this.options.classes.popupActive);
		this.previousOpen.element.setAttribute('aria-hidden', 'true');
		document.documentElement.classList.remove(this.options.classes.bodyActive);
		!this.bodyLock ? bodyUnlock() : null;

		PopupHashManager.removeHash();
		this.isOpen = false;
		this.options.on.afterClose(this);
		document.dispatchEvent(new CustomEvent("afterPopupClose", { detail: { popup: this } }));
		setTimeout(() => this._focusTrap(), 50);
	}

	_focusCatch(e) {
		const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
		const focusArray = Array.from(focusable);
		const focusedIndex = focusArray.indexOf(document.activeElement);

		if (e.shiftKey && focusedIndex === 0) {
			focusArray[focusArray.length - 1].focus();
			e.preventDefault();
		}
		if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
			focusArray[0].focus();
			e.preventDefault();
		}
	}

	_focusTrap() {
		const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
		if (!this.isOpen && this.lastFocusEl) {
			this.lastFocusEl.focus();
		} else if (focusable.length) {
			focusable[0].focus();
		}
	}
}


// === Initialization ===
const popup = new Popup();
console.log("Popups:");
console.log(popup);
/*---------------Popup-----------------------------------*/

/*---------------Label animation-------------------------*/

const labels = document.querySelectorAll(".popup__label");
if (labels) {
	labels.forEach(label => {
		label.addEventListener('click', function (e) {
			const labelTarget = e.target.closest('.popup__label');
			console.log(labelTarget);
			if(labelTarget) {
				labels.forEach(l => {
					const input = l.querySelector('.popup__input');
					if(!input.value){
						l.classList.remove('_active');
					};
				});
				labelTarget.classList.add('_active');
			}
		});
		label.addEventListener('focusout', function (e) {
			const labelTarget = e.target.closest('.popup__label');
			const input = label.querySelector('.popup__input');
			if(!input.value){
				labelTarget.classList.remove('_active');
			};
		});
	});
}

/*---------------Label animation-------------------------*/

const popupPhone = document.getElementById("phone");
const contactPhone = document.getElementById("contactPhone");
const questionPhone = document.getElementById("phoneQuestion");
const orderPhone = document.getElementById("phoneOrder");

let inputMask = new Inputmask("+38(999)999-99-99",{ showMaskOnFocus: true },{ showMaskOnHover: false });
inputMask.mask(popupPhone);
inputMask.mask(contactPhone);
inputMask.mask(questionPhone);
inputMask.mask(orderPhone);

const close = document.querySelector(".popup__close");
const formPhoto = document.querySelector(".popup__form");
if(close) {
	if(formPhoto) {
		close.addEventListener('click', () => {
			formPhoto.reset();
		});
	}
}

/*--------- Swiper-------------*/
const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    speed: 500,
    spaceBetween: 100,
    loop: true,
    // Navigation arrows
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});
/*--------- Swiper-------------*/ 