"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, CornerDownLeft } from "lucide-react";
import { toolsRegistry } from "@/lib/tools-registry";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Filter tools based on query (using existing title/description match logic)
  const filteredTools = toolsRegistry.filter((tool) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      tool.title.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    );
  });

  // Ensure index remains in bounds when filtered tools change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Global listeners for Cmd+K / Ctrl+K and escape/custom toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Save current active element as focus restorer
        if (document.activeElement instanceof HTMLElement) {
          triggerRef.current = document.activeElement;
        }
        setIsOpen((prev) => !prev);
      }
    };

    const handleCustomTrigger = () => {
      if (document.activeElement instanceof HTMLElement) {
        triggerRef.current = document.activeElement;
      }
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomTrigger);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomTrigger);
    };
  }, []);

  // Set focus on open/close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
      setSearchQuery("");
      // Restore focus
      if (triggerRef.current) {
        triggerRef.current.focus();
        triggerRef.current = null;
      }
    }
  }, [isOpen]);

  // Navigate with keyboard
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredTools.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % Math.max(1, filteredTools.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        handleNavigate(filteredTools[selectedIndex].href);
      }
    } else if (e.key === "Tab") {
      // Focus Trap within the Palette dialog
      const focusableElements = [
        inputRef.current,
        ...Array.from(listRef.current?.querySelectorAll('[role="option"]') || []),
      ].filter(Boolean) as HTMLElement[];

      if (focusableElements.length > 0) {
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;

    const activeItem = listEl.querySelector(`[data-index="${selectedIndex}"]`);
    if (activeItem) {
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const handleNavigate = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 md:p-20 overflow-y-auto bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) setIsOpen(false);
      }}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#0c0d12] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh] transition-all duration-200 animate-fadeIn"
        role="dialog"
        aria-modal="true"
        onKeyDown={handleKeyDown}
      >
        {/* Header Search Field */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/50">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tools... (arrow keys to navigate, enter to select)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0 text-sm sm:text-base"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            aria-label="Close command palette"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results list */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-transparent">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              const isSelected = selectedIndex === index;
              return (
                <div
                  key={tool.slug}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleNavigate(tool.href)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between gap-3 px-3 py-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 flex items-center justify-center ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold truncate ${isSelected ? "text-white" : "text-slate-900 dark:text-white"}`}>
                          {tool.title}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ${
                            isSelected
                              ? "bg-white/15 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {tool.category}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 line-clamp-1 leading-relaxed ${isSelected ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}>
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-1 text-[10px] font-mono font-semibold bg-white/20 text-white px-2 py-1 rounded">
                      <span>Select</span>
                      <CornerDownLeft className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 px-4 space-y-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                No tools found
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Try searching for another keyword.
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="hidden sm:flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/50 text-[10px] font-mono text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">↓↑</span>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">Enter</span>
              Select
            </span>
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">Esc</span>
              Close
            </span>
          </div>
          <div>
            <span>15 utilities available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
