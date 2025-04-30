import React from 'react';

interface FormFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ name, label, value, onChange, required = false }) => {
  return (
    <div className="mb-4 group">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}:
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-200 group-hover:border-gray-400"
      />
    </div>
  );
};

export default FormField;