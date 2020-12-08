package auth

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	_ "github.com/lib/pq" //Postgresql driver used with the database/sql package
	"golang.org/x/crypto/bcrypt"
)

//User Type
type User struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

//ValidateUser function
func ValidateUser(email string, password string, db *sql.DB, w http.ResponseWriter, r *http.Request) {
	sqlStatement := `SELECT * FROM users WHERE EMAIL = $1`
	var rows int
	var userData User
	res, err := db.Query(sqlStatement, email)

	if err != nil {
		w.WriteHeader(http.StatusConflict)
		w.Write([]byte("There was an error querying the user"))
		log.Printf("Error querying user: %s", err)
	} else {
		for res.Next() {
			rows++
			res.Scan(&userData.Name, &userData.Email, &userData.Password)
			err := bcrypt.CompareHashAndPassword([]byte(userData.Password), []byte(password))

			if err != nil {
				w.WriteHeader(http.StatusNonAuthoritativeInfo)
				w.Write([]byte("Invalid user credentials"))
				log.Printf("Invalid user credentials: %s", err)
			} else {
				cookie := generateToken(userData.Name)

				u := map[string]interface{}{}
				u["name"] = userData.Name
				u["email"] = userData.Email

				b, err := json.Marshal(u)

				if err != nil {
					log.Printf("Error marshal string: %s", err)
				} else {
					r.AddCookie(cookie)
					http.SetCookie(w, cookie)
					w.Write([]byte(b))
				}
			}

		}

		if rows < 1 {
			w.WriteHeader(http.StatusNonAuthoritativeInfo)
			w.Write([]byte("Invalid user credentials"))
		}
	}

}

func generateToken(user string) *http.Cookie {
	var cookie http.Cookie
	os.Setenv("ACCESS_SECRET", "ajkskhjwkdkgfaskj")
	tokenClaims := jwt.MapClaims{}
	tokenClaims["authorized"] = true
	tokenClaims["user_name"] = user
	tokenClaims["exp"] = time.Now().Add(time.Minute * 15).Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenClaims)

	tokenString, err := token.SignedString([]byte(os.Getenv("ACCESS_SECRET")))

	if err != nil {
		log.Printf("Error signing token: %s", err)
	} else {
		expiration := time.Now().Add(365 * 24 * time.Hour)
		cookie = http.Cookie{
			Name:    "auth",
			Value:   tokenString,
			Path:    "/",
			Expires: expiration,
		}
	}
	return &cookie
}
