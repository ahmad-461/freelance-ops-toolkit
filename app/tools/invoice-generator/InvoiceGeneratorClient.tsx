"use client";

import React, { useState, useRef } from "react";
import { exportToPdf } from "@/lib/pdf-export";
import { ToolHero } from "@/components/layout/ToolHero";
import { InvoiceVisual } from "@/components/layout/ToolHeroVisuals";
import {
  Upload,
  Plus,
  Trash2,
  Download,
  Building2,
  User,
  Calendar,
  DollarSign,
  Info,
  CheckCircle2
} from "lucide-react";
import ToolSeoContent from "@/components/layout/ToolSeoContent";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "PKR", symbol: "Rs.", label: "PKR (Rs.)" },
  { code: "AUD", symbol: "A$", label: "AUD (A$)" },
  { code: "CAD", symbol: "C$", label: "CAD (C$)" },
  { code: "INR", symbol: "₹", label: "INR (₹)" },
];

const formatInvoiceDate = (dateStr: string) => {
  if (!dateStr) return "-";
  try {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) return dateStr;

    const dayNum = date.getDate();
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthName = months[date.getMonth()];
    const fullYear = date.getFullYear();

    return `${dayNum} ${monthName} ${fullYear}`;
  } catch {
    return dateStr;
  }
};

