import { useState, useEffect } from "react";
import "../app/styles/card.css";
import LibraryGame from "../app/components/LibraryGame";
import Navigation from "../app/components/Navigation";

function Library() {
  return (
    <main className="main">
      <Navigation />
      <div className="site-container">
        <LibraryGame />
      </div>
    </main>
  );
}

export default Library;
