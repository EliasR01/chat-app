package register

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	_ "github.com/lib/pq" //This is postgreSQL driver, combined with the database/sql
	"golang.org/x/crypto/bcrypt"
)

//UserData user type
type UserData struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Address  string `json:"address"`
	Phone    string `json:"phone"`
	Username string `json:"username"`
}

//User function to create a new user
func User(data UserData, db *sql.DB, w http.ResponseWriter) {
	sqlStatement := `INSERT INTO users(name, email, password, created_at, address, phone, username) VALUES ($1, $2, $3, $4, $5, $6, $7)`
	sqlQuery := `SELECT * FROM users WHERE name = $1 OR email = $2`

	res, err := db.Query(sqlQuery, data.Name, data.Email)

	if err != nil {
		log.Printf("Error querying the user: %s", err)
	}

	if res.Next() {
		w.WriteHeader(http.StatusNonAuthoritativeInfo)
		w.Write([]byte("User already exists!"))
	} else {

		bytes, err := bcrypt.GenerateFromPassword([]byte(data.Password), 14)

		if err != nil {
			w.WriteHeader(http.StatusNonAuthoritativeInfo)
			w.Write([]byte("Error encrypting password"))
			log.Printf("Error encrypting password: %s", err)
		}

		encryptedPassword := string(bytes)
		response, err := db.Exec(sqlStatement, data.Name, data.Email, encryptedPassword, time.Now(), data.Address, data.Phone, data.Username)

		if err != nil {
			w.WriteHeader(http.StatusConflict)
			w.Write([]byte("Error inserting the new user in database"))
			log.Printf("Error inserting user: %s", err)
		}

		rows, err := response.RowsAffected()

		if err != nil {
			w.WriteHeader(http.StatusConflict)
			w.Write([]byte("There was an error inserting the user in the database"))
			log.Printf("Error counting rows: %s", err)
		}

		if rows == 0 {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("No user was inserted"))
			log.Printf("No user inserted. User: %s", data.Name)
		}

		u := map[string]interface{}{}
		u["name"] = data.Name
		u["email"] = data.Email

		b, err := json.Marshal(u)

		w.Write([]byte(b))
	}
}
