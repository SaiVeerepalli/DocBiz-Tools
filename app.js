const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const money=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(Number(n)||0);
const num=v=>Number.parseFloat(v)||0;
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const tabs=$$(".tab,[data-tab]");
function showTab(id){$$(".page").forEach(p=>p.classList.toggle("active",p.id===id));$$(".tab").forEach(t=>t.classList.toggle("active",t.dataset.tab===id));$("#tabs").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"})}
tabs.forEach(x=>x.addEventListener("click",e=>{e.preventDefault();showTab(x.dataset.tab)}));
$("#menuBtn").onclick=()=>$("#tabs").classList.toggle("open");
$("#themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.dbDark=document.body.classList.contains("dark")?"1":"0"};
$("#comfortBtn").onclick=()=>{document.body.classList.toggle("comfort");localStorage.dbComfort=document.body.classList.contains("comfort")?"1":"0"};
if(localStorage.dbDark==="1")document.body.classList.add("dark"); if(localStorage.dbComfort==="1")document.body.classList.add("comfort");

const calcs=[
["GST Calculator","🧾","Add or remove GST, with CGST/SGST or IGST.","gst"],
["Profit & Margin","📈","Calculate profit, margin and markup from cost and selling price.","profit"],
["Discount Calculator","🏷️","Calculate discount amount and final selling price.","discount"],
["EMI Calculator","🏦","Estimate monthly EMI, total interest and repayment.","emi"],
["Break-even Calculator","⚖️","Find units and sales value needed to cover fixed costs.","breakEven"],
["Amount in Words","🔢","Convert Indian rupee amounts into words.","words"],
["CBM Calculator","📦","Calculate cubic metres from package dimensions and quantity.","cbm"],
["Landed Cost","🚢","Estimate landed cost using freight, duty and other costs.","landed"]
];
const docs=[
["Invoice Generator","🧾","Create a clean invoice and print/save it as PDF.","invoice"],
["GST Invoice","🇮🇳","Invoice with GSTIN, HSN/SAC and CGST/SGST or IGST.","invoice"],
["Quotation","📋","Create a customer quotation with line items and totals.","quotation"],
["Proforma Invoice","📑","Prepare a proforma invoice for business or export use.","proforma"],
["Purchase Order","🛒","Create a purchase order for suppliers.","po"],
["Receipt","🧾","Create a payment receipt with amount and reference.","receipt"],
["Packing List","📦","Create a packing list with package details.","packing"]
];
const india=[
["GST Calculator","🧾","GST add/remove and tax split calculations.","gst"],
["GST Split","↔️","Calculate CGST + SGST or IGST from a taxable value.","gst"],
["INR Amount in Words","₹","Indian numbering system amount-to-words converter.","words"],
["Invoice Number Generator","🔢","Generate a clean sequential invoice number locally.","invoiceNo"]
];
const trade=[
["CBM Calculator","📦","Cubic metre calculation for cartons, crates or stone packages.","cbm"],
["Landed Cost","🚢","Estimate product landed cost from purchase through destination.","landed"],
["Packing List","📋","Create a simple export packing list.","packing"],
["Proforma Invoice","📑","Prepare a proforma invoice for an international quotation.","proforma"],
["Purchase Order","🛒","Create a supplier purchase order.","po"]
];
function renderGrid(id,data){$(id).innerHTML=data.map((x,i)=>`<article class="tool-card" data-name="${esc(x[0]+" "+x[2])}"><div class="tool-icon">${x[1]}</div><h3>${x[0]}</h3><p>${x[2]}</p><button data-open="${x[3]}">${x[3]==="invoice"?"Open generator":"Open tool"}</button></article>`).join("")}
renderGrid("#calculatorGrid",calcs);renderGrid("#documentGrid",docs);renderGrid("#indiaGrid",india);renderGrid("#tradeGrid",trade);
document.addEventListener("click",e=>{const b=e.target.closest("[data-open]");if(b)openTool(b.dataset.open,b.closest(".tool-card")?.querySelector("h3")?.textContent||"Tool")});
$("#toolSearch").addEventListener("input",e=>{const q=e.target.value.toLowerCase();$$(".tool-card").forEach(c=>c.style.display=c.dataset.name.toLowerCase().includes(q)?"":"none")});

const modal=$("#modalBackdrop"), body=$("#modalBody"), title=$("#modalTitle");
function openModal(t,html){title.textContent=t;body.innerHTML=html;modal.hidden=false}
$("#closeModal").onclick=()=>modal.hidden=true;modal.addEventListener("click",e=>{if(e.target===modal)modal.hidden=true});

function input(id,label,val="",type="number",step="any"){return `<div class="field"><label>${label}</label><input id="${id}" type="${type}" value="${val}" step="${step}"></div>`}
function resultBox(id="result"){return `<div class="result" id="${id}">Enter values and calculate.</div>`}
function openTool(type,t){
let h="";
if(type==="gst")h=`<div class="form-grid">
${input("gstBase","Amount (₹)",100)}${input("gstRate","GST rate (%)",18)}
<div class="field"><label>Mode</label><select id="gstMode"><option value="add">Add GST to amount</option><option value="remove">Remove GST from inclusive amount</option></select></div>
<div class="field"><label>Tax type</label><select id="gstType"><option value="split">CGST + SGST</option><option value="igst">IGST</option></select></div></div>${resultBox()}<div class="actions"><button class="primary" onclick="calcGST()">Calculate</button></div>`;
else if(type==="profit")h=`<div class="form-grid">${input("cost","Cost price (₹)",100)}${input("sell","Selling price (₹)",140)}</div>${resultBox()}<div class="actions"><button class="primary" onclick="calcProfit()">Calculate</button></div>`;
else if(type==="discount")h=`<div class="form-grid">${input("listPrice","Original price (₹)",1000)}${input("discountRate","Discount (%)",10)}</div>${resultBox()}<div class="actions"><button class="primary" onclick="calcDiscount()">Calculate</button></div>`;
else if(type==="emi")h=`<div class="form-grid">${input("loan","Loan amount (₹)",500000)}${input("emiRate","Annual interest (%)",10)}${input("emiYears","Tenure (years)",5,"number","1")}</div>${resultBox()}<div class="actions"><button class="primary" onclick="calcEMI()">Calculate</button></div>`;
else if(type==="breakEven")h=`<div class="form-grid">${input("fixed","Fixed costs (₹)",100000)}${input("price","Selling price/unit (₹)",1000)}${input("variable","Variable cost/unit (₹)",600)}</div>${resultBox()}<div class="actions"><button class="primary" onclick="calcBE()">Calculate</button></div>`;
else if(type==="words")h=`${input("wordAmount","Amount (₹)",123456.78)}${resultBox()}<div class="actions"><button class="primary" onclick="calcWords()">Convert</button></div>`;
else if(type==="cbm")h=`<div class="form-grid">${input("length","Length (cm)",100)}${input("width","Width (cm)",50)}${input("height","Height (cm)",50)}${input("qty","Quantity",10,"number","1")}</div>${resultBox()}<div class="actions"><button class="primary" onclick="calcCBM()">Calculate</button></div>`;
else if(type==="landed")h=`<div class="form-grid">${input("productCost","Product cost (₹)",100000)}${input("freight","Freight (₹)",15000)}${input("insurance","Insurance/other (₹)",5000)}${input("dutyRate","Duty/extra (%)",10)}${input("localCost","Local/handling cost (₹)",5000)}</div>${resultBox()}<div class="actions"><button class="primary" onclick="calcLanded()">Calculate</button></div>`;
else if(type==="invoiceNo")h=`${input("prefix","Prefix","INV-","text")}${input("startNo","Starting number",1,"number","1")}${input("countNo","How many",5,"number","1")}${resultBox()}<div class="actions"><button class="primary" onclick="genInvoiceNos()">Generate</button></div>`;
else if(["invoice","quotation","proforma","po","receipt","packing"].includes(type))h=docForm(type);
openModal(t,h);
}

function calcGST(){let a=num($("#gstBase").value),r=num($("#gstRate").value),taxType=$("#gstType").value,mode=$("#gstMode").value;let tax=mode==="add"?a*r/100:a*r/(100+r),base=mode==="add"?a:a-tax,total=mode==="add"?a+tax:a;let split=taxType==="split"?`CGST: ${money(tax/2)} &nbsp; | &nbsp; SGST: ${money(tax/2)}`:`IGST: ${money(tax)}`;$("#result").innerHTML=`Taxable amount: <strong>${money(base)}</strong><br>GST: <strong>${money(tax)}</strong><br>Total: <strong>${money(total)}</strong><br><span class="mini">${split}</span>`}
function calcProfit(){let c=num($("#cost").value),s=num($("#sell").value),p=s-c,margin=s? p/s*100:0,markup=c?p/c*100:0;$("#result").innerHTML=`Profit: <strong>${money(p)}</strong><br>Margin: <strong>${margin.toFixed(2)}%</strong><br>Markup: <strong>${markup.toFixed(2)}%</strong>`}
function calcDiscount(){let p=num($("#listPrice").value),r=num($("#discountRate").value),d=p*r/100;$("#result").innerHTML=`Discount: <strong>${money(d)}</strong><br>Final price: <strong>${money(p-d)}</strong>`}
function calcEMI(){let P=num($("#loan").value),annual=num($("#emiRate").value),n=num($("#emiYears").value)*12,r=annual/12/100,emi=r?P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):P/n,total=emi*n;$("#result").innerHTML=`Monthly EMI: <strong>${money(emi)}</strong><br>Total repayment: ${money(total)}<br>Total interest: ${money(total-P)}`}
function calcBE(){let f=num($("#fixed").value),p=num($("#price").value),v=num($("#variable").value),cm=p-v;if(cm<=0){$("#result").innerHTML=`<strong>Break-even cannot be reached</strong><br>Selling price must exceed variable cost.`;return}let u=f/cm;$("#result").innerHTML=`Contribution/unit: <strong>${money(cm)}</strong><br>Break-even units: <strong>${Math.ceil(u).toLocaleString("en-IN")}</strong><br>Break-even sales: <strong>${money(u*p)}</strong>`}
function calcWords(){let a=num($("#wordAmount").value);$("#result").innerHTML=`<strong>${esc(inrWords(a))}</strong>`}
function calcCBM(){let l=num($("#length").value),w=num($("#width").value),h=num($("#height").value),q=num($("#qty").value);let one=l*w*h/1000000,total=one*q;$("#result").innerHTML=`Volume/package: <strong>${one.toFixed(4)} m³</strong><br>Total CBM: <strong>${total.toFixed(4)} m³</strong>`}
function calcLanded(){let p=num($("#productCost").value),f=num($("#freight").value),i=num($("#insurance").value),d=num($("#dutyRate").value),l=num($("#localCost").value),assess=p+f+i,duty=assess*d/100,total=assess+duty+l;$("#result").innerHTML=`Duty/extra: <strong>${money(duty)}</strong><br>Landed cost: <strong>${money(total)}</strong><br>Per ₹1 of product: ${p? (total/p).toFixed(4):"—"}`}

const ones=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"], tens=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
function under1000(n){let s="";if(n>=100){s+=ones[Math.floor(n/100)]+" Hundred ";n%=100}if(n>=20)s+=tens[Math.floor(n/10)]+(n%10?" "+ones[n%10]:"");else if(n>0)s+=ones[n];return s.trim()}
function inrWords(x){x=Math.round((Number(x)||0)*100)/100;let neg=x<0;x=Math.abs(x);let rupees=Math.floor(x),paise=Math.round((x-rupees)*100);let parts=[];let crore=Math.floor(rupees/10000000);rupees%=10000000;let lakh=Math.floor(rupees/100000);rupees%=100000;let thousand=Math.floor(rupees/1000);rupees%=1000;if(crore)parts.push(under1000(crore)+" Crore");if(lakh)parts.push(under1000(lakh)+" Lakh");if(thousand)parts.push(under1000(thousand)+" Thousand");if(rupees)parts.push(under1000(rupees));let s=(neg?"Minus ":"")+(parts.join(" ")||"Zero")+" Rupees";if(paise)s+=" and "+under1000(paise)+" Paise";return s+" Only"}

function docForm(type){
let title={invoice:"Invoice",quotation:"Quotation",proforma:"Proforma Invoice",po:"Purchase Order",receipt:"Receipt",packing:"Packing List"}[type];
if(type==="receipt")return `<div class="notice">This is a simple printable receipt. No data is sent to a server.</div><div class="form-grid">
${input("biz","Business / seller","Your Business","text")}${input("customer","Received from","Customer","text")}${input("docNo","Receipt no.","RCPT-001","text")}${input("docDate","Date",new Date().toISOString().slice(0,10),"date")}${input("receiptAmt","Amount received (₹)",1000)}${input("paymentMode","Payment mode","Cash / UPI / Bank","text")}<div class="field full"><label>Purpose / description</label><textarea id="receiptDesc">Payment received</textarea></div></div>${resultBox("docResult")}<div class="actions"><button class="primary" onclick="previewReceipt()">Preview & Print</button></div>`;
if(type==="packing")return `<div class="form-grid">${input("packExporter","Exporter / Shipper","Your Business","text")}${input("packBuyer","Consignee / Buyer","Customer","text")}${input("packNo","Packing list no.","PL-001","text")}${input("packDate","Date",new Date().toISOString().slice(0,10),"date")}${input("packMarks","Marks / reference","","text")}${input("packPackages","Number of packages",1,"number","1")}${input("packWeight","Total gross weight (kg)",0)}${input("packNet","Total net weight (kg)",0)}${input("packCBM","Total CBM",0)}<div class="field full"><label>Description of goods</label><textarea id="packDesc">Goods / materials</textarea></div></div>${resultBox("docResult")}<div class="actions"><button class="primary" onclick="previewPacking()">Preview & Print</button></div>`;
return `<div class="notice">Browser-only document generator. Fill the details, preview, then use your browser's Print → Save as PDF.</div>
<div class="doc-layout"><div>
<div class="form-grid">${input("dSeller","Seller / Supplier","Your Business","text")}${input("dBuyer","Buyer / Customer","Customer","text")}${input("dNo","Document no.",type==="quotation"?"QUO-001":type==="proforma"?"PI-001":type==="po"?"PO-001":"INV-001","text")}${input("dDate","Date",new Date().toISOString().slice(0,10),"date")}${input("dGSTIN","Seller GSTIN","","text")}${input("dBuyerGSTIN","Buyer GSTIN","","text")}${input("dPlace","Place of supply","","text")}${input("dCurrency","Currency","INR","text")}</div>
<h4>Items</h4><div class="line-items" id="lineItems">${lineRow(1)}</div><div class="actions"><button onclick="addLine()">+ Add item</button></div>
<div class="form-grid">${input("dDiscount","Discount (%)",0)}${input("dTax","GST (%)",18)}<div class="field full"><label>Notes</label><textarea id="dNotes">Thank you for your business.</textarea></div></div>
</div><div id="livePreview" class="doc-preview"></div></div>
<div class="actions"><button class="primary" onclick="printDocument('${type}')">Preview & Print / Save PDF</button><button onclick="saveDraft()">Save draft in this browser</button></div>`;
}
function lineRow(n){return `<div class="line-row"><input class="item-desc" placeholder="Description"><input class="item-qty" type="number" value="1" min="0" step="any"><input class="item-rate" type="number" value="0" min="0" step="any"><input class="item-hsn" placeholder="HSN/SAC"><button onclick="this.parentElement.remove();updateDocPreview()">×</button></div>`}
function addLine(){document.querySelector("#lineItems").insertAdjacentHTML("beforeend",lineRow(Date.now()));updateDocPreview();$$("#lineItems input").forEach(x=>x.oninput=updateDocPreview)}
function collectDoc(){let rows=$$(".line-row").map(r=>({desc:r.querySelector(".item-desc").value||"Item",qty:num(r.querySelector(".item-qty").value),rate:num(r.querySelector(".item-rate").value),hsn:r.querySelector(".item-hsn").value}));let subtotal=rows.reduce((s,x)=>s+x.qty*x.rate,0),disc=num($("#dDiscount")?.value),discount=subtotal*disc/100,taxable=subtotal-discount,taxRate=num($("#dTax")?.value),tax=taxable*taxRate/100;return {seller:$("#dSeller").value,buyer:$("#dBuyer").value,no:$("#dNo").value,date:$("#dDate").value,gstin:$("#dGSTIN").value,bgstin:$("#dBuyerGSTIN").value,place:$("#dPlace").value,currency:$("#dCurrency").value,rows,subtotal,discount,taxable,taxRate,tax,notes:$("#dNotes").value}}
function updateDocPreview(){let d=collectDoc();let rows=d.rows.map(x=>`<tr><td>${esc(x.desc)}</td><td>${esc(x.hsn)}</td><td>${x.qty}</td><td>${money(x.rate)}</td><td>${money(x.qty*x.rate)}</td></tr>`).join("");let type=title.textContent;$("#livePreview").innerHTML=`<div class="doc-title">${esc(type)}</div><p><strong>${esc(d.seller)}</strong><br>GSTIN: ${esc(d.gstin)||"—"}<br>${esc(d.place)}</p><hr><p><strong>Bill to:</strong> ${esc(d.buyer)}<br>GSTIN: ${esc(d.bgstin)||"—"}<br>Document: ${esc(d.no)} | ${esc(d.date)}</p><table><thead><tr><th>Description</th><th>HSN/SAC</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table><div class="totals"><p>Subtotal: ${money(d.subtotal)}</p><p>Discount: ${money(d.discount)}</p><p>Taxable: ${money(d.taxable)}</p><p>GST (${d.taxRate}%): ${money(d.tax)}</p><h3>Total: ${money(d.taxable+d.tax)}</h3></div><p>${esc(d.notes)}</p>`}
function setupDoc(){ $$("#lineItems input").forEach(x=>x.oninput=updateDocPreview);["dDiscount","dTax"].forEach(id=>$("#"+id)?.addEventListener("input",updateDocPreview));updateDocPreview()}
const oldOpen=openTool;
openTool=function(type,t){oldOpen(type,t);setTimeout(()=>{if(["invoice","quotation","proforma","po"].includes(type))setupDoc()},20)}
function printDocument(type){updateDocPreview();let preview=$("#livePreview").outerHTML;let d=collectDoc();let w=window.open("","_blank");w.document.write(`<html><head><title>${esc(type)}</title><style>body{font-family:Arial,sans-serif;padding:30px;color:#111} .doc-preview{max-width:800px;margin:auto}table{width:100%;border-collapse:collapse}th,td{border:1px solid #bbb;padding:8px;font-size:12px}.doc-title{font-size:28px;font-weight:bold;text-align:right}.totals{margin-left:auto;width:300px}hr{border:0;border-top:1px solid #ccc}@media print{body{padding:10mm}}</style></head><body><div class="doc-preview">${preview}</div><script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close()}
function previewReceipt(){let b=$("#biz").value,c=$("#customer").value,no=$("#docNo").value,date=$("#docDate").value,a=num($("#receiptAmt").value),pm=$("#paymentMode").value,desc=$("#receiptDesc").value;let w=window.open("","_blank");w.document.write(`<html><head><title>Receipt</title><style>body{font-family:Arial;padding:30px}.box{max-width:650px;margin:auto;border:1px solid #bbb;padding:30px}h1{text-align:center}.amt{font-size:25px;font-weight:bold}</style></head><body><div class="box"><h1>PAYMENT RECEIPT</h1><h2>${esc(b)}</h2><p>Receipt No: ${esc(no)}<br>Date: ${esc(date)}</p><p>Received from: <strong>${esc(c)}</strong></p><p>For: ${esc(desc)}</p><p>Payment mode: ${esc(pm)}</p><p class="amt">Amount Received: ${money(a)}</p><p>Amount in words: ${esc(inrWords(a))}</p></div><script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close()}
function previewPacking(){let b=$("#packExporter").value,c=$("#packBuyer").value,no=$("#packNo").value,date=$("#packDate").value,m=$("#packMarks").value,p=$("#packPackages").value,g=$("#packWeight").value,n=$("#packNet").value,cbm=$("#packCBM").value,desc=$("#packDesc").value;let w=window.open("","_blank");w.document.write(`<html><head><title>Packing List</title><style>body{font-family:Arial;padding:30px}.box{max-width:800px;margin:auto}table{width:100%;border-collapse:collapse}td,th{border:1px solid #999;padding:9px}</style></head><body><div class="box"><h1>PACKING LIST</h1><p><b>Exporter:</b> ${esc(b)}<br><b>Consignee:</b> ${esc(c)}<br><b>No:</b> ${esc(no)}<br><b>Date:</b> ${esc(date)}<br><b>Marks:</b> ${esc(m)}</p><table><tr><th>Description</th><th>Packages</th><th>Net kg</th><th>Gross kg</th><th>CBM</th></tr><tr><td>${esc(desc)}</td><td>${esc(p)}</td><td>${esc(n)}</td><td>${esc(g)}</td><td>${esc(cbm)}</td></tr></table></div><script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close()}
function genInvoiceNos(){let pre=$("#prefix").value,start=parseInt($("#startNo").value)||1,count=parseInt($("#countNo").value)||1;$("#result").innerHTML=`<strong>${Array.from({length:Math.min(count,100)},(_,i)=>`${esc(pre)}${String(start+i).padStart(4,"0")}`).join("<br>")}</strong>`}
function saveDraft(){let d=collectDoc();localStorage.docbizDraft=JSON.stringify(d);alert("Draft saved in this browser.")}
window.addEventListener("beforeprint",()=>{});
