export const decodePolyline = value => {
  const values = integers(value);
  const points = [];

  for (let i = 0; i < values.length; i += 2) {
    points.push([
      (values[i + 0] += values[i - 2] || 0) / 1e5,
      (values[i + 1] += values[i - 1] || 0) / 1e5
    ]);
  }

  return points.map(t => ({
    latitude: t[0],
    longitude: t[1]
  }));
};

const sign = value => {
  return value & 1 ? ~(value >>> 1) : value >>> 1;
};

const integers = value => {
  const values = [];
  let byte = 0;
  let current = 0;
  let bits = 0;

  for (let i = 0; i < value.length; i++) {
    byte = value.charCodeAt(i) - 63;
    current = current | ((byte & 0x1f) << bits);
    bits = bits + 5;

    if (byte < 0x20) {
      values.push(sign(current));
      current = 0;
      bits = 0;
    }
  }

  return values;
};
