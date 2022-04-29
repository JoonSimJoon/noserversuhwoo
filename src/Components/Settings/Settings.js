import styled from "styled-components";
import React, { useState, useContext, useEffect} from "react";
import Header from "../Header/Header";

const Wrapper = styled.div`
  height: 770px;
  width: 100%;
  border: 2px solid black;
  background: white;
  margin: 5px 0px;  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoginWrapper = styled.div`
    width: 40%;
    height: 30%;
    text-align: center;
`

const Input = styled.input`
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 20%;
    margin: 0 0 2%;
    border: solid 1px #dadada;
`

const Button = styled.button`
 font-size: 18px;
  font-weight: 700;
  line-height: 20%;
  display: block;
  width: 100%;
  height: 20%;
  margin: 16px 0 7px;
  cursor: pointer;
  text-align: center;
  color: #fff;
  border: none;
  border-radius: 0;
  background-color: #03c75a;
`

function Settings() {
  const [ Data, SetData ]  = useState({
    Url: ""
  });
  

  function handle(e) {
    const newData = { ...Data } 
    newData[e.target.id] = e.target.value
    SetData(newData)
  }

  function submit() {
    console.log(Data)
  }
  function tomain(){
    window.location.hash="/"
  }

  return (
    <>
    <Header/>
      <Wrapper>
        <LoginWrapper>
          <Input id="Url" onChange={(e) => handle(e)} value={Data.Url} placeholder="RTSP 영상 주소를 입력해주세요"/>
          <Button onClick={submit}>제출</Button> 
          <Button onClick={tomain}>메인페이지로</Button> 
        </LoginWrapper>
        
      </Wrapper>
    </>
    
  );
}
  
export default Settings;
  
