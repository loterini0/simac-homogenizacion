

function parseDateTime(fecha, hora) {
  const [day, month, year] = fecha.split("/");
  const [hours, minutes, seconds] = hora.split(":");
  return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
}

function isND(value) {
  return value === null || value === undefined || value === "ND";
}

function linearInterpolate(t, t1, t2, v1, v2) {
  return v1 + ((t - t1) / (t2 - t1)) * (v2 - v1);
}


function homogenize(records) {
  const MS_5MIN   = 5 * 60 * 1000;
  const MS_2_5MIN = 2.5 * 60 * 1000;


  const parsed = records.map(r => ({
    ...r,
    ts: parseDateTime(r.fecha, r.hora)
  }));


  const minTs = Math.min(...parsed.map(r => r.ts));
  const maxTs = Math.max(...parsed.map(r => r.ts));

  const startTs = Math.floor(minTs / MS_5MIN) * MS_5MIN;
  const endTs   = Math.floor(maxTs / MS_5MIN) * MS_5MIN;


  const targets = [];
  for (let ts = startTs; ts <= endTs; ts += MS_5MIN) {
    targets.push(ts);
  }


  const numericFields   = ["temp", "vel_viento", "dir_viento", "presion", "humedad", "ppt_cincom", "rad_solar", "evt_cincom"];
  const categoricFields = ["dir_rosa"];


  return targets.map(t => {
    const fecha = formatDate(t);
    const hora  = formatTime(t);

    const prevRecords = parsed.filter(r => r.ts <= t && t - r.ts <= MS_5MIN);
    const prev = prevRecords.length > 0
      ? prevRecords.reduce((a, b) => (t - a.ts < t - b.ts ? a : b))
      : null;


    const nextRecords = parsed.filter(r => r.ts > t && r.ts - t <= MS_5MIN);
    const next = nextRecords.length > 0
      ? nextRecords.reduce((a, b) => (a.ts - t < b.ts - t ? a : b))
      : null;

    const diffPrev = prev ? t - prev.ts : Infinity;
    const diffNext = next ? next.ts - t : Infinity;

    const result = { fecha, hora };


    for (const field of numericFields) {
      const prevVal = prev && !isND(prev[field]) ? prev[field] : null;
      const nextVal = next && !isND(next[field]) ? next[field] : null;

      if (prevVal !== null && nextVal !== null) {

        result[field] = parseFloat(
          linearInterpolate(t, prev.ts, next.ts, prevVal, nextVal).toFixed(2)
        );
      } else if (prevVal !== null && diffPrev <= MS_2_5MIN) {
        
        result[field] = prevVal;
      } else if (nextVal !== null && diffNext <= MS_2_5MIN) {

        result[field] = nextVal;
      } else {
        result[field] = "ND";
      }
    }


    for (const field of categoricFields) {
      if (prev && next) {
        result[field] = diffPrev <= diffNext ? prev[field] : next[field];
      } else if (prev && !isND(prev[field])) {
        result[field] = diffPrev <= MS_2_5MIN ? prev[field] : "ND";
      } else if (next && !isND(next[field])) {
        result[field] = diffNext <= MS_2_5MIN ? next[field] : "ND";
      } else {
        result[field] = "ND";
      }
    }

    return result;
  });
}



function formatDate(ts) {
  const d = new Date(ts);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function formatTime(ts) {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

module.exports = { parseDateTime, isND, linearInterpolate, homogenize };