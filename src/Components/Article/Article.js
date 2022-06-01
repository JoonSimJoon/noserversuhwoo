import React,{ useContext,useEffect, useState, useRef, useReducer} from "react";
import styled from "styled-components";
import Header from "../Header/Header";
import { UrlContext } from "../../Context/UrlContext";
import { DataContext } from "../../Context/DataContect";
import * as tf from "@tensorflow/tfjs"
import Info from "../Info/Info"


const ContentsWrapper = styled.div`
    display: inline-flex;
    height: 770px;
    width: 100%;
    border: 2px solid black;
    background: white;
    margin-top: 2px;
    margin-bottom: 2px;
`

const ImgWrapper = styled.div`
    width: 80%;
    margin: 0.3%;
    border: 2px solid black;
    overflow:hidden;
    text-align:center;
    margin-left:10px;
`

const InfoWrapper = styled.div`
    width: 20%;
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
    display:none;
`
//display: none;

const ModelUrl = "./tfjs_model/model.json"
//const ModelUrl = "https://tensorflowjsrealtimemodel.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json"
//const ModelUrl = "./tfjs_tiny/model.json"

function Article() {
    const { UrlData, SetUrlData} = useContext(UrlContext);
    const { Data, SetData} = useContext(DataContext);
    //const [ImgNum,SetImgNum] = useState("0")
    const result = [];
    const result_ref = useRef([]);
    const canvasRef = useRef([]);   
    let model;
    let tensor;
    let ImgNum;
    let vwidth =0;
    let vheight =0;
    let boxarrayes = []
    let converted_boxarrayes = []
    
    useEffect(()=>{
        try {
            for (let i = 1; i <= 16; i++) {
                //console.log(currentTime, i-1)
                //const previewSrc = await snapshoter.takeSnapshot(currentTime);
                //result_ref.current[i-1].src = previewSrc;
                result_ref.current[i-1].src = URL.createObjectURL(UrlData[i-1])

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
               // console.log(canvasRef.current[i-1].height, canvasRef.current[i-1].width)
              }
            
        } catch (error) {
         console.log(error.message)   
        }
    },[UrlData]);


    function showProgress(percent) {
        var pct = Math.floor(percent*100.0);
        console.log(`${pct}% loaded`)
    }
    function canvas_download(){
        console.log(ImgNum-1+ "canvas_downloading..")
        var canvas = canvasRef.current[ImgNum-1];
        var url = canvas.toDataURL("image/png");
        var link = document.createElement('a');
        link.download = 'detected.jpg';
        link.href = url;
        link.click();
      }
    function img_download(){
        console.log(ImgNum-1 + "img_downloading..")
        var link = document.createElement('a');
        link.download = 'filename.jpg';
        link.href = result_ref.current[ImgNum-1].src;
        link.click();
      }
      function scaleIt(source,scaleFactor){
        var c=document.createElement('canvas');
        var ctx=c.getContext('2d');
        var w=source.width*scaleFactor;
        var h=source.height*scaleFactor;
        c.width=w;
        c.height=h;
        ctx.drawImage(source,0,0,w,h);
        return(c);
      }
    function Img(props){
        function check(){
            ImgNum = props.k;
            var newdata = Data;
            newdata.num  = props.k

            SetData(newdata);
            //console.log(props.k);
            //console.log(ImgNum);
            
            //console.log(boxarrayes,converted_boxarrayes)
            
            
        }
        return(
            <>
            <StyledImg ref = {el => (result_ref.current[props.k-1] = el)} onClick={check}  alt={props.k + "번 프레임 아직 설정하지않음"}></StyledImg>
            <StyledCanvas ref = {el => (canvasRef.current[props.k-1] = el)}/>
            </>
        );
    }
    async function Predict(){
        boxarrayes = []
        console.log( "Loading model..." );
        model = await tf.loadGraphModel(ModelUrl, {onProgress: showProgress});
        alert("인공지능 모델 불러오기 완료");
        for(let k=0;k<16;k++){
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
                if(predictions[4][0][i]<0.2){
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
                bbox.push(predictions[2][0][i])
                bboxes.push(bbox)
            }
            boxarrayes.push(box_array)
            converted_boxarrayes.push(bboxes)
            //console.log(box_array, bboxes)
            // x,y,width,height
            // x = 
            canvasRef.current[k].src = result_ref.current[k].src;
            const ctx = canvasRef.current[k ].getContext("2d");
            //ctx.clearRect(0, 0, canvasRef.current[k].width, canvasRef.current[k].height);

            bboxes.forEach(prediction => {
    
                // Extract boxes and classes
                const [x, y, width, height, score, object] = prediction; 
                const text = String(score) + String(object); 
                if(object == 1){
                    return;
                } 
                // Set styling
                const color = Math.floor(Math.random()*16777215).toString(16);
                ctx.strokeStyle = '#' + color
                ctx.font = '40px Arial';
                //console.log(ctx.lineWidth)
                ctx.lineWidth = 15;
                // Draw rectangles and text
                ctx.beginPath();   
                ctx.fillStyle = '#' + color
                ctx.fillText(text, x, y);
                ctx.rect(x, y, width, height); 
                ctx.stroke();
            });
            //var url = canvasRef.current[k].toDataURL("image/png")
            canvasRef.current[k].toBlob(blob => {
                result_ref.current[k].src = URL.createObjectURL(blob);
            })
        }
        alert("사진 분석이 완료되었습니다.");
        var newdata = Data
        newdata.jsondata = boxarrayes
        SetData(newdata)
    }

    const Getimg = async () => {
        try {
            for (let i = 1; i <= 16; i++) {
                //console.log(currentTime, i-1)
                //const previewSrc = await snapshoter.takeSnapshot(currentTime);

                //result_ref.current[i-1].src = previewSrc;
                result_ref.current[i-1].src = URL.createObjectURL(UrlData[i-1])

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
                        ctx.drawImage(img, 0, 0,100,100);
                    }
                    
                    img.remove();
                }
                //console.log(canvasRef.current[i-1].height, canvasRef.current[i-1].width)
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
      <Header Getimg={Getimg} Predict={Predict} Download={img_download} Predict_Download={canvas_download} />
      <ContentsWrapper>
        <ImgWrapper>
            {rendering()}
        </ImgWrapper>
        <InfoWrapper>
            <Info/>
            asd
        </InfoWrapper>

       </ContentsWrapper>
      </>
    
  );
}
  
export default Article;
  