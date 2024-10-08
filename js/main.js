let saturate = document.querySelector("#saturate");
let contrast = document.querySelector("#contrast");
let brightness = document.querySelector("#brightness");
let sepia = document.querySelector("#sepia");
let grayscale = document.querySelector("#grayscale");
let blur = document.querySelector("#blur");
let hueRotate = document.querySelector("#hueRotate");
let invert = document.querySelector("#invert");

let upload = document.querySelector("#upload");
let download = document.querySelector("#download");
let img = document.querySelector("#img");

let resetAll = document.querySelector("#resetAll");
let imgBox = document.querySelector(".img-box");

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const defaultValues = {
  saturate: "100",
  contrast: "100",
  brightness: "100",
  sepia: "0",
  grayscale: "0",
  blur: "0",
  hueRotate: "0",
  invert: "0",
};

function resetValue() {
  ctx.filter = "none";
  redrawImage();
  saturate.value = defaultValues.saturate;
  contrast.value = defaultValues.contrast;
  brightness.value = defaultValues.brightness;
  sepia.value = defaultValues.sepia;
  grayscale.value = defaultValues.grayscale;
  blur.value = defaultValues.blur;
  hueRotate.value = defaultValues.hueRotate;
  invert.value = defaultValues.invert;
  updateFilterValues();

  document.querySelectorAll(".reset").forEach((resetButton) => {
    resetButton.style.display = "none";
  });
}

const toggleOriginal = document.querySelector("#toggleOriginal");
// const imgBox = document.querySelector(".img-box");

function showOriginalImage() {
  ctx.filter = "none";
  redrawImage();
  toggleOriginal.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
}

function showEditedImage() {
  applyFilters();
  toggleOriginal.innerHTML = `<i class="fa-solid fa-eye"></i>`;
}

imgBox.addEventListener("touchstart", (e) => {
  e.preventDefault();
  showOriginalImage();
});

imgBox.addEventListener("touchend", (e) => {
  e.preventDefault();
  showEditedImage();
});

toggleOriginal.addEventListener("mousedown", showOriginalImage);
toggleOriginal.addEventListener("mouseup", showEditedImage);

function redrawImage() {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function applyFilters() {
  ctx.filter = `
    saturate(${saturate.value}%)
    contrast(${contrast.value}%)
    brightness(${brightness.value}%)
    sepia(${sepia.value}%)
    grayscale(${grayscale.value})
    blur(${blur.value}px)
    hue-rotate(${hueRotate.value}deg)
    invert(${invert.value}%)
  `;
  redrawImage();
}

function handleError(message) {
  alert(message);
  resetValue();
}

function handleFileUpload(file) {
  let fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = function () {
    img.src = fileReader.result;
  };
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    redrawImage();
    img.style.display = "none";
  };
}

function downloadImage() {
  const dataURL = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "image.jpg";
  link.click();
}

function updateFilterValues() {
  document.getElementById("saturateValue").innerText = `${saturate.value} %`;
  document.getElementById("contrastValue").innerText = `${contrast.value} %`;
  document.getElementById(
    "brightnessValue"
  ).innerText = `${brightness.value} %`;
  document.getElementById("sepiaValue").innerText = `${sepia.value} %`;
  document.getElementById("grayscaleValue").innerText = `${grayscale.value}`;
  document.getElementById("blurValue").innerText = `${blur.value} px`;
  document.getElementById(
    "hueRotateValue"
  ).innerText = `${hueRotate.value} deg`;
  document.getElementById("invertValue").innerText = `${invert.value} %`;
}

function setupEventListeners() {
  document.querySelectorAll(".reset").forEach((icon) => {
    icon.addEventListener("click", (event) => {
      const filterId = event.target.dataset.filterId;
      const inputElement = document.getElementById(filterId);
      if (inputElement) {
        inputElement.value = defaultValues[filterId];
        applyFilters();
        updateFilterValues();

        icon.style.display = "none";
      }
    });
  });

  document.querySelectorAll("ul li input").forEach((input) => {
    input.addEventListener("input", (event) => {
      const filterId = event.target.id;
      const resetButton = document.querySelector(
        `[data-filter-id="${filterId}"]`
      );

      if (input.value != defaultValues[filterId]) {
        resetButton.style.display = "inline-block";
      }

      applyFilters();
      updateFilterValues();
    });
  });

  resetAll.addEventListener("click", resetValue);
  download.addEventListener("click", downloadImage);
}

function setupImageUpload() {
  upload.onchange = function () {
    if (!upload.files[0] || !upload.files[0].type.startsWith("image/")) {
      handleError("Please upload a valid image file.");
      return;
    }
    resetValue();
    updateFilterValues();
    handleFileUpload(upload.files[0]);
    download.style.display = "block";
    resetAll.style.display = "block";
    imgBox.style.display = "block";
  };
}

function init() {
  setupEventListeners();
  setupImageUpload();
}

init();
