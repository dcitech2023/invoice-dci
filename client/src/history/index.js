import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const History = () => {
  const [invoices, setInvoices] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    setInvoices(savedInvoices);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "-" : date.toLocaleDateString("en-GB");
  };

  const exportToExcel = () => {
    const exportData = invoices.map((inv) => ({
      "S.NO": inv.sNo,
      "VENDOR NAME": inv.vendorName,
      "INVOICE NO": inv.invoiceNo,
      "INVOICE DATE": formatDate(inv.invoiceDate),
      "PO NO": inv.poNo,
      "PO DATE": formatDate(inv.poDate),
      "SUB TOTAL": inv.subTotal.toFixed(2),
      "CGST (9%)": inv.cgst.toFixed(2),
      "SGST (9%)": inv.sgst.toFixed(2),
      "IGST (18%)": inv.igst?.toFixed(2) ?? "0.00",
      "TOTAL AMOUNT": inv.totalAmount.toFixed(2)
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    worksheet['!cols'] = [
      { wch: 6 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 20 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 18 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "INVOICES");
    XLSX.writeFile(workbook, "InvoiceHistory.xlsx");
  };

  const confirmCleanTable = () => {
    // Show the modal
    setShowConfirm(true);
  };

  const handleDeleteConfirmed = () => {
    localStorage.removeItem("invoices");
    setInvoices([]);
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className="p-8 mx-auto mt-20 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#2A3547]">Invoice History</h1>
        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            disabled={invoices.length === 0}
            className={`bg-[#8AB93A] ${invoices.length === 0 ? 'cursor-not-allowed opacity-80' : ''} hover:bg-[#79A72F] text-white px-5 py-2 rounded-md transition-colors duration-200`}
          >
            Export to Excel
          </button>
          <button
            onClick={confirmCleanTable}
            disabled={invoices.length === 0}
            className={`bg-red-600 ${invoices.length === 0 ? 'cursor-not-allowed opacity-80' : 'hover:bg-red-700'} text-white px-5 py-2 rounded-md transition-colors duration-200`}
          >
            Clean Table
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-400">
        <table className="min-w-full table-fixed">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-2 py-3 text-left w-12 border border-gray-400">S.No</th>
              <th className="px-2 py-3 text-left w-40 border border-gray-400">Vendor Name</th>
              <th className="px-2 py-3 text-left w-40 border border-gray-400">Invoice No</th>
              <th className="px-2 py-3 text-left w-32 border border-gray-400">Invoice Date</th>
              <th className="px-2 py-3 text-left w-40 border border-gray-400">PO No</th>
              <th className="px-2 py-3 text-left w-32 border border-gray-400">PO Date</th>
              <th className="px-2 py-3 text-right w-32 border border-gray-400">Sub Total</th>
              <th className="px-2 py-3 text-right w-32 border border-gray-400">CGST (9%)</th>
              <th className="px-2 py-3 text-right w-32 border border-gray-400">SGST (9%)</th>
              <th className="px-2 py-3 text-right w-32 border border-gray-400">IGST (18%)</th>
              <th className="px-2 py-3 text-right w-36 border border-gray-400">Total Amount</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300">
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr
                  key={invoice.sNo}
                  className="hover:bg-gray-50 even:bg-white odd:bg-gray-50"
                >
                  <td className="px-2 py-3 border border-gray-300 break-words whitespace-pre-wrap">{invoice.sNo}</td>
                  <td className="px-2 py-3 border border-gray-300 break-words whitespace-pre-wrap">{invoice.vendorName}</td>
                  <td className="px-2 py-3 border border-gray-300 break-words whitespace-pre-wrap">{invoice.invoiceNo}</td>
                  <td className="px-2 py-3 border border-gray-300 break-words whitespace-pre-wrap">{formatDate(invoice.invoiceDate)}</td>
                  <td className="px-2 py-3 border border-gray-300 break-words whitespace-pre-wrap">{invoice.poNo}</td>
                  <td className="px-2 py-3 border border-gray-300 break-words whitespace-pre-wrap">{formatDate(invoice.poDate)}</td>
                  <td className="px-2 py-3 text-right border border-gray-300 break-words whitespace-pre-wrap">₹{invoice.subTotal.toFixed(2)}</td>
                  <td className="px-2 py-3 text-right border border-gray-300 break-words whitespace-pre-wrap">₹{invoice.cgst.toFixed(2)}</td>
                  <td className="px-2 py-3 text-right border border-gray-300 break-words whitespace-pre-wrap">₹{invoice.sgst.toFixed(2)}</td>
                  <td className="px-2 py-3 text-right border border-gray-300 break-words whitespace-pre-wrap">₹{invoice.igst?.toFixed(2) ?? "0.00"}</td>
                  <td className="px-2 py-3 text-right border border-gray-300 font-bold break-words whitespace-pre-wrap">₹{invoice.totalAmount.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-8 text-gray-500 border border-gray-300">
                  No invoice history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <p className="mb-6">Do you want to delete all invoice history?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors"
              >
                No, Keep It
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Yes, Delete It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
