const express = require("express");
const socket = require("socket.io");

const app = express();
app.use(express.static("public"));
app.use(express.json({ limit: '80mb' }));
app.use(express.urlencoded({ limit: '80mb', extended: true }));

let port=8000;
let server=app.listen(port, () => {
    console.log("Listening to port: " + port);
});

let io = socket(server);
// console.log("hehde")
io.on("connection", (socket) => {
    console.log("Made connection");
    // console.log("hehde");
    socket.on("beginPath", (data) => {
        io.sockets.emit("beginPath", data);
    });

    socket.on("draw", (data) => {
        io.sockets.emit("draw", data);
    });

    socket.on("stop", (data) => {
       io.sockets.emit("stop", data);
    });

    socket.on("undoo", (data) => {
        io.sockets.emit("undoo", data);
    });

    socket.on("redoo", (data) => {
        io.sockets.emit("redoo", data);
    });
});
