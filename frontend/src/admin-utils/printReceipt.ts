import { format, addDays } from 'date-fns';

export const numberToVietnameseWords = (value?: number | string) => {
  const amount = Number(value || 0);
  if (!amount || amount < 0 || !Number.isFinite(amount)) return '';
  const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
  const readThreeDigits = (num: number, hasHigherGroup: boolean) => {
    const hundred = Math.floor(num / 100);
    const ten = Math.floor((num % 100) / 10);
    const one = num % 10;
    const words: string[] = [];
    if (hundred > 0) words.push(digits[hundred], 'trăm');
    else if (hasHigherGroup && (ten > 0 || one > 0)) words.push('không trăm');
    if (ten > 1) {
      words.push(digits[ten], 'mươi');
      if (one === 1) words.push('mốt');
      else if (one === 5) words.push('lăm');
      else if (one > 0) words.push(digits[one]);
    } else if (ten === 1) {
      words.push('mười');
      if (one === 5) words.push('lăm');
      else if (one > 0) words.push(digits[one]);
    } else if (one > 0) {
      if (hasHigherGroup || hundred > 0) words.push('lẻ');
      words.push(digits[one]);
    }
    return words.join(' ');
  };
  const groups: number[] = [];
  let remaining = Math.floor(amount);
  while (remaining > 0) {
    groups.push(remaining % 1000);
    remaining = Math.floor(remaining / 1000);
  }
  const words: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) continue;
    words.push(readThreeDigits(groups[i], i < groups.length - 1));
    if (units[i]) words.push(units[i]);
  }
  const result = `${words.join(' ').replace(/\s+/g, ' ').trim()} đồng`;
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const CATEGORY_MAP: Record<string, string> = {
  PHONE: 'Điện thoại',
  LAPTOP: 'Máy tính',
  VEHICLE: 'Xe máy / Ô tô',
  JEWELRY: 'Trang sức / Vàng',
  OTHER: 'Khác',
};

