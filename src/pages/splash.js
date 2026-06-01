import React from "react";
import "../app/styles/splash.css";
import Navigation from "../app/components/Navigation";
import EventCallout from "../app/components/eventCallout";

const Splash = () => {
  return (
    <main className="main">
      <Navigation />
      <EventCallout />
      <div
        className="site-container-bg"
        style={{
          backgroundImage:
            "url('https://images.squarespace-cdn.com/content/v1/5a2af6428c56a8d78df97ef4/1519073875402-DNNDY6NZDX6YXR860MBR/IMG_5961.jpg')"
        }}
      >
        <div className="site-container">
          <div className="site-container-inner">
            <div className="qrc_page_inner">
              <div className="section qrc_profile_5">
                <div className="qrc_profile_inner">
                  <div className="qrc_profile_inner_info">
                    <h2>East Atlanta Village Board Games &amp; Beer</h2>
                    <p>
                      Hosting monthly, community game nights for board game
                      enthusiasts in Atlanta. Held the last Wednesday of the
                      month from 6p-11p in East Atlanta Village.
                    </p>
                    <p>
                      <strong>
                        Come to Teach. Come to Learn. Come to Play.
                      </strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="section qrc_social_links">
                <ul className="qrc_social_links_list">
                  <li className="qr_cc_card">
                    <a
                      rel="nofollow noopener noreferrer"
                      href="https://discord.gg/Hsc9GNJHNu"
                      target="_blank"
                    >
                      <div
                        className="qrc_social_icon"
                        style={{
                          backgroundImage:
                            "url('https://cdn0030.qrcodechimp.com/qr/PROD/685db57e1f8ada079904e5e5/fm/discord_logo.png?v=1750974820087')"
                        }}
                      ></div>
                      <div className="qrc_social_text">
                        <div className="qrc_social_text_heading">Discord</div>
                        <div className="qrc_social_text_discription">
                          Connect with the group for game chat and discussion.
                        </div>
                      </div>
                      <div className="qrc_social_action">
                        <span className="icon-right_arrow"></span>
                      </div>
                    </a>
                  </li>

                  <li className="qr_cc_card">
                    <a
                      rel="nofollow noopener noreferrer"
                      href="https://www.instagram.com/eavboardgames/"
                      target="_blank"
                    >
                      <div
                        className="qrc_social_icon"
                        style={{
                          backgroundImage:
                            "url('https://cdn0030.qrcodechimp.com/qr/PROD/685db57e1f8ada079904e5e5/fm/insta_logo.png?v=1750975270747')"
                        }}
                      ></div>
                      <div className="qrc_social_text">
                        <div className="qrc_social_text_heading">Instagram</div>
                        <div className="qrc_social_text_discription">
                          Social posts, photos, the latest event updates and
                          more.
                        </div>
                      </div>
                      <div className="qrc_social_action">
                        <span className="icon-right_arrow"></span>
                      </div>
                    </a>
                  </li>

                  <li className="qr_cc_card">
                    <a
                      rel="nofollow noopener noreferrer"
                      href="https://eavboardgames.com/quiz"
                    
                    >
                      <div
                        className="qrc_social_icon"
                        style={{
                          backgroundImage:
                            "url('https://cdn0030.qrcodechimp.com/qr/PROD/685db57e1f8ada079904e5e5/fm/game_finder_3.png?v=1750976647836')"
                        }}
                      ></div>
                      <div className="qrc_social_text">
                        <div className="qrc_social_text_heading">
                          Game Finder
                        </div>
                        <div className="qrc_social_text_discription">
                          Unsure what to play? Let us recommend the perfect
                          game.
                        </div>
                      </div>
                      <div className="qrc_social_action">
                        <span className="icon-right_arrow"></span>
                      </div>
                    </a>
                  </li>

                  <li className="qr_cc_card">
                    <a
                      rel="nofollow noopener noreferrer"
                      href="https://eavboardgames.com/library"
                    
                    >
                      <div
                        className="qrc_social_icon"
                        style={{
                          backgroundImage:
                            "url('https://cdn0030.qrcodechimp.com/qr/PROD/685db57e1f8ada079904e5e5/fm/game_library_4.png?v=1750976879381')"
                        }}
                      ></div>
                      <div className="qrc_social_text">
                        <div className="qrc_social_text_heading">
                          Game Library
                        </div>
                        <div className="qrc_social_text_discription">
                          Peruse our library of games.
                        </div>
                      </div>
                      <div className="qrc_social_action">
                        <span className="icon-right_arrow"></span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Splash;
