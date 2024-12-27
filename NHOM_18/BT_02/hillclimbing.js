const fs = require('fs');

// Hàm đọc dữ liệu từ file và xử lý đầu vào
function docDoThiTuFile(filename) {
  // Đọc dữ liệu từ file và tách từng dòng thành mảng
  const duLieu = fs.readFileSync(filename, 'utf8').split('\n');
  console.log(duLieu);
  const arraySave = {}; // Lưu trọng số của các đỉnh
  const doThi = {}; // Đối tượng lưu đồ thị
  let batDau = null; // Đỉnh bắt đầu
  let batDauTrongSo = 0; // Trọng số của đỉnh bắt đầu
  let ketThuc = null; // Đỉnh kết thúc
  let ketThucTrongSo = 0; // Trọng số của đỉnh kết thúc

  // Đọc từng dòng của tệp
  for (let i = 0; i < duLieu.length; i++) {
    const dong = duLieu[i].trim(); // Loại bỏ khoảng trắng thừa ở đầu và cuối dòng
    if (dong === '' || dong.startsWith('#')) continue; // Bỏ qua dòng trống hoặc dòng comment
    console.log("Dòng: ", dong);

    const phanTu = dong.split(' '); // Tách dòng thành các phần tử bởi khoảng trắng
    console.log("Phần tử", phanTu);

    // Phân tích dòng START và FINISH để lấy điểm bắt đầu và kết thúc cùng trọng số của chúng
    if (phanTu[0] === 'START') {
      batDau = phanTu[1];
      batDauTrongSo = parseInt(phanTu[2], 10); // Lưu trọng số của điểm bắt đầu
    } else if (phanTu[0] === 'FINISH') {
      ketThuc = phanTu[1];
      ketThucTrongSo = parseInt(phanTu[2], 10); // Lưu trọng số của điểm kết thúc
    } else if (phanTu.length === 4) {
      // Đọc các cạnh với trọng số (tu, trongSo, den, trongSo)
      const [tu, _, den, trongSo] = phanTu;
      
      // Kiểm tra trọng số của đỉnh
      if (arraySave[tu] !== undefined && arraySave[tu] !== _) {
        console.error(`Lỗi: Điểm ${tu} có trọng số khác: (${_}) so với Điểm ${tu} trước đó: (${arraySave[tu]}), dòng thứ ${i + 1}`);
        process.exit(1);
      }else if (arraySave[den] !== undefined && arraySave[den] !== trongSo) {
        console.error(`Lỗi: Điểm ${den} có trọng số khác: (${trongSo}) so với Điểm ${den} trước đó: (${arraySave[den]}), dòng thứ ${i + 1}`);
        process.exit(1);
      } else {    
        // Lưu trọng số cho các đỉnh
        arraySave[tu] = _;
        arraySave[den] = trongSo;
      }

      if (!doThi[tu]) {
        doThi[tu] = []; // Tạo mảng cho đỉnh nếu chưa có trong đồ thị
      }
      doThi[tu].push({ den, trongSo: parseInt(trongSo, 10) }); // Lưu đỉnh và trọng số của nó vào đồ thị
    }
    console.log("Do thi", doThi, "Bắt đầu", batDau, "kết thúc", ketThuc);
  }
  return { doThi, batDau, batDauTrongSo, ketThuc, ketThucTrongSo }; // Trả về đối tượng đồ thị và thông tin điểm bắt đầu/kết thúc
}

