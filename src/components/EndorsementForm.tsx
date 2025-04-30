import React, { useState } from 'react';
import FormField from './FormField';
import { generatePDF } from '../utils/pdfGenerator';
import { submitToGoogleForm } from '../utils/formSubmitter';
import { FormData } from '../types';
import Notification from './Notification';

const EndorsementForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    bankName: '',
    accountNumber: '',
    referenceNumber:'',
    amount: '',
    traceNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate PDF
      await generatePDF(formData);
      
      // Submit to Google Form
      await submitToGoogleForm(formData);
      
      // Show success notification
      setNotification({
        show: true,
        message: 'PDF generated and form submitted successfully!',
        type: 'success',
      });
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
    } catch (error) {
      console.error('Error:', error);
      setNotification({
        show: true,
        message: 'An error occurred. Please try again.',
        type: 'error',
      });
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    { name: 'bankName', label: 'DESTINATION BANK NAME', required: true },
    { name: 'accountNumber', label: 'DESTINATION ACCOUNT NUMBER', required: true },
    { name: 'referenceNumber', label: 'REFERENCE NUMBER', required: true },
    { name: 'amount', label: 'AMOUNT', required: true },
    { name: 'traceNumber', label: 'TRACE NUMBER', required: true },
    { name: 'firstName', label: 'RECIPIENT\'S FIRST NAME', required: true },
    { name: 'lastName', label: 'RECIPIENT\'S LAST NAME', required: true },
    { name: 'email', label: 'RECIPIENT\'S EMAIL ADDRESS', required: true },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full transition-all duration-300 hover:shadow-xl">
      {notification.show && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(prev => ({ ...prev, show: false }))} 
        />
      )}
      
      <div className="flex justify-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 relative">
          GCA Endorsement Form
          <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform -translate-y-1"></span>
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <FormField
            key={field.name}
            name={field.name}
            label={field.label}
            value={formData[field.name as keyof FormData]}
            onChange={handleChange}
            required={field.required}
          />
        ))}

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            NOTES (if any):
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none min-h-24 transition-all duration-200"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-3 rounded-lg shadow-md text-white transition duration-300 flex justify-center items-center ${
            isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Generate PDF & Submit'
          )}
        </button>
      </form>
    </div>
  );
};

export default EndorsementForm;