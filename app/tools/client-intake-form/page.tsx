"use client";

import React, { useState, useRef } from "react";
import { exportToPdf } from "@/lib/pdf-export";
import {
  ClipboardList,
  Plus,
  Trash2,
  Download,
  Copy,
  CheckCircle,
  AlertCircle,
  FileText,
  Settings,
  HelpCircle
} from "lucide-react";

interface SampleQuestion {
  id: string;
  text: string;
  selected: boolean;
}

interface Category {
  id: string;
  name: string;
  selected: boolean;
  questions: SampleQuestion[];
  customQuestionInput: string;
}

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "goals",
    name: "Project Goals",
    selected: true,
    customQuestionInput: "",
    questions: [
      { id: "goals-1", text: "What is the main goal of this project?", selected: true },
      { id: "goals-2", text: "What does success look like?", selected: true },
      { id: "goals-3", text: "What are the primary features or deliverables you expect?", selected: true }
    ]
  },
  {
    id: "budget",
    name: "Budget",
    selected: true,
    customQuestionInput: "",
    questions: [
      { id: "budget-1", text: "What is your budget range for this project?", selected: true },
      { id: "budget-2", text: "Is the budget flexible or fixed?", selected: true }
    ]
  },
  {
    id: "timeline",
    name: "Timeline",
    selected: true,
    customQuestionInput: "",
    questions: [
      { id: "timeline-1", text: "When do you need this completed?", selected: true },
      { id: "timeline-2", text: "Are there any fixed deadlines?", selected: true }
    ]
  },
  {
    id: "assets",
    name: "Brand Assets",
    selected: true,
    customQuestionInput: "",
    questions: [
      { id: "assets-1", text: "Do you have existing brand guidelines, logos, or style references?", selected: true },
      { id: "assets-2", text: "Can you provide high-quality image or asset libraries?", selected: true }
    ]
  },
  {
    id: "audience",
    name: "Target Audience",
    selected: true,
    customQuestionInput: "",
    questions: [
      { id: "audience-1", text: "Who is your target audience for this project?", selected: true },
      { id: "audience-2", text: "What is the primary message you want to convey to them?", selected: true }
    ]
  },
  {
    id: "technical",
    name: "Technical Requirements",
    selected: true,
    customQuestionInput: "",
    questions: [
      { id: "technical-1", text: "Do you have any specific platform or technical requirements?", selected: true },
      { id: "technical-2", text: "Are there any third-party integrations (APIs, payment processors, etc.) required?", selected: true }
    ]
  }
];

