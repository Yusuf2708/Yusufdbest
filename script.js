const API_URL = "https://script.google.com/macros/s/AKfycbxnVMRqGVeaGflvWeA7UqV_bvR_yvs3elnyzRYCSHjkgivjlxQx5rgem1zQ8mPOT4sfQg/exec";

// === LOAD DATA (READ) ===
async function loadData() {
  const loading = document.getElementById("loading");
  const tableBody = document.querySelector("#dataTable tbody");
  loading.style.display = "block";

  try {
    const response = await fetch(API_URL + "?action=read");
    const data = await response.json(); 
    console.log("🔹 Data dari API:", data);

    tableBody.innerHTML = "";

    data.forEach(row => {
      const tr = document.createElement("tr");

      // Ambil data dari object
      const cols = [
        row.ID || "-",
        row.NIS || "-",
        row.NAMA || "-",
        row.JENIS_KELAMIN || "-",
        row.KELAS || "-",
        row.KETERANGAN || "-"
      ];

      // Masukkan ke tabel
      cols.forEach(col => {
        const td = document.createElement("td");
        td.textContent = col;
        tr.appendChild(td);
      });

      // Kolom Aksi
      const tdAction = document.createElement("td");
      tdAction.innerHTML = `
        <button class="action-btn edit-btn" onclick="editData(
          \`${row.ID}\`,\`${row.NIS}\`,\`${row.NAMA}\`,\`${row.JENIS_KELAMIN}\`,\`${row.KELAS}\`,\`${row.KETERANGAN}\`
        )">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteData(\`${row.ID}\`)">Delete</button>
      `;
      tr.appendChild(tdAction);

      tableBody.appendChild(tr);
    });

  } catch (error) {
    console.error("Gagal ambil data:", error);
    tableBody.innerHTML = "<tr><td colspan='7'>Gagal memuat data</td></tr>";
  }

  loading.style.display = "none";
}

// === SUBMIT FORM (CREATE/UPDATE) ===
async function submitData() {
  const id = document.getElementById("id").value;
  const nis = document.getElementById("nis").value;
  const nama = document.getElementById("nama").value;
  const jk = document.getElementById("jk").value;
  const kelas = document.getElementById("kelas").value;
  const keterangan = document.getElementById("keterangan").value;
  const status = document.getElementById("formStatus");

  if (!nis || !nama || !jk || !kelas || !keterangan) {
    status.style.color = "red";
    status.textContent = "❌ Harap isi semua field!";
    return;
  }

  status.style.color = "orange";
  status.textContent = "⏳ Memproses data...";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        action: id ? "update" : "create",
        id: id,
        nis: nis,
        nama: nama,
        jk: jk,
        kelas: kelas,
        keterangan: keterangan
      }),
      headers: { "Content-Type": "application/json" }
    });

    const result = await response.json();

    if (result.status === "success") {
      status.style.color = "green";
      status.textContent = id ? "✅ Data berhasil diupdate!" : "✅ Data berhasil ditambahkan!";
      loadData();
      resetForm();
    } else {
      status.style.color = "red";
      status.textContent = "❌ Gagal memproses data!";
    }

  } catch (error) {
    console.error("Error:", error);
    status.style.color = "red";
    status.textContent = "❌ Terjadi kesalahan!";
  }
}

// === EDIT DATA (isi form) ===
function editData(id, nis, nama, jk, kelas, keterangan) {
  document.getElementById("id").value = id;
  document.getElementById("nis").value = nis;
  document.getElementById("nama").value = nama;
  document.getElementById("jk").value = jk;
  document.getElementById("kelas").value = kelas;
  document.getElementById("keterangan").value = keterangan;
  document.getElementById("formStatus").textContent = "✏️ Mode Edit (klik Simpan untuk update)";
}

// === DELETE DATA ===
async function deleteData(id) {
  if (!confirm("Apakah kamu yakin ingin menghapus data ini?")) return;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "delete", id: id }),
      headers: { "Content-Type": "application/json" }
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("✅ Data berhasil dihapus!");
      loadData();
    } else {
      alert("❌ Gagal menghapus data!");
    }

  } catch (error) {
    console.error("Error:", error);
    alert("❌ Terjadi kesalahan!");
  }
}

// === SEARCH ===
function searchTable() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#dataTable tbody tr");
  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    let found = false;
    cells.forEach(cell => {
      if (cell.textContent.toLowerCase().includes(input)) found = true;
    });
    row.style.display = found ? "" : "none";
  });
}

// === RESET FORM ===
function resetForm() {
  document.getElementById("id").value = "";
  document.getElementById("nis").value = "";
  document.getElementById("nama").value = "";
  document.getElementById("jk").value = "";
  document.getElementById("kelas").value = "";
  document.getElementById("keterangan").value = "";
  document.getElementById("formStatus").textContent = "";
}

// Load data saat halaman dibuka
loadData();