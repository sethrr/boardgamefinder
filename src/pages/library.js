import { useState, useEffect } from "react";
import "../app/styles/card.css";
import LibraryGame from "../app/components/LibraryGame";
import Navigation from "../app/components/Navigation";
import EventCallout from "../app/components/eventCallout";

function Library() {
  return (
    <main className="main">
      <Navigation />
            <EventCallout />
      <div className="site-container">
        <LibraryGame />
      </div>
    </main>
  );
}

export default Library;
