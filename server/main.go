package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/EliasR01/chat-app/go-server/pkg/auth"
	"github.com/EliasR01/chat-app/go-server/pkg/register"
	"github.com/EliasR01/chat-app/go-server/pkg/websocket"
	"github.com/go-redis/redis/v7"
	_ "github.com/lib/pq"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "postgres"
	dbname   = "hellochat"
)

var db *sql.DB
var err error
var client *redis.Client

func main() {

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+"password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	db, err = sql.Open("postgres", psqlInfo)
	// initRedis()

	if err != nil {
		log.Fatalf("Error opening database: %s", err)
	}
	err = db.Ping()

	if err != nil {
		log.Fatalf("Error stablishing connection to the database: %s", err)
	}

	defer db.Close()

	http.HandleFunc("/ws", websocketHandler)
	http.HandleFunc("/auth", authHandler)
	http.HandleFunc("/register", registerHandler)
	log.Fatal(http.ListenAndServe(":4000", nil))
}

// func initRedis() {
// 	dsn := os.Getenv("REDIS_DSN")

// 	if len(dsn) == 0 {
// 		dsn = "localhost:6379"
// 	}

// 	client = redis.NewClient(&redis.Options{
// 		Addr: dsn,
// 	})
// 	_, err := client.Ping().Result()

// 	if err != nil {
// 		log.Fatal(err)
// 	}
// }

func websocketHandler(w http.ResponseWriter, r *http.Request) {
	websocket.Init(w, r)
}

func authHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8000")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "content-type")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	var data []string
	for _, v := range r.URL.Query() {
		data = append(data, v[0])
	}
	auth.ValidateUser(data[0], data[1], db, w, r)

}

func registerHandler(w http.ResponseWriter, r *http.Request) {
	var data register.UserData

	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8000")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "content-type")

	switch r.Method {
	case "POST":
		err = json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			w.Write([]byte("Error decoding the response body"))
			log.Printf("Decoding error... %s", err)
		} else {
			register.User(data, db, w)
		}
	}

}
