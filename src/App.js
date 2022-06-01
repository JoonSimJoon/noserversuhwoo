
import Article from "./Components/Article/Article";
import Settings from "./Components/Settings/Settings";
import { HashRouter, Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import {UrlContext} from "./Context/UrlContext"
import {DataContext} from "./Context/DataContect"

function App(props) {
  const [ UrlData, SetUrlData ] = useState("")
  const [Data,SetData] = useState({num: 0 , jsondata:[]})
  return (
    <DataContext.Provider value={{Data, SetData}}>
     <UrlContext.Provider value={{UrlData , SetUrlData}}>
        <HashRouter>
              <Routes>
                <Route path = "/" element= {
                <Article/>
                } />
                <Route exact path="/settings" element={<Settings/>} />
              </Routes>
          
        </HashRouter>   
      </UrlContext.Provider>
      </DataContext.Provider>

    
  );
}

export default App;
