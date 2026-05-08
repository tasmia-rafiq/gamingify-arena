import { useEffect } from "react";
import { memo, useMemo, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { convertYouTubeLinksToEmbed } from "../../utils/embedYoutube";

const TOOLBAR_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "indent",
  "link",
  "image",
  "video",
];

/**
 * @param {function} onChange - Called with the HTML string on every change
 * @param {boolean}  disabled - Disables the editor while form is submitting
 */

const BlogEditor = ({ onChange, disabled = false, value }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const handlePaste = (e) => {
      const quill = quillRef.current?.getEditor();
      if (!quill) return;

      const pastedText = (e.clipboardData && e.clipboardData.getData("text")) || "";

      const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = pastedText.match(youtubeRegex);

      if (!match) return;

      e.preventDefault();

      const videoId = match[1];
      const range = quill.getSelection(true) || { index: quill.getLength(), length: 0 };

      // Remove any selected text first
      if (range.length && range.length > 0) {
        try {
          quill.deleteText(range.index, range.length);
        } catch (err) {
          // ignore
        }
      }

      // Defensive: Some paste handlers may still insert content. Remove any plain pasted text
      // that may have been inserted at the selection index before inserting the embed.
      const pastedLength = pastedText.length || 0;

      // Use a micro task to run after other paste listeners (covers cases where Quill's
      // own clipboard handler inserts content before our handler). We delete any inserted
      // pasted content, then insert the embed.
      setTimeout(() => {
        if (pastedLength > 0) {
          try {
            quill.deleteText(range.index, pastedLength);
          } catch (err) {
            // ignore
          }
        }

        // Insert embed at original index
        try {
          quill.insertEmbed(
            range.index,
            "video",
            `https://www.youtube.com/embed/${videoId}`,
          );

          // Move cursor after embed
          quill.setSelection(range.index + 1);
        } catch (err) {
          // ignore insertion errors
        }
      }, 0);
    };

    // Add listener in capture phase so we run before Quill's default paste handler
    quill.root.addEventListener("paste", handlePaste, true);

    return () => {
      quill.root.removeEventListener("paste", handlePaste, true);
    };
  }, []);

  const editorStyle = useMemo(
    () => ({
      opacity: disabled ? 0.6 : 1,
      pointerEvents: disabled ? "none" : "auto",
    }),
    [disabled],
  );

  const transformedYTLinks = convertYouTubeLinksToEmbed(value || "");
  return (
    <div style={editorStyle}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={transformedYTLinks}
        onChange={onChange}
        modules={TOOLBAR_MODULES}
        formats={FORMATS}
        placeholder="Write your detailed blog content here..."
        readOnly={disabled}
      />
    </div>
  );
};

export default memo(BlogEditor);
