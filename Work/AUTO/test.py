import tkinter as tk
from tkinter import ttk
from tkinter import filedialog
import pyautogui
import os
import json
import time
import re
import keyboard


plus_position = None
date_position = None
validate_position = None
add_personnel_position = None
personnel_zone_position = None
personnel_time_position = None
validate_personnel_position = None
close_position = None
recording = False
first_record_done = False  # Initialisez à False ou à une autre valeur appropriée

calibration_stage = 0

def calibrate():
    global calibration_stage

    calibration_stage += 1
    
    if calibration_stage == 1:
        instruction_label.config(text="Mettez le curseur au-dessus de 'PLUS' et appuyez sur Entrée")
    elif calibration_stage == 2:
        instruction_label.config(text="Mettez le curseur au-dessus de la zone 'date' et appuyez sur Entrée")
    elif calibration_stage == 3:
        instruction_label.config(text="Mettez le curseur au-dessus de la zone 'Type de panne' et appuyez sur Entrée")
    elif calibration_stage == 4:
        instruction_label.config(text="Mettez le curseur au-dessus de 'Valider' et appuyez sur Entrée")
    elif calibration_stage == 5:
        instruction_label.config(text="Mettez le curseur au-dessus de 'Ajouter personnel' et appuyez sur Entrée")
    elif calibration_stage == 6:
        instruction_label.config(text="Mettez le curseur au-dessus de la zone de durée du personnel et appuyez sur Entrée")
    elif calibration_stage == 7:
        instruction_label.config(text="Mettez le curseur au-dessus de 'Ajouter' et appuyez sur Entrée")
    elif calibration_stage == 8:
        instruction_label.config(text="Mettez le curseur au-dessus de 'Fermer' et appuyez sur Entrée")
    elif calibration_stage == 9:
        instruction_label.config(text="Calibration terminée. Appuyez sur 'Ouvrir fichier' pour sauvegarder les positions.")
        open_file_button.config(state=tk.NORMAL)
        save_coordinates_button.config(state=tk.NORMAL)  # Activer le bouton pour enregistrer les coordonnées
        root.deiconify()
        root.lift()

def on_enter_press(event):
    global calibration_stage, plus_position, date_position, validate_position, add_personnel_position, personnel_zone_position, personnel_time_position, validate_personnel_position, close_position
    
    if event.keysym == 'Return':
        position = pyautogui.position()
        # Assigner les positions aux variables correspondantes
        if calibration_stage == 1:
            plus_position = position
            print("Position du bouton 'PLUS' enregistrée:", position)
            new_text_entry.delete("1.0", tk.END)  # Efface le texte existant
            new_text_entry.insert(tk.END, "Position du bouton 'PLUS' enregistrée: {}\n".format(position))

        elif calibration_stage == 2:
            date_position = position
            print("Position de la zone 'date' enregistrée:", position)
            new_text_entry.delete("1.0", tk.END)  # Efface le texte existant
            new_text_entry.insert(tk.END, "Position de la zone 'date' enregistrée: {}\n".format(position))
        elif calibration_stage == 3:
            validate_position = position
            print("Position de la zone 'Type de panne' enregistrée:", position)
            new_text_entry.delete("1.0", tk.END)  # Efface le texte existant
            new_text_entry.insert(tk.END, "Position de la zone 'Type de panne' enregistrée: {}\n".format(position))
        elif calibration_stage == 4:
            add_personnel_position = position
            print("Position du bouton 'Valider' enregistrée:", position)
            new_text_entry.delete("1.0", tk.END)  # Efface le texte existant
            new_text_entry.insert(tk.END, "Position du bouton 'Valider' enregistrée: {}\n".format(position))
        elif calibration_stage == 5:
            personnel_zone_position = position
            print("Position du bouton 'Ajouter personnel' enregistrée:", position)
            new_text_entry.delete("1.0", tk.END)  # Efface le texte existant
            new_text_entry.insert(tk.END, "Position du bouton 'Ajouter personnel' enregistrée: {}\n".format(position))

        elif calibration_stage == 6:
            personnel_time_position = position
            print("Position de la zone de temps du personnel enregistrée:", position)
            new_text_entry.delete("1.0", tk.END)  # Efface le texte existant
            new_text_entry.insert(tk.END, "Position de la zone de temps du personnel enregistrée: {}\n".format(position))

        elif calibration_stage == 7:
            validate_personnel_position = position
            print("Position du bouton 'Valider' (personnel) enregistrée:", position)
            new_text_entry.delete("1.0", tk.END)  # Efface le texte existant
            new_text_entry.insert(tk.END, "Position du bouton 'Valider' (personnel) enregistrée: {}\n".format(position))

        elif calibration_stage == 8:
            close_position = position
            print("Position du bouton 'Fermer' enregistrée:", position)
            new_text_entry.delete("1.0", tk.END)  # Efface le texte existant
            new_text_entry.insert(tk.END, "Position du bouton 'Fermer' enregistrée: {}\n".format(position))

        
        calibrate()  # Passer à l'étape suivante de calibration


