const fs = require('fs');

function docDoThiTuFile(filename) {
  const duLieu = fs.readFileSync(filename, 'utf8').split('\n');
  const doThi = {};
  let batDau = null;
  let batDauTrongSo = 0;
  let ketThuc = null;
  let ketThucTrongSo = 0; 

  const phanTuDau = duLieu[0].trim().split(' ');
  if (phanTuDau.length === 4) {
    batDau = phanTuDau[0];
    batDauTrongSo = parseInt(phanTuDau[1], 10);
    ketThuc = phanTuDau[2];
    ketThucTrongSo = parseInt(phanTuDau[2], 10);
  }

  for (let i = 1; i < duLieu.length; i++) { 
    const dong = duLieu[i].trim();
    if (dong === '' || dong.startsWith('#')) continue;

    const phanTu = dong.split(' ');
    if (phanTu.length === 4) {
      const [tu, _, den, trongSo] = phanTu;
      if (!doThi[tu]) {
        doThi[tu] = [];
      }
      doThi[tu].push({ den, trongSo: parseInt(trongSo, 10) });
    }
  }

  console.log("Đồ thị:", doThi, "Bắt đầu:", batDau, "Kết thúc:", ketThuc);
  return { doThi, batDau, batDauTrongSo, ketThuc, ketThucTrongSo };
}
function hillClimbing(doThi, batDau, batDauTrongSo, ketThuc, ketThucTrongSo) {

  let L = [{ den: batDau, trongSo: batDauTrongSo }];
  let visited = new Set();
  let result = [];
  let duongDi = [];
  let TT = 1;

  while (L.length > 0) {
    let u = L.shift();
    visited.add(u.den);
    duongDi.push(`${u.den} (${u.trongSo})`);
    console.log(u.den);

    if (u.den === ketThuc) {
      result.push({
        TT: TT++,
        TTPT: `${u.den} (${u.trongSo})`,
        TTKE: `TTKT-Den dich ${ketThuc} (${ketThucTrongSo})`,
        L1: '',
        L: L.map(node => `${node.den} (${node.trongSo})`).join(', ') || 'None'
      });
      break;
    }

    const neighbors = doThi[u.den] || [];
    let L1 = [];

    for (const { den, trongSo } of neighbors) {
      if (!visited.has(den)) {
        L1.push({ den, trongSo });
      }
    }

    L1.sort((a, b) => a.trongSo - b.trongSo);

    console.log("L1", L1);
    let L1_dinh = L1.map(n => `${n.den} (${n.trongSo})`);
    console.log(L1_dinh);
    L = [...L1, ...L];

    result.push({
      TT: TT++,
      TTPT: `${u.den} (${u.trongSo})`,
      TTKE: neighbors.map(n => `${n.den} (${n.trongSo})`).join(', '),
      L1: L1_dinh.join(', ') || 'None',
      L: L.map(node => `${node.den} (${node.trongSo})`).join(', ') || 'None'
    });
  }

  if (L.length === 0 && result.length === 0) {
    result.push({
      TT: TT,
      TTPT: `${batDau} (0)`,
      TTKE: `TTKT-Khong tim thay duong di tu ${batDau} den ${ketThuc}`,
      L1: '',
      L: 'None'
    });
  }

  return { result, duongDi };
}


function ghiKetQuaRaFile(filename, result, duongDi) {
  const noiDung = [];
  noiDung.push("TT | TTPT   | TTKE                        | L1                       | L");
  noiDung.push("---------------------------------------------------------------------------------------");

  result.forEach(row => {
    noiDung.push(`${row.TT.toString().padEnd(3)}| ${row.TTPT.padEnd(7)}| ${row.TTKE.padEnd(28)}| ${row.L1.padEnd(25)}| ${row.L}`);
  });

  noiDung.push("\nĐường đi tìm được:");
  noiDung.push(duongDi.join(' -> ') || 'Không tìm thấy đường');

  fs.writeFileSync(filename, noiDung.join('\n'), 'utf8');
}

const tenFileInput = 'input.txt';
const tenFileOutput = 'output.txt';
const { doThi, batDau, batDauTrongSo, ketThuc, ketThucTrongSo } = docDoThiTuFile(tenFileInput);
const { result, duongDi } = hillClimbing(doThi, batDau, batDauTrongSo, ketThuc, ketThucTrongSo);

ghiKetQuaRaFile(tenFileOutput, result, duongDi);
