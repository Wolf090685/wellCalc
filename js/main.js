// преобразование через js элементов сверстаннных как селекты визуально в радиокнопки
$('.image-picker').imagepicker(
	{ show_label: true }
);
// стилизация первой группы селектов
$("#calc-well .selectpicker").select2();

// КАЛЬКУЛЯТОР
// объявляем переменные и находим элементы в верстке
let totalPrice = 0;
let wellSpecs = '';

const allSelect = document.querySelectorAll('select');
const depth = document.getElementById('depth');
const roof = document.getElementById('roof');
const clevis = document.getElementById('clevis');
const dfilter = document.getElementById('dfilter');
const pump = document.getElementById('pump');
const lock = document.getElementById('lock');
const roofImg = document.querySelector('.roofimg');
const depthPriceHolder = document.querySelector('.depth_price');
const roofPriceHolder = document.querySelector('.roof_price');
const clevisPriceHolder = document.querySelector('.clevis_price');
const wellSpecsHolder = document.querySelector('.info');
const wellPriceHolder = document.querySelector('.price');

// подсчет цены на основе данных из селектов
function calcWell() {
	const depthValue = parseInt(depth.value);
	const roofValue = parseInt(roof.value);
	const clevisValue = parseInt(clevis.value);
	const dfilterValue = parseInt(dfilter.value);
	const pumpValue = parseInt(pump.value);
	const lockValue = parseInt(lock.value);

	totalPrice = depthValue + roofValue + clevisValue + dfilterValue + pumpValue + lockValue;

	renderPriceAndSpecs(totalPrice, depthValue, roofValue, clevisValue);
}

// отображения цены и комплектации
function renderPriceAndSpecs(totalPrice, depthValue, roofValue, clevisValue) {
	const depthText = depth.options[depth.selectedIndex].textContent;
	const roofText = roof.options[roof.selectedIndex].textContent;
	const clevisText = clevis.options[clevis.selectedIndex].textContent;
	const dfilterText = dfilter.options[dfilter.selectedIndex].textContent;
	const pumpText = pump.options[pump.selectedIndex].textContent;
	const lockText = lock.options[lock.selectedIndex].textContent;

	// анимация цифр
	$("#calc-well .price").animate({ num: totalPrice }, { duration: 500, step: function (num) { this.innerHTML = XFormatPrice((num).toFixed(0)); } });
	$("#calc-well .depth_price").animate({ num: depthValue }, { duration: 500, step: function (num) { this.innerHTML = XFormatPrice((num).toFixed(0)); } });
	$("#calc-well .roof_price").animate({ num: roofValue }, { duration: 500, step: function (num) { this.innerHTML = XFormatPrice((num).toFixed(0)); } });
	$("#calc-well .clevis_price").animate({ num: clevisValue }, { duration: 500, step: function (num) { this.innerHTML = XFormatPrice((num).toFixed(0)); } });

	// без анимации
	// wellPriceHolder.textContent = XFormatPrice(totalPrice);
	// depthPriceHolder.textContent = XFormatPrice(depthValue);
	// roofPriceHolder.textContent = XFormatPrice(roofValue);
	// clevisPriceHolder.textContent = XFormatPrice(clevisValue);

	const srcRoofImg = roof.options[roof.selectedIndex].getAttribute("data-image");
	roofImg.src = srcRoofImg;

	const specsHolderHTML = `
		<li>${depthText}</li>
		<li>${roofText}</li>
		<li>${clevisText}</li>
		<li>${dfilterText}</li>
		<li>${pumpText}</li>
		<li>${lockText}</li>
	`;

	wellSpecsHolder.innerHTML = specsHolderHTML;
}

// Форматирование вида цены (пробелы и т.д.)
function XFormatPrice(_number) {
	let decimal = 0;
	let separator = ' ';
	let decpoint = '.';
	let format_string = '#₽';

	let r = parseFloat(_number);

	let exp10 = Math.pow(10, decimal);// приводим к правильному множителю
	r = Math.round(r * exp10) / exp10;// округляем до необходимого числа знаков после запятой

	rr = Number(r).toFixed(decimal).toString().split('.');

	b = rr[0].replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, "\$1" + separator);

	r = (rr[1] ? b + decpoint + rr[1] : b);

	return format_string.replace("#", r);
}

// Validate form
function validateForms(form) {

	$.validator.methods.cyrillic = function (value, element) {
		return this.optional(element) || /^[А-Яа-яЁё]+$/.test(value);
	};

	$(form).validate({
		rules: {
			yname: {
				required: true,
				minlength: 2,
				cyrillic: true
			},
			ytel: "required"
		},
		messages: {
			yname: {
				required: "Введите свое имя",
				cyrillic: "В имени допустима только кириллица, без пробелов и знаков препиния",
				minlength: jQuery.validator.format("Введите минимум {0} символа!")
			},
			ytel: "Введите номер телефона"
		}
	});
}

