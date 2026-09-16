export const initCustomSelect = (root) => {
  const button = root.querySelector(".c-select__button");
  const listbox = root.querySelector(".c-select__listbox");
  const hiddenInput = root.querySelector("input[type=hidden]");
  const valueLabel = button.querySelector(".c-select__value");
  const options = Array.from(listbox.querySelectorAll(".c-select__option"));

  let activeIndex = options.findIndex((opt) => opt.getAttribute("aria-selected") === "true");
  if (activeIndex === -1) activeIndex = 0;

  const close = () => {
    root.dataset.open = "false";
    button.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    root.dataset.open = "true";
    button.setAttribute("aria-expanded", "true");
    setActive(activeIndex);
    listbox.focus();
  };

  const setActive = (index) => {
    activeIndex = index;
    options.forEach((opt, i) => {
      opt.dataset.active = String(i === index);
      if (i === index) {
        opt.scrollIntoView({ block: "nearest" });
        listbox.setAttribute("aria-activedescendant", opt.id);
      }
    });
  };

  const selectOption = (option) => {
    options.forEach((opt) => opt.setAttribute("aria-selected", "false"));
    option.setAttribute("aria-selected", "true");
    valueLabel.textContent = option.textContent.trim();
    valueLabel.classList.toggle("c-select__value--placeholder", option.dataset.value === "");
    hiddenInput.value = option.dataset.value;
    hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
    close();
    button.focus();
  };

  button.addEventListener("click", () => {
    if (root.dataset.open === "true") {
      close();
    } else {
      open();
    }
  });

  button.addEventListener("keydown", (event) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      open();
    }
  });

  listbox.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive(Math.min(activeIndex + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive(Math.max(activeIndex - 1, 0));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectOption(options[activeIndex]);
        break;
      case "Escape":
        event.preventDefault();
        close();
        button.focus();
        break;
      case "Tab":
        close();
        break;
    }
  });

  options.forEach((option, index) => {
    option.addEventListener("click", () => selectOption(option));
    option.addEventListener("mouseenter", () => setActive(index));
  });

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) close();
  });
};

export const initCustomSelects = (scope = document) => {
  scope.querySelectorAll("[data-select]").forEach((root) => initCustomSelect(root));
};

/**
 * Re-syncs a select's visible label and option states from its hidden
 * input's current value. Needed after a native form.reset(), which restores
 * the hidden input's default value but has no way to touch our JS-rendered
 * button label or aria-selected state.
 */
export const syncSelectDisplay = (root) => {
  const button = root.querySelector(".c-select__button");
  const listbox = root.querySelector(".c-select__listbox");
  const hiddenInput = root.querySelector("input[type=hidden]");
  const valueLabel = button.querySelector(".c-select__value");
  const options = Array.from(listbox.querySelectorAll(".c-select__option"));

  const match = options.find((opt) => opt.dataset.value === hiddenInput.value) || options[0];
  options.forEach((opt) => opt.setAttribute("aria-selected", String(opt === match)));
  valueLabel.textContent = match.textContent.trim();
  valueLabel.classList.toggle("c-select__value--placeholder", match.dataset.value === "");
};
