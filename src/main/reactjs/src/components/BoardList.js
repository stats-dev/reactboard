import React, { useEffect, useState } from 'react';
import BoardListItem from './BoardListItem';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Pagination from './Pagination';
import { useNavigate } from 'react-router-dom';

const BoardList = () => {
    const [boardList, setBoardList] = useState([])
    const [page, setPage] = useState(0); //초기값을 0으로 준다.
    // const [pageItems, setPageItems] = useState({}); //이건 왜 중괄호죠? 객체 보내려는데 오류 발생. 주석처리.
    const [totalPages, setTotalPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);

    const [pageSize, setPageSize] = useState(10);
    //searchKeyword, searchCondition
    const [searchCondition, setSearchCondition] = useState('all');
    const [searchKeyword, setSearchKeyword] = useState("");




        // 렌더링되자마자 axios를 통해 /board/board-list 에 있는 정보를 가져온다.
        useEffect(() => {
            const getBoardList = async() => {
                try {
                    const response = await axios.get('/board/board-list', {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                        },
                        params: {
                            page: page,
                            searchKeyword: searchKeyword,
                            searchCondition: searchCondition
                        }
                    });
                    console.log(response);
                    if(response.data && response.data.pageItems.content) {
                        //이렇게 데이터가 있으면 state가 바뀌어서 재 렌더링이 된다.
                        //페이지 아이템즈.content로 변경해야한다.
                    setBoardList(() => response.data.pageItems.content);
                    setTotalPages(() => response.data.pageItems.totalPages);
                    setPageNumber(() => response.data.pageItems.pageable.pageNumber);
                    setPageSize(() => response.data.pageItems.pageable.pageSize);
                }
            } catch(e) {
                console.log(e);
            }

        }

            getBoardList();
        }, [page]);


        const clickPrevNext = (num) => {
            setPage((prev) => prev + num);
        }

        const changePage = (num) => {
            setPage(() => num - 1);
        }

        const changeSearchCondition = (e) => {
            setSearchCondition(e.target.value);
        }

        const changeSearchKeyword = (e) => {
            setSearchKeyword(() => e.target.value);
        }
        const searchFormSubmit = (e) => {
            e.preventDefault();

            setPage(() => 0); //검색하면 페이지 0으로 세팅한다.

            const searchAxios = async () => {
                try {
                    const response = await axios.get('/board/board-list', {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                        }
                    ,
                    params: {
                        page: page,
                        searchCondition: searchCondition,
                        searchKeyword: searchKeyword
                    }
                });
                    console.log(response);
                    if(response.data && response.data.pageItems.content) {
                        //이렇게 데이터가 있으면 state가 바뀌어서 재 렌더링이 된다.
                        //페이지 아이템즈.content로 변경해야한다.
                    setBoardList(() => response.data.pageItems.content);
                    setTotalPages(() => response.data.pageItems.totalPages);
                    setPageNumber(() => response.data.pageItems.pageable.pageNumber);
                    setPageSize(() => response.data.pageItems.pageable.pageSize);
                    }

                } catch(e) {
                    console.log(e);
                }
            }

            searchAxios();
        }



  return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <h3>게시글 목록</h3>
        <form id="searchForm" onSubmit={searchFormSubmit}>
            <table style={{width: '700px', borderCollapse: 'collapse', border: '1px solid black'}}>
            <tr>
                <td style={{textAlign: 'right'}}>
                <select name="searchCondition" value={searchCondition}
                onChange={changeSearchCondition}>
                    <option value="all">전체</option>
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                    <option value="writer">작성자</option>
                </select>
                <input type="text" name="searchKeyword"
                        value={searchKeyword}
                        onChange={changeSearchKeyword}></input>
                <button type="submit" id="btnSearch">검색</button>
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
        <br/>
        <Pagination totalPages={totalPages} pageNumber={pageNumber} pageSize={pageSize} clickPrevNext={clickPrevNext} changePage={changePage}></Pagination>

        <br/>
        <Link to="/insert-board">새 글 등록</Link>
        </div>

  )
}

export default BoardList