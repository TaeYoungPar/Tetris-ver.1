import { useState,useEffect } from "react";
import { createStage } from "../gameHelper";


export const useStage = (player,resetPlayer,setGameOver,setPlaying) => {
    const [stage, setStage] = useState(createStage());
    const [rowsCleared, setRowsCleared] = useState(0);

    useEffect(()=>{
        setRowsCleared(0);

        const sweepRows = newStage =>
        newStage.reduce((acc,row) => {
            if(row.findIndex(cell => cell[0] ===0) === -1){
                setRowsCleared(prev=> prev + 1);
                acc.unshift(new Array(newStage[0].length).fill([0,'clear']));
                return acc;
            }
            acc.push(row);
            return acc;
        },[])

        

        const updateStage = prevStage =>{
        const newStage = prevStage.map(row => 
            row.map(cell => (cell[1] === 'clear' ? [0,'clear'] : cell))
            )
        

        player.tetromino.forEach((row, y) => {
            row.forEach((value,x)=>{
                if(value !== 0){
                    // 새로 생성된 블록이 이미 블록으로 쌓인 곳에 있는지 확인
            if (
                newStage[y + player.pos.y] &&
                newStage[y + player.pos.y][x + player.pos.x] &&
                newStage[y + player.pos.y][x + player.pos.x][0] !== 0
              ) {
                setGameOver(true); // 게임 오버 처리
                setPlaying(false);
                return;
              }
                    newStage[y + player.pos.y][x + player.pos.x] = [
                    value,
                    `${player.collided ? 'merged' :'clear'}`,

                 ]
                }
            })
        });

        if(player.collided){ //이부분 첫번째 row에 닿으면 실행
            if (newStage[0].some(cell => cell[0] !== 0)) {
                setGameOver(true);
              }
            resetPlayer();
            return sweepRows(newStage);
        }

        return newStage;

    };

        setStage(prev => updateStage(prev))

    },[player,resetPlayer,setGameOver,setPlaying])


    return [stage,setStage,rowsCleared];

}
 