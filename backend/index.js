var randomWords = require("random-words");
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: process.argv[2] || 8080 });
const fs = require("fs");
// map all server URLs and their socket connections
const servers = {
  "ws://localhost:8080": null,
  "ws://localhost:8081": null,
  "ws://localhost:8082": null,
};
let gameRooms = [];

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    const data = JSON.parse(message);
    console.log(data);
    switch (data.type) {
      case "create-room":
        console.log("incoming create room message");
        handleCreateRoom(data, ws);
        break;
      case "join": // rename to join-room later
        console.log("incoming join room message");
        handleJoinRoom(data, ws);
        break;
      case "start-game":
        console.log("incoming start game message");
        handleStartGame(data, ws);
        break;
      case "drawer-confirm-word":
        console.log("incoming drawer confirm word message");
        drawerConfirmWord(data, ws);
        break;
      case "chat":
        console.log("incoming chat message");
        handleChat(data, ws);
        break;
      case "draw":
        console.log("incoming draw message");
        handleDraw(data, ws);
        break;
      case "close":
        console.log("incoming close message");
        handleClose(data, ws);
        break;
      case "gamestate-update":
        console.log("income update from primary server");
        handleStateUpdate(data);
        break;
    }
  });
});

function updateAllPlayers(gameId) {
  // update all players
  gameRooms[gameId].players.map((curr_player) => {
    curr_player.ws.send(
      JSON.stringify({
        type: "join-message",
        message: {
          gameId: gameId,
          host: gameRooms[gameId].host,
          currentDrawer: gameRooms[gameId].currentDrawer,
          currentWord: gameRooms[gameId].currentWord,
          players: gameRooms[gameId].players.map(
            ({ username, score, guesses, guessedWordCorrectly }) => ({
              username,
              score,
              guesses,
              guessedWordCorrectly,
            })
          ),
          gameState: gameRooms[gameId].gameState,
          chatMessages: gameRooms[gameId].chatMessages,
          drawingBoard: gameRooms[gameId].drawingBoard,
        },
      })
    );
  });
  // update all replica servers
  updateServers(gameId);
}

function updateServers(gameId) {
  for (const server in servers) {
    // get port of server
    const port = server.split(":")[2];
    // update all other servers except for self by checking the port
    if (port !== process.argv[2]) {
      // if there is no socket connection with server, create one
      let ws = servers[server];
      if (ws === null) {
        ws = new WebSocket(server);
        servers[server] = ws;
        ws.onopen = () => {
          console.log(`successfully connected to socket for ${server}`);
          console.log("SENDING GAME STATE UPDATE");
          const data = {
            type: "gamestate-update",
            message: {
              gameId: gameId,
              host: gameRooms[gameId].host,
              currentDrawer: gameRooms[gameId].currentDrawer,
              currentWord: gameRooms[gameId].currentWord,
              players: gameRooms[gameId].players.map(
                ({ username, score, guesses, guessedWordCorrectly }) => ({
                  username,
                  score,
                  guesses,
                  guessedWordCorrectly,
                })
              ),
              gameState: gameRooms[gameId].gameState,
              chatMessages: gameRooms[gameId].chatMessages,
              drawingBoard: gameRooms[gameId].drawingBoard,
            },
          };
          ws.send(JSON.stringify(data));
        };
        ws.onerror = (error) => {
          console.log(`WebSocket Error while connecting to ${server}: `, error);
        };
        ws.onclose = () => {
          console.log(`socket connection to ${server} closed`);
        };
      } else {
        if (ws && ws.readyState === WebSocket.OPEN) {
          console.log("SENDING GAME STATE UPDATE");
          const data = {
            type: "gamestate-update",
            message: {
              gameId: gameId,
              host: gameRooms[gameId].host,
              currentDrawer: gameRooms[gameId].currentDrawer,
              currentWord: gameRooms[gameId].currentWord,
              players: gameRooms[gameId].players.map(
                ({ username, score, guesses, guessedWordCorrectly }) => ({
                  username,
                  score,
                  guesses,
                  guessedWordCorrectly,
                })
              ),
              gameState: gameRooms[gameId].gameState,
              chatMessages: gameRooms[gameId].chatMessages,
              drawingBoard: gameRooms[gameId].drawingBoard,
            },
          };
          ws.send(JSON.stringify(data));
        }
      }
      console.log(`sent update to ${server} from port ${port}`);
    }
  }
}

