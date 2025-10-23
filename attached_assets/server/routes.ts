import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuestionnaireSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // ---------------- USER ROUTES ----------------
  app.post("/api/users", async (req, res) => {
    try {
      const validatedUser = req.body;
      const user = await storage.createUser(validatedUser);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: "Invalid user data", details: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // ---------------- QUESTIONNAIRE ROUTES ----------------
  app.post("/api/questionnaire", async (req, res) => {
    try {
      const validatedData = insertQuestionnaireSchema.parse(req.body);
      const response = await storage.createQuestionnaireResponse(validatedData);
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ error: "Invalid questionnaire data", details: error.message });
    }
  });

  // ---------------- RESOURCE ROUTES ----------------
  app.get("/api/resources", async (req, res) => {
    try {
      const { category, search } = req.query;
      let resources;

      if (category) {
        resources = await storage.getResourcesByCategory(category as string);
      } else if (search) {
        resources = await storage.searchResources(search as string);
      } else {
        resources = await storage.getAllResources();
      }

      res.json(resources);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch resources", details: error.message });
    }
  });

  // ---------------- FRONTEND ROUTE ----------------
  app.get("/", async (req, res) => {
    try {
      const resources = await storage.getAllResources();

      const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Available Resources</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              background: #f4f6f8;
              color: #333;
              padding: 1rem 2rem;
            }
            h1 {
              text-align: center;
              color: #1a3d7c;
            }
            #searchBox {
              display: block;
              margin: 20px auto;
              padding: 10px;
              width: 60%;
              max-width: 400px;
              border: 1px solid #ccc;
              border-radius: 5px;
              font-size: 1rem;
            }
            .container {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 1.5rem;
              margin-top: 2rem;
            }
            .card {
              background: white;
              border-radius: 10px;
              box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
              padding: 1rem;
              width: 300px;
              transition: 0.3s ease;
            }
            .card:hover {
              transform: translateY(-5px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            .card h2 {
              font-size: 1.2em;
              color: #003366;
            }
            .card p {
              font-size: 0.9em;
              color: #555;
            }
            .card a {
              display: inline-block;
              margin-top: 10px;
              text-decoration: none;
              color: #0077cc;
              font-weight: bold;
            }
            .card a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <h1>Available Resources</h1>
          <input id="searchBox" type="text" placeholder="Search resources..." />
          <div class="container" id="container"></div>

          <script>
            const container = document.getElementById('container');
            const searchBox = document.getElementById('searchBox');

            async function loadResources() {
              const res = await fetch('/api/resources');
              const data = await res.json();
              displayResources(data);

              searchBox.addEventListener('input', () => {
                const query = searchBox.value.toLowerCase();
                const filtered = data.filter(r =>
                  r.title.toLowerCase().includes(query) ||
                  r.description.toLowerCase().includes(query) ||
                  r.category.toLowerCase().includes(query)
                );
                displayResources(filtered);
              });
            }

            function displayResources(resources) {
              container.innerHTML = '';
              if (resources.length === 0) {
                container.innerHTML = '<p>No resources found.</p>';
                return;
              }

              resources.forEach(r => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = \`
                  <h2>\${r.title}</h2>
                  <p><strong>Category:</strong> \${r.category}</p>
                  <p>\${r.description}</p>
                  \${r.website ? '<a href="' + r.website + '" target="_blank">Visit Website</a>' : ''}
                \`;
                container.appendChild(card);
              });
            }

            loadResources();
          </script>
        </body>
      </html>`;

      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } catch (err: any) {
      res.status(500).send(`<h1>Error loading resources</h1><p>${err.message}</p>`);
    }
  });

  // ---------------- CREATE SERVER ----------------
  const httpServer = createServer(app);
  return httpServer;
}
