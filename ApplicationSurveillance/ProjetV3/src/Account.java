import java.awt.CardLayout;
import java.awt.Color;
import java.awt.Container;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.swing.BorderFactory;
import javax.swing.JCheckBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.border.Border;

public class Account extends JPanel implements KeyListener,ActionListener {

    

    JFrame f = Fenetre.f;
    Color BG = Fenetre.BG;
    JLabel register = Page.register; 
    CardLayout cardLayout = Page.cardLayout;
    CardLayout cardLayoutF = Fenetre.cardLayout;
    Container container = Fenetre.container;
    JCheckBox stayConnect; 
    static final int HEIGHT = Fenetre.HEIGHT;
    static final int WIDTH = Fenetre.WIDTH;
    static final int BOUTONHEIGHT = 50;
    static final int BOUTONWIDTH = WIDTH/4;
    
    JPasswordField mdp;
    JTextField mailInput;
    int essais ; //Nb d essais pour l'authentification

    FileWriter fileWriter;
    static int stayConnectHeight = 20;
    static int tickness = 5;
    static Color bleu = new Color(80,185, 199);
    static Border contour = BorderFactory.createLineBorder(bleu,tickness,true);
    static Font font = new Font("Fira Code", 0, 32);

    FontMetrics fontMetrics = getFontMetrics(font); 
    int hauteurTexte = fontMetrics.getHeight(); //On recupere la hauteur des caracteres de la police 
    Bouton connect;
    Bouton inscrire; 
    Bouton quitter;
    Bouton mdpForgot;
    ChampsConnexion champMDP;
    ChampsConnexion champUser;
    JTextArea mail;
    JTextArea password;
    JPasswordField mdpBis;
    int codeMdpForgot;
    Account(int width,int height) {
        //this.setOpaque(false);
        //System.out.println("ton pere");
        stayConnect = new JCheckBox();
        mdpForgot = new Bouton(20, 10, "Mot de passe oublié");
        stayConnect.setFont(new Font(font.getName(), Font.BOLD, font.getSize()/2));
        stayConnect.setBackground(Color.WHITE);
        stayConnect.setText("Rester connecter");
        connect = new Bouton(BOUTONWIDTH,BOUTONHEIGHT,"Se connecter",font);
        inscrire = new Bouton(BOUTONWIDTH,BOUTONHEIGHT,"S'inscrire",font);
        quitter = new Bouton(BOUTONWIDTH,BOUTONHEIGHT,"Quitter",font);
        this.setLayout(new GridLayout(0, 1));        
        this.setBackground(BG);

        //Page.chargeBarre(progressBar);
        //Creation et/ou affectation des éléments placés sur le JPanel
        mail = new JTextArea("*Adresse Mail : ");
        password = new JTextArea("*Password : ");
        mailInput = new JTextField();
        mdp = new JPasswordField("");

        essais = 3;
        champUser = new ChampsConnexion(mail, mailInput, width,hauteurTexte);
        champMDP = new ChampsConnexion(password, mdp, width, hauteurTexte);



        //La taille du Jpanel 
        this.setSize(width,height);

        this.add(champUser);
        this.add(champMDP);
        this.add(stayConnect).setBounds(tickness, champUser.getHeight() + champMDP.getHeight() +tickness, stayConnect.getWidth(), hauteurTexte);
        this.add(mdpForgot).setBounds(this.getWidth()/2, stayConnect.getY(), width, 10);

        //Placement des Boutons d'inscription et de connexion
        this.add(inscrire).setBounds(tickness, this.getHeight() - BOUTONHEIGHT - tickness, (width-tickness)/3, BOUTONHEIGHT);
        this.add(connect).setBounds(inscrire.getWidth(),this.getHeight() - BOUTONHEIGHT - tickness,(width)/3, BOUTONHEIGHT);
        this.add(quitter).setBounds(inscrire.getWidth() + connect.getWidth(), this.getHeight() - BOUTONHEIGHT -tickness, (width-tickness)/3, BOUTONHEIGHT);

        //On met la mordure pour le Jpanel
        this.setBorder(contour);
        


        //Les champs prennent en compte les touches du clavier (notamment pour rendre la touche entree utilisable afin de confirmer sa connexion/inscription) 
        mailInput.addKeyListener(this);
        mdp.addKeyListener(this);
        inscrire.addActionListener(this);
        connect.addActionListener(this);
        quitter.addActionListener(this);
        stayConnect.addActionListener(this);
        mdpForgot.addActionListener(this);
       // mail.setVisible(false);

        double codeDouble = Math.random();
        codeDouble = codeDouble*9999;
        codeMdpForgot = completeCode((int)codeDouble);
        
    }