def save_coordinates():
    coordinates = {
        'plus_position': plus_position,
        'date_position': date_position,
        'validate_position': validate_position,
        'add_personnel_position': add_personnel_position,
        'personnel_zone_position': personnel_zone_position,
        'personnel_time_position': personnel_time_position,
        'validate_personnel_position': validate_personnel_position,
        'close_position': close_position
    }
    with open('coordinates.json', 'w') as file:
        json.dump(coordinates, file)
    print("Coordonnées enregistrées avec succès.")
    new_text_entry.delete("1.0", tk.END)  # Efface le texte existant
    new_text_entry.insert(tk.END, "Coordonnées enregistrées avec succès. ")



# Fonction pour charger les dernières coordonnées enregistrées depuis le fichier JSON
def load_coordinates():
    global plus_position, date_position, validate_position, add_personnel_position, personnel_zone_position, personnel_time_position, validate_personnel_position, close_position
    
    if os.path.exists('coordinates.json'):
        with open('coordinates.json', 'r') as file:
            coordinates = json.load(file)
        plus_position = coordinates.get('plus_position')
        date_position = coordinates.get('date_position')
        validate_position = coordinates.get('validate_position')
        add_personnel_position = coordinates.get('add_personnel_position')
        personnel_zone_position = coordinates.get('personnel_zone_position')
        personnel_time_position = coordinates.get('personnel_time_position')
        validate_personnel_position = coordinates.get('validate_personnel_position')
        close_position = coordinates.get('close_position')
        print("Dernières coordonnées chargées avec succès.")
        new_text_entry.delete("1.0", tk.END)  # Efface le texte existant
        new_text_entry.insert(tk.END, "Dernières coordonnées chargées avec succès. ")

        # Activer le bouton "Ouvrir Fichier"
        open_file_button.config(state=tk.NORMAL)
    else:
        print("Aucun enregistrement précédent trouvé.")
        new_text_entry.delete("1.0", tk.END)  # Efface le texte existant
        new_text_entry.insert(tk.END, "Aucun enregistrement précédent trouvé.")
        
file_loaded = False  # Variable pour suivre l'état de chargement du fichier


import os

def open_file():
    global data, file_loaded, file_name_without_extension
    filename = filedialog.askopenfilename(title="Sélectionner le fichier", filetypes=[("Fichiers TXT", "*.txt")])
    if filename:
        # Extraire le nom du fichier sans son extension
        file_name_without_extension = os.path.splitext(os.path.basename(filename))[0]
        
        with open(filename, "r") as f:
            data = json.load(f)
        start_data_entry()
        # Activer le bouton "Lancer l'enregistrement" après le chargement du fichier
        record_button.config(state=tk.NORMAL)
        # Mettre à jour la variable file_loaded
        file_loaded = True
        # Appeler click_positions() avec file_name_without_extension comme argument
       


def start_data_entry():
    global current_index, total_entries, file_loaded
    current_index = 0
    total_entries = len(data)
    update_intervention_counter()  # Mettre à jour le compteur d'interventions restantes
    load_data_entry()
    # Désactiver le bouton "Lancer l'enregistrement" après le chargement des données
    if not file_loaded:
        record_button.config(state=tk.DISABLED)

