import { PersistedState } from "redux-persist";
import migrations from "../migrations";
import { RootState } from "../../store";
import { initialTreeState } from "../../treeSlice";
import { initialSectionState } from "../../sectionSlice";
import { initialIdeaState } from "../../ideaSlice";
import { initialCommentState } from "../../commentSlice";
import { defaultDaemonState } from "../../../daemons/daemonInstructions";
import { initialConfigState } from "../../configSlice";
import { initialUiState } from "../../uiSlice";
import { initialErrorState } from "../../errorSlice";
import { V0StoreState, V0to1Migration, V0to1UserPrompt } from "../v0to1migration";
import { V1StoreState, V1to2Migration } from "../v1to2migration";
import { IdeaType } from "../../models";

describe('Migrations', () => {
  it('should migrate state correctly', () => {
    const initialState: PersistedState = {
      _persist: {
        version: -1,
        rehydrated: true
      }
    };

    const expectedState: RootState = {
      tree: initialTreeState,
      section: initialSectionState,
      idea: initialIdeaState,
      comment: initialCommentState,
      daemon: defaultDaemonState,
      config: initialConfigState,
      ui: initialUiState,
      error: initialErrorState,
      _persist: {
        version: Object.keys(migrations).length - 1,
        rehydrated: true
      }
    };

    let migratedState: PersistedState = initialState;
    Object.keys(migrations).forEach(version => {
      const migration = migrations[version];
      migratedState = migration(migratedState);
      migratedState!._persist.version = migratedState!._persist.version + 1;
    });

    expect(migratedState).toEqual(expectedState);
  });

  it('should migrate v0 state with existing progress to v1 correctly', () => {
    const v0State: V0StoreState = {
      tree: {
        trees: [
          {
            id: 1,
            name: 'Project Alpha',
            sectionIds: [1]
          }
        ]
      },
      section: {
        sections: [
          {
            id: 1,
            treeId: 1,
            parentSectionId: null,
            parentIdeaId: null,
            ideaIds: [1]
          }
        ]
      },
      idea: {
        ideas: [
          {
            id: 1,
            isUser: true,
            sectionId: 1,
            parentIdeaId: null,
            text: 'Initial idea for project',
            textTokens: ['Initial', 'idea', 'for', 'project'],
            tokenSurprisals: [0.1, 0.2, 0.3, 0.4]
          }
        ]
      },
      comment: {
        comments: [
          {
            id: 1,
            ideaId: 1,
            text: 'This is a great start!',
            daemonName: 'Clarity',
            daemonType: 'chat',
            userApproved: true
          }
        ]
      },
      daemon: {
        chatDaemons: [
          {
            id: 1,
            name: 'LegacyDaemon',
            description: 'A legacy daemon from v0',
            rules: 'Must follow the rules',
            enabled: true
          }
        ],
        baseDaemon: {
          mainTemplate: 'legacyMainTemplate',
          ideaTemplate: 'legacyIdeaTemplate',
          commentTemplate: 'legacyCommentTemplate'
        },
        instructDaemon: {
          systemPrompt: 'legacySystemPrompt',
          contextTemplate: 'legacyContextTemplate'
        }
      },
      config: {
        openAIKey: "legacyOpenAIKey",
        openAIOrgId: "legacyOpenAIOrgId",
        baseModel: "legacyBaseModel",
        chatModel: "legacyChatModel",
        isSynchronizerActive: true
      },
      ui: initialUiState,
      error: initialErrorState,
      _persist: {
        version: 0,
        rehydrated: true
      }
    };

    const expectedV1State: V1StoreState = {
      ...v0State,
      daemon: {
        chatDaemons: [
          {
            id: 1,
            name: 'LegacyDaemon',
            systemPrompt: 'A legacy daemon from v0\nMust follow the rules',
            userPrompts: [V0to1UserPrompt],
            enabled: true
          },
          ...defaultDaemonState.chatDaemons.map(daemon => ({ ...daemon, id: daemon.id + 1 }))
        ],
        baseDaemon: defaultDaemonState.baseDaemon,
        instructDaemon: defaultDaemonState.instructDaemon
      },
      _persist: {
        version: 1,
        rehydrated: true
      }
    };

    const migratedState = V0to1Migration(v0State);
    migratedState._persist.version = 1;

    expect(migratedState).toEqual(expectedV1State);
  });

  describe('V1to2Migration', () => {
    it('should correctly migrate V1 ideas state to V2', () => {
      const v1State: V1StoreState = {
        tree: initialTreeState,
        section: initialSectionState,
        idea: {
          ideas: {
            1: {
              id: 1,
              isUser: true,
              sectionId: 101,
              parentIdeaId: null,
              text: "User's first idea",
              textTokens: ["User's", "first", "idea"],
              tokenSurprisals: [0.1, 0.2, 0.3]
            },
            2: {
              id: 2,
              isUser: false,
              sectionId: 101,
              parentIdeaId: 1,
              text: "User instructs AI",
              textTokens: ["User", "instructs", "AI"],
              tokenSurprisals: [0.2, 0.3, 0.4]
            },
            3: {
              id: 3,
              isUser: false,
              sectionId: 101,
              parentIdeaId: 2,
              text: "AI's response",
              textTokens: ["AI's", "response"],
              tokenSurprisals: [0.4, 0.5]
            }
          }
        },
        comment: initialCommentState,
        daemon: defaultDaemonState,
        config: initialConfigState,
        ui: initialUiState,
        error: initialErrorState,
        _persist: {
          version: 1,
          rehydrated: true
        }
      };

      const expectedV2State: RootState = {
        ...v1State,
        idea: {
          ideas: {
            1: {
              id: 1,
              type: IdeaType.User,
              sectionId: 101,
              parentIdeaId: null,
              text: "User's first idea",
              textTokens: ["User's", "first", "idea"],
              tokenSurprisals: [0.1, 0.2, 0.3]
            },
            2: {
              id: 2,
              type: IdeaType.InstructionToAi,
              sectionId: 101,
              parentIdeaId: 1,
              text: "User instructs AI",
              textTokens: ["User", "instructs", "AI"],
              tokenSurprisals: [0.2, 0.3, 0.4]
            },
            3: {
              id: 3,
              type: IdeaType.InstructionToAi,
              sectionId: 101,
              parentIdeaId: 2,
              text: "AI's response",
              textTokens: ["AI's", "response"],
              tokenSurprisals: [0.4, 0.5]
            }
          }
        }
      };

      const migratedState = V1to2Migration(v1State);

      expect(migratedState).toEqual(expectedV2State);
    });
  });
});