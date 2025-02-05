package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"os"
)

type scoreToSend struct {
	Name  string `json:"name"`
	Score int    `json:"score"`
	Time  int64  `json:"time"` // Temps en millisecondes
}

type scoreToGet struct {
	Name  string `json:"name"`
	Score int    `json:"score"`
	Time  int64  `json:"time"`
}

var score []scoreToSend

func sendScore(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(score)
	if err != nil {
		http.Error(w, "Unable to encode response", http.StatusInternalServerError)
	}
}

func getScore(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var newScore scoreToGet

	// Décoder le score envoyé dans la requête POST
	err := json.NewDecoder(r.Body).Decode(&newScore)
	if err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Ajouter le score à la liste existante
	newEntry := scoreToSend{
		Name:  newScore.Name,
		Score: newScore.Score,
		Time:  newScore.Time,
	}
	score = append(score, newEntry)

	// Sauvegarder dans le fichier test.json
	saveScoresToFile("./json_directory/scores.json")
}

func saveScoresToFile(filename string) {
	file, err := os.Create(filename)
	if err != nil {
		fmt.Println("Error creating file:", err)
		return
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	err = encoder.Encode(score)
	if err != nil {
		fmt.Println("Error encoding data to file:", err)
	}
}

func main() {
	// INITIALISE LE ROUTEUR
	r := mux.NewRouter()

	// ROUTES AND ENDPOINTS
	r.HandleFunc("/score", sendScore).Methods("GET")
	r.HandleFunc("/score", getScore).Methods("POST")

	port := ":8080"
	fmt.Println("Server running on port", port)
	if err := http.ListenAndServe(port, r); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
