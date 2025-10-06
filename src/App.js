import { BrowserRouter as Router, Routes, Route,Link, BrowserRouter } from "react-router-dom";
import Click from "./Click";
import LakshmiInfo from "./LakshmiInfo";

function App() {
  return (
    <BrowserRouter>
   
      <nav>
        
      </nav>
      <Routes>
        <Route path="/" element={<Click />} />
        <Route path="/lakshmi-info" element={<LakshmiInfo />} />
      </Routes>
    
    </BrowserRouter>
  );
}

export default App;
