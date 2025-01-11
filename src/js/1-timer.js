import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Оголошуємо змінні для елементів DOM

const btnStart = document.querySelector('button[data-start]');
const input = document.querySelector('#datetime-picker');
const day = document.querySelector('span[data-days]');
const hour = document.querySelector('span[data-hours]');
const minute = document.querySelector('span[data-minutes]');
const second = document.querySelector('span[data-seconds]');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (options.defaultDate >= selectedDates[0]) {
      btnStart.disabled = true;

      iziToast.error({
        message: 'Please choose a date in the future',
      });
    } else {
      btnStart.disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
const addLeadingZero = value => value.toString().padStart(2, '0');

btnStart.addEventListener('click', startTimer);

function startTimer() {
  btnStart.disabled = true;
  input.disabled = true;

  const timer = setInterval(() => {
    const currentDate = new Date();
    const targetDate = new Date(input.value);
    const timeDiff = targetDate - currentDate;

    const { days, hours, minutes, seconds } = convertMs(timeDiff);

    day.textContent = addLeadingZero(days);
    hour.textContent = addLeadingZero(hours);
    minute.textContent = addLeadingZero(minutes);
    second.textContent = addLeadingZero(seconds);

    const isTimerFinished = [days, hours, minutes, seconds].every(
      value => value === 0
    );

    if (isTimerFinished) {
      clearInterval(timer);
      input.disabled = false;
    }
  }, 1000);
}

// Оголошуємо змінні для елементів DOM
const datetimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('#start-btn');
const timerFields = document.querySelectorAll('.field .value');

let userSelectedDate = null;
let timerInterval = null;

// Ініціалізація flatpickr
flatpickr(datetimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate < new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      startButton.disabled = true; // Кнопка неактивна, якщо дата в минулому
    } else {
      startButton.disabled = false; // Кнопка активується, якщо дата в майбутньому
    }
  },
});