// Если нужна прокрутка блока с ценой и формой на больших экранах (готовый код - в двух местах поменять название соотв. блоков)
if (document.body.clientWidth > 767) {

	(function () {
		let a = document.querySelector(".calc-well .col-lg-4"), b = null, P = 0;
		window.addEventListener("scroll", Ascroll, false);
		document.body.addEventListener("scroll", Ascroll, false);
		function Ascroll() {
			if (b == null) {
				let Sa = getComputedStyle(a, ""), s = "";
				for (let i = 0; i < Sa.length; i++) {
					if (Sa[i].indexOf("overflow") == 0 || Sa[i].indexOf("padding") == 0 || Sa[i].indexOf("border") == 0 || Sa[i].indexOf("outline") == 0 || Sa[i].indexOf("box-shadow") == 0 || Sa[i].indexOf("background") == 0) {
						s += Sa[i] + ": " + Sa.getPropertyValue(Sa[i]) + "; "
					}
				}
				b = document.createElement("div");
				b.style.cssText = s + " box-sizing: border-box; width: " + a.offsetWidth + "px;";
				a.insertBefore(b, a.firstChild);
				let l = a.childNodes.length;
				for (let i = 1; i < l; i++) {
					b.appendChild(a.childNodes[1]);
				}
				a.style.height = b.getBoundingClientRect().height + "px";
				a.style.padding = "0";
				a.style.border = "0";
			}
			let Ra = a.getBoundingClientRect(),
				R = Math.round(Ra.top + b.getBoundingClientRect().height - document.querySelector(".calc-well .col-lg-8").getBoundingClientRect().bottom);  // селектор блока, при достижении нижнего края которого нужно открепить прилипающий элемент
			if ((Ra.top - P) <= 0) {
				if ((Ra.top - P) <= R) {
					b.className = "stop";
					b.style.top = - R + "px";
				} else {
					b.className = "sticky";
					b.style.top = P + "px";
				}
			} else {
				b.className = "";
				b.style.top = "";
			}
			window.addEventListener("resize", function () {
				a.children[0].style.width = getComputedStyle(a, "").width
			}, false);
		}
	})();
}

// Слушаем событие изменения селектов
allSelect.forEach(select => {
	select.onchange = calcWell;
});

// E-mail
$("form").submit(function() { //Change
	var th = $(this);
	$.ajax({
		type: "POST",
		url: "mail.php", //Change
		data: th.serialize()
	}).done(function() {
		alert("Thank you!");
		setTimeout(function() {
			// Done Functions
			th.trigger("reset");
		}, 1000);
	});
	return false;
});

// calcWell();
validateForms('#form');

// если нужен код на jQuery
// function calcWell() {	
// 	let depth = parseInt(document.getElementById("depth").options[document.getElementById("depth").selectedIndex].value);
// 	let depth_text = document.getElementById("depth").options[document.getElementById("depth").selectedIndex].text;

// 	let roof = parseInt(document.getElementById("roof").options[document.getElementById("roof").selectedIndex].value);
// 	let roof_img = document.getElementById("roof").options[document.getElementById("roof").selectedIndex].getAttribute("data-image");
// 	let roof_text =  document.getElementById("roof").options[document.getElementById("roof").selectedIndex].text;

// 	let clevis = parseInt(document.getElementById("clevis").options[document.getElementById("clevis").selectedIndex].value);
// 	let clevis_text = document.getElementById("clevis").options[document.getElementById("clevis").selectedIndex].text;

// 	let dfilter = parseInt(document.getElementById("dfilter").options[document.getElementById("dfilter").selectedIndex].value);
// 	let dfilter_text = document.getElementById("dfilter").options[document.getElementById("dfilter").selectedIndex].text;

// 	let pump = parseInt(document.getElementById("pump").options[document.getElementById("pump").selectedIndex].value);
// 	let pump_text = document.getElementById("pump").options[document.getElementById("pump").selectedIndex].text;

// 	let lock = parseInt(document.getElementById("lock").options[document.getElementById("lock").selectedIndex].value);
// 	let lock_text = document.getElementById("lock").options[document.getElementById("lock").selectedIndex].text;

// 	let count = depth + roof + clevis + dfilter + pump + lock;

// 	//Анимация цен в первых трех селектах
// 	jQuery("#calc-well .depth_price").animate({ num: depth}, {duration: 500,step: function (num){this.innerHTML = XFormatPrice((num).toFixed(0));}});
// 	jQuery("#calc-well .roof_price").animate({ num: roof}, {duration: 500,step: function (num){this.innerHTML = XFormatPrice((num).toFixed(0));}});
// 	jQuery("#calc-well .clevis_price").animate({ num: clevis}, {duration: 500,step: function (num){this.innerHTML = XFormatPrice((num).toFixed(0));}});

// 	//Меняется картинка домика при выборе
// 	jQuery("#calc-well .roofimg").each( function(){ this.src = roof_img; this.href = roof_img;} );

// 	//Выводим общую цену с анимацией цифр
// 	jQuery("#calc-well .price").animate({ num: count}, {duration: 500,step: function (num){this.innerHTML = XFormatPrice((num).toFixed(0));}});

// 	//Текст
// 	let text = "<li>"+depth_text+"</li><li>"+roof_text+"</li><li>"+clevis_text+"</li><li>"+dfilter_text+"</li><li>"+pump_text+"</li><li>"+lock_text+"</li>";
// 	let mail = depth_text+",\n"+roof_text+",\n"+clevis_text+",\n"+dfilter_text+",\n"+pump_text+",\n"+lock_text+",\n\nИтого: "+count+" руб.";	

// 	jQuery("#calc-well .info").html(text);
// 	jQuery("#calc-well .wpcf7 .yinfo").val(mail);
// }