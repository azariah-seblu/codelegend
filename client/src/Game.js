import "./App.css";
import React, { useRef, useEffect, useState} from "react";
import data from "./data";
import { playerMovement } from "./Player";
import { towerSpawn } from "./Tower";
function Game(props) {
  const canvasRef = useRef(null);
  let { playerObj, towerObj } = data;
  let playerRight = false;
  let playerLeft = false;
  let playerUp = false;
  let playerDown = false;
  let attemptingAccessIDE = false;
  let acessingIDE = false;
  let withinRange = true;
  useEffect(() => {
    
      document.onkeydown = (e) => {
        if (e.key === "ArrowRight") playerRight = true;
        if (e.key === "ArrowLeft") playerLeft = true;
        if (e.key === "ArrowDown") playerDown = true;
        if (e.key === "ArrowUp") playerUp = true;
        if (e.key === "Enter" && withinRange === true) {
        }
      };
      document.onkeyup = (e) => {
        if (e.key === "ArrowRight") playerRight = false;
        if (e.key === "ArrowLeft") playerLeft = false;
        if (e.key === "ArrowDown") playerDown = false;
        if (e.key === "ArrowUp") playerUp = false;
        if (e.key === "Enter") attemptingAccessIDE = false;
      };
    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      towerSpawn(ctx, canvas, towerObj);
      playerMovement(
        ctx,
        canvas,
        playerObj,
        playerRight,
        playerLeft,
        playerUp,
        playerDown
      );
      if (playerUp === true) {
        props.sendPlayerInput("Up");
      } 
      if (playerDown === true) {
        props.sendPlayerInput("Down");
      } 
      
      if (playerLeft === true) {
        props.sendPlayerInput("Left");
      } 

      if (playerRight === true) {
        props.sendPlayerInput("Right");
      } 
      // props.sendPlayerInput("Right");

      // console.log(`inside Game.js ${Object.values(props.playerData) }`)


      requestAnimationFrame(render);
    };


    render();
  }, []);


  return (
    <div id="rootdiv">
      <canvas id="canvas" ref={canvasRef} />
    </div>
  );
}

export default Game;
