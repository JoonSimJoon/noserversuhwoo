import React,{useEffect, useState } from "react";
import styled from "styled-components";
import Infofile from "../../json/Info.json"

const Wrapper = styled.div`
  width : 100%;
  height: 360px;
`;

const InfoWrapper = styled.div`
  padding: 20px;
`;

const StyledUl = styled.ul`
  

`;

const StyledLi = styled.li`
  font-size: 1.4em;

`;

function Info(props) {
  const [ImgNum, SetImgNum] = useState(props.ImgNum)
  const [Data,SetData]= useState(props.Data);
  const data = ["작물 종류", "상추잎 수량", "최대 크기", 
  "최소 크기", "평균 크기", "추수 여부"];
  
  useEffect(()=>{
    SetData(props.Data);
  },[props.Data])
  useEffect(()=>{
    SetImgNum(props.ImgNum);
    console.log(Data,ImgNum)
  },[props.ImgNum])

  function check(){
    console.log(Data,ImgNum)
    
  }

  const Loading = () => {
    const result=[];
    result.push(
      <StyledLi key={0}>
        <div>{ImgNum}</div>
      </StyledLi>

    )
    for (let i = 0; i < data.length; i++) {
        result.push(<StyledLi key={i+1}>
          <div>{Infofile[data[i]]}</div>           
        </StyledLi>
        )
    }
    return result;
  };
  return (
    <Wrapper>
      <InfoWrapper>
        
      <StyledUl>
        {Loading()}
      </StyledUl>
      </InfoWrapper>
    </Wrapper>
  );
}

export default Info;
