import { isRequired, isValidEmail, setFieldError, clearFieldError } from "./validation.js";
import { syncSelectDisplay } from "./components/select.js";
import { initSignatories, resetSignatories } from "./signatories.js";
import { initLoanCalculator } from "./loan-calculator.js";

/**
 * Builds the list of {id, message} validation errors for the enquiry form.
 * `id` is always an input's element id, so the error summary can link to it
 * and applyErrors() can find its wrapper via `.closest(".c-form-field")`.
 */
const validateEnquiry = (form) => {
  const errors = [];

  const businessName = form.querySelector("#businessName").value;
  if (!isRequired(businessName)) {
    errors.push({ id: "businessName", message: "Enter your business name." });
  }

  const businessType = form.querySelector("#businessType-value").value;
  if (!isRequired(businessType)) {
    errors.push({ id: "businessType-button", message: "Select how the business is structured." });
  }

  const loanAmountInput = form.querySelector("#loanAmount");
  const loanAmount = Number(loanAmountInput.value.replace(/[^0-9.]/g, ""));
  if (!isRequired(loanAmountInput.value) || Number.isNaN(loanAmount) || loanAmount < 25000 || loanAmount > 10000000) {
    errors.push({ id: "loanAmount", message: "Enter a loan amount between £25,000 and £10,000,000." });
  }

  const interestRateInput = form.querySelector("#interestRate");
  const interestRate = Number(interestRateInput.value);
  if (!isRequired(interestRateInput.value) || Number.isNaN(interestRate) || interestRate < 0 || interestRate > 25) {
    errors.push({ id: "interestRate", message: "Enter an interest rate between 0% and 25%." });
  }

  form.querySelectorAll("[data-signatory]").forEach((row) => {
    const fullNameInput = row.querySelector('[data-field="fullName"] input');
    const roleInput = row.querySelector('[data-field="role"] input');
    const emailInput = row.querySelector('[data-field="email"] input');

    if (!isRequired(fullNameInput.value)) {
      errors.push({ id: fullNameInput.id, message: "Enter the signatory's full name." });
    }
    if (!isRequired(roleInput.value)) {
      errors.push({ id: roleInput.id, message: "Enter the signatory's role." });
    }
    if (!isRequired(emailInput.value)) {
      errors.push({ id: emailInput.id, message: "Enter the signatory's email address." });
    } else if (!isValidEmail(emailInput.value)) {
      errors.push({ id: emailInput.id, message: "Enter a valid email address." });
    }
  });

  return errors;
};

const clearAllErrors = (form) => {
  form.querySelectorAll(".c-form-field").forEach((wrapper) => clearFieldError(wrapper));
};

const applyErrors = (form, errors) => {
  errors.forEach(({ id, message }) => {
    const input = document.getElementById(id);
    const wrapper = input && input.closest(".c-form-field");
    if (wrapper) setFieldError(wrapper, message);
  });
};

const renderErrorSummary = (summary, list, errors) => {
  list.innerHTML = "";
  errors.forEach(({ id, message }) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = message;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const target = document.getElementById(id);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
    li.appendChild(link);
    list.appendChild(li);
  });
  summary.hidden = errors.length === 0;
};

const generateReference = () => {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `NB-${digits}`;
};

const resetCalculatorInputs = (form) => {
  ["loanAmount", "interestRate"].forEach((id) => {
    form.querySelector(`#${id}`).dispatchEvent(new Event("input", { bubbles: true }));
  });
  form.querySelector("#term-value").dispatchEvent(new Event("change", { bubbles: true }));
};

export const initEnquiryForm = () => {
  const form = document.getElementById("enquiry-form");
  const summary = document.getElementById("error-summary");
  const summaryList = document.getElementById("error-summary-list");
  const successPanel = document.getElementById("success-panel");
  if (!form) return;

  initSignatories(form);
  initLoanCalculator(form);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearAllErrors(form);

    const errors = validateEnquiry(form);
    renderErrorSummary(summary, summaryList, errors);

    if (errors.length > 0) {
      applyErrors(form, errors);
      summary.focus();
      return;
    }

    form.hidden = true;
    successPanel.hidden = false;
    successPanel.querySelector("#success-ref").textContent = `Reference ${generateReference()}`;
    successPanel.focus();
  });

  // Clear a field's error state as soon as the visitor fixes it.
  form.querySelectorAll("#businessName, #loanAmount, #interestRate").forEach((input) => {
    input.addEventListener("input", () => clearFieldError(input.closest(".c-form-field")));
  });
  form.querySelector("#businessType-value").addEventListener("change", () => {
    clearFieldError(form.querySelector("#field-business-type"));
  });

  form.querySelector("#reset-form").addEventListener("click", () => {
    form.reset();
    // form.reset() only restores inputs whose HTML `value` attribute set their
    // default — the custom selects' hidden inputs are set via the `.value`
    // property at runtime, so their defaults are restored explicitly here.
    form.querySelector("#businessType-value").value = "";
    form.querySelector("#term-value").value = "60";
    syncSelectDisplay(document.getElementById("businessType"));
    syncSelectDisplay(document.getElementById("term"));
    clearAllErrors(form);
    summary.hidden = true;
    resetSignatories(form);
    resetCalculatorInputs(form);
  });
};
