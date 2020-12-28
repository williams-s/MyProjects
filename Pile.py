class Pile :
    def __init__(self,numero):
        self.objet = []
        self.numero = numero

##    def __str__(self):
##        return "La pile vers  contient {} éléments".format(self.numero)
##        
    def depiler(self):
        if self.objet != []:
            return self.objet.pop()

    def empiler(self,x):
        return self.objet.append(x)

tour1 = Pile(1)
tour2 = Pile(2)
tour3 = Pile(3)
#tour1.empiler(1)
#tour1.empiler(2)
#tour1.depiler()
#print(tour1)


    

    

