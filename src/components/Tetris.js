import { useState,useEffect,useRef } from "react";

import { createStage, checkCollision } from "../gameHelper";

import { StyledTetrisWrapper,StyledTetris } from "./styles/StyledTetris";

import { useInterval } from "../hooks/useInterval";
import { usePlayer } from "../hooks/usePlayer";
import { useStage } from "../hooks/useStage";
import { useGameStatus } from "../hooks/useGameStatus";


import Stage from "./Stage";
import Display from "./Display";
import StartButton from "./StartButton";

import BackgroundMusic from "./BackgroundMusic";


const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [playing, setPlaying] = useState(false);

    const [player,updatePlayerPos, resetPlayer,playerRotate] = usePlayer();
    const [stage,setStage,rowsCleared] = useStage(player,resetPlayer,setGameOver,setPlaying);
    const [score,setScore,rows,setRows,level,setLevel] = useGameStatus(rowsCleared)

    const audioxRef = useRef(new Audio("/music/MP_엉뚱한 작당모의.mp3"));
    
    const movePlayer = dir =>{
        if(!checkCollision(player,stage,{x:dir,y:0})){
            updatePlayerPos({x: dir,y:0});
        }
    }
    const startGame = () => {
     

        setStage(createStage())
        setDropTime(1000);
        resetPlayer();
        setGameOver(false);
        setScore(0);
        setRows(0);
        setLevel(0);
        setPlaying(true);

        audioxRef.current.currentTime = 0;
        audioxRef.current.play();
        audioxRef.current.loop = true;
    }
   

    const drop = () => {
        if (rows > (level + 1) * 10) {
          setLevel(prev => prev + 1);
          setDropTime(1000 / (level + 1) + 200);
        }
      
        if (!checkCollision(player, stage, { x: 0, y: 1 })) {
          updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
          if (player.pos.y < 1) {
            setGameOver(true);
            setDropTime(null);
            setPlaying(false);
          } else {
            updatePlayerPos({ x: 0, y: 0, collided: true });
          }
        }
      };
      

    const keyUp = ({ keyCode}) => {
        
        if(!gameOver){
            if(keyCode === 40){
                setDropTime(1000 / (level+1)+ 200);
            }
        }else{
            if (keyCode === 82) {
                startGame();
              }
        }
    }

    const dropPlayer = () => {
        setDropTime(null);
        drop();
    }

    const move = ({ keyCode}) =>{
        if(!gameOver){
            if(keyCode === 37){
                movePlayer(-1);
            }else if(keyCode === 39){
                movePlayer(1)
            }else if(keyCode === 40){
                dropPlayer();
            }else if(keyCode === 38){
                playerRotate(stage, 1)
            }else if(keyCode === 82){
                
                startGame();
                
            }
        }
    }
    useEffect(() => {
        if (rows > 0) {
            const audio = new Audio('/music/디링.mp3');
            audio.play();
          }
      }, [rows]);
    

    useEffect(()=>{
        if(level > 0){
            const audio = new Audio('/music/level.mp3');
            audio.play();
        }
    },[level])

    useEffect(() => {
        if (!playing) {
            audioxRef.current.pause();
            audioxRef.current.currentTime = 0;
          }
      }, [playing]);

     

    useInterval(()=>{
        drop();
    
    },dropTime)
    return (
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={keyUp}>
            <StyledTetris>

            <Stage stage={stage}/>
            <aside>
                {gameOver ? (
                    <Display gameOver={gameOver} text="Game Over"/>
                ): (

                <div>
                    <Display text={`Score: ${score}`} />
                    <Display text={`rows: ${rows}`} />
                    <Display text={`Level: ${level}`} />
              </div>
                )}
                <StartButton callback={startGame}/>
            </aside>
            {/* {playing && <BackgroundMusic/>} */}
            {/* {cleared && <ClearSound/>} */}
            </StyledTetris>
        </StyledTetrisWrapper>
    );
};

export default Tetris;
