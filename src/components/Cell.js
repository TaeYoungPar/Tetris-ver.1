import { StyledCell } from "./styles/StyledCell";
import {TETROMINOS} from '../tetrominos';
import React from "react";
const Cell = ({type}) => (
    <StyledCell type ={type} color={TETROMINOS[type].color}>
    </StyledCell>
)

export default React.memo(Cell);