export default function InvoiceGenerator() {
  // Core Form State
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [logo, setLogo] = useState<string | null>(null);

  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [taxRate, setTaxRate] = useState<number>(0);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [notes, setNotes] = useState("");

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "Initial consultation & scope definition", quantity: 1, rate: 150 }
  ]);

  // Prefill from Session Storage (for Time Tracker integration)
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("prefilled_invoice_data");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.clientName) setClientName(parsed.clientName);
          if (parsed.lineItems && parsed.lineItems.length > 0) {
            const formattedItems = parsed.lineItems.map((item: { description: string; quantity: number; rate: number }, idx: number) => ({
              id: `prefilled-${Date.now()}-${idx}`,
              description: item.description,
              quantity: item.quantity,
              rate: item.rate
            }));
            setLineItems(formattedItems);
          }
          // Clear it after using it once so it doesn't persist on page reload or if they navigate away & back
          sessionStorage.removeItem("prefilled_invoice_data");
        } catch (e) {
          console.error("Failed to parse prefilled invoice data", e);
        }
      }
    }
  }, []);

  // Touch Tracking State
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Hidden PDF Ref
  const printRef = useRef<HTMLDivElement>(null);

  // Mark field as touched
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Logo Upload Handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Logo image size must be under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo(null);
  };

  // Line Item Handlers
  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0
    };
    setLineItems([...lineItems, newItem]);
  };

  const updateLineItem = (id: string, updates: Partial<LineItem>) => {
    setLineItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length <= 1) {
      alert("At least one line item is required on the invoice.");
      return;
    }
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  // --- Calculations ---
  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const taxAmount = (subtotal * (taxRate || 0)) / 100;
  const grandTotal = subtotal + taxAmount;

  // --- Validation ---
  const errors: Record<string, string> = {};

  if (!businessName.trim()) {
    errors.businessName = "Business name is required.";
  }
  if (!clientName.trim()) {
    errors.clientName = "Client name is required.";
  }
  if (!invoiceNumber.trim()) {
    errors.invoiceNumber = "Invoice number is required.";
  }
  if (!invoiceDate) {
    errors.invoiceDate = "Invoice date is required.";
  }
  if (!dueDate) {
    errors.dueDate = "Due date is required.";
  } else if (invoiceDate && dueDate < invoiceDate) {
    errors.dueDate = "Due date cannot be before invoice date.";
  }

  // Line items validation
  let lineItemsValid = lineItems.length > 0;
  const lineItemsErrors: Record<string, { description?: string, quantity?: string, rate?: string }> = {};

  lineItems.forEach((item) => {
    const itemError: { description?: string, quantity?: string, rate?: string } = {};
    if (!item.description.trim()) {
      itemError.description = "Description is required.";
      lineItemsValid = false;
    }
    if (item.quantity <= 0) {
      itemError.quantity = "Qty must be > 0.";
      lineItemsValid = false;
    }
    if (item.rate < 0) {
      itemError.rate = "Rate must be >= 0.";
      lineItemsValid = false;
    }
    if (Object.keys(itemError).length > 0) {
      lineItemsErrors[item.id] = itemError;
    }
  });

  const isFormValid = Object.keys(errors).length === 0 && lineItemsValid;

  // Render Helper for Inline Error Messages
  const renderError = (field: string) => {
    const isFieldTouched = touched[field] || showAllErrors;
    if (isFieldTouched && errors[field]) {
      return (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400 inline-block" />
          {errors[field]}
        </p>
      );
    }
    return null;
  };

  const getInputFieldClass = (field: string) => {
    const isFieldTouched = touched[field] || showAllErrors;
    const hasError = isFieldTouched && errors[field];
    return `w-full rounded-xl border ${
      hasError
        ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-blue-500 focus:border-blue-500"
    } py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 text-gray-900 dark:text-gray-100`;
  };

  // --- Trigger PDF Download ---
  const handleDownload = async () => {
    setShowAllErrors(true);
    if (!isFormValid) {
      alert("Please fix all invalid or missing fields before generating PDF.");
      return;
    }

    if (printRef.current) {
      setIsExporting(true);
      const cleanFilename = `Invoice_${invoiceNumber || "Draft"}.pdf`;
      await exportToPdf(printRef.current, {
        filename: cleanFilename,
        onComplete: () => setIsExporting(false),
        onError: () => setIsExporting(false)
      });
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-16 transition-colors duration-200">
      <ToolHero
        title="Invoice Generator"
        description="Create and download high-fidelity, branded client invoices immediately. Fast, fully private, and executed entirely inside your browser."
        actionLabel="Build Invoice ↓"
        visual={<InvoiceVisual />}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Form top action bar */}
        <div id="tool-form" className="scroll-mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invoice Configurator</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Fill out your company, client, and line item details below.</p>
          </div>
          <button
            onClick={handleDownload}
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
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download PDF
              </>
            )}
          </button>
        </div>

        {/* Outer Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ========================================================= */}
          {/* LEFT SIDE: CONTROL / INPUT FORM (7 Cols) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">

            {/* Business Profile Panel */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">From: Your Business</h2>
              </div>

              <div className="space-y-4">
                {/* Logo Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Company Logo (Optional - Max 2MB PNG/JPEG)
                  </label>
                  <div className="flex items-center gap-4">
                    {logo ? (
                      <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 w-24 h-24 bg-white flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo} alt="Business logo preview" className="object-contain max-w-full max-h-full p-2" />
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-800 w-24 h-24 cursor-pointer hover:border-blue-500 hover:bg-blue-50/10 dark:hover:bg-blue-950/10 transition-all">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-[10px] text-gray-400 mt-1 font-medium">Upload logo</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                    <div className="text-xs text-gray-400 max-w-xs leading-normal">
                      Converting the logo to a Base64 data URL avoids rendering issues during high-fidelity PDF output.
                    </div>
                  </div>
                </div>

                {/* Business Name & Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    onBlur={() => handleBlur("businessName")}
                    placeholder="e.g. Pixelcraft Digital Studio LLC"
                    className={getInputFieldClass("businessName")}
                  />
                  {renderError("businessName")}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Business Address
                  </label>
                  <textarea
                    rows={3}
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="e.g. 123 Creative Street, Suite 400&#10;San Francisco, CA 94107"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Client Profile Panel */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Bill To: Client</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    onBlur={() => handleBlur("clientName")}
                    placeholder="e.g. Acme Corporation"
                    className={getInputFieldClass("clientName")}
                  />
                  {renderError("clientName")}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Client Address
                  </label>
                  <textarea
                    rows={3}
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="e.g. 456 Enterprise Way&#10;New York, NY 10001"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Meta details */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Invoice Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Invoice # *
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    onBlur={() => handleBlur("invoiceNumber")}
                    placeholder="e.g. INV-2025-001"
                    className={getInputFieldClass("invoiceNumber")}
                  />
                  {renderError("invoiceNumber")}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Invoice Date *
                  </label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    onBlur={() => handleBlur("invoiceDate")}
                    className={getInputFieldClass("invoiceDate")}
                  />
                  {renderError("invoiceDate")}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    onBlur={() => handleBlur("dueDate")}
                    className={getInputFieldClass("dueDate")}
                  />
                  {renderError("dueDate")}
                </div>
              </div>

              {/* Currency & Tax Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-850">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Currency Selection
                  </label>
                  <select
                    value={currency.code}
                    onChange={(e) => {
                      const selected = CURRENCIES.find(c => c.code === e.target.value);
                      if (selected) setCurrency(selected);
                    }}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Tax Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={taxRate || ""}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 10"
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 pl-3.5 pr-8 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items repeatable rows */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Line Items</h2>
                </div>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>

              <div className="space-y-4">
                {lineItems.map((item, index) => {
                  const itemErr = lineItemsErrors[item.id] || {};
                  const isItemTouched = touched[`item-${item.id}`] || showAllErrors;

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-gray-100 dark:border-gray-850 bg-gray-50/40 dark:bg-gray-900/30 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                          Item #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeLineItem(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          title="Remove line item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Item Description */}
                      <div>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
                          onBlur={() => handleBlur(`item-${item.id}`)}
                          placeholder="Item description or service rendered"
                          className={`w-full rounded-lg border ${
                            isItemTouched && itemErr.description
                              ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
                              : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
                          } py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100`}
                        />
                        {isItemTouched && itemErr.description && (
                          <p className="mt-1 text-[11px] text-red-600 dark:text-red-400 font-medium">
                            {itemErr.description}
                          </p>
                        )}
                      </div>

                      {/* Qty & Rate Row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                            Quantity *
                          </label>
                          <input
                            type="number"
                            min="0.01"
                            step="any"
                            value={item.quantity || ""}
                            onChange={(e) => updateLineItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                            onBlur={() => handleBlur(`item-${item.id}`)}
                            placeholder="Qty"
                            className={`w-full rounded-lg border ${
                              isItemTouched && itemErr.quantity
                                ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
                                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
                            } py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100`}
                          />
                          {isItemTouched && itemErr.quantity && (
                            <p className="mt-1 text-[11px] text-red-600 dark:text-red-400 font-medium">
                              {itemErr.quantity}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                            Rate * ({currency.symbol})
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.rate === 0 && !isItemTouched ? "0" : item.rate || ""}
                            onChange={(e) => {
                              const val = e.target.value === "" ? 0 : parseFloat(e.target.value);
                              updateLineItem(item.id, { rate: isNaN(val) ? 0 : val });
                            }}
                            onBlur={() => handleBlur(`item-${item.id}`)}
                            placeholder="Rate"
                            className={`w-full rounded-lg border ${
                              isItemTouched && itemErr.rate
                                ? "border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20"
                                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
                            } py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100`}
                          />
                          {isItemTouched && itemErr.rate && (
                            <p className="mt-1 text-[11px] text-red-600 dark:text-red-400 font-medium">
                              {itemErr.rate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment instructions & Notes */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Payment Instructions & Notes</h2>
              </div>

              <div>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please send payments to Bank XYZ, Account # 1234-5678-90. Thank you for your partnership!"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 py-2.5 px-3.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: LIVE INTERACTIVE PREVIEW (5 Cols) - STICKY */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Live Preview
              </h2>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                Updates in Real-Time
              </span>
            </div>

            {/* Simulated Live Preview Page */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-[#FAF9F6] dark:bg-[#12131a] p-6 sm:p-8 shadow-lg text-slate-900 dark:text-slate-100 transition-colors overflow-hidden relative">
              {/* Geometric Background Accents */}
              <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10">
                {/* Elegant ticks, thin hairlines */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-slate-900 dark:border-white" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-slate-900 dark:border-white" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-slate-900 dark:border-white" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-slate-900 dark:border-white" />

                {/* Thin horizontal lines */}
                <div className="absolute top-[18%] left-0 right-0 h-[1px] bg-slate-900/10 dark:bg-white/10" />
                <div className="absolute top-[35%] left-0 right-0 h-[1px] bg-slate-900/10 dark:bg-white/10" />
                <div className="absolute bottom-[20%] left-0 right-0 h-[1px] bg-slate-900/10 dark:bg-white/10" />
              </div>

              {/* Main Content (Spacious, Minimalist Stacked Layout with Off-center Asymmetrical Elements) */}
              <div className="relative z-10 space-y-8 text-left">

                {/* Top Section: Giant "INVOICE" Title + Prominent Top-Right Invoice Number & Details */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                  <div>
                    {/* Giant, bold uppercase INVOICE */}
                    <h3 className="text-4xl font-black tracking-[0.2em] uppercase font-sans text-slate-900 dark:text-white leading-none">
                      INVOICE
                    </h3>
                    <div className="h-[2px] bg-slate-900 dark:bg-white w-16 mt-4" />
                  </div>

                  {/* Prominent Top-Right Invoice Number */}
                  <div className="text-left sm:text-right">
                    <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                      INVOICE NO.
                    </span>
                    <span className="block text-2xl font-black text-blue-600 dark:text-blue-500 tracking-wider mt-1.5">
                      #{invoiceNumber || "DRAFT"}
                    </span>
                  </div>
                </div>

                {/* Sub-header details block: Business on the left, Dates stacked on the right */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-900/5 dark:border-white/5">
                  {/* Business details */}
                  <div className="space-y-3">
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logo} alt="Logo preview" className="max-h-12 max-w-[120px] object-contain mb-2" />
                    ) : null}
                    <h4 className="text-xs font-bold tracking-wider uppercase text-slate-850 dark:text-slate-200">
                      {businessName || "Your Business Name"}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                      {businessAddress || "Your Business Address\nCountry"}
                    </p>
                  </div>

                  {/* Dates stacked on the right */}
                  <div className="flex flex-col sm:items-end justify-center gap-3">
                    <div className="sm:text-right">
                      <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        DATE OF ISSUE
                      </span>
                      <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 font-mono">
                        {formatInvoiceDate(invoiceDate)}
                      </span>
                    </div>
                    <div className="sm:text-right">
                      <span className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        DUE DATE
                      </span>
                      <span className="block text-xs font-black text-slate-900 dark:text-white mt-1 font-mono">
                        {formatInvoiceDate(dueDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Client Card with distinct visual character, positioned offset to the left */}
                <div className="p-5 rounded-xl border-l-4 border-blue-600 dark:border-blue-500 bg-[#faf8f5] dark:bg-[#1c1d26] shadow-sm max-w-sm">
                  <span className="block text-[9px] font-bold text-blue-600 dark:text-blue-500 uppercase tracking-widest mb-1.5">
                    BILL TO CLIENT
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {clientName || "Client Name / Company"}
                  </h4>
                  {clientAddress ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-line mt-1.5 leading-relaxed">
                      {clientAddress}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-1.5">
                      No client address specified
                    </p>
                  )}
                </div>

                {/* Line Items Table spanning the full available width */}
                <div className="border-t border-b border-slate-900/10 dark:border-white/10 py-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
                          <th className="pb-3 font-bold">Services / Deliverables</th>
                          <th className="pb-3 px-3 text-right font-bold w-16">Qty</th>
                          <th className="pb-3 px-3 text-right font-bold w-24">Rate</th>
                          <th className="pb-3 text-right font-bold w-28">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/5 dark:divide-white/5">
                        {lineItems.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors">
                            <td className="py-3 text-slate-900 dark:text-slate-100 font-medium pr-3 max-w-[200px] truncate" title={item.description}>
                              {item.description || <span className="text-slate-300 dark:text-slate-700 italic">No description</span>}
                            </td>
                            <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400 font-medium">
                              {item.quantity}
                            </td>
                            <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400 font-mono">
                              {currency.symbol}{item.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 text-right text-slate-950 dark:text-white font-bold font-mono">
                              {currency.symbol}{(item.quantity * item.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bottom Row: Notes on the left, Total Highlight Box on the right (Asymmetric Layout) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">
                  {/* Notes Field (Left-bottom side) */}
                  <div className="md:col-span-6 space-y-1.5">
                    {notes && (
                      <>
                        <span className="font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-widest text-[9px]">
                          Notes / Instructions
                        </span>
                        <p className="whitespace-pre-line text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">{notes}</p>
                      </>
                    )}
                  </div>

                  {/* Bold Modern Total Due Highlight Box (Right-bottom side, prominent width) */}
                  <div className="md:col-span-6 flex justify-end">
                    <div className="w-full sm:w-72 rounded-xl border border-blue-600/20 bg-blue-600 text-white p-5 shadow-md">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs text-blue-100">
                          <span>Subtotal</span>
                          <span className="font-mono font-bold">
                            {currency.symbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        {taxRate > 0 && (
                          <div className="flex justify-between text-xs text-blue-100">
                            <span>Tax ({taxRate}%)</span>
                            <span className="font-mono font-bold">
                              {currency.symbol}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center border-t border-blue-500/50 pt-3">
                        <span className="text-xs font-black tracking-widest uppercase">Total Due</span>
                        <span className="text-lg font-black font-mono">
                          {currency.symbol}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Validation helper summary in preview side */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
              isFormValid
                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-400"
            }`}>
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-xs leading-normal text-left">
                {isFormValid ? (
                  <div className="font-semibold flex items-center gap-1">
                    Everything is valid! Ready to download your PDF.
                  </div>
                ) : (
                  <div>
                    <span className="font-bold">Missing required fields:</span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 opacity-90">
                      {!businessName.trim() && <li>Your Business Name</li>}
                      {!clientName.trim() && <li>Client Name</li>}
                      {!invoiceNumber.trim() && <li>Invoice Number</li>}
                      {!invoiceDate && <li>Invoice Date</li>}
                      {!dueDate && <li>Due Date</li>}
                      {!lineItemsValid && <li>At least one valid Line Item</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        <ToolSeoContent
          h2Title="The Easiest Free Invoice Generator for Freelancers"
          intro="Generating high-fidelity invoices shouldn't require an active SaaS subscription or a tedious sign-up sequence. Our free invoice generator operates with absolute client-side privacy, empowering you to create professional, print-ready PDF invoices for your clients in seconds. By executing the calculation and PDF rendering pipeline directly inside your browser, we ensure your financial data remains completely yours while maintaining standard compliance."
          sections={[
            {
              title: "How to Create an Invoice as a Freelancer",
              prose: "Creating a professional invoice requires clear, unambiguous operational structure. Begin by entering your business particulars—such as legal name, company logo, and current physical or mailing address—followed by your client's billing information. Ensure the invoice has a unique, sequential number for clean tax record keeping, alongside the issue and corresponding payment due dates. Itemize your services clearly by listing distinct quantities, unit rates, and service descriptions. If applicable, specify custom taxes or discount rates, and complete the setup by inserting your payment instructions or wire details."
            },
            {
              title: "Why Professional Invoicing Matters for Client Trust",
              prose: "Invoicing is more than a simple request for payment; it is a critical touchpoint in your client onboarding and retention cycle. A clean, well-formatted invoice signals operational authority, establishing deep credibility and reinforcing the high caliber of your professional deliverables. Clear documentation also minimizes friction by detailing exactly what client deliverables are being billed, which greatly decreases payment delay. Utilizing a reliable, free invoice maker no signup tool shows clients that your operational systems are standardized, professional, and efficient."
            },
            {
              title: "Common Invoicing Mistakes to Avoid",
              prose: "Many independent professionals make simple errors that delay payments or compromise client-contractor dynamics. Common pitfalls include failing to designate clear, explicit payment terms (such as 'Net 15' or 'Due upon receipt'), omitting payment details or bank routing instructions, and neglecting to follow up promptly on past-due balances. It is also wise to specify standard late fees in your original agreements so that calculations can be easily resolved if payment deadlines are missed."
            }
          ]}
          internalLinks={[
            { label: "Late Payment Fee Calculator", href: "/tools/late-payment-fee-calculator" },
            { label: "Payment Reminder Generator", href: "/tools/payment-reminder-generator" }
          ]}
        />

      </div>

      {/* ========================================================================= */}
      {/* HIDDEN PRINT-OPTIMIZED CONTAINER FOR HIGH-FIDELITY A4 PDF EXPORTS          */}
      {/* Set at exactly 794px width (96 DPI standard A4 width) positioned off-screen */}
      {/* ========================================================================= */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: "0",
          width: "794px",
          overflow: "hidden"
        }}
      >
        <div
          ref={printRef}
          style={{
            width: "794px",
            minHeight: "1123px",
            backgroundColor: "#FAF9F6",
            color: "#0f172a",
            padding: "48px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            boxSizing: "border-box",
            position: "relative"
          }}
          className="print-container"
        >
          {/* Subtle Background Geometric Accents */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", opacity: 0.15 }}>
            <div style={{ position: "absolute", top: "24px", left: "24px", width: "16px", height: "16px", borderTop: "1px solid #0f172a", borderLeft: "1px solid #0f172a" }} />
            <div style={{ position: "absolute", top: "24px", right: "24px", width: "16px", height: "16px", borderTop: "1px solid #0f172a", borderRight: "1px solid #0f172a" }} />
            <div style={{ position: "absolute", bottom: "24px", left: "24px", width: "16px", height: "16px", borderBottom: "1px solid #0f172a", borderLeft: "1px solid #0f172a" }} />
            <div style={{ position: "absolute", bottom: "24px", right: "24px", width: "16px", height: "16px", borderBottom: "1px solid #0f172a", borderRight: "1px solid #0f172a" }} />

            <div style={{ position: "absolute", top: "25%", left: 0, right: 0, height: "1px", backgroundColor: "#0f172a", opacity: 0.5 }} />
            <div style={{ position: "absolute", top: "66%", left: 0, right: 0, height: "1px", backgroundColor: "#0f172a", opacity: 0.5 }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: "60%", width: "1px", backgroundColor: "#0f172a", opacity: 0.5 }} />
          </div>

          {/* Grid Layout Container */}
          <div style={{ position: "relative", zIndex: 10, display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "32px", height: "100%" }}>

            {/* Left Column (Main Body) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div>
                <h1 style={{ fontSize: "42px", fontWeight: "900", letterSpacing: "0.2em", textTransform: "uppercase", margin: "0", color: "#0f172a", lineHeight: "1" }}>
                  INVOICE
                </h1>
                <div style={{ height: "2px", backgroundColor: "#0f172a", width: "48px", marginTop: "16px", marginBottom: "24px" }} />

                {/* Business Profile */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {logo ? (
                    <img
                      src={logo}
                      alt="Business Logo"
                      style={{ maxHeight: "48px", maxWidth: "160px", objectFit: "contain", alignSelf: "flex-start", marginBottom: "8px" }}
                    />
                  ) : null}
                  <h4 style={{ fontSize: "14px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", margin: "0", color: "#0f172a" }}>
                    {businessName || "Your Business Name"}
                  </h4>
                  <p style={{ fontSize: "11px", color: "#475569", whiteSpace: "pre-line", margin: "0", lineHeight: "1.6" }}>
                    {businessAddress || "Your Business Address\nCountry"}
                  </p>
                </div>
              </div>

              {/* Table of Line Items */}
              <div style={{ borderTop: "1px solid rgba(15, 23, 42, 0.1)", borderBottom: "1px solid rgba(15, 23, 42, 0.1)", paddingTop: "16px", paddingBottom: "16px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "bold", fontSize: "9px" }}>
                      <th style={{ paddingBottom: "12px", fontWeight: "bold" }}>Services / Deliverables</th>
                      <th style={{ paddingBottom: "12px", textAlign: "right", fontWeight: "bold", width: "40px" }}>Qty</th>
                      <th style={{ paddingBottom: "12px", textAlign: "right", fontWeight: "bold", width: "80px" }}>Rate</th>
                      <th style={{ paddingBottom: "12px", textAlign: "right", fontWeight: "bold", width: "80px" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item) => (
                      <tr key={item.id} style={{ borderBottom: "1px solid rgba(15, 23, 42, 0.05)" }}>
                        <td style={{ paddingTop: "12px", paddingBottom: "12px", paddingRight: "16px", fontWeight: "600", color: "#0f172a" }}>
                          {item.description || "No description"}
                        </td>
                        <td style={{ paddingTop: "12px", paddingBottom: "12px", textAlign: "right", color: "#475569" }}>
                          {item.quantity}
                        </td>
                        <td style={{ paddingTop: "12px", paddingBottom: "12px", textAlign: "right", color: "#475569", fontFamily: "monospace" }}>
                          {currency.symbol}{item.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ paddingTop: "12px", paddingBottom: "12px", textAlign: "right", fontWeight: "bold", color: "#0f172a", fontFamily: "monospace" }}>
                          {currency.symbol}{(item.quantity * item.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Notes Field */}
              {notes && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "9px", fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                    Notes / Instructions
                  </span>
                  <p style={{ fontSize: "11px", color: "#475569", whiteSpace: "pre-line", margin: "0", lineHeight: "1.6" }}>
                    {notes}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column (Sidebar details) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingLeft: "16px" }}>
              {/* Prominent Invoice Number */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "9px", fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                  INVOICE NO.
                </span>
                <span style={{ fontSize: "24px", fontWeight: "900", color: "#2563eb", letterSpacing: "1px" }}>
                  #{invoiceNumber || "DRAFT"}
                </span>
              </div>

              {/* Client Card */}
              <div style={{
                padding: "16px",
                borderRadius: "12px",
                borderLeft: "4px solid #2563eb",
                backgroundColor: "#FAF9F6",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                borderTop: "1px solid rgba(15, 23, 42, 0.05)",
                borderRight: "1px solid rgba(15, 23, 42, 0.05)",
                borderBottom: "1px solid rgba(15, 23, 42, 0.05)"
              }}>
                <span style={{ fontSize: "9px", fontWeight: "bold", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1.5px", display: "block", marginBottom: "8px" }}>
                  BILL TO CLIENT
                </span>
                <h4 style={{ fontSize: "13px", fontWeight: "bold", color: "#0f172a", margin: "0 0 6px 0" }}>
                  {clientName || "Client Name / Company"}
                </h4>
                {clientAddress ? (
                  <p style={{ fontSize: "11px", color: "#475569", whiteSpace: "pre-line", margin: "0", lineHeight: "1.5" }}>
                    {clientAddress}
                  </p>
                ) : (
                  <p style={{ fontSize: "11px", color: "#94a3b8", fontStyle: "italic", margin: "0" }}>
                    No client address specified
                  </p>
                )}
              </div>

              {/* Stacked Dates block */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                borderTop: "1px solid rgba(15, 23, 42, 0.05)",
                borderBottom: "1px solid rgba(15, 23, 42, 0.05)",
                paddingTop: "16px",
                paddingBottom: "16px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "8px", fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
                    DATE OF ISSUE:
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "bold", color: "#0f172a", fontFamily: "monospace" }}>
                    {formatInvoiceDate(invoiceDate)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "8px", fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
                    DUE DATE:
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "bold", color: "#0f172a", fontFamily: "monospace" }}>
                    {formatInvoiceDate(dueDate)}
                  </span>
                </div>
              </div>

              {/* Bold Modern Total Due Highlight Box */}
              <div style={{
                borderRadius: "12px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "20px",
                boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "16px"
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", opacity: 0.9 }}>
                    <span>Subtotal</span>
                    <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                      {currency.symbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {taxRate > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", opacity: 0.9 }}>
                      <span>Tax ({taxRate}%)</span>
                      <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                        {currency.symbol}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255, 255, 255, 0.3)", paddingTop: "12px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" }}>Total Due</span>
                  <span style={{ fontSize: "18px", fontWeight: "900", fontFamily: "monospace" }}>
                    {currency.symbol}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* PDF Footer element at bottom */}
          <div style={{
            position: "absolute",
            bottom: "48px",
            left: "48px",
            right: "48px",
            borderTop: "1px solid rgba(15, 23, 42, 0.1)",
            paddingTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            textTransform: "uppercase",
            fontSize: "8px",
            color: "#94a3b8",
            letterSpacing: "0.5px"
          }}>
            <span>
              Generated via Freelance Ops Toolkit
            </span>
            <span style={{ fontWeight: "600" }}>
              Thank you for your business!
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
