import React from 'react';
import styled from 'styled-components';
import {Link, Outlet} from 'react-router-dom';
import '../css/Layout.css'; //css도 임포트 해줘야한다.

const UserNav = styled.ul`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const UserNavItem = styled.li`
    margin-left: 10px;
    font-size: 0.9 rem;
`;

const layout = ({isLogin}) => {
  return (
    <>
        <header>
            <h1>
                <Link to="/">홈</Link>
            </h1>
            <nav>
                <ul class="main-nav">
                    <li>
                        <Link to="/board-list">게시글 목록</Link>
                    </li>
                </ul>
            </nav>
            <nav>
                {
                    //매번 로그인 정보를 가져올 수 없다. 그래서 단축 입력을 사용하여 조건에 맞는 경우만 호출한다.
                    isLogin && sessionStorage.getItem("ACCESS_TOKEN") 
                    ?
                    <UserNav>
                        <UserNavItem>
                            <Link to="/mypage">마이페이지</Link>
                        </UserNavItem>
                        <UserNavItem>
                            <Link to="/logout">로그아웃</Link>
                        </UserNavItem>
                    </UserNav>
                    :
                    <UserNav>
                        <UserNavItem>
                            <Link to="/login">로그인</Link>
                        </UserNavItem>
                        <UserNavItem>
                            <Link to="/join">회원가입</Link>
                        </UserNavItem>
                    </UserNav>
                }
            </nav>
        </header>
        <main>
            {/* 중첩태그는 Outlet을 활용 */}
            <Outlet></Outlet>
        </main>
        <footer>
            <div>
                <p>copyright 비트캠프</p>
            </div>
        </footer>
    </>
  )
}

export default layout