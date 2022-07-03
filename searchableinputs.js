var searchableInputs;
var searchableInputsAr;
var searchableInputsIdAr;
var siOptionsAll;
var siOptionLists;
var siOptionListsAr;
var siOptionListsForAr;

function loadSI() {
  searchableInputs = document.querySelectorAll(".si-input");
  searchableInputsAr = [...searchableInputs];
  searchableInputsIdAr = [];
  for (var i = 0; i < searchableInputsAr.length; i++) {
    var el = searchableInputsAr[i];
    searchableInputsIdAr.push(el.id);
    if (el.getAttribute("si-listener") !== "true") {
      el.setAttribute("si-listener", "true");
      el.addEventListener("focusin", function () {
        this.select();
        this.nextElementSibling.children[0].classList.remove("si-modified");
        siUnhide(".si-option");
      });
    }
  }

  siOptionsAll = document.querySelectorAll(".si-option");
  siOptionLists = document.querySelectorAll(".si-option-list");
  siOptionListsAr = [...siOptionLists];
  siOptionListsForAr = [];
  for (var i = 0; i < siOptionListsAr.length; i++) {
    var tempfor = siOptionListsAr[i].getAttribute("for-si-input");
    if (tempfor) siOptionListsForAr.push(tempfor);
    else siOptionListsForAr.push("undefined");
  }
  for (var i = 0; i < siOptionsAll.length; i++) {
    var siTempOption = siOptionsAll[i];
    if (siTempOption.getAttribute("si-listener") !== "true") {
      siTempOption.setAttribute("si-listener", "true");
      siTempOption.addEventListener("click", function () {
        var siTempInput = document.getElementById(
          this.parentElement.getAttribute("for-si-input")
        );
        siTempInput.value = this.innerHTML;
        siTempInput.dispatchEvent(
          new CustomEvent("sivalueconfirmed", {
            detail: {
              value: siTempInput.value,
              method: "click"
            }
          })
        );
        siDispMod(undefined, true, siTempInput);
      });
      siTempOption.addEventListener("mouseover", function () {
        siUnhover();
        this.classList.add("si-hovered");
      });
    }
  }
}

loadSI();

document.addEventListener("input", siDispMod);
document.addEventListener("keydown", siKeyLog);

function siKeyLog(key) {
  if (key.keyCode === 27) siUnfocus(".si-option"); // Escape
  if (
    key.keyCode === 38 || // ArrowUp
    key.keyCode === 40 || // ArrowDown
    key.keyCode === 13 // Enter
  )
    siSelectNew(key.keyCode);
}

function siDispMod(el, unfocusTF, overrideEL) {
  loadSI();
  var input;
  if (overrideEL) var input = overrideEL;
  else var input = document.activeElement;
  if (searchableInputsIdAr.indexOf(input.id) === -1) return false;
  var optionListNum = siOptionListsForAr.indexOf(input.id);
  siOptionListsAr[optionListNum].classList.add("si-modified");
  if (optionListNum > -1) {
    var siOptions = siOptionListsAr[optionListNum].querySelectorAll("*");
    for (i = 0; i < siOptions.length; i++) {
      if (
        siOptions[i].innerHTML
          .toLowerCase()
          .replace(/([^a-z0-9])+/g)
          .match(input.value.toLowerCase().replace(/([^a-z0-9])+/g))
      ) {
        siOptions[i].classList.add("si-visible");
        siOptions[i].classList.remove("si-hidden", "si-even", "si-odd");
      } else {
        siOptions[i].classList.add("si-hidden");
        siOptions[i].classList.remove("si-visible", "si-even", "si-odd");
      }
    }
    var siOptionsVisible = siOptionListsAr[optionListNum].querySelectorAll(
      ".si-visible"
    );
    var isEven = true;
    for (i = 0; i < siOptionsVisible.length; i++) {
      if (isEven) {
        siOptionsVisible[i].classList.add("si-even");
        var isEven = false;
      } else {
        siOptionsVisible[i].classList.add("si-odd");
        var isEven = true;
      }
    }
  }
  siUnhover();
  if (unfocusTF) siUnfocus(".si-option", overrideEL);
}

