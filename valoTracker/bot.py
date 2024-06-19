import os
import time
import discord
import asyncio
from discord.ext import tasks
from discord import app_commands
import requests, re
from bs4 import BeautifulSoup

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver import FirefoxOptions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from selenium.webdriver.edge.service import Service
from selenium.webdriver.firefox.options import Options
import psycopg2

from flask import Flask
app = Flask(__name__)

# Token du bot Discord
TOKEN = ''

# URL de base de tracker.gg pour Valorant
BASE_URL = 'https://valorant.op.gg/profile/{}'

# Liste des joueurs à surveiller
tracked_players = []

# Dernières données des joueurs
last_results = {}

# Intents nécessaires pour le bot
intents = discord.Intents.default()

# Création du client
class MyClient(discord.Client):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.tree = app_commands.CommandTree(self)

    async def on_ready(self):
        await self.tree.sync()
        check_players.start()
        print(f'Bot connecté en tant que {self.user}')
        selectBDD()
        

client = MyClient(intents=intents)

def setEspace(url):
    return url.replace(" ","%20")


# Commande pour ajouter un joueur à la liste de surveillance
@client.tree.command(name='add', description='Ajoute un joueur à la liste de surveillance')
async def track(interaction: discord.Interaction, player_tag: str):
    player_tag = formattedName(player_tag)
    if insertBDD(player_tag) == 1:
        print(f"Player {player_tag} added to last_results")
        last_results[player_tag] = get_results(get_player_data(player_tag))
        tracked_players.append(player_tag)
        embed = discord.Embed(
        title="Ajout de joueur",
        description=f"{player_tag} est maintenant **suivi**.",
        color=discord.Color.green()  # Vous pouvez utiliser différentes couleurs ici
    )
        await interaction.response.send_message(embed=embed)
    else:        
        embed = discord.Embed(
        title="Ajout de joueur existant",
        description=f"{player_tag} est déja suivi.",
        color=discord.Color.red()  # Vous pouvez utiliser différentes couleurs ici
    )
        await interaction.response.send_message(embed= embed)

# Commande pour retirer un joueur de la liste de surveillance
@client.tree.command(name='delete', description='Retire un joueur de la liste de surveillance')
async def untrack(interaction: discord.Interaction, player_tag: str):
    player_tag = formattedName(player_tag)
    if delete_from_BDD(player_tag) == 1:
        tracked_players.remove(player_tag)
        embed = discord.Embed(
        title="Suppression d'un joueur",
        description= f"{player_tag} n'est plus suivi.",
        color=discord.Color.red()  # Vous pouvez utiliser différentes couleurs ici
    )
        await interaction.response.send_message(embed=embed)
    else:
        embed = discord.Embed(
        title="Suppression d'un joueur inexistant",
        description= f"{player_tag} n'est pas dans la liste",
        color=discord.Color.red()  # Vous pouvez utiliser différentes couleurs ici
    )
        await interaction.response.send_message(embed=embed)

# Commande pour lister les joueurs suivis
@client.tree.command(name='list', description='Liste les joueurs actuellement suivis')
async def list_players(interaction: discord.Interaction):
    if tracked_players:
        embed = discord.Embed(
        title="Liste des joueurs",
        description= "\n".join(sorted(tracked_players)),
        color=discord.Color.pink()  # Vous pouvez utiliser différentes couleurs ici
    )
        await interaction.response.send_message(embed=embed)
    else:
        embed = discord.Embed(
        title="Liste des joueurs",
        description= "Aucun joueur n'est actuellement suivi.",
        color=discord.Color.pink()  # Vous pouvez utiliser différentes couleurs ici
    )
        await interaction.response.send_message(embed=embed)





def refresh_data(url):
    try:
        # Créer un objet Options pour Firefox
        options = Options()

        # Spécifier le chemin vers le profil Firefox créé précédemment
        #profile_path = '/home/williams/snap/firefox/common/.mozilla/firefox/pf9715mk.test'
        #options.profile = webdriver.FirefoxProfile(profile_path)

        # Activer le mode headless
        #options.headless = True
        
        # Créer un objet WebDriver pour Firefox
        driver = webdriver.Firefox(options=options)

        #print("Navigateur ouvert avec succès.")

        # Charger la page web
        driver.get(url)

        # Attendre que le bouton "Update" soit cliquable
        update_button = WebDriverWait(driver, 10).until(
           EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[data-key="update_button"].renew-button'))
        )

        #print("Le bouton 'Update' est cliquable.")
        # Cliquer sur le bouton "Update"
        update_button.click()
        #asyncio.sleep(5)

        # Fermer le navigateur
        driver.quit()

    except Exception as e:
        print(f"Une erreur s'est produite : {e}")




def getRatios(ratios):
    if ratios == [] :
        return ["0","0%","0"]
    if len(ratios) >=2:
        ratios[1] = ratios[1] + "%"
    return ratios

