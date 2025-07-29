import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import InvoiceHeader from "./components/InvoiceHeader";
import {
  getCurrentAndNextYearShort,
  getCurrentMonthNumber,
} from "../utils/CurrentAndNextYear";
import InvoiceToFrom from "./components/InvoiceToFrom";
import InvoiceTable from "./components/InvoiceTable";
import TermsAndConditions from "./components/TermsAndConditions";
import Swal from "sweetalert2";
// import Footer from "./components/Footer";

const Invoice = () => {
  const invoiceRef = useRef(null);
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceNo, setInvoiceNo] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem("invoiceData") || "{}");
    return savedData?.invoiceNo || `DCI052/${getCurrentAndNextYearShort()}`;
  });
  const [poNo, setPoNo] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem("invoiceData") || "{}");
    return (
      savedData?.poNo ||
      `PO/${getCurrentAndNextYearShort()}/${getCurrentMonthNumber()}/0228`
    );
  });
  const [poDate, setPoDate] = useState("");
  const [tableData, setTableData] = useState({
    description: "",
    qty: "",
    rate: "",
  });
  const [tableRows, setTableRows] = useState([]);
  const [vendorName] = useState("Dci Technologies"); // Static vendor name
const [nillPoDate, setNillPoDate] = useState(false);
const [nillPoNumber, setNillPoNumber] = useState(false);
const [nillFax, setNillFax] = useState(false);
const [toAddress, setToAddress] = useState({
  companyname: "",
  streetaddress: "",
  arealocality: "",
  cityportalcode: "",
  phone: "",
  fax: "",
  gstin: "",
});
// console.log("toAddress",toAddress);

  // console.log("tableRows",tableRows);
  // console.log("tableData",tableData);
  // console.log("invoiceDate",invoiceDate);
  // console.log("invoiceNo",invoiceNo);
  // console.log("poNo",poNo);

  const handleDownload = async () => {
    try {
      const input = invoiceRef.current;

      // 1. Render with higher quality
      const canvas = await html2canvas(input, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        timeout: 3000,
      });

      // 2. Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png", 1.0);

      // 3. Fit image to A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = canvas.width / canvas.height;

      let imgWidth = pdfWidth;
      let imgHeight = pdfWidth / imgRatio;

      if (imgHeight > pdfHeight) {
        imgHeight = pdfHeight;
        imgWidth = pdfHeight * imgRatio;
      }

      // 4. Add image
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );

      // 5. Save
      pdf.save(invoiceNo + ".pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: "Failed to generate PDF. Please try again.",
      });
      // alert("Failed to generate PDF. Please try again.");
    }
  };

  //  invoice date

  const getInvoiceDate = (e) => {
    e.preventDefault();
    setInvoiceDate(e.target.value);
  };

  useEffect(() => {
    const storeInvoiceData = {
      invoiceNo: invoiceNo,
      invoiceDate: invoiceDate,
      poNo: poNo,
      poDate: poDate,
    };
    localStorage.setItem("invoiceData", JSON.stringify(storeInvoiceData));
  }, [invoiceNo, poNo, poDate, invoiceDate]);

  // invoice no
  const getInvoiceNo = (e) => {
    e.preventDefault();
    setInvoiceNo(e.target.value);
  };

  // po no
  const getPoNo = (e) => {
    e.preventDefault();
    setPoNo(e.target.value);
  };

  // po date

  const getPoDate = (e) => {
    e.preventDefault();
    setPoDate(e.target.value);
  };

  //  Table Details

  const getTableData = (e) => {
    const { name, value } = e.target;
    setTableData((prev) => ({ ...prev, [name]: value }));
  };

  const addRow = () => {
    if (!tableData.description || !tableData.qty || !tableData.rate) {
      Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Please fill in all required fields",
        confirmButtonColor: "#8AB93A",
      });

      // alert('Please fill in all fields');
      return;
    }
    setTableRows((prev) => [...prev, tableData]);
    setTableData({ description: "", qty: "", rate: "" });
  };

  //  all invoice details
  const saveInvoiceToLocalStorage = () => {
    // Validate required fields
    if (
      !invoiceDate ||
      !invoiceNo ||
      // !poNo  ||
      // !poDate ||
      tableRows.length === 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Please fill all required fields and add at least one item",
        confirmButtonColor: "#8AB93A",
      });

      // alert("Please fill all required fields and add at least one item");
      return;
    }

    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]");

    const subTotal = parseFloat(
      tableRows.reduce((sum, row) => sum + row.qty * row.rate, 0).toFixed(2)
    );
    const cgst = parseFloat(
      tableRows
        .reduce((sum, row) => sum + row.qty * row.rate * 0.09, 0)
        .toFixed(2)
    );
    const sgst = parseFloat(
      tableRows
        .reduce((sum, row) => sum + row.qty * row.rate * 0.09, 0)
        .toFixed(2)
    );
    const igst = parseFloat((cgst + sgst).toFixed(2)); // Calculate IGST as sum of CGST and SGST
    const totalAmount = parseFloat(
      tableRows
        .reduce((sum, row) => sum + row.qty * row.rate * 1.18, 0)
        .toFixed(2)
    );

    const newInvoice = {
      sNo: invoices.length + 1,
      vendorName,
      poDate,
      poNo,
      invoiceDate,
      invoiceNo,
      subTotal,
      cgst,
      sgst,
      igst, // Add IGST to the saved invoice
      totalAmount,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("invoices", JSON.stringify([...invoices, newInvoice]));
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Invoice saved successfully.",
      confirmButtonColor: "#8AB93A",
      timer: 2000,
      timerProgressBar: true,
    });

    // alert("Invoice saved successfully!");
  };


  // nill po date
  const handleNillPoDate = () => {
    setNillPoDate(prev => !prev);
  }

  //  nill po number

  const handleNillPoNo = () => {
    setNillPoNumber(prev => !prev);
  }


  //  handle TO address

  const handleToAddress = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setToAddress((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  

  //  handle nillfax
  const handleNillFax = () => {
    setNillFax(prev => !prev);
  }

  // handle default hurix address
  const handleDefaultHurixAddress = () => {
    setToAddress({
      companyname: "Hurix Systems Private Limited",
      streetaddress: "Hurix House, New No. 34, Old No. 10",
      arealocality: "Taylors Road, Kilpauk",
      cityportalcode: "Chennai, India - 600010",
      phone: "044-6667 4888",
      fax: "044-6667 4899",
      gstin: "GSTIN: 33AAACH8633D1ZX" // If you have it, else leave blank
    });
  };
  

  return (
    <div className=" flex gap-4">
      <div className="w-3/12  space-y-6 p-4 bg-gray-50 rounded-lg h-screen overflow-scroll fixed top-0 left-0">
        {/* Invoice Date */}
        <div className="space-y-2 mt-[65px]">
          <label className="block text-[#8AB93A] text-lg font-semibold"> Invoice Date </label>
         <input type="date" onChange={getInvoiceDate} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8AB93A] focus:border-transparent" />
        </div>

        {/* Invoice No */}
        <div className="space-y-2">
          <label className="block text-[#8AB93A] text-lg font-semibold"> Invoice No </label>
       <input type="text" value={invoiceNo} onChange={getInvoiceNo} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8AB93A] focus:border-transparent" />
        </div>

        {/* PO Number */}
        <div className="space-y-2">
         <label className="block text-[#8AB93A] text-lg font-semibold"> PO Number </label>
          <div className="flex gap-2 items-center">

        <input type="text" value={poNo} onChange={getPoNo} readOnly={nillPoNumber} className={`${nillPoNumber ? "opacity-50 cursor-not-allowed" : ""} w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8AB93A] focus:border-transparent`} />
        <button type="button" onClick={handleNillPoNo} className={`${nillPoNumber ? "bg-red-500 text-white hover:bg-red-400" : ""} px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm font-semibold`} > Nill </button>
          </div>
        </div>

        {/* PO Date */}
        <div className="space-y-2">
         <label className="block text-[#8AB93A] text-lg font-semibold"> PO Date </label>

          <div className="flex gap-2 items-center">
        <input type="date" onChange={getPoDate} readOnly={nillPoDate} className={`${nillPoDate ? "opacity-50 cursor-not-allowed" : ""} flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8AB93A] focus:border-transparent`} />

         <button type="button" onClick={handleNillPoDate} className={`${nillPoDate ? "bg-red-500 text-white hover:bg-red-400" : ""} px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm font-semibold`} > Nill </button>
          </div>
        </div>

{/* To address  Details  start here*/}
<p className="text-center text-2xl text-[#8AB93A]">Billing Address</p>
<div className="flex justify-end">
<button onClick={handleDefaultHurixAddress} className=" bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-3 rounded-md transition-colors duration-200" > Default Hurix </button>
</div>

       <div className="space-y-2"> 
       <label className="block text-[#8AB93A] text-lg font-semibold"> Company Name </label>
       <input type="text" onChange={handleToAddress} value={toAddress.companyname} placeholder="Enter Company Name" name="companyname" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8AB93A] focus:border-transparent" />
        </div>

        <div className="space-y-2"> 
       <label className="block text-[#8AB93A] text-lg font-semibold"> Street Address </label>
       <input type="text" onChange={handleToAddress} value={toAddress.streetaddress} placeholder="Enter Street Address" name="streetaddress" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8AB93A] focus:border-transparent" />
        </div>

        <div className="space-y-2"> 
       <label className="block text-[#8AB93A] text-lg font-semibold"> Area/Locality </label>
       <input type="text" onChange={handleToAddress} value={toAddress.arealocality} placeholder="Enter Area/Locality" name="arealocality" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8AB93A] focus:border-transparent" />
        </div>

        <div className="space-y-2"> 
       <label className="block text-[#8AB93A] text-lg font-semibold"> City & Portal Code </label>
       <input type="text" onChange={handleToAddress} value={toAddress.cityportalcode} placeholder="Eg: City - Pincode" name="cityportalcode" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8AB93A] focus:border-transparent" />
        </div>

        <div className="space-y-2"> 
       <label className="block text-[#8AB93A] text-lg font-semibold"> Phone </label>
       <input type="number" onChange={handleToAddress} value={toAddress.phone} placeholder="Eg: 9876543210" name="phone" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8AB93A] focus:border-transparent" />
        </div>

        <div className="space-y-2">
         <label className="block text-[#8AB93A] text-lg font-semibold">Fax</label>

          <div className="flex gap-2 items-center">
        <input type="text" onChange={handleToAddress} readOnly={nillFax} value={toAddress.fax} placeholder="Eg: 9876543210" name="fax" className={`${nillFax ? "opacity-50 cursor-not-allowed" : ""} w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8AB93A] focus:border-transparent`} />

         <button type="button" onClick={handleNillFax} className={`${nillFax ? "bg-red-500 text-white hover:bg-red-400" : ""} px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm font-semibold`} > Nill </button>
          </div>
        </div>

        <div className="space-y-2"> 
       <label className="block text-[#8AB93A] text-lg font-semibold"> GSTIN </label>
       <input type="text" onChange={handleToAddress} value={toAddress.gstin} placeholder="Eg: 29AABCT0000C1Z3" name="gstin" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8AB93A] focus:border-transparent" />
        </div>
{/* To address  Details  end here */}




        {/* Invoice Table */}
        <p className="text-center text-2xl text-[#8AB93A]">Table Details</p>
        <div className="space-y-2">
     <label className="block text-[#8AB93A] text-lg font-semibold"> Table Description </label>
     <textarea type="text" onChange={getTableData} value={tableData.description} placeholder="Enter Table Description" name="description" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8AB93A] focus:border-transparent" />
        </div>

        {/* order qty */}
        <div className="space-y-2">
        <label className="block text-[#8AB93A] text-lg font-semibold"> Order Qty </label>
       <input type="number" value={tableData.qty} placeholder="Enter Order Qty" name="qty" onChange={getTableData} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8AB93A] focus:border-transparent" />
        </div>

        {/* Rate */}
        <div className="space-y-2">
       <label className="block text-[#8AB93A] text-lg font-semibold"> Rate </label>
       <input type="number" onChange={getTableData} value={tableData.rate} placeholder="Enter Rate" name="rate" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8AB93A] focus:border-transparent" />
        </div>

        {/* Add Row button */}
     <button type="button" onClick={addRow} className="mt-4 px-4 py-2 bg-[#8AB93A] text-white rounded" > Add Row </button>

        {/* Add these buttons at the bottom of the sidebar */}
     <button onClick={saveInvoiceToLocalStorage} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200" > Save Invoice </button>

        {/* Download button */}
       <button onClick={handleDownload} className="mt-6 w-full bg-[#8AB93A] hover:bg-[#79A72F] text-white font-bold py-3 px-4 rounded-md transition-colors duration-200" > Download as PDF </button>
      </div>

      <div ref={invoiceRef} className="w-8/12 mt-[70px] ml-[28%] overflow-hidden" >
        <InvoiceHeader
          invoiceDate={invoiceDate}
          invoiceNo={invoiceNo}
          poNo={poNo}
          poDate={poDate}
        />
        <div>
          <InvoiceToFrom
            invoiceDate={invoiceDate}
            invoiceNo={invoiceNo}
            poNo={poNo}
            poDate={poDate}
            nillPoDate={nillPoDate}
            nillPoNumber={nillPoNumber}
            toAddress={toAddress}
            nillFax={nillFax}
          />
          <InvoiceTable rows={tableRows} setRows={setTableRows} />
          <TermsAndConditions />
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default Invoice;
