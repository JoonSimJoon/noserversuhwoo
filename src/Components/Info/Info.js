import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Infofile from "../../json/Info.json"

const Wrapper = styled.div`
  width : 100%;
  height: 360px;
  border-radius: 0.25rem;
  border: 2px solid black;
`;

const InfoWrapper = styled.div`
  padding: 20px;
`;

const StyledUl = styled.ul`
  

`;

const StyledLi = styled.li`
  font-size: 1.4em;

`;

function List(props){
  const [InfoData, SetInfoData]  = useState(null);
  const data = ["작물 종류", "재배 시작", "깻잎 수량", "최대 크기", 
    "최소 크기", "평균 크기", "추수 여부"];
  useEffect(() =>  {
    console.log(Infofile)
  }, [])


  //console.log(InfoData && InfoData[2])
  const Loading = () => {
    const result=[];
    for (let i = 0; i < data.length; i++) {
         result.push(<StyledLi key={i+1}>
          <div>{Infofile[data[i]]}</div>
        </StyledLi>)
    }
    return result;
  };
  return(
    <StyledUl>
      {Loading()}
    </StyledUl>
  )
}


function Info() {
  return (
    <Wrapper>
      <InfoWrapper>
        <List></List>
      </InfoWrapper>
    </Wrapper>
  );
}

export default Info;
