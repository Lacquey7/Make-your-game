package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

type scoreHandleJSON struct {
	Rank  int    `json:"rank"`
	Name  string `json:"name"`
	Score int    `json:"score"`
	Time  int64  `json:"time"` // Temps en millisecondes
}

// upgrader permet de transformer une requête HTTP en connexion WebSocket.
// Pour simplifier, on accepte toutes les origines (attention en production !).
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// wsHandler upgrade la connexion HTTP en WebSocket, crée un objet scoreHandleJSON
// avec une durée convertie en millisecondes, puis l'envoie au client.
func wsHandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade de la requête HTTP vers une connexion WebSocket.
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Erreur lors de l'upgrade :", err)
		return
	}
	defer conn.Close()

	// Exemple de durée : 2 secondes et 500 millisecondes.
	duration := 2*time.Second + 500*time.Millisecond
	// Conversion de la durée en millisecondes.
	ms := duration.Milliseconds()

	// Création de l'objet scoreHandleJSON.
	score := scoreHandleJSON{
		Rank:  1,
		Name:  "Alice",
		Score: 100,
		Time:  ms, // Temps converti en millisecondes
	}

	// Pour vérification, affichage de l'objet au format JSON dans la console.
	data, err := json.Marshal(score)
	if err != nil {
		log.Println("Erreur lors de la conversion en JSON :", err)
		return
	}
	log.Println("Donnée JSON à envoyer :", string(data))

	// Envoi de l'objet JSON au client via la connexion WebSocket.
	if err := conn.WriteJSON(score); err != nil {
		log.Println("Erreur lors de l'envoi par WebSocket :", err)
		return
	}

	log.Println("Message envoyé avec succès au client.")
}

func main() {
	// Enregistre le handler pour l'endpoint /ws.
	http.HandleFunc("/ws", wsHandler)

	// Démarre le serveur HTTP sur le port 8080.
	log.Println("Serveur démarré sur :8080")
	log.Println("Connectez-vous via WebSocket à ws://localhost:8080/ws")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("Erreur lors du lancement du serveur :", err)
	}
}