   static int completeCode(int c) {
        if (c == 0) {
            return 1374; // si le code est 0 on renvoie un code a 4 chiffres par defaut 
        }
        if (c < 10) {
            return c*1000; // si le code est compris entre 1 et 9 alors on rajoute 3 zeros a la fin pour faire un code a 4 chiffres
        }
        if(c < 100) { //idem
            return c*100;
        }
        if (c<1000) { //idem
            return c*10;
        }
        return c;
    }

    void noUser(boolean existingUser) {
        if (!existingUser) {
            mdp.setText("");
            JOptionPane.showMessageDialog(f,"Pas d'utilisateur avec ces identifiants","Erreur",JOptionPane.WARNING_MESSAGE);
            essais--;
            if (essais == 0 ) { f.dispose();}
    }
}
    

    boolean isUser() {
        try { 
            Connection conn = App.connectBDD();
            PreparedStatement prepare = conn.prepareStatement("Select password from login where mail = ?");
            prepare.setString(1, mailInput.getText()); 
            ResultSet res = prepare.executeQuery();
            res.next();
            return (String.valueOf(mdp.getPassword()).equals(res.getString("password")));
        } catch (Exception e) {
            System.err.println(e);
            return false;
        }
    }

    void seConnecter() {
        boolean existingUser = isUser();
        noUser(existingUser);
        if (existingUser) {
            if (stayConnect.isSelected()) {
                try {
                    fileWriter = new FileWriter("./texteConnection/stayConnect.txt");
                    fileWriter.write(this.mailInput.getText() + "\n");
                    fileWriter.write((this.mdp.getPassword()));
                    fileWriter.close();
                } catch (IOException e1) {
                    e1.printStackTrace();
                }
            }
            Page.mail = this.mailInput.getText();
            Page.password = String.valueOf(this.mdp.getPassword());
            mdp.setText("");
            Fenetre.container.add("HomePage",new HomePage());
            Fenetre.container.add("Compte",new Compte());
            cardLayoutF.show(Fenetre.container, "HomePage");
        }       
    }
    
    @Override
    public void keyTyped(KeyEvent e) {

    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == KeyEvent.VK_ENTER) {
            seConnecter();
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {

    }



    @Override
    public void actionPerformed(ActionEvent e) {

        if (e.getSource() == connect) {
            seConnecter();
        }

        if (e.getSource() == inscrire) {

            cardLayout.show(register, "ins");
            register.setSize(register.getWidth(), Inscription.HEIGHT);
        }

        if (e.getSource() == quitter) {
            f.dispose();

        }

        if(e.getSource() == mdpForgot) {
            boolean verif = false; 
            String m = "";
            while (!verif) {
                m = JOptionPane.showInputDialog("Entrez l'adresse mail du compte afin de recupérer votre mot de passe");
                if(Inscription.verifMail(m)) {
                    verif = true;
                    break;
                }
                else{
                    JOptionPane.showMessageDialog(f, "Ce n'est pas un mail valide !","Erreur",JOptionPane.ERROR_MESSAGE);
                };
            }

            try { 

            Connection conn =App.connectBDD();
            
            PreparedStatement prepare = conn.prepareStatement("Select username from login where mail = ?");
            prepare.setString(1, m); 
            ResultSet res = prepare.executeQuery();
            res.next();
            
            String userString = res.getString("username");
            Mail.send("techcarepoo@gmail.com","ydzb dawd mllz dtpu", m, "Code pour reinitialiser le mot de passe", "Cher " + userString + ",\nVoici le code à rentrer afin de confirmer votre demande de reinitialisation de mot de passe : " + String.valueOf(codeMdpForgot) + "\nCordialement,\nL'equipe TechCare.");
            String x = JOptionPane.showInputDialog("Veuillez rentrer le code de validation envoyé par mail : ");
            if(Integer.parseInt(x) == codeMdpForgot) {
                String y = JOptionPane.showInputDialog("Veuillez rentrer le nouveau mot de passe");
                String z = JOptionPane.showInputDialog("Veuillez le confirmer");
                if (y.equals(z)) {
                    try {
                        PreparedStatement preparedStatement = conn.prepareStatement("Update login set password = ? where mail = ?");
                        preparedStatement.setString(1, y);
                        preparedStatement.setString(2,m);
                        preparedStatement.executeUpdate();
                        JOptionPane.showMessageDialog(f, "Mot de passe modifié avec succès !");
                    } catch (Exception expcect) {
                        System.err.println(expcect);
                        JOptionPane.showMessageDialog(f, "Erreur !");
                    }
                }else {
                    JOptionPane.showMessageDialog(f, "Erreur les mots de passes ne sont pas les mêmes ! ");
                }

            }
            else {
                JOptionPane.showMessageDialog(f, "Le code rentré est incorrect, réessayer","Erreur de verification",JOptionPane.ERROR_MESSAGE);
            }
            } catch (Exception excp) {
                JOptionPane.showMessageDialog(f, "Ce mail n'a pas de compte associé !","Erreur",JOptionPane.ERROR_MESSAGE);
            }

    }


    }

}
