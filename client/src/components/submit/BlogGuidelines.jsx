const Example = ({ children }) => (
  <div className="bg-slate-900 text-slate-100 px-3 py-2 rounded-md text-sm leading-relaxed font-mono">{children}</div>
);

const BlogGuidelines = () => {
  return (
    <aside className="bg-bg p-6 rounded-xl shadow-sm h-fit border border-slate-800">
      <h2 className="text-xl font-semibold mb-4 text-white">Writing Tips — Gamingify</h2>

      <p className="text-sm text-slate-400 mb-4">
        Follow these guidelines to make your post look professional and perform well on the platform.
      </p>

      <ul className="space-y-3 text-sm text-slate-300 mb-4">
        <li>🎮 Open with an engaging hook — tell readers why this matters.</li>
        <li>🧠 Add original insight or a clear opinion; avoid copy-paste summaries.</li>
        <li>📸 Use a clear, high-resolution cover image (16:9 recommended).</li>
        <li>📊 Use headings, short paragraphs and lists for skimmability.</li>
        <li>🔗 Add helpful links and timestamps for embedded videos where relevant.</li>
        <li>🔥 Add a short personal takeaway or score to help readers decide quickly.</li>
      </ul>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Title (max 200 chars)</h3>
          <p className="text-xs text-slate-400 mb-2">Make it descriptive and include year/game name where relevant.</p>
          <Example>Here are the Top 10 RPGs You Must Play in 2026</Example>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Summary (max 300 chars)</h3>
          <p className="text-xs text-slate-400 mb-2">A one-paragraph teaser that highlights what the reader will learn.</p>
          <Example>A concise guide to the best RPG experiences of 2026 — comparisons, pros/cons, and where to start.</Example>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Category</h3>
          <p className="text-xs text-slate-400 mb-2">Choose the most relevant category (News, Reviews, Tips & Guides).</p>
          <Example>Reviews  — when you review a game; Tips & Guides — how-to, walkthroughs.</Example>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Cover image</h3>
          <p className="text-xs text-slate-400 mb-2">Use a clear, 16:9 image (min 1200×675). Avoid watermarks and low-quality screenshots.</p>
          <Example>High-res screenshot or artwork, 1200×675 px, .jpg or .png</Example>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Content & embeds</h3>
          <p className="text-xs text-slate-400 mb-2">Use headings, short paragraphs, and embed YouTube links — paste a YouTube URL and the editor will embed it for you.</p>
          <Example>Paste: https://www.youtube.com/watch?v=VIDEO_ID → embedded player</Example>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white mb-1">Quick checklist</h3>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Proofread for spelling and grammar</li>
            <li>• Add at least one image or screenshot</li>
            <li>• Use headings (H2/H3) to break sections</li>
            <li>• Add a personal conclusion or score</li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default BlogGuidelines;