import React,{ useContext,useEffect, useState} from "react";
import styled from "styled-components";
import Info from "../Info/Info";
import Header from "../Header/Header";
import { UrlContext } from "../../Context/UrlContext";
import ReactPlayer from "react-player";

const ContentsWrapper = styled.div`
    display: inline-flex;
    height: 410px;
    width: 100%;
    border: 2px solid black;
    background: white;
    margin-top: 2px;
    margin-bottom: 2px;
`

const ImgWrapper = styled.div`
    width: 60%;
    margin: 0.3%;
    border: 2px solid black;
    text-align: center;
`

const VideoWrapper = styled.div`
    width: 40%;
    margin: 0.3%;
    border: 2px solid black;
`

const StyledImg = styled.canvas`
    display: inline-flex;
    width: 20%;
    height: 20%;
    border: 2px solid black;
    margin 0.6% 2%;
`;

const StyledVideo = styled.video`
    width: 100%;
    height 100%;
`



function Article() {
    const { UrlData, SetUrlData} = useContext(UrlContext);
    
    const result = [];
    
    function Img(props){
        function check(){
            console.log(props.k)
        }
        return(
            <StyledImg onClick={check} ></StyledImg>
        );
    }
    function Getimg(){
        const frameRate = 16;
        console.log(result)
        for (let i =1;i<=16;i++){
            result[i].drawImage()
        }
    }
    const rendering = () => {
        for (let i = 1; i <= 16; i++) {
          result.push(<Img k={i}></Img>);
        }
        return result;
      };
    return (
      <>
      <Header Getimg={Getimg}/>
      <ContentsWrapper>
        <ImgWrapper>
            {rendering()}
        </ImgWrapper>
        <VideoWrapper>
            <ReactPlayer url={UrlData} width="100%" height="100%" controls={true} />
        </VideoWrapper>
       </ContentsWrapper>
        <Info/>
      </>
    
  );
}
  
export default Article;
  