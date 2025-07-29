import React from 'react';
import { numberToWords } from '../../utils/numberToWords';
import { AiTwotoneDelete } from "react-icons/ai";

export default function InvoiceTable({ rows, setRows }) {
  const staticHsnCode = "998316";

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  // Totals
  const subTotal = rows.reduce((sum, row) => sum + (row.qty * row.rate), 0);
  const cgst = subTotal * 0.09;
  const sgst = subTotal * 0.09;
  const gst = cgst + sgst;
  const grandTotal = subTotal + cgst + sgst;


  const amountInWords = numberToWords(grandTotal);

  return (
    <>
    <div className="mt-8 p-1 px-8">
      <div className="overflow-hidden rounded-lg border border-gray-400">
        <table className="min-w-full table-fixed">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-2 py-2 text-center w-12 border border-gray-400">S.No</th>
              <th className="px-2 py-2 text-center w-64 border border-gray-400">Description</th>
              <th className="px-2 py-2 text-center w-24 border border-gray-400">HSN</th>
              <th className="px-2 py-2 text-center w-20 border border-gray-400">Qty</th>
              <th className="px-2 py-2 text-center w-20 border border-gray-400">Rate</th>
              <th className="px-2 py-2 text-center w-24 border border-gray-400">CGST 9%</th>
              <th className="px-2 py-2 text-center w-24 border border-gray-400">SGST 9%</th>
              <th className="px-2 py-2 text-center w-28 border border-gray-400">Total</th>
              {/* <th className="px-2 py-2 text-center w-16 border border-gray-400">Delete</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {rows.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-2 py-2 border border-gray-300 text-center">{index + 1}</td>
                <td className="px-2 py-2 border border-gray-300 break-words whitespace-pre-wrap">
                  {row.description}
                </td>
                <td className="px-2 py-2 border border-gray-300 text-center">{staticHsnCode}</td>
                <td className="px-2 py-2 border border-gray-300 text-right">{row.qty}</td>
                <td className="px-2 py-2 border border-gray-300 text-right">
                  ₹{Number(row.rate).toFixed(2)}
                </td>
                <td className="px-2 py-2 border border-gray-300 text-right">
                  ₹{((row.qty * row.rate) * 0.09).toFixed(2)}
                </td>
                <td className="px-2 py-2 border border-gray-300 text-right">
                  ₹{((row.qty * row.rate) * 0.09).toFixed(2)}
                </td>
                <td className="px-2 py-2 border border-gray-300 text-right">
                  ₹{((row.qty * row.rate) * 1.18).toFixed(2)}
                </td>
                {/* <td className="px-2 py-2 border border-gray-300 text-center print:hidden">
                  <button
                    onClick={() => handleDeleteRow(index)}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    title="Delete Row"
                  >
                    <AiTwotoneDelete />

                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals below table */}
      <div className="mt-4 flex justify-end">
        <div className="w-full max-w-md">
          <div className="flex justify-between border-b border-gray-400 py-2">
            <span className="font-semibold">Sub Total</span>
            <span>₹{subTotal.toFixed(2)}</span>
          </div>
          {/* <div className="flex justify-between border-b border-gray-400 py-2">
            <span className="font-semibold">CGST (9%)</span>
            <span>₹{cgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-400 py-2">
            <span className="font-semibold">SGST (9%)</span>
            <span>₹{sgst.toFixed(2)}</span>
          </div> */}
          <div className="flex justify-between border-b border-gray-400 py-2">
            <span className="font-semibold">GST (18%)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 font-bold">
            <span>Grand Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-6 px-8">
  <div className="w-full">
    <div className="flex items-center gap-1 py-2">
      <span className='text-[#404040] text-md font-bold '>Amount in Words: </span>
      <span className="text-right text-[#404040]">{amountInWords}</span>
    </div>
  </div>
</div>

    </>
  );
}
