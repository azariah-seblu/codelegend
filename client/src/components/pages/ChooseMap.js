import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../context/socket.js";
import Card from "react-bootstrap/Card";
import { sprites, mapIcons } from "./data.js";
import clickSound from "../assets/sounds/click.mp3";
const click = new Audio(clickSound);

const ChooseMap = () => {
  const socket = useContext(SocketContext);
  const [mapSelection, setMapSelection] = useState(false);
  const [spriteSelection, setSpriteSelection] = useState(false);
  const [spriteName, setSpriteName] = useState("");
  const [mapName, setMapName] = useState("");
  const [submissionMade, setSubmissionMade] = useState(false);

  //something like create new game
  const handleMapSelection = (map_id, map_name) => {
    click.play();
    if (submissionMade === false) {
      if (map_id == 7) {
        let random_num = Math.floor(Math.random() * 6);
        setMapSelection(random_num);
        setMapName(map_name);
      } else {
        setMapSelection(map_id);
        setMapName(map_name);
      }
    }
  };

  const handleSpriteSelection = (sprite_id, spriteName) => {
    click.play();
    if (submissionMade === false) {
      setSpriteSelection(sprite_id);
      setSpriteName(spriteName);
    }
  };

  const handleSubmitSelections = (map_id, map_name) => {
    click.play();
    setSubmissionMade(true);
    socket.emit("initGameState", { mapSelection, spriteSelection });
  };
  return (
    <div className="nes-container is-rounded is-dark">
      {mapSelection ? "Selected: " + mapName + " map" : "Make a Map Selection"}
      <br /> <br />
      <div className="map_tiles_wrapper">
        <Card className="map_tile">
          <Card.Img
            className="map_image"
            src={mapIcons[0]}
            onClick={() => handleMapSelection(1, "Farm")}
          />
          <Card.Title class="nes-text is-success">Farm</Card.Title>
        </Card>
        <Card className="map_tile">
          <Card.Img
            className="map_image"
            variant="top"
            src={mapIcons[1]}
            onClick={() => handleMapSelection(2, "Tropics")}
          />
          <Card.Title class="nes-text is-success">Tropics</Card.Title>
        </Card>
        <Card className="map_tile">
          <Card.Img
            className="map_image"
            variant="top"
            src={mapIcons[2]}
            onClick={() => handleMapSelection(3, "Desert")}
          />
          <Card.Title class="nes-text is-warning">Desert</Card.Title>
        </Card>
        <Card className="map_tile">
          <Card.Img
            className="map_image"
            variant="top"
            src={mapIcons[3]}
            onClick={() => handleMapSelection(4, "Winter")}
          />
          <Card.Title class="nes-text is-warning">Winter</Card.Title>
        </Card>
      </div>
      <div className="map_tiles_wrapper">
        <Card className="map_tile">
          <Card.Img
            className="map_image"
            src={mapIcons[4]}
            onClick={() => handleMapSelection(5, "Poison")}
          />
          <Card.Title class="nes-text is-error">Poison</Card.Title>
        </Card>
        <Card className="map_tile">
          <Card.Img
            variant="top"
            className="map_image"
            src={mapIcons[5]}
            onClick={() => handleMapSelection(6, "Lava")}
          />
          <Card.Title class="nes-text is-error">Lava</Card.Title>
        </Card>
      </div>
      <br />
      {spriteSelection ? "Selected: " + spriteName : "Make a Sprite Selection"}
      <br />
      <br />
      <div className="map_tiles_wrapper">
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[1]}
            onClick={() => handleSpriteSelection(1, "Block Man")}
          />
          <Card.Title>Block</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[2]}
            onClick={() => handleSpriteSelection(2, "Burst Man")}
          />
          <Card.Title>Burst</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[3]}
            onClick={() => handleSpriteSelection(3, "Elec Man")}
          />
          <Card.Title>Elec</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[4]}
            onClick={() => handleSpriteSelection(4, "Heat Man")}
          />
          <Card.Title>Heat</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[5]}
            onClick={() => handleSpriteSelection(5, "Plant Man")}
          />
          <Card.Title>Plant</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[6]}
            onClick={() => handleSpriteSelection(6, "Mega Man")}
          />
          <Card.Title>Mega</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[7]}
            onClick={() => handleSpriteSelection(7, "Pharaoh")}
          />
          <Card.Title>Pharaoh</Card.Title>
        </Card>
        <Card className="sprite_tile">
          <Card.Img
            className="sprite_img"
            src={sprites[8]}
            onClick={() => handleSpriteSelection(8, "Spring Man")}
          />
          <Card.Title>Spring</Card.Title>
        </Card>
      </div>
      <>
        <br />
        {mapSelection && spriteSelection ? (
          <>
            {submissionMade ? (
              "Submission made. Waiting for another player"
            ) : (
              <button onClick={handleSubmitSelections}>Submit Selections</button>
            )}
          </>
        ) : (
          ""
        )}
      </>
    </div>
  );
};

export default ChooseMap;