export default function ClientIntakeFormBuilder() {
  const [businessName, setBusinessName] = useState("");
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [standaloneQuestions, setStandaloneQuestions] = useState<SampleQuestion[]>([]);
  const [standaloneInput, setStandaloneInput] = useState("");

  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showAllErrors, setShowAllErrors] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  // Toggle whole category selection
  const handleCategoryToggle = (catId: string) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === catId ? { ...cat, selected: !cat.selected } : cat))
    );
  };

  // Toggle individual question selection within a category
  const handleQuestionToggle = (catId: string, qId: string) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === catId) {
          return {
            ...cat,
            questions: cat.questions.map(q => (q.id === qId ? { ...q, selected: !q.selected } : q))
          };
        }
        return cat;
      })
    );
  };

  // Edit inline question text within a category
  const handleQuestionTextChange = (catId: string, qId: string, text: string) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === catId) {
          return {
            ...cat,
            questions: cat.questions.map(q => (q.id === qId ? { ...q, text } : q))
          };
        }
        return cat;
      })
    );
  };

  // Remove individual question from category
  const handleQuestionRemove = (catId: string, qId: string) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === catId) {
          return {
            ...cat,
            questions: cat.questions.filter(q => q.id !== qId)
          };
        }
        return cat;
      })
    );
  };

  // Handle custom question input change in a category
  const handleCustomQuestionInputChange = (catId: string, value: string) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === catId ? { ...cat, customQuestionInput: value } : cat))
    );
  };

  // Add custom question to category
  const addCustomQuestion = (catId: string) => {
    const category = categories.find(c => c.id === catId);
    if (!category || !category.customQuestionInput.trim()) return;

    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === catId) {
          return {
            ...cat,
            questions: [
              ...cat.questions,
              { id: `${catId}-custom-${Date.now()}`, text: cat.customQuestionInput.trim(), selected: true }
            ],
            customQuestionInput: ""
          };
        }
        return cat;
      })
    );
  };

  // Standalone: add question
  const addStandaloneQuestion = () => {
    if (!standaloneInput.trim()) return;
    setStandaloneQuestions(prev => [
      ...prev,
      { id: `standalone-${Date.now()}`, text: standaloneInput.trim(), selected: true }
    ]);
    setStandaloneInput("");
  };

  // Standalone: edit question text
  const handleStandaloneTextChange = (id: string, text: string) => {
    setStandaloneQuestions(prev => prev.map(q => (q.id === id ? { ...q, text } : q)));
  };

  // Standalone: toggle question
  const handleStandaloneToggle = (id: string) => {
    setStandaloneQuestions(prev => prev.map(q => (q.id === id ? { ...q, selected: !q.selected } : q)));
  };

  // Standalone: remove question
  const handleStandaloneRemove = (id: string) => {
    setStandaloneQuestions(prev => prev.filter(q => q.id !== id));
  };

  // Filtered lists for rendering
  const activeCategories = categories.filter(c => c.selected);
  const totalSelectedQuestionsCount =
    activeCategories.reduce((acc, cat) => acc + cat.questions.filter(q => q.selected).length, 0) +
    standaloneQuestions.filter(q => q.selected).length;

  const isFormValid = totalSelectedQuestionsCount > 0;

  // Build sequential list of numbered questions
  const getOrderedQuestions = () => {
    const ordered: { categoryName: string | null; text: string }[] = [];
    let counter = 1;

    activeCategories.forEach(cat => {
      const selectedQs = cat.questions.filter(q => q.selected && q.text.trim());
      if (selectedQs.length > 0) {
        // Group header
        ordered.push({ categoryName: cat.name, text: "" });
        selectedQs.forEach(q => {
          ordered.push({ categoryName: null, text: `${counter}. ${q.text.trim()}` });
          counter++;
        });
      }
    });

    const activeStandalone = standaloneQuestions.filter(q => q.selected && q.text.trim());
    if (activeStandalone.length > 0) {
      ordered.push({ categoryName: "Additional Questions", text: "" });
      activeStandalone.forEach(q => {
        ordered.push({ categoryName: null, text: `${counter}. ${q.text.trim()}` });
        counter++;
      });
    }

    return ordered;
  };

  const orderedQuestions = getOrderedQuestions();

  // Plain Text Builder
  const buildPlainText = () => {
    let text = "";
    if (businessName.trim()) {
      text += `${businessName.trim()} — Client Intake Questionnaire\n`;
      text += "=".repeat(businessName.trim().length + 31) + "\n\n";
    } else {
      text += "Client Intake Questionnaire\n";
      text += "===========================\n\n";
    }

    let counter = 1;

    activeCategories.forEach(cat => {
      const selectedQs = cat.questions.filter(q => q.selected && q.text.trim());
      if (selectedQs.length > 0) {
        text += `${cat.name.toUpperCase()}\n`;
        text += "-".repeat(cat.name.length) + "\n";
        selectedQs.forEach(q => {
          text += `${counter}. ${q.text.trim()}\n`;
          counter++;
        });
        text += "\n";
      }
    });

    const activeStandalone = standaloneQuestions.filter(q => q.selected && q.text.trim());
    if (activeStandalone.length > 0) {
      text += "ADDITIONAL QUESTIONS\n";
      text += "--------------------\n";
      activeStandalone.forEach(q => {
        text += `${counter}. ${q.text.trim()}\n`;
        counter++;
      });
      text += "\n";
    }

    text += "Note: Send this to your client via email or your preferred form tool.";
    return text;
  };

  const handleCopyText = async () => {
    if (!isFormValid) {
      setShowAllErrors(true);
      alert("Please select or add at least one question before copying.");
      return;
    }
    const plainText = buildPlainText();
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleDownloadPdf = async () => {
    if (!isFormValid) {
      setShowAllErrors(true);
      alert("Please select or add at least one question before downloading.");
      return;
    }

    if (printRef.current) {
      setIsExporting(true);
      const filename = `${businessName.trim() ? businessName.replace(/\s+/g, "_") : "Client"}_Intake_Form.pdf`;
      await exportToPdf(printRef.current, {
        filename,
        onComplete: () => setIsExporting(false),
        onError: () => setIsExporting(false)
      });
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tool Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-1">
              <ClipboardList className="w-4 h-4" />
              <span>Client Assets</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Client Intake Form Builder
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Design professional onboarding questionnaires. Edit questions, structure categories, and export via PDF or plain text.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyText}
              className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold py-3 px-5 text-sm shadow-sm transition-all border ${
                isFormValid
                  ? "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer"
                  : "bg-gray-100 dark:bg-gray-900 border-transparent text-gray-400 dark:text-gray-600 cursor-not-allowed"
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-500 animate-bounce" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Plain Text
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold py-3 px-5 text-sm shadow-md transition-all ${
                isFormValid
                  ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.01] cursor-pointer"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
              }`}
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Exporting PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Disclaimer/Note Banner */}
        <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 mb-8 flex gap-3 items-start text-blue-800 dark:text-blue-300">
          <HelpCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs leading-normal">
            <strong>Onboarding Note:</strong> Send this to your client via email or your preferred form tool — this page does not collect, store, or submit responses. All data stays strictly in your browser.
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Panel: Form Control Inputs */}
          <div className="lg:col-span-7 space-y-6">

            {/* Brand/Business Identity */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Form Branding</h2>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Your Business / Freelancer Name (Optional)
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Pixelcraft Studio"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Question Categories Configuration */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Question Categories
              </h3>

              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`bg-white dark:bg-gray-900 rounded-2xl border transition-all ${
                    cat.selected
                      ? "border-blue-200 dark:border-blue-900/50 shadow-sm"
                      : "border-gray-200 dark:border-gray-800/80 opacity-60"
                  }`}
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800/80">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={cat.selected}
                        onChange={() => handleCategoryToggle(cat.id)}
                        className="w-4.5 h-4.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="font-bold text-gray-900 dark:text-white text-base">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-400">
                      {cat.questions.filter(q => q.selected).length} Selected
                    </span>
                  </div>

                  {/* Category Questions (only visible if category is selected) */}
                  {cat.selected && (
                    <div className="p-4 space-y-3 bg-gray-50/30 dark:bg-gray-900/40">
                      {cat.questions.map((q) => (
                        <div key={q.id} className="flex gap-3 items-center">
                          <input
                            type="checkbox"
                            checked={q.selected}
                            onChange={() => handleQuestionToggle(cat.id, q.id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                          />
                          <input
                            type="text"
                            value={q.text}
                            onChange={(e) => handleQuestionTextChange(cat.id, q.id, e.target.value)}
                            className="flex-grow bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl py-1.5 px-3 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100"
                          />
                          <button
                            type="button"
                            onClick={() => handleQuestionRemove(cat.id, q.id)}
                            className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {/* Add Custom Question to Category */}
                      <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <input
                          type="text"
                          value={cat.customQuestionInput}
                          onChange={(e) => handleCustomQuestionInputChange(cat.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addCustomQuestion(cat.id);
                            }
                          }}
                          placeholder="Add custom question to this category..."
                          className="flex-grow rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-1.5 px-3 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100"
                        />
                        <button
                          type="button"
                          onClick={() => addCustomQuestion(cat.id)}
                          className="inline-flex items-center justify-center gap-1 text-xs font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-xl transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Standalone/Additional Questions section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Additional Questions</h2>
              </div>

              <div className="space-y-3 mb-4">
                {standaloneQuestions.map((q) => (
                  <div key={q.id} className="flex gap-3 items-center">
                    <input
                      type="checkbox"
                      checked={q.selected}
                      onChange={() => handleStandaloneToggle(q.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => handleStandaloneTextChange(q.id, e.target.value)}
                      className="flex-grow bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl py-1.5 px-3 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleStandaloneRemove(q.id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={standaloneInput}
                  onChange={(e) => setStandaloneInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addStandaloneQuestion();
                    }
                  }}
                  placeholder="Type a standalone question (not bound to any category)..."
                  className="flex-grow rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-2 px-3.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={addStandaloneQuestion}
                  className="inline-flex items-center justify-center gap-1.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Question
                </button>
              </div>
            </div>

          </div>

          {/* Right Panel: Live Preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" /> Live Preview
              </h2>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                Real-Time Render
              </span>
            </div>

            {/* Interactive Preview Container */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-lg text-gray-800 dark:text-gray-100 transition-colors">
              <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-800 text-center">
                {businessName.trim() ? (
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight">
                    {businessName.trim()}
                  </h3>
                ) : null}
                <h4 className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-tight">
                  Client Intake Form
                </h4>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 uppercase tracking-widest">
                  Onboarding Questionnaire
                </p>
              </div>

              {/* Questionnaire Structure */}
              <div className="space-y-6">
                {orderedQuestions.length > 0 ? (
                  orderedQuestions.map((item, index) => {
                    if (item.categoryName) {
                      return (
                        <h5
                          key={`cat-${index}`}
                          className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pt-2 first:pt-0"
                        >
                          {item.categoryName}
                        </h5>
                      );
                    } else {
                      return (
                        <div key={`q-${index}`} className="group pb-3 border-b border-gray-50 dark:border-gray-850/40 last:border-0 last:pb-0">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
                            {item.text}
                          </p>
                          <div className="mt-2.5 h-10 w-full border border-dashed border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50/50 dark:bg-gray-950/30" />
                        </div>
                      );
                    }
                  })
                ) : (
                  <div className="text-center py-10 text-gray-400 dark:text-gray-600 italic">
                    No questions selected or added yet. Tick category checkboxes or add custom questions to populate the preview.
                  </div>
                )}
              </div>
            </div>

            {/* Inline validation errors */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
              isFormValid
                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                : showAllErrors
                ? "bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-400"
                : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-400"
            }`}>
              {isFormValid ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <div className="text-xs leading-normal">
                {isFormValid ? (
                  <div className="font-semibold">
                    Questionnaire parameters are valid. Ready to export!
                  </div>
                ) : (
                  <div>
                    <span className="font-bold">Missing required parameters:</span>
                    <p className="mt-1">
                      You must select at least one question category or add a custom question before you can download or copy.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* HIDDEN PRINT-OPTIMIZED CONTAINER FOR HIGH-FIDELITY A4 PDF EXPORTS          */}
      {/* ========================================================================= */}
      <div style={{ position: "absolute", left: "-9999px", top: "0", width: "794px", overflow: "hidden" }}>
        <div
          ref={printRef}
          style={{
            width: "794px",
            minHeight: "1123px",
            backgroundColor: "#ffffff",
            color: "#1f2937",
            padding: "56px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            boxSizing: "border-box"
          }}
          className="text-gray-800 animate-none"
        >
          {/* Header section */}
          <div style={{ borderBottom: "2px solid #2563eb", paddingBottom: "20px", marginBottom: "32px", textAlign: "center" }}>
            {businessName.trim() ? (
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#4b5563", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                {businessName.trim()}
              </div>
            ) : null}
            <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#111827", margin: "0 0 6px 0", textTransform: "uppercase" }}>
              Client Onboarding Questionnaire
            </h1>
            <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0" }}>
              Generated on: <strong>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
            </p>
          </div>

          {/* Questionnaire list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {orderedQuestions.length > 0 ? (
              orderedQuestions.map((item, index) => {
                if (item.categoryName) {
                  return (
                    <div
                      key={`print-cat-${index}`}
                      style={{
                        fontSize: "12px",
                        fontWeight: "800",
                        color: "#2563eb",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        borderBottom: "1px solid #e5e7eb",
                        paddingBottom: "4px",
                        marginTop: index > 0 ? "16px" : "0"
                      }}
                    >
                      {item.categoryName}
                    </div>
                  );
                } else {
                  return (
                    <div key={`print-q-${index}`} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <p style={{ fontSize: "13px", fontWeight: "600", color: "#1f2937", margin: "0", lineHeight: "1.4" }}>
                        {item.text}
                      </p>
                      <div
                        style={{
                          height: "48px",
                          width: "100%",
                          border: "1px dashed #cbd5e1",
                          borderRadius: "6px",
                          backgroundColor: "#f8fafc"
                        }}
                      />
                    </div>
                  );
                }
              })
            ) : (
              <p style={{ fontStyle: "italic", color: "#9ca3af", textAlign: "center" }}>
                No questions selected.
              </p>
            )}
          </div>

          {/* Footer branding */}
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px", marginTop: "48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "9px", color: "#9ca3af" }}>
              Generated via Freelance Ops Toolkit • Client Intake Form Builder
            </span>
            <span style={{ fontSize: "9px", color: "#9ca3af" }}>
              Secure &amp; Private • Onboarding Essential
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
