// Dynamic contact API — fetches from Strapi backend & submits contact forms
// Used by ContactPage

import { FiMapPin, FiMail, FiPhone, FiClock } from 'react-icons/fi';
import React from 'react';
import { apiFetch } from './api';

// Icon mapping for contact info types
const iconMap = {
  address: <FiMapPin />,
  location: <FiMapPin />,
  email: <FiMail />,
  phone: <FiPhone />,
  hours: <FiClock />,
  'business hours': <FiClock />,
};

const getIconForLabel = (label) => {
  const key = label?.toLowerCase() || '';
  for (const [keyword, icon] of Object.entries(iconMap)) {
    if (key.includes(keyword)) return icon;
  }
  return <FiMail />;
};

// Default contact info fallback
const defaultContactInfo = [
  { id: 1, icon: <FiMapPin />, label: 'Address', value: 'Bhadrapur Road, Birtamod 57204' },
  { id: 2, icon: <FiMail />, label: 'Email', value: 'digivents@gmail.com' },
  { id: 3, icon: <FiPhone />, label: 'Phone', value: '9852623936' },
  { id: 4, icon: <FiClock />, label: 'Business Hours', value: 'Sunday - Thursday: 9am to 5pm' },
];

// Form fields configuration
const formFields = {
  nameFields: ['First Name', 'Last Name'],
  inputFields: [
    { label: 'Email', type: 'email', placeholder: 'your@email.com' },
    { label: 'Subject', type: 'text', placeholder: 'Project inquiry' },
  ],
  messageField: { label: 'Message', placeholder: 'Tell us about your project...', rows: 5 },
};

// Fetch contact info — from Global settings or fallback
export const fetchContactInfo = async () => {
  try {
    const data = await apiFetch('/global?populate=*');
    const attrs = data.data;

    // If global has contactInfo, use it
    if (attrs?.contactInfo && Array.isArray(attrs.contactInfo)) {
      return attrs.contactInfo.map((info, i) => ({
        id: i + 1,
        icon: getIconForLabel(info.label),
        label: info.label || '',
        value: info.value || '',
      }));
    }

    // Fallback to defaults
    return [...defaultContactInfo];
  } catch (error) {
    console.error('Failed to fetch contact info:', error);
    return [...defaultContactInfo];
  }
};

// Fetch form field configuration
export const fetchFormFields = async () => {
  // Form structure is static for now, but could be fetched from Strapi
  return { ...formFields };
};

// Submit contact form to Strapi
export const sendMessage = async (formData) => {
  try {
    const payload = {
      data: {
        firstName: formData['First Name'] || '',
        lastName: formData['Last Name'] || '',
        email: formData['Email'] || '',
        phone: formData['Subject'] || '', // Map subject to phone or add subject field
        message: formData['Message'] || '',
      },
    };

    await apiFetch('/contacts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return { success: true, message: 'Your message has been sent successfully!' };
  } catch (error) {
    console.error('Failed to send message:', error);
    throw new Error('Failed to send message. Please try again.');
  }
};

export { defaultContactInfo as contactInfo, formFields };