function getRandomWord() {
  const words = fs.readFileSync("words.txt", "utf-8").split(", ");
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex].slice(1, -1);
}

function newRound(args) {
  // jacob
  // generate new word
  const randomWord = getRandomWord();
  // set current word to new word
  gameRooms[args.gameId].currentWord = randomWord;
  console.log("new round, new word:", randomWord);
  // set game state to drawer-confirm-word
  gameRooms[args.gameId].gameState = "drawer-confirm-word";
  console.log("game state:", gameRooms[args.gameId].gameState);
  // update all players with the new game state
  console.log("current drawer:", gameRooms[args.gameId].currentDrawer);
  updateAllPlayers(args.gameId);
}

function drawerConfirmWord(data, ws) {
  gameRooms[data.message.gameId].gameState = "game";
  console.log("game state:", gameRooms[data.message.gameId].gameState);
  updateAllPlayers(data.message.gameId);
}

function endRound(args) {
  // jacob + gabe
  // set current drawer to next player
  if (
    // if current drawer is last player in array
    gameRooms[args.gameId].players.findIndex(
      (player) => player.username === gameRooms[args.gameId].currentDrawer
    ) ===
    gameRooms[args.gameId].players.length - 1
  ) {
    gameRooms[args.gameId].currentDrawer =
      gameRooms[args.gameId].players[0].username;
    console.log("current drawer is last player in array");
  } else {
    // if current drawer is not last player in array
    gameRooms[args.gameId].currentDrawer =
      gameRooms[args.gameId].players[
        gameRooms[args.gameId].players.findIndex(
          (player) => player.username === gameRooms[args.gameId].currentDrawer
        ) + 1
      ].username;
    console.log(
      gameRooms[args.gameId].players.findIndex(
        (player) => player.username === gameRooms[args.gameId].currentDrawer
      )
    );
    console.log("current drawer is not last player in array");
  }
  // clear drawing board
  gameRooms[args.gameId].drawingBoard = [];
  // clear chat messages
  gameRooms[args.gameId].chatMessages = [];
  // reset guess count for all players
  gameRooms[args.gameId].players.map((player) => {
    player.guesses = 3;
    player.guessedWordCorrectly = false;
  });
  // call newRound function
  newRound(args);
}

function handleCreateRoom(data, ws) {
  // gabe
  const gameId = data.message.gameId;
  const username = data.message.username;

  let roomData = gameRooms[gameId];
  if (!roomData) {
    gameRooms[gameId] = {
      host: username,
      currentDrawer: username,
      currentWord: "",
      drawingBoard: [],
      players: [],
      gameState: "lobby",
      chatMessages: [],
    };
  }
  gameRooms[gameId].players.push({
    username: username,
    score: 0,
    guesses: 0,
    guessedWordCorrectly: false,
    ws: ws,
  });
  updateAllPlayers(gameId);
}

function handleJoinRoom(data, ws) {
  // jacob
  const gameId = data.message.gameId;
  const username = data.message.username;

  let roomData = gameRooms[gameId];
  if (!roomData) {
    console.log("game id does not exist");
    ws.send(
      JSON.stringify({
        type: "game-error",
        message: `Game ID, ${gameId}, does not exist`,
      })
    );
    return;
  }
  //check if username is already taken
  if (
    gameRooms[gameId].players.some((player) => player.username === username)
  ) {
    console.log("username taken");
    ws.send(
      JSON.stringify({
        type: "game-error",
        message: `Username, ${username}, is already taken`,
      })
    );
  } else {
    gameRooms[gameId].players.push({
      username: username,
      score: 0,
      guesses: 0,
      guessedWordCorrectly: false,
      ws: ws,
    });
    updateAllPlayers(gameId);
  }
}

