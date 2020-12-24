package chat

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"sync"
)

type contact struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	UserID int    `json:"userid"`
}

type conversation struct {
	ID        string `json:"id"`
	CreatorID string `json:"creatorId"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
	DeletedAt string `json:"deletedAt"`
	STS       string `json:"sts"`
}

type message struct {
	ID             string `json:"id"`
	Message        string `json:"message"`
	CreatedAt      string `json:"createdAt"`
	UpdatedAt      string `json:"updatedAt"`
	DeletedAt      string `json:"deletedAt"`
	UserID         string `json:"userId"`
	ConversationID string `json:"conversationId"`
	STS            string `json:"sts"`
	MessageType    string `json:"messageType"`
}

type userData struct {
	Contacts      []contact      `json:"contacts"`
	Conversations []conversation `json:"conversations"`
	Messages      []message      `json:"messages"`
}

type attachment struct {
	ID         string `json:"id"`
	MessagesID string `json:"messagesId"`
	FileURL    string `json:"fileUrl"`
}

var contactData contact
var contacts []contact
var conversationData conversation
var conversations []conversation
var messageData message
var messages []message
var attachmentData attachment
var attachments []attachment
var wg sync.WaitGroup

//GetUserInfo retrieves all the user info, conversations and chats
func GetUserInfo(db *sql.DB, w http.ResponseWriter, r *http.Request, data string) {
	wg.Add(2)

	//Querying user contacts
	go fetchContacts(db, data)

	//Querying user conversations
	go fetchConversations(db, data)
	wg.Wait()

	userData := userData{
		Contacts:      contacts,
		Conversations: conversations,
		Messages:      messages,
	}

	responseData, err := json.Marshal(userData)

	if err != nil {
		log.Printf("Error converting response to bytes: %s", err)
		return
	}
	w.WriteHeader(http.StatusAccepted)
	w.Write(responseData)

}

func fetchContacts(db *sql.DB, data string) {
	sqlContacts := `SELECT * FROM contacts WHERE user_id = $1`
	var rows = 0
	contRes, contErr := db.Query(sqlContacts, data)

	if contErr != nil {
		log.Printf("Error querying contacts: %s", contErr)
	}
	defer wg.Done()
	defer contRes.Close()
	for contRes.Next() {
		log.Println("Row...")
		contRes.Scan(&contactData.ID, &contactData.Name, &contactData.Email, &contactData.UserID)
		contacts = append(contacts, contactData)
		rows++
	}
}

func fetchConversations(db *sql.DB, data string) {
	sqlConversation := `SELECT * FROM conversation WHERE creator_id = $1`
	sqlMessages := `SELECT * FROM messages WHERE conversation_id = $1`
	sqlAttachments := `SELECT * FROM attachments WHERE messages_id = $1`

	convRes, convErr := db.Query(sqlConversation, data)

	if convErr != nil {
		log.Printf("Error querying conversations: %s", convErr)
		return
	}
	defer wg.Done()
	defer convRes.Close()
	for convRes.Next() {
		convRes.Scan(&conversationData.ID, &conversationData.CreatorID, &conversationData.CreatedAt, &conversationData.UpdatedAt, &conversationData.DeletedAt, &conversationData.STS)
		conversations = append(conversations, conversationData)
		//Querying user messages by conversation
		messRes, messErr := db.Query(sqlMessages, conversationData.ID)

		if messErr != nil {
			log.Printf("Error querying messages: %s", messErr)
			return
		}
		defer messRes.Close()
		for messRes.Next() {
			messRes.Scan(&messageData.ID, &messageData.Message, &messageData.CreatedAt, &messageData.UpdatedAt, &messageData.DeletedAt, &messageData.UserID, &messageData.ConversationID, &messageData.STS, &messageData.MessageType)
			messages = append(messages, messageData)
			if messageData.MessageType == "attachment" {

				//Querying user message attachment by message
				attchRes, attchErr := db.Query(sqlAttachments, messageData.ID)

				if attchErr != nil {
					log.Printf("Error querying attachment: %s", attchErr)
					return
				}

				defer attchRes.Close()
				for attchRes.Next() {
					attchRes.Scan(&attachmentData.ID, &attachmentData.MessagesID, &attachmentData.FileURL)
					attachments = append(attachments, attachmentData)
				}

			}

		}
	}

}
