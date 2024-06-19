using System;
using System.Diagnostics;

namespace MyDotnetProject
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Launching Python script...");

            ProcessStartInfo start = new ProcessStartInfo();
            start.FileName = "python3"; // Commande pour exécuter Python
            start.Arguments = "/bot.py"; // Chemin vers votre script Python
            start.UseShellExecute = false;
            start.RedirectStandardOutput = true;
            start.RedirectStandardError = true;

            using (Process process = Process.Start(start))
            {
                using (StreamReader reader = process.StandardOutput)
                {
                    string result = reader.ReadToEnd();
                    Console.Write(result);
                }
                using (StreamReader reader = process.StandardError)
                {
                    string error = reader.ReadToEnd();
                    if (!string.IsNullOrEmpty(error))
                    {
                        Console.WriteLine("Errors:");
                        Console.WriteLine(error);
                    }
                }
            }
        }
    }
}
