package chat

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"
)

//Contact struct
type Contact struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	UserID   string `json:"userid"`
	Username string `json:"username"`
	Address  string `json:"address"`
	Phone    string `json:"phone"`
}

//ContactReq struct, this is the contact information sent to the addContactHandler func
type ContactReq struct {
	Person   []person `json:"people"`
	Username string   `json:"username"`
}

//DelContactReq struct, receives the contact ID from the DELETE Request
type DelContactReq struct {
	ContactID string `json:"contact"`
}

type conversation struct {
	CreatedAt   string         `json:"createdAt"`
	UpdatedAt   string         `json:"updatedAt"`
	DeletedAt   sql.NullTime   `json:"deletedAt"`
	STS         string         `json:"sts"`
	Creator     string         `json:"creator"`
	Member      string         `json:"member"`
	LastMessage sql.NullString `json:"lastMessage"`
}

type message struct {
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
	Contacts      []Contact               `json:"contacts"`
	Conversations map[string]conversation `json:"conversations"`
	Messages      map[string]message      `json:"messages"`
	People        []person                `json:"people"`
}

type attachment struct {
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

var contactData Contact
var contacts []Contact
var conversationData conversation
var conversations map[string]conversation
var messageData message
var messages map[string]message
var attachmentData attachment
var attachments map[string]attachment
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

	go fetchPeople(db, data)
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
	contactData = Contact{}
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
	var userID string
	userRes, userErr := db.Query(sqlUser, data)

	if userErr != nil {
		log.Printf("Error querying user ID: %s", userErr)
	}

	for userRes.Next() {
		userRes.Scan(&userID)
	}
	sqlContacts := `SELECT c.id, c.name, c.email, c.user_id, c.username, u.address, u.phone FROM contacts c, users u WHERE c.user_id = $1 AND u.name = c.name`
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

func fetchPeople(db *sql.DB, data string) {
	sqlPersons := `SELECT name, email, created_at, id, address, phone, username FROM users WHERE username != $1`

	res, err := db.Query(sqlPersons, data)
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
	sqlConversation := `SELECT ID, created_at, updated_at, deleted_at, sts, creator, member, last_message FROM conversation WHERE creator = $1 OR member = $1`
	sqlMessages := `SELECT id, message, created_at, updated_at, deleted_at, sender, conversation_id, sts, message_type FROM messages WHERE conversation_id = $1 AND sts != 'DELETED'`
	sqlAttachments := `SELECT id, messages_id, file_url FROM attachments WHERE messages_id = $1`
	convRes, convErr := db.Query(sqlConversation, data)

	if convErr != nil {
		log.Printf("Error querying conversations: %s", convErr)
		return
	}
	defer wg.Done()
	defer convRes.Close()
	conversations = make(map[string]conversation)
	messages = make(map[string]message)
	attachments = make(map[string]attachment)
	for convRes.Next() {
		var conversationID string
		err := convRes.Scan(&conversationID, &conversationData.CreatedAt, &conversationData.UpdatedAt, &conversationData.DeletedAt, &conversationData.STS, &conversationData.Creator, &conversationData.Member, &conversationData.LastMessage)
		if err != nil {
			log.Printf("Error scaning conversation rows: %s", err)
		}
		conversations[conversationID] = conversationData
		//Querying user messages by conversation
		messRes, messErr := db.Query(sqlMessages, conversationID)

		if messErr != nil {
			log.Printf("Error querying messages: %s", messErr)
			return
		}
		defer messRes.Close()
		for messRes.Next() {
			var messageID string
			err := messRes.Scan(&messageID, &messageData.Body, &messageData.CreatedAt, &messageData.UpdatedAt, &messageData.DeletedAt, &messageData.Sender, &messageData.ConversationID, &messageData.STS, &messageData.Type)

			if err != nil {
				log.Printf("Error scaning messages rows: %s", err)
			}

			messages[messageID] = messageData
			if messageData.Type == 2 {

				//Querying user message attachment by message
				attchRes, attchErr := db.Query(sqlAttachments, messageID)

				if attchErr != nil {
					log.Printf("Error querying attachment: %s", attchErr)
					return
				}

				defer attchRes.Close()
				for attchRes.Next() {
					var attachmentID string
					err := attchRes.Scan(&attachmentID, &attachmentData.MessagesID, &attachmentData.FileURL)

					if err != nil {
						log.Printf("Error scaning attachment rows: %s", err)
					}

					attachments[attachmentID] = attachmentData
				}

			}

		}
	}

}

//AddContact function, add a contact to user
func AddContact(db *sql.DB, data []person, username string) (int, []Contact) {
	sqlAddContact := `INSERT INTO CONTACTS(id, name, email, user_id, username) VALUES (uuid_generate_v4() ,$1, $2, $3, $4)`
	sqlContacts := `SELECT c.id, c.name, c.email, c.user_id, c.username, u.address, u.phone FROM contacts c, users u WHERE c.user_id = $1 AND u.name = c.name`
	sqlUser := `SELECT id, name, email, created_at, address, phone, username FROM users WHERE username = $1`
	var resContacts []Contact
	var contactData Contact

	var requesterUser person
	var receiverUser person

	log.Printf("Adding contact: %v %s", data, username)
	reqErr := db.QueryRow(sqlUser, username).Scan(&requesterUser.ID, &requesterUser.Name, &requesterUser.Email, &requesterUser.CreatedAt, &requesterUser.Address, &requesterUser.Phone, &requesterUser.Username)

	if reqErr != nil {
		log.Printf("Error querying requester user: %s", reqErr)
		return 1, nil
	}

	recErr := db.QueryRow(sqlUser, data[0].Username).Scan(&receiverUser.ID, &receiverUser.Name, &receiverUser.Email, &receiverUser.CreatedAt, &receiverUser.Address, &receiverUser.Phone, &receiverUser.Username)

	if recErr != nil {
		log.Printf("Error querying receiver user: %s", recErr)
		return 1, nil
	}

	_, insErr := db.Exec(sqlAddContact, receiverUser.Name, receiverUser.Email, requesterUser.ID, receiverUser.Username)

	if insErr != nil {
		log.Printf("Error inserting the requester contact: %s", insErr)
		return 1, nil
	}

	_, insErr = db.Exec(sqlAddContact, requesterUser.Name, requesterUser.Email, receiverUser.ID, requesterUser.Username)

	if insErr != nil {
		log.Printf("Error inserting the receiver contact: %s", insErr)
		return 1, nil
	}

	res, contErr := db.Query(sqlContacts, requesterUser.ID)

	if contErr != nil {
		log.Printf("Error retrieving the contact information: %s", contErr)
		return 1, nil
	}

	defer res.Close()

	for res.Next() {
		res.Scan(&contactData.ID, &contactData.Name, &contactData.Email, &contactData.UserID, &contactData.Username, &contactData.Address, &contactData.Phone)
		resContacts = append(resContacts, contactData)
	}

	return 0, resContacts

}

//RemoveContact function, detaches contact from user
func RemoveContact(db *sql.DB, id string) (int, string) {
	sqlRemoveContact := `DELETE FROM contacts WHERE id = $1 RETURNING username`
	sqlUpdateConversation := `UPDATE conversation set sts = 'DELETED', deleted_at = $2 where creator = $1 or member = $1 RETURNING ID`
	sqlUpdateMessages := `UPDATE messages SET sts = 'DELETED' WHERE conversation_id = $1`
	// sqlRemoveMessages := `DELETE FROM messages WHERE `

	var contactUsername string
	var convID string

	err := db.QueryRow(sqlRemoveContact, id).Scan(&contactUsername)

	if err != nil {
		log.Printf("Error deleting or scanning contact: %s", err)
		return 1, ""
	}

	db.QueryRow(sqlUpdateConversation, contactUsername, time.Now()).Scan(&convID)

	db.Exec(sqlUpdateMessages, convID)

	return 0, id

}
