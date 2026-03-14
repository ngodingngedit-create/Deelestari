const fs = require('fs');

let cetak = fs.readFileSync('c:/Users/Maisan Hanif D/OneDrive/Desktop/deelestari/src/views/CetakResiView.vue', 'utf8');
let live = fs.readFileSync('c:/Users/Maisan Hanif D/OneDrive/Desktop/deelestari/src/views/LiveReportView.vue', 'utf8');

// 1. Extract printResi method from cetak
const printResiMatch = cetak.match(/\/\/ Cetak Resi Action[\s\S]+?};\n/);
let printResiContent = '';
if(printResiMatch) printResiContent = printResiMatch[0];

// 2. Clone live template but inject the AkSI column
let newTemplate = live.match(/<template>[\s\S]+?<\/template>/)[0];

// Replace 'STATISTIK MERCHANDISE' with 'CETAK RESI PENGIRIMAN'
newTemplate = newTemplate.replace('STATISTIK MERCHANDISE', 'CETAK RESI PENGIRIMAN');
newTemplate = newTemplate.replace('Overview of sales and performances', 'Daftar transaksi untuk pencetakan resi');
newTemplate = newTemplate.replace(/<button class="export-btn"[\s\S]+?<\/button>/, ''); // Remove export button

// Find the header row in table and add AKSI
const headerPattern = /<th>STATUS PENGIRIMAN<\/th>\s*<\/tr>/;
newTemplate = newTemplate.replace(headerPattern, '<th>STATUS PENGIRIMAN</th>\n                <th>AKSI</th>\n              </tr>');

// Find the data row and add AKSI button
const dataRowPattern = /<td>\s*<span \s*class="pickup-badge"[\s\S]+?<\/span>\s*<\/td>/;
const cetakButtonHtml = `<td>
                  <button class="print-btn" @click="printResi(item)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="mr-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    Cetak Resi
                  </button>
                </td>`;

newTemplate = newTemplate.replace(dataRowPattern, match => match + '\n                ' + cetakButtonHtml);

// 3. Clone script, remove exportCsv, inject printResi
let newScript = live.match(/<script setup>[\s\S]+?<\/script>/)[0];
newScript = newScript.replace(/const exportToExcel = \(\) => {[\s\S]+?};\n/, '');
newScript = newScript.replace(/fetchProducts\(\); \/\/ Ensure products are fetched for creator mapping/, 'fetchProducts();\n' + printResiContent);

// 4. Clone style, but add .print-btn
let newStyle = live.match(/<style scoped>[\s\S]+?<\/style>/)[0];
const printBtnCSS = `
.print-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s;
}
.print-btn:hover {
  background: #2980b9;
}
.mr-2 { margin-right: 5px; }
`;

newStyle = newStyle.replace('</style>', printBtnCSS + '\n</style>');

// Write to file
fs.writeFileSync('c:/Users/Maisan Hanif D/OneDrive/Desktop/deelestari/src/views/CetakResiView.vue', newTemplate + '\n\n' + newScript + '\n\n' + newStyle);
console.log('Successfully rebuilt CetakResiView.vue');
