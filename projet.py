import csv

repertoire = []
Listee =[]
Listeee = []




def Personne():
    repertoire = {"Nom" : "", "Prenom" : "", "Adresse": "", "Date de naissance" : "", "Numero de Telephone": "", "Numero de Telephone 2" : "", "Notes" : ""}
    Nom = input("Quel est le nom de la personne ? :")
    print("")
    Prenom =input("Quel est son prénom ? :")
    print("")
    Adresse = input ("Quel est son Adresse ? :")
    print("")
    Birth = input ("Sa date de naissance ? : ")
    print("")
    print("Voulez-vous mettre un numéro de Téléphone ? \n-1 Oui \n-2 Non")
    print("")
    a = int(input("Votre choix :"))
    if a == 1:
        Num = int(input ("Son numéro de téléphone ? :"))
        chiffre = str(Num)
        Num = "+33 " + chiffre
    elif a == 2:
        print("")
        Num = ""
        Num2 = ""
    else:
        print("Vous n'avez pas tapé un numero entre 1 et 2")
        Num = ""
        Num2 = ""
    print("")
    if a == 1:
        print("Ajouter un autre numéro de téléphone ? \n-1 Oui \n-2 Non ")
        print("")
        b = int(input("Votre choix : "))
        if b == 1 :
            Num2 = int(input ("Son deuxieme numéro de téléphone ? :"))
            chiffre = str(Num2)
            Num2 = "+33 " + chiffre 
        elif b == 2:
            print("")
            Num2 = ""
        else:
            print("Vous n'avez pas tapé un numero entre 1 et 2")
            Num2 = ""
    print("")
    Notes = input("Notes à rajouter sur cette personne : ")
    Nom = Nom.lower()
    Prenom = Prenom.lower()
    Adresse = Adresse.lower()
    Birth = Birth.lower()
    Notes = Notes.lower()
    repertoire["Nom"] = Nom
    repertoire["Prenom"] = Prenom
    repertoire["Adresse"] = Adresse
    repertoire["Date de naissance"] = Birth
    repertoire["Numero de Telephone"] = Num
    repertoire["Numero de Telephone 2"] = Num2
    repertoire["Notes"] = Notes
    print("")
    print("")
    return repertoire



def recherche(liste,n):
    L =[]
    for i in range(len(liste)):
        n = n.lower()
        if liste[i]["Nom"] == n or liste[i]["Prenom"] ==n:
            L.append(n)
            print("")
            print("Il y a bien ",n,", present dans le repertoire")
            print(liste[i])
    if n not in L:
        print("")
        print("Il n'y a pas",n,"present dans le repertoire")
    return ""




        
     
def ajoute(repertoire,Personne):
    repertoire.append(Personne)



def modifier(repertoire,Personne):
    print("")
    print(Personne)
    print("Que voulez-vous modifier ? :\n \n -1 Nom \n -2 Prenom \n -3 Adresse \n -4 Date de naissance \n -5 Numero de Telephone \n -6 Numero de Telephone 2 \n -7 Notes "" \n ")
    a = int(input("Votre choix :"))
    print("")
    if a == 1:
        a = "Nom"
    elif a ==2:
        a = "Prenom"
    elif a ==3:
        a = "Adresse"
    elif a == 4:
        a = "Date de naissance"
    elif a == 5:
        a = "Numero de Telephone"
    elif a == 6:
        a = "Numero de Telephone 2"
    elif a == 7:
        a = "Notes"
    else:
        print("Vous n'avez pas tapé un numéro entre 1 et 7\n Veuillez réessayer")
        return modifier(repertoire,Personne)
    if a == "Numero de Telephone" or a == "Numero de Telephone 2":
        b = int(input("Que voulez-vous mettre à la place ? : "))
        b = "+33 " + str(b) 
    else:
        b = input("Que voulez-vous mettre à la place ? : ")
        b = b.lower()
    print("")
    Personne[a] = b
    print("")
    return ""



def retirer (repertoire,Personne):
    repertoire.remove(Personne)


def miseAjour():
    with open("MonRepEssaie.csv","w") as csv_file:
        fieldnames = ["Nom" , "Prenom"  , "Adresse" , "Date de naissance" , "Numero de Telephone", "Numero de Telephone 2" , "Notes"]
        writer = csv.DictWriter(csv_file,fieldnames = fieldnames)
        writer.writeheader()
        for el in repertoire:
            writer.writerow(el)
    csv_file.close()

reader = csv.DictReader(open("MonRepEssaie.csv","r"))
for el in reader:
    repertoire.append(dict(el))



