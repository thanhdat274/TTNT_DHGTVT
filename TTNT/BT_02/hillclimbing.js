const fs = require('fs');

function docDoThiTuFile(filename) {

  const duLieu = fs.readFileSync(filename, 'utf8').split('\n');
  const doThi = {};
  const arraySave = {};
  let batDau = null;
  let batDauTrongSo = 0;
  let ketThuc = null;
  let ketThucTrongSo = 0;

  for (let i = 0; i < duLieu.length; i++) {
    const dong = duLieu[i].trim();
    if (dong === '' || dong.startsWith('#')) continue;
    console.log("Dòng: ", dong);

    const phanTu = dong.split(' ');
    console.log("Phần tử", phanTu);
    const [tu, _, den, trongSo] = phanTu;

    if (phanTu[0] === 'START') {
      batDau = phanTu[1];
      batDauTrongSo = parseInt(phanTu[2], 10);
    } else if (phanTu[0] === 'FINISH') {
      ketThuc = phanTu[1];
      ketThucTrongSo = parseInt(phanTu[2], 10);
    } else if (phanTu.length === 4) {

      if (isNaN(parseInt(_, 10))) {
        console.error(`Lỗi: Thiếu hoặc sai trọng số cho đỉnh ${tu} ở dòng ${i + 1}`);
        process.exit(1);
      }
      if (isNaN(parseInt(trongSo, 10))) {
        console.error(`Lỗi: Thiếu hoặc sai trọng số cho đỉnh ${den} ở dòng ${i + 1}`);
        process.exit(1);
      }

      if (arraySave[tu] !== undefined && arraySave[tu] !== _) {
        console.error(`Lỗi: Điểm ${tu} có trọng số: (${_}) khác so với Điểm ${tu} trước đó: (${arraySave[tu]}), dòng thứ ${i + 1}`);
        process.exit(1);
      } else if (arraySave[den] !== undefined && arraySave[den] !== trongSo) {
        console.error(`Lỗi: Điểm ${den} có trọng số: (${trongSo}) khác so với Điểm ${den} trước đó: (${arraySave[den]}), dòng thứ ${i + 1}`);
        process.exit(1);
      } else {
        arraySave[tu] = _;
        arraySave[den] = trongSo;
      }

      if (!doThi[tu]) {
        doThi[tu] = [];
      }
      doThi[tu].push({ den, trongSo: parseInt(trongSo, 10) });
    } else {
      console.error(`Lỗi: Thiếu hoặc sai trọng số ở dòng ${i + 1}`);
      process.exit(1);
    }
  }
  
  console.log("Đồ thị", doThi, "Bắt đầu", batDau, "kết thúc", ketThuc);
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
    console.log("DS L: ", L);
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
