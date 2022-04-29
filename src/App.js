
import Article from "./Components/Article/Article";
import Settings from "./Components/Settings/Settings";
import { HashRouter, Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import {UrlContext} from "./Context/UrlContext"


function App(props) {
  const [ UrlData, SetUrlData ] = useState("")
  return (
     <UrlContext.Provider value={{UrlData , SetUrlData}}>
        <HashRouter>
              <Routes>
                <Route path = "/" element= {<Article/>} />
                <Route exact path="/settings" element={<Settings/>} />
              </Routes>
          
        </HashRouter>   
      </UrlContext.Provider>

    
  );
}

export default App;
