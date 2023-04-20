const averageDaysInMonth = 365.25 / 12;

const setDefaultInterval = (interval, setInterval, setMultiplyer) => {
  if (interval !== 0) {
    if ((interval + 0.5) % averageDaysInMonth <= 1) {
      setInterval(Math.round(interval / averageDaysInMonth));
      setMultiplyer(averageDaysInMonth);
    } else if (interval % 7 === 0) {
      setInterval(interval / 7);
      setMultiplyer(7);
    }
  }
};

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

export { setDefaultInterval, averageDaysInMonth, zip };
