var searchableInputs;
var searchableInputsAr;
var searchableInputsIdAr;
var optionsAll;
var optionLists;
var optionListsAr;
var optionListsForAr;

function loadSI() {
	searchableInputs = document.querySelectorAll(".si-input");
	searchableInputsAr = [...searchableInputs];
	searchableInputsIdAr = [];
	for (i=0; i<searchableInputsAr.length; i++) {
		var el = searchableInputsAr[i];
		searchableInputsIdAr.push(el.id);
		if (el.getAttribute("si-listener") !== "true") {
			el.setAttribute("si-listener", "true");
			el.addEventListener("focusin", function() {
				this.select();
				unhide('.si-option');
			});
		}
	}

	optionsAll = document.querySelectorAll(".si-option");
	optionLists = document.querySelectorAll(".si-option-list");
	optionListsAr = [...optionLists];
	optionListsForAr = [];
	for (i=0; i<optionListsAr.length; i++) {
		var tempfor = optionListsAr[i].getAttribute("for-si-input");
		if (tempfor) optionListsForAr.push(tempfor);
		else optionListsForAr.push("undefined");
	}
	for (i=0; i<optionsAll.length; i++) {
		var tempOption = optionsAll[i];
		if (tempOption.getAttribute("si-listener") !==  "true") {
			tempOption.setAttribute("si-listener", "true");
			tempOption.addEventListener("click", function() {
				var tempinput = document.getElementById(this.parentElement.getAttribute("for-si-input"));
				tempinput.value = this.innerHTML;
				dispMod(undefined, true, tempinput);
			});
			tempOption.addEventListener("mouseover", function() {
				unhover();
				this.classList.add("si-hovered");
			});
		}
	}
}

loadSI();

document.addEventListener("input", dispMod);
document.addEventListener('keydown', keyLog);

function keyLog(key) {
	if (key.code === "Escape") unfocus(".si-option");
	if (key.code === "ArrowUp" || key.code === "ArrowDown" || key.code === "Enter") selectNew(key.code);
}

function dispMod(el, unfocusTF, overrideEL) {
	loadSI();
	var input;
	if (overrideEL) var input = overrideEL;
	else var input = document.activeElement;
	if (searchableInputsIdAr.indexOf(input.id) === -1) return false;
	var optionListNum = optionListsForAr.indexOf(input.id);
	if (optionListNum > -1) {
		var options = optionListsAr[optionListNum].querySelectorAll("*");
		for (i=0; i<options.length; i++) {
			if (options[i].innerHTML.toLowerCase().replace(/([^a-z0-9])+/g).match(input.value.toLowerCase().replace(/([^a-z0-9])+/g))) {
				options[i].classList.remove("si-hidden");
			} else {
				options[i].classList.add("si-hidden");
			}
		}
	}
	unhover();
	if (unfocusTF) unfocus(".si-option", overrideEL);

}

function selectElementContents(el) {
	var range = document.createRange();
	range.selectNodeContents(el);
	var sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
}

function unfocus(className, returnEl) {
	loadSI();
	if (!returnEl) var returnEl = document.activeElement;
	var tmp = document.createElement("input");
	returnEl.parentNode.insertBefore(returnEl, returnEl.nextSibling);
	tmp.focus();
	tmp.remove();
	var classList = document.querySelectorAll(className);
	for (i=0; i<classList.length; i++) {
		classList[i].classList.add("si-hidden");
	}
	returnEl.scrollIntoViewIfNeeded(true);
}

function unhide(className) {
	unhover();
	var classList = document.querySelectorAll(className);
	for (i=0; i<classList.length; i++) {
		classList[i].classList.remove("si-hidden");
	}
}

function unhover() {
	var allHovered = document.querySelectorAll(".si-hovered");
	for (i=0; i<allHovered.length; i++) {
		allHovered[i].classList.remove("si-hovered");
	}
}

function selectNew(dir) {
	loadSI();
	var input = document.activeElement;
	if (searchableInputsIdAr.indexOf(input.id) === -1) return false;
	var optionListNum = optionListsForAr.indexOf(input.id);
	if (optionListNum > -1) {
		var optionList = optionListsAr[optionListNum];
		var options = optionList.querySelectorAll("*");
		var available = optionList.querySelectorAll(".si-option:not(.si-hidden)");
		var availableAr = [...available];
		var hovered = optionList.querySelector(".si-hovered");
		var hoverIndex = availableAr.indexOf(hovered);
		if (dir === "ArrowUp") {
			if (hoverIndex === 0) var hoverIndex = 1;
			if (hoverIndex === -1) var hoverIndex = availableAr.length;
			var hoverIndex = hoverIndex - 1;
			unhover();
			available[hoverIndex].classList.add("si-hovered");
			available[hoverIndex].scrollIntoViewIfNeeded(true);
		}
		if (dir === "ArrowDown") {
			if (hoverIndex === availableAr.length - 1) var hoverIndex = availableAr.length - 2;
			var hoverIndex = hoverIndex + 1;
			unhover();
			available[hoverIndex].classList.add("si-hovered");
			available[hoverIndex].scrollIntoViewIfNeeded(true);
		}
		if (dir === "Enter") {
			if (hovered) input.value = available[hoverIndex].innerHTML;
			else input.value = available[0].innerHTML;
			dispMod();
			unfocus(".si-option");
		}
	}
}

function newSIInput(id, option, centered) {
	if (typeof(id) !== "string") throw new Error("Parameter 1 (id) must be of type String");
	var optionType = typeof(option);
	if (optionType !== "string" && !Array.isArray(option)) throw new Error("Parameter 2 (option) must be of type String or type Array");
	var options = [];
	if (optionType === "string") options.push(option);
	else options = option;
	for (i=0; i<options.length; i++) if (typeof(options[i]) !== "string") throw new Error("Parameter 2 (option) must be of type Array containing only Strings");
	if (typeof(centered) !== "undefined" && typeof(centered) !== "boolean") throw new Error("Parameter 3 (centered) must be of type Boolean or be Undefined");
	var id = id.toLowerCase().replace(/(\s|_)/g, "-").replace(/([^a-z0-9\-]|(?<=-)-*)+/g, "");
	var container =  document.createElement("div");
	container.classList.add("si-container");
	if (centered) container.classList.add("si-centered");
	var newSI = document.createElement("input");
	newSI.classList.add("si-input");
	newSI.id = id;
	container.appendChild(newSI);
	var optionContainer = document.createElement("div");
	optionContainer.classList.add("si-option-container");
	container.appendChild(optionContainer);
	var optionList = document.createElement("div");
	optionList.classList.add("si-option-list");
	optionList.setAttribute("for-si-input", id);
	for (i=0; i<options.length; i++) {
		var tempOp = document.createElement("p");
		tempOp.classList.add("si-option");
		tempOp.innerHTML = options[i];
		optionList.appendChild(tempOp);
	}
	optionContainer.appendChild(optionList);
	container.appendChild(optionContainer);
	return container;
}

function newSIOption(forId, option) {
	if (typeof(forId) !== "string") throw new Error("Parameter 1 (forId) must be of type String");
	var optionType = typeof(option);
	if (optionType !== "string" && !Array.isArray(option)) throw new Error("Parameter 2 (option) must be of type String or type Array");
	var options = [];
	if (optionType === "string") options.push(option);
	else options = option;
	var optionList = document.getElementById(forId).parentElement.querySelector(".si-option-list");
	for (i=0; i<options.length; i++) {
		var tmp = document.createElement("p");
		tmp.classList.add("si-option");
		tmp.innerHTML  = options[i];
		optionList.appendChild(tmp);
	}
}
