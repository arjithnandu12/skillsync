const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/userModel");
const Job = require("./models/jobModel");

const MONGO_URI =
  process.env.CONNECTION_STRING ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/skills-compatibility";

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB at:", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully to MongoDB.");

    // Clean existing data for a fresh, high-quality demonstration
    console.log("Cleaning existing Job and User collections...");
    await Job.deleteMany({});
    await User.deleteMany({});

    // Hash default password
    const hashedPassword = await bcrypt.hash("Password123!", 10);

    // 1. Seed Diverse Test Users with Stored Skills
    console.log("Seeding test users with stored skills in User schema...");
    const sampleUsers = [
      {
        username: "alex_fullstack",
        email: "alex@example.com",
        password: hashedPassword,
        title: "Senior Full Stack Engineer",
        bio: "Specializing in React, TypeScript, Node.js, and cloud systems with 5+ years building scalable SaaS applications.",
        experienceLevel: "Senior",
        yearsOfExperience: 5,
        location: "San Francisco, CA (Remote)",
        targetRoles: ["Senior Full Stack Engineer", "Staff Frontend Engineer", "Tech Lead"],
        skills: [
          { name: "React", proficiency: "Expert", yearsOfExperience: 5, category: "Frontend" },
          { name: "TypeScript", proficiency: "Advanced", yearsOfExperience: 4, category: "Frontend" },
          { name: "Node.js", proficiency: "Advanced", yearsOfExperience: 4, category: "Backend" },
          { name: "MongoDB", proficiency: "Advanced", yearsOfExperience: 4, category: "Database" },
          { name: "Tailwind CSS", proficiency: "Expert", yearsOfExperience: 3, category: "Frontend" },
          { name: "Git", proficiency: "Expert", yearsOfExperience: 5, category: "Tools & Methodologies" },
          { name: "Docker", proficiency: "Intermediate", yearsOfExperience: 2, category: "DevOps & Cloud" },
          { name: "REST APIs", proficiency: "Expert", yearsOfExperience: 5, category: "Backend" },
          { name: "JavaScript", proficiency: "Expert", yearsOfExperience: 5, category: "Frontend" },
        ],
      },
      {
        username: "sarah_frontend",
        email: "sarah@example.com",
        password: hashedPassword,
        title: "Frontend UI Specialist",
        bio: "Obsessed with buttery-smooth 60fps micro-interactions, responsive design, and cutting-edge React/Next.js architectures.",
        experienceLevel: "Mid-Level",
        yearsOfExperience: 3,
        location: "New York, NY",
        targetRoles: ["Frontend Engineer", "UI Engineer", "React Developer"],
        skills: [
          { name: "React", proficiency: "Advanced", yearsOfExperience: 3, category: "Frontend" },
          { name: "Next.js", proficiency: "Advanced", yearsOfExperience: 2, category: "Frontend" },
          { name: "TypeScript", proficiency: "Intermediate", yearsOfExperience: 2, category: "Frontend" },
          { name: "Tailwind CSS", proficiency: "Expert", yearsOfExperience: 3, category: "Frontend" },
          { name: "JavaScript", proficiency: "Advanced", yearsOfExperience: 3, category: "Frontend" },
          { name: "HTML5", proficiency: "Expert", yearsOfExperience: 4, category: "Frontend" },
          { name: "CSS3", proficiency: "Expert", yearsOfExperience: 4, category: "Frontend" },
          { name: "Git", proficiency: "Intermediate", yearsOfExperience: 3, category: "Tools & Methodologies" },
        ],
      },
      {
        username: "marcus_devops",
        email: "marcus@example.com",
        password: hashedPassword,
        title: "Cloud & Platform Architect",
        bio: "Designing resilient containerized platforms, automated CI/CD pipelines, and infrastructure as code across multi-cloud environments.",
        experienceLevel: "Senior",
        yearsOfExperience: 6,
        location: "Austin, TX (Remote)",
        targetRoles: ["DevOps Engineer", "Platform Engineer", "Site Reliability Engineer"],
        skills: [
          { name: "Docker", proficiency: "Expert", yearsOfExperience: 5, category: "DevOps & Cloud" },
          { name: "Kubernetes", proficiency: "Expert", yearsOfExperience: 4, category: "DevOps & Cloud" },
          { name: "AWS", proficiency: "Expert", yearsOfExperience: 5, category: "DevOps & Cloud" },
          { name: "CI/CD", proficiency: "Expert", yearsOfExperience: 5, category: "DevOps & Cloud" },
          { name: "Python", proficiency: "Advanced", yearsOfExperience: 4, category: "Backend" },
          { name: "Linux", proficiency: "Expert", yearsOfExperience: 6, category: "DevOps & Cloud" },
          { name: "Git", proficiency: "Expert", yearsOfExperience: 6, category: "Tools & Methodologies" },
        ],
      },
      {
        username: "priya_backend",
        email: "priya@example.com",
        password: hashedPassword,
        title: "Backend & Systems Developer",
        bio: "Focused on high-concurrency microservices, data pipeline integrity, and distributed caching systems.",
        experienceLevel: "Mid-Level",
        yearsOfExperience: 3,
        location: "Seattle, WA",
        targetRoles: ["Backend Engineer", "API Engineer", "Database Specialist"],
        skills: [
          { name: "Python", proficiency: "Advanced", yearsOfExperience: 3, category: "Backend" },
          { name: "PostgreSQL", proficiency: "Advanced", yearsOfExperience: 3, category: "Database" },
          { name: "Node.js", proficiency: "Intermediate", yearsOfExperience: 2, category: "Backend" },
          { name: "Redis", proficiency: "Intermediate", yearsOfExperience: 2, category: "Database" },
          { name: "Docker", proficiency: "Intermediate", yearsOfExperience: 2, category: "DevOps & Cloud" },
          { name: "REST APIs", proficiency: "Advanced", yearsOfExperience: 3, category: "Backend" },
          { name: "Git", proficiency: "Advanced", yearsOfExperience: 3, category: "Tools & Methodologies" },
        ],
      },
    ];

    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Successfully created ${createdUsers.length} users with stored skills.`);

    const primaryUserId = createdUsers[0]._id;

    // 2. Seed Rich Job Postings with Required & Preferred Skills
    console.log("Seeding realistic job postings with required and preferred skills...");
    const sampleJobs = [
      {
        title: "Senior Fullstack Engineer",
        company: "Vercel Scale Labs",
        logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop",
        location: "San Francisco, CA (Remote)",
        jobType: "Remote",
        experienceLevel: "Senior",
        category: "Fullstack",
        salary: 165000,
        salaryDisplay: "$150,000 - $175,000 / yr",
        description:
          "We are seeking an experienced Fullstack Engineer to lead architecture on our developer platform. You will build high-traffic customer portals, edge computing integrations, and state-of-the-art interactive dashboards.",
        responsibilities: [
          "Architect, build, and deploy reactive frontend modules and microservices.",
          "Collaborate with product designers to implement intuitive developer interfaces.",
          "Write robust TypeScript, automated integration tests, and optimize rendering speed.",
          "Mentor junior and mid-level engineers through detailed code reviews.",
        ],
        benefits: [
          "Competitive equity package",
          "Comprehensive health, dental, and vision insurance",
          "$3,000 annual home office & learning stipend",
          "Unlimited paid time off (PTO)",
        ],
        requiredSkills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
        preferredSkills: ["Next.js", "Docker", "Redis", "Tailwind CSS"],
        user: primaryUserId,
      },
      {
        title: "Frontend UI/UX Engineer",
        company: "Stripe",
        logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&h=120&fit=crop",
        location: "New York, NY (Hybrid)",
        jobType: "Full-time",
        experienceLevel: "Mid-Level",
        category: "Frontend",
        salary: 145000,
        salaryDisplay: "$135,000 - $155,000 / yr",
        description:
          "Join our core UI engineering team crafting the next generation of global checkout and financial dashboards. We value meticulous typography, accessibility, and high performance animation.",
        responsibilities: [
          "Translate complex financial workflows into elegant and accessible user flows.",
          "Contribute reusable UI components to our shared internal design system.",
          "Ensure compliance with WCAG AA accessibility standards across all platforms.",
          "Optimize Core Web Vitals to deliver sub-second global page loads.",
        ],
        benefits: [
          "Quarterly performance bonuses",
          "Parental leave up to 16 weeks",
          "401(k) matching up to 5%",
          "Commuter and wellness allowances",
        ],
        requiredSkills: ["React", "TypeScript", "Tailwind CSS", "JavaScript"],
        preferredSkills: ["Next.js", "GraphQL", "Framer Motion", "Jest"],
        user: primaryUserId,
      },
      {
        title: "Cloud Infrastructure & Platform Architect",
        company: "Datadog",
        logo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=120&h=120&fit=crop",
        location: "Remote (US & Canada)",
        jobType: "Remote",
        experienceLevel: "Senior",
        category: "DevOps & Cloud",
        salary: 180000,
        salaryDisplay: "$170,000 - $195,000 / yr",
        description:
          "Help scale our multi-region cloud infrastructure serving billions of telemetry events daily. You will manage Kubernetes clusters, automate deployment pipelines, and strengthen system observability.",
        responsibilities: [
          "Manage and configure production Kubernetes clusters across AWS and multi-cloud regions.",
          "Author zero-downtime CI/CD deployment pipelines using GitHub Actions.",
          "Implement proactive alerting, Prometheus metrics, and automated disaster recovery.",
          "Enforce security best practices, least privilege IAM policies, and secret management.",
        ],
        benefits: [
          "Generous stock grant with 4-year vesting",
          "100% remote flexibility with annual company summits",
          "Health wellness reimbursement",
          "Top-tier hardware setup of your choice",
        ],
        requiredSkills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
        preferredSkills: ["Python", "Linux", "Terraform", "Git"],
        user: primaryUserId,
      },
      {
        title: "Backend Distributed Systems Engineer",
        company: "Uber",
        logo: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=120&h=120&fit=crop",
        location: "Seattle, WA (Hybrid)",
        jobType: "Full-time",
        experienceLevel: "Mid-Level",
        category: "Backend",
        salary: 155000,
        salaryDisplay: "$145,000 - $165,000 / yr",
        description:
          "Work on high-throughput backend services powering real-time dispatch, routing algorithms, and geospatial calculations under extreme real-time concurrency.",
        responsibilities: [
          "Develop low-latency REST and gRPC microservices in Node.js and Go.",
          "Design scalable data schemas in PostgreSQL and utilize Redis for distributed caching.",
          "Perform load tests and resolve bottlenecks under peak traffic spikes.",
          "Collaborate with data science teams to productionize streaming event pipelines.",
        ],
        benefits: [
          "Uber ride and UberEats monthly credits",
          "Flexible work from home options",
          "Health savings account with employer contribution",
          "Tuition assistance program",
        ],
        requiredSkills: ["Node.js", "PostgreSQL", "Redis", "Docker"],
        preferredSkills: ["Python", "Kafka", "REST APIs", "AWS"],
        user: primaryUserId,
      },
      {
        title: "AI Fullstack Engineer",
        company: "Anthropic Ecosystem",
        logo: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&h=120&fit=crop",
        location: "San Francisco, CA",
        jobType: "Full-time",
        experienceLevel: "Senior",
        category: "AI & Data",
        salary: 190000,
        salaryDisplay: "$175,000 - $210,000 / yr",
        description:
          "Build cutting-edge agentic interfaces, interactive evaluations, and model playgrounds that empower enterprise teams to leverage large language models safely.",
        responsibilities: [
          "Develop responsive AI workflow canvases and streaming token chat interfaces.",
          "Integrate Python FastAPI backends with vector search and caching layers.",
          "Implement telemetry for prompt evaluation, token latency, and hallucination reduction.",
          "Design resilient streaming error handling across frontend and backend tiers.",
        ],
        benefits: [
          "Early-stage equity with massive upside",
          "Full medical, dental, and optical coverage",
          "Generous research budget for experimentation",
          "Catered gourmet meals and snacks",
        ],
        requiredSkills: ["Python", "TypeScript", "React", "Docker"],
        preferredSkills: ["FastAPI", "PostgreSQL", "Tailwind CSS", "Redis"],
        user: primaryUserId,
      },
      {
        title: "Modern React & Next.js Web Developer",
        company: "Linear Technologies",
        logo: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=120&h=120&fit=crop",
        location: "Remote (Global)",
        jobType: "Remote",
        experienceLevel: "Mid-Level",
        category: "Frontend",
        salary: 135000,
        salaryDisplay: "$125,000 - $145,000 / yr",
        description:
          "We craft project management tools that feel as fast as a desktop application. You will be directly responsible for lightning-fast keyboard shortcuts, optimistic mutations, and offline sync.",
        responsibilities: [
          "Craft instantaneous user interactions with optimistic client updates.",
          "Build accessible modal sheets, command palettes, and custom canvas charts.",
          "Profile React component re-renders to maintain 60 FPS performance.",
          "Maintain clear modular component libraries and TypeScript definitions.",
        ],
        benefits: [
          "Asynchronous, meeting-light culture",
          "Anywhere in the world remote allowance",
          "Top-spec MacBook Pro + 4K monitor",
          "Annual team retreat in Europe / Asia",
        ],
        requiredSkills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        preferredSkills: ["GraphQL", "Git", "Node.js", "HTML5"],
        user: primaryUserId,
      },
      {
        title: "Fullstack MERN Application Developer",
        company: "TechNova Solutions",
        logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=120&h=120&fit=crop",
        location: "Remote / Hybrid",
        jobType: "Full-time",
        experienceLevel: "Junior",
        category: "Fullstack",
        salary: 95000,
        salaryDisplay: "$85,000 - $105,000 / yr",
        description:
          "Great opportunity for developers with solid MERN stack foundations to level up their careers on real-world client platforms.",
        responsibilities: [
          "Build fullstack CRUD operations connecting MongoDB and Express to React.",
          "Implement token-based authentication and route guarding.",
          "Collaborate with QA engineers to debug user reports and fix UI bugs.",
          "Deploy containerized microservices to cloud hosting environments.",
        ],
        benefits: [
          "Dedicated senior engineer mentorship program",
          "Certification bonus upon completion of cloud certifications",
          "Generous healthcare options",
          "Flexible working hours",
        ],
        requiredSkills: ["JavaScript", "React", "Node.js", "MongoDB"],
        preferredSkills: ["Tailwind CSS", "Git", "REST APIs", "Docker"],
        user: primaryUserId,
      },
      {
        title: "Backend Database & Cache Engineer",
        company: "Supabase Partner Network",
        logo: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=120&h=120&fit=crop",
        location: "Chicago, IL (Hybrid)",
        jobType: "Full-time",
        experienceLevel: "Senior",
        category: "Backend",
        salary: 160000,
        salaryDisplay: "$150,000 - $170,000 / yr",
        description:
          "Looking for a seasoned database engineer to optimize high-volume transactional workloads, write complex queries, and manage distributed Redis caching instances.",
        responsibilities: [
          "Architect relational database schemas, partitioning strategies, and indexes in PostgreSQL.",
          "Implement cache invalidation policies and pub/sub message brokers using Redis.",
          "Audit slow queries and advise engineering teams on ORM optimization.",
          "Manage automated backups, replication failovers, and point-in-time recovery.",
        ],
        benefits: [
          "Annual bonus structure based on company milestones",
          "Comprehensive health and life insurance",
          "Hybrid schedule (2 days office, 3 days home)",
          "Generous 401(k) matching",
        ],
        requiredSkills: ["PostgreSQL", "Redis", "Python", "Docker"],
        preferredSkills: ["Node.js", "AWS", "CI/CD", "Git"],
        user: primaryUserId,
      },
      {
        title: "Mobile iOS & Android Engineer (React Native)",
        company: "Spotify Technology",
        logo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&h=120&fit=crop",
        location: "New York, NY (Remote)",
        jobType: "Remote",
        experienceLevel: "Senior",
        category: "Mobile",
        salary: 170000,
        salaryDisplay: "$160,000 - $180,000 / yr",
        description:
          "Help millions stream music and podcasts seamlessly on mobile. You will build high-performance React Native audio interfaces, offline caching, and cross-platform native modules.",
        responsibilities: [
          "Develop performant cross-platform mobile components in React Native and TypeScript.",
          "Optimize native bridge communication, memory usage, and audio playback queues.",
          "Write robust end-to-end mobile tests with Detox and Jest.",
          "Coordinate release builds through App Store and Google Play deployment tracks.",
        ],
        benefits: [
          "Free Spotify Premium for life + family plan",
          "Comprehensive global health insurance",
          "Annual fitness and personal wellness budget",
          "Flexible work from anywhere model",
        ],
        requiredSkills: ["React Native", "TypeScript", "JavaScript", "Redux"],
        preferredSkills: ["React", "GraphQL", "Git", "Node.js"],
        user: primaryUserId,
      },
      {
        title: "Data Platform & ETL Infrastructure Engineer",
        company: "Snowflake Cloud",
        logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&h=120&fit=crop",
        location: "San Mateo, CA (Hybrid)",
        jobType: "Full-time",
        experienceLevel: "Senior",
        category: "AI & Data",
        salary: 185000,
        salaryDisplay: "$175,000 - $200,000 / yr",
        description:
          "Architect scalable data transformation pipelines and analytics warehouses. You will ingest billions of row mutations and optimize query execution plans.",
        responsibilities: [
          "Construct resilient batch and streaming data pipelines with Python and SQL.",
          "Manage analytical storage partitions and optimize indexing in PostgreSQL and data lakes.",
          "Automate ETL workflows and monitoring using containerized services.",
          "Provide architecture guidelines for data modeling and query performance.",
        ],
        benefits: [
          "Stock purchase plan (ESPP) with discount",
          "401(k) matching up to 6%",
          "On-site cafeteria with free meals",
          "Comprehensive health & dental",
        ],
        requiredSkills: ["Python", "PostgreSQL", "SQL", "Docker"],
        preferredSkills: ["AWS", "Kafka", "Linux", "CI/CD"],
        user: primaryUserId,
      },
      {
        title: "Site Reliability & DevSecOps Engineer",
        company: "GitLab",
        logo: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&h=120&fit=crop",
        location: "Remote (Worldwide)",
        jobType: "Remote",
        experienceLevel: "Mid-Level",
        category: "DevOps & Cloud",
        salary: 140000,
        salaryDisplay: "$130,000 - $150,000 / yr",
        description:
          "Ensure high availability and ironclad security across our cloud infrastructure. You will manage vulnerability scanning, container registries, and automated incident triage.",
        responsibilities: [
          "Build automated CI/CD security scanning gates into build pipelines.",
          "Implement monitoring, tracing, and incident response playbooks.",
          "Configure Linux host hardening, VPN tunnels, and network security groups.",
          "Perform chaos engineering exercises to validate fault tolerance.",
        ],
        benefits: [
          "100% remote-first company",
          "Monthly home internet and workstation stipend",
          "Generous parental and caregiver leave",
          "Growth budget for conferences and certifications",
        ],
        requiredSkills: ["Linux", "Docker", "CI/CD", "Python"],
        preferredSkills: ["Kubernetes", "AWS", "Git", "Prometheus"],
        user: primaryUserId,
      },
      {
        title: "Cloud Solutions Architect",
        company: "Amazon Web Services (AWS)",
        logo: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=120&h=120&fit=crop",
        location: "Arlington, VA (Hybrid)",
        jobType: "Full-time",
        experienceLevel: "Lead",
        category: "DevOps & Cloud",
        salary: 210000,
        salaryDisplay: "$195,000 - $230,000 / yr",
        description:
          "Partner with enterprise engineering leadership to design mission-critical cloud native architectures, serverless backends, and multi-region disaster recovery solutions.",
        responsibilities: [
          "Design scalable, cost-efficient cloud architectures on AWS.",
          "Conduct architecture reviews evaluating reliability, security, and performance efficiency.",
          "Deliver technical workshops and proof-of-concept reference architectures.",
          "Author whitepapers and best practice documentation for developer teams.",
        ],
        benefits: [
          "Sign-on bonus and significant RSU grants",
          "Comprehensive health, vision, and mental healthcare",
          "Adoption and fertility assistance",
          "Generous relocation package",
        ],
        requiredSkills: ["AWS", "Docker", "Kubernetes", "System Design"],
        preferredSkills: ["Python", "Linux", "Terraform", "CI/CD"],
        user: primaryUserId,
      },
    ];

    const createdJobs = await Job.insertMany(sampleJobs);
    console.log(`Successfully created ${createdJobs.length} job postings with skills.`);

    console.log("\n================ SEEDING COMPLETE ================");
    console.log(`Total Users: ${createdUsers.length}`);
    sampleUsers.forEach((u) => {
      console.log(` - User: ${u.email} | Title: ${u.title} | Skills: ${u.skills.map((s) => s.name).join(", ")}`);
    });
    console.log(`Total Jobs: ${createdJobs.length}`);
    sampleJobs.forEach((j) => {
      console.log(` - Job: "${j.title}" at ${j.company} | Req Skills: [${j.requiredSkills.join(", ")}]`);
    });
    console.log("===================================================\n");

    process.exit(0);
  } catch (err) {
    console.error("Error during database seeding:", err);
    process.exit(1);
  }
};

seedDatabase();
