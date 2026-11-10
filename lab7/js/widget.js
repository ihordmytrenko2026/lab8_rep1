// Офіційні дані отримуються без ключа; персональні дані не передаються.
const status = document.querySelector('#rate-status');
const button = document.querySelector('#refresh');
async function loadRates() {
  button.disabled = true;
  status.textContent = 'Завантажуємо офіційні дані…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json', {signal:controller.signal,credentials:'omit'});
    if (!response.ok) throw new Error('Rate service unavailable');
    const data = await response.json();
    const usd = data.find((item) => item.cc === 'USD');
    const eur = data.find((item) => item.cc === 'EUR');
    if (!usd || !eur || !Number.isFinite(usd.rate) || !Number.isFinite(eur.rate)) throw new Error('Incomplete rate data');
    const formatter = new Intl.NumberFormat('uk-UA',{minimumFractionDigits:4,maximumFractionDigits:4});
    document.querySelector('#usd').textContent = `${formatter.format(usd.rate)} грн`;
    document.querySelector('#eur').textContent = `${formatter.format(eur.rate)} грн`;
    document.querySelector('#rates').hidden = false;
    status.textContent = `Дата курсу: ${usd.exchangedate}${usd.exchangedate !== eur.exchangedate ? ` (EUR: ${eur.exchangedate})` : ''}`;
  } catch {
    document.querySelector('#rates').hidden = true;
    status.textContent = 'НБУ зараз недоступний. Спробуй оновити або відкрий джерело нижче.';
  } finally {
    clearTimeout(timeout);
    button.disabled = false;
  }
}
button.addEventListener('click',loadRates);
loadRates();
