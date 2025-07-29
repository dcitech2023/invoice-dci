import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Invoice from './invoice';
import Header from './layouts/header/Header';
import History from './history';
import Swal from 'sweetalert2';

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastShownDate = localStorage.getItem('lastPopupDate');

    if (lastShownDate !== today) {
      setShowPopup(true);
      setTimeout(() => setIsVisible(true), 10); // Small delay for animation
    }
  }, []);

  const handleYes = () => {
    localStorage.removeItem('invoices');
    localStorage.setItem('lastPopupDate', new Date().toDateString());
    setIsVisible(false);
    setTimeout(() => setShowPopup(false), 300); // Wait for animation to complete
       Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Old invoices have been cleared!',
          confirmButtonColor: '#8AB93A',
          timer: 2000,
          timerProgressBar: true
        });
    // alert('Old invoices have been cleared!');
  };

  const handleNo = () => {
    localStorage.setItem('lastPopupDate', new Date().toDateString());
    setIsVisible(false);
    setTimeout(() => setShowPopup(false), 300); // Wait for animation to complete
  };

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Invoice />} />
        <Route path="/history" element={<History />} />
      </Routes>

      {showPopup && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-gray-100 transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#8AB93A] bg-opacity-20 text-[#8AB93A]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900">Clear Old Invoices?</h2>
                <div className="mt-2">
                  <p className="text-gray-600">
                    For better performance, would you like to delete old invoice records from your local storage?
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This won't affect invoices you've already downloaded.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleNo}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Keep Them
              </button>
              <button
                onClick={handleYes}
                className="px-4 py-2 bg-[#8AB93A] hover:bg-[#79A72F] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8AB93A] transition-colors duration-200"
              >
                Clear Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;