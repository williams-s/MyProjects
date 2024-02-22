import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;

import javax.swing.JPanel;

public class TemperaturePanel extends JPanel {
        private static final int WIDTH = 900;
        private static final int HEIGHT = 600;
        private static final int MARGIN = 50;
        private static final int POINTS = 24;
        int borneInf = 0;

        private double[] temperatures;
        public String titreAxe = "";
        public TemperaturePanel(String txt,int borneInf) {
            //setBackground(Fenetre.BG);
            titreAxe = txt;
            this.borneInf = borneInf;
            temperatures = new double[POINTS]; // Allocation de mémoire pour le tableau
        }

        protected void paintComponent(Graphics g) {
            super.paintComponent(g);

            Graphics2D g2d = (Graphics2D) g;
            //g2d.setColor(Account.bleu);
            //g2d.setStroke(new BasicStroke(4.0f));
            g2d.drawLine(MARGIN, MARGIN, MARGIN, HEIGHT + MARGIN);
            if (titreAxe.equals("Humidité en %")) {
                g2d.drawString("Humidité", 4, 70);
                g2d.drawString("en %", 11, 85);
            }
            else{
                g2d.drawString(titreAxe, 4, 70);
            }
            g2d.drawLine(MARGIN, HEIGHT + MARGIN, WIDTH + MARGIN, HEIGHT + MARGIN);
            g2d.drawString("Heures", WIDTH + 20, HEIGHT + 20 + MARGIN);
 

            double xScale = (double) WIDTH / POINTS;
            double yScale = (double) HEIGHT / 15;

            //g2d.setStroke(new BasicStroke(1.0f));
            g2d.setColor(Color.BLUE);
            g2d.setFont(new Font("Arial", Font.PLAIN, 20));
            for (int i = 0; i < POINTS; i++) {
                int x = (int) (i * xScale + MARGIN);
                int y = (int) (HEIGHT - (temperatures[i] - borneInf) * yScale + MARGIN);

                g2d.fillOval(x - 2, y - 2, 6, 6);

                String tempStr = String.format("%.0f", temperatures[i]);
                g2d.drawString(tempStr, x + 5, y - 5);
            }

            int[] xPoints = new int[POINTS];
            int[] yPoints = new int[POINTS];
            for (int i = 0; i < POINTS; i++) {
                xPoints[i] = (int) (i * xScale + MARGIN);
                yPoints[i] = (int) (HEIGHT - (temperatures[i] - borneInf) * yScale + MARGIN);
            }
            g2d.setColor(Color.RED);
            g2d.drawPolyline(xPoints, yPoints, POINTS);
        }

        public Dimension getPreferredSize() {
            return new Dimension(WIDTH + 2 * MARGIN, HEIGHT + 2 * MARGIN);
        }

        public void setTemperatures(double[] newTemperatures) {
            temperatures = newTemperatures;
        }

        public double[] getTemperatures() {
            return temperatures;
        }
    }