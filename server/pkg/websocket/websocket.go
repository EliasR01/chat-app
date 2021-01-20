package websocket

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

//Init websocket function
func Init(pool *Pool, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print(err)
	}

	var data []string
	for _, v := range r.URL.Query() {
		data = append(data, v[0])
	}

	poolClient := &PoolClient{
		Conn: conn,
		Pool: pool,
	}

	clientData := &ClientData{
		Client: poolClient,
		User:   data[0],
	}

	pool.Register <- clientData
	clientData.Read()

}