# Fonction pour récupérer les données du profil
def get_player_data(player_tag):
    url = BASE_URL.format(player_tag.replace('#', '-'))
    url = setEspace(url) 
    #print(url)
    #refresh_data(url)
    #time.sleep(30)
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    matches = soup.find_all('div', class_='css-4vokfb') 

    # Parcourir chaque match
    results = []
    div_rank = soup.find('div', class_='css-pp8ax6')
    img_element = div_rank.find('img')
    img_rank = ""
    if img_element:
        img_rank = img_element['src']
    else:
        img_rank = "https://imgsvc.trackercdn.com/url/max-width(60),quality(60)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Fvalorant%2Ficons%2Ftiersv2%2F0.png/image.png"
    tier_rank = div_rank.find('strong', class_='tier-rank').text
    for match in matches:
        # Récupérer le type de file
        queue_type = match.find('div', class_='queue-type').text
        # Vérifier si c'est un match compétitif
            # Récupérer le résultat et la durée
        r = match.find('div', class_='result').div
        result = ""
        if r is not None:
            result = match.find('div', class_='result').div.text
        duration = match.find('div', class_='result').span.text
        kills = match.find('span', class_='kda-kill').text
        deaths = match.find('span', class_='kda-death').text
        assists = match.find('span', class_='kda-assist').text
        map = match.find('div', class_='map-name').text
        scoreGame = match.find_all('div', class_='game-score')
        div_tag = match.find('div', class_='game-score')
        spans = div_tag.find_all('span')
        scores = []
        for span in spans:
            scores.append(span.text)
        a_tag = match.find('a', class_='css-1biev8v')
        match_stat_div = match.find('div', class_='match-stat')
        numbers = re.findall(r'(\d+\.\d+)|\d+%', match_stat_div.text)
        ratios = []
        # Afficher les nombres extraits
        for number in numbers:
            ratios.append(number)
        # Récupérer l'attribut alt
        perso = a_tag.img['alt']
        image = a_tag.img['src']
        #print(image)
        #print("Résultat:", result)
        #print("Durée:", duration)
        kda = [kills, deaths, assists]
        result = [result, kda, map, scores,perso, duration, image, getRatios(ratios),queue_type]
        #print("KDA: ", kda[0] + " / " + kda[1] + " / " + kda[2])
        results.append(result)
        #print("Resultat:", result)
    return results,[img_rank, tier_rank]

def get_results(results):
    res = []
    for result in results:
        res.append(result[0])
    return res

def getScore(score):
    res = ""
    for i in score:
        res += i + "/"
    return f"**{res[:-1]}**"



# Tâche périodique pour vérifier les résultats des joueurs suivis
@tasks.loop(minutes=20)
async def check_players():
    for player in tracked_players:
        try:
            refresh_data(BASE_URL.format(player.replace('#', '-')))
            tmp = get_player_data(player)
            stats = tmp[0]
            rank = tmp[1]
            data = get_results(stats)
            #print(f"Vérification des données pour {player}: {data}")  # Log les données récupérées
            if player in last_results:
                if data != last_results[player]:
                    if stats[0][8] == "Competitive":
                        new_result = data[0]  # Supposons que le résultat le plus récent est en tête de liste
                        channel = discord.utils.get(client.get_all_channels(), name='général')  # Remplacer par le nom de votre canal
                        print(f"Nouveau résultat pour {player}: {new_result}")  # Log le nouveau résultat
                        if 'Victory' in new_result:
                            await sendMessage("Victory",f"{player} a gagné un match !",discord.Color.green(),getScore(stats[0][3]),getScore(stats[0][1]),stats[0][2],stats[0][4],stats[0][5],stats[0][6],stats[0][7],rank) 
                            #channel.send(f"{player} a gagné un match {getScore(stats[0][3])} en {getScore(stats[0][1])} sur {stats[0][2]} en jouant {stats[0][4]} durant {stats[0][5]}.")
                        elif 'Lose' in new_result:
                            await sendMessage("Defeat",f"{player} a perdu un match !",discord.Color.red(),getScore(stats[0][3]),getScore(stats[0][1]),stats[0][2],stats[0][4],stats[0][5],stats[0][6],stats[0][7],rank) 
                            #channel.send(f"{player} a perdu un match {getScore(stats[0][3])} en {getScore(stats[0][1])} sur {stats[0][2]} en jouant {stats[0][4]} durant {stats[0][5]}.")
                        elif 'Draw' in new_result:
                            await sendMessage("Draw",f"{player} a fait egalité dans un match !",discord.Color.yellow(),getScore(stats[0][3]),getScore(stats[0][1]),stats[0][2],stats[0][4],stats[0][5],stats[0][6],stats[0][7],rank) 
                            #channel.send(f"{player} a fait egalité dans un match {getScore(stats[0][3])} en {getScore(stats[0][1])} sur {stats[0][2]} en jouant {stats[0][4]} durant {stats[0][5]}.")
            last_results[player] = data
        except Exception as e:
            print(f"Erreur lors de la récupération des données pour {player}: {e}")
        

