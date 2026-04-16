# EduCore Backend

Node.js va Express bilan yozilgan EduCore ilovasi uchun backend API server.

## Texnologiyalar

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Ma'lumotlar bazasi (Mongoose ODM)
- **JWT** - Authentication
- **bcryptjs** - Parol hashing

## O'rnatish

1. Backend papkasiga kiring:
```bash
cd backend
```

2. Dependencieslarni o'rnating:
```bash
npm install
```

3. `.env` faylini yarating:
```bash
cp .env.example .env
```

4. `.env` faylini o'zingizga moslang:
```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:5173/educore
# yoki MongoDB Atlas
# MONGODB_URI=mongodb+srv://...

# JWT Secret
JWT_SECRET=Abubakr

# Server Port
PORT=5173
```

5. Serverni ishga tushiring:
```bash
# Development rejimida
npm run dev

# Production rejimida
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Ro'yxatdan o'tish
- `POST /api/auth/login` - Kirish
- `GET /api/auth/me` - Foydalanuvchi ma'lumotlari
- `PUT /api/auth/settings` - Sozlamalarni yangilash
- `PUT /api/auth/password` - Parolni o'zgartirish

### Students
- `GET /api/students` - Barcha o'quvchilar
- `POST /api/students` - Yangi o'quvchi
- `GET /api/students/:id` - O'quvchi ma'lumotlari
- `PUT /api/students/:id` - O'quvchini yangilash
- `DELETE /api/students/:id` - O'quvchini o'chirish
- `POST /api/students/:id/bonus` - Bonus qo'shish

### Teachers
- `GET /api/teachers` - Barcha o'qituvchilar
- `POST /api/teachers` - Yangi o'qituvchi
- `PUT /api/teachers/:id` - O'qituvchini yangilash
- `DELETE /api/teachers/:id` - O'qituvchini o'chirish

### Groups
- `GET /api/groups` - Barcha guruhlar
- `POST /api/groups` - Yangi guruh
- `GET /api/groups/:id` - Guruh ma'lumotlari
- `PUT /api/groups/:id` - Guruhni yangilash
- `DELETE /api/groups/:id` - Guruhni o'chirish

### Payments
- `GET /api/payments` - Barcha to'lovlar
- `POST /api/payments` - Yangi to'lov
- `DELETE /api/payments/:id` - To'lovni o'chirish

### Leads
- `GET /api/leads` - Barcha leadlar
- `POST /api/leads` - Yangi lead
- `PUT /api/leads/:id` - Leadni yangilash
- `DELETE /api/leads/:id` - Leadni o'chirish

### Attendance
- `GET /api/attendance` - Davomat yozuvlari
- `POST /api/attendance` - Davomat yozuvi
- `POST /api/attendance/bulk` - Guruh bo'yicha davomat

### Licenses
- `GET /api/licenses` - Barcha licenziyalar (admin)
- `POST /api/licenses` - Yangi licenziya (admin)
- `POST /api/licenses/activate` - Licenziyani faollashtirish

### Settings
- `GET /api/settings` - Foydalanuvchi sozlamalari
- `PUT /api/settings` - Sozlamalarni yangilash
- `POST /api/settings/reset` - Barcha ma'lumotlarni tozalash

## Ishga tushirish uchun talablar

- Node.js (v14 yoki undan yuqori)
- MongoDB (local yoki cloud)

Node.js va Express bilan yozilgan EduCore ilovasi uchun backend API server.

## Texnologiyalar

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Ma'lumotlar bazasi (Mongoose ODM)
- **JWT** - Authentication
- **bcryptjs** - Parol hashing

## O'rnatish

1. Backend papkasiga kiring:
```bash
cd backend
```

2. Dependencieslarni o'rnating:
```bash
npm install
```

3. `.env` faylini yarating:
```bash
cp .env.example .env
```

4. `.env` faylini o'zingizga moslang:
```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/educore
# yoki MongoDB Atlas
# MONGODB_URI=mongodb+srv://...

# JWT Secret
JWT_SECRET=your_secret_key

# Server Port
PORT=5000
```

5. Serverni ishga tushiring:
```bash
# Development rejimida
npm run dev

# Production rejimida
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Ro'yxatdan o'tish
- `POST /api/auth/login` - Kirish
- `GET /api/auth/me` - Foydalanuvchi ma'lumotlari
- `PUT /api/auth/settings` - Sozlamalarni yangilash
- `PUT /api/auth/password` - Parolni o'zgartirish

### Students
- `GET /api/students` - Barcha o'quvchilar
- `POST /api/students` - Yangi o'quvchi
- `GET /api/students/:id` - O'quvchi ma'lumotlari
- `PUT /api/students/:id` - O'quvchini yangilash
- `DELETE /api/students/:id` - O'quvchini o'chirish
- `POST /api/students/:id/bonus` - Bonus qo'shish

### Teachers
- `GET /api/teachers` - Barcha o'qituvchilar
- `POST /api/teachers` - Yangi o'qituvchi
- `PUT /api/teachers/:id` - O'qituvchini yangilash
- `DELETE /api/teachers/:id` - O'qituvchini o'chirish

### Groups
- `GET /api/groups` - Barcha guruhlar
- `POST /api/groups` - Yangi guruh
- `GET /api/groups/:id` - Guruh ma'lumotlari
- `PUT /api/groups/:id` - Guruhni yangilash
- `DELETE /api/groups/:id` - Guruhni o'chirish

### Payments
- `GET /api/payments` - Barcha to'lovlar
- `POST /api/payments` - Yangi to'lov
- `DELETE /api/payments/:id` - To'lovni o'chirish

### Leads
- `GET /api/leads` - Barcha leadlar
- `POST /api/leads` - Yangi lead
- `PUT /api/leads/:id` - Leadni yangilash
- `DELETE /api/leads/:id` - Leadni o'chirish

### Attendance
- `GET /api/attendance` - Davomat yozuvlari
- `POST /api/attendance` - Davomat yozuvi
- `POST /api/attendance/bulk` - Guruh bo'yicha davomat

### Licenses
- `GET /api/licenses` - Barcha licenziyalar (admin)
- `POST /api/licenses` - Yangi licenziya (admin)
- `POST /api/licenses/activate` - Licenziyani faollashtirish

### Settings
- `GET /api/settings` - Foydalanuvchi sozlamalari
- `PUT /api/settings` - Sozlamalarni yangilash
- `POST /api/settings/reset` - Barcha ma'lumotlarni tozalash

## Ishga tushirish uchun talablar

- Node.js (v14 yoki undan yuqori)
- MongoDB (local yoki cloud)

