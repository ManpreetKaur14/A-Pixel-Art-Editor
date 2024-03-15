//Initial references
let container = document.querySelector(".container");
let gridButton = document.getElementById("submit-grid");
let clearGridButton = document.getElementById("clear-grid");
let colorButton = document.getElementById("color-input");
let eraseBtn = document.getElementById("erase-btn");
let paintBtn = document.getElementById("paint-btn");
let saveBtn = document.getElementById("save-btn"); 
let rectangleBtn = document.getElementById("rectangle-btn");// Added reference to the save button

//Events object
let events = {
  mouse: {
    down: "mousedown",
    move: "mousemove",
    up: "mouseup",
  },
  touch: {
    down: "touchstart",
    move: "touchmove",
    up: "touchend",
  },
};

let deviceType = "";

//Initially draw and erase would be false
let draw = false;
let erase = false;

//Detect touch device
const isTouchDevice = () => {
  try {
    //We try to create TouchEvent(it would fail for desktops and throw error)
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

isTouchDevice();

//Create Grid
function createGrid() {
  let count = 0;
  for (let i = 0; i < 45; i++) {
    count += 2;
    let div = document.createElement("div");
    div.classList.add("gridRow");
    for (let j = 0; j < 45; j++) {
      count += 2;
      let col = document.createElement("div");
      col.classList.add("gridCol");
      col.setAttribute("id", `gridCol${count}`);
      col.addEventListener(events[deviceType].down, () => {
        draw = true;
        if (erase) {
          col.style.backgroundColor = "transparent";
        } else {
          col.style.backgroundColor = colorButton.value;
        }
      });

      col.addEventListener(events[deviceType].move, (e) => {
        let elementId = document.elementFromPoint(
          !isTouchDevice() ? e.clientX : e.touches[0].clientX,
          !isTouchDevice() ? e.clientY : e.touches[0].clientY
        ).id;
        checker(elementId);
      });
      col.addEventListener(events[deviceType].up, () => {
        draw = false;
      });
      div.appendChild(col);
    }
    container.appendChild(div);
  }
}
createGrid();

function checker(elementId) {
  let gridColumns = document.querySelectorAll(".gridCol");
  gridColumns.forEach((element) => {
    if (elementId == element.id) {
      if (draw && !erase) {
        element.style.backgroundColor = colorButton.value;
      } else if (draw && erase) {
        element.style.backgroundColor = "transparent";
      }
    }
  });
}

//Clear Grid
clearGridButton.addEventListener("click", () => {
  container.innerHTML = "";
  createGrid();
});

//Erase Button
eraseBtn.addEventListener("click", () => {
  erase = true;
});

//Paint button
paintBtn.addEventListener("click", () => {
  erase = false;
});



// Save button
saveBtn.addEventListener("click", () => {
  let gridRows = document.querySelectorAll(".gridRow");
  gridRows.forEach(row => {
    row.querySelectorAll(".gridCol").forEach(col => {
      col.style.border = "none";
    });
  });
    domtoimage.toPng(container)
      .then(function (dataUrl) {
        let link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'pixelart.png';
        link.click();

    
     gridRows.forEach(row => {
          row.querySelectorAll(".gridCol").forEach(col => {
            col.style.border = "0.2px solid #b6d0ff"; 
          });
        });
      })
      .catch(function (error) {
        console.error('Error saving image:', error);
      });
  }, 100); 