def load_data_entry():

    global current_index
    if current_index < total_entries:
        entry = data[current_index]
        instruction_label.config(text="Clic sur 'lancer l'enregistrement' pour continuer")
        counter_label.config(text=f"Inter {current_index + 1}/{total_entries} ")

    else:
        instruction_label.config(text="Toutes les entrées de données ont été terminées.")
        new_text_entry.delete("1.0", tk.END)  # Efface le texte existant
        new_text_entry.insert(tk.END, "Toutes les entrées de données ont été terminées.")


    update_intervention_counter()  # Mettre à jour le compteur d'interventions restantes


current_intervention = 0

def submit_data():
    global current_index, first_record_done, current_intervention
    if current_index < len(data):  # Vérifier si current_index est dans la plage valide
        entry = data[current_index]

        click_positions()  # Appeler la fonction pour traiter la prochaine entrée
        load_data_entry()  # Charger la prochaine entrée de données
    else:
        print("Toutes les entrées de données ont été traitées.")
        new_text_entry.delete("1.0", tk.END)  # Efface le texte existant
        new_text_entry.insert(tk.END, "Toutes les entrées de données ont été traitées.")
        print("Aucun enregistrement précédent trouvé.")

        new_text_entry.insert(tk.END, "Aucun enregistrement précédent trouvé.")


def update_intervention_counter():
    global current_index, total_entries
    time.sleep(0.1)
    remaining_entries = total_entries - current_index
    new_text_entry.delete("1.0", tk.END)  # Effacer le texte existant
    new_text_entry.insert(tk.END, f"Inter {current_index + 1}/{total_entries} ")  # Insérer le nouveau texte
    time.sleep(0.1)
    



def update_counter():
    global current_index, total_entries
    progress = (current_index + 1) / total_entries * 100
    counter_label.config(text=f"Inter {current_index + 1}/{total_entries} ({progress:.2f}%)")



def entrer_texte(texte):
    print(texte)
    new_text_entry.insert(tk.END, texte)
    # Utiliser une expression régulière pour trouver le nombre avant chaque lieu
    for partie in re.findall(r"(\d+) \w+", texte):
        num_partie = int(partie)   # Convertir le nombre en entier
        # Appuyer sur la touche "down" le nombre de fois approprié
        for _ in range(num_partie):
            pyautogui.press('down')
        # Appuyer sur la touche "right" une fois
        pyautogui.press('right')
        time.sleep(0.5)  # Ajout d'un délai de 0.5 seconde
    # Appuyer sur la touche "enter" une fois à la fin
    pyautogui.press('enter')