export const openPrintReceipt = (data: any, settings?: any) => {
  if (!data) return;
  // A5 landscape: 210mm wide x 148mm tall
  const printWindow = window.open('', '_blank', 'width=900,height=650');
  if (!printWindow) return;

  const storeName = settings?.storeName || 'HƯNG THỊNH I';
  const address = settings?.address || 'Tổ 2, KP.3B, P. Minh Hưng, TP. Đồng Xoài, Đồng Nai';
  const phone = settings?.phone || '0327 723 260';
  const zalo = settings?.zalo || '0327 723 260';
  const bankAccountName = settings?.bankAccountName || 'HỘ KINH DOANH HƯNG THỊNH I';
  const bankAccountNumber = settings?.bankAccountNumber || '497668007';
  const bankName = settings?.bankName || 'ACB - Ngân hàng TMCP Á Châu';

  const pawnAmountWords = numberToVietnameseWords(data.pawnAmount);
  const receiptId = data.receiptId || 'Hợp đồng mới';
  const pawnDateStr = data.pawnDate ? format(new Date(data.pawnDate), 'dd/MM/yyyy') : format(new Date(), 'dd/MM/yyyy');
  const dueDateStr = data.dueDate ? format(new Date(data.dueDate), 'dd/MM/yyyy') : format(addDays(new Date(), 30), 'dd/MM/yyyy');
  const barcodeValue = receiptId.replace(/[^A-Za-z0-9]/g, '');
  const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${barcodeValue}&code=Code128&dpi=96&dataseparator=`;
  const primaryColor = '#105e32';
  const categoryLabel = CATEGORY_MAP[data.itemCategory] || 'Khác';
  const descriptionLabel = data.itemDescription || data.itemName || '-';
  const interestRateLabel = data.interestRate ? `${data.interestRate}%/tháng` : 'Theo thỏa thuận';
  const estimatedMonthlyInterest = data.pawnAmount && data.interestRate
    ? Math.round(Number(data.pawnAmount) * Number(data.interestRate) / 100)
    : 0;
  const estimatedInterestWords = estimatedMonthlyInterest > 0
    ? `${new Intl.NumberFormat('vi-VN').format(estimatedMonthlyInterest)} VNĐ/tháng`
    : 'Theo thỏa thuận';

  const htmlContent = `
    <!doctype html>
    <html lang="vi">
      <head>
        <meta charset="utf-8" />
        <title>Biên nhận ${receiptId}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          @page {
            size: A5 landscape;
            margin: 6mm;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            color: #111;
            background: #fff;
            width: 210mm;
            height: 148mm;
            overflow: hidden;
          }

          .page {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            border: 2px solid ${primaryColor};
            padding: 10px 15px 10px;
          }

          /* ── HEADER ── */
          .header {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            border-bottom: 1.5px solid ${primaryColor};
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .store-block { flex: 1.4; }
          .store-name {
            font-size: 16px;
            font-weight: 900;
            color: ${primaryColor};
            letter-spacing: -0.3px;
            line-height: 1.2;
          }
          .store-sub {
            font-size: 10px;
            color: #555;
            margin-top: 2px;
          }
          .store-contact {
            font-size: 9px;
            color: #333;
            margin-top: 4px;
            line-height: 1.6;
          }
          .store-contact b { color: ${primaryColor}; }

          .title-block {
            flex: 2;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .title-block .republic {
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            line-height: 1.4;
          }
          .title-block .motto {
            font-size: 9px;
            margin-bottom: 2px;
          }
          .title-block h1 {
            font-size: 18px;
            font-weight: 900;
            color: ${primaryColor};
            text-transform: uppercase;
            letter-spacing: 0.3px;
            line-height: 1.2;
            margin: 2px 0;
          }
          .title-block .contract-id {
            display: inline-block;
            border: 1.5px solid ${primaryColor};
            padding: 3px 14px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 13px;
            margin-top: 4px;
            color: #111;
          }

          .barcode-block {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: center;
          }
          .barcode-wrap {
            border: 1px solid #ccc;
            border-radius: 4px;
            overflow: hidden;
            width: 110px;
            text-align: center;
          }
          .barcode-title-bar {
            background: ${primaryColor};
            color: white;
            font-size: 7px;
            font-weight: bold;
            padding: 2px 4px;
          }
          .barcode-img {
            width: 100%;
            height: 32px;
            object-fit: contain;
            display: block;
          }
          .barcode-code {
            font-size: 8px;
            font-weight: bold;
            letter-spacing: 1px;
            padding: 1px 0 2px;
          }

          /* ── BODY ── */
          .body {
            display: flex;
            gap: 10px;
            flex: 1;
            min-height: 0;
          }

          .col { display: flex; flex-direction: column; gap: 10px; }
          .col-left { flex: 1.1; }
          .col-mid { flex: 1.1; }
          .col-right { flex: 1; }

          /* Sections */
          .section { border: 1px solid #ccc; border-radius: 4px; overflow: hidden; }
          .section-header {
            background: ${primaryColor};
            color: #fff;
            font-size: 9px;
            font-weight: bold;
            padding: 5px 8px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          .section-body { padding: 8px 10px; }

          /* Info rows */
          .info-row {
            display: flex;
            align-items: flex-start;
            gap: 2px;
            font-size: 10px;
            line-height: 1.5;
            border-bottom: 1px solid #f0f0f0;
            padding-bottom: 5px;
            margin-bottom: 5px;
          }
          .info-row:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
          .info-label { color: #555; min-width: 80px; flex-shrink: 0; }
          .info-colon { color: #777; width: 8px; flex-shrink: 0; }
          .info-value { font-weight: 600; color: #111; flex: 1; }
          .info-value.red { color: #c0392b; }
          .info-value.green { color: ${primaryColor}; }
          .info-value.big { font-size: 11.5px; font-weight: 700; }
          .dotted-fill {
            border-bottom: 1.5px dotted #999;
            min-height: 12px;
            margin-bottom: 2px;
          }

          /* Notes rows */
          .note-list { list-style: none; padding: 0; }
          .note-list li {
            font-size: 8.5px;
            line-height: 1.55;
            color: #333;
            padding: 4px 0;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            gap: 5px;
          }
          .note-list li:last-child { border-bottom: none; }
          .note-num {
            min-width: 16px;
            height: 16px;
            background: ${primaryColor};
            color: white;
            border-radius: 3px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            font-weight: bold;
            flex-shrink: 0;
            margin-top: 1px;
          }

          /* Bank info */
          .bank-name { font-size: 10px; font-weight: 900; color: ${primaryColor}; margin-bottom: 5px; }
          .bank-row { font-size: 9px; line-height: 1.8; color: #333; margin-bottom: 2px; }
          .bank-row b { color: #111; }

          /* Signatures */
          .sig-section {
            display: flex;
            border-top: 1.5px solid ${primaryColor};
            margin-top: 10px;
            padding-top: 5px;
            gap: 0;
          }
          .sig-box {
            flex: 1;
            text-align: center;
          }
          .sig-box strong { display: block; font-size: 10px; font-weight: 900; }
          .sig-box em { font-size: 9px; color: #555; font-style: italic; }
          .sig-line {
            margin: 25px auto 0;
            border-bottom: 1px dotted #999;
            width: 60%;
          }
          .sig-divider {
            width: 1px;
            background: #ddd;
            margin: 0 4px;
          }

          /* Footer */
          .footer-bar {
            background: ${primaryColor};
            color: white;
            text-align: center;
            font-size: 10px;
            font-weight: bold;
            padding: 6px;
            margin-top: 10px;
            border-radius: 2px;
            letter-spacing: 0.3px;
          }

          @media print {
            @page { size: A5 landscape; margin: 6mm; }
            body { margin: 0; width: 210mm; height: 148mm; }
          }
        </style>
      </head>
      <body>
        <div class="page">

          <!-- HEADER -->
          <div class="header">
            <div class="store-block">
              <div class="store-name">${storeName}</div>
              <div class="store-sub">DỊCH VỤ CẦM ĐỒ CHUYÊN NGHIỆP</div>
              <div class="store-contact">
                📍 ${address}<br>
                📞 <b>${phone}</b> &nbsp;|&nbsp; Zalo: <b>${zalo}</b>
              </div>
            </div>

            <div class="title-block">
              <div class="republic">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div class="motto">Độc lập - Tự do - Hạnh phúc ★</div>
              <h1>HỢP ĐỒNG CẦM CỐ TÀI SẢN</h1>
              <div class="contract-id">Mã HĐ: ${receiptId}</div>
            </div>

            <div class="barcode-block">
              <div class="barcode-wrap">
                <div class="barcode-title-bar">MÃ TRA CỨU HĐ</div>
                <img src="${barcodeUrl}" alt="Barcode" class="barcode-img" />
                <div class="barcode-code">${barcodeValue}</div>
              </div>
            </div>
          </div>

          <!-- BODY: 3 columns -->
          <div class="body">

            <!-- COL LEFT: Khách hàng + Tài sản -->
            <div class="col col-left">
              <div class="section">
                <div class="section-header">👤 Thông tin khách hàng</div>
                <div class="section-body">
                  <div class="info-row">
                    <span class="info-label">Họ và tên</span>
                    <span class="info-colon">:</span>
                    <span class="info-value">${data.customer?.fullName || ''}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Số điện thoại</span>
                    <span class="info-colon">:</span>
                    <span class="info-value">${data.customer?.phoneNumber || ''}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Ngày lập HĐ</span>
                    <span class="info-colon">:</span>
                    <span class="info-value">${pawnDateStr}</span>
                  </div>
                </div>
              </div>

              <div class="section" style="flex:1">
                <div class="section-header">📦 Tài sản cầm cố</div>
                <div class="section-body">
                  <div class="info-row">
                    <span class="info-label">Loại tài sản</span>
                    <span class="info-colon">:</span>
                    <span class="info-value">${categoryLabel}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Tên / Mô tả</span>
                    <span class="info-colon">:</span>
                    <span class="info-value">${descriptionLabel}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Ghi chú</span>
                    <span class="info-colon">:</span>
                    <span class="info-value">${data.notes || '-'}</span>
                  </div>
                  <div class="info-row" style="margin-top: 4px;">
                    <span class="info-label">IMEI / Số khung</span>
                    <span class="info-colon">:</span>
                    <span class="info-value dotted-fill"></span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Mật khẩu / iCloud</span>
                    <span class="info-colon">:</span>
                    <span class="info-value dotted-fill"></span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Phụ kiện kèm</span>
                    <span class="info-colon">:</span>
                    <span class="info-value dotted-fill"></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- COL MID: Khoản vay + Cam kết -->
            <div class="col col-mid">
              <div class="section">
                <div class="section-header">💰 Thông tin khoản vay</div>
                <div class="section-body">
                  <div class="info-row">
                    <span class="info-label">Số tiền cầm</span>
                    <span class="info-colon">:</span>
                    <span class="info-value red big">${new Intl.NumberFormat('vi-VN').format(data.pawnAmount)} VNĐ</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Bằng chữ</span>
                    <span class="info-colon">:</span>
                    <span class="info-value" style="font-size:7.5px;font-weight:normal;">${pawnAmountWords}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Lãi suất</span>
                    <span class="info-colon">:</span>
                    <span class="info-value green">${interestRateLabel}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Tiền lãi/tháng</span>
                    <span class="info-colon">:</span>
                    <span class="info-value green">${estimatedInterestWords}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Ngày cầm</span>
                    <span class="info-colon">:</span>
                    <span class="info-value">${pawnDateStr}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Ngày đáo hạn</span>
                    <span class="info-colon">:</span>
                    <span class="info-value red">${dueDateStr}</span>
                  </div>
                </div>
              </div>

              <div class="section" style="flex:1">
                <div class="section-header">🏦 Chuyển khoản</div>
                <div class="section-body">
                  <div class="bank-name">${bankAccountName}</div>
                  <div class="bank-row">Ngân hàng: <b>${bankName}</b></div>
                  <div class="bank-row">Số TK: <b>${bankAccountNumber}</b></div>
                  <div class="bank-row">Nội dung: <b>Họ tên + Mã HĐ</b></div>
                </div>
              </div>
            </div>

            <!-- COL RIGHT: Những điều khách lưu ý -->
            <div class="col col-right">
              <div class="section" style="flex:1">
                <div class="section-header">📋 Những điều khách lưu ý</div>
                <div class="section-body">
                  <ul class="note-list">
                    <li><div class="note-num">1</div><div>Kể từ lúc cầm tới 7 ngày = 1 tuần, 8-15 ngày = 2 tuần, 16-22 ngày = 3 tuần, 23-30 ngày = 4 tuần.</div></li>
                    <li><div class="note-num">2</div><div>Biên nhận có giá trị 01 tháng (Điện thoại, iPad hạn 15 ngày). Quá hạn không đến chuộc hoặc đóng lãi, cửa hàng sẽ thanh lý thu hồi vốn.</div></li>
                    <li><div class="note-num">3</div><div>Xe không nổ, điện thoại không lên nguồn – cửa hàng không chịu trách nhiệm.</div></li>
                    <li><div class="note-num">4</div><div>Khách cam kết món hàng không tranh chấp. Giấy này thay cho giấy ủy quyền thanh lý tài sản.</div></li>
                    <li><div class="note-num">5</div><div>Mất giấy mà đã có người chuộc đồ – cửa hàng không chịu trách nhiệm.</div></li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          <!-- SIGNATURES -->
          <div class="sig-section">
            <div class="sig-box">
              <strong>KHÁCH HÀNG</strong>
              <em>(Ký và ghi rõ họ tên)</em>
              <div class="sig-line"></div>
            </div>
            <div class="sig-divider"></div>
            <div class="sig-box">
              <strong>ĐẠI DIỆN CỬA HÀNG</strong>
              <em>(Ký, ghi rõ họ tên và đóng dấu)</em>
              <div class="sig-line"></div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="footer-bar">
            ★ CẢM ƠN QUÝ KHÁCH ĐÃ TIN TƯỞNG SỬ DỤNG DỊCH VỤ CỦA ${storeName.toUpperCase()} ★
          </div>

        </div>
        <script>
          window.onload = () => { setTimeout(() => { window.print(); }, 800); };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
