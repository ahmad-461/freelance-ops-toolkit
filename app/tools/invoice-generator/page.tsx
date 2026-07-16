"use client";

import React, { useState, useRef } from "react";
import { exportToPdf } from "@/lib/pdf-export";
import {
  FileText,
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
];

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
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tool Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-1">
              <FileText className="w-4 h-4" />
              <span>Operational Tools</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Invoice Generator
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create and download high-fidelity client invoices immediately. Fully private, client-side only.
            </p>
          </div>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold py-3.5 px-6 shadow-md transition-all ${
              isFormValid
                ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.01] cursor-pointer"
                : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
            }`}
          >
            {isExporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
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
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-lg text-gray-800 dark:text-gray-100 transition-colors">
              <div className="flex justify-between items-start gap-4 mb-6">
                <div>
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo} alt="Logo preview" className="max-h-12 max-w-[120px] object-contain mb-3" />
                  ) : null}
                  <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                    {businessName || "Your Business Name"}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-pre-line mt-1.5 leading-normal">
                    {businessAddress || "Your Business Address\nCountry"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Invoice
                  </span>
                  <h4 className="text-lg font-extrabold text-gray-900 dark:text-white mt-1">
                    #{invoiceNumber || "DRAFT"}
                  </h4>
                  <div className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 space-y-1">
                    <div>Date: <span className="text-gray-600 dark:text-gray-300 font-medium">{invoiceDate || "-"}</span></div>
                    <div>Due: <span className="text-gray-600 dark:text-gray-300 font-medium">{dueDate || "-"}</span></div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-6">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Bill To
                </span>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                  {clientName || "Client Name / Company"}
                </h4>
                <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-pre-line mt-1 leading-normal">
                  {clientAddress || "Client Address Details\nCountry"}
                </p>
              </div>

              {/* Invoice table preview */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs mb-6">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold">
                      <th className="py-2.5 font-bold">Description</th>
                      <th className="py-2.5 pr-4 text-right font-bold w-12">Qty</th>
                      <th className="py-2.5 pr-4 text-right font-bold w-20">Rate</th>
                      <th className="py-2.5 text-right font-bold w-20">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 dark:border-gray-850">
                        <td className="py-3 text-gray-900 dark:text-gray-100 font-medium pr-2 max-w-[150px] truncate" title={item.description}>
                          {item.description || <span className="text-gray-300 dark:text-gray-700 italic">No description</span>}
                        </td>
                        <td className="py-3 pr-4 text-right text-gray-600 dark:text-gray-300">
                          {item.quantity}
                        </td>
                        <td className="py-3 pr-4 text-right text-gray-600 dark:text-gray-300">
                          {currency.symbol}{item.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 text-right text-gray-900 dark:text-white font-semibold">
                          {currency.symbol}{(item.quantity * item.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total calculations */}
              <div className="flex justify-end mb-6">
                <div className="w-48 text-xs space-y-2">
                  <div className="flex justify-between text-gray-400 dark:text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-200">
                      {currency.symbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {taxRate > 0 && (
                    <div className="flex justify-between text-gray-400 dark:text-gray-500">
                      <span>Tax ({taxRate}%)</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-200">
                        {currency.symbol}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-2 text-sm font-bold text-gray-900 dark:text-white">
                    <span>Total Due</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {currency.symbol}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {notes && (
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 text-[11px] text-gray-400 dark:text-gray-500">
                  <span className="font-bold text-gray-500 dark:text-gray-400 block mb-1">Notes / Instructions:</span>
                  <p className="whitespace-pre-line leading-relaxed">{notes}</p>
                </div>
              )}
            </div>

            {/* Validation helper summary in preview side */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
              isFormValid
                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-400"
            }`}>
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-xs leading-normal">
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
            backgroundColor: "#ffffff",
            color: "#1f2937",
            padding: "48px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            boxSizing: "border-box"
          }}
          className="print-container text-gray-800"
        >
          {/* Header block */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "40px" }}>

            {/* Left Header: Business Details */}
            <div style={{ maxWidth: "450px" }}>
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt="Business Logo"
                  style={{ maxHeight: "64px", maxWidth: "180px", objectFit: "contain", marginBottom: "16px" }}
                />
              ) : null}
              <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#111827", margin: "0 0 8px 0" }}>
                {businessName || "Your Business Name"}
              </h2>
              <p style={{ fontSize: "12px", color: "#4b5563", whiteSpace: "pre-line", margin: "0", lineHeight: "1.5" }}>
                {businessAddress || "Your Business Address\nCountry"}
              </p>
            </div>

            {/* Right Header: Invoice Metadata */}
            <div style={{ textAlign: "right", minWidth: "180px" }}>
              <div style={{ fontSize: "12px", fontWeight: "bold", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                Invoice Document
              </div>
              <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#111827", margin: "0 0 16px 0" }}>
                #{invoiceNumber || "DRAFT"}
              </h1>

              <div style={{ fontSize: "12px", color: "#4b5563" }} className="space-y-1.5">
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                  <span style={{ color: "#9ca3af" }}>Date:</span>
                  <strong style={{ color: "#111827" }}>{invoiceDate || "-"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                  <span style={{ color: "#9ca3af" }}>Due Date:</span>
                  <strong style={{ color: "#111827" }}>{dueDate || "-"}</strong>
                </div>
              </div>
            </div>

          </div>

          {/* Client Block */}
          <div style={{ borderTop: "2px solid #e5e7eb", paddingTop: "24px", marginBottom: "32px" }}>
            <div style={{ fontSize: "11px", fontWeight: "bold", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
              Bill To Client
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#111827", margin: "0 0 6px 0" }}>
              {clientName || "Client Name / Company"}
            </h3>
            <p style={{ fontSize: "12px", color: "#4b5563", whiteSpace: "pre-line", margin: "0", lineHeight: "1.5" }}>
              {clientAddress || "Client Address Details\nCountry"}
            </p>
          </div>

          {/* Line Items Table */}
          <div style={{ marginBottom: "32px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #111827", color: "#111827" }}>
                  <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", width: "450px" }}>
                    Description of Services
                  </th>
                  <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", textAlign: "right", width: "60px" }}>
                    Qty
                  </th>
                  <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", textAlign: "right", width: "100px" }}>
                    Rate
                  </th>
                  <th style={{ padding: "12px 8px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", textAlign: "right", width: "100px" }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: "1px solid #e5e7eb" }}
                  >
                    <td style={{ padding: "12px 8px", fontSize: "12px", color: "#111827", fontWeight: "500", verticalAlign: "top" }}>
                      {item.description || "No description"}
                    </td>
                    <td style={{ padding: "12px 8px", fontSize: "12px", color: "#4b5563", textAlign: "right", verticalAlign: "top" }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: "12px 8px", fontSize: "12px", color: "#4b5563", textAlign: "right", verticalAlign: "top" }}>
                      {currency.symbol}{item.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: "12px 8px", fontSize: "12px", color: "#111827", fontWeight: "bold", textAlign: "right", verticalAlign: "top" }}>
                      {currency.symbol}{(item.quantity * item.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Block */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
            <div style={{ width: "240px" }}>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "4px 0" }}>
                <span style={{ color: "#4b5563" }}>Subtotal:</span>
                <span style={{ fontWeight: "600", color: "#111827" }}>
                  {currency.symbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {taxRate > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "4px 0" }}>
                  <span style={{ color: "#4b5563" }}>Tax ({taxRate}%):</span>
                  <span style={{ fontWeight: "600", color: "#111827" }}>
                    {currency.symbol}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "bold", borderTop: "2px solid #111827", padding: "8px 0", marginTop: "8px" }}>
                <span>Total Due:</span>
                <span style={{ color: "#2563eb", fontSize: "16px" }}>
                  {currency.symbol}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

            </div>
          </div>

          {/* Notes & payment instructions */}
          {notes ? (
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "20px", marginTop: "40px" }}>
              <div style={{ fontSize: "11px", fontWeight: "bold", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                Notes / Payment Instructions
              </div>
              <p style={{ fontSize: "11px", color: "#4b5563", whiteSpace: "pre-line", margin: "0", lineHeight: "1.6" }}>
                {notes}
              </p>
            </div>
          ) : null}

          {/* Printed footer signature element */}
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px", marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "10px", color: "#9ca3af" }}>
              Generated via Freelance Ops Toolkit
            </span>
            <span style={{ fontSize: "10px", color: "#9ca3af" }}>
              Thank you for your business!
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
