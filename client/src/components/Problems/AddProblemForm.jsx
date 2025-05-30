"use client";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Code2, FileText, Lightbulb, BookOpen, CheckCircle2, Download, Eye, Save } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../ui/badge";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useProblems } from "../../lib/problems";
import PreviewModal from "../Problems/PreviewModal.jsx";
import { supportedLanguages, sampledpData, sampleStringProblem } from "../../sampleProblemData";

// Dynamic language schema
const languageSchema = z.object({
  language: z.string().min(1, "Language is required"),
  example: z.object({
    input: z.string().min(1, "Input is required"),
    output: z.string().min(1, "Output is required"),
    explanation: z.string().optional(),
  }),
  codeSnippet: z.string().min(1, "Code snippet is required"),
  referenceSolution: z.string().min(1, "Reference solution is required"),
});

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testCases: z
    .array(
      z.object({
        id: z.string().optional(), // For dnd-kit
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        isHidden: z.boolean().default(false),
      })
    )
    .min(1, "At least one test case is required"),
  languages: z.array(languageSchema).min(1, "At least one language is required"),
});

// Sortable Test Case Component
const SortableTestCase = ({ field, index, remove, form }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[#3b3b3b]/50 rounded-lg border border-[#3b3b3b] p-4 hover:shadow-lg transition-shadow cursor-move"
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-[#e0e0e0]">Test Case #{index + 1}</h4>
        <Button
          type="button"
          variant="ghost"
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 rounded-full"
          onClick={() => remove(index)}
          disabled={form.getValues("testCases").length === 1}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`testCases.${index}.input`}
          render={({ field }) => (
            <FormItem>
              <Label className="text-[#e0e0e0]">Input</Label>
              <FormControl>
                <textarea
                  {...field}
                  placeholder="Enter test case input"
                  className="min-h-24 w-full p-3 resize-y bg-[#3b3b3b] text-[#e0e0e0] border-[#3b3b3b] rounded-lg focus:ring-2 focus:ring-[#eab308] hover:shadow-sm transition-all"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`testCases.${index}.output`}
          render={({ field }) => (
            <FormItem>
              <Label className="text-[#e0e0e0]">Expected Output</Label>
              <FormControl>
                <textarea
                  {...field}
                  placeholder="Enter expected output"
                  className="min-h-24 w-full p-3 resize-y bg-[#3b3b3b] text-[#e0e0e0] border-[#3b3b3b] rounded-lg focus:ring-2 focus:ring-[#eab308] hover:shadow-sm transition-all"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`testCases.${index}.isHidden`}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <Label className="text-[#e0e0e0] flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="form-checkbox text-[#eab308] rounded focus:ring-[#eab308]"
                />
                Hidden Test Case
              </Label>
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
};

// Sortable Tag Component
const SortableTag = ({ field, index, remove, form }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex items-center gap-2">
      <FormField
        control={form.control}
        name={`tags.${index}`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Badge className="bg-[#3b3b3b] text-[#e0e0e0] hover:bg-[#eab308]/20 p-2 cursor-move">
                <Input
                  {...field}
                  placeholder="Tag"
                  className="bg-transparent text-[#e0e0e0] border-none p-0 focus:ring-0 w-auto"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 rounded-full"
                  onClick={() => remove(index)}
                  disabled={form.getValues("tags").length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Badge>
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />
    </div>
  );
};

const CreateProblemForm = () => {
  const [sampleType, setSampleType] = useState("DP");
  const [activeLanguage, setActiveLanguage] = useState(supportedLanguages[0].id);
  const [showPreview, setShowPreview] = useState(false);
  const [isCreating, setIsCreating] = useState(false); 
  const navigate = useNavigate();

  const { createProblem, isLoading, error, clearError } = useProblems();

  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "EASY",
      tags: [""],
      constraints: "",
      hints: "",
      editorial: "",
      testCases: [{ id: `tc${Date.now()}`, input: "", output: "", isHidden: false }],
      languages: supportedLanguages.map((lang) => ({
        language: lang.id,
        example: { input: "", output: "", explanation: "" },
        codeSnippet: `// ${lang.name} starter code`,
        referenceSolution: `// ${lang.name} reference solution`,
      })),
    },
  });

  const { fields: testCaseFields, append: appendTestCase, remove: removeTestCase, replace: replaceTestCases, swap } =
    useFieldArray({ control: form.control, name: "testCases", keyName: "id" });
  const { fields: tagFields, append: appendTag, remove: removeTag, replace: replaceTags, swap: swapTags } = useFieldArray({
    control: form.control,
    name: "tags",
  });
  const { fields: languageFields } = useFieldArray({ control: form.control, name: "languages" });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const onSubmit = async (data) => {
    try {
      setIsCreating(true);
      const transformedData = {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        editorial: data.editorial,
        tags: data.tags,
        testcases: data.testCases.map(({ id, ...rest }) => rest),
        examples: data.languages.reduce((acc, lang) => {
          acc[lang.language] = lang.example;
          return acc;
        }, {}),
        constraints: data.constraints,
        hints: data.hints,
        codeSnippets: data.languages.reduce((acc, lang) => {
          acc[lang.language] = lang.codeSnippet;
          return acc;
        }, {}),
        referenceSolutions: data.languages.reduce((acc, lang) => {
          acc[lang.language] = lang.referenceSolution;
          return acc;
        }, {}),
      };

      await createProblem(transformedData);

      toast.success("Problem created successfully!", {
        style: { background: "#1a1a1a", color: "#e0e0e0", border: "1px solid #3b3b3b" },
      });
      form.reset();
      localStorage.removeItem("problemDraft");
      navigate("/problems");
    } catch (err) {
      toast.error(error || "Error creating problem", {
        style: { background: "#1a1a1a", color: "#e0e0e0", border: "1px solid #3b3b3b" },
      });
    } finally {
      setIsCreating(false); // Stop loader
    }
  };

  const loadSampleData = useCallback(() => {
    const sampleData = sampleType === "DP" ? sampledpData : sampleStringProblem;
    replaceTags(sampleData.tags);
    replaceTestCases(sampleData.testCases);
    form.reset(sampleData);
    setActiveLanguage(supportedLanguages[0].id);
    toast.info("Sample data loaded successfully", {
      style: { background: "#1a1a1a", color: "#e0e0e0", border: "1px solid #3b3b3b" },
    });
  }, [sampleType, form, replaceTags, replaceTestCases]);

  const saveDraft = () => {
    const data = form.getValues();
    localStorage.setItem("problemDraft", JSON.stringify(data));
    toast.success("Draft saved!", {
      style: { background: "#1a1a1a", color: "#e0e0e0", border: "1px solid #3b3b3b" },
    });
  };

  useEffect(() => {
    const draft = localStorage.getItem("problemDraft");
    if (draft) {
      form.reset(JSON.parse(draft));
      toast.info("Loaded saved draft", {
        style: { background: "#1a1a1a", color: "#e0e0e0", border: "1px solid #3b3b3b" },
      });
    }
  }, [form]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const languageTabs = useMemo(
    () =>
      languageFields.map((field) => {
        const lang = supportedLanguages.find((l) => l.id === field.language);
        return { id: field.language, name: lang?.name || field.language, monaco: lang?.monaco || "text" };
      }),
    [languageFields]
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = testCaseFields.findIndex((field) => field.id === active.id);
    const newIndex = testCaseFields.findIndex((field) => field.id === over.id);

    swap(oldIndex, newIndex);
  };

  const handleTagDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tagFields.findIndex((field) => field.id === active.id);
    const newIndex = tagFields.findIndex((field) => field.id === over.id);

    swapTags(oldIndex, newIndex);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1a1a1a] rounded-3xl border border-[#3b3b3b] shadow-2xl p-6 md:p-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-3xl font-bold text-[#e0e0e0] flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#eab308]" />
            Create New Problem
          </h2>
          <div className="flex gap-3 mt-4 md:mt-0">
            <div className="flex">
              <Button
                className={`rounded-r-none bg-[#27272a] text-[#e0e0e0] hover:bg-[#eab308]/30 border border-[#3b3b3b] px-4 py-2 ${
                  sampleType === "DP" ? "bg-[#eab308]/30" : ""
                }`}
                onClick={() => setSampleType("DP")}
              >
                DP Problem
              </Button>
              <Button
                className={`rounded-l-none bg-[#27272a] text-[#e0e0e0] hover:bg-[#eab308]/30 border border-[#3b3b3b] px-4 py-2 ${
                  sampleType === "string" ? "bg-[#eab308]/30" : ""
                }`}
                onClick={() => setSampleType("string")}
              >
                String Problem
              </Button>
            </div>
            <Button
              className="bg-[#eab308] text-[#1a1a1a] hover:bg-[#facc15] border border-[#eab308] shadow-md hover:shadow-lg transition-shadow px-4 py-2"
              onClick={loadSampleData}
            >
              <Download className="w-4 h-4 mr-2" />
              Load Sample
            </Button>
          </div>
        </div>

        {/* Display error message if exists */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex justify-between items-center">
            <p className="text-red-400">{error}</p>
            <Button
              type="button"
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 rounded-full"
              onClick={clearError}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-min">
              {/* Basic Info Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="col-span-1 md:col-span-2 lg:col-span-4 bg-[#27272a]/80 backdrop-blur-md border border-[#3b3b3b] rounded-2xl p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-[#e0e0e0] flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-[#eab308]" />
                  Basic Info
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-[#e0e0e0] font-medium">Title</Label>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter problem title"
                            className="bg-[#3b3b3b] text-[#e0e0e0] border-[#3b3b3b] focus:ring-2 focus:ring-[#eab308] hover:shadow-sm transition-all"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-[#e0e0e0] font-medium">Difficulty</Label>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-[#3b3b3b] text-[#e0e0e0] border-[#3b3b3b] focus:ring-2 focus:ring-[#eab308] hover:shadow-sm transition-all">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#27272a] text-[#e0e0e0] border-[#3b3b3b]">
                            <SelectItem value="EASY">Easy</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HARD">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>

              {/* Description Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="col-span-1 md:col-span-2 lg:col-span-8 bg-[#27272a]/80 backdrop-blur-md border border-[#3b3b3b] rounded-2xl p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-[#e0e0e0] flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-[#eab308]" />
                  Description
                </h3>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-[#e0e0e0] font-medium">Description</Label>
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder="Enter problem description"
                          className="min-h-48 w-full p-4 resize-y bg-[#3b3b3b] text-[#e0e0e0] border-[#3b3b3b] rounded-lg focus:ring-2 focus:ring-[#eab308] hover:shadow-sm transition-all"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Tags Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="col-span-1 md:col-span-2 lg:col-span-4 bg-[#27272a]/80 backdrop-blur-md border border-[#3b3b3b] rounded-2xl p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-[#e0e0e0] flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-[#eab308]" />
                  Tags
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <Button
                    type="button"
                    className="bg-[#eab308] text-[#1a1a1a] hover:bg-[#facc15] shadow-md hover:shadow-lg transition-shadow px-4 py-2"
                    onClick={() => appendTag("")}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Tag
                  </Button>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleTagDragEnd}>
                  <SortableContext items={tagFields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-wrap gap-2">
                      {tagFields.map((field, index) => (
                        <SortableTag key={field.id} field={{ ...field, id: field.id || `tag${index}-${Date.now()}` }} index={index} remove={removeTag} form={form} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </motion.div>

              {/* Test Cases Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="col-span-1 md:col-span-2 lg:col-span-8 bg-[#27272a]/80 backdrop-blur-md border border-[#3b3b3b] rounded-2xl p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-[#e0e0e0] flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-[#eab308]" />
                  Test Cases
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <Button
                    type="button"
                    className="bg-[#eab308] text-[#1a1a1a] hover:bg-[#facc15] shadow-md hover:shadow-lg transition-shadow px-4 py-2"
                    onClick={() => appendTestCase({ id: `tc${Date.now()}`, input: "", output: "", isHidden: false })}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Test Case
                  </Button>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={testCaseFields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {testCaseFields.map((field, index) => (
                        <SortableTestCase key={field.id} field={field} index={index} remove={removeTestCase} form={form} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </motion.div>

              {/* Language Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="col-span-1 md:col-span-2 lg:col-span-12 bg-[#27272a]/80 backdrop-blur-md border border-[#3b3b3b] rounded-2xl p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-[#e0e0e0] flex items-center gap-2 mb-4">
                  <Code2 className="w-5 h-5 text-[#eab308]" />
                  Language-Specific Details
                </h3>
                <Tabs value={activeLanguage} onValueChange={setActiveLanguage} className="w-full">
                  <TabsList className="relative flex flex-wrap gap-2 bg-[#3b3b3b] p-2 rounded-lg">
                    {languageTabs.map((tab) => (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="relative px-4 py-2 rounded-sm text-[#e0e0e0] data-[state=active]:text-[#1a1a1a] data-[state=active]:bg-[#eab308] hover:bg-[#eab308]/20 transition-colors font-medium focus:outline-none focus:ring-1 focus:ring-[#eab308] focus:ring-offset-2 focus:ring-offset-[#3b3b3b]"
                      >
                        <motion.div
                          layout
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-center h-full w-full"
                          initial={false}
                          animate={{
                            color: activeLanguage === tab.id ? "#1a1a1a" : "#e0e0e0",
                          }}
                        >
                          {tab.name}
                        </motion.div>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {languageTabs.map((tab, index) => (
                    <TabsContent key={tab.id} value={tab.id} className="mt-6">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="bg-[#3b3b3b]/50 rounded-lg border border-[#3b3b3b] p-6 hover:shadow-lg transition-shadow">
                          <h4 className="text-lg font-semibold text-[#e0e0e0] mb-4">Starter Code Template</h4>
                          <Controller
                            name={`languages.${index}.codeSnippet`}
                            control={form.control}
                            render={({ field }) => (
                              <Editor
                                height="300px"
                                language={tab.monaco}
                                theme="vs-dark"
                                value={field.value}
                                onChange={field.onChange}
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 14,
                                  lineNumbers: "on",
                                  roundedSelection: false,
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                }}
                              />
                            )}
                          />
                          {form.formState.errors.languages?.[index]?.codeSnippet && (
                            <p className="text-red-400 text-sm mt-2">
                              {form.formState.errors.languages[index].codeSnippet.message}
                            </p>
                          )}
                        </div>
                        <div className="bg-[#3b3b3b]/50 rounded-lg border border-[#3b3b3b] p-6 hover:shadow-lg transition-shadow">
                          <h4 className="text-lg font-semibold text-[#e0e0e0] mb-4">Reference Solution</h4>
                          <Controller
                            name={`languages.${index}.referenceSolution`}
                            control={form.control}
                            render={({ field }) => (
                              <Editor
                                height="300px"
                                language={tab.monaco}
                                theme="vs-dark"
                                value={field.value}
                                onChange={field.onChange}
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 14,
                                  lineNumbers: "on",
                                  roundedSelection: false,
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                }}
                              />
                            )}
                          />
                          {form.formState.errors.languages?.[index]?.referenceSolution && (
                            <p className="text-red-400 text-sm mt-2">
                              {form.formState.errors.languages[index].referenceSolution.message}
                            </p>
                          )}
                        </div>
                        <div className="bg-[#3b3b3b]/50 rounded-lg border border-[#3b3b3b] p-6 hover:shadow-lg transition-shadow">
                          <h4 className="text-lg font-semibold text-[#e0e0e0] mb-4">Example</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name={`languages.${index}.example.input`}
                              render={({ field }) => (
                                <FormItem>
                                  <Label className="text-[#e0e0e0]">Input</Label>
                                  <FormControl>
                                    <textarea
                                      {...field}
                                      placeholder="Example input"
                                      className="min-h-20 w-full p-3 resize-y bg-[#3b3b3b] text-[#e0e0e0] border-[#3b3b3b] rounded-lg focus:ring-2 focus:ring-[#eab308] hover:shadow-sm transition-all"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`languages.${index}.example.output`}
                              render={({ field }) => (
                                <FormItem>
                                  <Label className="text-[#e0e0e0]">Output</Label>
                                  <FormControl>
                                    <textarea
                                      {...field}
                                      placeholder="Example output"
                                      className="min-h-20 w-full p-3 resize-y bg-[#3b3b3b] text-[#e0e0e0] border-[#3b3b3b] rounded-lg focus:ring-2 focus:ring-[#eab308] hover:shadow-sm transition-all"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`languages.${index}.example.explanation`}
                              render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                  <Label className="text-[#e0e0e0]">Explanation</Label>
                                  <FormControl>
                                    <textarea
                                      {...field}
                                      placeholder="Explain the example"
                                      className="min-h-24 w-full p-3 resize-y bg-[#3b3b3b] text-[#e0e0e0] border-[#3b3b3b] rounded-lg focus:ring-2 focus:ring-[#eab308] hover:shadow-sm transition-all"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-red-400" />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </motion.div>
                    </TabsContent>
                  ))}
                </Tabs>
              </motion.div>
              {/* Additional Info Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="col-span-1 md:col-span-2 lg:col-span-12 bg-[#27272a]/80 backdrop-blur-md border border-[#3b3b3b] rounded-2xl p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-[#e0e0e0] flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-[#eab308]" />
                  Additional Information
                </h3>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="constraints"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-[#e0e0e0]">Constraints</Label>
                        <FormControl>
                          <textarea
                            {...field}
                            placeholder="Enter problem constraints"
                            className="min-h-24 w-full p-3 resize-y bg-[#3b3b3b] text-[#e0e0e0] border-[#3b3b3b] rounded-lg focus:ring-2 focus:ring-[#eab308] hover:shadow-sm transition-all"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hints"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-[#e0e0e0]">Hints (Optional)</Label>
                        <FormControl>
                          <textarea
                            {...field}
                            placeholder="Enter hints for solving the problem"
                            className="min-h-24 w-full p-3 resize-y bg-[#3b3b3b] text-[#e0e0e0] border-[#3b3b3b] rounded-lg focus:ring-2 focus:ring-[#eab308] hover:shadow-sm transition-all"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="editorial"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-[#e0e0e0]">Editorial (Optional)</Label>
                        <FormControl>
                          <textarea
                            {...field}
                            placeholder="Enter problem editorial/solution explanation"
                            className="min-h-32 w-full p-3 resize-y bg-[#3b3b3b] text-[#e0e0e0] border-[#3b3b3b] rounded-lg focus:ring-2 focus:ring-[#eab308] hover:shadow-sm transition-all"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>
            </div>

            {/* Floating Action Buttons */}
            <div className="fixed bottom-6 right-6 flex gap-4">
              <Button
                type="button"
                className="bg-[#27272a] text-[#e0e0e0] hover:bg-[#eab308]/30 rounded-full shadow-lg hover:shadow-xl transition-shadow px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={saveDraft}
                disabled={isLoading}
              >
                <Save className="w-5 h-5 mr-2" />
                Save Draft
              </Button>
              <Button
                type="button"
                className="bg-[#27272a] text-[#e0e0e0] hover:bg-[#eab308]/30 rounded-full shadow-lg hover:shadow-xl transition-shadow px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setShowPreview(true)}
                disabled={isLoading}
              >
                <Eye className="w-5 h-5 mr-2" />
                Preview
              </Button>
              <Button
                type="submit"
                className="bg-[#eab308] text-[#1a1a1a] hover:bg-[#facc15] rounded-full shadow-lg hover:shadow-xl transition-shadow px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner text-[#1a1a1a]"></span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    {isCreating ? 'Creating...' : 'Create Problem'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>

        {/* Preview Modal */}
         <PreviewModal showPreview={showPreview} setShowPreview={setShowPreview} form={form} />
      </motion.div>
    </div>
  );
};

export default CreateProblemForm;

