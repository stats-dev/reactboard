import React, { useCallback, useState } from 'react';
import '../css/Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({setIsLogin}) => {
    const navi = useNavigate();

    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');


    //userId 변경 시 작동하는 메소드
    const changeUserId = useCallback((e) => {
        setUserId(() => e.target.value);
        // e.target.disabled = false;
    }, []);

    //userPw input 변경 시 동작할 메소드
    const changeUserPw = useCallback((e) => {
        setUserPw(() => e.target.value);
    }, []);


    const login = useCallback((e) => {
        e.preventDefault();

        const loginAxios = async () => {
            try {
                const response = await axios.post('/user/login',
                {   //join에서 처럼 user 객체로 넣어줘도 되고, 아니면 이렇게 json으로 수동 입력도 가능하다.
                    userId: userId,
                    userPw: userPw //키값 userPw, state 값 userPw 넣는다.
                })
                console.log(response);

                if(response.data && response.data.item.token) {
                    alert(`${response.data.item.userName}님 환영합니다.`);
                    sessionStorage.setItem("ACCESS_TOKEN", response.data.item.token);
                    sessionStorage.setItem("userId", response.data.item.userId);
                    setIsLogin(true);
                    navi("/");
                }
            } catch(e) {
                console.log(e);
                if(e.response.data.errorMessage === 'id not exist') {
                    alert("아이디가 존재하지 않습니다.");
                    return;
                } else if(e.response.data.errorMessage === 'wrong pw') {
                    alert("비밀번호가 틀렸습니다.");
                    return;
                } else {
                    alert("알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요.");
                    return;
                }
            }
        }

        loginAxios();
    }, [userId, userPw]);
 


  return (
    <div className="form-wrapper">
        <form id="loginForm" onSubmit={login}>
            <h3>로그인</h3>
            <div className="label-wrapper">
                <label htmlFor="userId">아이디</label>
            </div>
            <input type="text" id="userId" name="userId" value={userId} onChange={changeUserId} required></input>
            <div className="label-wrapper">
                <label htmlFor="userPw">비밀번호</label>
            </div>
            <input type="password" id="userPw" name="userPw" value={userPw} onChange={changeUserPw} required></input>
            <div style={{display: 'block', margin: '20px auto'}}>
                <button type="submit" id="btnLogin">로그인</button>
            </div>
        </form>
    </div>
  );
};

export default Login;