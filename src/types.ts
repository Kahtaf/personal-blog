export type Site = {
  NAME: string;
  EMAIL: string;
  DESCRIPTION: string;
  JOB_TITLE: string;
  LOCATION: string;
  IMAGE: string;
  KNOWS_ABOUT: string[];
  NUM_POSTS_ON_HOMEPAGE: number;
  NUM_WORKS_ON_HOMEPAGE: number;
  NUM_PROJECTS_ON_HOMEPAGE: number;
};

export type Metadata = {
  TITLE: string;
  DESCRIPTION: string;
};

export type Socials = {
  NAME: string;
  HREF: string;
}[];
