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
	Register   chan *ClientData
	Unregister chan *ClientData
	Clients    map[string]*PoolClient
	Broadcast  chan Message
}

type messageData struct {
	Type           int    `json:"type"`
	Sender         string `json:"sender"`
	Receiver       string `json:"receiver"`
	Sts            string `json:"sts"`
	Body           string `json:"body"`
	ConversationID string `json:"conversationId"`
	MessageID      string `json:"id"`
}

//NewPool create pool function
func NewPool() *Pool {
	return &Pool{
		Register:   make(chan *ClientData),
		Unregister: make(chan *ClientData),
		Clients:    make(map[string]*PoolClient),
		Broadcast:  make(chan Message),
	}
}

//Start starts the created pool
func (pool *Pool) Start(db *sql.DB) {

	sqlStatement := `INSERT INTO messages(id, message, created_at, updated_at, sender, conversation_id, sts, message_type) VALUES(uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7) RETURNING id`

	for {
		select {
		case client := <-pool.Register:
			pool.Clients[client.User] = client.Client
			log.Printf("Size of Connection Pool: %d", len(pool.Clients))
			client.Client.Conn.WriteJSON(Message{Type: 0, Body: "New user connected"})
			break
		case client := <-pool.Unregister:
			delete(pool.Clients, client.User)
			log.Printf("Size of Connection Pool: %d", len(pool.Clients))
			break
		case message := <-pool.Broadcast:
			var data messageData
			err := json.Unmarshal(message.Data, &data)

			if err != nil {
				log.Printf("Error querying user after sending message: %s", err)
				break
			}
			err = db.QueryRow(sqlStatement, data.Body, time.Now(), time.Now(), data.Sender, "123e4567-e89b-12d3-a456-426614174000", "READED", message.Type).Scan(&data.MessageID)

			if err != nil {
				log.Printf("Error inserting user after sending message: %s", err)
				break
			}

			data.ConversationID = "123e4567-e89b-12d3-a456-426614174000"

			if err != nil {
				log.Printf("Error retrieving last inserted id of message: %s", err)
				break
			}

			messageDataBody, err := json.Marshal(data)
			if err != nil {
				log.Printf("Error unmarshal or marshalling message data: %s", err)
			}

			if err := pool.Clients[data.Sender].Conn.WriteMessage(message.Type, messageDataBody); err != nil {
				log.Printf("Error sending message to client sender: %s", err)
			}

			if pool.Clients[data.Receiver] != nil {
				if err := pool.Clients[data.Receiver].Conn.WriteMessage(message.Type, messageDataBody); err != nil {
					log.Printf("Error sending message to client receiver: %s", err)
				}
			}

		}
	}
}
