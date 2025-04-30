
import { FormData } from '../types';

/**
 * Submits form data to Google Sheets via Apps Script (no CORS preflight)
 */
export const submitToGoogleForm = async (formData: FormData): Promise<void> => {
  try {
    const sheetUrl = 'https://script.google.com/macros/s/AKfycbyiGY3aqaGEnJJLsJROBPgi-6bT4DDORc20ddGiPiq-U1ckfXPFCCXRVPkckLK-O5RVIQ/exec';
    
    const params = new URLSearchParams();
    params.append('fullName', `${formData.firstName} ${formData.lastName}`);
    params.append('depositRefNumber', formData.referenceNumber);
    params.append('trackingNumber', formData.traceNumber);
    params.append('status', 'Endorsed');
    params.append('transactionType', 'GCA');
    params.append('email', formData.email);
    params.append('bankName', formData.bankName);
    params.append('accountNumber',formData.accountNumber);
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
