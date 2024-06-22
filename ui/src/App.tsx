import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { Home } from "./pages/Home/Home";
import MoreInfo from "./pages/MoreInfo/MoreInfo";

const App = () => {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<MoreInfo />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