def click_positions():
    update_intervention_counter()
    update_counter()
    root.update()
    instruction_label.config(text="Enregistrement en cours - Faite CTRL+ W pour fermer de force l'application")

    global current_index

    # Vérifier si toutes les entrées ont été traitées
    if current_index >= total_entries:
        print("Toutes les entrées ont été traitées.")
        new_text_entry.delete("1.0", tk.END)  # Efface le texte existant
        new_text_entry.insert(tk.END, "Toutes les entrées ont été traitées.")
        return

    entry = data[current_index]

    if entry['zoneTexte3']:
        instruction_label.config(text="Enregistrement manuel obligatoire")

        # Sauvegarde des données dans le fichier "Entrée manuel.txt"
        file_name = "Entrée manuel.txt"
        if not os.path.exists(file_name):
            open(file_name, 'w').close()

        with open(file_name, "a") as f:
            line = f'"{file_name_without_extension}" - "{entry["date"]}" - "{entry["temps"]}" - "{entry["zoneTexte1"]}" - "{entry["zoneTexte2"]}" - "{entry["zoneTexte3"]}" - "{entry["zoneTexte6"]}"\n'
            f.write(line)
        update_new_text_entry("Nouvelle enregistrement à faire manuellement")
        time.sleep(0.1)
                # Passer à la prochaine entrée


    else:

        # Clique sur la position du bouton "PLUS"
        pyautogui.click(plus_position)
        print("Clic sur 'PLUS' positionné à :", plus_position)
        update_new_text_entry("Clic sur 'PLUS'")

        time.sleep(0.1)  # Ajout d'un délai de 0.5 seconde
        # Entrée de la date
        pyautogui.click(date_position)
        print("Clic sur 'Date' positionné à :", date_position)
        update_new_text_entry("Clic sur 'Date'")
        pyautogui.typewrite(entry['date'])
        print("Entrée de la date :", entry['date'])
        update_new_text_entry("Entrée de la date : {}".format(entry['date']))

        time.sleep(0.1)  # Ajout d'un délai de 0.2 seconde
        pyautogui.press('tab')
        entrer_texte(entry['zoneTexte1'])
        time.sleep(0.3)
        pyautogui.click(validate_position)
        time.sleep(0.1)
        pyautogui.typewrite(entry['zoneTexte4'])
        print("Entrée de zoneTexte4 :", entry['zoneTexte4'])
        update_new_text_entry("Entrée de zoneTexte4 : {}".format(entry['zoneTexte4']))
        time.sleep(0.1)
        pyautogui.press('enter')
        time.sleep(0.1)
        pyautogui.press('tab')
        # Entrée de zoneTexte5
        pyautogui.typewrite(entry['zoneTexte5'])
        print("Entrée de zoneTexte5 :", entry['zoneTexte5'])
        update_new_text_entry("Entrée de zoneTexte5 : {}".format(entry['zoneTexte5']))
        time.sleep(0.1)
        pyautogui.press('enter')
        time.sleep(0.1)
        pyautogui.press('tab')
        # Entrée de zoneTexte2
        pyautogui.typewrite(entry['zoneTexte2'])
        print("Entrée de zoneTexte2 :", entry['zoneTexte2'])
        update_new_text_entry("Entrée de zoneTexte2 : {}".format(entry['zoneTexte2']))
        time.sleep(0.1)
        pyautogui.press('tab')
        # Convertir et entrer le temps
        print("Temps converti :", entry['zoneTexte6'])
        update_new_text_entry("Temps converti : {}".format(entry['zoneTexte6']))
        pyautogui.typewrite(entry['zoneTexte6'])
        time.sleep(0.1)
        # Clique sur "Valider"
        pyautogui.click(add_personnel_position)
        print("Clic sur 'Valider' positionné à :", add_personnel_position)
        update_new_text_entry("Clic sur 'Valider'")
        time.sleep(1.5)
        # Clique sur "Ajouter personnel"
        pyautogui.click(personnel_zone_position)
        print("Clic sur 'Ajouter personnel' positionné à :", personnel_zone_position)
        update_new_text_entry("Clic sur 'Ajouter personnel'")
        time.sleep(0.1)
        # Entrée dans la zone de personnel avec le nom du fichier texte
        pyautogui.typewrite(file_name_without_extension)
        time.sleep(2)
        # Entrée dans la durée du personnel
        pyautogui.click(personnel_time_position)
        print("Clic sur la durée du personnel positionnée à :", personnel_time_position)
        update_new_text_entry("Clic sur la durée du personnel")
        pyautogui.hotkey('ctrl', 'a')  # Sélectionne tout le texte
        pyautogui.press('delete')       # Efface le texte
        converted_time = convert_time(entry['temps'])  # Convertir le temps et assigner le résultat à converted_time
        pyautogui.typewrite(converted_time)
        print("Entrée dans la durée du personnel :", converted_time)
        update_new_text_entry("Entrée dans la durée du personnel : {}".format(converted_time))
        pyautogui.press('enter')
        time.sleep(0.1)
        # Clique sur "Ajouter"
        pyautogui.click(validate_personnel_position)
        print("Clic sur 'Ajouter'")
        update_new_text_entry("Clic sur 'Ajouter'")
        time.sleep(0.1)
        pyautogui.click(close_position)
        print("Clic sur 'Valider personnel' positionné à :", validate_personnel_position)
        update_new_text_entry("Clic sur 'Valider personnel' positionné à {}".format(validate_personnel_position))

        current_index += 1

       
        submit_data()  # Appel récursif pour traiter la prochaine entrée

        return



    current_index += 1

    submit_data()  # Appel récursif pour traiter la prochaine entrée

    root.update()

def update_new_text_entry(message):
    new_text_entry.delete("1.0", tk.END)  # Efface le texte existant
    new_text_entry.insert(tk.END, message + '\n')
    root.update()

