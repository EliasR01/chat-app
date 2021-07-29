package chat

import (
	"database/sql"
	"log"
	"time"
)

//ConversationData struct
type ConversationData struct {
	CreatedAt   string         `json:"createdAt"`
	UpdatedAt   string         `json:"updatedAt"`
	DeletedAt   sql.NullTime   `json:"deletedAt"`
	STS         string         `json:"sts"`
	Creator     string         `json:"creator"`
	Member      string         `json:"member"`
	LastMessage sql.NullString `json:"lastMessage"`
}

//ResData type
type ResData struct {
	Conversations map[string]ConversationData `json:"conversations"`
}

//ConvReq type, the request data
type ConvReq struct {
	Creator string `json:"creator"`
	Member  string `json:"member"`
}

//CreateConv function to create a new conversation in database
func CreateConv(creator string, member string, db *sql.DB) (int, ResData) {
	sqlStatement := `INSERT INTO conversation(id, created_at, updated_at, deleted_at, sts, creator, member) VALUES(uuid_generate_v4(), $1, $2, $3, $4, $5, $6) RETURNING ID`
	var convID string
	var convMap = make(map[string]ConversationData)
	err := db.QueryRow(sqlStatement, time.Now(), time.Now(), nil, "CREATED", creator, member).Scan(&convID)

	createdConv := ConversationData{
		CreatedAt: time.Now().String(),
		UpdatedAt: time.Now().String(),
		DeletedAt: sql.NullTime{
			Time:  time.Time{},
			Valid: false,
		},
		STS:     "CREATED",
		Creator: creator,
		Member:  member,
		LastMessage: sql.NullString{
			String: "",
			Valid:  false,
		},
	}

	convMap[convID] = createdConv

	response := ResData{
		Conversations: convMap,
	}
	if err != nil {
		log.Printf("Error inserting conversation: %s", err)
		return 1, ResData{}
	}

	return 0, response

}
