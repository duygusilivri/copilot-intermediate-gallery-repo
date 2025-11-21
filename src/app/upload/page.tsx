'use client';

import { useState } from "react";
import { Settings, Users, Globe } from "lucide-react";
import { UploadZone } from "@/components/upload/UploadZone";
import { SectionContainer, SectionTitle, FeatureCard, Hero } from "@/components/ui";
import { ValidationSchemas, sanitizeText, sanitizeTags } from "@/lib/sanitize";

export default function UploadPage() {
  const [formData, setFormData] = useState({
    tags: '',
    copyright: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    // Clear previous error for this field
    setErrors(prev => ({ ...prev, [field]: '' }));
    
    let sanitizedValue = value;
    
    // Apply appropriate sanitization based on field type
    switch (field) {
      case 'tags':
        // For tags, we'll sanitize when processing, not on every keystroke
        sanitizedValue = value;
        break;
      case 'copyright':
        sanitizedValue = sanitizeText(value);
        break;
      default:
        sanitizedValue = sanitizeText(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    try {
      if (formData.tags) {
        ValidationSchemas.tags.parse(formData.tags);
      }
    } catch (error) {
      newErrors.tags = 'Invalid tags format';
    }
    
    try {
      if (formData.copyright) {
        ValidationSchemas.copyrightNotice.parse(formData.copyright);
      }
    } catch (error) {
      newErrors.copyright = 'Invalid copyright notice';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form is valid, processing upload...', {
        tags: sanitizeTags(formData.tags),
        copyright: formData.copyright,
      });
    }
  };
  return (
    <div className="page-gradient">
      <Hero 
        title="Upload Your Photos"
        description="Share your photography with automatic optimization, tagging, and organization. Perfect for building your portfolio or sharing with clients."
      />
      
      <SectionContainer className="pb-0">        
        {/* Upload Zone */}
        <div className="mb-12">
          <UploadZone />
        </div>
      </SectionContainer>

      <SectionContainer bgColor="bg-slate-100 dark:bg-slate-800/50">
        <SectionTitle title="Upload Features" />
        
        {/* Upload Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <FeatureCard 
            icon={Settings}
            title="Automatic Optimization"
            description="Your photos are automatically resized and optimized for web viewing while preserving quality."
            iconColor="text-green-600"
          />

          <FeatureCard 
            icon={Users}
            title="Client Sharing"
            description="Create private galleries for client review and approval with download controls."
            iconColor="text-purple-600"
          />

          <FeatureCard 
            icon={Globe}
            title="Public Portfolio"
            description="Showcase your best work with customizable public galleries and SEO optimization."
            iconColor="text-blue-600"
          />
        </div>

        {/* Upload Settings */}
        <div className="card-base p-6">
          <SectionTitle title="Upload Settings" className="!mb-6" />
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Gallery Assignment */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Assign to Gallery
              </label>
              <select className="form-select">
                <option>Select a gallery...</option>
                <option>Wedding - Sarah & John</option>
                <option>Corporate Headshots</option>
                <option>Nature Portfolio</option>
                <option>Street Photography</option>
              </select>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Visibility
              </label>
              <select className="form-select">
                <option>Public</option>
                <option>Private</option>
                <option>Client Review</option>
                <option>Draft</option>
              </select>
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="wedding, portrait, outdoor, professional..."
                className={`form-input ${errors.tags ? 'border-red-500' : ''}`}
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                maxLength={200}
              />
              {errors.tags && (
                <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                Maximum 20 tags, each up to 50 characters
              </p>
            </div>

            {/* Copyright */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Copyright Notice
              </label>
              <input
                type="text"
                placeholder="© 2024 Your Photography Studio"
                className={`form-input ${errors.copyright ? 'border-red-500' : ''}`}
                value={formData.copyright}
                onChange={(e) => handleInputChange('copyright', e.target.value)}
                maxLength={200}
              />
              {errors.copyright && (
                <p className="text-red-500 text-sm mt-1">{errors.copyright}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button 
              onClick={handleSubmit}
              className="btn-primary flex-1 py-3"
            >
              Upload & Process
            </button>
            <button className="btn-secondary px-6 py-3">
              Save as Draft
            </button>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
