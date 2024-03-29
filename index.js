const app = require("./app");
const keys = require("./utils/constants.js");
const { Server } = require("socket.io");
const http = require("http");

const connectDataBase = require("./database/database.js");

//Handling Uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught exception`);
  process.exit(1);
});

//Connecting to database
connectDataBase();

//Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

io.on("connection", (socket)=>{
  console.log(`New connection: ${socket.id}`);
  socket.on("join_room", (data)=>{
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  })
  socket.on("disconnect", ()=>{
    console.log(`User with ID: ${socket.id} disconnected`);
  })
})




server.listen(keys.PORT, () => {
  console.log(`Server is running in PORT:${keys.PORT}`);
});

//Unhandled Promise rejections
//This may occur if we miss handle the connection strings

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise rejections`);

  server.close(() => {
    process.exit(1);
  });
});


module.exports = {io};