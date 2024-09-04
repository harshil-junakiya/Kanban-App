import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import Draggable from 'react-draggable';
import './App.css';

export default function App() {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    let data = window.localStorage.getItem("data");
    if (data) {
      setBoard(JSON.parse(data));
    } else {
      setBoard([
        {
          id: 1,
          title: 'To Do',
          cards: [
            {
              id: 1,
              title: 'Learn React',
              description: 'Learn the fundamentals of React',
            },
            {
              id: 2,
              title: 'Learn Firebase',
              description: 'Learn the fundamentals of Firebase',
            },
          ],
        },
        {
          id: 2,
          title: 'In Progress',
          cards: [
            {
              id: 3,
              title: 'Learn React Native',
              description: 'Learn the fundamentals of React Native',
            },
            {
              id: 4,
              title: 'Learn GraphQL',
              description: 'Learn the fundamentals of GraphQL',
            },
          ],
        },
        {
          id: 3,
          title: 'Completed',
          cards: [
            {
              id: 5,
              title: 'Learn Node.js',
              description: 'Learn the fundamentals of Node.js',
            },
            {
              id: 6,
              title: 'Learn Express',
              description: 'Learn the fundamentals of Express',
            },
          ],
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (board.length > 0) window.localStorage.setItem("data", JSON.stringify(board));
  }, [board]);

  const getColorAndFontStyles = (title) => {
    let backgroundColor, fontColor;

    switch (title) {
      case "To Do":
        backgroundColor = "#e74c3c";
        fontColor = "white";
        break;
      case "In Progress":
        backgroundColor = "#f39c12";
        fontColor = "black";
        break;
      case "Completed":
        backgroundColor = "#2ecc71";
        fontColor = "white";
        break;
      default:
        backgroundColor = "#ecf0f1";
        fontColor = "black";
    }

    return {
      backgroundColor,
      fontColor,
    };
  };

  const handleDeleteCard = (listId, cardId) => {
    const updatedBoard = board.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          cards: list.cards.filter((card) => card.id !== cardId),
        };
      }
      return list;
    });
    setBoard(updatedBoard);
  };

  return (
    <div>
      <Header />
      <div style={styles.boardContainer}>
        {board.map((list) => {
          const { backgroundColor, fontColor } = getColorAndFontStyles(
            list.title
          );
          return (
            <div
              id={`list_${list.id}`}
              key={list.id}
              className="list-container"
              style={{
                ...styles.listContainer,
                backgroundColor,
              }}
            >
              <h2 style={{ color: fontColor }}>{list.title}</h2>
              <button
                className="new-card"
                onClick={() => {
                  let temp_boards = [...board];
                  for (let i = 0; i < temp_boards.length; i++) {
                    if (temp_boards[i].id === list.id) {
                      temp_boards[i].cards.push({
                        id: new Date().getTime(),
                        title: 'New Card',
                        description: 'New Card Description',
                      });
                    }
                  }
                  setBoard(temp_boards);
                }}
                style={{
                  ...styles.newCard,
                }}
              >
                + New Card
              </button>
              {list.cards.map((card) => {
                return (
                  <Draggable
                    key={card.id}
                    onStop={(e) => {
                      let allLists = document.querySelectorAll('.list-container');
                      for (let i = 0; i < allLists.length; i++) {
                        let list = allLists[i];
                        let rect = list.getBoundingClientRect();
                        let data = {
                          x: e.clientX,
                          y: e.clientY,
                        };
                        let flag = false;
                        if (
                          data.x > rect.left &&
                          data.x < rect.right &&
                          data.y > rect.top &&
                          data.y < rect.bottom
                        ) {
                          let final_list_id = list.id.split('_')[1];
                          let final_card_id = card.id;
                          let temp_boards = [...board];
                          for (let boardIndex = 0; boardIndex < temp_boards.length; boardIndex++) {
                            for (let cardIndex = 0; cardIndex < temp_boards[boardIndex].cards.length; cardIndex++) {
                              if (temp_boards[boardIndex].cards[cardIndex].id === final_card_id) {
                                temp_boards[boardIndex].cards.splice(cardIndex, 1);
                              }
                            }
                          }
                          for (let boardIndex = 0; boardIndex < temp_boards.length; boardIndex++) {
                            if (temp_boards[boardIndex].id === parseInt(final_list_id)) {
                              temp_boards[boardIndex].cards.push(card);
                            }
                          }
                          flag = true;
                          setBoard(temp_boards);
                        }
                      }
                    }}
                  >
                    <div style={styles.cardContainer}>
                      <input
                        type={"text"}
                        style={styles.title}
                        value={card.title}
                        onChange={(e) => {
                          let temp_boards = [...board];
                          for (let i = 0; i < temp_boards.length; i++) {
                            for (let j = 0; j < temp_boards[i].cards.length; j++) {
                              if (temp_boards[i].cards[j].id === card.id) {
                                temp_boards[i].cards[j].title = e.target.value;
                              }
                            }
                          }
                          setBoard(temp_boards);
                        }}
                      />
                      <input
                        type={"text"}
                        style={styles.description}
                        value={card.description}
                        onChange={(e) => {
                          let temp_boards = [...board];
                          for (let i = 0; i < temp_boards.length; i++) {
                            for (let j = 0; j < temp_boards[i].cards.length; j++) {
                              if (temp_boards[i].cards[j].id === card.id) {
                                temp_boards[i].cards[j].description = e.target.value;
                              }
                            }
                          }
                          setBoard(temp_boards);
                        }}
                      />
                      <button
                        style={styles.deleteButton}
                        onClick={() => handleDeleteCard(list.id, card.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </Draggable>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  boardContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "100px",
  },
  listContainer: {
    marginTop: "10px",
    borderRadius: "5px",
    padding: "10px",
    width: "30vw",
    minHeight: "100vh",
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
  },
  cardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "5px",
    padding: "10px",
    margin: "10px 0",
    minHeight: "100px",
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    padding: 0,
    margin: 0,
    border: "none",
    fontSize: "20px",
    fontWeight: "bold",
  },
  description: {
    padding: 0,
    margin: 0,
    border: "none",
    fontSize: "15px",
    fontWeight: "bold",
  },
  deleteButton: {
    marginTop: "10px",
    padding: "5px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
  },
  newCard: {
    border: "2px solid white",
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    outline: "none",
    transition: "background-color 0.3s, color 0.3s, border 0.3s",
    backgroundColor: "white",
    color: "black",
  },
  "@media (max-width: 768px)": {
    boardContainer: {
      flexDirection: "column",
      alignItems: "center",
      marginTop: "50px",
    },
    listContainer: {
      width: "80vw",
      margin: "10px auto",
    },
  },
};
