import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;

import javax.swing.BorderFactory;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JTextArea;

public class Compte extends JPanel implements ActionListener{
    
    JTextArea titre;
    JTextArea username;
    JTextArea mail;
    JTextArea adresse;
    JTextArea telephone;
    JTextArea mdp;
    JPasswordField passwordField;
    


    JPanel infos;
    Font font = new Font(Account.font.getName(),Font.BOLD,30);
    Font fontTitre = new Font(font.getName(),Font.BOLD,60);
    FontMetrics fontMetricsTitre = getFontMetrics(fontTitre);
    FontMetrics fontMetrics = getFontMetrics(font);
    int tickness = Account.tickness;

    Bouton modifUser = new Bouton(100,fontMetrics.getHeight(),"Modifier",Fenetre.BG,Color.YELLOW);
    Bouton modifMail = new Bouton(100,fontMetrics.getHeight(),"Modifier",Fenetre.BG,Color.YELLOW);
    Bouton modifAdresse =  new Bouton(100,fontMetrics.getHeight(),"Modifier",Fenetre.BG,Color.YELLOW);
    Bouton modifTelephone =  new Bouton(100,fontMetrics.getHeight(),"Modifier",Fenetre.BG,Color.YELLOW);
    Bouton modifPassword =  new Bouton(100,fontMetrics.getHeight(),"Modifier",Fenetre.BG,Color.YELLOW);
    Compte() {
        int hauteur = tickness;
        infos = new JPanel();
        titre =new JTextArea();
        username = new JTextArea("Username : ");
        mail = new JTextArea("Mail : ");
        adresse = new JTextArea("Adresse : ");
        telephone = new JTextArea("Telephone : " );
        mdp = new JTextArea("Mot de Passe : ");
        infos.setSize(Fenetre.WIDTH/2,Fenetre.HEIGHT*3/5);
        setLayout(null);
        setBackground(Fenetre.BG);
        new Menuhome().addMenuHome(this);
        add(infos).setBounds((Fenetre.WIDTH - infos.getWidth() + Menuhome.WIDTH)/2,(Fenetre.HEIGHT - infos.getHeight())/2,infos.getWidth(),infos.getHeight());
        infos.setLayout(null);
        hauteur = addInfos(titre, "MES INFORMATIONS", hauteur, fontTitre,null);
        hauteur = addInfos(username,Page.username,hauteur,font,modifUser);
        hauteur = addInfos(mail, Page.mail, hauteur, font,modifMail);
        hauteur = addInfos(adresse, Page.adresse, hauteur, font,modifAdresse);
        hauteur = addInfos(telephone, Page.telephone, hauteur, font,modifTelephone);
        hauteur = addInfos(mdp, passwordSecret(), hauteur, font, modifPassword);
        infos.setBackground(getBackground());
        infos.setBorder(Account.contour);

        TexteBoutique warning = new TexteBoutique("Si vous modifiez le numéro, n'entrez que les chiffres apres le zero (0) et SANS espaces !");
        infos.add(warning).setBounds(tickness,hauteur + 30,infos.getWidth()-tickness*2,infos.getHeight()-(hauteur+30)-tickness*2);

    }


    String passwordSecret() {
        String res = "";
        int length = Page.password.length();
        for (int i =0; i<length; i++) {
            res += "•";
        }
        return res;
    }

    int addInfos(JTextArea textArea,String text,int hauteur,Font font,Bouton bouton){
        textArea.setBackground(getBackground());
        textArea.setForeground(Color.YELLOW);
        textArea.setEditable(false);
        textArea.setText(textArea.getText() + text);
        textArea.setFont(font);
        int hauteurTxt = getFontMetrics(font).getHeight();
        if (bouton != null) {
            bouton.setBorder(BorderFactory.createLineBorder(Color.YELLOW,2,true));
            bouton.addActionListener(this);
        }
        if (font.equals(fontTitre)) infos.add(textArea).setBounds((infos.getWidth() - fontMetricsTitre.stringWidth(text)) /2 ,hauteur,fontMetricsTitre.stringWidth(text),hauteurTxt);
        else {
            infos.add(textArea).setBounds(tickness,hauteur,infos.getWidth() - 2*tickness - bouton.width,hauteurTxt);
            infos.add(bouton).setBounds(textArea.getX() + textArea.getWidth(),hauteur,bouton.width,bouton.height);
        }
        hauteur += hauteurTxt + 5;
        return hauteur;
    }


