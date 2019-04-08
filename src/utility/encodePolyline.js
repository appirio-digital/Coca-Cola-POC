export const encodePolyline = value => {
  const values = flatten(points);
  let px = 0;
  let py = 0;
  let str = '';

  for (let i = 0; i < values.length; i += 2) {
    str += chars(sign(values[i] - px));
    str += chars(sign(values[i + 1] - py));
    px = values[i];
    py = values[i + 1];
  }

  return str;
};

const flatten = points => {
  const values = [];
  let point;

  for (let i = 0; i < points.length; i++) {
    point = points[i];
    values.push(
      point.lat || point.x || point[0],
      point.lng || point.y || point[1]
    );
  }

  return values;
};

const sign = value => {
  value = Math.round(value * 1e5);
  return value < 0 ? ~(value << 1) : value << 1;
};

const chars = value => {
  let str = '';
  while (value >= 0x20) {
    str += String.fromCharCode(((value & 0x1f) | 0x20) + 63);
    value = value >> 5;
  }
  str += String.fromCharCode(value + 63);
  return str;
};
