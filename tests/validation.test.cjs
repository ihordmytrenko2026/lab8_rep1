const assert = require('node:assert/strict');
const { rules } = require('../assets/js/validation.js');
const cases = [
  ['Порожнє ім’я', 'username', '', false],
  ['Пробіли в імені', 'username', '   ', false],
  ['Один символ', 'username', 'І', false],
  ['Межа 2 символи', 'username', 'Ія', true],
  ['Ім’я з апострофом', 'username', 'Мар’яна', true],
  ['Складене ім’я', 'username', 'Анна-Марія', true],
  ['Email коректний', 'email', 'user@example.com', true],
  ['Email з плюсом', 'email', 'user+lab@domain.technology', true],
  ['Email без @', 'email', 'plainaddress', false],
  ['Email без зони', 'email', 'user@com', false],
  ['Email з пробілом', 'email', 'user name@example.com', false],
  ['Email з двома @', 'email', 'user@@example.com', false],
  ['Телефон коректний', 'phone', '+380501234567', true],
  ['Інший валідний номер', 'phone', '+380671112233', true],
  ['Локальний номер', 'phone', '0501234567', false],
  ['Лише префікс', 'phone', '+380', false],
  ['Замало цифр', 'phone', '+38050123456', false],
  ['Зайва цифра', 'phone', '+3805012345678', false],
  ['Внутрішні пробіли', 'phone', '+380 50 123 45 67', false],
  ['Дужки в номері', 'phone', '+380(50)1234567', false],
  ['Дефіс у номері', 'phone', '+38050-1234567', false],
  ['Літери в номері', 'phone', '+380abc123456', false],
  ['Пробіл на краю', 'phone', ' +380501234567', false],
  ['Порожнє повідомлення', 'message', '', false],
  ['9 символів', 'message', '123456789', false],
  ['10 символів', 'message', '1234567890', true],
  ['Пробіли в повідомленні', 'message', '          ', false],
  ['Згоди немає', 'agreement', false, false],
  ['Згода є', 'agreement', true, true],
  ['Понад 2000 символів', 'message', 'а'.repeat(2001), false],
  ['Латиниця в імені', 'username', 'Alex', true],
  ['Емоджі як один символ', 'username', '🙂', false],
  ['Довжина імені 80', 'username', 'а'.repeat(80), true],
  ['Довжина імені 81', 'username', 'а'.repeat(81), false],
  ['Цифри за правилом довжини', 'username', '12', true],
  ['HTML як звичайний текст', 'message', '<b>Відгук про симулятор</b>', true]
];
const results = cases.map(([test, field, input, expected]) => {
  const actual = rules[field](input);
  assert.equal(actual, expected, test);
  return { test, field, input: typeof input === 'string' && input.length > 40 ? `${input.length} символів` : input,
    expected, actual, result: 'PASS' };
});
console.log(JSON.stringify(results, null, 2));
