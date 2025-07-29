import React from "react";
import logo from "../../assets/logo.png";
import "../../styles/invoice.css";
import { formatInvoiceDate } from "../../utils/dateFormatter";

const InvoiceHeader = ({ invoiceDate, invoiceNo, poNo, poDate }) => {
  return (
    <>
      <div className=" flex justify-between  items-center relative  h-[100px]">
        {/* Skewed background */}
        <div className="absolute top-0 -left-7 w-1/2 h-full bg-[#2A3547] transform skew-x-[-30deg] origin-left overflow-hidden"></div>
        <div className="absolute top-0 -left-7 w-[53%] h-full bg-[#0097B2] transform skew-x-[-30deg] origin-left -z-10 overflow-hidden"></div>
        <div className="absolute top-0 -left-7 w-[56%] h-full bg-[#fe834d] transform skew-x-[-30deg] origin-left -z-50 overflow-hidden"></div>

        {/* Company text */}
        <div className="relative z-10 pl-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Company Logo" className="w-16 h-16" />
            <div className="-mt-5">
              <h1 className="text-white text-3xl font-bold">
                DCI TECHNOLOGIES
              </h1>
              <p className="text-gray-300 text-md font-semibold">
                Digital Publishing & IT Solutions
              </p>
            </div>
          </div>
        </div>

        {/* Invoice text */}
        <div className="relative z-10 pr-8 h-[90px]">
        <p className="text-[#0097B2] text-5xl font-bold ">INVOICE</p>

</div>

        {/* <div className="relative z-10 pr-8 h-[90px]">
          <p className="text-[#8AB93A] text-5xl font-bold ">INVOICE</p>
          <p className="text-[#2A3547] text-md font-semibold mt-3">
            Invoice No: <span className="font-normal">{invoiceNo}</span>
          </p>
          <p className="text-[#2A3547] text-md font-semibold">
          Invoice Date: <span className="font-normal">{formatInvoiceDate(invoiceDate)}</span>
          </p>
    
          <p className="text-[#2A3547] text-md font-semibold">
            PO Number: <span className="font-normal">{poNo}</span>
          </p>
          <p className="text-[#2A3547] text-md font-semibold">
            PO Date: <span className="font-normal">{formatInvoiceDate(poDate)}</span>
          </p>
        </div> */}
      </div>
      <div className="flex ">
      <div className="bg-[#fe834d] h-1 w-[54%]"></div>
      <div className="bg-[#0097B2] h-1 w-[60%]"></div>
      </div>
    </>
  );
};

export default InvoiceHeader;
