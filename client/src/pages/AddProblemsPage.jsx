// client/src/pages/AddProblemPage.jsx
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Toaster } from '../components/ui/sonner';
import AddProblemForm from '../components/Problems/AddProblemForm';
import UpdateProblemForm from '../components/Problems/UpdateProblemForm';
import { Button } from '../components/ui/button';
import { ArrowLeft, FileText, FileEdit } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

const AddProblemPage = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('add');

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
              {activeTab === 'add' ? (
                <>
                  <FileText className="w-8 h-8 text-yellow-500" />
                  Add Problem
                </>
              ) : (
                <>
                  <FileEdit className="w-8 h-8 text-yellow-500" />
                  Update Problem
                </>
              )}
            </h1>
            <Link to="/">
              <Button
                variant="outline"
                className="bg-neutral-800 text-gray-100 hover:bg-neutral-700 border-neutral-700 rounded-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <p className="text-gray-400 mt-2">
            {activeTab === 'add'
              ? 'Create a new problem for users to solve.'
              : 'Select and update an existing problem. All fields are editable.'}
          </p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex gap-4 bg-[#27272a] rounded-lg p-2 mb-6">
            <TabsTrigger
              value="add"
              className="flex-1 text-[#e0e0e0] data-[state=active]:bg-[#eab308] data-[state=active]:text-[#1a1a1a] rounded-md py-3 font-medium"
            >
              Add Problem
            </TabsTrigger>
            <TabsTrigger
              value="update"
              className="flex-1 text-[#e0e0e0] data-[state=active]:bg-[#eab308] data-[state=active]:text-[#1a1a1a] rounded-md py-3 font-medium"
            >
              Update Problem
            </TabsTrigger>
          </TabsList>
          <TabsContent value="add">
            <AddProblemForm />
          </TabsContent>
          <TabsContent value="update">
            <UpdateProblemForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AddProblemPage;