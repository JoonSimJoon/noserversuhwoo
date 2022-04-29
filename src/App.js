
import Article from "./Components/Article/Article";
import Settings from "./Components/Settings/Settings";
import { HashRouter, Route, Routes } from "react-router-dom";
import React from "react";
function App(props) {
  return (
     <>
        <HashRouter>
              <Routes>
                <Route path = "/" element= {<Article/>} />
                <Route exact path="/settings" element={<Settings/>} />
              </Routes>
          
        </HashRouter>   
      </>

    
  );
}

export default App;