// Hàm leo đồi với trọng số, bổ sung sắp xếp danh sách L1
function hillClimbing(doThi, batDau, batDauTrongSo, ketThuc, ketThucTrongSo) {

  let L = [{ den: batDau, trongSo: batDauTrongSo }]; // Danh sách L ban đầu với đỉnh bắt đầu và trọng số của nó
  let visited = new Set(); // Tập hợp các đỉnh đã thăm
  let result = []; // Mảng lưu kết quả từng bước
  let duongDi = []; // Mảng lưu đường đi tìm được
  let TT = 1; // Đếm số thứ tự bước

  while (L.length > 0) {
    let u = L.shift(); // Lấy và loại bỏ phần tử đầu tiên trong L
    visited.add(u.den); // Đánh dấu đỉnh đã thăm
    duongDi.push(`${u.den} (${u.trongSo})`); // Lưu đỉnh và trọng số vào đường đi
    console.log(u.den);

    // Nếu đạt tới đỉnh kết thúc, lưu kết quả và thoát khỏi vòng lặp
    if (u.den === ketThuc) {
      result.push({
        TT: TT++,
        TTPT: `${u.den} (${u.trongSo})`, // Lưu TTPT là đỉnh hiện tại và trọng số
        TTKE: `TTKT-Den dich ${ketThuc} (${ketThucTrongSo})`, // Thông báo kết thúc
        L1: '', // L1 rỗng do đã đạt đỉnh kết thúc
        L: L.map(node => `${node.den} (${node.trongSo})`).join(', ') || 'None' // Lưu trạng thái L hiện tại
      });
      break;
    }

    const neighbors = doThi[u.den] || []; // Lấy các đỉnh kề của đỉnh hiện tại
    let L1 = []; // Danh sách các đỉnh kề chưa thăm

    // Thêm các đỉnh kề chưa thăm vào L1
    for (const { den, trongSo } of neighbors) {
      if (!visited.has(den)) {
        L1.push({ den, trongSo });
      }
    }

    // Sắp xếp L1 theo thứ tự tăng dần của trọng số
    L1.sort((a, b) => a.trongSo - b.trongSo);

    console.log("L1", L1);
    // Chuyển L1 thành mảng chỉ chứa tên đỉnh và trọng số
    let L1_dinh = L1.map(n => `${n.den} (${n.trongSo})`);
    console.log(L1_dinh);
    // Thêm các đỉnh trong L1 vào đầu danh sách L
    L = [...L1, ...L];

    // Lưu kết quả từng bước vào mảng result
    result.push({
      TT: TT++,
      TTPT: `${u.den} (${u.trongSo})`,
      TTKE: neighbors.map(n => `${n.den} (${n.trongSo})`).join(', '),
      L1: L1_dinh.join(', ') || 'None',
      L: L.map(node => `${node.den} (${node.trongSo})`).join(', ') || 'None'
    });
  }

  // Nếu không tìm thấy đường đi đến đỉnh kết thúc, thêm thông báo không tìm thấy
  if (L.length === 0 && result.length === 0) {
    result.push({
      TT: TT,
      TTPT: `${batDau} (0)`,
      TTKE: `TTKT-Khong tim thay duong di tu ${batDau} den ${ketThuc}`,
      L1: '',
      L: 'None'
    });
  }

  return { result, duongDi }; // Trả về kết quả và đường đi tìm được
}

// Hàm ghi kết quả ra file
function ghiKetQuaRaFile(filename, result, duongDi) {
  const noiDung = [];
  noiDung.push("TT | TTPT   | TTKE                        | L1                       | L");
  noiDung.push("---------------------------------------------------------------------------------------");

  // Thêm từng hàng của result vào file với định dạng các cột
  result.forEach(row => {
    noiDung.push(`${row.TT.toString().padEnd(3)}| ${row.TTPT.padEnd(7)}| ${row.TTKE.padEnd(28)}| ${row.L1.padEnd(25)}| ${row.L}`);
  });

  // Thêm đường đi vào cuối file
  noiDung.push("\nĐường đi tìm được:");
  noiDung.push(duongDi.join(' -> ') || 'Không tìm thấy đường'); // Hiển thị đường đi nếu tìm được, nếu không thì ghi thông báo không tìm thấy

  // Ghi dữ liệu ra file
  fs.writeFileSync(filename, noiDung.join('\n'), 'utf8');
}

// Chạy chương trình với file input
const tenFileInput = 'input.txt'; // Tên file đầu vào
const tenFileOutput = 'output.txt'; // Tên file đầu ra
const { doThi, batDau, batDauTrongSo, ketThuc, ketThucTrongSo } = docDoThiTuFile(tenFileInput); // Đọc dữ liệu từ file
const { result, duongDi } = hillClimbing(doThi, batDau, batDauTrongSo, ketThuc, ketThucTrongSo); // Thực hiện leo đồi

// Ghi kết quả ra file output.txt
ghiKetQuaRaFile(tenFileOutput, result, duongDi);
