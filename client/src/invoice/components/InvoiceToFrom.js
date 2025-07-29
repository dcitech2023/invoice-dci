import React from 'react'
import { formatInvoiceDate } from "../../utils/dateFormatter";

const InvoiceToFrom = ({ invoiceDate, invoiceNo, poNo, poDate, nillPoDate, nillPoNumber, toAddress, nillFax }) => {
  // console.log("nillPoDate", nillPoDate);
  
  return (
    <>
        {/* Invoice text */}
            <div className="relative z-10 pr-8 h-[90px] mt-5">
              <p className="text-[#fe834d] text-3xl font-bold text-center">SERVICE INVOICE</p>
              <div className='flex justify-end'>
                <div>
              <p className="text-[#2A3547] text-md font-semibold mt-3">
                Invoice No: <span className="font-normal">{invoiceNo}</span>
              </p>
              <p className="text-[#2A3547] text-md font-semibold">
              Invoice Date: <span className="font-normal">{formatInvoiceDate(invoiceDate)}</span>
              </p>
          
              <p className="text-[#2A3547] text-md font-semibold">
                PO Number: <span className="font-normal">{nillPoNumber ? "Nill" : poNo}</span>
              </p>
              <p className="text-[#2A3547] text-md font-semibold">
                PO Date: <span className="font-normal">{nillPoDate ? "Nill" : formatInvoiceDate(poDate)}</span>
              </p>
              </div>
              </div>
            </div>


        {/* To and From */}
        <div className='flex justify-between  mt-20'>
            {/* To */}
            <div className='ml-10'>
                <p className='text-[#fe834d] text-md font-bold '>Invoice To:</p>
                <h2>{toAddress.companyname}</h2>
                <span>{toAddress.streetaddress}</span><br/>
                <span>{toAddress.arealocality}</span><br/>
                <span>{toAddress.cityportalcode}</span>
                <p>Tel: <span>{toAddress.phone}</span><br/> Fax: <span>{nillFax ? "Nill" : toAddress.fax}</span></p>
                <p>GSTIN: <span>{toAddress.gstin}</span></p>
           
            </div>
            {/* From */}
            <div className='mr-[60px]'>
                <p className='text-[#fe834d] text-md font-bold '>Invoice From:</p>
                <h2>DCI Technologies Private Limited</h2>
                <span>Block No. 8/83A, Anna Nagar</span><br/>
                <span>Gopalpatti</span><br/>
                <span>Dindigul, India - 624308</span>
                <p>Phone: <span>+91 9698182490,<br/> +91 6382996723</span></p>
                <p>GSTIN: <span>33CGPPD7275P1ZO</span></p>
            </div>
        </div>
    </>
  )
}

export default InvoiceToFrom
