from Pile import *
##from turtle import*
def jeu():
    global n
    n = int(input("Combien de palets dans la Tour 1 ? "))
    d = Pile(1)
    i = Pile(2)
    a = Pile(3)
    global c
    c = 0
    def hanoi(n,d,i,a):
        if n !=0:
            global c
            hanoi(n-1,d,a,i)
            i.empiler(d.depiler())
            c = c + 1
            print("Déplacement de la Tour",d.numero,"vers la Tour",a.numero)
            hanoi(n-1,a,i,d)
    hanoi(n,d,i,a)
    print("Nombre de coup(s) :",c)

jeu()
##hideturtle()
##class Rectangle:
##    def __init__(self,largeur):
##        self.largeur=largeur
##        penup()
##        goto(0,0)
##        pendown()
##
##    def trace(self):
##        forward(self.largeur/2)
##        left(90)
##        forward(10)
##        left(90)
##        forward(self.largeur)
##        left(90)
##        forward(10)
##        left(90)
##        forward(self.largeur/2)
##
##    def monter(self):
##        penup()
##        goto(0,10)
##        self.trace()
##        
##
##A = Rectangle(n*10)
##B = Rectangle(n*9)
##A.trace()
##B.monter()

        
##############Très bien  20/20###############"
        
