import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Toaster } from '../components/ui/sonner';
import CreateProblemForm from '../components/Problems/AddProblemForm';
import { Button } from '../components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddProblemPage = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900">
        <div className="text-gray-100 text-lg font-medium flex items-center gap-2">
          <span className="loading loading-spinner text-yellow-500"></span>
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 py-8 px-4">
      <Toaster />
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-100 flex items-center gap-3">
              <FileText className="w-8 h-8 text-yellow-500" />
              Add New Problem
            </h1>
            <Link to="/profile">
              <Button
                variant="outline"
                className="bg-neutral-800 text-gray-100 hover:bg-neutral-700 border-neutral-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
          </div>
          <p className="text-gray-200 mt-2">
            Create a new coding problem for LeetLabs. Ensure all test cases and solutions are accurate.
          </p>
        </div>
        <CreateProblemForm />
      </div>
    </div>
  );
};

export default AddProblemPage;