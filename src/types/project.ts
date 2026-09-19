export interface ProjectComment {
  _id?: string;
  name: string;
  content: string;
  createdAt: string;
}

export interface ManagedProject {
  _id: string;
  title: string;
  description: string;
  techStack?: string[];
  images?: Array<{ url: string }>;
  githubUrl?: string;
  liveUrl?: string;
  likes?: number;
  comments?: ProjectComment[];
}