def interface():        
    print("Que voulez-vous faire : \n")
    print("-1 : Rechercher une personne de votre répertoire")
    print("-2 : Ajouter une personne dans votre répertoire")
    print("-3 : Modifier une personne de votre répertoire")
    print("-4 : Retirer une personne de votre répertoire")
    print("-5 : Afficher votre répertoire ")
    print("-6 : Quitter")
    print("")
    menu = int(input("Votre choix : "))    
    if menu == 1:
        if repertoire == []:
            print("")
            print("Votre répertoire est vide !")
            print("")
            return interface()
        else:
            print("Qui recherchez-vous ?")
            print("")
            a = input("Votre choix : ")
            print(recherche(repertoire,a))
            print("")
            print("")
        return interface()
    elif menu == 2 :
        print("Ajoutez les informations de la personne que vous voulez ajouter")
        print("")
        personneA = Personne()
        ajoute(repertoire,personneA)
        miseAjour()
        print("Voici votre nouveau répertoire")
        print("")
        print("La personne suivante a été ajoutée à votre répertoire : ",personneA["Nom"], personneA["Prenom"])
        print("")
        print("")
        return interface()
    elif menu == 3:
        if repertoire == []:
            print("")
            print("Votre répertoire est vide !")
            print("")
            return interface()
        print("Il y a les personnes ci dessous dans votre répertoire")
        print("")
        print("(Trié par Nom de Famille)")
        print("(Nom de Famille / Prénom)")
        print("")
        for i in range(len(repertoire)):
            dic = repertoire[i]
            ac = dic["Nom"], dic["Prenom"]
            Listeee.append(ac)
            #print(dic["Nom"]," / ", dic["Prenom"])
        while Listeee != []:
            Listeee.sort()
            print(Listeee[0])
            rem0 = Listeee.remove(Listeee[0])
        print("")
        print("")
        print("Qui voulez-vous modifier ?")
        print("")
        A = input("Son nom de Famille : ")
        B = input("Son prénom :")
        A = A.lower()
        B = B.lower()
        compt = 0
        for i in range(len(repertoire)):
            if A == repertoire[i]["Nom"] and B == repertoire[i]["Prenom"]:
                compt = 1
                modifier(repertoire,repertoire[i])
                print(repertoire[i]["Nom"], repertoire[i]["Prenom"], "a été modifié")
                miseAjour()
        if compt != 1:
            print("Il n'y a pas",A, B,"dans votre répertoire")
        print("")
        print("")
        return interface()
    elif menu == 4:
        if repertoire == []:
            print("")
            print("Votre répertoire est vide !")
            print("")
            return interface()
        print("Il y a les personnes ci dessous dans votre répertoire")
        print("")
        print("(Trié par Nom de Famille)")
        print("(Nom de Famille / Prénom)")
        print("")
        for i in range(len(repertoire)):
            dic = repertoire[i]
            ab = dic["Nom"], dic["Prenom"]
            Listee.append(ab)
            #print(dic["Nom"]," / ", dic["Prenom"])
        while Listee != []:
            Listee.sort()
            print(Listee[0])
            rem = Listee.remove(Listee[0])
        print("")
        print("")
        print("Qui voulez-vous supprimer ?")
        print("")
        A = input("Son nom de Famille : ")
        B = input("Son prénom :")
        A = A.lower()
        B = B.lower()
        comt = 0
        for i in range(len(repertoire)):
            if A == repertoire[i]["Nom"] and B == repertoire[i]["Prenom"]:
                retirer(repertoire,repertoire[i])
                miseAjour()
                comt = 1
                print("")
                print("Cette personne ne fais plus partie de votre répertoire")
                print("")
                return interface()
        if comt != 1:
                print("Il n'y a pas",A, B,"dans votre répertoire")
                print("")
                return interface()
    elif menu == 5:
        print("")
        if repertoire == []:
            print("Votre répertoire est vide !")
        else:
            print("Voici votre répertoire")
            for i in range(len(repertoire)):
                print("Nom : ",repertoire[i]["Nom"],"  /Prénom : ",repertoire[i]["Prenom"],"  /Adresse : ",repertoire[i]["Adresse"],"  /Date de naissance : ",repertoire[i]["Date de naissance"],"  /Numero de Telephone : ",repertoire[i]["Numero de Telephone"],"  /Numero de Telephone 2 : ",repertoire[i]["Numero de Telephone 2"], "  /Notes : ",repertoire[i]["Notes"])
                print("")
                print("")
        print("")
        return interface()
    elif menu == 6:
        print("Etes-vous sûr ?")
        print("-1 : Oui \n-2 : Non")
        print("")
        a =int(input("Votre choix :"))
        if a == 1:
            print("Au revoir !")
        elif a==2:
            return interface()
        else:
            print("Vous n'avez pas tapé un numéro entre 1 et 2 \n Retour au menu")
            print("")
            print("")
            return interface()
    else:
        print("")
        print("Vous n'avez pas tapé un numéro entre 1 et 6 \n Veuillez réessayer")
        print("")
        print("")
        return interface()
        

    
interface()

#On lance le programme avec la fonction "interface()"
#Puis on tape des numéros selon l'action que l'on veut faire










        



