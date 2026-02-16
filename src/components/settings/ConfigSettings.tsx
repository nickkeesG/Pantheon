import { useAppDispatch, useAppSelector } from "../../hooks";
import { updateOpenAIConfig } from "../../redux/configSlice";

const TextSetting = ({
	label,
	hint,
	...inputProps
}: {
	label: string;
	hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
	<div className="flex flex-col items-start mx-auto my-2">
		<p className="text-sm text-[var(--text-color-secondary)]">{label}</p>
		<input
			className="w-full p-2 box-border font-ai text-xs text-[var(--text-color)] bg-[var(--bg-color-secondary)] border-[0.5px] border-[var(--line-color)] rounded focus:outline-none"
			{...inputProps}
		/>
		{hint && (
			<div className="text-xs text-[var(--text-color-tertiary)]">{hint}</div>
		)}
	</div>
);

const ConfigSettings = () => {
	const dispatch = useAppDispatch();
	const openAIConfig = useAppSelector((state) => state.config.openAI);

	const handleOpenAIConfigChange = (field: string, value: string) => {
		dispatch(updateOpenAIConfig({ [field]: value }));
	};

	return (
		<div>
			<TextSetting
				label="OpenAI API key"
				placeholder="sk-..."
				value={openAIConfig.ApiKey}
				onChange={(e) => handleOpenAIConfigChange("ApiKey", e.target.value)}
			/>
			<TextSetting
				label="OpenAI organization ID"
				hint="Optional"
				placeholder="org-..."
				value={openAIConfig.OrgId}
				onChange={(e) => handleOpenAIConfigChange("OrgId", e.target.value)}
			/>
			<TextSetting
				label="Chat model"
				hint="Used by daemons and 'Ask AI'"
				placeholder={openAIConfig.chatModel}
				value={openAIConfig.chatModel}
				onChange={(e) => handleOpenAIConfigChange("chatModel", e.target.value)}
			/>
			<TextSetting
				label="Base model"
				hint="Used by 'AI suggestions'"
				placeholder={openAIConfig.baseModel}
				value={openAIConfig.baseModel}
				onChange={(e) => handleOpenAIConfigChange("baseModel", e.target.value)}
			/>
		</div>
	);
};

export default ConfigSettings;
