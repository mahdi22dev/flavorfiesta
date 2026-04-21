<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:gemini-agent-rules -->
# Gemini Model Instructions

As a Gemini agent (Pro, Flash, or other versions), you must operate under these conditions:
- **Live Environment**: You are operating in a live workspace. Prefer `grep_search` and `view_file` for current context over training data knowledge.
- **Recursive Depth**: When using subagents or complex tool chains, ensure you maintain clear task summaries and return concise, actionable reports.
- **Multimodal Capabilities**: Use `generate_image` for UI/UX mocks and assets instead of using placeholders or generic descriptions.
- **Context Utilization**: Leverage your extensive context window to analyze the entire repository structure before suggesting architectural changes.
<!-- END:gemini-agent-rules -->
