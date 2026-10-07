import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Ensure data storage directory exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Helper to read JSON file
function readData<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

// Helper to write JSON file safely
function writeData<T>(filePath: string, data: T) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

export interface UserRecord {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  eventType: 'baekil' | 'dol';
  eventDate: string;
  babyName: string;
  babyGender: 'boy' | 'girl';
  hanbokColor: string;
  addFakeRiceCake: boolean;
  addBumboCover: boolean;
  addTable: boolean;
  customerName: string;
  phone: string;
  address: string;
  detailAddress: string;
  deliveryNote: string;
  totalPrice: number;
  status: '결제 완료' | '배송중' | '배송완료' | '접수 완료' | '입금 확인' | '배송 준비중' | '발송 완료' | '행사 중' | '반납 수거' | '수거 완료' | '완료' | '결제 완료 (연습)' | string;
  paymentMethod?: string;
  paymentStatus?: string;
  adminNotes?: string;
  trackingNumber?: string;
}

// Real-time SSE Clients for live order updates
const sseClients: express.Response[] = [];

function broadcastOrderUpdate(type: 'NEW_ORDER' | 'STATUS_CHANGE', order: OrderRecord) {
  const payload = JSON.stringify({ type, order, timestamp: new Date().toISOString() });
  for (let i = sseClients.length - 1; i >= 0; i--) {
    const client = sseClients[i];
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      sseClients.splice(i, 1);
    }
  }
}

export interface InquiryRecord {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  text: string;
  isResolved: boolean;
}

// Pre-populate with realistic initial order if empty
if (!fs.existsSync(ORDERS_FILE)) {
  const initialOrders: OrderRecord[] = [
    {
      id: 'ord-sample-1',
      orderNumber: 'MG-202610-8921',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      eventType: 'baekil',
      eventDate: '2026-10-24',
      babyName: '이지안',
      babyGender: 'girl',
      hanbokColor: '살구빛 단아 핑크 한복 (무료)',
      addFakeRiceCake: true,
      addBumboCover: false,
      addTable: false,
      customerName: '이소영',
      phone: '010-9876-5432',
      address: '서울특별시 송파구 올림픽로 300',
      detailAddress: '102동 1404호',
      deliveryNote: '경비실에 맡겨주세요',
      totalPrice: 79000,
      status: '입금 확인'
    }
  ];
  writeData(ORDERS_FILE, initialOrders);
}

// --- API Routes ---

// 0. User Registration (회원가입)
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        error: '이메일 주소를 입력해 주세요.'
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: '올바른 이메일 주소 형식으로 입력해 주세요. (예: baby@naver.com)'
      });
    }

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        error: '성함(또는 닉네임)을 입력해 주세요.'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        error: '비밀번호를 입력해 주세요.'
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        error: '비밀번호는 6자 이상이어야 합니다. 6자리 이상으로 안전하게 입력해 주세요.'
      });
    }

    const users = readData<UserRecord[]>(USERS_FILE, []);
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: '이미 가입된 이메일 주소입니다. 기존 계정으로 로그인해 주세요.'
      });
    }

    const newUser: UserRecord = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      password: String(password),
      name: String(name).trim(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeData(USERS_FILE, users);

    console.log(`[User Registered] ${newUser.name} (${newUser.email})`);

    return res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({
      success: false,
      error: '회원가입 처리 중 오류가 발생했습니다.'
    });
  }
});

// 0-1. User Login (로그인)
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: '이메일과 비밀번호를 모두 입력해 주세요.'
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        error: '비밀번호는 6자 이상이어야 합니다. 입력 내용을 확인해 주세요.'
      });
    }

    const users = readData<UserRecord[]>(USERS_FILE, []);
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: '가입되지 않은 이메일 주소입니다. 이메일을 확인하시거나 먼저 회원가입을 진행해 주세요.'
      });
    }

    if (user.password !== String(password)) {
      return res.status(401).json({
        success: false,
        error: '비밀번호가 일치하지 않습니다. 다시 한번 확인해 주세요.'
      });
    }

    console.log(`[User Logged In] ${user.name} (${user.email})`);

    return res.json({
      success: true,
      message: '로그인되었습니다.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      error: '로그인 처리 중 오류가 발생했습니다.'
    });
  }
});

