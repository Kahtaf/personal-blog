import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Kahtaf Alam",
  EMAIL: "kahtaf@gmail.com",
  DESCRIPTION:
    "Toronto software engineering leader building AI data infrastructure, consumer applications, and tools for user-owned data.",
  JOB_TITLE: "Software Engineering Lead",
  LOCATION: "Toronto, Canada",
  IMAGE: "/og/home.png",
  KNOWS_ABOUT: [
    "software engineering",
    "AI infrastructure",
    "user-owned data",
    "data portability",
    "browser automation",
    "cloud infrastructure",
    "developer tools",
  ],
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Kahtaf Alam",
  DESCRIPTION:
    "Kahtaf Alam is a Toronto software engineering lead building AI data infrastructure, consumer products, and tools for user-owned data.",
};

export const BLOG: Metadata = {
  TITLE: "Technical Blog",
  DESCRIPTION:
    "Technical essays by Kahtaf Alam on AI agents, browser automation, cloud infrastructure, cryptography, OAuth, and user-owned data systems.",
};

export const WORK: Metadata = {
  TITLE: "Engineering Work",
  DESCRIPTION:
    "Kahtaf Alam's engineering leadership experience across Vana, ApplyBoard, AppCentrica, IBM, data infrastructure, AI products, and cloud systems.",
};

export const ABOUT: Metadata = {
  TITLE: "About Kahtaf Alam",
  DESCRIPTION:
    "About Kahtaf Alam, a Toronto software engineer and technical lead focused on AI infrastructure, data portability, cloud systems, and useful developer tools.",
};

export const RESUME: Metadata = {
  TITLE: "Resume",
  DESCRIPTION:
    "Resume for Kahtaf Alam, software engineering lead with experience in AI data infrastructure, backend systems, cloud platforms, and consumer applications.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects by Kahtaf Alam",
  DESCRIPTION:
    "Selected software projects by Kahtaf Alam, including developer tools, apps, experiments, and open-source work when public entries are available.",
};

export const SOCIALS: Socials = [
  { 
    NAME: "twitter-x",
    HREF: "https://twitter.com/kahtaf",
  },
  { 
    NAME: "github",
    HREF: "https://github.com/kahtaf"
  },
  { 
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/kahtaf",
  }
];
