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
	Type           int       `json:"type"`
	Sender         string    `json:"sender"`
	Receiver       string    `json:"receiver"`
	Sts            string    `json:"sts"`
	Body           string    `json:"body"`
	ConversationID string    `json:"conversationId"`
	MessageID      string    `json:"id"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
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
	sqlUpdate := `UPDATE conversation SET last_message = $1 WHERE id = $2`
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
			var dataKey string
			var data map[string]messageData
			err := json.Unmarshal(message.Data, &data)
			var messageInfo messageData
			var messageInfoMap = make(map[string]messageData)

			for v := range data {
				dataKey = v
			}

			if err != nil {
				log.Printf("Error querying user after sending message: %s", err)
				break
			}
			messageInfo.Body = data[dataKey].Body
			messageInfo.Type = message.Type
			messageInfo.CreatedAt = time.Now()
			messageInfo.UpdatedAt = time.Now()
			messageInfo.Sender = data[dataKey].Sender
			messageInfo.Receiver = data[dataKey].Receiver
			messageInfo.Sts = data[dataKey].Sts
			messageInfo.ConversationID = data[dataKey].ConversationID

			var messageID string

			err = db.QueryRow(sqlStatement, data[dataKey].Body, time.Now(), time.Now(), data[dataKey].Sender, data[dataKey].ConversationID, "READED", message.Type).Scan(&messageID)

			if err != nil {
				log.Printf("Error inserting user after sending message: %s", err)
				break
			}

			_, err = db.Exec(sqlUpdate, messageID, data[dataKey].ConversationID)

			if err != nil {
				log.Printf("Error updating conversation's last_message: %s", err)
				break
			}
			messageInfoMap[messageID] = messageInfo
			messageDataBody, err := json.Marshal(messageInfoMap)
			if err != nil {
				log.Printf("Error unmarshal or marshalling message data: %s", err)
			}

			if err := pool.Clients[messageInfo.Sender].Conn.WriteMessage(message.Type, messageDataBody); err != nil {
				log.Printf("Error sending message to client sender: %s", err)
			}

			if pool.Clients[messageInfo.Receiver] != nil {
				if err := pool.Clients[messageInfo.Receiver].Conn.WriteMessage(message.Type, messageDataBody); err != nil {
					log.Printf("Error sending message to client receiver: %s", err)
				}
			}

		}
	}
}
