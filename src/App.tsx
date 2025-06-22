import React, { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { BorrowForm } from './components/BorrowForm';
import { ReturnForm } from './components/ReturnForm';

function App() {
  const [activeTab, setActiveTab] = useState<'borrow' | 'return'>('borrow');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-6">
              <img 
                src="https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_4/v1622188341/ics/fvi34ugb5edtsbwzddiv/2014-ICS-Logo-FINAL.jpg" 
                alt="ICS Logo" 
                className="h-20 w-auto object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Device Loaner System</h1>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex">
              <button
                onClick={() => setActiveTab('borrow')}
                className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium rounded-l-lg transition-colors ${
                  activeTab === 'borrow'
                    ? 'bg-[#CE483F] text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Download className="w-4 h-4 mr-2" />
                Borrow Device
              </button>
              <button
                onClick={() => setActiveTab('return')}
                className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium rounded-r-lg transition-colors ${
                  activeTab === 'return'
                    ? 'bg-[#1C4081] text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Upload className="w-4 h-4 mr-2" />
                Return Device
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {activeTab === 'borrow' ? 'Borrow a Device' : 'Return a Device'}
              </h2>
              <p className="text-gray-600">
                {activeTab === 'borrow' 
                  ? 'Fill out the form below to borrow a device. All fields marked with * are required.'
                  : 'Enter your details to return a borrowed device. We\'ll show you the devices you currently have.'
                }
              </p>
            </div>

            {/* Form Content */}
            <div className="transition-opacity duration-200">
              {activeTab === 'borrow' ? <BorrowForm /> : <ReturnForm />}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Need help? Contact IT support for assistance with device loans.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;