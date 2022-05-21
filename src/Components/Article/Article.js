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

    const ANCHORS = [0.573, 0.677, 1.87, 2.06, 3.34, 5.47, 7.88, 3.53, 9.77, 9.17];
    const NEW_OD_OUTPUT_TENSORS = ['detected_boxes', 'detected_scores', 'detected_classes'];

    async function Predict(){
        console.log( "Loading model..." );
        model = await tf.loadGraphModel(ModelUrl, {onProgress: showProgress});
        const is_new_od_model = model.inputs.length == 3;
        console.log( "Model loaded.");
        
        console.log("Loading IMG...")
        tensor = await tf.browser.fromPixels(result_ref.current[1])
        console.log("Img loaded")
        let shapev = tensor.shape
        if(shapev.length==3){
            newArray = [1].concat(shapev);
        }else{
            newArray = shapev;
        }
        tensor = tensor.reshape(newArray)
        
        const outputs = await model.executeAsync(tensor, is_new_od_model ? NEW_OD_OUTPUT_TENSORS : null);
        const arrays = !Array.isArray(outputs) ? outputs.array() : Promise.all(outputs.map(t => t.array()));
	    let predictions = await arrays;
        console.log( "Post processing...",predictions);
		const num_anchor = ANCHORS.length / 2;
		const channels = predictions[0][0][0].length;
		const height = predictions[0].length;
		const width = predictions[0][0].length;
		const num_class = channels / num_anchor - 5;
        console.log(channels,num_anchor,num_class,predictions[0]);

		let boxes = [];
		let scores = [];
		let classes = [];

		for (var grid_y = 0; grid_y < height; grid_y++) {
			for (var grid_x = 0; grid_x < width; grid_x++) {
				let offset = 0;

				for (var i = 0; i < num_anchor; i++) {
					let x = (_logistic(predictions[0][grid_y][grid_x][offset++]) + grid_x) / width;
					let y = (_logistic(predictions[0][grid_y][grid_x][offset++]) + grid_y) / height;
					let w = Math.exp(predictions[0][grid_y][grid_x][offset++]) * ANCHORS[i * 2] / width;
					let h = Math.exp(predictions[0][grid_y][grid_x][offset++]) * ANCHORS[i * 2 + 1] / height;

					let objectness = tf.scalar(_logistic(predictions[0][grid_y][grid_x][offset++]));
                    let no = Array.from(predictions[0][grid_y][grid_x]).slice(offset, offset + num_class);
                    //console.log(offset, offset + num_class ,num_class, no)
					let class_probabilities = tf.tensor1d( no ).softmax();
					offset += num_class;

					class_probabilities = class_probabilities.mul(objectness);
					let max_index = class_probabilities.argMax();
					boxes.push([x - w / 2, y - h / 2, x + w / 2, y + h / 2]);
					scores.push(class_probabilities.max().dataSync()[0]);
					classes.push(max_index.dataSync()[0]);
				}
			}
		}

		boxes = tf.tensor2d(boxes);
		scores = tf.tensor1d(scores);
		classes = tf.tensor1d(classes);

		const selected_indices = await tf.image.nonMaxSuppressionAsync(boxes, scores, 10);
		predictions = [await boxes.gather(selected_indices).array(), await scores.gather(selected_indices).array(), await classes.gather(selected_indices).array()];


        console.log(predictions)
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
  