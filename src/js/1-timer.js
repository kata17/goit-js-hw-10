import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

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

// Функція для додавання ведучого нуля
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Функція для конвертації мілісекунд у формат днів, годин, хвилин і секунд
function convertMs(ms) {
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

// Оновлення інтерфейсу таймера
function updateTimer() {
  const currentTime = new Date();
  const timeDifference = userSelectedDate - currentTime;

  if (timeDifference <= 0) {
    clearInterval(timerInterval);
    startButton.disabled = true;
    datetimePicker.disabled = false;
    iziToast.success({
      title: 'Success',
      message: 'The timer has ended!',
    });
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeDifference);

  // Оновлюємо значення в інтерфейсі
  timerFields[0].textContent = addLeadingZero(days);
  timerFields[1].textContent = addLeadingZero(hours);
  timerFields[2].textContent = addLeadingZero(minutes);
  timerFields[3].textContent = addLeadingZero(seconds);
}

// Обробник події для кнопки Start
startButton.addEventListener('click', () => {
  startButton.disabled = true;
  datetimePicker.disabled = true; // Вимикаємо вибір дати після старту
  timerInterval = setInterval(updateTimer, 1000); // Запускаємо відлік кожну секунду
});
