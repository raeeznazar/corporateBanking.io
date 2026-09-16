import { isRequired, isValidEmail, clearFieldError } from "./validation.js";

const getRows = (container) => Array.from(container.querySelectorAll("[data-signatory]"));

const relabelRow = (row, index) => {
  row.dataset.index = String(index);
  row.querySelector(".c-signatory__title").textContent = `Authorised signatory ${index}`;
  row.querySelector("[data-remove-signatory]").setAttribute("aria-label", `Remove authorised signatory ${index}`);

  row.querySelectorAll("[data-field]").forEach((field) => {
    const id = `signatory-${index}-${field.dataset.field}`;
    field.querySelector("input").id = id;
    field.querySelector("input").name = id;
    field.querySelector("label").setAttribute("for", id);
  });
};

const isRowComplete = (row) => {
  const fullName = row.querySelector('[data-field="fullName"] input').value;
  const role = row.querySelector('[data-field="role"] input').value;
  const email = row.querySelector('[data-field="email"] input').value;
  return isRequired(fullName) && isRequired(role) && isValidEmail(email);
};

const updateCounter = (container, counter) => {
  const rows = getRows(container);
  const complete = rows.filter(isRowComplete).length;
  counter.textContent = `${complete} of ${rows.length} signatories complete`;
};

const renumberAll = (container, counter) => {
  const rows = getRows(container);
  rows.forEach((row, i) => relabelRow(row, i + 1));
  rows.forEach((row) => {
    row.querySelector("[data-remove-signatory]").hidden = rows.length <= 1;
  });
  updateCounter(container, counter);
};

const clearRowState = (row) => {
  row.querySelectorAll("input").forEach((input) => {
    input.value = "";
    input.removeAttribute("aria-invalid");
  });
  row.querySelectorAll(".c-form-field").forEach((field) => field.classList.remove("c-form-field--error"));
  row.querySelectorAll("[data-error-message]").forEach((el) => {
    el.textContent = "";
  });
};

const wireRow = (row, container, counter) => {
  row.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      clearFieldError(input.closest(".c-form-field"));
      updateCounter(container, counter);
    });
  });
  row.querySelector("[data-remove-signatory]").addEventListener("click", () => {
    row.remove();
    renumberAll(container, counter);
  });
};

export const initSignatories = (form) => {
  const container = form.querySelector("#signatories");
  const addButton = form.querySelector("#add-signatory");
  const counter = form.querySelector("#signatory-counter");
  if (!container || !addButton || !counter) return;

  getRows(container).forEach((row) => wireRow(row, container, counter));
  renumberAll(container, counter);

  addButton.addEventListener("click", () => {
    const clone = getRows(container)[0].cloneNode(true);
    clearRowState(clone);
    container.appendChild(clone);
    wireRow(clone, container, counter);
    renumberAll(container, counter);
    clone.querySelector("input").focus();
  });
};

export const resetSignatories = (form) => {
  const container = form.querySelector("#signatories");
  const counter = form.querySelector("#signatory-counter");
  if (!container || !counter) return;

  getRows(container)
    .slice(1)
    .forEach((row) => row.remove());
  clearRowState(getRows(container)[0]);
  renumberAll(container, counter);
};
