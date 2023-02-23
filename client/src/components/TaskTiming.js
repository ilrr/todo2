class Timespan {
  constructor(value, muliplier) {
    this.value = value;
    this.muliplier = muliplier;
  }

  finnishMultipliers = { m: 'kk', w: 'vko', d: '' };

  toString() {
    if (this.muliplier === 'e') return '?';
    return `${this.value}${this.finnishMultipliers[this.muliplier]}`;
  }
}

const TaskTiming = ({
  freq, bFlex, aFlex, lastTD,
}) => {
  const wStyle = w => ({ flexGrow: w, display: w ? 'block' : 'none' });
  const sStyle = c => ({ backgroundColor: c, height: '5px' });

  const lastTime = new Date(lastTD).getTime();

  const a = Date.now() - (lastTime + (freq + aFlex) * 1000 * 60 * 60 * 24);
  const overtimeStyle = a > 0 && lastTD ? { flexGrow: Math.floor(a / (1000 * 60 * 60 * 24)) } : {};

  const toDate = date => Date.UTC(date.getYear(), date.getMonth(), date.getDate());
  const dateDiff = dDiff => {
    if (!lastTD) return new Timespan(0, 'e');
    const now = new Date(Date.now());
    const nDate = new Date(lastTime + 1000 * 60 * 60 * 24 * dDiff);

    const dMonth = (nDate.getYear() - now.getYear()) * 12
      + (nDate.getMonth() - now.getMonth())
      + (nDate.getDate() - now.getDate()) / 30;

    if (Math.abs(dMonth) >= 1) return new Timespan(Math.floor(dMonth), 'm');

    const dDay = (toDate(nDate) - toDate(now)) / (1000 * 60 * 60 * 24);
    if (dDay >= 14) return new Timespan(Math.floor(dDay / 7), 'w');
    return new Timespan(dDay, 'd');
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={wStyle(freq - bFlex)}>
        <div>&nbsp;</div>
        <div style={sStyle('#0000ff')}></div>
      </div>
      <div style={wStyle(bFlex)}>
        <div>{dateDiff(freq - bFlex).toString() }</div>
        <div style={sStyle('#00ff00')}></div>
      </div>
      <div style={wStyle(1)}>
        <div style={{ textAlign: 'center' }}>{dateDiff(freq).toString()}</div>
        <div style={sStyle('#ffff00')}></div>
      </div>
      <div style={wStyle(aFlex)}>
        <div>&nbsp;</div>
        <div style={sStyle('#ffaa00')}></div>
      </div>
      <div style={overtimeStyle}>
        <div>{dateDiff(freq + aFlex).toString()}</div>
        <div style={sStyle('#ff0000')}></div>
      </div>
    </div>
  );
};

export default TaskTiming;
