import React from 'react';

function NotAuthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500">Access Denied</h1>
        <p className="text-lg text-gray-600 mt-4">
          You are not authorized to access this page.
        </p>
        <a
          href="/"
          className="inline-block mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Go Back to Home
        </a>
      </div>
    </div>
  );
}

export default NotAuthorized;
