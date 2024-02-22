#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <time.h>
#include <ctype.h>



void jeu(char code[5]);

//void clrscr() //Permet de nettoyer la console selon l'OS de l'utilisateur, malheureseument je crois que la fonction ne fonctionne pas tres bien sur les machines linux
//{
  //    system("@cls||clear");
//}


void CodeRandom(char *code) //Creer un code avec des couleurs aletoires.
{
    srand (time(NULL)); //Permet de g�n�rer un nombre al�atoire diff�rent � chaque appel.
    for (int i = 0; i < 4 ; i++)
    {
         int alea = rand() %6; // Choisi un chiffre aleatoire entre 0 et 5
         if (alea == 0)
            code[i] = 'J'; //Jaune
         if (alea == 1)
            code[i] = 'B'; //Bleu
         if (alea == 2)
            code[i] = 'R'; //Rouge
         if (alea == 3)
            code[i] = 'V'; //Vert
         if (alea == 4)
            code[i] = 'O'; //Orange
         if (alea == 5)
            code[i] = 'N'; //Noir
    }//Associe chaque chiffre a une des 6 couleurs
}







void verifCode(char *codesecret, char *essai, char *resultat) //Permet de tester la combinaison que le joeueur rentre afin de voir si il a trouver le code secret
{
    char essaiMaj[4];
    for(int i = 0; i < 4 ;i++)
    {
        essaiMaj[i]=toupper(essai[i]); // transforme en majuscule les minuscules (utile si jamais un joueur fais des propositions en minuscules)
    }

    int code_verification[4] = {0,0,0,0}; //Permet de verifier si la couleur � la position i (avec i appartient [[0,3]]) du code secret a ete verifiee ou pas (avec un 1 si oui et un 0 sinon)
    int proposition_check[4] = {0,0,0,0};   //Permet de verifier si la couleur � la position i (avec i appartient [[0,3]]) de la proposition du joueur a ete verifiee ou pas (avec un 1 si oui et un 0 sinon)
    int j = 0;
    for(int i = 0; i < 4 ; i++)
    {
        if (essaiMaj[i]==codesecret[i])
        {
          resultat[j] = 'R'; //Met a la position j un R ou un B (en fonction de la proposition du joueur) dans la chaine de caracteres
          code_verification[i] = 1;
          proposition_check[i] = 1;
          j++;
        }
    }
    for(int i = 0; i < 4 ; i++)
    {
        for(int k = 0; k < 4 ; k++)
        {
            if (essaiMaj[k]==codesecret[i] && code_verification[i] !=1)
            {
                if (proposition_check[k] != 1 )
                {
                    resultat[j]= 'B';  //Met a la position j un R ou un B (en fonction de la proposition du joueur) dans la chaine de caracteres
                    code_verification[i] = 1;
                    proposition_check[k] = 1;
                    j++;
                }
            }
        }
     }
}



bool verifCouleur(int indice,char code[100]) //Verifie que les couleurs entrees par l utilisateur sont presentes dans le jeu et verifie aussi qu'il y a le bon nombre de couleurs
{
    for (int i = 0 ; i < 4; i++)
    {
        if (code[i]=='r' || code[i]=='v' || code[i]=='b' || code[i]=='j' || code[i]=='o' || code[i]=='n' || code[i]=='R' || code[i]=='V' || code[i]=='B' || code[i]=='J' || code[i]=='O' || code[i]=='N' )
        {
            indice++;
        }
        else
        {
            indice--;
        }
    }
    if (strlen(code) != 4)
    {
        return false;
    }
    if (indice !=4)
    {
        return false;
    }
    return true;
}






void unjoueur() //Lance le jeu contre l'ordinateur
{
    char code[5];
    CodeRandom(code);
    //clrscr();
    jeu(code); //Lance le jeu avec le code de l'ordinateur
}


