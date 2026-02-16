import type React from "react";
import { FiMessageCircle, FiShield, FiSun } from "react-icons/fi";
import { LuBrainCircuit, LuGitFork, LuUsers } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks";
import { createTree } from "../../../redux/thunks";

const LandingView: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const handleCreateTree = () => {
		const treeId = Date.now();
		dispatch(createTree(treeId));
		navigate(`/tree/${treeId}`);
	};

	return (
		<div className="flex flex-col justify-center w-[min(1024px,100%-4rem)] mx-auto my-16 sm:my-32 items-start gap-24">
			<div className="flex flex-col gap-8">
				<h1 className="text-6xl font-medium">
					Let the AI prompt{" "}
					<span className="text-[var(--accent-color-coral)]">you</span>
				</h1>
				<p className="text-2xl !text-[var(--text-color-secondary)]">
					Think freely while powerful and customizable AI characters comment on
					your thoughts
				</p>
				<div>
					<div className="flex flex-row flex-wrap items-center gap-y-8 gap-x-4 text-lg">
						<div className="relative shrink-0">
							<button
								type="button"
								onClick={handleCreateTree}
								className="cursor-pointer text-2xl font-medium text-[var(--accent-color-coral)] border border-[var(--line-color-strong)] rounded-full px-8 py-3 shadow-md hover:bg-[var(--highlight)] active:opacity-70"
							>
								Start writing
							</button>
							<p className="absolute left-5 top-full mt-1 !text-[var(--text-color-tertiary)] text-sm whitespace-nowrap">
								OpenAI API key required
							</p>
						</div>
						<Link
							to="/collection"
							className="shrink-0 text-xl font-medium !text-[var(--text-color-secondary)] !no-underline border border-[var(--line-color-strong)] rounded-full px-5 py-2 shadow-sm hover:bg-[var(--highlight)] active:opacity-70"
						>
							View my trees
						</Link>
					</div>
				</div>
			</div>
			<div className="w-full overflow-hidden rounded-lg border border-[var(--line-color-stronger)] shadow-2xl">
				<img
					src="/splash-light.png"
					alt="Pantheon screenshot"
					className="min-w-[600px] w-full dark:hidden"
				/>
				<img
					src="/splash-dark.png"
					alt="Pantheon screenshot"
					className="min-w-[600px] w-full hidden dark:block"
				/>
			</div>
			<div>
				<h2 className="text-3xl font-medium">
					A thinking environment,{" "}
					<span className="text-[var(--accent-color-coral)]">
						not a chatbot
					</span>
				</h2>
				<p className="text-lg !text-[var(--text-color-secondary)] mt-2">
					Pantheon is designed around how you actually think, not around a chat
					window
				</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
				{[
					{
						title: "Custom AI characters",
						desc: "Design AI personalities with custom system prompts that leave comments on your writing as you think. Mention them with @name to get their perspective.",
						icon: <LuUsers />,
					},
					{
						title: "Tree navigation",
						desc: "Branch your thinking into parallel paths. Each idea can spawn multiple follow-ups, so you can explore 'what if' directions without losing your main thread.",
						icon: <LuGitFork />,
					},
					{
						title: "AI predicts you",
						desc: "A base model continuously generates suggestions for what you might write next. Tweak the temperature to control how creative or focused they are.",
						icon: <LuBrainCircuit />,
					},
					{
						title: "Ask AI inline",
						desc: "Ctrl+Enter submits a question directly to an assistant AI, so you can stay in the flow.",
						icon: <FiMessageCircle />,
					},
					{
						title: "Fully private",
						desc: "All your data lives in your browser's storage. Nothing leaves your computer except API calls to the model provider.",
						icon: <FiShield />,
					},
					{
						title: "Light & dark theme",
						desc: "Follows your system preference, or set it manually.",
						icon: <FiSun />,
					},
				].map(({ title, desc, icon }) => (
					<div
						key={title}
						className="p-5 rounded-lg border border-[var(--line-color-stronger)] shadow-sm flex gap-4"
					>
						<div className="text-xl text-[var(--accent-color-coral)] mt-0.5 shrink-0">
							{icon}
						</div>
						<div>
							<h3 className="text-base font-medium mb-1">{title}</h3>
							<p className="text-sm !text-[var(--text-color-tertiary)]">
								{desc}
							</p>
						</div>
					</div>
				))}
			</div>
			<div className="w-full flex flex-col items-center gap-4">
				<h2 className="text-3xl font-medium">Ready to flow?</h2>
				<button
					type="button"
					onClick={handleCreateTree}
					className="cursor-pointer text-3xl font-medium text-[var(--accent-color-coral)] border border-[var(--line-color-strong)] rounded-full px-10 py-4 shadow-lg hover:bg-[var(--highlight)] active:opacity-70"
				>
					Start writing
				</button>
			</div>
			<div className="max-w-[720px] mx-auto p-8 rounded-lg border border-[var(--line-color-stronger)] flex flex-col gap-4 !text-[var(--text-color-secondary)]">
				<h2 className="text-2xl font-medium !text-[var(--text-color)]">
					About
				</h2>
				<p className="text-base leading-relaxed">
					Pantheon is an experimental research prototype by{" "}
					<a href="https://lovedoesnotscale.substack.com/">Niki Dupuis</a> and{" "}
					<a href="https://sofiavanhanen.fi/">Sofia Vanhanen</a> at{" "}
					<a href="https://mosaic-labs.org">Mosaic Labs</a>, exploring new ways
					to use AI to improve human thinking.
				</p>
				<p className="text-base leading-relaxed">
					You bring your own OpenAI API key — this is how Pantheon stays fully
					private. If you'd like to try it without an API key, reach out to us
					at <a href="mailto:hello@mosaic-labs.org">hello@mosaic-labs.org</a>.
				</p>
				<a
					className="w-fit"
					href="https://www.lesswrong.com/posts/JHsfMWtwxBGGTmb8A/pantheon-interface"
				>
					Read more about the project
				</a>
			</div>
		</div>
	);
};

export default LandingView;
