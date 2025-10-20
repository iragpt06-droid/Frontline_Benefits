import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuestionnaireSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Questionnaire Routes
  app.post("/api/questionnaire", async (req, res) => {
    try {
      const validatedData = insertQuestionnaireSchema.parse(req.body);
      const response = await storage.createQuestionnaireResponse(validatedData);
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ 
        error: "Invalid questionnaire data", 
        details: error.message 
      });
    }
  });

  app.get("/api/questionnaire/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await storage.getQuestionnaireResponse(id);
      
      if (!response) {
        return res.status(404).json({ error: "Questionnaire response not found" });
      }
      
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch questionnaire response" });
    }
  });

  // Resource Routes
  app.get("/api/resources", async (req, res) => {
    try {
      const { category, search, responseId } = req.query;
      
      let resources;
      
      if (responseId) {
        // Get matched resources based on questionnaire response
        const questionnaireResponse = await storage.getQuestionnaireResponse(responseId as string);
        if (questionnaireResponse && questionnaireResponse.needs) {
          resources = await storage.getMatchedResources(
            questionnaireResponse.needs,
            questionnaireResponse.zipCode || undefined
          );
        } else {
          resources = await storage.getAllResources();
        }
      } else if (category) {
        // Filter by category
        resources = await storage.getResourcesByCategory(category as string);
      } else if (search) {
        // Search resources
        resources = await storage.searchResources(search as string);
      } else {
        // Get all resources
        resources = await storage.getAllResources();
      }
      
      res.json(resources);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const resource = await storage.getResource(id);
      
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      
      res.json(resource);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch resource" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
