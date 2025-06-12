// src/components/Workspace/Notes.jsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Controller, useForm } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useWorkspace } from '@/lib/workspace';

const Notes = () => {
  const { id: problemId } = useParams();
  const { fetchNotes, saveNotes } = useWorkspace();
  const editorRef = useRef(null);
  const [isSavedNotesOpen, setIsSavedNotesOpen] = useState(true);
  const [savedNotes, setSavedNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize react-hook-form
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { notes: '' },
  });

  // Fetch saved notes
  const loadNotes = useCallback(async () => {
    if (!problemId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchNotes(problemId);
      const notesArray = Array.isArray(response.notes)
        ? response.notes
        : [{ id: '1', content: response.note || '<p>No notes saved yet.</p>', createdAt: new Date().toISOString() }];
      setSavedNotes(notesArray);
    } catch (err) {
      setError('Failed to load notes. Please try again.');
      setSavedNotes([{ id: '1', content: '<p>Error loading notes.</p>', createdAt: new Date().toISOString() }]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchNotes, problemId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Handle form submission
  const onSubmit = async (data) => {
    if (!data.notes || data.notes === '<p></p>') {
      setError('Please enter some content before saving.');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await saveNotes(problemId, data.notes);
      reset({ notes: '' }); // Clear editor after saving
      await loadNotes(); // Refresh saved notes
    } catch (err) {
      setError('Failed to save note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 text-white font-satoshi bg-[#1A1A1A] min-h-full overflow-y-auto scrollbar-none">
      <style>
        {`
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-none {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}
      </style>
      <h2 className="text-lg font-semibold mb-6 text-[#E5E7EB] tracking-tight">Notes</h2>
      <div className="space-y-6">
        {/* Editor Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="notes"
            control={control}
            rules={{ required: 'Notes cannot be empty' }}
            render={({ field }) => (
              <div className="w-full border border-[#333333] rounded-lg bg-[#2A2A2A] focus-within:ring-2 focus-within:ring-[#f5b210]/50 transition-all duration-300">
                <Editor
                  apiKey={import.meta.env.VITE_TINYMCE_API || 'no-api-key'}
                  onInit={(evt, editor) => {
                    editorRef.current = editor;
                    if (field.value) editor.setContent(field.value);
                  }}
                  initialValue="<p>Write your notes here...</p>"
                  onEditorChange={(content) => field.onChange(content)}
                  init={{
                    height: '400px',
                    min_height: 300,
                    max_height: 600,
                    menubar: false,
                    plugins: [
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'charmap',
                      'preview',
                      'anchor',
                      'searchreplace',
                      'visualblocks',
                      'fullscreen',
                      'insertdatetime',
                      'table',
                      'wordcount',
                    ],
                    toolbar:
                      'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | removeformat',
                    content_style: `
                      body {
                        font-family: Satoshi, Helvetica, Arial, sans-serif;
                        font-size: 14px;
                        color: #E5E7EB;
                        background: #2A2A2A;
                        padding: 16px;
                        line-height: 1.6;
                      }
                      p { margin: 8px 0; }
                      .mce-content-body:focus { outline: none; }
                      ::-webkit-scrollbar { display: none; }
                      * { scrollbar-width: none; -ms-overflow-style: none; }
                    `,
                    placeholder: 'Write your notes here...',
                    skin: 'oxide-dark',
                    content_css: 'dark',
                    statusbar: false,
                    resize: 'both',
                    toolbar_sticky: true,
                    toolbar_mode: 'floating',
                    icons: 'material',
                  }}
                />
              </div>
            )}
          />
          {errors.notes && (
            <p className="text-[#ef4444] text-xs font-medium animate-pulse">
              {errors.notes.message}
            </p>
          )}
          {error && (
            <p className="text-[#ef4444] text-xs font-medium animate-pulse">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#f5b210] hover:bg-[#f5b210]/90 text-[#1A1A1A] text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Notes'}
          </Button>
        </form>

        {/* Saved Notes Section */}
        <div className="mt-8">
          <button
            onClick={() => setIsSavedNotesOpen(!isSavedNotesOpen)}
            className="flex items-center gap-2 text-[#E5E7EB] text-sm font-medium hover:text-[#f5b210] transition-colors duration-200"
          >
            <span>Saved Notes ({savedNotes.length})</span>
            {isSavedNotesOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {isSavedNotesOpen && (
            <div className="mt-4 max-h-[300px] overflow-y-auto scrollbar-none">
              {isLoading && <p className="text-[#6B7280] text-sm italic">Loading notes...</p>}
              {!isLoading && savedNotes.length === 0 && (
                <p className="text-[#6B7280] text-sm italic">No saved notes yet.</p>
              )}
              {!isLoading && savedNotes.length > 0 && (
                <div className="space-y-4">
                  {savedNotes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-[#2A2A2A] p-4 rounded-lg border border-[#333333] hover:border-[#f5b210]/50 transition-all duration-200 animate-fade-in"
                    >
                      <div
                        className="text-[#E5E7EB] text-sm prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: note.content }}
                      />
                      <p className="text-[#6B7280] text-xs mt-2">
                        Saved:{' '}
                        {new Date(note.createdAt).toLocaleString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                          timeZone: 'Asia/Kolkata',
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;