import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Quiz from "./pages/quiz";
import Settings from "./pages/settings";




function App() {
    return (
        <Router>
         
            {/*Implementing Routes for respective Path */}
            <Routes>
                <Route path="/" element={<Quiz />} />

                <Route path="/settings" element={<Settings />} />
            </Routes>
        </Router>
    );
}

export default App;