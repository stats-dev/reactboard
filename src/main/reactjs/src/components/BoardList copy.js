import React, { useEffect, useState } from 'react';
import BoardListItem from './BoardListItem';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BoardList = () => {
    const [boardList, setBoardList] = useState([
        // {
        //     boardNo: 1,
        //     boardTitle: '제목',
        //     boardContent: '내용',
        //     boardWriter: '작성자',
        //     boardRegdate: '2023-08-01',
        //     boardCnt: 0
        // },
        // {
        //     boardNo: 2,
        //     boardTitle: '제목',
        //     boardContent: '내용',
        //     boardWriter: '작성자',
        //     boardRegdate: '2023-08-01',
        //     boardCnt: 0
        // },
        // {
        //     boardNo: 3,
        //     boardTitle: '제목',
        //     boardContent: '내용',
        //     boardWriter: '작성자',
        //     boardRegdate: '2023-08-01',
        //     boardCnt: 0
        // },
        // {
        //     boardNo: 4,
        //     boardTitle: '제목',
        //     boardContent: '내용',
        //     boardWriter: '작성자',
        //     boardRegdate: '2023-08-01',
        //     boardCnt: 0
        // },
        // {
        //     boardNo: 5,
        //     boardTitle: '제목',
        //     boardContent: '내용',
        //     boardWriter: '작성자',
        //     boardRegdate: '2023-08-01',
        //     boardCnt: 0
        // }
    ])


        // 렌더링되자마자 axios를 통해 /board-list 에 있는 정보를 가져온다.
        useEffect(() => {
            // axios를 사용하여 게시글 목록을 가져오는 비동기 함수를 정의합니다.
            const fetchBoardList = async () => {
                // axios 요청에 필요한 토큰 값을 설정합니다.
                const token = response.data.item.token; // 여기에 실제 토큰 값을 넣어주시면 됩니다.

                // axios 요청을 보낼 때 헤더에 토큰을 추가합니다.
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                try {
                    const response = await axios.get('/board/board-list', config);
                    // 가져온 정보로 게시글 목록을 업데이트합니다.
                    setBoardList(response.data);
                    console.log(response);
                } catch (error) {
                    // 에러 처리 로직을 추가할 수 있습니다.
                    console.error('게시글 목록을 가져오는데 실패했습니다:', error);
                }
            };

            // 비동기 함수를 호출하여 게시글 목록을 가져옵니다.
            fetchBoardList();   
        }, []);

  return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <h3>게시글 목록</h3>
        <form id="searchForm">
            <table style={{width: '700px', borderCollapse: 'collapse', border: '1px solid black'}}>
            <tr>
                <td style={{textAlign: 'right'}}>
                <select name="searchCondition">
                    <option value="all">전체</option>
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                    <option value="writer">작성자</option>
                </select>
                <input type="text" name="searchKeyword" value="${searchKeyword }"></input>
                <button type="button" id="btnSearch">검색</button>
                </td>
            </tr>
            </table>
        </form>

        <table id="boardTable" style={{width: '700px', borderCollapse: 'collapse', border: '1px solid black'}}>
            <tr>
                <th style={{background: 'skyblue', width: '100px'}}>번호</th>
                <th style={{background: 'skyblue', width: '200px'}}>제목</th>
                <th style={{background: 'skyblue', width: '150px'}}>작성자</th>
                <th style={{background: 'skyblue', width: '150px'}}>등록일</th>
                <th style={{background: 'skyblue', width: '100px'}}>조회수</th>
            </tr>
            {boardList && boardList.map(board => (
                <BoardListItem key={board.boardNo} board={board}></BoardListItem>
            ))}
            
        </table>
        
        
        
        <Link to="/insert-board">새 글 등록</Link>
        </div>

  )
}

export default BoardList