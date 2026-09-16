const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const parseAmount = (value) => Number(String(value).replace(/[^0-9.]/g, "")) || 0;

/**
 * Reformats the loan amount input with thousand separators as the visitor
 * types (Corporate banking business form shows "2,400,000"), preserving
 * cursor position by distance from the end of the string.
 */
const reformatLoanAmount = (input) => {
  const cursorFromEnd = input.value.length - (input.selectionEnd ?? input.value.length);
  const digits = input.value.replace(/[^0-9]/g, "");
  input.value = digits ? Number(digits).toLocaleString("en-GB") : "";
  const newPos = Math.max(input.value.length - cursorFromEnd, 0);
  input.setSelectionRange(newPos, newPos);
};

const calculateMonthlyRepayment = (principal, annualRatePercent, termMonths) => {
  if (termMonths <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
};

export const initLoanCalculator = (form) => {
  const loanAmountInput = form.querySelector("#loanAmount");
  const interestRateInput = form.querySelector("#interestRate");
  const termInput = form.querySelector("#term-value");
  const monthlyEl = form.querySelector("#calc-monthly");
  const totalRepayableEl = form.querySelector("#calc-total-repayable");
  const totalInterestEl = form.querySelector("#calc-total-interest");
  const termDisplayEl = form.querySelector("#calc-term-display");
  if (!loanAmountInput || !interestRateInput || !termInput) return;

  const update = () => {
    const principal = Math.max(parseAmount(loanAmountInput.value), 0);
    const rate = Math.min(Math.max(Number(interestRateInput.value) || 0, 0), 100);
    const term = Number(termInput.value) || 0;

    const monthly = calculateMonthlyRepayment(principal, rate, term);
    const totalRepayable = monthly * term;
    const totalInterest = Math.max(totalRepayable - principal, 0);

    monthlyEl.textContent = currencyFormatter.format(monthly);
    totalRepayableEl.textContent = currencyFormatter.format(totalRepayable);
    totalInterestEl.textContent = currencyFormatter.format(totalInterest);
    termDisplayEl.textContent = `${term} months`;
  };

  loanAmountInput.addEventListener("input", () => {
    reformatLoanAmount(loanAmountInput);
    update();
  });
  interestRateInput.addEventListener("input", update);
  termInput.addEventListener("change", update);

  reformatLoanAmount(loanAmountInput);
  update();
};
