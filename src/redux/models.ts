export interface Node {
  id: number;
  parentNodeId: number | null;
  parentIdeaId: number | null;
  ideas: Idea[];
}

export interface Idea {
  id: number;
  parentIdeaId: number | null;
  text: string;
  textTokens: string[];
  tokenSurprisals: number[];
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
  daemonName: string;
  daemonType: string;
  userApproved: boolean;
}

export interface ChatDaemonConfig {
  id: number;
  name: string;
  systemPrompt: string;
  startInstruction: string;
  chainOfThoughtInstructions: string[];
  endInstruction: string;
  enabled: boolean;
}

export interface BaseDaemonConfig {
  mainTemplate: string;
  ideaTemplate: string;
  commentTemplate: string;
}