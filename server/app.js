const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 8080;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
  pingTimeout: 10000,
});

const clients = new Map(); //stores clients
const Game_in_Session = new Map(); //current Game in session
const Looking_for_Game = new Map(); //Client searching for a game
const clients_username = new Map();//stores Client's username

function getMapSize(x) {
  var len = 0;
  x.forEach(function(key,index) {
    len++;
})

  return len;
}

Color_map = {'Black': 0, 'White':1}
Time_map = {'1 min':'1', '2 min':'2', '3 min':'3','5 min':'4','10 min':'5','30 min':'6','1|2':'7','3|2':'8','5|2':'9','unlimited':'10'}

function errorHandler(id) {
  if (clients.has(id)) {
    clients.get(id).emit('Error communicating with Server');
    clients.delete(id)
  }

  Looking_for_Game.delete(id)
  Game_in_Session.delete(id)
  clients_username.delete(id)

}

io.on("connection", (socket) => {
  
  console.log("Client with socket-id:" + String(socket.id) + " has connected");
  clients.set(socket.id,socket)

  clients.get(socket.id).on("FindGame",data => {
    try {
      console.log((socket.id))
      let player_data = Time_map[data[1]] + " " + String(Color_map[data[0]])
      let opponent_data = Time_map[data[1]] + " " + String((Color_map[data[0]] + 1) % 2)
      let opponent_id;
      //Remove clients that have disconnected but still in Looking_for_Game 
      while(Looking_for_Game.has(opponent_data)){
        opponent_id = Looking_for_Game.get(opponent_data)[0];
        
        if(!clients.has(opponent_id)) {
          Looking_for_Game.get(opponent_data).shift()
          if (Looking_for_Game.get(opponent_data).length === 0){
            Looking_for_Game.delete(opponent_data)
          }
          continue;
        }
        else {
          break;
        }
      }

      // if opponent is found
      if(Looking_for_Game.has(opponent_data)){

        opponent_id = Looking_for_Game.get(opponent_data)[0]
        console.log((socket.id),opponent_id)
        clients.get(opponent_id).emit('OpponentFound',data[2]);
        clients.get(socket.id).emit('OpponentFound',clients_username.get(opponent_id));
        clients_username.delete(opponent_id)
        Game_in_Session.set(opponent_id,socket.id)
        Game_in_Session.set(socket.id,opponent_id)
        Looking_for_Game.get(opponent_data).shift()
        if (Looking_for_Game.get(opponent_data).length === 0){
          Looking_for_Game.delete(opponent_data)
        }
      }
    
      //if opponent not found, add client's id to Looking_for_Game
      else {
        clients_username.set(socket.id,data[2])
        if(Looking_for_Game.has(player_data)){
          Looking_for_Game.get(player_data).push(socket.id)
        }
        else {
          Looking_for_Game.set(player_data, [socket.id]);
        }
      }
    }
    catch(e) {
      errorHandler(socket.id);
     
    }
  });

  clients.get(socket.id).on("Cancel Game", function() {
    try {
      for (let [,arr] of Looking_for_Game) {
        for (i in arr) {
          if (arr[i] === socket.id) {
            arr.splice(i,1)
          }
        }
      }
    }
    catch(e) {
      errorHandler(socket.id);
    }
  });

  //pass moves between Clients currently Playing
  clients.get(socket.id).on("FromClient", data => {
    try {
    clients.get(Game_in_Session.get(socket.id)).emit("FromServer", data)
    }
    catch(e) {
      errorHandler(socket.id)
      errorHandler(Game_in_Session.get(socket.id))
    }
  });

  //pass messages between Clients currently Playing
  clients.get(socket.id).on("MessageSent", data => {
    try {
    clients.get(Game_in_Session.get(socket.id)).emit("MessageReceived", data)
    }
    catch(e) {
      errorHandler(socket.id)
      errorHandler(Game_in_Session.get(socket.id))
    }
  });
  //Draw
  clients.get(socket.id).on("Draw Offered", function() {
    try {
    clients.get(Game_in_Session.get(socket.id)).emit("Draw Offered")
    }
    catch(e) {
      errorHandler(socket.id)
      errorHandler(Game_in_Session.get(socket.id))
    }
  });

  clients.get(socket.id).on("Draw Accepted", function() {
    try {
    clients.get(Game_in_Session.get(socket.id)).emit("Draw Accepted")
    }
    catch(e) {
      errorHandler(socket.id)
      errorHandler(Game_in_Session.get(socket.id))
    }
  });

  clients.get(socket.id).on("Draw Declined", function() {
    try {
    clients.get(Game_in_Session.get(socket.id)).emit("Draw Declined")
    }
    catch(e) {
      errorHandler(socket.id)
      errorHandler(Game_in_Session.get(socket.id))
    }
  });

  //Resign

  clients.get(socket.id).on("Resigned", function() {
    try {
    clients.get(Game_in_Session.get(socket.id)).emit("Resigned")
    }
    catch(e) {
      errorHandler(socket.id)
      errorHandler(Game_in_Session.get(socket.id))
    }
  });
  
  clients.get(socket.id).on("End GameSession", function() {
    try {
      if (Game_in_Session.has(socket.id)) {
        let opponent_id = Game_in_Session.get(socket.id)
        if (clients.has(opponent_id)) {
          clients.get(opponent_id).emit('End GameSession');
        }
        Game_in_Session.delete(socket.id)
        Game_in_Session.delete(opponent_id)
      }
    }
    catch(e) {
      errorHandler(socket.id)
      errorHandler(Game_in_Session.get(socket.id))
    }
  })

  //Client disconnects
  clients.get(socket.id).on("disconnect", () => {
      try {
      console.log("Client with socket-id:" + String(socket.id) + " has disconnected");
      if (Game_in_Session.has(socket.id)) {
        let opponent_id = Game_in_Session.get(socket.id)
        if (clients.has(opponent_id)) {
          clients.get(opponent_id).emit('OpponentDisconnected');
        }
        Game_in_Session.delete(socket.id)
        Game_in_Session.delete(opponent_id)
      }
      clients.delete(socket.id)
      clients_username.delete(socket.id)
    }
    catch(e) {
      errorHandler(socket.id)
      errorHandler(Game_in_Session.get(socket.id))
    }
  });

  });



server.listen(port, () => console.log(`Listening on port ${port}`));
