import styled from "styled-components";
import { TextInput } from "../../styles/sharedStyles";
import { setOpenaiKey, setOpenaiOrgId, updateBaseModel, updateChatModel } from "../../redux/llmSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";


const SettingLabel = styled.p`
  font-size: 0.8em;
  margin-bottom: 5px;
  color: var(--text-color-dark);
`;

const TextSettingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 auto;
`;

const KeySettings = () => {
  const dispatch = useAppDispatch();
  const openAIKey = useAppSelector(state => state.llm.openAIKey);
  const openAIOrgId = useAppSelector(state => state.llm.openAIOrgId);
  const chatModel = useAppSelector(state => state.llm.chatModel);
  const baseModel = useAppSelector(state => state.llm.baseModel);

  return (
    <div>
      <TextSettingContainer>
        <SettingLabel>OpenAI API key</SettingLabel>
        <TextInput
          placeholder="sk-..."
          value={openAIKey}
          onChange={(event) => dispatch(setOpenaiKey(event.target.value))}
        />
      </TextSettingContainer>
      <TextSettingContainer>
        <SettingLabel>OpenAI organization ID</SettingLabel>
        <TextInput
          placeholder="org-..."
          value={openAIOrgId}
          onChange={(event) => dispatch(setOpenaiOrgId(event.target.value))}
        />
      </TextSettingContainer>
      <TextSettingContainer>
        <SettingLabel>Chat model</SettingLabel>
        <TextInput
          placeholder={chatModel}
          value={chatModel}
          onChange={(event) => dispatch(updateChatModel(event.target.value))}
        />
      </TextSettingContainer>
      <TextSettingContainer>
        <SettingLabel>Base model</SettingLabel>
        <TextInput
          placeholder={baseModel}
          value={baseModel}
          onChange={(event) => dispatch(updateBaseModel(event.target.value))}
        />
      </TextSettingContainer>
    </div>
  )
}

export default KeySettings;