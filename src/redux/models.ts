export interface Tree {
  id: number;
  name?: string;
  sectionIds: number[];
}

export interface Section {
  id: number;
  treeId: number;
  parentSectionId: number | null;
  parentIdeaId: number | null;
  ideaIds: number[];
}

export interface Idea {
  id: number;
  type: string;
  sectionId: number;
  parentIdeaId: number | null;
  text: string;
  textTokens: string[];
  tokenSurprisals: number[];
  mention: string;
}

export interface IdeaExport {
  text: string;
  incoming: boolean;
  outgoing: boolean;
}

export interface Comment {
  id: number;
  ideaId: number;
  text: string;
  history: [string, string][]; // [user/daemon, text]
  daemonName: string;
  daemonType: string;
  userApproved: boolean;
}

export interface ChatDaemonConfig {
  id: number;
  name: string;
  systemPrompt: string;
  userPrompts: string[];
  enabled: boolean;
}

export interface BaseDaemonConfig {
  mainTemplate: string;
  ideaTemplate: string;
  temperature: number;
}

export interface InstructDaemonConfig {
  systemPrompt: string;
  userPrompt: string;
}