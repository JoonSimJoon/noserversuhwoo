import styled from "styled-components";
import React, { useState, useContext, useRef} from "react";
import { Link } from "react-router-dom";
import { UrlContext } from "../../Context/UrlContext";

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

function Header(props) {
  const { UrlData, SetUrlData} = useContext(UrlContext);
  const inputFile = useRef(null)
  async function Connection (){
    
    await inputFile.current.click();
    //await props.Getimg();
   
  }



  const Detect = () => {
    props.Predict();

  }
  
  const Download = () => {
    props.Download();
  }

  const Predict_Download = () => {
    props.Predict_Download();
  }
  
  const Show = () =>{
    props.Show();
  }

    return (
      <>
        <StyledHeader>
          <ButtonWrapper>
          <StyledDiv onClick={Connection}
              onMouseOver={e => (e.currentTarget.children[0].src = 'img/hover_icon/import_on.png')}
              onMouseOut={e => (e.currentTarget.children[0].src='img/basic_icon/import.png')}>
                <Styledimg  src="img/basic_icon/import.png"/>
                불러오기
            </StyledDiv>
            
            <input type='file' id='file' ref={inputFile} onChange={(event) => SetUrlData((event.target.files))} style={{display: 'none'}} accept="image/*" multiple/>

            <StyledDiv onClick = {Detect}
            onMouseOver={e => (e.currentTarget.children[0].src = 'img/hover_icon/analysis_on.png')}
            onMouseOut={e => (e.currentTarget.children[0].src='img/basic_icon/analysis.png')}>
              <Styledimg  src = "img/basic_icon/analysis.png"/>
              모델 불러오기
            </StyledDiv>

            <StyledDiv onClick = {Show}
            onMouseOver={e => (e.currentTarget.children[0].src = 'img/hover_icon/analysis_on.png')}
            onMouseOut={e => (e.currentTarget.children[0].src='img/basic_icon/analysis.png')}>
              <Styledimg  src = "img/basic_icon/analysis.png"/>
              분석
            </StyledDiv>
            
            <Line/>
            <StyledDiv onClick = {Download}
            onMouseOver={e => (e.currentTarget.children[0].src = 'img/hover_icon/save_on.png')}
            onMouseOut={e => (e.currentTarget.children[0].src='img/basic_icon/save.png')}>
              <Styledimg  src = "img/basic_icon/save.png"/>
              원본저장
            </StyledDiv>

            <StyledDiv onClick = {Predict_Download}
            onMouseOver={e => (e.currentTarget.children[0].src = 'img/hover_icon/save_on.png')}
            onMouseOut={e => (e.currentTarget.children[0].src='img/basic_icon/save.png')}>
              <Styledimg  src = "img/basic_icon/save.png"/>
              분석저장
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
  