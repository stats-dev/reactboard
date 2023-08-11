import axios from 'axios';
import React, { useCallback } from 'react';
import {Link, useNavigate} from 'react-router-dom';

const InsertBoard = () => {
    const uploadFiles = [];
    const navi = useNavigate();

    const changeFiles = useCallback((e) => {
        console.log(e.target.files);

        const fileList = Array.prototype.slice.call(e.target.files);

        fileList.forEach(file => {
            imageLoader(file);
            uploadFiles.push(file);
        });
    }, []);


    //미리보기 메소드
      //미리보기 영역에 들어갈 img 태그 생성 및 선택된 파일을
      //Base 64 인코딩된 문자열 형태로 변환하여 미리보기 구현
      const imageLoader = (file) => {

        let reader = new FileReader();

        reader.onload = (e) => {
          //이미지 표출할 img 태그 생성
          let img = document.createElement("img");
          img.setAttribute("style", "width: 100%; height: 100%; z-index: none;");

          //이미지 파일인지 아닌지 체크
          if(file.name.toLowerCase().match(/(.*?)\.(jpg|jpeg|png|gif|svg|bmp)$/)) {
            img.src = e.target.result;
          } else {
            img.src = 'images/defaultFileImg.png';
          }

          //미리보기 영역에 추가
          //미리보기 이미지 태그와 삭제 버튼 그리고 파일명을 표출하는 p태그
          //묶어주는 div를 만들어서 미리보기 영역에 추가
          document.getElementById('attZone').appendChild(makeDiv(img, file));
          //jquery 기능 삭제함.
        }

        //파일을 BASE 64 인코딩 문자열로 변경
        reader.readAsDataURL(file);
      }

      //미리보기 영역에 들어갈 div 생성하는 메소드
      const makeDiv = (img, file) => {
        //div 태그 생성
        let div = document.createElement("div");

        div.setAttribute("style", "display: inline-block;"
                + " position: relative;"
                + " width: 150px; height: 120px;"
                + " margin: 5px; border: 1px solid #00f; z-index: 1");

        //잘못 올렸을 경우 삭제할 수 있는 버튼 생성
        let btn = document.createElement("input");
        btn.setAttribute("type", "button");
        btn.setAttribute("value", "x");
        btn.setAttribute("delFile", file.name);
        btn.setAttribute("style", "width: 30px; height: 30px;"
                + " position: absolute; right: 0px; bottom: 0px;"
                + " z-index: 999; background-color: rgba(255, 255, 255, 0.1);"
                + " color: #f00;");

        //버튼 이벤트 생성
        //버튼 클릭하면 해당 파일삭제 기능 구현
        btn.onclick = (e) => {
          //클릭된 버튼
          const ele = e.target;

          const delFile = ele.getAttribute("delFile");

          for(let i = 0; i < uploadFiles.length; i++) {
            //배열에 담겨있는 파일중 파일명이 같은 파일 삭제
            if(delFile === uploadFiles[i].name) {
              //배열에서 i번째 하나 제거
              uploadFiles.splice(i, 1);
            }
          }

          //버튼 클릭 시 btnAtt 인풋에서도 첨부된 파일 삭제
          //input type="file"은 첨부된 파일을 fileList의 형태로 관리
          //fileList에는 일반적인 File 객체를 넣을 수 없다.
          //DataTransfer라는 클래스를 이용해서 완전한 fileList 형태로 만들어서
          //input.files에 넣어줘야 한다.

          const dt = new DataTransfer();

          uploadFiles.forEach(file => dt.items.add(file));

          document.getElementById('btnAtt').files = dt.files;

        //   //jquery는 삭제
        //   $("#btnAtt")[0].files = dt.files;

          //해당 img 태그를 담고 있는 div 삭제
          const parentDiv = ele.parentNode;
          parentDiv.remove();
        }

        //파일명 표출할 p태그 생성
        const fName = document.createElement("p");
        fName.setAttribute("style", "display: inline-block; font-size: 8px;");
        fName.textContent = file.name;

        //div에 하나씩 추가
        div.appendChild(img);
        div.appendChild(btn);
        div.appendChild(fName);

        //완성된 div 리턴
        return div;
      }

    const insertBoard = useCallback((e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        //FormData를 객체로 만들어서 
        //업로드되는 파일을 추가한 객체를 데이터로 전송
        const formDataObj = {};

        //기존 formData에 담긴 내용을 formDataObj에 담아주기
        formData.forEach((value, key) => (formDataObj[key] = value));

        //업로드 파일 객체에 추가
        formDataObj.uploadFiles = uploadFiles;

        const insertBoardAxios = async () => {
            try {
                const response = await axios.post('/board/board', formDataObj, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`,
                        "Content-Type": "multipart/form-data"
                    }
                });

                console.log(response);
                if(response.data && response.data.item.msg) {
                    alert(response.data.item.msg);
                    navi('/board-list');
                }
            } catch(e) {
                console.log(e);
            }
        }

        insertBoardAxios();
    }, []);  

  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <h3>새 글 등록</h3>
        <form id="insertForm" onSubmit={insertBoard}>
            <table style={{borderCollapse: 'collapse', border: '1px solid black'}}>
            <tr>
                <td style={{background: 'skyblue', width: '70px'}}>
                제목
                </td>
                <td style={{textAlign: "left"}}>
                <input type="text" name="boardTitle"></input>
                </td>
            </tr>
            <tr>
                <td style={{background: 'skyblue'}}>
                작성자
                </td>
                <td style={{textAlign: "left"}}>
                <input type="text" name="boardWriter" readonly value={sessionStorage.getItem("userId")}></input>
                </td>
            </tr>
            <tr>
                <td style={{background: 'skyblue', width: '70px'}}>
                내용
                </td>
                <td style={{textAlign: "left"}}>
                <textarea name="boardContent" cols="40" rows="10"></textarea>
                </td>
            </tr>
            <tr>
                <td style={{background: 'skyblue', width: '70px'}}>
                파일첨부
                </td>
                <td>
                <div id="image_preview">
                    <input type="file" id="btnAtt"
                        name="uploadFiles" multiple onChange={changeFiles}></input>
                    <div id="attZone"
                        data-placeholder="파일을 첨부하려면 파일선택 버튼을 누르세요.">
                    </div>
                </div>
                </td>
            </tr>
            <tr>
                <td colspan="2" style={{textAlign: "center"}}>
                    <button type="submit" id="btnInsert">새 글 등록</button>
                </td>
            </tr>
            </table>
        </form>
        <hr/>
        <Link to="/board-list">글 목록</Link>
    </div>
  );
};

export default InsertBoard;