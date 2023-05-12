const toDate = (date: Date)  => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

const dateToString = (date: Date, offset = 0, showTime = false) => {
  // console.log(date);
  if (!date)
    return 'Ei vielä suoritettu';
  const now = new Date(Date.now());
  // console.log(now);
  const dMonth = (date.getFullYear() - now.getFullYear()) * 12
    + (date.getMonth() - now.getMonth())
    + (date.getDate() - now.getDate() + offset) / 30;

  if (dMonth >= 1)
    return `${Math.floor(dMonth)} kuukauden päästä`;
  if (dMonth <= -1)
    return `${Math.floor(-dMonth)} kuukautta sitten`;
  const timeString = showTime ? `klo ${date.toLocaleTimeString()}` : '';
  const dDay = (toDate(date) - toDate(now)) / (1000 * 60 * 60 * 24) + offset;
  if (dDay === 0)
    return `tänään ${timeString}`;
  if (dDay === 1)
    return `huomenna ${timeString}`;
  if (dDay === -1)
    return `eilen ${timeString}`;
  if (dDay >= 0)
    return `${dDay} päivän päästä`;
  if (dDay < 0)
    return `${-dDay} päivää sitten`;
  return 'outo juttu :|';
};

const dateToStringCompact = (date: Date, offset = 0) => {
  if (!date)
    return '???';
  const now = new Date(Date.now());
  const dateCopy = date;

  // const dY = date.getYear() - now.getYear();
  const dMonth = (dateCopy.getFullYear() - now.getFullYear()) * 12
    + (date.getMonth() - now.getMonth())
    + (date.getDate() - now.getDate() + offset) / 30;

  if (dMonth >= 1)
    return `+\u200b${Math.floor(dMonth)}\u200bkk`;
  if (dMonth <= -1)
    return `−\u200b${Math.floor(-dMonth)}\u200bkk`;

  const dDay = (toDate(new Date(date.valueOf() - toDate(now).valueOf()))).valueOf() / (1000 * 60 * 60 * 24) + offset;
  if (dDay === 0)
    return 'tänään';
  if (dDay === 1)
    return 'huomenna';
  if (dDay === -1)
    return 'eilen';
  if (dDay >= 0)
    return `+\u200b${dDay}\u200bp`;
  if (dDay < 0)
    return `−\u200b${-dDay}\u200bp`;
  return '¿¿¿';
};

export
{ dateToString, dateToStringCompact };
