// Меню є немодальним: Tab рухається звичайним порядком документа.
const toggle = document.querySelector('#menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu(returnFocus = false) {
  mobileNav.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  if (returnFocus) toggle.focus();
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  mobileNav.hidden = !open;
});
mobileNav.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (!mobileNav.hidden) closeMenu(true);
  document.querySelectorAll('.resources-menu[open]').forEach((menu) => {
    menu.open = false;
    menu.querySelector('summary').focus();
  });
});
matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});
document.addEventListener('click', (event) => {
  document.querySelectorAll('.resources-menu[open]').forEach((menu) => {
    if (!menu.contains(event.target) || event.target.closest('a')) menu.open = false;
  });
});

// Розрахунок не зберігає й не передає введені суми.
const form = document.querySelector('#budget-form');
const income = form.elements.income;
const expenses = form.elements.expenses;
const rate = form.elements['saving-rate'];
const months = form.elements.months;
const number = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 });
const error = document.querySelector('#budget-error');
function updateBudget() {
  document.querySelector('#rate-value').textContent = `${rate.value} %`;
  document.querySelector('#months-value').textContent = `${months.value} міс.`;
  const invalid = [income, expenses].find(
    (input) => !input.validity.valid || !Number.isFinite(input.valueAsNumber),
  );
  [income, expenses].forEach((input) =>
    input.setAttribute('aria-invalid', String(!input.validity.valid)),
  );
  const deficit = !invalid && expenses.valueAsNumber > income.valueAsNumber;
  error.hidden = !invalid && !deficit;
  error.textContent = invalid
    ? 'Введи суми від 0 до 10 000 000 грн із кроком 100 грн.'
    : deficit
      ? 'Витрати перевищують дохід. Заощадження зараз дорівнюють нулю.'
      : '';
  const free = invalid ? 0 : Math.max(0, income.valueAsNumber - expenses.valueAsNumber);
  const monthly = (free * Number(rate.value)) / 100;
  const total = monthly * Number(months.value);
  document.querySelector('#monthly-result').textContent = number.format(monthly);
  document.querySelector('#calculation').textContent = invalid
    ? 'Виправ вхідні суми для розрахунку.'
    : `Залишок після витрат ${number.format(free)} грн × ${rate.value} %`;
  for (const [id, factor, label] of [
    ['base', 1, '100 % внеску'],
    ['conservative', 0.8, '80 % внеску'],
    ['optimistic', 1.2, '120 % внеску'],
  ]) {
    const output = document.querySelector(`#${id}-result`);
    output.replaceChildren(
      document.createTextNode(`${number.format(total * factor)} грн`),
      document.createElement('br'),
    );
    const caption = document.createElement('span');
    caption.className = 'text-xs font-normal text-muted';
    caption.textContent = label;
    output.append(caption);
  }
  const hasSavings = total > 0;
  document.querySelector('#line-base').setAttribute('d', `M44 176L620 ${hasSavings ? 46 : 176}`);
  document
    .querySelector('#line-conservative')
    .setAttribute('d', `M44 176L620 ${hasSavings ? 72 : 176}`);
  document
    .querySelector('#line-optimistic')
    .setAttribute('d', `M44 176L620 ${hasSavings ? 20 : 176}`);
  document.querySelector('#chart-desc').textContent =
    `За ${months.value} міс.: базовий — ${number.format(total)}, консервативний — ${number.format(total * 0.8)}, оптимістичний — ${number.format(total * 1.2)} гривень. Вертикальний масштаб умовний.`;
  const labels = document.querySelectorAll('.chart svg text');
  labels[1].textContent = `${Math.round(Number(months.value) / 2)} міс.`;
  labels[2].textContent = `${months.value} міс.`;
}
form.addEventListener('input', updateBudget);
form.addEventListener('submit', (event) => { event.preventDefault(); updateBudget(); });
form.addEventListener('reset', () => setTimeout(updateBudget, 0));
updateBudget();

// Демонстраційна підписка: лише локальна перевірка, мережевих запитів немає.
const newsletter = document.querySelector('#newsletter-form');
newsletter.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = newsletter.elements.email;
  const valid = email.validity.valid;
  email.setAttribute('aria-invalid', String(!valid));
  document.querySelector('#newsletter-status').textContent = valid
    ? 'Формат адреси правильний. Дані не надіслано.'
    : 'Введи коректну адресу електронної пошти.';
  if (!valid) email.focus();
});
