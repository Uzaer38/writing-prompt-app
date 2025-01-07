export interface Prompt {
  id: string;
  title: string;
  text: string;
  createdAt: Date;
}

export interface Response {
  id: string;
  promptId: string;
  content: string;
  createdAt: Date;
}