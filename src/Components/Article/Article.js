import React,{ useContext,useEffect, useState, useRef, useReducer} from "react";
import styled from "styled-components";
import Info from "../Info/Info";
import Header from "../Header/Header";
import { UrlContext } from "../../Context/UrlContext";
import ReactPlayer from "react-player";
import VideoSnapshot from 'video-snapshot';
import * as tf from "@tensorflow/tfjs"
import JSZip from "jszip";
import { string } from "@tensorflow/tfjs";

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
const StyledCanvas = styled.canvas`
    float:left;
    margin 0.6% 2%;
    position: absolute;
    display: none;
`
//display: none;

const ModelUrl = "tfjs_model/model.json"
//const ModelUrl = "https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json"
//const ModelUrl = "./tfjs_tiny/model.json"

function Article() {
    const { UrlData, SetUrlData} = useContext(UrlContext);
    const [ Blub, SetBlub] = useState();
    const result = [];
    const result_ref = useRef([]);
    const video_ref = useRef();
    const canvasRef = useRef([]);   
    let model;
    let tensor;

    let vwidth =0;
    let vheight =0;
    useEffect(()=>{
        UrlData != "" ? SetBlub(URL.createObjectURL(UrlData)) : SetBlub(Blub);
        console.log(UrlData, Blub)
    },[UrlData]);

    function showProgress(percent) {
        var pct = Math.floor(percent*100.0);
        console.log(`${pct}% loaded`)
    }
    function canvas_download(props){
        console.log(props + "canvas_downloading..")
        var canvas = canvasRef.current[props];
        var url = canvas.toDataURL("image/png");
        var link = document.createElement('a');
        link.download = 'detected.jpg';
        link.href = url;
        link.click();
      }
    function img_download(props){
        console.log(props + "img_downloading..")
        var link = document.createElement('a');
        link.download = 'filename.jpg';
        link.href = result_ref.current[props].src;
        link.click();
      }
    function Img(props){
        function check(){
            console.log(props.k)
        }
        return(
            <>
            <StyledImg ref = {el => (result_ref.current[props.k-1] = el)} onClick={check}  alt={props.k + "번 프레임 아직 설정하지않음"}></StyledImg>
            <StyledCanvas ref = {el => (canvasRef.current[props.k-1] = el)}/>
            </>
        );
    }
    async function Predict(){
        console.log( "Loading model..." );
        model = await tf.loadGraphModel(ModelUrl, {onProgress: showProgress});
        console.log( "Model loaded.");
        for(let k=0;k<1;k++){
            let box_array =[]
            let bboxes =[]
            let newArray;
            console.log("Loading IMG...")
            


            result_ref.current[k].onload  = function(){
                    
                var img = new Image();
                img.src = result_ref.current[k].src;
                img.onload = function()
                {
                    vwidth = this.width;
                    vheight = this. height;
                    canvasRef.current[k].width = this.width;
                    canvasRef.current[k].height =  this.height;
                    //console.log("Width: "+this.width+" Height: "+this.height);
                    const ctx = canvasRef.current[k].getContext("2d");
                    ctx.drawImage(img, 0, 0);
                }
                
                img.remove();
            }


            tensor = await tf.browser.fromPixels(result_ref.current[k])
            console.log("Img loaded")
            let shapev = tensor.shape
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
                if(predictions[4][0][i]<0.1 || predictions[2][0][i]==2){
                    continue;
                } 
                let box =[];
                box.push(predictions[1][0][i]);
                box.push(predictions[4][0][i]);
                box.push(predictions[2][0][i]);
                box_array.push(box);
    
                let bbox =[];
                /*bbox.push(vwidth*predictions[1][0][i][0]);
                bbox.push(vheight*predictions[1][0][i][1]);
                bbox.push(vwidth*(predictions[1][0][i][2]-predictions[1][0][i][0]));
                bbox.push(vheight*(predictions[1][0][i][3]-predictions[1][0][i][1]));*/
                bbox.push(vwidth*predictions[1][0][i][1]);
                bbox.push(vheight*predictions[1][0][i][0]);
                bbox.push(vwidth*(predictions[1][0][i][3]-predictions[1][0][i][1]));
                bbox.push(vheight*(predictions[1][0][i][2]-predictions[1][0][i][0]));
                bbox.push(Math.floor(predictions[4][0][i]*100))
                bboxes.push(bbox)
            }
            console.log(box_array, bboxes)
            // x,y,width,height
            // x = 
            canvasRef.current[k].src = result_ref.current[k].src;
            const ctx = canvasRef.current[k ].getContext("2d");
            bboxes.forEach(prediction => {
    
                // Extract boxes and classes
                const [x, y, width, height, score] = prediction; 
                const text = score; 
            
                // Set styling
                const color = Math.floor(Math.random()*16777215).toString(16);
                ctx.strokeStyle = '#' + color
                ctx.font = '40px Arial';
                console.log(ctx.lineWidth)
                ctx.lineWidth = 3;
                // Draw rectangles and text
                ctx.beginPath();   
                ctx.fillStyle = '#' + color
                ctx.fillText(text, x, y);
                ctx.rect(x, y, width, height); 
                ctx.stroke();
            });
        }
        alert("사진 분석이 완료되었습니다.");
        
    }

    const Getimg = async () => {
        try {
            const frameRate = 1/8;
            const snapshoter = new VideoSnapshot(UrlData);
            var currentTime = video_ref.current.getCurrentTime();
            for (let i = 1; i <= 16; i++) {
                //console.log(currentTime, i-1)
                //const previewSrc = await snapshoter.takeSnapshot(currentTime);

                //result_ref.current[i-1].src = previewSrc;
                result_ref.current[i-1].src = ("./predict/"+i+".jpg");

                result_ref.current[i-1].onload  = function(){
                    
                    var img = new Image();
                    img.src = result_ref.current[i-1].src;
                    img.onload = function()
                    {
                        vwidth = this.width;
                        vheight = this. height;
                        canvasRef.current[i-1].width = this.width;
                        canvasRef.current[i-1].height =  this.height;
                        //console.log("Width: "+this.width+" Height: "+this.height);
                        const ctx = canvasRef.current[i-1].getContext("2d");
                        ctx.drawImage(img, 0, 0);
                    }
                    
                    img.remove();
                }
                console.log(canvasRef.current[i-1].height, canvasRef.current[i-1].width)
                currentTime += frameRate;
              }
              alert("사진 캡처가 완료되었습니다.");
            
        } catch (error) {
         alert(error.message)   
        }
    }
    const Download = () =>{
        /*let zip = new JSZip();
        for(let i=0;i<1;i++){
            zip.folder("original").file(i+"_preview.jpg",result_ref.current[i-1])
        }

        zip.generateAsync({type: 'blob'})
		.then((resZip) => {
			const link = document.createElement('a');
            link.href = URL.createObjectURL(resZip);
            link.download = `preview.zip`;
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(link.href)
            
		})
		.catch((error) => {
			console.log(error);
		});*/
        canvas_download(0);
        img_download(0);
        
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
  