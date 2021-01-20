package chat

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"sync"
)

type contact struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	UserID   int    `json:"userid"`
	Username string `json:"username"`
	Address  string `json:"address"`
	Phone    string `json:"phone"`
}

type conversation struct {
	ID        string         `json:"id"`
	CreatedAt string         `json:"createdAt"`
	UpdatedAt string         `json:"updatedAt"`
	DeletedAt sql.NullString `json:"deletedAt"`
	STS       string         `json:"sts"`
	Creator   string         `json:"creator"`
	Member    string         `json:"member"`
}

type message struct {
	ID             string         `json:"id"`
	Body           string         `json:"body"`
	CreatedAt      string         `json:"createdAt"`
	UpdatedAt      string         `json:"updatedAt"`
	DeletedAt      sql.NullString `json:"deletedAt"`
	Sender         string         `json:"sender"`
	ConversationID string         `json:"conversationId"`
	STS            string         `json:"sts"`
	Type           int            `json:"type"`
}

type userData struct {
	Contacts      []contact      `json:"contacts"`
	Conversations []conversation `json:"conversations"`
	Messages      []message      `json:"messages"`
	People        []person       `json:"people"`
}

type attachment struct {
	ID         string `json:"id"`
	MessagesID string `json:"messagesId"`
	FileURL    string `json:"fileUrl"`
}

type person struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	CreatedAt string `json:"created_at"`
	ID        int    `json:"id"`
	Address   string `json:"address"`
	Phone     string `json:"phone"`
	Username  string `json:"username"`
}

var contactData contact
var contacts []contact
var conversationData conversation
var conversations []conversation
var messageData message
var messages []message
var attachmentData attachment
var attachments []attachment
var user person
var users []person
var wg sync.WaitGroup

//GetUserInfo retrieves all the user info, conversations and chats
func GetUserInfo(db *sql.DB, w http.ResponseWriter, r *http.Request, data string) {
	wg.Add(3)
	//Querying user contacts
	go fetchContacts(db, data)

	//Querying user conversations
	go fetchConversations(db, data)

	go fetchPeople(db)
	wg.Wait()

	userData := userData{
		Contacts:      contacts,
		Conversations: conversations,
		Messages:      messages,
		People:        users,
	}

	responseData, err := json.Marshal(userData)

	if err != nil {
		log.Printf("Error converting response to bytes: %s", err)
		return
	}
	w.Write(responseData)
	clearVariables()

}

func clearVariables() {
	contactData = contact{}
	conversationData = conversation{}
	messageData = message{}
	attachmentData = attachment{}
	user = person{}
	conversations = nil
	contacts = nil
	messages = nil
	attachments = nil
	users = nil
}

func fetchContacts(db *sql.DB, data string) {
	sqlUser := `SELECT id FROM users WHERE username = $1`
	var userID int
	userRes, userErr := db.Query(sqlUser, data)

	if userErr != nil {
		log.Printf("Error querying user ID: %s", userErr)
	}

	for userRes.Next() {
		userRes.Scan(&userID)
	}

	sqlContacts := `SELECT c.id, c.name, c.email, c.user_id, u.username, u.address, u.phone FROM contacts c, users u WHERE c.user_id = $1 AND u.name = c.name`
	var rows = 0
	contRes, contErr := db.Query(sqlContacts, userID)

	if contErr != nil {
		log.Printf("Error querying contacts: %s", contErr)
	}
	defer wg.Done()
	defer contRes.Close()
	for contRes.Next() {
		contRes.Scan(&contactData.ID, &contactData.Name, &contactData.Email, &contactData.UserID, &contactData.Username, &contactData.Address, &contactData.Phone)
		contacts = append(contacts, contactData)
		rows++
	}
}

func fetchPeople(db *sql.DB) {
	sqlPersons := `SELECT name, email, created_at, id, address, phone, username FROM users`

	res, err := db.Query(sqlPersons)
	if err != nil {
		log.Printf("Error querying users: %s", err)
	}

	defer wg.Done()
	defer res.Close()
	for res.Next() {
		res.Scan(&user.Name, &user.Email, &user.CreatedAt, &user.ID, &user.Address, &user.Phone, &user.Username)
		users = append(users, user)
	}
}

func fetchConversations(db *sql.DB, data string) {
	sqlConversation := `SELECT ID, created_at, updated_at, deleted_at, sts, creator, member FROM conversation WHERE creator = $1 OR member = $1`
	sqlMessages := `SELECT id, message, created_at, updated_at, deleted_at, sender, conversation_id, sts, message_type FROM messages WHERE conversation_id = $1`
	sqlAttachments := `SELECT id, messages_id, file_url FROM attachments WHERE messages_id = $1`
	convRes, convErr := db.Query(sqlConversation, data)

	if convErr != nil {
		log.Printf("Error querying conversations: %s", convErr)
		return
	}
	defer wg.Done()
	defer convRes.Close()
	for convRes.Next() {
		err := convRes.Scan(&conversationData.ID, &conversationData.CreatedAt, &conversationData.UpdatedAt, &conversationData.DeletedAt, &conversationData.STS, &conversationData.Creator, &conversationData.Member)

		if err != nil {
			log.Printf("Error scaning conversation rows: %s", err)
		}

		conversations = append(conversations, conversationData)
		//Querying user messages by conversation
		messRes, messErr := db.Query(sqlMessages, conversationData.ID)

		if messErr != nil {
			log.Printf("Error querying messages: %s", messErr)
			return
		}
		defer messRes.Close()
		for messRes.Next() {
			err := messRes.Scan(&messageData.ID, &messageData.Body, &messageData.CreatedAt, &messageData.UpdatedAt, &messageData.DeletedAt, &messageData.Sender, &messageData.ConversationID, &messageData.STS, &messageData.Type)

			if err != nil {
				log.Printf("Error scaning messages rows: %s", err)
			}

			messages = append(messages, messageData)
			if messageData.Type == 2 {

				//Querying user message attachment by message
				attchRes, attchErr := db.Query(sqlAttachments, messageData.ID)

				if attchErr != nil {
					log.Printf("Error querying attachment: %s", attchErr)
					return
				}

				defer attchRes.Close()
				for attchRes.Next() {
					err := attchRes.Scan(&attachmentData.ID, &attachmentData.MessagesID, &attachmentData.FileURL)

					if err != nil {
						log.Printf("Error scaning attachment rows: %s", err)
					}

					attachments = append(attachments, attachmentData)
				}

			}

		}
	}

}
