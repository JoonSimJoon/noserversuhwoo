import React,{ useContext,useEffect, useState, useRef} from "react";
import styled from "styled-components";
import Info from "../Info/Info";
import Header from "../Header/Header";
import { UrlContext } from "../../Context/UrlContext";
import ReactPlayer from "react-player";
import VideoSnapshot from 'video-snapshot';
import * as tf from '@tensorflow/tfjs';
import {loadGraphModel} from '@tensorflow/tfjs-converter';
import { mod } from "@tensorflow/tfjs";

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
    overflow:hidden;
    text-align:center;
    margin-left:10px;
`

const VideoWrapper = styled.div`
    width: 40%;
    margin: 0.3%;
    border: 2px solid black;
`

const StyledImg = styled.img`
    display:inline-block;
    float:left;
    width: 20%;
    height: 20%;
    border: 2px solid black;
    margin 0.6% 2%;
`;

const StyledVideo = styled.video`
    width: 100%;
    height 100%;
`
//const ModelUrl = "./tfjs_model/model.json"
const ModelUrl = "https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json"

function Article() {
    const { UrlData, SetUrlData} = useContext(UrlContext);
    const [ Blub, SetBlub] = useState();
    const result = [];
    const result_ref = useRef([]);
    const video_ref = useRef();
    useEffect(()=>{
        UrlData != "" ? SetBlub(URL.createObjectURL(UrlData)) : SetBlub(Blub);
        console.log(UrlData, Blub)
    },[UrlData]);

    function Img(props){
        function check(){
            console.log(props.k)
        }
        return(
            <StyledImg ref = {el => (result_ref.current[props.k-1] = el)} onClick={check}  alt={props.k + "번 프레임 아직 설정하지않음"}></StyledImg>
        );
    }
    const Predict = async () =>{
        class L2 {
            static className = 'L2';
        
            constructor(config) {
               return tf.regularizers.l1l2(config)
            }
        }
        tf.serialization.registerClass(L2);
        const model = await tf.loadLayersModel(ModelUrl);
       
    }

    const Getimg = async () => {
        try {
            const frameRate = 1/8;
            const snapshoter = new VideoSnapshot(UrlData);
            var currentTime = video_ref.current.getCurrentTime();
                
            for (let i = 1; i <= 16; i++) {
                console.log(currentTime, i-1)
                const previewSrc = await snapshoter.takeSnapshot(currentTime);
                result_ref.current[i-1].src = previewSrc
                currentTime += frameRate
              }
            
        } catch (error) {
         alert(error.message)   
        }
    }
    const rendering = () => {
        for (let i = 1; i <= 16; i++) {
          result.push(<Img k={i} ></Img>);
        }
        return result;
      };
    return (
      <>
      <Header Getimg={Getimg} Predict={Predict}/>
      <ContentsWrapper>
        <ImgWrapper>
            {rendering()}
        </ImgWrapper>
        <VideoWrapper>
            <ReactPlayer ref = {video_ref} url={Blub} width="100%" height="100%" controls={true} />
        </VideoWrapper>
       </ContentsWrapper>
        <Info/>
      </>
    
  );
}
  
export default Article;
  