function siSelectElementContents(el) {
  var range = document.createRange();
  range.selectNodeContents(el);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function siUnfocus(className, returnEl) {
  loadSI();
  if (!returnEl) var returnEl = document.activeElement;
  var tmp = document.createElement("input");
  returnEl.parentNode.insertBefore(returnEl, returnEl.nextSibling);
  tmp.focus();
  tmp.remove();
  var classList = document.querySelectorAll(className);
  for (i = 0; i < classList.length; i++) {
    classList[i].classList.add("si-hidden");
  }
  returnEl.scrollIntoView({ block: "nearest", inline: "nearest" });
  [...document.querySelectorAll(".si-even, .si-odd")].forEach(function (currentValue) {
    currentValue.classList.remove("si-even", "si-odd");
  });
}

function siUnhide(className) {
  siUnhover();
  var classList = document.querySelectorAll(className);
  for (i = 0; i < classList.length; i++) {
    classList[i].classList.remove("si-hidden");
  }
}

function siUnhover() {
  var allHovered = document.querySelectorAll(".si-hovered");
  for (i = 0; i < allHovered.length; i++) {
    allHovered[i].classList.remove("si-hovered");
  }
}

function siSelectNew(dir) {
  loadSI();
  var input = document.activeElement;
  if (searchableInputsIdAr.indexOf(input.id) === -1) return false;
  var optionListNum = siOptionListsForAr.indexOf(input.id);
  if (optionListNum > -1) {
    var optionList = siOptionListsAr[optionListNum];
    var siOptions = optionList.querySelectorAll("*");
    var available = optionList.querySelectorAll(".si-option:not(.si-hidden)");
    var availableAr = [...available];
    var hovered = optionList.querySelector(".si-hovered");
    var hoverIndex = availableAr.indexOf(hovered);
    if (dir === 38) {
      // ArrowUp
      if (hoverIndex === 0) var hoverIndex = 1;
      if (hoverIndex === -1) var hoverIndex = availableAr.length;
      var hoverIndex = hoverIndex - 1;
      siUnhover();
      available[hoverIndex].classList.add("si-hovered");
      available[hoverIndex].scrollIntoView({
        block: "nearest",
        inline: "nearest"
      });
    }
    if (dir === 40) {
      // ArrowDown
      if (hoverIndex === availableAr.length - 1)
        var hoverIndex = availableAr.length - 2;
      var hoverIndex = hoverIndex + 1;
      siUnhover();
      available[hoverIndex].classList.add("si-hovered");
      available[hoverIndex].scrollIntoView({
        block: "nearest",
        inline: "nearest"
      });
    }
    if (dir === 13) {
      // Enter
      if (hovered) input.value = available[hoverIndex].innerHTML;
      else input.value = available[0].innerHTML;
      input.dispatchEvent(
        new CustomEvent("sivalueconfirmed", {
          detail: {
            value: input.value,
            method: "enter"
          }
        })
      );
      siDispMod();
      siUnfocus(".si-option");
    }
  }
}

function newSIInput(id, option, centered) {
  if (typeof id !== "string")
    throw new Error("Parameter 1 (id) must be of type String");
  var optionType = typeof option;
  if (optionType !== "string" && !Array.isArray(option))
    throw new Error(
      "Parameter 2 (option) must be of type String or type Array"
    );
  var siOptions = [];
  if (optionType === "string") siOptions.push(option);
  else siOptions = option;
  for (i = 0; i < siOptions.length; i++)
    if (typeof siOptions[i] !== "string")
      throw new Error(
        "Parameter 2 (option) must be of type Array containing only Strings"
      );
  if (typeof centered !== "undefined" && typeof centered !== "boolean")
    throw new Error(
      "Parameter 3 (centered) must be of type Boolean or be Undefined"
    );
  var id = id
    .toLowerCase()
    .replace(/(\s|_)/g, "-")
    .replace(/([^a-z0-9\-]|(?<=-)-*)+/g, "");
  var container = document.createElement("div");
  container.classList.add("si-container");
  if (centered) container.classList.add("si-centered");
  var newSI = document.createElement("input");
  newSI.classList.add("si-input");
  newSI.autocomplete = "off";
  newSI.id = id;
  container.appendChild(newSI);
  var optionContainer = document.createElement("div");
  optionContainer.classList.add("si-option-container");
  container.appendChild(optionContainer);
  var optionList = document.createElement("div");
  optionList.classList.add("si-option-list");
  optionList.setAttribute("for-si-input", id);
  for (i = 0; i < siOptions.length; i++) {
    var tempOp = document.createElement("p");
    tempOp.classList.add("si-option");
    tempOp.innerHTML = siOptions[i];
    optionList.appendChild(tempOp);
  }
  optionContainer.appendChild(optionList);
  container.appendChild(optionContainer);
  setTimeout(() => {
    loadSI();
  }, 200);
  return container;
}

function newSIOption(forId, option) {
  if (typeof forId !== "string")
    throw new Error("Parameter 1 (forId) must be of type String");
  var optionType = typeof option;
  if (optionType !== "string" && !Array.isArray(option))
    throw new Error(
      "Parameter 2 (option) must be of type String or type Array"
    );
  var siOptions = [];
  if (optionType === "string") siOptions.push(option);
  else siOptions = option;
  var optionList = document
    .getElementById(forId)
    .parentElement.querySelector(".si-option-list");
  for (i = 0; i < siOptions.length; i++) {
    var tmp = document.createElement("p");
    tmp.classList.add("si-option");
    tmp.innerHTML = siOptions[i];
    optionList.appendChild(tmp);
  }
  loadSI();
  return tmp;
}
