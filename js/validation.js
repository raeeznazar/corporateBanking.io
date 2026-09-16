/**
 * Small, dependency-free field validators and error-state helpers.
 */

export const isRequired = (value) => value.trim().length > 0;

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value.trim());

/**
 * Applies the error visual state
 */
export const setFieldError = (fieldWrapper, message) => {
  const errorEl = fieldWrapper.querySelector("[data-error-message]");
  const control = fieldWrapper.querySelector("input, .c-select__button");

  fieldWrapper.classList.add("c-form-field--error");
  if (errorEl) errorEl.textContent = message;
  if (control) control.setAttribute("aria-invalid", "true");
};

export const clearFieldError = (fieldWrapper) => {
  const control = fieldWrapper.querySelector("input, .c-select__button");
  fieldWrapper.classList.remove("c-form-field--error");
  if (control) control.removeAttribute("aria-invalid");
};
