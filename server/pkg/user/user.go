package user

import (
	"database/sql"
	"log"

	"golang.org/x/crypto/bcrypt"
)

//Data user type
type Data struct {
	Name         string `json:"name"`
	Email        string `json:"email"`
	Password     string `json:"password"`
	Address      string `json:"address"`
	Phone        string `json:"phone"`
	Username     string `json:"username"`
	CurrUsername string `json:"currUsername"`
}

//UpdateUser function, updates the user information stored in database
func UpdateUser(data Data, db *sql.DB, username string) int {
	sqlStatement := `UPDATE users SET name = $1, email = $2, address = $3, phone = $4, username = $5 where username = $6`
	sqlQuery := `SELECT password FROM users WHERE username = $1`

	var hashedPassword string
	row := db.QueryRow(sqlQuery, data.Username)
	row.Scan(&hashedPassword)
	hashErr := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(data.Password))

	if hashErr != nil {
		log.Printf("Error comparing password: %s", hashErr)
		return 2
	}

	_, err := db.Exec(sqlStatement, data.Name, data.Email, data.Address, data.Phone, data.Username, username)

	if err != nil {
		log.Printf("Error updating user: %s", err)
		return 1
	}

	return 0
}

//DeleteUser function, deletes the user
func DeleteUser(username string, password string, db *sql.DB) int {
	sqlStatement := `DELETE FROM users WHERE username = $1`
	sqlQuery := `SELECT password FROM users WHERE username = $1`
	var hashedPassword string

	res := db.QueryRow(sqlQuery, username)

	res.Scan(&hashedPassword)

	hashErr := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))

	if hashErr != nil {
		log.Printf("Error comparing password: %s", hashErr)
		return 2
	}

	_, err := db.Exec(sqlStatement, username)

	if err != nil {
		log.Printf("Error deleting user: %s", err)
		return 1
	}

	return 0
}
