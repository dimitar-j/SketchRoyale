const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

let gameRooms = []

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const data = JSON.parse(message)
    switch (data.type) {
      case 'create-room':
        console.log('incoming create room message');
        handleCreateRoom(data, ws);
        break;
      case 'join': // rename to join-room later
        console.log('incoming join room message');
        handleJoinRoom(data, ws);
        break;
      case 'start-game':
        console.log('incoming start game message');
        handleStartGame(data, ws);
        break;
      case 'chat':
        console.log('incoming chat message');
        handleChat(data, ws);
        break;
      case 'draw':
        console.log('incoming draw message');
        handleDraw(data, ws);
        break;
      case 'close':
        console.log("incoming close message");
        handleClose(data, ws);
        break;
    }
  });
});

function updateAllPlayers(gameId) {
  gameRooms[gameId].players.map((curr_player) => {
    curr_player.ws.send(JSON.stringify({
      type: "join-message",
      message: {
        gameId: gameId,
        host: gameRooms[gameId].host,
        players: gameRooms[gameId].players.map(({ username }) => ({ username })),
        gameState: gameRooms[gameId].gameState,
        chatMessages: gameRooms[gameId].chatMessages
      }
    }));
  });
};

function newRound(args) { // jacob
  
};

function endRound(args) { // jacob + gabe

};

function handleCreateRoom(data, ws){ // gabe
  
};

function handleJoinRoom(data, ws) { // jacob
  const gameId = data.message.gameId;
  const username = data.message.username;

  let roomData = gameRooms[gameId];
  if (!roomData) {
    gameRooms[gameId] = { host: username, players: [], gameState: "lobby", chatMessages: [] };
  }
  gameRooms[gameId].players.push({ username: username, ws: ws });
  updateAllPlayers(gameId);
};

function handleStartGame(data, ws){ // ajay

};

function handleChat(data, ws){ // dimitar
  
};

function handleDraw(data, ws){ // dimitar
  
};

function handleClose(data, ws) {
  gameRooms[data.message.gameId].players.map((curr_player, index) => {
    console.log(curr_player.username, index);
    if (curr_player.username === data.message.username) {
      gameRooms[data.message.gameId].players.splice(index, 1);
    }
  })
  updateAllPlayers(data.message.gameId);
};
