import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import {
  GitFork, // For the main heading
  Loader2, // For loading spinner
  FileWarning, // For no repositories state
  Github, // For GitHub URL
  FolderGit2, // For cloned path
  FileJson, // For metadata
  FileText, // For file download
  Download, // For download button
  Tag, // For type
} from "lucide-react"; // Remember to install lucide-react: npm install lucide-react

const SoftwareRepoViewer = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to hold error messages

  const fetchRepos = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await axiosInstance.get("/api/softwareRepo");
      // Sort repositories, e.g., by group name or upload date if available
      const sortedRepos = res.data.sort((a, b) => {
        const nameA = a.group?.name || "";
        const nameB = b.group?.name || "";
        return nameA.localeCompare(nameB);
      });
      setRepos(sortedRepos);
    } catch (err) {
      console.error("Failed to fetch repositories:", err);
      setError("Failed to load software repositories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-xl shadow-md p-8">
      <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-4" />
      <p className="text-xl text-gray-700 font-medium">
        Loading software repositories...
      </p>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-red-50 rounded-xl shadow-md p-8 text-center border border-red-200">
      <FileWarning className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="text-2xl font-semibold text-red-800 mb-2">
        Error Loading Data
      </h3>
      <p className="text-lg text-red-700">{error}</p>
      <button
        onClick={fetchRepos}
        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors flex items-center"
      >
        <Loader2 className="w-5 h-5 mr-2" /> Retry
      </button>
    </div>
  );

  const renderNoReposState = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-xl shadow-md p-8 text-center border border-gray-200">
      <FileWarning className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
        No Repositories Found
      </h3>
      <p className="text-lg text-gray-600">
        It looks like no software repositories have been uploaded yet.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 mt-16">
      <div className=" mx-auto">
        {/* Page Header */}
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-10 text-center flex items-center justify-center">
          <GitFork className="w-12 h-12 text-blue-600 mr-4" />
          Software Repositories
        </h2>

        {/* Conditional Rendering for Loading, Error, No Repos */}
        {loading ? (
          renderLoadingState()
        ) : error ? (
          renderErrorState()
        ) : repos.length === 0 ? (
          renderNoReposState()
        ) : (
          /* Repositories Grid */
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {repos.map((repo) => (
              <div
                key={repo._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-200 flex flex-col"
              >
                {/* Repo Group Name */}
                <h3 className="text-2xl font-bold text-indigo-700 mb-3 truncate">
                  {repo.group?.name || "Unnamed Repository"}
                </h3>

                <div className="space-y-4 text-base text-gray-700 flex-grow">
                  {/* Type */}
                  <p className="flex items-center">
                    <Tag className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                    <span className="font-semibold text-gray-800">
                      Type:
                    </span>{" "}
                    <span className="ml-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {repo.type || "N/A"}
                    </span>
                  </p>

                  {/* GitHub URL */}
                  <p className="flex items-start">
                    <Github className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="font-semibold text-gray-800">
                      GitHub URL:
                    </span>{" "}
                    {repo.githubUrl ? (
                      <a
                        href={repo.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {repo.githubUrl}
                      </a>
                    ) : (
                      <span className="ml-2 text-gray-500">N/A</span>
                    )}
                  </p>

                  {/* Cloned Repo Path */}
                  <p className="flex items-start">
                    <FolderGit2 className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="font-semibold text-gray-800">
                      Cloned Path:
                    </span>{" "}
                    <span className="ml-2 text-gray-700 break-all">
                      {repo.clonedRepoPath || "N/A"}
                    </span>
                  </p>

                  {/* Metadata */}
                  <div className="flex flex-col">
                    <p className="flex items-center mb-2">
                      <FileJson className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                      <span className="font-semibold text-gray-800">
                        Metadata:
                      </span>
                    </p>
                    {repo.metadata ? (
                      <pre className="bg-gray-50 p-3 rounded-lg text-xs font-mono text-gray-800 overflow-auto max-h-40 border border-gray-200 shadow-inner">
                        {JSON.stringify(repo.metadata, null, 2)}
                      </pre>
                    ) : (
                      <p className="ml-8 text-gray-500">N/A</p>
                    )}
                  </div>
                </div>

                {/* File Download */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="flex items-center text-gray-700 mb-3">
                    <FileText className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="font-semibold">Attached File:</span>{" "}
                    {repo.originalName || "No file uploaded"}
                  </p>
                  {repo.filePath ? (
                    <a
                      href={`${
                        axiosInstance.defaults.baseURL
                      }/${repo.filePath.replace(/\\/g, "/")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                    >
                      <Download className="-ml-1 mr-3 h-5 w-5" />
                      Download File
                    </a>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center justify-center w-full px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-gray-400 bg-gray-200 cursor-not-allowed"
                    >
                      <Download className="-ml-1 mr-3 h-5 w-5" />
                      No File Available
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SoftwareRepoViewer;