    @Override
    public void actionPerformed(ActionEvent e) {
        String colonne = " ";
        String res = " ";
        Boolean itsOK = true;
        Boolean isMail = false;
        Boolean isPassword = false;
        res = JOptionPane.showInputDialog(null,"Par quoi le remplacer", "Modifiactions",JOptionPane.QUESTION_MESSAGE);
        if(e.getSource() == modifUser) {
            colonne = "username";
            Page.username = res;
            username.setText("Username : " + res);
        }

        if (e.getSource() == modifMail) {
            colonne ="mail";
            if (!(Inscription.verifMail(res))) {
                JOptionPane.showMessageDialog(null, "Mail incorrect", "Erreur", JOptionPane.ERROR_MESSAGE);
                itsOK = false;
            }
            else {
                Mail.send("techcarepoo@gmail.com", "ydzb dawd mllz dtpu", res, "Code de verification TechCare", "Cher " + Page.username +",\nVoici le code verification temporaire afin de confirmer votre changement de mail à TechCare\n\nCode de verification : " + Account.completeCode(Inscription.code) + "\nMerci de faire confiance à TechCare !\n\nCordialement,\nL'équipe TechCare");
                String x = JOptionPane.showInputDialog("Veuillez rentrer le code de validation envoyé par mail : ");
                if (Integer.parseInt(x) == Account.completeCode(Inscription.code)) {
                    isMail = true;
                    mail.setText("Mail : " + res);
                    JOptionPane.showMessageDialog(null, "Le mail a bien été modifié");
                }
                else{
                    JOptionPane.showMessageDialog(null, "Code incorrect", "Erreur", JOptionPane.ERROR_MESSAGE);
                }
            }
        }

        if(e.getSource() == modifAdresse) {
            colonne = "adresse";
            Page.adresse = res;
            adresse.setText("Adresse : " + res);
        }

    if (e.getSource() == modifTelephone) {
            colonne = "telephone";
            if (Inscription.verifNumero(res)) {
                res = espaceNumeros(res);
                Page.telephone = res;
                telephone.setText("Telephone : " + res);
                System.out.println(res);
            }
            else {
                JOptionPane.showMessageDialog(null, "Numero Incorrect", "Erreur", JOptionPane.ERROR_MESSAGE);
                itsOK = false;
            }

        }

        if (e.getSource() == modifPassword) {
            colonne = "password";
            String ancienPassword = JOptionPane.showInputDialog(null, "Veuillez entrez l'ancien mot de passe afin de valider l'opération","Validation",JOptionPane.INFORMATION_MESSAGE);
            if (ancienPassword.equals(Page.password)) {
                Page.password = res;
                mdp.setText("Mot de Passe : " + passwordSecret());
                isPassword = true;
                JOptionPane.showMessageDialog(null, "Le mot de Passe a été changé", "Validation", JOptionPane.INFORMATION_MESSAGE);
            }
            else{
                JOptionPane.showMessageDialog(null, "Mot de Passe éroné","Erreur",JOptionPane.ERROR_MESSAGE);
                itsOK = false;

            }
        }

        if (itsOK) {
            try {              
                System.out.println(res);                                           
                //Class.forName("com.mysql.cj.jdbc.Driver");
                Connection conn = App.connectBDD(); 
                //Statement stmt = conn.createStatement();
                PreparedStatement prepare = conn.prepareStatement("Update login set " + colonne + " = ? where mail = ?");
                //prepare.setString(1, colonne);
                prepare.setString(1, res);
                prepare.setString(2, Page.mail);
                System.out.println(prepare.toString());
                prepare.executeUpdate();
                conn.close();
                if (isMail || isPassword) {
                    Page.mail = res;
                    File file = new File("./texteConnection/stayConnect.txt");
                    file.delete();
                    try {
                        file.createNewFile();
                    }catch(Exception e2) {}
                }
            } catch (Exception e2) {
                System.err.println(e2);
            } 
        }
    }



    String espaceNumeros(String str) {
        String tmp = "+33 ";
        String tr ="";
        tr = str.substring(0,1);
        tmp += tr + " " ; 
        tmp += str.substring(1, 3) + " ";
        tmp += str.substring(3, 5) + " ";
        tmp += str.substring(5, 7) + " ";
        tmp += str.substring(7, 9) + " ";
        System.out.println(tmp);
        return tmp;
    }
}
