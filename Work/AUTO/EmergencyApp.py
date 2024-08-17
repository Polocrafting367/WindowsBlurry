import tkinter as tk
from tkinter import ttk
import subprocess
import psutil
import keyboard

def close_application():
    emergency_window.destroy()  # Fermer la fenêtre d'urgence
    main_process.terminate()  # Terminer le processus principal

def open_main_application():
    # Démarrer l'application principale en utilisant subprocess et stocker le processus ouvert
    main_process = subprocess.Popen(["python", "test.py"])
    return main_process  # Retourner le processus principal

def close_emergency_window(event=None):
    emergency_window.destroy()
    main_process.terminate()  # Terminer le processus principal

# Fonction pour ouvrir la fenêtre d'urgence
def open_emergency_window():
    global emergency_window, main_process
    emergency_window = tk.Toplevel()
    emergency_window.title("Emergency Options")
    emergency_window.attributes('-topmost', True)
    
    # Définir la couleur de fond en rouge
    emergency_window.configure(bg="red")
    

    # Ajouter un texte d'information
    info_label = ttk.Label(emergency_window, text="Faite CTRL+ W pour fermer de force l'application")
    info_label.pack(padx=10, pady=5)
    
    # Ajouter un bouton pour fermer l'application à tout moment
    close_app_button = ttk.Button(emergency_window, text="Fermer l'application", command=close_application)
    close_app_button.pack(padx=10, pady=5)

    # Garder la fenêtre d'urgence au premier plan
    emergency_window.lift()

    # Ouvrir l'application principale
    main_process = open_main_application()
    
    # Liaison du raccourci clavier pour fermer la fenêtre d'urgence
    keyboard.add_hotkey("ctrl+w", close_emergency_window)
    
    # Boucle principale de la fenêtre d'urgence
    emergency_window.mainloop()


# Tester si ce script est exécuté en tant que programme principal
if __name__ == "__main__":
    # Désactiver la création automatique de la fenêtre racine Tk
    root = tk.Tk()
    root.withdraw()
    
    # Ouvrir la fenêtre d'urgence
    open_emergency_window()
