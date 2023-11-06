export interface Document {
  id: string;
  name: string;
  content: string;
  type: string;
  size: string;
  uploadDate: string;
  chapters: Chapter[];
}

export interface DocumentState {
  items: Document[];
}

export interface EditDocumentDTO {
  id: string;
  chapters: Chapter[];
}

export interface Message {
  id: string;
  content: string;
  type: string;
}

export interface MessageState {
  items: Message[];
}

export interface Chapter {
  id: number;
  tag: string;
  name: string;
  description: string;
  color: string;
  permissionSubject: string;
}

export interface ChapterState {
  items: Chapter[];
}

export interface AccessTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  data: {
    name: string;
    email: string;
    password: string;
    isActive: boolean;
    roleId: number;
  };
}
