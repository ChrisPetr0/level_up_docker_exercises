package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	http.HandleFunc("/", handleRoot)
	http.HandleFunc("/health", handleHealth)

	port := "8080"
	fmt.Printf("Server starting on port %s...\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		fmt.Printf("Error starting server: %v\n", err)
		os.Exit(1)
	}
}

func handleRoot(w http.ResponseWriter, r *http.Request) {
	hostname, _ := os.Hostname()
	fmt.Fprintf(w, "Hello from Go in Docker!\n")
	fmt.Fprintf(w, "Hostname: %s\n", hostname)
	fmt.Fprintf(w, "This is a multi-stage build example.\n")
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "OK\n")
}
