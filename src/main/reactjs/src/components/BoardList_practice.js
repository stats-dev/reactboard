import React, { useEffect, useState } from 'react';
import BoardListItem from './BoardListItem';
import { Link } from 'react-router-dom';
import axios from 'axios';



const BoardList_practice = () => {
    //이 스테이트를 통해, 아래에서 state를 바꿀 수 있습니다.
    const [boardList, setBoardList] = useState([]);

    // 렌더링되자마자 정보를 가져온다면? useEffect를 활용할 수 있습니다.
    useEffect(() => {
        const getBoardList = async() => {
            try {
                const response = await axios.get('/board/board-list', {
                    //여기에 config에 해당하는 headers > Autorization 작성
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                    }
                });
                console.log(response);
            }
        }
    })


  return (
    <div>BoardList_practice</div>
  )
}

export default BoardList_practice