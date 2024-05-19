import { useState } from "react";
import "./App.css";
import cardsData from "./data/cards.json";
import { shuffleCards } from "./utils/shuffle";
import Multiselect from "multiselect-react-dropdown";

export type Card = {
  name: string;
  image: string;
};

type MessageType = "success" | "error";

function App() {
  const [cardCount, setCardCount] = useState(52);
  const [timer, setTimer] = useState(60);
  const [cards, setCards] = useState<Card[]>([]);
  const [showCards, setShowCards] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [selectedCards, setSelectedCards] = useState<{ name: string }[]>([]);
  const [message, setMessage] = useState<{ value: string; type: MessageType }>({
    value: "",
    type: "success",
  });

  const startGame = () => {
    resetGame();
    setShowCards(true);
    setCards(shuffleCards(cardsData.slice(0, cardCount)));
    setTimeout(() => {
      setShowCards(false);
      setShowSelect(true);
    }, timer * 1000);
  };

  const resetGame = () => {
    setCardCount(52);
    setTimer(60);
    setCards([]);
    setShowCards(false);
    setShowSelect(false);
    setSelectedCards([]);
    setMessage({ value: "", type: "success" });
  };

  const handleSubmit = () => {
    const selectedCardNames = selectedCards.map((card) => card.name);
    const shownCardNames = cards.map((card) => card.name);

    if (JSON.stringify(selectedCardNames) === JSON.stringify(shownCardNames)) {
      setMessage({ value: "Correct!", type: "success" });
    } else {
      setMessage({ value: "Incorrect!", type: "error" });
    }

    setShowSelect(false);
  };

  return (
    <div className="container">
      <h1 className="header">CardRecall</h1>
      <div className="inputs">
        <div className="input-container">
          <label htmlFor="count">Card Count {cardCount} (1-52)</label>
          <input
            type="number"
            id="count"
            name="count"
            value={cardCount}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value <= 52 && value > 0) {
                setCardCount(value);
              }
            }}
            disabled={showCards || showSelect}
          />
        </div>
        <div className="input-container">
          <label htmlFor="timer">Timer {timer} seconds (1-120)</label>
          <input
            type="number"
            id="timer"
            name="timer"
            value={timer}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value <= 120 && value >= 1) {
                setTimer(value);
              }
            }}
            disabled={showCards || showSelect}
          />
        </div>
      </div>
      <div className="button-container">
        <button
          disabled={showCards || showSelect}
          type="button"
          className="button"
          onClick={startGame}
        >
          Start
        </button>
        <button type="button" className="reset-button" onClick={resetGame}>
          Reset
        </button>
      </div>
      {showCards && (
        <div className="cards">
          {cards.map((card, index) => (
            <div className="card" key={index}>
              <h2>{card.name}</h2>
              <img src={card.image} alt={card.name} />
            </div>
          ))}
        </div>
      )}
      {showSelect && (
        <div className="select-container">
          <Multiselect
            options={cardsData}
            selectedValues={selectedCards}
            onSelect={(value) => {
              setSelectedCards(value);
            }}
            onRemove={(value) => {
              setSelectedCards(value);
            }}
            displayValue="name"
          />
          <button
            type="button"
            className="submit-button"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      )}
      <h2 className={"message-" + message.type}>{message.value}</h2>
    </div>
  );
}

export default App;
