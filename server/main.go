package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/EliasR01/chat-app/go-server/pkg/auth"
	"github.com/EliasR01/chat-app/go-server/pkg/chat"
	"github.com/EliasR01/chat-app/go-server/pkg/register"
	"github.com/EliasR01/chat-app/go-server/pkg/user"
	"github.com/EliasR01/chat-app/go-server/pkg/websocket"
	_ "github.com/lib/pq"
)

const (
	host     = "localhost"
	port     = 5432
	login    = "postgres"
	password = "gh327688"
	dbname   = "hellochat"
)

var db *sql.DB
var err error

func main() {
	mux := http.NewServeMux()
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+"password=%s dbname=%s sslmode=disable", host, port, login, password, dbname)

	db, err = sql.Open("postgres", psqlInfo)

	if err != nil {
		log.Fatalf("Error opening database: %s", err)
	}
	err = db.Ping()

	if err != nil {
		log.Fatalf("Error stablishing connection to the database: %s", err)
	}
	os.Setenv("ACCESS_SECRET", "s0m3s4p3rsawdas56456cr3tt0k3n6564s")

	defer db.Close()

	pool := websocket.NewPool()
	go pool.Start(db)

	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8000")

		websocket.Init(pool, w, r)
	})

	mux.HandleFunc("/auth", authHandler)
	mux.HandleFunc("/register", registerHandler)
	mux.HandleFunc("/user", chatHandler)
	mux.HandleFunc("/logout", logoutHandler)
	mux.HandleFunc("/update", userHandler)
	mux.HandleFunc("/delete", userHandler)

	server := http.Server{Addr: ":4000", Handler: mux}
	log.Println("Server started on port 4000")
	err := server.ListenAndServe()
	if err != nil {
		log.Fatalf("Error initializing server: %s", err)
	}
}

func logoutHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8000")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "content-type")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	auth.Logout(w, r)
}

func chatHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8000")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "content-type")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	var data []string

	for _, v := range r.URL.Query() {
		data = append(data, v[0])
	}
	chat.GetUserInfo(db, w, r, data[0])
}

func authHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8000")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "content-type")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	var data []string
	data = append(data, r.URL.Query().Get("type"))
	data = append(data, r.URL.Query().Get("email"))
	data = append(data, r.URL.Query().Get("password"))
	auth.ValidateUser(data, db, w, r)

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

func userHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8000")
	w.Header().Add("Access-Control-Allow-Methods", "PUT")
	w.Header().Add("Access-Control-Allow-Methods", "DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "content-type")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	if r.Method == http.MethodPut {
		bodyBytes, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Printf("Error: %s", err)
		}
		var body user.Data

		json.Unmarshal(bodyBytes, &body)
		response := user.UpdateUser(body, db, body.CurrUsername)

		if response == 0 {
			w.Write([]byte("User updated successfully!"))
		} else if response == 1 {
			w.WriteHeader(http.StatusConflict)
			w.Write([]byte("There was an error updating the user"))
		} else if response == 2 {
			w.WriteHeader(http.StatusNotAcceptable)
			w.Write([]byte("Password is incorrect"))
		}

	} else if r.Method == http.MethodDelete {
		// data := r.PostForm
	} else {
		w.Write([]byte("Method not allowed!"))
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

}
