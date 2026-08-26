import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldX } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <div className="rounded-full bg-red-100 p-4">
        <ShieldX className="h-12 w-12 text-red-600" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Access Denied</h1>
      <p className="mt-2 text-base text-gray-500">
        You do not have permission to access this page. Please contact your administrator.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Go to Dashboard
        </button>
        <button
          onClick={() => navigate(-1)}
          className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
