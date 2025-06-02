import { useState, useEffect } from "react";
import "../styles/card.css";
import GameFetcher from "./GameFetcher";

function GameFinder() {
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Load the games data from the public directory (or a local file)
  useEffect(() => {
   getVisibleGames();
  }, []);

  const getVisibleGames = async () => {
  try {
    const response = await fetch('/api/visible-games')
    const data = await response.json()
    
    if (response.ok) {
       setGames(data.games);
       console.log('Games loaded:', data.games);
      return; 
    } else {
      console.error('API Error:', data.error)
      return []
    }
  } catch (error) {
    console.error('Network error:', error)
    return []
  }
}
  // Function to request recommendations from OpenAI API
  const getRecommendations = async () => {
   if (games.length === 0) return;

    // Define the prompt for OpenAI
    const prompt = `Here is a list of board games: ${JSON.stringify(games)}. 
          I want to play a game from the list that has a minimum player count of ${
            playerCount || "any"
          }, a maximum play time of ${
      timeLength || "any"
    } and a maximum complexity of ${complexity || "any"}. The type of game I am looking for is ${genre}
          What should I play next? Please recommend up to 3 games with their respective IDs only. No other text, just the IDs in a comma separated list.`;

    try {
      // Call OpenAI API
      setLoading(true);
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4.1-nano",
            messages: [
              {
                role: "system",
                content: "You are a helpful board game recommender."
              },
              { role: "user", content: prompt }
            ]
          })
        }
      );

      const data = await response.json();

      setLoading(false)
      // Extract recommendations from the OpenAI response
      setRecommendations(data.choices[0].message.content);
      } catch (error) {
        setLoading(false)
        console.error("Error making API request:", error);
        } 
   setIsSubmitted(true);
  };

  const questions = [
    {
      id: 1,
      text: "How many players in your group?",
      options: [
        { display: "2 players", value: "2" },
        { display: "3 players", value: "3" },
        { display: "4 players", value: "4" },
        { display: "5 players", value: "5" },
        { display: "6+ players", value: "6" }
      ],
       type: 'single'
    },
    {
      id: 2,
      text: "How long would you like this game to be?",
      options: [
        { display: "Under 15min", value: "15min" },
        { display: "~30min", value: "30min" },
        { display: "~1 hour", value: "60min" },
        { display: "Under 2 hours", value: "120min" },
        { display: "I'll play till I'm done, ok? ", value: "1000min" }
      ],
       type: 'single'
    },
    {
      id: 3,
      text: "How complex should this game be?",
      options: [
        { display: "Simple", value: "1.5" },
        { display: "Slightly complex", value: "2.25" },
        { display: "Medium complexity", value: "3" },
        { display: "Complex af", value: "4.5" },
        { display: "No preference, surprise me", value: "5" }
      ],
       type: 'single'
    },
    {
      id: 4,
      text: "What type of game are you looking for? Select any/all that apply",
      options: [
        { display: "🔎 Social Deduction", value: "social deduction" },
        { display: "🎉 Party Game", value: "party game" },
        { display: "👯 Cooperative", value: "cooperative" },
        { display: "🤔 Thinky / Strategy", value: "strategy" },
        { display: "🍀 Push Your Luck", value: "luck" },
        { display: "🚂 Engine Builder", value: "engine building" },
        { display: "🧑‍🌾 Worker Placement", value: "worker placement" },
        { display: "🃏 Trick Taking", value: "trick taking" }
      ],
       type: 'multi'
    }
  ];

  // Individual state for each question
  const [playerCount, setPlayerCount] = useState(null);
  const [timeLength, setTimeLength] = useState(null);
  const [complexity, setComplexity] = useState(null);
  const [genre, setGenre] = useState([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Map question IDs to their respective state setters
  const answerSetters = {
    1: setPlayerCount,
    2: setTimeLength,
    3: setComplexity,
    4: setGenre
  };
  
  // Map question IDs to their current values
  const answerValues = {
    1: playerCount,
    2: timeLength,
    3: complexity,
    4: genre
  };

  const handleOptionSelect = (questionId, value, questionType) => {
    if (questionType === 'single') {
      answerSetters[questionId](value);
    } else {
      // For multi-select questions
      setGenre(prev => {
        if (prev.includes(value)) {
          // Remove if already selected
          return prev.filter(item => item !== value);
        } else {
          // Add if not selected
          return [...prev, value];
        }
      });
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };


  // Check if all questions have been answered
    // Check if all single-select questions have been answered
    const allSingleSelectAnswered = playerCount && timeLength && complexity;
    // Multi-select question can be empty or have selections
    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const currentAnswer = answerValues[currentQuestion.id];


  return (
 
      <div className="finder-container">
        {!isSubmitted ? (
          <>
            <div className="question-slide">
              <h2>{currentQuestion.text}</h2>
              <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${
                currentQuestion.type === 'single'
                  ? currentAnswer === option.value
                    ? 'selected'
                    : ''
                  : genre.includes(option.value)
                    ? 'selected'
                    : ''
              }`}
              onClick={() => handleOptionSelect(
                currentQuestion.id, 
                option.value,
                currentQuestion.type
              )}
            >
              {option.display}
       
            </button>
          ))}
        </div>
              <div className="navigation-buttons">
                {currentQuestionIndex > 0 && (
                  <button onClick={goToPrev} className="nav-button prev-button">
                    Previous
                  </button>
                )}

                {!isLastQuestion ? (
                  <button
                    onClick={goToNext}
                    className="nav-button next-button"
                    disabled={currentQuestion.type === 'single' && !currentAnswer}
                  >
                    Next
                  </button>
                ) : (
                  <button
                  onClick={getRecommendations}
                    disabled={loading || !allSingleSelectAnswered}
                    className="nav-button submit-button"
                  >
                    {loading ? "Generating..." : "Recommend A Game!"}
                  </button>
                )}
              </div>
              <div className="progress-indicator">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>{" "}
            </div>{" "}
          </>
        ) : (
          <>
            <div className="question-slide">
              <div className="textarea-container">
              <GameFetcher gameIds={[recommendations]} />

             
              </div>
            </div>
          </>
        )}
      </div>
 
  );
}

export default GameFinder;
