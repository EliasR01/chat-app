package chat

import (
	"database/sql"
	"log"
	"time"
)

//CreateConv function to create a new conversation in database
func CreateConv(creator string, member string, db *sql.DB) bool {
	sqlStatement := `INSERT INTO conversation VALUES(uuid_generate_v4(), $1, $2, $3, $4, $5, $6)`

	_, err := db.Exec(sqlStatement, time.Now(), time.Now(), nil, "CREATED", creator, member)

	if err != nil {
		log.Printf("Error inserting conversation: %s", err)
		return false
	}

	return true

}
