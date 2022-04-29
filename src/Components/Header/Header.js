import styled from "styled-components";
import React, { useState, useContext} from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const StyledHeader = styled.div`
  background: #2c2c2c;
  display: flex;
  align-items: center;
  width : 100%;
  height: 67px;
  border: 2px solid black;
`;

const ButtonWrapper = styled.div`
  width : 70%;
  padding-left: 38px;
`;
const StyledDiv = styled.div`
  float: left;
  &:hover,
  &:focus {  
    transform: scale(1.1);
    color: #17B9B6;
  }
  margin-right: 20px;
  border-radius: 0.25rem;
  cursor: pointer;
  color: #757575;
  font-size: 18px;
`;
const Styledimg = styled.img`
  width: 18px;
  margin-right: 6px;
`;

const Logo = styled.img`
  position: absolute;
  right: 56px;
  height: 40px;
  border-radius: 0.7rem;
`;
const Line =styled.div`
  float: left;
  width: 0px;
  height: 24px;
  border: 0.1px solid rgba(201,201,201,0.2);
  margin-right: 20px; 
`

function Header() {
  const ApiURL = "http://localhost:8888"


  const Host_server = () =>{
    const api = axios.create({
      baseURL: ApiURL+"/check"
    })
    api.get()
    .then(function a(response) { 
      console.log(response)
      if (response.data===200){
        alert("서버 연결 완료")
      }  
    })
    .catch(error =>{
      console.log(error);
      alert("서버 연결이 불안정합니다")
    });
  }

  const screenshot = () => {
    const api=axios.create({
      baseURL: ApiURL+"/screenshot",
      headers:{
        'Content_type':'application/json'
      }
    })
    api.get()
    .then(response => {
      console.log(response)
    }); 
  }

  const detect = () => {
    const api=axios.create({
      baseURL: ApiURL+"/detect",
      headers:{
        'Content_type':'application/json'
      }
    })
    api.get()
    .then(response => {
      console.log(response)
    });
  }
  
  const Download = () => {
    const api=axios.create({
      baseURL: ApiURL+"/download",
      headers:{
        'Content_type':'application/json'
      }
    })
    api.get()
    .then(response => {
      console.log(response)
    });
  }
  
  const Open_Folder = () => {
    let input = document.createElement('input');
    input.type = 'file';
    input.multiple="multiple"
    input.onchange = _ => {
      // you can use this method to get file and perform respective operations
              let files =   Array.from(input.files);
              console.log(files);
          };
    input.click();
  }

    return (
      <>
        <StyledHeader>
          <ButtonWrapper>
            <StyledDiv onClick = {Host_server}
              onMouseOver={e => (e.currentTarget.children[0].src = 'img/hover_icon/connection_on.png')}
              onMouseOut={e => (e.currentTarget.children[0].src='img/basic_icon/connection.png')} >
              <Styledimg  src = "img/basic_icon/connection.png"/>
              서버연결
            </StyledDiv>
            <StyledDiv onClick = {screenshot}
            onMouseOver={e => (e.currentTarget.children[0].src = 'img/hover_icon/screenshot_on.png')}
            onMouseOut={e => (e.currentTarget.children[0].src='img/basic_icon/screenshot.png')}>
              <Styledimg  src = "img/basic_icon/screenshot.png"/>
              캡쳐
            </StyledDiv>
            <StyledDiv onClick = {detect}
            onMouseOver={e => (e.currentTarget.children[0].src = 'img/hover_icon/analysis_on.png')}
            onMouseOut={e => (e.currentTarget.children[0].src='img/basic_icon/analysis.png')}>
              <Styledimg  src = "img/basic_icon/analysis.png"/>
              분석
            </StyledDiv>
            <StyledDiv onClick = {Download}
            onMouseOver={e => (e.currentTarget.children[0].src = 'img/hover_icon/save_on.png')}
            onMouseOut={e => (e.currentTarget.children[0].src='img/basic_icon/save.png')}>
              <Styledimg  src = "img/basic_icon/save.png"/>
              저장
            </StyledDiv>
            <Line/>
            <StyledDiv onClick={Open_Folder}
            onMouseOver={e => (e.currentTarget.children[0].src = 'img/hover_icon/import_on.png')}
            onMouseOut={e => (e.currentTarget.children[0].src='img/basic_icon/import.png')}>
              <Styledimg  src="img/basic_icon/import.png"/>
              불러오기
            </StyledDiv>
            <Line/>
            <Link to="/settings">
              <StyledDiv
              onMouseOver={e => (e.currentTarget.children[0].src = 'img/hover_icon/system_on.png')}
              onMouseOut={e => (e.currentTarget.children[0].src='img/basic_icon/system.png')}>
                <Styledimg src = "img/basic_icon/system.png"/>
                설정
              </StyledDiv>
            </Link>
          </ButtonWrapper>
          <Logo src="img/icon.png" ></Logo>
        </StyledHeader>
      </>
      
    );
  }
  
  export default Header;
  