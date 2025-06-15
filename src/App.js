import React from "react";
import "../src/app/styles/reset.css";
import "../src/app/styles/index.css";
import "../src/app/styles/card.css";
import {
    BrowserRouter as Router,
    Routes,
    Link,
    Route,
} from "react-router-dom";
import Quiz from "./pages/quiz";
import Settings from "./pages/settings";
import Library from "./pages/library";
import Home from "./pages/home";




function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/library" element={<Library />} />
            </Routes>
          
        </Router>
    );
}

export default App;