let canvas = document.querySelector("canvas");
let pencilCol = document.querySelectorAll(".pencil-color"); 
let eraserElem = document.querySelector(".eraser");
let pencilWidth = document.querySelector(".pencil-width");
let eraserWidth = document.querySelector(".eraser-width");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");
let track = -1;
let currState = [];
let redoTracker = [];
let penCol = "red";
let penWid = pencilWidth.value;
let eraserWid = eraserWidth.value;
let eraserCol = "white";

let tool = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

tool.strokeStyle = penCol;
tool.lineWidth = penWid;

let drawing = false;

function beginPath(data) 
{
    tool.beginPath();
    tool.moveTo(data.x - canvas.offsetLeft, data.y - canvas.offsetTop); 
}

function draw(data) {
    tool.strokeStyle = data.color;
    tool.lineWidth = data.width;
    tool.lineTo(data.x - canvas.offsetLeft, data.y - canvas.offsetTop);
    tool.stroke();
}

function stop(event) {
    if(drawing) 
    {
        redoTracker = [];
        let url = canvas.toDataURL();
        currState.push(url);
        track++;
        let data = {
            redoTracker: redoTracker,
            currState: currState,
            track: track
        };
        socket.emit("stop", data);
        drawing = false;
    }
}

canvas.addEventListener("mousedown", (event) => {
    event.preventDefault();
    drawing = true;
    let data = {
        x: event.touches ? event.touches[0].clientX : event.clientX,
        y: event.touches ? event.touches[0].clientY : event.clientY
    };
    socket.emit("beginPath", data);
});

canvas.addEventListener("mousemove", (event) => {
    if(drawing) 
    {
        let data = {
            x: event.touches ? event.touches[0].clientX : event.clientX,
            y: event.touches ? event.touches[0].clientY : event.clientY,
            color: eraserFlag ? eraserCol : penCol,
            width: eraserFlag ? eraserWid : penWid
        };
        socket.emit("draw", data);
    }
});

canvas.addEventListener("mouseup", (event) => {
    if (drawing) 
    {
        stop(event);
    }
});

canvas.addEventListener("mouseleave", (event) => {
    if(drawing) 
    {
        stop(event);
    }
});

pencilCol.forEach((col) => {
    col.addEventListener("click", (e) => {
        let color = col.classList[0];
        penCol = color;
        tool.strokeStyle = penCol;
        tool.lineWidth = penWid;
    });
});

pencilWidth.addEventListener("change", (e) => {
    penWid = pencilWidth.value;
    tool.lineWidth = penWid;
    tool.strokeStyle = penCol;
});

eraserWidth.addEventListener("change", (e) => {
    eraserWid = eraserWidth.value;
    tool.strokeStyle = eraserCol;
    tool.lineWidth = eraserWid;
});

download.addEventListener("click", (e) => {
    let url1 = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = url1;
    a.download = "board.jpg";
    a.click();
});

function clearCanvas()
{
    tool.clearRect(0, 0, canvas.width, canvas.height);
}

function undoo(data) 
{
    track = data.track;
    currState = data.currState;
    redoTracker = data.redoTracker;
    if(track === 0) 
    {
        redoTracker.push(currState[track]);
        track--;
        currState.pop();
        clearCanvas();
    } 
    else if(currState.length>0) 
    {
        redoTracker.push(currState[track]);
        track--;
        currState.pop();
        let url = currState[track];
        let img = new Image();
        img.src = url;
        img.onload = (e) =>
        {
            tool.clearRect(0, 0, canvas.width, canvas.height);
            tool.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
    } 
    else console.log("track is already -1");
    console.log(track);
}

undo.addEventListener("click", (e) => 
{
    let data = {
        track: track,
        currState: currState, 
        redoTracker: redoTracker
    }
    socket.emit("undoo", data);
});

function redoo(data)
{
    track = data.track;
    currState = data.currState;
    redoTracker = data.redoTracker;   
    if(redoTracker.length != 0) 
    {
            let url = redoTracker[redoTracker.length - 1];
            let img = new Image();
            img.src = url;
            img.onload = (e) => {
                tool.clearRect(0, 0, canvas.width, canvas.height);
                tool.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
            currState.push(redoTracker[redoTracker.length - 1]);
            track++;
            redoTracker.pop();
    } 
    else console.log("nothing to redo");
    console.log(track);
}

redo.addEventListener("click", (e) => {
    let data = {
        track: track,
        currState: currState, 
        redoTracker: redoTracker
    }
    socket.emit("redoo", data);
});





socket.on("beginPath", (data) => {
    beginPath(data);
});


socket.on("draw", (data) => {
    draw(data);
});

socket.on("stop", (data) => {
    console.log(data.track);
    stop(data);
});

socket.on("undoo", (data) => {
    undoo(data);
});

socket.on("redoo", (data) => {
    redoo(data);
});

