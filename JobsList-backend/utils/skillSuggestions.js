// Curated learning pathways and recommendations for popular developer skills
const SKILL_DATABASE = {
  react: {
    name: "React",
    category: "Frontend",
    difficulty: "Intermediate",
    timeToLearn: "2-3 weeks",
    topics: ["Component lifecycle & Hooks (useEffect, useMemo, useCallback)", "State management (Zustand/Redux)", "Server Components & Suspense", "Custom hooks creation"],
    resources: [
      { title: "React Official Docs (React.dev)", url: "https://react.dev/learn", type: "Docs" },
      { title: "Full Stack Open (University of Helsinki)", url: "https://fullstackopen.com/", type: "Course" }
    ],
    projectTip: "Build an interactive dashboard with dynamic state, real-time filters, and persistent local caching."
  },
  typescript: {
    name: "TypeScript",
    category: "Languages",
    difficulty: "Intermediate",
    timeToLearn: "1-2 weeks",
    topics: ["Generics & Type Constraints", "Union & Intersection types", "Utility Types (Pick, Omit, Partial)", "Zod schema validation"],
    resources: [
      { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", type: "Docs" },
      { title: "Total TypeScript by Matt Pocock", url: "https://www.totaltypescript.com/", type: "Tutorials" }
    ],
    projectTip: "Migrate an existing JavaScript project to strict mode TypeScript with zero 'any' types."
  },
  "node.js": {
    name: "Node.js",
    category: "Backend",
    difficulty: "Intermediate",
    timeToLearn: "2-3 weeks",
    topics: ["Event Loop & Async I/O", "Streams & Buffers", "RESTful API design with Express/Fastify", "JWT & Session authentication"],
    resources: [
      { title: "Node.js Official Guides", url: "https://nodejs.org/en/docs/guides", type: "Docs" },
      { title: "Node.js Design Patterns", url: "https://www.nodejsdesignpatterns.com/", type: "Book" }
    ],
    projectTip: "Build a high-throughput REST API with rate-limiting, error middleware, and logging."
  },
  docker: {
    name: "Docker",
    category: "DevOps & Cloud",
    difficulty: "Intermediate",
    timeToLearn: "1-2 weeks",
    topics: ["Multi-stage Dockerfiles", "Docker Compose for multi-container apps", "Volume mounts & caching", "Container security & minimal base images"],
    resources: [
      { title: "Docker Getting Started", url: "https://docs.docker.com/get-started/", type: "Docs" },
      { title: "Docker Mastery on Udemy/YouTube", url: "https://www.docker.com/101-tutorial/", type: "Tutorial" }
    ],
    projectTip: "Containerize a fullstack app (frontend, backend, database) with an orchestrated docker-compose.yml file."
  },
  kubernetes: {
    name: "Kubernetes",
    category: "DevOps & Cloud",
    difficulty: "Advanced",
    timeToLearn: "3-4 weeks",
    topics: ["Pods, Deployments, and ReplicaSets", "Services & Ingress controllers", "ConfigMaps and Secrets", "Helm chart packaging"],
    resources: [
      { title: "Kubernetes Documentation", url: "https://kubernetes.io/docs/home/", type: "Docs" },
      { title: "Kubernetes the Hard Way", url: "https://github.com/kelseyhightower/kubernetes-the-hard-way", type: "Hands-on" }
    ],
    projectTip: "Deploy a microservice cluster on local Minikube or k3s with auto-healing and horizontal pod autoscaling."
  },
  aws: {
    name: "AWS",
    category: "DevOps & Cloud",
    difficulty: "Intermediate to Advanced",
    timeToLearn: "3-4 weeks",
    topics: ["S3, EC2, and IAM policies", "Serverless Lambda & API Gateway", "ECS / EKS container workloads", "CloudFront CDN and RDS databases"],
    resources: [
      { title: "AWS Skill Builder", url: "https://explore.skillbuilder.aws/", type: "Free Course" },
      { title: "AWS Solutions Architecture guides", url: "https://aws.amazon.com/architecture/", type: "Docs" }
    ],
    projectTip: "Host a serverless REST API using AWS Lambda, DynamoDB/RDS, and CloudFront with infrastructure-as-code."
  },
  mongodb: {
    name: "MongoDB",
    category: "Database",
    difficulty: "Beginner to Intermediate",
    timeToLearn: "1-2 weeks",
    topics: ["Aggregation Pipelines", "Indexing & Query Optimization", "Mongoose schema validations & relations", "Transactions & replica sets"],
    resources: [
      { title: "MongoDB University (M001 / M121)", url: "https://learn.mongodb.com/", type: "Course" },
      { title: "MongoDB Manual", url: "https://www.mongodb.com/docs/manual/", type: "Docs" }
    ],
    projectTip: "Design an optimized e-commerce schema with compound indexes and complex aggregate reports."
  },
  postgresql: {
    name: "PostgreSQL",
    category: "Database",
    difficulty: "Intermediate",
    timeToLearn: "2 weeks",
    topics: ["Complex joins & Subqueries", "ACID transactions & Isolations", "Indexing (B-Tree, GIN, GiST)", "Prisma/TypeORM migrations"],
    resources: [
      { title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/", type: "Tutorial" },
      { title: "Use The Index, Luke!", url: "https://use-the-index-luke.com/", type: "Guide" }
    ],
    projectTip: "Implement a transactional financial ledger with balance checks and row-level locks."
  },
  redis: {
    name: "Redis",
    category: "Database & Caching",
    difficulty: "Beginner to Intermediate",
    timeToLearn: "1 week",
    topics: ["In-memory data structures (Hashes, Sets, Sorted Sets)", "Pub/Sub messaging", "Cache invalidation strategies (TTL, LRU)", "Rate limiting algorithms"],
    resources: [
      { title: "Redis University", url: "https://university.redis.com/", type: "Course" },
      { title: "Redis Commands Reference", url: "https://redis.io/commands/", type: "Docs" }
    ],
    projectTip: "Add Redis caching to hot API routes with cache invalidation and token bucket rate limiting."
  },
  graphql: {
    name: "GraphQL",
    category: "Backend",
    difficulty: "Intermediate",
    timeToLearn: "1-2 weeks",
    topics: ["Schema Definition Language (SDL)", "Queries, Mutations & Subscriptions", "DataLoader to solve N+1 queries", "Apollo Client & Server integration"],
    resources: [
      { title: "GraphQL.org Learn", url: "https://graphql.org/learn/", type: "Docs" },
      { title: "Apollo Odyssey", url: "https://www.apollographql.com/tutorials/", type: "Interactive" }
    ],
    projectTip: "Create a GraphQL API with batching/caching using DataLoader for relational data."
  },
  "next.js": {
    name: "Next.js",
    category: "Frontend / Fullstack",
    difficulty: "Intermediate",
    timeToLearn: "2 weeks",
    topics: ["App Router & Server Components", "Server Actions & Mutations", "Static vs Dynamic Rendering (ISR, SSR)", "Optimized Images and Fonts"],
    resources: [
      { title: "Next.js Learn", url: "https://nextjs.org/learn", type: "Interactive Course" }
    ],
    projectTip: "Build a performant blog or SaaS product with server rendering, metadata SEO, and Auth.js."
  },
  python: {
    name: "Python",
    category: "Languages & Data",
    difficulty: "Beginner to Intermediate",
    timeToLearn: "2-3 weeks",
    topics: ["OOP & Functional paradigms", "FastAPI / Django backend development", "Pandas, NumPy for data manipulation", "Asyncio & concurrency"],
    resources: [
      { title: "Python Official Tutorial", url: "https://docs.python.org/3/tutorial/", type: "Docs" },
      { title: "FastAPI Documentation", url: "https://fastapi.tiangolo.com/", type: "Docs" }
    ],
    projectTip: "Build an async REST microservice using FastAPI with automated Swagger documentation and Pydantic validation."
  },
  "tailwind css": {
    name: "Tailwind CSS",
    category: "Frontend",
    difficulty: "Beginner",
    timeToLearn: "3-5 days",
    topics: ["Utility-first workflow", "Responsive variants (sm, md, lg)", "Arbitrary values & theme customization", "Dark mode & transition utilities"],
    resources: [
      { title: "Tailwind CSS Docs", url: "https://tailwindcss.com/docs", type: "Docs" }
    ],
    projectTip: "Build a responsive, accessible landing page with custom colors and dark mode toggle."
  },
  "ci/cd": {
    name: "CI/CD",
    category: "DevOps",
    difficulty: "Intermediate",
    timeToLearn: "1 week",
    topics: ["GitHub Actions workflows", "Automated linting and unit testing", "Artifact build & Docker push", "Deployment automation to staging/production"],
    resources: [
      { title: "GitHub Actions Documentation", url: "https://docs.github.com/en/actions", type: "Docs" }
    ],
    projectTip: "Set up a GitHub Actions workflow that runs test suites on PRs and auto-deploys merged code to cloud."
  },
  git: {
    name: "Git",
    category: "Tools & Methodologies",
    difficulty: "Beginner",
    timeToLearn: "3-5 days",
    topics: ["Branching & Pull Request workflows", "Interactive rebase & cherry-pick", "Resolving merge conflicts", "Git Hooks with Husky"],
    resources: [
      { title: "Pro Git Book", url: "https://git-scm.com/book/en/v2", type: "Book" }
    ],
    projectTip: "Maintain clean conventional commits and pull request templates across repository projects."
  }
};

/**
 * Normalizes skill strings for reliable matching (e.g., 'React.js' -> 'react', 'Node' -> 'node.js')
 */
const normalizeSkillName = (skill) => {
  if (!skill) return "";
  const s = skill.toString().trim().toLowerCase();
  
  if (s === "react" || s === "react.js" || s === "reactjs") return "react";
  if (s === "node" || s === "node.js" || s === "nodejs") return "node.js";
  if (s === "ts" || s === "typescript") return "typescript";
  if (s === "js" || s === "javascript") return "javascript";
  if (s === "next" || s === "next.js" || s === "nextjs") return "next.js";
  if (s === "k8s" || s === "kubernetes") return "kubernetes";
  if (s === "mongo" || s === "mongodb") return "mongodb";
  if (s === "postgres" || s === "postgresql" || s === "psql") return "postgresql";
  if (s === "tailwind" || s === "tailwindcss" || s === "tailwind css") return "tailwind css";
  if (s === "ci/cd" || s === "cicd" || s === "ci-cd") return "ci/cd";
  
  return s;
};

/**
 * Generates tailored suggestions for a given missing skill
 */
const getSuggestionForSkill = (rawSkillName) => {
  const normalized = normalizeSkillName(rawSkillName);
  const found = SKILL_DATABASE[normalized];

  if (found) {
    return {
      skill: found.name,
      category: found.category,
      difficulty: found.difficulty,
      estimatedTime: found.timeToLearn,
      keyTopics: found.topics,
      resources: found.resources,
      practicalTip: found.projectTip,
    };
  }

  // Fallback dynamic suggestion for custom skills
  const cleanName = rawSkillName.trim();
  return {
    skill: cleanName,
    category: "Technical Skill",
    difficulty: "Intermediate",
    estimatedTime: "1-2 weeks",
    keyTopics: [
      `Core fundamentals & architecture of ${cleanName}`,
      `Best practices and common production patterns in ${cleanName}`,
      `Integration with existing frontend/backend workflows`,
      `Debugging and performance profiling`,
    ],
    resources: [
      {
        title: `${cleanName} Official Documentation`,
        url: `https://www.google.com/search?q=${encodeURIComponent(cleanName + " official documentation")}`,
        type: "Docs",
      },
      {
        title: `${cleanName} Crash Course & Tutorial`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanName + " crash course full tutorial")}`,
        type: "Video",
      },
    ],
    practicalTip: `Build a mini-demo or add a feature in your current project using ${cleanName} to showcase on your GitHub and resume.`,
  };
};

module.exports = {
  SKILL_DATABASE,
  normalizeSkillName,
  getSuggestionForSkill,
};
