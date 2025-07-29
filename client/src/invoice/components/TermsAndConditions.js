import React from "react";
import mdSign from "../../assets/Image_20250729_140101.jpeg";

const TermsAndConditions = () => {
  return (
    <>
      <div className="mt-2 px-8 p-1 ">
        <p className="text-[#fe834d] text-md font-bold ">Queries</p>
        <p>
          If you have any questions about this invoice, please write us mail to:{" "}
          <span>
            <a  href="mailto:durai@dcitechnologies.in">
              durai@dcitechnologies.in
            </a>
          </span>{" "}
        </p>
        <div className="flex justify-end py-3">
            <img
              src={mdSign}
              alt="stamp-image"
              className="w-48 "
            />
        </div>
      </div>
      <p className="text-[#404040] text-xl font-bold  text-center mb-8">
        Thank You For Your Bussiness
      </p>
    </>
  );
};

export default TermsAndConditions;
