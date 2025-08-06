function loadSI() {
  var searchableInputs = document.querySelectorAll(".si-input");
  for (var i = 0; i < searchableInputs.length; i++) {
    var el = searchableInputs[i];
    if (el.getAttribute("si-listener") !== "true") {
      el.setAttribute("si-listener", "true");
      el.addEventListener("focusin", function () {
        this.select();
        this.parentElement.querySelector(".si-option-list").classList.remove("si-modified");
        [...document.querySelectorAll(".si-even, .si-odd")].forEach(function (currentValue) {
          currentValue.classList.remove("si-even", "si-odd");
        });
        siUnhide(".si-option");
      });
    }
  }
  siOptions = document.querySelectorAll(".si-option");
  for (var i = 0; i < siOptions.length; i++) {
    if (siOptions[i].getAttribute("si-listener") !== "true") {
      siOptions[i].setAttribute("si-listener", "true");
      siOptions[i].addEventListener("click", function () {
        var siInput = document.getElementById(
          this.parentElement.dataset.siInput ||
          this.parentElement.getAttribute("for-si-input")
        );
        var value = this.dataset.siValue || siGetVisibleText(this);
        var isrun = siInput.dispatchEvent(
          new CustomEvent("sivalueconfirmed", {
            detail: {
              lastvalue: siInput.value,
              value,
              method: "click",
              option: this,
            },
            cancelable: true,
          })
        );
        if (isrun) siInput.value = value;
        siDispMod(undefined, true, siInput);
      });
      siOptions[i].addEventListener("mouseover", function () {
        siUnhover();
        this.classList.add("si-hovered");
      });
    }
  }
}

loadSI();

function siGetVisibleText(el) {
  var temp = document.createElement("span");
  temp.appendChild(el.cloneNode(true));
  temp.querySelectorAll(".si-option-hidden").forEach(function(current) {
    current.style.display = "none";
  });
  temp.classList.add(".si-inner-temp");
  document.body.appendChild(temp);
  var toReturn = temp.innerText;
  document.body.removeChild(temp);
  return toReturn;
}

document.addEventListener("input", siDispMod);
document.addEventListener("keydown", siKeyLog);

document.addEventListener("keyup", (e) => {
  if (e.key === "Escape") {
    const active = document.activeElement;
    if (active && active.classList.contains("si-input")) {
      siUnfocus(".si-option", active);
    }
  }
});

function siKeyLog(key) {
  if (
    key.key === "ArrowUp" ||
    key.key === "ArrowDown" ||
    key.key === "Enter"
  ) {
    key.preventDefault();
    siSelectNew(key.key);
  }
}

function siDispMod(el, unfocusTF, overrideEL) {
  loadSI();
  var input;
  var input = overrideEL ? overrideEL : document.activeElement;
  if (input.id == "" || !(document.querySelector(".si-input#" + input.id)) || !(document.querySelector(".si-option-list[for-si-input='" + input.id + "']"))) return false;
  var optionList = document.querySelector(".si-option-list[for-si-input='" + input.id + "']");
  optionList.classList.add("si-modified");
  var siOptions = optionList.querySelectorAll(".si-option");
  for (i = 0; i < siOptions.length; i++) {
    if (
      siOptions[i].innerText
      .toLowerCase()
      .includes(input.value.toLowerCase())
    ) {
      siOptions[i].classList.add("si-visible");
      siOptions[i].classList.remove("si-hidden", "si-even", "si-odd");
    } else {
      siOptions[i].classList.add("si-hidden");
      siOptions[i].classList.remove("si-visible", "si-even", "si-odd");
    }
  }
  var siOptionsVisible = optionList.querySelectorAll(
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
  var input = document.activeElement;
  if (!input.closest(".si-container") || !(document.querySelector(".si-input#" + input.id)) || !(document.querySelector(".si-option-list[for-si-input='" + input.id + "']"))) return false;
  loadSI();
  var optionList = document.querySelector(".si-option-list[for-si-input='" + input.id + "']");
  var siOptions = optionList.querySelectorAll(".si-option");
  var available = optionList.querySelectorAll(".si-option:not(.si-hidden)");
  if (available.length == 0) return;
  var availableAr = [...available];
  var hovered = optionList.querySelector(".si-hovered");
  var hoverIndex = availableAr.indexOf(hovered);
  if (dir === "ArrowUp") {
    var hoverIndex = hoverIndex < 1 ? availableAr.length - 1 : hoverIndex - 1;
    siUnhover();
    available[hoverIndex].classList.add("si-hovered");
    available[hoverIndex].scrollIntoView({
      block: "nearest",
      inline: "nearest"
    });
  }
  if (dir === "ArrowDown") {
    var hoverIndex = hoverIndex == availableAr.length - 1 ? 0 : hoverIndex + 1;
    siUnhover();
    available[hoverIndex].classList.add("si-hovered");
    available[hoverIndex].scrollIntoView({
      block: "nearest",
      inline: "nearest"
    });
  }
  if (dir === "Enter") {
    var option = hovered ? available[hoverIndex] : available[0];
    var value = option.dataset.siValue || siGetVisibleText(option);
    var isrun = input.dispatchEvent(
      new CustomEvent("sivalueconfirmed", {
        detail: {
          lastvalue: input.value,
          value,
          method: "enter",
          option,
        },
        cancelable: true,
      })
    );
    if (isrun) input.value = value;
    siDispMod();
    siUnfocus(".si-option");
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

// :)
