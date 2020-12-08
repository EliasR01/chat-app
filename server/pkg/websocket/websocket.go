package websocket

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

//Init websocket function
func Init(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	conn, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Fatal(err)
	}

	for {
		messageType, p, err := conn.ReadMessage()

		if err != nil {
			log.Fatal(err)
		}
		log.Println(p)
		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Fatal(err)
		}
	}

}
