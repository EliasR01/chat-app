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
	Name      string `json:"name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	CreatedAt string `json:"created_at"`
	ID        int    `json:"id"`
	Address   string `json:"address"`
	Phone     string `json:"phone"`
	Username  string `json:"username"`
}

type claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

//UserData variable that stores every user information
var UserData User

//ValidateUser function
func ValidateUser(data []string, db *sql.DB, w http.ResponseWriter, r *http.Request) {
	if data[0] == "LOGIN" {
		sqlStatement := `SELECT * FROM users WHERE EMAIL = $1`
		var rows int
		res, err := db.Query(sqlStatement, data[1])
		if err != nil {
			w.WriteHeader(http.StatusConflict)
			w.Write([]byte("There was an error querying the user"))
		} else {
			defer res.Close()
			for res.Next() {
				rows++
				res.Scan(&UserData.Name, &UserData.Email, &UserData.Password, &UserData.CreatedAt, &UserData.ID, &UserData.Address, &UserData.Phone, &UserData.Username)
				err := bcrypt.CompareHashAndPassword([]byte(UserData.Password), []byte(data[2]))

				if err != nil {
					w.WriteHeader(http.StatusNonAuthoritativeInfo)
					w.Write([]byte("Invalid user credentials"))
					log.Printf("Invalid user credentials: %s", err)
				} else {
					cookie := generateToken(UserData.Email)

					u := map[string]interface{}{}
					u["ID"] = UserData.ID
					u["name"] = UserData.Name
					u["email"] = UserData.Email
					u["address"] = UserData.Address
					u["phone"] = UserData.Phone
					u["username"] = UserData.Username

					b, err := json.Marshal(u)

					if err != nil {
						log.Printf("Error marshal string: %s", err)
					} else {
						r.AddCookie(cookie)
						http.SetCookie(w, cookie)
						w.Write([]byte(b))
						UserData = User{}
					}
				}

			}

			if rows < 1 {
				w.WriteHeader(http.StatusNonAuthoritativeInfo)
				w.Write([]byte("Invalid user credentials"))
			}
		}
	} else if data[0] == "RELOAD" {
		cookie, err := r.Cookie("auth")
		if err != nil {
			log.Printf("Error reading cookie: %s", err)
			w.WriteHeader(http.StatusConflict)
			return
		}

		result := validateToken(cookie, db)
		if result {
			data, err := json.Marshal(UserData)

			if err != nil {
				log.Printf("Error marshaling user data: %s", err)
			}
			_, err = w.Write(data)

			if err != nil {
				log.Printf("Error writing data: %s", err)
			}
			UserData = User{}
		} else {
			w.Write([]byte("Invalid token!"))
			w.WriteHeader(http.StatusBadGateway)
			UserData = User{}
		}
	}
}

func generateToken(email string) *http.Cookie {
	var cookie http.Cookie
	tokenClaims := jwt.MapClaims{}
	tokenClaims["authorized"] = true
	tokenClaims["email"] = email
	tokenClaims["exp"] = time.Now().Add(time.Minute * 15).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenClaims)

	tokenString, err := token.SignedString([]byte(os.Getenv("ACCESS_SECRET")))

	if err != nil {
		log.Printf("Error signing token: %s", err)
	} else {
		expiration := time.Now().Add(365 * 24 * time.Hour)
		cookie = http.Cookie{
			Name:  "auth",
			Value: tokenString,
			// Path:     "/",
			Expires: expiration,
			Secure:  false,
		}
	}
	return &cookie
}

func validateToken(cookie *http.Cookie, db *sql.DB) bool {
	sqlStatement := `SELECT name, email, created_at, id, address, phone, username FROM users WHERE EMAIL = $1`
	tokenString := cookie.Value
	claims := &claims{}
	// claims.Email
	_, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {

		res, err := db.Query(sqlStatement, claims.Email)

		if err != nil {
			log.Printf("Error querying user: %s", err)
		}

		for res.Next() {
			res.Scan(&UserData.Name, &UserData.Email, &UserData.CreatedAt, &UserData.ID, &UserData.Address, &UserData.Phone, &UserData.Username)
		}

		return token, nil
	})
	if err != nil {
		return true
	}
	return false
}

//Logout function used to remove the cookie in the browser in order to logging out the user
func Logout(w http.ResponseWriter) {
	cookie := http.Cookie{
		Name:   "auth",
		Value:  "",
		Path:   "/",
		MaxAge: -1,
	}
	http.SetCookie(w, &cookie)
	w.Write([]byte("User deauthenticated!"))
}
