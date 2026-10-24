import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle2, Upload, Image as ImageIcon } from "lucide-react";

export type AdminField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "email" | "number" | "image";
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  accept?: string;
};

interface AdminFormProps {
  fields: AdminField[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  isModal?: boolean;
  modalTitle?: string;
}

export default function AdminForm({
  fields,
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = "Save",
  isModal = false,
  modalTitle = "Form",
}: AdminFormProps) {
  // ✅ Memoize initial data to prevent unnecessary re-renders
  const stableInitialData = useMemo(() => initialData, [JSON.stringify(initialData)]);
  
  const [formData, setFormData] = useState<Record<string, any>>(stableInitialData);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<Record<string, string>>({});
  const [imageInputMode, setImageInputMode] = useState<Record<string, "file" | "url">>({});

  // ✅ Initialize image previews from initial data
  const initialPreviews = useMemo(() => {
    const previews: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.type === "image" && stableInitialData[field.name]) {
        if (typeof stableInitialData[field.name] === "string") {
          previews[field.name] = stableInitialData[field.name];
        }
      }
    });
    return previews;
  }, [stableInitialData, fields]);

  // ✅ Only reset when stableInitialData changes
  useEffect(() => {
    console.log("🔄 Form initializing");
    setFormData(stableInitialData);
    setErrors({});
    setTouched({});
    setShowSuccess(false);
    setImagePreview(initialPreviews);
  }, [stableInitialData, initialPreviews]);

  const validateField = (field: AdminField, value: any): string => {
    if (field.type === "image") {
      if (field.required) {
        const hasFile = value instanceof File;
        const hasUrl = typeof value === "string" && value.length > 0;
        const hasInitialUrl = typeof stableInitialData[field.name] === "string" && 
                             stableInitialData[field.name].length > 0;
        
        if (!hasFile && !hasUrl && !hasInitialUrl) {
          return `${field.label} is required`;
        }
      }
      return "";
    }

    if (field.required && (!value || value.toString().trim() === "")) {
      return `${field.label} is required`;
    }

    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }

    if (field.minLength && value && value.length < field.minLength) {
      return `${field.label} must be at least ${field.minLength} characters`;
    }

    if (field.maxLength && value && value.length > field.maxLength) {
      return `${field.label} must not exceed ${field.maxLength} characters`;
    }

    if (field.min !== undefined && value && parseFloat(value) < field.min) {
      return `${field.label} must be at least ${field.min}`;
    }

    if (field.max !== undefined && value && parseFloat(value) > field.max) {
      return `${field.label} must not exceed ${field.max}`;
    }

    if (field.pattern && value) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        return `${field.label} format is invalid`;
      }
    }

    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const field = fields.find((f) => f.name === name);
      if (field) {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.target.files?.[0];
    
    if (file) {
      console.log("📁 Selected:", file.name);
      
      setFormData((prev) => ({ ...prev, [fieldName]: file }));

      const previewUrl = URL.createObjectURL(file);
      setImagePreview((prev) => ({ ...prev, [fieldName]: previewUrl }));

      const field = fields.find((f) => f.name === fieldName);
      if (field) {
        const error = validateField(field, file);
        setErrors((prev) => ({ ...prev, [fieldName]: error }));
      }
      setTouched((prev) => ({ ...prev, [fieldName]: true }));
    }
  };

  const handleBlur = (fieldName: string) => {
    setFocusedField(null);
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    const field = fields.find((f) => f.name === fieldName);
    if (field) {
      const error = validateField(field, formData[fieldName]);
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};

    fields.forEach((field) => {
      newTouched[field.name] = true;
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);

    if (Object.keys(newErrors).some((key) => newErrors[key])) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onCancel();
      }, 1500);
    } catch (error) {
      setLoading(false);
    }
  };

  const hasValue = (fieldName: string) => {
    const value = formData[fieldName];
    if (value instanceof File) return true;
    return value && value.toString().trim() !== "";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={isModal ? "modal-overlay" : ""}
      onClick={isModal ? onCancel : undefined}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className={isModal ? "modal-wrapper" : "form-wrapper"}
        onClick={(e) => isModal && e.stopPropagation()}
      >
        {isModal && (
          <div className="modal-header">
            <h2 className="modal-title">{modalTitle}</h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onCancel}
              className="modal-close"
              type="button"
            >
              <X size={20} />
            </motion.button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-fields">
            {fields.map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="form-field"
              >
                <div className="input-wrapper">
                  {field.type === "image" ? (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </span>
                        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-xs">
                          <button
                            type="button"
                            onClick={() => setImageInputMode((prev) => ({ ...prev, [field.name]: "file" }))}
                            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                              (imageInputMode[field.name] || "file") === "file"
                                ? "bg-white text-gray-900 shadow-xs"
                                : "text-gray-500 hover:text-gray-900"
                            }`}
                          >
                            Upload File
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageInputMode((prev) => ({ ...prev, [field.name]: "url" }))}
                            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                              imageInputMode[field.name] === "url"
                                ? "bg-white text-gray-900 shadow-xs"
                                : "text-gray-500 hover:text-gray-900"
                            }`}
                          >
                            Image URL
                          </button>
                        </div>
                      </div>

                      {imageInputMode[field.name] === "url" ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Paste direct image URL (https://...)"
                            value={typeof formData[field.name] === "string" ? formData[field.name] : ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData((prev) => ({ ...prev, [field.name]: val }));
                              setImagePreview((prev) => ({ ...prev, [field.name]: val }));
                              if (touched[field.name]) {
                                const err = validateField(field, val);
                                setErrors((prev) => ({ ...prev, [field.name]: err }));
                              }
                            }}
                            onBlur={() => handleBlur(field.name)}
                            className="form-input"
                          />
                          {imagePreview[field.name] && (
                            <div className="image-preview-container rounded-xl overflow-hidden border border-gray-200">
                              <img
                                src={imagePreview[field.name]}
                                alt="Preview"
                                className="image-preview"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="image-upload-wrapper">
                          <input
                            type="file"
                            id={field.name}
                            name={field.name}
                            accept={field.accept || "image/*"}
                            onChange={(e) => handleFileChange(e, field.name)}
                            className="image-input-hidden"
                          />
                          <label htmlFor={field.name} className="image-upload-label">
                            {imagePreview[field.name] ? (
                              <div className="image-preview-container">
                                <img
                                  src={imagePreview[field.name]}
                                  alt="Preview"
                                  className="image-preview"
                                />
                                <div className="image-overlay">
                                  <Upload size={24} />
                                  <span>Change Image</span>
                                </div>
                              </div>
                            ) : (
                              <div className="image-upload-placeholder">
                                <ImageIcon size={40} className="upload-icon" />
                                <p className="upload-text">{field.label}</p>
                                <p className="upload-hint">Click to choose image file</p>
                              </div>
                            )}
                          </label>
                        </div>
                      )}
                    </>
                  ) : field.type === "textarea" ? (
                    <>
                      <textarea
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={() => handleBlur(field.name)}
                        placeholder={field.placeholder || " "}
                        rows={4}
                        className={`form-textarea ${
                          focusedField === field.name ? "focused" : ""
                        } ${errors[field.name] && touched[field.name] ? "error" : ""} ${
                          hasValue(field.name) && !errors[field.name] ? "valid" : ""
                        }`}
                      />
                      <label className="floating-label">
                        {field.label}
                        {field.required && <span className="required"> *</span>}
                      </label>
                    </>
                  ) : (
                    <>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ""}
                        onChange={handleChange}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={() => handleBlur(field.name)}
                        placeholder={field.placeholder || " "}
                        min={field.min}
                        max={field.max}
                        minLength={field.minLength}
                        maxLength={field.maxLength}
                        pattern={field.pattern}
                        className={`form-input ${
                          focusedField === field.name ? "focused" : ""
                        } ${errors[field.name] && touched[field.name] ? "error" : ""} ${
                          hasValue(field.name) && !errors[field.name] ? "valid" : ""
                        }`}
                      />
                      <label className="floating-label">
                        {field.label}
                        {field.required && <span className="required"> *</span>}
                      </label>
                    </>
                  )}

                  {field.type !== "image" && (
                    <AnimatePresence>
                      {hasValue(field.name) && touched[field.name] && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="validation-icon"
                        >
                          {errors[field.name] ? (
                            <AlertCircle size={18} className="error-icon" />
                          ) : (
                            <CheckCircle2 size={18} className="success-icon" />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>

                <AnimatePresence>
                  {errors[field.name] && touched[field.name] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="error-message"
                    >
                      <AlertCircle size={14} />
                      {errors[field.name]}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="form-actions"
          >
            <motion.button
              type="button"
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </motion.button>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`submit-btn ${loading ? "loading" : ""}`}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Saving...
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle2 size={18} />
                  Saved!
                </>
              ) : (
                submitLabel
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function useAdminFormModal() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    AdminFormModal: (props: Omit<AdminFormProps, "isModal">) =>
      isOpen ? (
        <AdminForm {...props} isModal onCancel={() => setIsOpen(false)} />
      ) : null,
  };
}

/* ===================== STYLES ===================== */
const styles = `
  .form-wrapper,
  .modal-wrapper {
    border-radius: 16px;
    background: #FFFFFF; /* White cards */
    box-shadow: 0 20px 50px rgba(11, 19, 43, 0.15);
    border: 1px solid #E7E2D8; /* Subtle warm-grey borders */
    max-width: 720px;
    margin: 0 auto;
    color: #334155; /* Slate main text */
  }

  .modal-wrapper {
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(11, 19, 43, 0.6); /* Midnight navy overlay */
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 22px 28px 16px;
    border-bottom: 1px solid #E7E2D8; /* Subtle warm-grey borders */
  }

  .modal-title {
    font-size: 20px;
    font-weight: 700;
    color: #0B132B; /* Navy headings */
    margin: 0;
  }

  .modal-close {
    background: #FAF8F5;
    border: 1.5px solid #E7E2D8;
    border-radius: 10px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748B; /* Muted slate */
    transition: all 0.2s ease;
  }

  .modal-close:hover {
    background: #FFFFFF;
    border-color: #C59B27;
    color: #0B132B;
    box-shadow: 0 2px 8px rgba(197, 155, 39, 0.15);
  }

  .admin-form {
    padding: 28px;
  }

  .form-fields {
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .input-wrapper {
    position: relative;
  }

  .form-input,
  .form-textarea {
    width: 100%;
    padding: 15px 40px 15px 16px;
    border-radius: 12px;
    border: 1.5px solid #E7E2D8; /* Warm grey */
    background: #FAF8F5; /* Ivory background */
    outline: none;
    font-size: 14.5px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    color: #334155; /* Slate main text */
    font-family: inherit;
  }

  .form-textarea {
    resize: vertical;
    min-height: 100px;
  }

  .form-input::placeholder,
  .form-textarea::placeholder {
    color: transparent;
  }

  .form-input:focus,
  .form-textarea:focus {
    border-color: #C59B27; /* Gold active/focus outline */
    background: #FFFFFF;
    box-shadow: 0 0 0 3px rgba(197, 155, 39, 0.18);
  }

  .form-input.error,
  .form-textarea.error {
    border-color: #B42318; /* Error Red */
    background: rgba(180, 35, 24, 0.04);
  }

  .form-input.error:focus,
  .form-textarea.error:focus {
    box-shadow: 0 0 0 3px rgba(180, 35, 24, 0.18);
  }

  .form-input.valid,
  .form-textarea.valid {
    border-color: #16845B; /* Success Green */
  }

  .image-upload-wrapper {
    width: 100%;
  }

  .image-input-hidden {
    display: none;
  }

  .image-upload-label {
    display: block;
    cursor: pointer;
    border-radius: 12px;
    overflow: hidden;
    border: 2px dashed #E7E2D8; /* Warm grey border */
    background: #FAF8F5; /* Ivory background */
    transition: all 0.2s ease;
  }

  .image-upload-label:hover {
    border-color: #C59B27; /* Gold */
    background: #FFFFFF;
    box-shadow: 0 4px 14px rgba(197, 155, 39, 0.15);
  }

  .image-upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 36px 20px;
    text-align: center;
  }

  .upload-icon {
    color: #C59B27; /* Gold icon */
    margin-bottom: 12px;
  }

  .upload-text {
    font-size: 15px;
    font-weight: 600;
    color: #0B132B; /* Navy headings */
    margin: 0 0 4px 0;
  }

  .upload-hint {
    font-size: 13px;
    color: #64748B; /* Muted slate */
    margin: 0;
  }

  .image-preview-container {
    position: relative;
    width: 100%;
    height: 250px;
  }

  .image-preview {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #FAF8F5;
  }

  .image-overlay {
    position: absolute;
    inset: 0;
    background: rgba(11, 19, 43, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.2s ease;
    color: white;
    font-weight: 600;
  }

  .image-upload-label:hover .image-overlay {
    opacity: 1;
  }

  .field-label {
    font-size: 13.5px;
    font-weight: 500;
    color: #334155; /* Slate main text */
    margin-top: 8px;
  }

  .floating-label {
    position: absolute;
    left: 16px;
    top: 15px;
    font-size: 14px;
    font-weight: 500;
    color: #64748B; /* Muted slate secondary text */
    pointer-events: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    background: transparent;
    padding: 0 4px;
  }

  .form-input:focus ~ .floating-label,
  .form-input:not(:placeholder-shown) ~ .floating-label,
  .form-textarea:focus ~ .floating-label,
  .form-textarea:not(:placeholder-shown) ~ .floating-label {
    top: -10px;
    left: 12px;
    font-size: 12px;
    font-weight: 600;
    color: #C59B27; /* Gold active label */
    background: #FFFFFF;
  }

  .form-input.error ~ .floating-label,
  .form-textarea.error ~ .floating-label {
    color: #B42318; /* Error Red */
  }

  .form-input.valid ~ .floating-label,
  .form-textarea.valid ~ .floating-label {
    color: #16845B; /* Success Green */
  }

  .required {
    color: #B42318; /* Red */
    font-weight: 700;
  }

  .validation-icon {
    position: absolute;
    right: 14px;
    top: 15px;
    pointer-events: none;
  }

  .error-icon {
    color: #B42318; /* Error Red */
  }

  .success-icon {
    color: #16845B; /* Success Green */
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12.5px;
    color: #B42318; /* Red */
    font-weight: 500;
    padding: 6px 10px;
    background: rgba(180, 35, 24, 0.08);
    border-radius: 8px;
    border: 1px solid rgba(180, 35, 24, 0.2);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 26px;
    padding-top: 20px;
    border-top: 1px solid #E7E2D8; /* Warm grey divider */
  }

  /* Secondary action button: White button with navy text and gold outline */
  .cancel-btn {
    padding: 10px 24px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #FFFFFF; /* White */
    color: #0B132B; /* Navy text */
    border: 1.5px solid #C59B27; /* Gold outline */
  }

  .cancel-btn:hover:not(:disabled) {
    background: #FAF8F5; /* Ivory hover */
    border-color: #B58C1F;
    box-shadow: 0 2px 8px rgba(197, 155, 39, 0.15);
  }

  .cancel-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Primary button: Gold primary button with navy text */
  .submit-btn {
    padding: 10px 26px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;
    background: #C59B27; /* Gold primary */
    color: #0B132B; /* Navy text */
    box-shadow: 0 4px 14px rgba(197, 155, 39, 0.25);
    min-width: 120px;
  }

  .submit-btn:hover:not(.loading) {
    background: #B58C1F;
    box-shadow: 0 6px 18px rgba(197, 155, 39, 0.35);
    transform: translateY(-1px);
  }

  .submit-btn.loading {
    opacity: 0.8;
    cursor: not-allowed;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(11, 19, 43, 0.3);
    border-top-color: #0B132B; /* Navy spinner */
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 640px) {
    .modal-wrapper,
    .form-wrapper {
      border-radius: 14px;
      max-width: 100%;
    }

    .admin-form {
      padding: 18px;
    }

    .modal-header {
      padding: 18px 18px 12px;
    }

    .modal-title {
      font-size: 18px;
    }

    .form-actions {
      flex-direction: column-reverse;
    }

    .cancel-btn,
    .submit-btn {
      width: 100%;
    }

    .image-preview-container {
      height: 200px;
    }
  }
`;

if (typeof document !== 'undefined') {
  const styleId = 'admin-form-styles';
  if (!document.getElementById(styleId)) {
    const styleTag = document.createElement('style');
    styleTag.id = styleId;
    styleTag.textContent = styles;
    document.head.appendChild(styleTag);
  }
}