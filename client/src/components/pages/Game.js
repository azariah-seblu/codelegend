import React, { useRef, useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import axios from "axios";
import { python } from "@codemirror/lang-python";
import { SocketContext } from "../context/socket.js";
import Tower from "../assets/tower.png";
import { sprites } from "./data";
import { towers } from "./data";

import "./App.css";
import AnimatedText from "react-animated-text-content";

//==========LOCAL/HEROKU===========//
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const url = "https://codeleg.herokuapp.com";

const GOOGLE_CLIENT_ID = "306684833672-t1s937mqipgfc70n6r022gl7rm0sh6rh.apps.googleusercontent.com";
const url = "http://localhost:3000";
const exampleArrayMilkman = [
  "Look at all this milk Ive milked from my cows today! So many buckets!",
  "In fact, this might even beat the world record, which is 43.8 lbs of milk!",
  "Hey you, you think you can add up the weights of all those buckets and let me know whether or not I’ve beaten the world record?",
];
const exampleArrayFarmer = [
  "Oh what a beautiful baby horse! She looks just like Ragus did when she was a baby.",
  "Hm? Whats that? Why did I name her Ragus? Its ‘Sugar’ backwards. I have a habit of naming my horses with backwards names. Makes em’ more unique!",
  "Maybe I should name this one “Dusty,” but backwards. Ystud, Yduts … oh dag nabbit! I always have trouble thinking of the name backwards.",
  "Would you mind helping me name my horse? Oh and you’d better capitalize the first letter.",
];
const exampleArrayGunslinger = [
  "That there farmer is lookin’ mighty comfortable with all them horses in his stable.",
  "I ought to take a few for myself! Ima head down there and pay him a visit.",
  "But first, I need to make sure to only bring my well oiled guns. ",
  "Hey you, go through all my guns and tell me which ones dirty.",
  "I ain’t askin’, I’m tellin!",
];
function Game(props) {
  const { state } = useLocation();
  const map = require(`../assets/maps/map${state.map_id}.png`);
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const canvasRef = useRef(null);
  let playerRight, playerLeft, playerUp, playerDown;
  [playerRight, playerLeft, playerUp, playerDown] = [false, false, false, false];
  const resultHeader = "____Results_____";
  const [playerData, setPlayerData] = useState({});
  const [selfPlayerPosition, setSelfPlayerPosition] = useState("");
  const [selfPlayerScore, setSelfPlayerScore] = useState(0);
  const [opponentPlayerScore, setOpponentPlayerScore] = useState(0);
  const [towerData, setTowerData] = useState({});
  const [result, setResult] = useState("");
  const [code, setCode] = useState("");
  const [IDEstatus, setIDEStatus] = useState(false);
  const [currentTower, setCurrentTower] = useState(0);
  const [selfTowerStatus, setSelfTowerStatus] = useState([]);
  const [IDEFeedback, setIDEFeedback] = useState([]);
  const [dialogueStatus, setDialogueStatus] = useState(false);
  const [dialogueCounter, setDialogueCounter] = useState(0);

  const endgame = (result) => {
    setResult(result);
  };

  const closeIDE = () => {
    towerData[currentTower].questionCode = code;
    setIDEStatus(false);
    setIDEFeedback([]);
  };

  const onChange = (value, viewUpdate) => {
    setCode(value);
  };

  const submitCode = () => {
    axios
      .post(url + "/submitCode", {
        code: code,
        questionID: towerData[currentTower].questionID,
      })
      .then((res) => {
        if (res.data.error) {
          setIDEFeedback([res.data.error]);
        } else {
          const finalArr = [];
          for (const obj of res.data.testCaseResultsWithMessages) {
            let IDEmessage = "";
            IDEmessage +=
              (Object.keys(obj)[0] === "True" ? "Correct: " : "Incorrect: ") +
              Object.values(obj)[0] +
              "\n";
            finalArr.push(IDEmessage);
          }
          setIDEFeedback(finalArr);

          if (res.data.overallResult === true) {
            console.log("You got them all right!");
            // fromClientToServer(currentTower);
            socket.emit("updateFromClient", currentTower);
          } else console.log("Too bad!");
        }
      });
  };

  const attemptDialogue = (key) => {
    console.log(towerData);
    if (selfTowerStatus[key] !== 1 && !IDEstatus) {
      setDialogueStatus(true);
      setDialogueCounter(dialogueCounter + 1);
    }
    if (dialogueCounter >= towerData[currentTower].dialogue.length) {
      console.log(dialogueCounter);
      console.log("made it");
      setDialogueCounter(0);
      setDialogueStatus(false);
      attemptToggleIDE(towerData[currentTower].questionCode, key);
    }
  };
  const attemptToggleIDE = (towerCode, key) => {
    if (selfTowerStatus[key] !== 1) {
      setCode(towerCode);
      setIDEStatus(true);
    }
  };

  useEffect(() => {
    socket.on("updateFromServer", (data) => {
      for (const [key, value] of Object.entries(data)) {
        if (key === socket.id) {
          setSelfPlayerPosition(value.position);
          setSelfPlayerScore(value.score);
          setSelfTowerStatus(value.tower_status);
          // let x = document.getElementById("my-progress");
          if (value.score === value.tower_status.length) {
            endgame("You Win");
          }
        } else {
          setOpponentPlayerScore(value.score);
          if (value.score === value.tower_status.length) {
            endgame("You Lose");
          }
        }
      }
      setPlayerData(data);
    });

    socket.on("initTowers", (data) => {
      setTowerData(data);
    });

    return () => {
      socket.off("updateFromServer");
      socket.off("newRoom");
      socket.off("startGame");
      socket.off("assignedRoomId");
      socket.off("badConnection");
    };
  }, []);

  document.onkeydown = (e) => {
    console.log(dialogueStatus);
    console.log(IDEstatus);
    if (!dialogueStatus && !IDEstatus) {
      if (e.key === "ArrowRight") playerRight = true;
      if (e.key === "ArrowLeft") playerLeft = true;
      if (e.key === "ArrowDown") playerDown = true;
      if (e.key === "ArrowUp") playerUp = true;
      console.log("yes");
    }
  };
  document.onkeyup = (e) => {
    if (e.key === "ArrowRight") playerRight = false;
    if (e.key === "ArrowLeft") playerLeft = false;
    if (e.key === "ArrowDown") playerDown = false;
    if (e.key === "ArrowUp") playerUp = false;
    if (!IDEstatus && !dialogueStatus && e.key === "Enter") {
      console.log("bog");
      const whichTower = inTowers(selfPlayerPosition);
      if (whichTower !== -1) {
        setCurrentTower(whichTower);
        attemptDialogue(whichTower);
      }
    } else if (dialogueStatus && !IDEstatus && e.key === "Enter") {
      attemptDialogue(currentTower);
    }
  };

  const drawPlayers = (ctx, playerData) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (const [key, value] of Object.entries(playerData)) {
      const spriteImage = new Image();
      spriteImage.src = sprites[0][0]; //because of 0 indexing
      ctx.drawImage(spriteImage, value.position.x, value.position.y, 55, 55);
    }
  };
  function getDistance(x1, y1, x2, y2) {
    let y = x2 - x1;
    let x = y2 - y1;

    return Math.sqrt(x * x + y * y);
  }
  const near = (player, tower) => {
    if (getDistance(player.x, player.y, tower.x + 25, tower.y + 25) < 100) {
      return true;
    }
  };
  const inTowers = (position) => {
    for (const [key, value] of Object.entries(towerData)) {
      if (selfTowerStatus[key] === 0) {
        if (near(position, value.position)) {
          return key;
        }
      }
    }
    return -1;
  };

  const drawTowers = (ctx, towerData) => {
    const color = "blue";
    for (const [key, value] of Object.entries(towerData)) {
      ctx.beginPath();
      const towerImage = new Image();
      towerImage.src = towers[value.mapId][value.towerId];
      console.log("drawing towers");
      if (selfTowerStatus[key] === 0) {
        ctx.drawImage(towerImage, value.position.x, value.position.y, 75, 75);
      } else {
        ctx.fillStyle = color;
        ctx.strokeRect(value.position.x, value.position.y, 50, 50);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    const render = () => {
      drawPlayers(ctx, playerData);
      drawTowers(ctx, towerData);
      if (playerUp) {
        socket.emit("updateFromClient", "Up");
      } else if (playerDown) {
        socket.emit("updateFromClient", "Down");
      } else if (playerLeft) {
        socket.emit("updateFromClient", "Left");
      } else if (playerRight) {
        socket.emit("updateFromClient", "Right");
      }
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [playerData, IDEstatus]);

  return (
    <div>
      <>
        <div className="wrappy">
          <button
            onClick={() => {
              socket.emit("playerLeft");
              axios.post(url + "/logout");
              navigate("/thankyou");
            }}
          >
            Logout
          </button>
        </div>
        <h1> {result}</h1>
        <div id="container">
          <canvas
            id="canvas"
            width={"1300px"}
            height={"700px"}
            ref={canvasRef}
            style={{ backgroundImage: `url('${map.default}')` }}
          />
          <div id="progress1" className="scoring">
            {/* <div>You</div> */}
            <div>
              <h1>You</h1>
            </div>
            <div>
              <h1>Opponent</h1>
            </div>
            {/* <div>Opponent</div> */}
          </div>{" "}
          <div id="progress" className="scoring">
            {/* <div>You</div> */}
            <progress
              class={
                selfTowerStatus.length > 0
                  ? selfPlayerScore / selfTowerStatus.length >= 0.333 &&
                    selfPlayerScore / selfTowerStatus.length <= 0.666
                    ? "nes-progress is-warning"
                    : selfPlayerScore / selfTowerStatus.length >= 0.666
                    ? "nes-progress is-success"
                    : "nes-progress is-error"
                  : "nes-progress is-error"
              }
              id="my-progress"
              value={selfPlayerScore}
              max={selfTowerStatus.length}
            ></progress>
            <div>
              <h1>{selfPlayerScore}</h1>
            </div>
            <div>
              <h1>-</h1>
            </div>
            <div>
              <h1>{opponentPlayerScore}</h1>
            </div>
            <progress
              class={
                selfTowerStatus.length > 0
                  ? opponentPlayerScore / selfTowerStatus.length >= 0.333 &&
                    opponentPlayerScore / selfTowerStatus.length <= 0.666
                    ? "nes-progress is-warning"
                    : opponentPlayerScore / selfTowerStatus.length >= 0.666
                    ? "nes-progress is-success"
                    : "nes-progress is-error"
                  : "nes-progress is-error"
              }
              id="opponent-progress"
              value={opponentPlayerScore}
              max={selfTowerStatus.length}
            ></progress>
            {/* <div>Opponent</div> */}
          </div>{" "}
          <div id="ide">
            {IDEstatus ? (
              <div id="flexor">
                <div id="editor-container">
                  <CodeMirror
                    value={code}
                    width={"800px"}
                    height={"500px"}
                    borderRadius={".25em"}
                    theme="dark"
                    options={{ theme: "sublime" }}
                    extensions={[python()]}
                    onChange={onChange}
                  />
                  <span>
                    <button type="button" class="nes-btn is-success" onClick={submitCode}>
                      Submit
                    </button>
                    <button type="button" class="nes-btn is-error" onClick={closeIDE}>
                      Close
                    </button>
                  </span>
                </div>
                <div id="test-results-container">
                  <h1>
                    {resultHeader} <br />
                    {IDEFeedback.map((message) =>
                      message.slice(0, 7) == "Correct" ? (
                        <div>
                          <p className="correct">
                            {message}
                            <br />
                            <br />
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="incorrect">
                            {message}
                            <br />
                            <br />
                          </p>
                        </div>
                      )
                    )}
                  </h1>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          {dialogueStatus ? (
            <div id="dialogue">
              <div class="nes-container is-rounded is-dark">
                <u>{towerData[currentTower].name}</u>
                <p> {towerData[currentTower].dialogue[dialogueCounter - 1]}</p>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    </div>
  );
}

export default Game;