// 1. Create a real guest rental order
app.post('/api/orders', (req, res) => {
  try {
    const {
      eventType,
      eventDate,
      babyName,
      babyGender,
      hanbokColor,
      addFakeRiceCake,
      addBumboCover,
      addTable,
      customerName,
      phone,
      address,
      detailAddress,
      deliveryNote,
      totalPrice,
    } = req.body;

    if (!eventType || !eventDate || !customerName || !phone || !address) {
      return res.status(400).json({
        success: false,
        error: '필수 입력 항목(행사종류, 날짜, 이름, 연락처, 주소)이 누락되었습니다.'
      });
    }

    const orders = readData<OrderRecord[]>(ORDERS_FILE, []);
    const timestamp = Date.now();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${dateStr}-${randomSuffix}`;

    const { paymentMethod, paymentStatus } = req.body;

    const newOrder: OrderRecord = {
      id: `ord_${timestamp}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      eventType: eventType || 'baekil',
      eventDate,
      babyName: babyName || '',
      babyGender: babyGender || 'girl',
      hanbokColor: hanbokColor || '살구빛 단아 핑크 한복 (무료)',
      addFakeRiceCake: Boolean(addFakeRiceCake),
      addBumboCover: Boolean(addBumboCover),
      addTable: Boolean(addTable),
      customerName,
      phone: phone.replace(/[^0-9-]/g, ''),
      address,
      detailAddress: detailAddress || '',
      deliveryNote: deliveryNote || '',
      totalPrice: Number(totalPrice) || 79000,
      status: '결제 완료 (연습)',
      paymentMethod: paymentMethod || '신용카드 (연습용)',
      paymentStatus: paymentStatus || '승인 완료 (연습용 가짜 결제)',
      adminNotes: '',
    };

    orders.unshift(newOrder);
    writeData(ORDERS_FILE, orders);

    console.log(`[New Order Received] Order Number: ${orderNumber}, Customer: ${customerName}, Date: ${eventDate}`);

    // Real-time broadcast to all connected seller screens
    broadcastOrderUpdate('NEW_ORDER', newOrder);

    return res.status(201).json({
      success: true,
      message: '대여 주문이 정상적으로 서버에 등록되었습니다.',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      error: '주문 처리 중 서버 오류가 발생했습니다.'
    });
  }
});

// 1-1. SSE Live Stream for Real-Time Order Dashboard
app.get('/api/orders/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.push(res);

  // Send initial ping
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: '실시간 주문 스트림 연결됨' })}\n\n`);

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

// 2. Query Orders (Supports lookup by phone or orderNumber, or all for admin)
app.get('/api/orders', (req, res) => {
  try {
    const { phone, orderNumber } = req.query;
    const orders = readData<OrderRecord[]>(ORDERS_FILE, []);

    if (phone) {
      const cleanPhone = String(phone).replace(/[^0-9]/g, '');
      const filtered = orders.filter(o => o.phone.replace(/[^0-9]/g, '').includes(cleanPhone));
      return res.json({ success: true, orders: filtered });
    }

    if (orderNumber) {
      const filtered = orders.filter(o =>
        o.orderNumber.toLowerCase() === String(orderNumber).trim().toLowerCase()
      );
      return res.json({ success: true, orders: filtered });
    }

    // Default: return all orders (for store owner admin board)
    return res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ success: false, error: '주문 조회 중 오류가 발생했습니다.' });
  }
});

// 3. Update Order Status (for Admin / Store Owner)
app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, trackingNumber } = req.body;
    const orders = readData<OrderRecord[]>(ORDERS_FILE, []);

    const orderIndex = orders.findIndex(o => o.id === id || o.orderNumber === id);
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: '해당 주문을 찾을 수 없습니다.' });
    }

    if (status) orders[orderIndex].status = status;
    if (adminNotes !== undefined) orders[orderIndex].adminNotes = adminNotes;
    if (trackingNumber !== undefined) orders[orderIndex].trackingNumber = trackingNumber;

    writeData(ORDERS_FILE, orders);

    // Broadcast status change in real time
    broadcastOrderUpdate('STATUS_CHANGE', orders[orderIndex]);

    return res.json({ success: true, order: orders[orderIndex] });
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ success: false, error: '주문 상태 변경 중 오류가 발생했습니다.' });
  }
});

// 4. Guest 1:1 Inquiries
app.post('/api/inquiries', (req, res) => {
  try {
    const { name, phone, text } = req.body;
    if (!name || !phone || !text) {
      return res.status(400).json({ success: false, error: '모든 항목을 입력해 주세요.' });
    }

    const inquiries = readData<InquiryRecord[]>(INQUIRIES_FILE, []);
    const newInquiry: InquiryRecord = {
      id: `inq_${Date.now()}`,
      createdAt: new Date().toISOString(),
      name,
      phone,
      text,
      isResolved: false
    };

    inquiries.unshift(newInquiry);
    writeData(INQUIRIES_FILE, inquiries);
    return res.status(201).json({ success: true, inquiry: newInquiry });
  } catch (error) {
    console.error('Error saving inquiry:', error);
    return res.status(500).json({ success: false, error: '상담 접수 중 오류가 발생했습니다.' });
  }
});

app.get('/api/inquiries', (_req, res) => {
  const inquiries = readData<InquiryRecord[]>(INQUIRIES_FILE, []);
  return res.json({ success: true, inquiries });
});

// --- Vite Middleware Integration ---
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Mongle Day Server] Running at http://localhost:${PORT}`);
  });
}

startServer();
