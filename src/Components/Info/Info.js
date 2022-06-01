
import React,{useEffect, useContext, useState, forwardRef, useImperativeHandle } from "react";
import styled from "styled-components";
const Wrapper = styled.div`
  width : 100%;
  height: 360px;
`;

const InfoWrapper = styled.div`
  padding: 20px;
`;

const StyledUl = styled.ul`
  list-style:none;
  padding-left:0px;

`;

const StyledLi = styled.li`
  font-size: 1.4em;

`;

const Info =  forwardRef((props, ref) =>  {
  const [ Data,SetData ] = useState([]);
  const [ImgNum,SetImgNum ] = useState("0");
  const [JsonData, SetJsonData] = useState({});
  
  var JsonList = new Array();
  var obj;
  const showdata = [ "최대 크기", 
  "최소 크기", "평균 크기", "추수 여부"];
  const dataname = ["max","min","avr"]
  useImperativeHandle(ref, () => ({
    Num_set: (props) => {
      //console.log(props)
      SetImgNum(props)
    },
    Data_set: (props) =>{
      console.log(props)
      SetData(props)
      console.log(Data)
    }
  }));
  
  useEffect(()=>{
    let idx=0;
    console.log(1, typeof(Data),Data)
    Data.forEach(images => {
        var max_diagonal = -1;
        var min_diagonal = -1;
        var avr_diagonal = parseFloat(0);
        var boxobject = new Object();
        var idxx=0;
        images.forEach( element=>{
          
            const [bbox,score,cls] = element;
            if(cls==1){
                //console.log(Math.floor((bbox[3]-bbox[1])*100),Math.floor((bbox[2]-bbox[0])*100),score,cls,idx);
                if((bbox[3]-bbox[1]) < (bbox[2]-bbox[0])){
                    boxobject.w_bx = ((bbox[3]-bbox[1])*100).toFixed(2);
                    boxobject.h_bx = ((bbox[2]-bbox[0])*100).toFixed(2);
                    
                }else{
                    boxobject.h_bx = ((bbox[3]-bbox[1])*100).toFixed(2);
                    boxobject.w_bx = ((bbox[2]-bbox[0])*100).toFixed(2);
                }
                boxobject.w_px = (180/parseFloat(boxobject.w_bx)).toFixed(2);
                boxobject.h_px = (390/parseFloat(boxobject.h_bx)).toFixed(2);
                boxobject.d_px = Math.hypot(boxobject.w_px,boxobject.h_px).toFixed(2);
            }else{
                var data = new Object();
                if((bbox[3]-bbox[1]) < (bbox[2]-bbox[0])){
                    data.width = ((bbox[3]-bbox[1])*100).toFixed(2);
                    data.height = ((bbox[2]-bbox[0])*100).toFixed(2);
                }else{
                    data.width = ((bbox[3]-bbox[1])*100).toFixed(2);
                    data.height = ((bbox[2]-bbox[0])*100).toFixed(2);
                }
                data.diagonal =Math.hypot(data.width,data.height).toFixed(2);
                //console.log(data.width, data.height, (data.diagonal));
                if(max_diagonal == -1){
                    max_diagonal = data.diagonal;
  
                }else if(max_diagonal<data.diagonal){
                    max_diagonal = data.diagonal;
                }
                if(min_diagonal == -1){
                    min_diagonal = data.diagonal;
  
                }else if(min_diagonal>data.diagonal){
                    min_diagonal = data.diagonal;
                }
            }
            if(cls==2){
                boxobject[idxx] = data;
                avr_diagonal+=parseFloat( data.diagonal);
                idxx+=1
            } 
        });
        //console.log(boxobject)
        boxobject.max = max_diagonal;
        boxobject.min = min_diagonal;
        boxobject.num = idxx;
        boxobject.avr = (avr_diagonal/idxx).toFixed(2);
        JsonList.push(boxobject)
        idx+=1;
    });
    //console.log(JsonList)
    //jsonData = JSON.stringify(JsonList,null,2);
    //console.log(JsonList[2])
    //console.log(jsonData)
    //obj = Object.assign({}, JsonList);
    JsonList.forEach(obj=>{
      var n = obj.num;
      for( let i=0;i<n;i++){
          obj[i].width =(obj[i].width *  obj.w_px/10).toFixed(2);
          obj[i].height = (obj[i].height * obj.h_px/10).toFixed(2);
          obj[i].diagonal =(obj[i].diagonal* obj.d_px/10).toFixed(2);
          
      }
      //console.log(obj[0])
      obj.max = (obj.max*obj.d_px/10).toFixed(2);
      obj.min = (obj.min*obj.d_px/10).toFixed(2);
      obj.avr = (obj.avr*obj.d_px/10).toFixed(2);
      
  })
    JsonList.reduce(function(target, key, index) {
      target[index] = key;
      return target;
    }, {})
    SetJsonData(JsonList)
  },[Data])
  
  function check(){
    console.log(JsonList,JsonData)
  }

  const Loading = () => {
    const result=[];
    result.push(
      <StyledLi key={0}>
        <div>{ImgNum}번 사진</div>
      </StyledLi>

    )
    if(ImgNum!=0){
      result.push(<StyledLi key={1}>
        <div>상추잎 수량: {JsonData[ImgNum-1].num}개</div>

      </StyledLi>)
      if(JsonData[ImgNum-1].num !=0 ){

        for (let i = 0; i < dataname.length; i++) {
          result.push(<StyledLi key={i+1}>
            <div>{showdata[i]}: {JsonData[ImgNum-1][dataname[i]]}cm</div>           
          </StyledLi>
          )
        }
      }
      
    }
    
    return result;
  };
  return (
    <Wrapper onClick={check}>
      <InfoWrapper>
        
      <StyledUl>
        {Loading()}
      </StyledUl>
      </InfoWrapper>
    </Wrapper>
  );
});

export default Info;
