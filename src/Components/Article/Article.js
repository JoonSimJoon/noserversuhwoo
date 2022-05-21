import React,{ useContext,useEffect, useState, useRef} from "react";
import styled from "styled-components";
import Info from "../Info/Info";
import Header from "../Header/Header";
import { UrlContext } from "../../Context/UrlContext";
import ReactPlayer from "react-player";
import VideoSnapshot from 'video-snapshot';
import * as tf from "@tensorflow/tfjs"

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
const ModelUrl = "tfjs_model/model.json"
//const ModelUrl = "https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json"
//const ModelUrl = "./tfjs_tiny/model.json"

function Article() {
    const { UrlData, SetUrlData} = useContext(UrlContext);
    const [ Blub, SetBlub] = useState();
    const result = [];
    const result_ref = useRef([]);
    const video_ref = useRef();
    let model;
    let tensor;
    let newArray;
    let box_array =[]
    let bboxes =[]
    useEffect(()=>{
        UrlData != "" ? SetBlub(URL.createObjectURL(UrlData)) : SetBlub(Blub);
        console.log(UrlData, Blub)
    },[UrlData]);

    function showProgress(percent) {
        var pct = Math.floor(percent*100.0);
        console.log(`${pct}% loaded`)
    }

    function _logistic(x) {
        if (x > 0) {
            return (1 / (1 + Math.exp(-x)));
        } else {
            const e = Math.exp(x);
            return e / (1 + e);
        }
    }

    function Img(props){
        function check(){
            console.log(props.k)
        }
        return(
            <StyledImg ref = {el => (result_ref.current[props.k-1] = el)} onClick={check}  alt={props.k + "번 프레임 아직 설정하지않음"}></StyledImg>
        );
    }
    function getMethods(o) {
        return Object.getOwnPropertyNames(Object.getPrototypeOf(o))
            .filter(m => 'function' === typeof o[m]);
    }

    async function Predict(){
        console.log( "Loading model..." );
        model = await tf.loadGraphModel(ModelUrl, {onProgress: showProgress});
        const is_new_od_model = model.inputs.length == 3;
        console.log( "Model loaded.");
        
        console.log("Loading IMG...")
        tensor = await tf.browser.fromPixels(result_ref.current[1])
        console.log("Img loaded")
        let shapev = tensor.shape
        let width = result_ref.current[1].width;
        let height = result_ref.current[1].height;
        if(shapev.length==3){
            newArray = [1].concat(shapev);
        }else{
            newArray = shapev;
        }
        tensor = tensor.reshape(newArray)

        const outputs = await model.executeAsync(tensor);
        const arrays = !Array.isArray(outputs) ? outputs.array() : Promise.all(outputs.map(t => t.array()));
        let predictions = await arrays;
        const objectnum = predictions[5];
        for(let i=0;i<objectnum;i++){
            if(predictions[4][0][i]<0.2){
                continue;
            } 
            let box =[];
            box.push(predictions[1][0][i]);
            box.push(predictions[4][0][i]);
            box.push(predictions[2][0][i]);
            box_array.push(box);

            let bbox =[];
            bbox.push(width*predictions[1][0][i][0]);
            bbox.push(height*predictions[1][0][i][1]);
            bbox.push(width*(predictions[1][0][i][2]-predictions[1][0][i][0]));
            bbox.push(height*(predictions[1][0][i][3]-predictions[1][0][i][1]));
            bboxes.push(bbox)
        }
        console.log(bboxes)
        // x,y,width,height
        // x = 


    }

    const Getimg = async () => {
        try {
            const frameRate = 1/8;
            const snapshoter = new VideoSnapshot(UrlData);
            var currentTime = video_ref.current.getCurrentTime();
                
            for (let i = 1; i <= 2; i++) {
                console.log(currentTime, i-1)
                const previewSrc = await snapshoter.takeSnapshot(currentTime);
                result_ref.current[i-1].src = previewSrc
                currentTime += frameRate
              }
            
        } catch (error) {
         alert(error.message)   
        }
    }
    const Download = () =>{
        const link = document.createElement('a');

        link.href = result_ref.current[1].src;
        link.download = `preview.jpg`;
        document.body.appendChild(link);
        link.click();
    }

    const rendering = () => {
        for (let i = 1; i <= 16; i++) {
          result.push(<Img k={i} ></Img>);
        }
        return result;
      };
    return (
      <>
      <Header Getimg={Getimg} Predict={Predict} Download={Download}/>
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
  