void deuxjoueurs() //Lance le jeu avec deux joueurs
{
    char code[100];
    //clrscr();
    printf("\nLe premier joueur doit entrer le code de 4 couleurs qu'il veut faire trouver au second joueur :\n");
    printf("Couleurs : \n" );
    printf("(R) : Rouge / (B) : Bleu / (N) : Noir / (V): Vert  / (J) : Jaune / (O) : Orange  \n" );
    printf("Entrez le code : ");
    scanf("%s", code);
    int verif = 0;
    for (int i = 0 ; i < 4 ; i++)
    {
        code[i] = toupper(code[i]);
    }

    if (verifCouleur(verif,code) == false)
    {
        printf("Certaines couleurs renseignees ne sont pas presentes dans le jeu ou il n'y a pas le bons nombre de couleurs, veuillez recommencer\n\n");
        deuxjoueurs();
    }
    else {
    for (int i = 0; i < 100 ; i++) //Permet de faire un assez grand saut de ligne pour que le joueur 2 ne puisse pas voir le code entre par le joueur 1
      {
        printf("\n");
      }
    jeu(code); //Lance le jeu avec le code du joueur 1
    }
}






void nbjoueurs() //Permet de choisir entre le mode solo et le mode multijoueur
{
  //clrscr();
    printf("Combien de joueurs ?\n\n");
    printf("1 : -1 joueur\n");
    printf("2 : -2 joueurs\n");
    printf("Taper un autre chiffre vous fera revenir au menu principal\n");
    int nbjoueurs = 0;
    scanf("%d",&nbjoueurs);
    if (nbjoueurs == 1)
        unjoueur();

    if (nbjoueurs == 2)
        deuxjoueurs();
    //clrscr();
}





void regles() //Affiche les regles du mastermind
{
  //clrscr();
    printf("REGLES DU MASTERMIND: \n\n" );
    printf("Le programme ou le premier joueur choisit une combinaison de 4 pions de couleurs au hasard parmi 6 couleurs disponibles.\n" );
    printf("Cette combinaison de pions peut contenir plusieurs fois la meme couleur.\n" );
    printf("L utilisateur ou le second joueur essaie de la deviner en proposant au maximum dix combinaisons.\n" );
    printf("Si dans la proposition, un ou plusieurs pions de couleurs sont bien dans la combinaison mais pas a la bonne place, le \n" );
    printf("programme renvoie alors une languette blanche (ici representee par un 'B') selon le nombre.\n");
    printf("Si dans la proposition, un ou plusieurs pions de couleurs sont bien dans la combinaison et a la bonne place, le \n" );
    printf("programme renvoie alors une languette rouge (ici representee par un 'R') selon le nombre.\n\n");

    printf("Appuyer sur un chiffre pour revenir au menu  (si ce n'est pas un entier le programme va plante) \n" );
    int choix = 0;
    scanf("%d", &choix);
    // clrscr();
}





void menu() //Permet d'afficher le menu principal
{
         printf("MASTERMIND LE JEU \n\n\n");
         printf("MENU PRINCIPAL \n\n" );
         printf(" 1 : Jouer\n" );
         printf(" 2 : Regles du jeu\n" );
         printf(" 3 : Quitter\n\n" );
         printf("Tapez le numero qui correspond a ce que vous voulez faire :\n\n" );
}




