import { useCallback, useRef } from "react";
import { UploadCloud, X } from "lucide-react";

const ImageUploader = ({
  register,
  setValue,
  error,
  preview,
  setPreview,
}) => {
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    (file) => {
      if (!file) return;

      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_SIZE) {
        alert("Image must be under 5MB");
        return;
      }

      setValue("coverImage", [file]);
      setPreview(URL.createObjectURL(file));
    },
    [setValue, setPreview]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFiles(file);
  };

  return (
    <div className="space-y-3">
      <label className="block font-light text-lg">
        Cover Image *
      </label>

      {!preview ? (
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-white/15 rounded-xl p-10 text-center cursor-pointer hover:border-primary transition bg-black/5 backdrop-blur-md"
        >
          <UploadCloud className="mx-auto mb-4 text-primary" size={40} />
          <p className="text-lg font-medium">
            Drag & drop your image here
          </p>
          <p className="text-sm text-slate-400 mt-1">
            or click to upload (Max 5MB)
          </p>

          <input
            type="file"
            accept="image/*"
            hidden
            ref={(e) => {
              register("coverImage").ref(e);
              inputRef.current = e;
            }}
            onChange={(e) => handleFiles(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <img
            src={preview}
            alt="Preview"
            className="w-full object-cover"
          />

          <div className="absolute top-3 right-3 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current.click()}
              className="bg-primary text-bg backdrop-blur px-3 py-1 text-sm rounded-md"
            >
              Replace
            </button>

            <button
              type="button"
              onClick={() => {
                setPreview(null);
                setValue("coverImage", null);
              }}
              className="bg-red-400 text-white p-2 rounded-md hover:bg-red-500"
            >
              <X size={16} />
            </button>
          </div>

          <input
            type="file"
            accept="image/*"
            hidden
            ref={(e) => {
              register("coverImage").ref(e);
              inputRef.current = e;
            }}
            onChange={(e) => handleFiles(e.target.files[0])}
          />
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

export default ImageUploader;