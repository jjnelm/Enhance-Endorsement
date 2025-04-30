// import { FormData } from '../types';

// /**
//  * Submits form data to Google Sheets via Apps Script
//  */
// export const submitToGoogleForm = async (formData: FormData): Promise<void> => {
//   try {
//     // Replace this URL with your Google Apps Script Web app URL
//     const sheetUrl = 'https://script.google.com/macros/s/AKfycbw3uluNmLuFXLhgJ-90lkKPZRL_B79UTfN3zso-S4ZQ0At-me7EYYjHR8I62PNlr1luyA/exec';
    
//     // Create the payload object
//     const payload = {
//       fullName: `${formData.firstName} ${formData.lastName}`,
//       depositRefNumber: formData.traceNumber,
//       trackingNumber: formData.accountNumber,
//       transactionType: 'gca',
//       status: 'endorse',
//       email: formData.email,
//       bankName: formData.bankName,
//       amount: formData.amount,
//       notes: formData.notes
//     };

//     // Send the data to Google Sheets
//     const response = await fetch(sheetUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload),
//       mode: 'cors', // Enable CORS
//     });

//     if (!response.ok) {
//       throw new Error('Failed to submit form data to sheet');
//     }

//     const result = await response.json();
    
//     if (result.status !== 'success') {
//       throw new Error(result.message || 'Failed to submit form data');
//     }

//     return Promise.resolve();
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     return Promise.reject(error);
//   }
// };

// // Mock implementation for testing
// export const mockSubmitToGoogleForm = async (formData: FormData): Promise<void> => {
//   console.log('Form data submitted:', {
//     fullName: `${formData.firstName} ${formData.lastName}`,
//     depositRefNumber: formData.traceNumber,
//     trackingNumber: formData.accountNumber,
//     transactionType: 'gca',
//     status: 'endorse'
//   });
  
//   await new Promise(resolve => setTimeout(resolve, 1500));
//   return Promise.resolve();
// };

import { FormData } from '../types';

/**
 * Submits form data to Google Sheets via Apps Script (no CORS preflight)
 */
export const submitToGoogleForm = async (formData: FormData): Promise<void> => {
  try {
    const sheetUrl = 'https://script.google.com/macros/s/AKfycbxFcRI9P1f-6K-m5CMOmPMIq9poFtzdzK9m5JtYMBzKXBJhhdBZGDNtFJaSXx1kxd8vTw/exec';
    
    const params = new URLSearchParams();
    params.append('fullName', `${formData.firstName} ${formData.lastName}`);
    params.append('depositRefNumber', formData.referenceNumber);
    params.append('trackingNumber', formData.traceNumber);
    params.append('status', 'Endorsed');
    params.append('transactionType', 'GCA');
    params.append('email', formData.email);
    params.append('bankName', formData.bankName);
    params.append('amount', formData.amount);
    params.append('notes', formData.notes);

    const response = await fetch(sheetUrl, {
      method: 'POST',
      body: params,
    });

    if (!response.ok) {
      throw new Error('Failed to submit form data to sheet');
    }

    return Promise.resolve();
  } catch (error) {
    console.error('Error submitting form:', error);
    return Promise.reject(error);
  }
};
