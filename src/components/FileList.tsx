"use client";

interface FileItem {
  id: string;
  filename: string;
  category: "INTERNAL" | "EXTERNAL";
  uploadedAt: string;
}

interface FileListProps {
  files: FileItem[];
  showCategory?: boolean;
}

export default function FileList({ files, showCategory = true }: FileListProps) {
  if (files.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">No files uploaded yet.</p>
    );
  }

  const handleDownload = (fileId: string, filename: string) => {
    const link = document.createElement("a");
    link.href = `/api/files/${fileId}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ul className="divide-y divide-gray-200">
      {files.map((file) => (
        <li key={file.id} className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">{file.filename}</p>
              <p className="text-xs text-gray-500">
                {new Date(file.uploadedAt).toLocaleDateString()}
                {showCategory && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      file.category === "EXTERNAL"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {file.category === "EXTERNAL" ? "Shared" : "Internal"}
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleDownload(file.id, file.filename)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Download
          </button>
        </li>
      ))}
    </ul>
  );
}
