const app = require("./app");
const keys = require("./utils/constants.js");
const { Server } = require("socket.io");
const http = require("http");
const Action = require("./models/action.js");
const History = require("./models/history.js");
const { getAction,getCurrentTimeInIST,apiError,apiResponse } = require("./utils/helper.js");
const {isAuthenticatedDevice} = require("./middleware/auth.js")
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

app.post("/api/v1/action/trigger",isAuthenticatedDevice, async (req, res)=>{
  const { motion_code } = req.body;
  try {
    console.log(`motion_code: ${motion_code}, deviceId: ${req.user.deviceId}`);
    const userAction = await Action.findOne({ user: req.user._id });
    if (!userAction) {
      return apiError(res, 404, "No action found");
    }
    const direction = getAction(motion_code);
    const action = userAction.actions.find(
      (act) => act.direction.toLowerCase() === direction.toLowerCase()
    );
    if (!action) {
      return apiError(res, 404, "Action not found");
    }
    const time = getCurrentTimeInIST();
    await History.create({
      user: req.user._id,
      direction: action.direction,
      action: action.action,
      timeStamps: time,
    });
    io.to(req.user.deviceId).emit("trigger", action.action);
    return apiResponse(res, 200, "Action triggered", action);
  } catch (error) {
    console.log(error.message);
    return apiError(res, 500, String(error.message));
  }
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


