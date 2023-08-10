import React from 'react';
import {Link} from 'react-router-dom';

const BoardListItem = ({board}) => {
    // 이렇게 비구조할당 해도 된다.
    // const {board} = props
    const {boardNo, boardTitle, boardContent, boardWriter, boardRegdate, boardCnt} = board;
    // 재밌게도 const에서 위처럼 선언해주면 아래애서 board.boardNo 이렇게 안써도 됨.
  return (
    <tr style={{textAlign:"center"}}>
      <td>{boardNo}</td>
      <td>
        <Link to={`/board/${boardNo}`}>
            {boardTitle}
        </Link>
      </td>
       <td>{boardWriter}</td>
       <td>{boardRegdate}</td>
       <td>{boardCnt}</td>
    </tr>
  )
}

export default BoardListItem