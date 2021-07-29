package user

import (
	"bytes"
	"context"
	"database/sql"
	"io"
	"log"
	"time"

	"cloud.google.com/go/firestore"
	"cloud.google.com/go/storage"
	cloud "cloud.google.com/go/storage"
	firebase "firebase.google.com/go/v4"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/api/option"
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
	FileURL      string `json:"fileurl"`
	File         []byte `json:"file"`
}

//App firebase type
type App struct {
	ctx     context.Context
	client  *firestore.Client
	storage *storage.Client
}

type imageStruct struct {
	ImageName string
	URL       string
}

//UpdateContact struct info that contact http request body will have
type UpdateContact struct {
	Op           string
	Username     string
	ContactName  string
	ContactEmail string
}

//Route user
var Route App

//InitFirebase function
func InitFirebase() {
	Route.ctx = context.Background()
	opt := option.WithCredentialsFile("serviceAccountKey.json")
	config := &firebase.Config{ProjectID: "chat-app-7a848"}
	app, err := firebase.NewApp(Route.ctx, config, opt)
	if err != nil {
		log.Fatalf("Error initializing firebase: %s", err)
	}

	Route.client, err = app.Firestore(Route.ctx)

	if err != nil {
		log.Fatalf("Error initializing firebase client: %s", err)
	}

	Route.storage, err = cloud.NewClient(Route.ctx, opt)

	if err != nil {
		log.Fatalf("Error initializing firebase storage: %s", err)
	}
	// _, err = client.DefaultBucket()

}

//UpdateUser function, updates the user information stored in database
func UpdateUser(data Data, db *sql.DB, username string) int {
	sqlStatement := `UPDATE users SET name = $1, email = $2, address = $3, phone = $4, username = $5 where username = $6`
	sqlQuery := `SELECT password, file_url FROM users WHERE username = $1`

	var hashedPassword string
	var fileURL string
	row := db.QueryRow(sqlQuery, data.Username)
	row.Scan(&hashedPassword, &fileURL)
	hashErr := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(data.Password))
	if fileURL != string(data.FileURL) {
		err := UploadFile(data.CurrUsername+time.Now().Format("YYYY-MM-DDTHH:MM:SS")+".pdf", data.File)

		if err != nil {
			log.Printf("Error uploading file: %s", err)
			return 3
		}
	}

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

//UploadFile function uploads every attachment to Firebase
func UploadFile(object string, file []byte) error {
	log.Println("Uploading file...")
	bucket := "chat-app-1bcf3.appspot.com"
	id := uuid.New()

	obj := Route.storage.Bucket(bucket).Object(object)
	wc := obj.NewWriter(Route.ctx)

	imageStructure := imageStruct{
		ImageName: object,
		URL:       "https://storage.cloud.google.com/" + bucket + "/" + object,
	}

	defer wc.Close()

	wc.ObjectAttrs.Metadata = map[string]string{"firebaseStorageDownloadTokens": id.String()}

	_, err := io.Copy(wc, bytes.NewReader(file))

	if err != nil {
		return err
	}

	ref, res, err := Route.client.Collection("Image").Add(Route.ctx, imageStructure)

	log.Println(ref)
	log.Println(res)
	log.Println(err)

	if err != nil {
		return err
	}

	return nil
}
