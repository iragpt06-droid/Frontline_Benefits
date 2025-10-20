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
  
  createQuestionnaireResponse(response: InsertQuestionnaire): Promise<QuestionnaireResponse>;
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
        title: "VA Medical Center - Los Angeles",
        description: "Full-service VA medical center providing comprehensive healthcare services including primary care, specialty care, mental health services, and emergency care for veterans.",
        category: "healthcare",
        organization: "U.S. Department of Veterans Affairs",
        phone: "(310) 478-3711",
        email: "vhagla-director@va.gov",
        website: "https://www.va.gov/los-angeles-health-care",
        address: "11301 Wilshire Blvd",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90073",
        latitude: "34.0522",
        longitude: "-118.2437",
        eligibility: ["Honorably discharged veterans", "Active duty service members", "Veterans with service-connected disabilities"],
        tags: ["primary care", "specialty care", "emergency services", "mental health"],
        isNational: false,
        isCrisis: false,
      },
      {
        title: "Veterans Health Administration Telehealth",
        description: "Access healthcare services remotely through video visits, secure messaging, and remote monitoring. Available to all enrolled VA patients nationwide.",
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
        description: "Housing and Urban Development-VA Supportive Housing program provides permanent housing and case management for homeless veterans. Combines HUD housing vouchers with VA supportive services.",
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
        eligibility: ["Homeless veterans", "Veterans at risk of homelessness", "Honorable discharge"],
        tags: ["housing vouchers", "case management", "permanent housing", "homeless support"],
        isNational: true,
        isCrisis: false,
      },
      {
        title: "VA Home Loan Guaranty Program",
        description: "Helps veterans, service members, and surviving spouses become homeowners. Offers competitive interest rates, no down payment required, and limited closing costs.",
        category: "housing",
        organization: "U.S. Department of Veterans Affairs",
        phone: "1-877-827-3702",
        website: "https://www.benefits.va.gov/homeloans",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
        eligibility: ["Active duty service members", "Veterans", "Surviving spouses", "National Guard and Reserve members"],
        tags: ["home loans", "no down payment", "refinancing", "home ownership"],
        isNational: true,
        isCrisis: false,
      },
      {
        title: "New Directions Veteran Housing",
        description: "Transitional housing program offering safe, affordable housing with support services including job training, counseling, and life skills development for veterans in transition.",
        category: "housing",
        organization: "New Directions",
        phone: "(310) 914-4045",
        email: "info@newdirectionsinc.org",
        website: "https://www.newdirectionsinc.org",
        address: "2116 Arlington Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90018",
        latitude: "34.0407",
        longitude: "-118.3080",
        eligibility: ["Homeless veterans", "Veterans in transition", "Low-income veterans"],
        tags: ["transitional housing", "support services", "job training"],
        isNational: false,
        isCrisis: false,
      },
      
      // Employment Resources
      {
        title: "VA Vocational Rehabilitation and Employment (VR&E)",
        description: "Chapter 31 program helps veterans with service-connected disabilities prepare for, find, and maintain suitable employment. Provides job training, resume development, and job-seeking skills.",
        category: "employment",
        organization: "U.S. Department of Veterans Affairs",
        phone: "1-800-827-1000",
        website: "https://www.va.gov/careers-employment/vocational-rehabilitation",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
        eligibility: ["Veterans with service-connected disabilities", "Veterans within 12 years of separation"],
        tags: ["vocational training", "job placement", "career counseling", "disability employment"],
        isNational: true,
        isCrisis: false,
      },
      {
        title: "Hire Heroes USA",
        description: "Free job search assistance for U.S. military members, veterans, and military spouses. Offers personalized coaching, resume writing, interview prep, and job search strategies.",
        category: "employment",
        organization: "Hire Heroes USA",
        phone: "1-866-915-4376",
        email: "programs@hireheroesusa.org",
        website: "https://www.hireheroesusa.org",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
        eligibility: ["Veterans", "Transitioning service members", "Military spouses"],
        tags: ["job search", "career coaching", "resume help", "interview prep"],
        isNational: true,
        isCrisis: false,
      },
      {
        title: "Veteran Employment Services Office (VESO)",
        description: "Provides comprehensive employment services including career counseling, job placement assistance, skills assessment, and connections to local employers seeking to hire veterans.",
        category: "employment",
        organization: "Los Angeles County",
        phone: "(562) 658-3625",
        email: "veso@wdacs.lacounty.gov",
        website: "https://workforce.lacounty.gov/veterans",
        address: "3175 E. Imperial Hwy",
        city: "Lynwood",
        state: "CA",
        zipCode: "90262",
        latitude: "33.9303",
        longitude: "-118.2115",
        eligibility: ["All veterans", "Transitioning service members"],
        tags: ["job placement", "career counseling", "employer connections"],
        isNational: false,
        isCrisis: false,
      },
      
      // Mental Health Resources
      {
        title: "Veterans Crisis Line",
        description: "Free, confidential support for veterans in crisis and their families and friends 24/7/365. Connect with caring, qualified VA responders through a confidential toll-free hotline, online chat, or text.",
        category: "mental-health",
        organization: "U.S. Department of Veterans Affairs",
        phone: "988 (Press 1)",
        website: "https://www.veteranscrisisline.net",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
        eligibility: ["All veterans", "Family members", "Friends of veterans"],
        tags: ["crisis support", "24/7 hotline", "suicide prevention", "immediate help"],
        isNational: true,
        isCrisis: true,
      },
      {
        title: "VA Mental Health Services",
        description: "Comprehensive mental health care including treatment for PTSD, depression, anxiety, substance abuse, and other mental health conditions. Services include individual therapy, group therapy, and medication management.",
        category: "mental-health",
        organization: "U.S. Department of Veterans Affairs",
        phone: "1-877-222-8387",
        website: "https://www.mentalhealth.va.gov",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
        eligibility: ["Enrolled VA patients", "Veterans with mental health needs"],
        tags: ["PTSD treatment", "counseling", "therapy", "medication management"],
        isNational: true,
        isCrisis: false,
      },
      {
        title: "Vet Center - Los Angeles",
        description: "Community-based counseling centers providing readjustment counseling, outreach services, and referral services to eligible veterans, active duty service members, and their families.",
        category: "mental-health",
        organization: "U.S. Department of Veterans Affairs",
        phone: "(310) 641-0326",
        email: "losangeles.vetcenter@va.gov",
        website: "https://www.va.gov/los-angeles-vet-center",
        address: "1045 W. Redondo Beach Blvd, Suite 150",
        city: "Gardena",
        state: "CA",
        zipCode: "90247",
        latitude: "33.8883",
        longitude: "-118.2923",
        eligibility: ["Combat veterans", "Veterans of military sexual trauma", "Bereaved family members"],
        tags: ["counseling", "readjustment support", "family counseling", "trauma therapy"],
        isNational: false,
        isCrisis: false,
      },
      {
        title: "Give an Hour",
        description: "National network of mental health professionals providing free mental health services to military members, veterans, and their families. Services include individual therapy, couples counseling, and family therapy.",
        category: "mental-health",
        organization: "Give an Hour",
        phone: "1-202-298-0020",
        email: "info@giveanhour.org",
        website: "https://giveanhour.org",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
        eligibility: ["Service members", "Veterans", "Military families"],
        tags: ["free counseling", "mental health", "therapy", "family support"],
        isNational: true,
        isCrisis: false,
      },
      
      // Education Resources
      {
        title: "Post-9/11 GI Bill",
        description: "Educational benefits for veterans who served on active duty after September 10, 2001. Covers tuition, housing allowance, books, and supplies for college, vocational, and technical training programs.",
        category: "education",
        organization: "U.S. Department of Veterans Affairs",
        phone: "1-888-442-4551",
        website: "https://www.va.gov/education/about-gi-bill-benefits/post-9-11",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
        eligibility: ["Veterans who served on active duty after 9/10/2001", "Minimum 90 days of service"],
        tags: ["tuition assistance", "housing allowance", "college benefits", "vocational training"],
        isNational: true,
        isCrisis: false,
      },
      {
        title: "Veteran Upward Bound",
        description: "Free educational counseling and tutorial services to help veterans refresh academic skills, prepare for college entrance exams, and successfully transition to postsecondary education.",
        category: "education",
        organization: "U.S. Department of Education",
        phone: "1-800-USA-LEARN",
        website: "https://www2.ed.gov/programs/trio/index.html",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
        eligibility: ["Low-income veterans", "First-generation college students"],
        tags: ["college prep", "tutoring", "academic counseling", "test preparation"],
        isNational: true,
        isCrisis: false,
      },
      {
        title: "Student Veterans of America",
        description: "National coalition of student veteran groups providing peer-to-peer networks, resources, and advocacy to empower student veterans. Chapters at colleges nationwide offer mentorship and support.",
        category: "education",
        organization: "Student Veterans of America",
        phone: "1-202-223-4710",
        email: "info@studentveterans.org",
        website: "https://studentveterans.org",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
        eligibility: ["Student veterans", "Current college students who are veterans"],
        tags: ["peer support", "mentorship", "college success", "networking"],
        isNational: true,
        isCrisis: false,
      },
      
      // Additional Crisis Resources
      {
        title: "Military OneSource",
        description: "24/7 support for military members and their families offering counseling, financial counseling, spouse employment assistance, and more. Confidential and free to all service members.",
        category: "crisis",
        organization: "Department of Defense",
        phone: "1-800-342-9647",
        website: "https://www.militaryonesource.mil",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
        eligibility: ["Active duty", "Guard and Reserve", "Military families"],
        tags: ["24/7 support", "counseling", "family support", "financial counseling"],
        isNational: true,
        isCrisis: true,
      },
      {
        title: "SAMHSA National Helpline",
        description: "Free, confidential, 24/7 treatment referral and information service for individuals and families facing mental health and/or substance use disorders.",
        category: "crisis",
        organization: "SAMHSA",
        phone: "1-800-662-4357",
        website: "https://www.samhsa.gov/find-help/national-helpline",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        latitude: "",
        longitude: "",
        eligibility: ["All individuals", "Family members"],
        tags: ["substance abuse", "mental health crisis", "treatment referral", "24/7 helpline"],
        isNational: true,
        isCrisis: true,
      },
    ];

    sampleResources.forEach((resource) => {
      const id = randomUUID();
      this.resources.set(id, { ...resource, id });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
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
    const response: QuestionnaireResponse = { ...insertResponse, id };
    this.questionnaireResponses.set(id, response);
    return response;
  }

  async getQuestionnaireResponse(id: string): Promise<QuestionnaireResponse | undefined> {
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

  async getMatchedResources(needs: string[], zipCode?: string): Promise<Resource[]> {
    const allResources = Array.from(this.resources.values());
    
    // Filter resources by matching needs to categories
    const matchedResources = allResources.filter((resource) => {
      return needs.includes(resource.category);
    });

    // Prioritize national resources and crisis resources
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
