import styled from "styled-components";
import { Hint, SettingLabel, TextInput } from "../../styles/sharedStyles";
import { updateOpenAIConfig } from "../../redux/configSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";


const TextSettingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 auto;
`;

const ConfigSettings = () => {
  const dispatch = useAppDispatch();
  const openAIConfig = useAppSelector(state => state.config.openAI);

  const handleOpenAIConfigChange = (field: string, value: string) => {
    dispatch(updateOpenAIConfig({ [field]: value }));
  };

  return (
    <div>
      <TextSettingContainer>
        <SettingLabel>OpenAI API key</SettingLabel>
        <TextInput
          placeholder="sk-..."
          value={openAIConfig.ApiKey}
          onChange={(event) => handleOpenAIConfigChange('ApiKey', event.target.value)}
        />
      </TextSettingContainer>
      <TextSettingContainer>
        <SettingLabel>OpenAI organization ID</SettingLabel>
        <TextInput
          placeholder="org-..."
          value={openAIConfig.OrgId}
          onChange={(event) => handleOpenAIConfigChange('OrgId', event.target.value)}
        />
        <Hint>Optional</Hint>
      </TextSettingContainer>
      <TextSettingContainer>
        <SettingLabel>Chat model</SettingLabel>
        <TextInput
          placeholder={openAIConfig.chatModel}
          value={openAIConfig.chatModel}
          onChange={(event) => handleOpenAIConfigChange('chatModel', event.target.value)}
        />
        <Hint>Used by daemons and 'Ask AI'</Hint>
      </TextSettingContainer>
      <TextSettingContainer>
        <SettingLabel>Base model</SettingLabel>
        <TextInput
          placeholder={openAIConfig.baseModel}
          value={openAIConfig.baseModel}
          onChange={(event) => handleOpenAIConfigChange('baseModel', event.target.value)}
        />
        <Hint>Used by 'AI suggestions'</Hint>
      </TextSettingContainer>
    </div>
  )
}

export default ConfigSettings;