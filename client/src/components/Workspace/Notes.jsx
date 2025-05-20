// src/components/Workspace/Notes.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Controller } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useWorkspace } from '@/lib/workspace';

const Notes = ({ notes = '', saveNotes, register, handleSubmit, errors, control }) => {
  const editorRef = useRef(null);
  const { id: problemId } = useParams();
  const { fetchNotes } = useWorkspace();
  const [isSavedNotesOpen, setIsSavedNotesOpen] = useState(true);
  const [savedNotes, setSavedNotes] = useState([]);

  // Fetch saved notes
  useEffect(() => {
    if (problemId) {
      fetchNotes(problemId)
        .then((response) => {
          const notesArray = response.notes || [{ id: '1', content: response.note || '<p>No notes saved yet.</p>', createdAt: new Date().toISOString() }];
          setSavedNotes(notesArray);
        })
        .catch((error) => {
          setSavedNotes([{ id: '1', content: '<p>Error loading notes.</p>', createdAt: new Date().toISOString() }]);
        });
    }
  }, [fetchNotes, problemId]);

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
        <form onSubmit={handleSubmit(saveNotes)} className="space-y-4">
          <Controller
            name="notes"
            control={control}
            defaultValue={notes ?? ''}
            render={({ field }) => (
              <div className="w-full border border-[#333333] rounded-lg bg-[#2A2A2A] focus-within:ring-2 focus-within:ring-[#f5b210]/50 transition-all duration-300">
                <Editor
                  apiKey={import.meta.env.VITE_TINYMCE_API || 'no-api-key'}
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue={field.value || '<p>Write your notes here...</p>'}
                  onEditorChange={(content) => field.onChange(content)}
                  init={{
                    height: 384,
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
                      'help',
                      'wordcount',
                    ],
                    toolbar:
                      'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | removeformat | help',
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
                    resize: false,
                    toolbar_sticky: true,
                    toolbar_mode: 'floating',
                    icons: 'material',
                    setup: (editor) => {
                      editor.ui.registry.addIcon('custom-aligncenter', '<svg width="24" height="24"><path d="M3 12h18m-14 4h10m-10-8h14" stroke="#f5b210" stroke-width="2"/></svg>');
                    },
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
          <Button
            type="submit"
            className="bg-[#f5b210] hover:bg-[#f5b210]/90 text-[#1A1A1A] text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300"
          >
            Save Notes
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
              {savedNotes.length === 0 ? (
                <p className="text-[#6B7280] text-sm italic">No saved notes yet.</p>
              ) : (
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