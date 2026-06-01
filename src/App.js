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
import About from "./pages/about";
import Splash from "./pages/splash";




function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Splash />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/about" element={<About />} />
                <Route path="/splash" element={<Splash />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/library" element={<Library />} />
            </Routes>
          
        </Router>
    );
}

export default App;