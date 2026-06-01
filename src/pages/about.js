import "../app/styles/card.css";
import Navigation from "../app/components/Navigation";
import EventCallout from "../app/components/eventCallout";
import InstagramEmbed from "../app/components/instagramFeed";

function About() {
  return (
    <main className="main">
      <Navigation />
      <EventCallout />
      <div className="site-container">
        <InstagramEmbed />
      </div>
    </main>
  );
}

export default About;
