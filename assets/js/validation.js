/* ЛР9. Клієнтська перевірка без збереження або мережевого надсилання. */
(function () {
  'use strict';

  const REGEX_PHONE = /^\+380\d{9}$/;
  const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const characterCount = value => Array.from(value.trim()).length;
  const rules = {
    username: value => characterCount(value) >= 2 && characterCount(value) <= 80,
    email: value => value.length <= 254 && REGEX_EMAIL.test(value.trim()),
    // Телефон перевіряємо без trim: пробіли заборонені навіть на краях.
    phone: value => REGEX_PHONE.test(value),
    message: value => characterCount(value) >= 10 && characterCount(value) <= 2000,
    agreement: value => value === true
  };

  // Обмеження RegEx email: навчальна ASCII-маска, не перевірка існування пошти.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { REGEX_PHONE, REGEX_EMAIL, rules };
  }
  if (typeof document === 'undefined') return;
  const form = document.getElementById('feedbackForm');
  if (!form) return;
  const modal = document.getElementById('successModal');
  const submit = document.getElementById('feedbackSubmit');
  const status = document.getElementById('feedbackStatus');
  const ids = ['username', 'email', 'phone', 'message', 'agreement'];
  const touched = new Set();
  const messages = {
    username: 'Введіть ім’я від 2 до 80 символів.',
    email: 'Введіть коректну пошту, наприклад user@example.com.',
    phone: 'Введіть +380 і рівно 9 цифр без пробілів, дужок чи літер.',
    message: 'Введіть повідомлення від 10 до 2000 символів.',
    agreement: 'Підтвердьте згоду з політикою конфіденційності.'
  };

  function showError(field, error, message) {
    field.dataset.state = 'error';
    field.setAttribute('aria-invalid', 'true');
    error.textContent = message;
    error.hidden = false;
  }

  function showSuccess(field, error) {
    field.dataset.state = 'success';
    field.setAttribute('aria-invalid', 'false');
    error.hidden = true;
    error.textContent = '';
  }

  function clearError(field) {
    delete field.dataset.state;
    field.removeAttribute('aria-invalid');
    const error = document.getElementById(field.id + 'Error');
    error.hidden = true;
    error.textContent = '';
  }

  function validateField(id) {
    const field = document.getElementById(id);
    const error = document.getElementById(id + 'Error');
    const value = id === 'agreement' ? field.checked : field.value;
    const valid = rules[id](value);
    if (valid) showSuccess(field, error);
    else showError(field, error, messages[id]);
    return valid;
  }
  function validateName() { return validateField('username'); }
  function validateEmail() { return validateField('email'); }
  function validatePhone() { return validateField('phone'); }
  function validateMessage() { return validateField('message'); }
  function validateAgreement() { return validateField('agreement'); }
  const validators = [validateName, validateEmail, validatePhone, validateMessage, validateAgreement];

  ids.forEach(id => {
    const field = document.getElementById(id);
    field.addEventListener('blur', () => { touched.add(id); validateField(id); });
    field.addEventListener(id === 'agreement' ? 'change' : 'input', () => {
      // Не показуємо помилку до першого blur; виправлення вже видимої помилки миттєве.
      const value = id === 'agreement' ? field.checked : field.value;
      if (touched.has(id) || rules[id](value)) validateField(id);
      else clearError(field);
      status.textContent = '';
    });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    ids.forEach(id => touched.add(id));
    // map викликає всі перевірки: коротке замикання не приховає частину помилок.
    const results = validators.map(validate => validate());
    const firstInvalid = results.indexOf(false);
    if (firstInvalid !== -1) {
      status.textContent = 'Перевірте позначені поля. Дані не надіслано.';
      document.getElementById(ids[firstInvalid]).focus();
      return;
    }
    form.reset();
    touched.clear();
    ids.forEach(id => clearError(document.getElementById(id)));
    status.textContent = '';
    modal.showModal(); // Нативні inert-фон, focus trap та Escape.
    document.body.classList.add('feedback-modal-open');
  });

  const closeButton = document.getElementById('closeModalBtn');
  closeButton.addEventListener('click', () => modal.close());
  modal.addEventListener('keydown', event => {
    // Єдина фокусована дія в цьому діалозі: Tab і Shift+Tab залишаються на ній.
    if (event.key === 'Tab') {
      event.preventDefault();
      closeButton.focus();
    }
  });
  modal.addEventListener('click', event => {
    if (event.target !== modal) return;
    const rect = modal.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) modal.close();
  });
  modal.addEventListener('close', () => {
    document.body.classList.remove('feedback-modal-open');
    submit.focus();
  });

  document.querySelector('.privacy-link').addEventListener('click', () => {
    document.getElementById('privacy').open = true;
  });
})();