function handleStartGame(data, ws) {
  // ajay
  // set currentDrawer to host
  gameRooms[data.message.gameId].currentDrawer =
    gameRooms[data.message.gameId].host;
  // set guesses to 3
  gameRooms[data.message.gameId].players.map((curr_player) => {
    curr_player.guesses = 3;
  });
  // call newRound
  newRound(data.message);
}

function handleChat(data, ws) {
  // dimitar
  console.log("received chat", data.message.chat);

  // check if guess was correct
  const correctGuess =
    data.message.chat.toLowerCase() ===
    gameRooms[data.message.gameId].currentWord.toLowerCase();
  console.log("correct: ", correctGuess);

  // decrement remaining guesses count for user and increment score if correct guess
  gameRooms[data.message.gameId].players = gameRooms[
    data.message.gameId
  ].players.map((player) => {
    if (player.username === data.message.username) {
      player.guesses -= 1;
      player.guessedWordCorrectly = correctGuess;
      if (correctGuess) {
        player.score += Math.floor(
          (1 / (gameRooms[data.message.gameId].chatMessages.length + 1)) *
            player.guesses *
            100
        );
      }
    }
    return player;
  });

  // add chat
  gameRooms[data.message.gameId].chatMessages.push({
    username: data.message.username,
    message: data.message.chat,
  });

  // update game state
  updateAllPlayers(data.message.gameId);

  // check if game is over
  let finishedPlayers = 0;
  for (let player of gameRooms[data.message.gameId].players) {
    if (player.guessedWordCorrectly || player.guesses === 0) {
      finishedPlayers += 1;
    }
  }
  const gameOver =
    finishedPlayers === gameRooms[data.message.gameId].players.length - 1;

  if (gameOver) {
    console.log("ending game");
    endRound(data.message);
  }
}

function handleDraw(data, ws) {
  // dimitar
  console.log("handling draw", data);
  gameRooms[data.message.gameId].drawingBoard = data.message.drawing;
  updateAllPlayers(data.message.gameId);
}

function handleClose(data, ws) {
  if (gameRooms[data.message.gameId]) {
    gameRooms[data.message.gameId].players.map((curr_player, index) => {
      if (curr_player.ws === ws) {
        gameRooms[data.message.gameId].players.splice(index, 1);
        if (
          curr_player.username === gameRooms[data.message.gameId].host &&
          gameRooms[data.message.gameId].players.length >= 1
        ) {
          gameRooms[data.message.gameId].host =
            gameRooms[data.message.gameId].players[
              Math.floor(
                Math.random() * gameRooms[data.message.gameId].players.length
              )
            ].username;
          if (
            curr_player.username ===
            gameRooms[data.message.gameId].currentDrawer
          ) {
            gameRooms[data.message.gameId].currentDrawer =
              gameRooms[data.message.gameId].host;
          }
        } else if (gameRooms[data.message.gameId].players.length == 0) {
          gameRooms[data.message.gameId] = null;
          console.log(
            "last player in the room, resetting gameID",
            data.message.gameId
          );
        }
      }
    });
    if (gameRooms[data.message.gameId]) {
      updateAllPlayers(data.message.gameId);
    }
  }
}

function handleStateUpdate(data) {
  gameRooms[data.message.gameId] = {
    host: data.message.host,
    currentDrawer: data.message.currentDrawer,
    currentWord: data.message.currentWord,
    players: data.message.players,
    gameState: data.message.gameState,
    chatMessages: data.message.chatMessages,
    drawingBoard: data.message.drawingBoard,
  };
  console.log("Received update from primary", gameRooms[data.message.gameId]);
}