void jeu(char code[5]) //Fonction  affichant le plateau du jeu ainsi que les propositions tentees par le joueur et les reponses du programme
{
    int essaisFinal = 0, essais=0;
    char proposition[10][4]={
                        {'-','-','-','-'},
                        {'-','-','-','-'},
                        {'-','-','-','-'},
                        {'-','-','-','-'},
                        {'-','-','-','-'},
                        {'-','-','-','-'},
                        {'-','-','-','-'},
                        {'-','-','-','-'},
                        {'-','-','-','-'},
                        {'-','-','-','-'},
                    };
    char reponse[10][4]={
                        {' ',' ',' ',' '},
                        {' ',' ',' ',' '},
                        {' ',' ',' ',' '},
                        {' ',' ',' ',' '},
                        {' ',' ',' ',' '},
                        {' ',' ',' ',' '},
                        {' ',' ',' ',' '},
                        {' ',' ',' ',' '},
                        {' ',' ',' ',' '},
                        {' ',' ',' ',' '},
                    };

    char prop[5] = {'\0'}; //Chaque proposition du joueur
    while (essais <=9)
    {
        char resultat[4]={'.','.','.','.'}; //Nous permet d'utiliser la fonction verifCode de type void afin de renvoyer soit un R ou un B en fonction des propositions du joueur
        //clrscr();
        printf("Couleurs : \n" );
        printf("(R) : Rouge / (B) : Bleu / (N) : Noir / (V): Vert  / (J) : Jaune / (O) : Orange  \n" );
        printf(" Vos essais :     Les reponses du programme : \n\n");

        for (int i = 0 ; i < 10 ;i++) //Permet d'afficher le plateau (les propositions du joueur ainsi que les reponses du programme)
        {
            printf("[");
            for (int j = 0; j < 4 ; j++)
            {
                printf (" |%c|",proposition[i][j]); //Affiche les propositions du joueur
            }

            printf("    "); //Met un espace entre les propositions et les reponses

            for (int j = 0; j < 4; j++) //Affiche les reponses du programme
                printf("{%c}",reponse[i][j]);

            printf (" ]\n" );
        }

        printf("\n");
        int verif = 0;
        while (true)
        {
            verif=0; //Utile pour la fonction verifCouleur
            printf("Essai(s) : %d \n",essais);
            printf("Entrez le code : ");
            scanf("%s", prop);
            verifCouleur(verif,prop);
            if (verifCouleur(verif,prop) == false) //Si la proposition du joueur n'est pas conforme aux regles, le joueur doit rentrer une autre proposition jusqu'a ce qu'elle soit conforme
            {
                printf("Certaines couleurs renseignees ne sont pas presentes dans le jeu ou il n'y a pas le bons nombre de couleurs, veuillez recommencer\n\n");
            }
            else //Si la proposition est conforme, on casse la boucle while et on passe a la suite
            {
                break;
            }
        }

        verifCode(code,prop,resultat); //Appelle la fonction verifCode pour verifier les "similitudes" entre le code secret et la proposition du joueur et affecte a resultat les reponses 'R' ou 'B' ou '.' (cf regles du jeu)

        for (int i = 0; i < 4; i++ )
        {
            proposition[essais][i]=prop[i]; //Met dans le plateau la proposition du joueur pour chaque essai
            reponse[essais][i]=resultat[i]; //Met dans le plateau les reponses du programme en fonction des "similitudes" entre le code secret et la proposition du joueur
        }


        if (resultat[0]=='R' && resultat[1]=='R' && resultat[2]=='R' && resultat[3]=='R') //Si il y a 4 'R', cela signifie que le joueur a trouver le code secret
        {
            essaisFinal = essais + 1;
            essais = 1000; // Met essais a 1000 afin de sortir de la boucle (while (essais <=9)) car le joueur a trouver le code secret
        }
        else
        {
            essais++;
        }

    }


    //clrscr();
    int choix = 0;
    if (essais == 1000) //Si essais est a 1000 alors le joueur a trouver le code secret
    {
        printf("\n FELICITATIONS !\n" );
        printf("\n VOUS AVEZ TROUVE LE CODE SECRET EN : %d essais ! \n", essaisFinal );
        printf(" Le code est : %s\n\n",code);
        printf("Tapez (0) pour revenir au menu principal ou (1) pour rejouer : " );
        scanf ("%d",&choix);
    }
    else //Sinon cela veut dire que les 10 essais sont fini et que le joueur n'a pas trouve le code secret, il a donc perdu
    {
        printf("Dommage vous n'avez pas reussi a trouver le code secret qui etait : %s\n\n",code);
        printf("Tapez (0) pour revenir au menu principal ou (1) pour rejouer : " );
        scanf ("%d",&choix);
    }
    //clrscr();

    if (choix == 1) //Si choix = 1 alors on relance une perdu sinon on revient au menu principal
    {
        nbjoueurs();
    }

}


int main (void)
{
    int choix = 0;
    while (true)
    {
        menu();
        scanf("%d",&choix);
        if (choix == 1) //Jouer
        {
            nbjoueurs();
        }

        if (choix == 2) //Regles du jeu
        {
            regles();
        }

        if (choix == 3) //Quitter
        {
            break;
        }

        if (choix <=0 || choix > 3)
        {
            printf("Veuillez taper un chiffre entre 1 et 3\n\n\n\n\n" );
        }
    }
    return 0;
}




