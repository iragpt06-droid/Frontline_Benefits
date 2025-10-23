import {
  type User,
  type InsertUser,
  type QuestionnaireResponse,
  type InsertQuestionnaire,
  type Resource,
  type InsertResource,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createQuestionnaireResponse(
    response: InsertQuestionnaire
  ): Promise<QuestionnaireResponse>;
  getQuestionnaireResponse(id: string): Promise<QuestionnaireResponse | undefined>;

  getAllResources(): Promise<Resource[]>;
  getResource(id: string): Promise<Resource | undefined>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  searchResources(query: string): Promise<Resource[]>;
  getMatchedResources(needs: string[], zipCode?: string): Promise<Resource[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private questionnaireResponses: Map<string, QuestionnaireResponse>;
  private resources: Map<string, Resource>;

  constructor() {
    this.users = new Map();
    this.questionnaireResponses = new Map();
    this.resources = new Map();
    this.seedResources();
  }

  private seedResources() {
    const sampleResources: InsertResource[] = [
      // Healthcare Resources
      {
        title: "US Congressman Sam Johnson Memorial VA Clinic",
        description:
          "Full-service VA medical center providing comprehensive healthcare services including primary care, specialty care, mental health services, and emergency care for veterans.",
        category: "healthcare",
        organization: "U.S. Department of Veterans Affairs",
        phone: "(972) 801-4200",
        email: "vhagla-director@va.gov",
        website:
          "https://www.va.gov/north-texas-health-care/locations/plano-va-clinic",
        address: "3804 West 15th Street Suite 175",
        city: "Plano",
        state: "TX",
        zipCode: "75075",
        latitude: "33.0180",
        longitude: "-96.7643",
        eligibility: [
          "Honorably discharged veterans",
          "Active duty service members",
          "Veterans with service-connected disabilities",
        ],
        tags: ["primary care", "specialty care", "emergency services", "mental health"],
        isNational: false,
        isCrisis: false,
      },
      {
        title: "Selma VA Clinic",
        description:
          "Community-based outpatient clinic providing primary care, mental health services, and telehealth options for eligible veterans in the Selma, Alabama area.",
        category: "healthcare",
        organization: "U.S. Department of Veterans Affairs",
        phone: "(205) 554-2010",
        email: null,
        website:
          "https://www.va.gov/tuscaloosa-health-care/locations/selma-va-clinic",
        address: "206 Vaughn Memorial Drive",
        city: "Selma",
        state: "AL",
        zipCode: "36701-6949",
        latitude: "32.4075",
        longitude: "-87.0211",
        eligibility: [
          "Honorably discharged veterans",
          "Active duty service members",
          "Veterans with service-connected disabilities",
        ],
        tags: ["primary care", "mental health", "telehealth", "outpatient services"],
        isNational: false,
        isCrisis: false,
      },
      {
        title: "Bessemer VA Clinic",
        description:
          "Community-based outpatient clinic offering primary care, mental health services, and telehealth options for veterans in the Bessemer, Alabama area.",
        category: "healthcare",
        organization: "U.S. Department of Veterans Affairs",
        phone: "(205) 428-3495",
        email: null,
        website:
          "https://www.va.gov/birmingham-health-care/locations/bessemer-va-clinic",
        address:
          "975 Ninth Avenue Southwest, Medical West Office Complex, Suite 400",
        city: "Bessemer",
        state: "AL",
        zipCode: "35022-7841",
        latitude: "33.3713",
        longitude: "-86.9669",
        eligibility: [
          "Honorably discharged veterans",
          "Active duty service members",
          "Veterans with service-connected disabilities",
        ],
        tags: ["primary care", "mental health", "telehealth", "outpatient services"],
        isNational: false,
        isCrisis: false,
      },
      {
        title: "Veterans Health Administration Telehealth",
        description:
          "Access healthcare services remotely through video visits, secure messaging, and remote monitoring. Available to all enrolled VA patients nationwide.",
        category: "healthcare",
        organization: "U.S. Department of Veterans Affairs",
        phone: "1-877-222-8387",
        email: "telehealth@va.gov",
        website: "https://telehealth.va.gov",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
        eligibility: ["Enrolled VA patients", "Active VA health benefits"],
        tags: ["telehealth", "video visits", "remote care", "nationwide"],
        isNational: true,
        isCrisis: false,
      },

      // Housing Resources
      {
        title: "HUD-VASH Program",
        description:
          "Housing and Urban Development-VA Supportive Housing program provides permanent housing and case management for homeless veterans.",
        category: "housing",
        organization: "HUD & VA Partnership",
        phone: "1-877-424-3838",
        email: "hudvash@va.gov",
        website: "https://www.va.gov/homeless/hud-vash.asp",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
        eligibility: [
          "Homeless veterans",
          "Veterans at risk of homelessness",
          "Honorable discharge",
        ],
        tags: ["housing vouchers", "case management", "permanent housing", "homeless support"],
        isNational: true,
        isCrisis: false,
      },
      {
        title: "VA Home Loan Guaranty Program",
        description:
          "Helps veterans, service members, and surviving spouses become homeowners.",
        category: "housing",
        organization: "U.S. Department of Veterans Affairs",
        phone: "1-877-827-3702",
        email: "",
        website: "https://www.benefits.va.gov/homeloans",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
        eligibility: [
          "Active duty service members",
          "Veterans",
          "Surviving spouses",
          "National Guard and Reserve members",
        ],
        tags: ["home loans", "no down payment", "refinancing", "home ownership"],
        isNational: true,
        isCrisis: false,
      },

      // ... (rest of your VA clinic and education entries unchanged)

      {
        title: "Soldotna VA Clinic",
        description:
          "Outpatient clinic in Soldotna (Kenai Peninsula) providing primary care and specialty services for veterans in the Kenai/Soldotna area.",
        category: "healthcare",
        organization: "U.S. Department of Veterans Affairs",
        phone: "888-353-7574",
        email: "",
        website: "https://www.va.gov/alaska-health-care/locations/soldotna-va-clinic/",
        address: "237 West Rockwell Avenue",
        city: "Soldotna",
        state: "AK",
        zipCode: "99669-7412",
        latitude: "",
        longitude: "",
        eligibility: ["Veterans eligible for VA health care"],
        tags: ["outpatient clinic", "Kenai Peninsula", "Alaska", "primary care"],
        isNational: false,
        isCrisis: false,
      },
      {
        "title": "Soldotna VA Clinic",
        "description": "Outpatient clinic in Soldotna (Kenai Peninsula) providing primary care and specialty services for veterans in the Kenai/Soldotna area.",
        "category": "healthcare",
        "organization": "U.S. Department of Veterans Affairs",
        "phone": "888-353-7574", 
        "email": "",
        "website": "https://www.va.gov/alaska-health-care/locations/soldotna-va-clinic/", 
        "address": "237 West Rockwell Avenue",
        "city": "Soldotna",
        "state": "AK",
        "zipCode": "99669-7412",
        "latitude": "",
        "longitude": "",
        "eligibility": ["Veterans eligible for VA health care"],
        "tags": ["outpatient clinic", "Kenai Peninsula", "Alaska", "primary care"],
        "isCrisis": false
      },
      {
        "title": "Homer VA Clinic",
        "description": "Outpatient clinic in Homer offering primary care, specialty and telehealth services for veterans in the Homer/Kachemak Bay region.",
        "category": "healthcare",
        "organization": "U.S. Department of Veterans Affairs",
        "phone": "888-353-7574",
        "email": "",
        "website": "https://www.va.gov/alaska-health-care/locations/homer-va-clinic/",
        "address": "4141 Pennock Street",
        "city": "Homer",
        "state": "AK",
        "zipCode": "99603-7223",
        "latitude": "",
        "longitude": "",
        "eligibility": ["Veterans eligible for VA health care"],
        "tags": ["outpatient clinic", "Homer", "Alaska", "primary care"],
        "isCrisis": false
      },

      {
        title: "SAMHSA National Helpline",
        description:
          "Free, confidential, 24/7 treatment referral and information service for individuals and families facing mental health and/or substance use disorders.",
        category: "crisis",
        organization: "SAMHSA",
        phone: "1-800-662-4357",
        email: "",
        website: "https://www.samhsa.gov/find-help/national-helpline",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
        eligibility: ["All individuals", "Family members"],
        tags: [
          "substance abuse",
          "mental health crisis",
          "treatment referral",
          "24/7 helpline",
        ],
        isNational: true,
        isCrisis: true,
      },
    ];

    sampleResources.forEach((resource) => {
      const id = randomUUID();
      const res = { ...resource, id } as Resource;
      this.resources.set(id, res);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createQuestionnaireResponse(
    insertResponse: InsertQuestionnaire
  ): Promise<QuestionnaireResponse> {
    const id = randomUUID();
    const response = { ...insertResponse, id } as QuestionnaireResponse;
    this.questionnaireResponses.set(id, response);
    return response;
  }

  async getQuestionnaireResponse(
    id: string
  ): Promise<QuestionnaireResponse | undefined> {
    return this.questionnaireResponses.get(id);
  }

  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResource(id: string): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      (resource) => resource.category === category
    );
  }

  async searchResources(query: string): Promise<Resource[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.resources.values()).filter(
      (resource) =>
        resource.title.toLowerCase().includes(lowerQuery) ||
        resource.description.toLowerCase().includes(lowerQuery) ||
        resource.organization.toLowerCase().includes(lowerQuery) ||
        resource.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async getMatchedResources(
    needs: string[],
    zipCode?: string
  ): Promise<Resource[]> {
    const allResources = Array.from(this.resources.values());
    const matchedResources = allResources.filter((resource) =>
      needs.includes(resource.category)
    );

    return matchedResources.sort((a, b) => {
      if (a.isCrisis && !b.isCrisis) return -1;
      if (!a.isCrisis && b.isCrisis) return 1;
      if (a.isNational && !b.isNational) return -1;
      if (!a.isNational && b.isNational) return 1;
      return 0;
    });
  }
}

export const storage = new MemStorage();
