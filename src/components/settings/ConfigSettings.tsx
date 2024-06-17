import styled from "styled-components";
import { SettingLabel, TextInput } from "../../styles/sharedStyles";
import { setOpenaiKey, setOpenaiOrgId, updateBaseModel, updateChatModel } from "../../redux/configSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";


const TextSettingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 auto;
`;

const ConfigSettings = () => {
  const dispatch = useAppDispatch();
  const openAIKey = useAppSelector(state => state.config.openAIKey);
  const openAIOrgId = useAppSelector(state => state.config.openAIOrgId);
  const chatModel = useAppSelector(state => state.config.chatModel);
  const baseModel = useAppSelector(state => state.config.baseModel);

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

export default ConfigSettings;