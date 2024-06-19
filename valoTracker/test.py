from selenium import webdriver
from selenium.webdriver.firefox.options import Options

# Chemin vers l'exécutable Firefox
firefox_path = "/usr/bin/firefox"

options = Options()
options.binary_location = firefox_path

try:
    driver = webdriver.Firefox(options=options)
    driver.get("https://www.google.com")
    print("Firefox a été lancé avec succès.")
    driver.quit()
except Exception as e:
    print(f"Erreur : {e}")
