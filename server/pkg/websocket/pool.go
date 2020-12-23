package websocket

import (
	"database/sql"
	"encoding/json"
	"log"
	"time"

	_ "github.com/lib/pq" //This package is used with the database/sql in order to work with PostgreSQL database
)

//Pool type
type Pool struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan Message
}

type messageData struct {
	Sender   string `json:"sender"`
	Receiver string `json:"receiver"`
	Sts      string `json:"sts"`
	Body     string `json:"body"`
}

//NewPool create pool function
func NewPool() *Pool {
	log.Println("Creating new pool")
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
	}
}

//Start starts the created pool
func (pool *Pool) Start(db *sql.DB) {

	sqlStatement := `INSERT INTO messages(id, message, created_at, updated_at, user_id, conversation_id, sts, message_type) VALUES(uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7)`
	sqlQuery := `SELECT ID FROM USERS WHERE NAME = $1`
	var ID int

	for {
		select {
		case client := <-pool.Register:
			pool.Clients[client] = true
			log.Printf("Size of Connection Pool: %d", len(pool.Clients))
			for client := range pool.Clients {
				client.Conn.WriteJSON(Message{Type: 1, Body: "New user connected"})
			}
			break
		case client := <-pool.Unregister:
			delete(pool.Clients, client)
			log.Printf("Size of Connection Pool: %d", len(pool.Clients))
			for client := range pool.Clients {
				client.Conn.WriteJSON(Message{Type: 1, Body: "An user has disconnected"})
			}
			break
		case message := <-pool.Broadcast:
			log.Println("Sending message to client")
			for client := range pool.Clients {
				if err := client.Conn.WriteJSON(message); err != nil {
					log.Println(err)
					return
				}
				var data messageData

				err := json.Unmarshal(message.Data, &data)

				if err != nil {
					log.Printf("Error unmarshak message body: %s", err)
					return
				}

				res, err := db.Query(sqlQuery, data.Sender)

				if err != nil {
					log.Printf("Error querying user after sending message: %s", err)
				}
				for res.Next() {
					res.Scan(&ID)
				}
				log.Println(ID)
				_, err = db.Exec(sqlStatement, data.Body, time.Now(), time.Now(), ID, "123e4567-e89b-12d3-a456-426614174000", "READED", message.Type)

				if err != nil {
					log.Printf("Error inserting user after sending message: %s", err)
				}
			}
		}
	}
}
