let toolsCont= document.querySelector(".tools-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil =  document.querySelector(".pencil");
let eraser =  document.querySelector(".eraser");
let pencilFlag = false;
let eraserFlag = false;
let sticky = document.querySelector(".sticky");
let optionsCont = document.querySelector(".options-cont");
let upload = document.querySelector(".upload");
let optionsFlag = true;

let download = document.querySelector(".download");

//true implies the tools are being displayed
//false to hide them
optionsCont.addEventListener("click",(e) => 
{
   optionsFlag = !optionsFlag;
   if(optionsFlag)
   {
    openTools();
   }
   else {
    closeTools();
   }
  
})
let iconElem = optionsCont.children[0];

function openTools()
{
   
   iconElem.classList.remove("fa-times");
   iconElem.classList.add("fa-bars");
   toolsCont.style.display = "flex";
}

function closeTools()
{
   iconElem.classList.add("fa-times");
   iconElem.classList.remove("fa-bars");
   toolsCont.style.display ="none";
   pencilToolCont.style.display="none";
   eraserToolCont.style.display="none";
}

pencil.addEventListener("click", (e) => {
   pencilFlag = !pencilFlag;
   if(pencilFlag)
   {
      eraserFlag = false;
      pencilToolCont.style.display="block";
      eraserToolCont.style.display = "none";
      tool.lineWidth = penWid;
      tool.strokeStyle = penCol;
   }
   else{
      pencilToolCont.style.display="none";
   }
})

eraser.addEventListener("click", (e) => {
   eraserFlag = !eraserFlag;
   if(eraserFlag)
   {
      tool.lineWidth = eraserWid;
      tool.strokeStyle = eraserCol;
      pencilToolCont.style.display = "none";
      eraserToolCont.style.display="flex";
   }
   else{
      eraserToolCont.style.display="none";
      tool.strokeStyle = penCol;
      tool.lineWidth = penWid;
   }
})

upload.addEventListener("click",(e) => {
   let input=document.createElement("input");
   input.setAttribute("type","file");
   input.click();
   input.addEventListener("change",(e)=>{ /* The change event is specifically designed to detect when the value of an input element changes, such as when a user selects a file using an <input type="file"> element. */
      let file= input.files[0]; /*first file*/
      let url = URL.createObjectURL(file);
      let stickyTemplateHTML = 
      `<div class="header-cont">
         <div class="minimize"></div>  
         <div class="remove"></div> 
       </div>
       <div class="note-cont">
         <img src="${url}"/>
      </div>`;
      createSticky(stickyTemplateHTML);
   })
  
})


sticky.addEventListener("click", (e)=> {
   let stickyTemplateHTML = `
        <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <textarea spellcheck="false"></textarea>
        </div>`;
    createSticky(stickyTemplateHTML);
}) 

function createSticky(stickyTemplateHTML)
{
      let stickyCont=document.createElement("div");
      stickyCont.setAttribute("class","sticky-cont");
      stickyCont.innerHTML =stickyTemplateHTML;
      document.body.appendChild(stickyCont);
      let minimize = stickyCont.querySelector(".minimize");
      let remove = stickyCont.querySelector(".remove");
      noteActions(minimize, remove, stickyCont);
      stickyCont.onmousedown = function(event) {
       dragAndDrop(stickyCont, event);
      };
      stickyCont.ondragstart = function() {
         return false;
       };
}

function noteActions(minimize, remove, stickyCont)
{
   remove.addEventListener("click", (e)=> {
      stickyCont.remove();
   })
   minimize.addEventListener("click",(e)=> {
   let noteCont = stickyCont.querySelector(".note-cont");
   let display = getComputedStyle(noteCont).getPropertyValue("display");
   if(display == "none")
   noteCont.style.display = "block";
   else noteCont.style.display = "none";
   })
}



//to drag and drop sticky container
function dragAndDrop(element,event){
   let shiftX = event.clientX - element.getBoundingClientRect().left;
   let shiftY = event.clientY - element.getBoundingClientRect().top;
 
   element.style.position = 'absolute';
   element.style.zIndex = 1000;
 
   moveAt(event.pageX, event.pageY);
 
   // moves the ball at (pageX, pageY) coordinates
   // taking initial shifts into account
   function moveAt(pageX, pageY) {
      element.style.left = pageX - shiftX + 'px';
      element.style.top = pageY - shiftY + 'px';
   }
 
   function onMouseMove(event) {
     moveAt(event.pageX, event.pageY);
   }
 
   // move the ball on mousemove
   document.addEventListener('mousemove', onMouseMove);
 
   // drop the ball, remove unneeded handlers
   element.onmouseup = function() {
     document.removeEventListener('mousemove', onMouseMove);
     element.onmouseup = null;
   };
 
 };
 
download.addEventListener("click", (e)=>{
   let url = canvas.toDataURL();
   let a = document.createElement("a");
   a.href = url;
   a.download = "board.jpg";
   a.click();
})
