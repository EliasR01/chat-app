package websocket

import (
	"log"

	"github.com/gorilla/websocket"
)

//Client type
type Client struct {
	Conn *websocket.Conn
	Pool *Pool
	User string
}

//Message type
type Message struct {
	Type int    `json:"type"`
	Body string `json:"body"`
	Data []byte `json:"data"`
}

//User Type
type User struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	CreatedAt string `json:"created_at"`
	ID        int    `json:"id"`
	Address   string `json:"address"`
	Phone     string `json:"phone"`
	Username  string `json:"username"`
}

//React client function
func (c *Client) Read() {

	defer func() {
		c.Pool.Unregister <- c
		err := c.Conn.Close()

		if err != nil {
			log.Printf("Error closing connection: %s", err)
		}

	}()

	for {
		messageType, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Printf("Error: %s", err)
			return
		}

		message := Message{Type: messageType, Body: string(p), Data: p}
		c.Pool.Broadcast <- message
	}
}