def sendMessage(titre,message,col,score,kda,map,champion,duration,image,ratios,rank):
    channel = discord.utils.get(client.get_all_channels(), name='games-valo')  # Remplacer par le nom de votre canal
    embed = discord.Embed(
        title=titre,
        description=message + " et est actuellement " + rank[1],
        color=col  # Vous pouvez utiliser différentes couleurs ici
    )
    embed.set_thumbnail(url=image)
    embed.set_image(url=resize_image(rank[0]))
    embed.add_field(name="Score",value=score,inline=True)
    embed.add_field(name="KDA",value=kda)
    embed.add_field(name="Agent",value=champion,inline=True)
    embed.add_field(name="Map",value=map,inline=True)
    embed.add_field(name="Durée",value=duration,inline=True)
    embed.add_field(name="Score de combat",value=ratios[0])   
    embed.add_field(name="Headshot rate",value=ratios[1],inline=True)
    embed.add_field(name="Damage par round",value=ratios[2],inline=True)
    return channel.send(embed=embed)

def resize_image(url):

    if url == "https://imgsvc.trackercdn.com/url/max-width(60),quality(60)/https%3A%2F%2Ftrackercdn.com%2Fcdn%2Ftracker.gg%2Fvalorant%2Ficons%2Ftiersv2%2F0.png/image.png" :
        return url 

    # Ajouter le préfixe "https://" si nécessaire
    if not url.startswith("https://"):
        url = "https://" + url

    # Remplacer les paramètres de taille de l'image par 60x60 pixels
    new_url = re.sub(r"w_\d+", "w_60", url)
    new_url = re.sub(r"h_\d+", "h_60", new_url)

    return new_url

def formattedName(name : str):
    res = name
    res = res.capitalize()
    res2 =""
    for i in range(len(res)):
        if res[i] == '#':
            res2 += res[i:].upper()
            break
        res2 += res[i]
    return res2
# Démarrer le client


@client.tree.command(name='update', description='Mettre à jour les données des joueurs')
async def update_players(interaction: discord.Interaction):
    await interaction.response.send_message('Mise à jour des données des joueurs en cours...')
    results, [img_rank, tier_rank] = check_players(tracked_players)
    for player_tag, data in results.items():
        if player_tag in tracked_players:
            last_results[player_tag] = data
            embed = discord.Embed(
                title="Données mises à jour",
                description=f"Les données de {player_tag} ont été mises à jour.",
                color=discord.Color.blue()  # Vous pouvez utiliser différentes couleurs ici
            )
            await interaction.user.send(embed=embed)
    await interaction.followup.send('Mise à jour des données des joueurs terminée.')



def selectBDD():
    try:
        connection = psycopg2.connect(
            user="toto",
            password="Ravus77!",
            host="localhost",
            port="5432",
            database="test"
        )
        cursor = connection.cursor()
        
        select_query = '''
        SELECT * FROM infos
        '''
        cursor.execute(select_query)
        records = cursor.fetchall()
        for record in records:
            tracked_players.append(record[0])

    except (Exception, psycopg2.Error) as error:
        print("Erreur lors de la lecture des données", error)
    finally:
        if connection:
            cursor.close()
            connection.close()
            print("Connexion à PostgreSQL fermée")


def insertBDD(stri):
    try:
        connection = psycopg2.connect(
            user="toto",
            password="Ravus77!",
            host="localhost",
            port="5432",
            database="test"
        )
        cursor = connection.cursor()
        
        insert_query = '''
        INSERT INTO infos VALUES (%s)
        '''
        # Assurez-vous que record_to_insert est un tuple
        record_to_insert = (stri,)
        cursor.execute(insert_query, record_to_insert)
        connection.commit()
        return 1

    except (Exception, psycopg2.Error) as error:
        return 0
    finally:
        if connection:
            cursor.close()
            connection.close()
            #print("Connexion à PostgreSQL fermée")

def delete_from_BDD(stri):
    try:
        # Connexion à la base de données
        connection = psycopg2.connect(
            user="toto",
            password="Ravus77!",
            host="localhost",
            port="5432",
            database="test"
        )
        cursor = connection.cursor()
        
        # Requête SQL pour supprimer une ligne
        delete_query = '''
        DELETE FROM infos WHERE name = %s;
        '''
        cursor.execute(delete_query, (stri,))
        rows_deleted = cursor.rowcount  # Nombre de lignes supprimées
        connection.commit()
        
        if rows_deleted > 0:
            return 1
        else:
            return 0
            #print("Aucune donnée n'a été supprimée. Vérifiez vos critères de suppression.")

    except (Exception, psycopg2.Error) as error:
        #print("Erreur lors de la suppression des données", error)
        return 0
    finally:
        if connection:
            cursor.close()
            connection.close()
            #print("Connexion à PostgreSQL fermée")


client.run(TOKEN)


