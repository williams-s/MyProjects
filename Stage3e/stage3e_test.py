__author__ = 'anthonywi'
import cgi

form = cgi.FieldStorage()
print("Content-type: text/html; charset=utf-8\n")

print("Votre nom est : {}".format(form.getvalue("name")))

html = """<!DOCTYPE html>"""

html = html + """
<head>
    <title>le meilleur site du monde</title>
</head>
<body>
    <form action="/index.py" method="post">
        <input type="text" name="name" value="Votre nom" />
        <input type="submit" name="send" value="Envoyer information au serveur">
    </form>

    <h2><u>Le Meilleur site du monde</u></h2><strong>
    <h3><strong>By Williams ANTHONY<h3></strong>

<h3>Tu es plutot xbox playstation nintendo ou PC ?<h3>

    <input name="question1" type="radio" /> Playstation
    <input name="question1" type="radio" /> Xbox
    <input name="question1" type="radio" /> Nintendo
    <input name="question1" type="radio" /> PC

<h3>Tu preferes quel jeu entre les suivants ?<h3>

    <input name="question2" type="radio" /> Fifa
    <input name="question2" type="radio" /> Overwatch
    <input name="question2" type="radio" /> Destiny
    <input name="question2" type="radio" /> Call of duty
    <input name="question2" type="radio" />Street fighter
    <input name="question2" type="radio" />Dragon ball (xenoverse, fighterZ, budokai tenkaichi...)
    <input name="question2" type="radio" />Mario
    <input name="question2" type="radio" />Naruto (storm 1, 2, 3, 4)

<h3>Quelle equipe de foot tu preferes entre les suivants ?

    <input name="question3" type="radio" />PSG
    <input name="question3" type="radio" />BARCA
    <input name="question3" type="radio" />REAL
    <input name="question3" type="radio" />MAN U
    <input name="question3" type="radio" />Bayern
<h3>Pourquoi ?<h3>
     <input type="text" name="Joueur" placeholder=""  />

<h3>Quel est ton joueur favori dans cette equipe ?
     <input type="text" name="Joueur" placeholder="Joueur"  />

<h3>Quelle equipe de NBA preferes-tu parmi les suivantes ?
     <input name="question4" type="radio" />OKC
     <input name="question4" type="radio" />Lakers
     <input name="question4" type="radio" />Miami heat
     <input name="question4" type="radio" />Golden States
     <input name="question4" type="radio" />Bulls

<h3>Pourquoi ?<h3>
     <input type="text" name="Joueur" placeholder=""  />
<h3>Quel est ton joueur favori dans cette equipe ?
     <input type="text" name="Joueur" placeholder="Joueur"  />

<h3>Quel est ton manga prefere entre les prochains ?<h3>
     <input name="question5" type="radio" />One piece
     <input name="question5" type="radio" />Naruto,  Boruto
     <input name="question5" type="radio" />SNK (attack des titans)
     <input name="question5" type="radio" />DBZ, DBS
     <input name="question5" type="radio" />Fairy Tail
     <input name="question5" type="radio" />MHA (My hero academia)
     <input name="question5" type="radio" />Olive et Tom
     <input name="question5" type="radio" />Hunter X Hunter
     <input name="question5" type="radio" />Les chevaliers du zodiaque
     <input name="question5" type="radio" />Toriko

<h3>Quel est ton chanteur, rappeur prefere ?<h3>
    <input type="text" name="Chanteur" placeholder="Chanteur"  />


<p>"""

personnes = {}
personnes["champs"] = ["nom","age","hobbie","img",]
personnes["WILLIAMS"] = {"age":"13", "hobbie":"jeux videos et le football", "nom": "Williams", "img": "zaza.jpg"}
personnes["TILL"] = {"age":"44", "hobbie":"football","nom": "Till", "img": "club.jpg"}
personnes["MAAT"] = {"age":"6", "hobbie":"jeux videos","nom": "Maat", "img": "Sonic_67.png"}
personnes["CYRIELLE"] = {"age":"19", "hobbie":"La danse","nom": "Cyrielle", "img": "rff.jpg"}
table = "<table><tr>"
for c in personnes["champs"]:
    table = table + "<td>{}</td>".format(c)

table = table + "</tr>"

for personne in personnes:
    if personne == "champs":
        continue
    table += "<tr>"
    for c in personnes["champs"]:
        if c == "img":
            table += "<td><img src='../img/{}'/></td>".format(personnes[personne][c])
        else:
            table += "<td>{}</td>".format(personnes[personne][c])
    table += "</tr>"
table = table +"</table>"
html += table

html += """
</p>

    Toi aussi rejoins le meileur site du monde
    <form method="POST" action="/page-html-formulaire">
        <input type="text" name="nom*" placeholder="Nom*"  />
        <input type="text" name="prenom*" placeholder="Prenom*"  />
        <input type="text" name="Hobbies*" placeholder="Hobbies*"  />
        <input type="text" name="Ville*" placeholder="Ville*"  />
        <input type="text" name="Code Postal*" placeholder="Code Postal*"  />
        <input type="text" name="Adresse e-mail*" placeholder="Adresse e-mail*"  />
        <input type="text" name="Numero de telephone" placeholder="Numero de telephone"  />
        <input type="submit" class="btn" value="Valider" />

         informations obligatoires : *

    </form>
</p>
"""
print(html)
