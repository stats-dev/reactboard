import React from 'react';

const FileList = ({boardFileList, addChangeFile, changeOriginFile}) => {
    const openFileInput = (boardFileNo) => {
        const fileInput = document.getElementById(`changeFile${boardFileNo}`);
        fileInput.click(); //사진 클릭하면 인풋이 잘 떠야 한다.
    }    

    const changeBoardFile = (e, boardFileNo) => {
        const fileList = Array.prototype.slice.call(e.target.files); //array 변환

        const changeFile = fileList[0];

        addChangeFile(changeFile);

        changeOriginFile(boardFileNo, "U", changeFile.name);

        const reader = new FileReader();

        reader.onload = function(ee) {
            const img = document.getElementById(`img${boardFileNo}`);

            const p = document.getElementById(`fileName${boardFileNo}`);

            img.src = ee.target.result;

            p.textContent = changeFile.name;
        }

        reader.readAsDataURL(changeFile);
    }

    const deleteImg = (e, boardFileNo) => {
        //e 이벤트 객체와 boardFileNo 불러옴.
        changeOriginFile(boardFileNo, "D", ""); //

        const ele = e.target;


        const div = ele.parentElement;

        div.remove();
    }

  return (
    
    <>
        {boardFileList && boardFileList.map(boardFile => (
            <div style={{display: 'inline-block', position: 'relative', width: '150px', height: '120px',
                margin: '5px', border: '1px solid #00f', zIndex: 1}}>
                <input type="file" style={{display: 'none'}} id={`changeFile${boardFile.boardFileNo}`} onChange={(e) => changeBoardFile(e, boardFile.boardFileNo)}></input>
                        <img style={{width: '100%', height: '100%', zIndex: 'none',
                                        cursor: 'pointer'}} className="fileImg" id={`img${boardFile.boardFileNo}`} src={`http://kr.object.ncloudstorage.com/bitcamp-bucket-144/board/${boardFile.boardFileName}`} onClick={() => openFileInput(boardFile.boardFileNo)}                            
                            ></img>
                <input type="button" className="btnDel" value="x" style={{width: '30px', height: '30px', position: 'absolute',
                    right: '0px', bottom: '0px', zIndex: 999,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#f00'}} onClick={(e) => deleteImg(e, boardFile.boardFileNo)}></input>
                <p style={{display: 'inline-block', fontSize: '8px', cursor: 'pointer'}}
                    id={`fileName${boardFile.boardFileNo}`}>
                </p>
            </div>
        ))} 
    </>
  );
};

export default FileList