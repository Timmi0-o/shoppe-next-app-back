export const generateUniqueNumber = () => {
  // Генерация случайного числа
  const randomNumber = Math.floor(Math.random() * 1e13).toString();
  // Получение текущей метки времени в миллисекундах
  const timestamp = Date.now().toString();
  // Объединение случайного числа и метки времени
  const uniqueNumber = timestamp + randomNumber;
  return uniqueNumber.slice(0, 12);
};