def convert_time(time_str):
    # Diviser la chaîne en parties basées sur les caractères non numériques
    time_parts = re.split(r'(\D+)', time_str)
    total_minutes = 0
    
    # Parcourir les parties de la chaîne
    for i in range(0, len(time_parts), 2):
        value_str = time_parts[i]
        # Vérifier si la partie contient une valeur numérique
        if value_str.strip():
            value = int(value_str)
            unit = time_parts[i + 1]
            
            if unit == 'j':
                total_minutes += value * 24 * 60
            elif unit == 'h':
                total_minutes += value * 60
            elif unit == 'm':
                total_minutes += value
    
    hours = total_minutes // 60
    minutes = total_minutes % 60
    
    time_formatted = f"{hours:02d}:{minutes:02d}"
    return time_formatted

def update_counter_label():
    counter_label.config(text=f"Inter {current_index + 1}/{total_entries}")


def start_recording():
    global recording, file_loaded
    if file_loaded:  # Vérifier si un fichier est chargé
        recording = True
        print("Enregistrement démarré.")
        new_text_entry.insert(tk.END, "Enregistrement démarré. ")

        # Désactiver le bouton "Lancer l'enregistrement"
        record_button.config(state=tk.DISABLED)
        # Activer le bouton "Arrêter l'enregistrement"
        stop_button.config(state=tk.NORMAL)


def close_app(event=None):
    root.destroy()

# Ajouter la liaison du raccourci clavier pour fermer l'application

# Déplacer l'appel de click_positions() vers la fonction start_auto_click()
def start_auto_click():
    click_positions()  # Commencer le traitement des données
    root.after(100, start_auto_click)  # Exécuter click_positions() toutes les 100 millisecondes

def stop_recording():
    global recording
    recording = False
    print("Enregistrement arrêté.")
    root.destroy() 

def close_emergency_window(event=None):
    root.destroy() 
    

root = tk.Tk()
root.title("Calibration des Clics Automatiques")

root.bind("<Control-w>", close_app)
# Définir une taille de fenêtre fixe
root.geometry("400x225")  # Remplacez 600x400 par la taille souhaitée

instruction_label = ttk.Label(root, text="Appuyez sur le bouton pour calibrer.")

# Désactiver la possibilité de redimensionner la fenêtre
root.resizable(False, False)

# Garde la fenêtre en premier plan
root.attributes('-topmost', True)

new_text_entry = tk.Text(root, height=5, width=50)  # Taille de la zone de texte
new_text_entry.grid(row=6, column=0, columnspan=2, padx=10, pady=5, sticky="w")



calibrate_button = ttk.Button(root, text="Calibrer", command=calibrate)
calibrate_button.grid(row=2, column=0, padx=10, pady=5, sticky="w")

open_file_button = ttk.Button(root, text="Ouvrir Fichier", command=open_file, state=tk.DISABLED)
open_file_button.grid(row=5, column=0, padx=10, pady=5, sticky="w")

counter_label = ttk.Label(root, text="")
counter_label.grid(row=4, column=0, padx=10, pady=5, sticky="w")

empy = ttk.Label(root, text="")
empy.grid(row=0, column=0, padx=10, pady=5, sticky="w")

record_button = ttk.Button(root, text="Lancer l'enregistrement", command=click_positions, state=tk.DISABLED)
record_button.grid(row=5, column=1, padx=10, pady=5, sticky="w")

save_coordinates_button = ttk.Button(root, text="Enregistrer les coordonnées", command=save_coordinates, state=tk.DISABLED)
save_coordinates_button.grid(row=3, column=1, padx=10, pady=5, sticky="w")

load_button = ttk.Button(root, text="Restaurer dernier enregistrement", command=load_coordinates)
load_button.grid(row=3, column=0, padx=10, pady=5, sticky="w")

# Placement de l'étiquette d'instruction en dehors de la grille
instruction_label.place(x=15, y=10)  # Modifiez les coordonnées selon vos préférences

keyboard.add_hotkey("ctrl+w", close_emergency_window)

root.bind('<Return>', on_enter_press)
root.mainloop()
