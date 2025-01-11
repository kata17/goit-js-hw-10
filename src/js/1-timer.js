import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

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

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
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
