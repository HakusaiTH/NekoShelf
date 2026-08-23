# 📚 MVC Book Library - Frontend Refactoring & Team Guide

โปรเจกต์ MVC Book Library (Express + EJS + SQLite) สำหรับการพัฒนา Frontend ร่วมกันในทีม 5 คน

---

## 👥 สรุปการแบ่งงานในทีม (Frontend Tasks - 5 คน)

| สมาชิก | ไฟล์ที่รับผิดชอบ | ขอบเขตงาน (Responsibilities) | Git Branch | คู่มือประจำตัว |
| :--- | :--- | :--- | :--- | :--- |
| **คนที่ 1 (Leader / ตัวคุณ)** | `views/index.ejs` | **หน้าแรก & Book Catalog:** ออกแบบ Dashboard, Grid/Table View แสดงหนังสือ | `main` | - |
| **คนที่ 2 (Namo)** | `views/add.ejs` | **หน้าเพิ่มหนังสือ:** ตกแต่ง Form เพิ่มหนังสือ, Validation UI, ปุ่ม Save/Cancel | `feature/add-book` | 📘 [README_NAMO.md](file:///c:/Users/Fujiwara/code/mvc-book-library/README_NAMO.md) |
| **คนที่ 3 (Ammy)** | `views/edit.ejs` | **หน้าแก้ไขหนังสือ:** ตกแต่ง Form แก้ไข, ปุ่ม Confirm / Danger Zone สำหรับปุ่มลบ | `feature/edit-book` | 📙 [README_AMMY.md](file:///c:/Users/Fujiwara/code/mvc-book-library/README_AMMY.md) |
| **คนที่ 4 (Jerry)** | `views/partials/` | **Header & Footer:** สร้าง Navbar ด้านบน (พร้อมช่องค้นหา UI), และ Footer ด้านล่าง | `feature/layout-partials` | 📗 [README_JERRY.md](file:///c:/Users/Fujiwara/code/mvc-book-library/README_JERRY.md) |
| **คนที่ 5 (Roger)** | `public/css/style.css` | **Design System & Theme:** กำหนด CSS Variables, Color Palette, Buttons, Cards | `feature/theme-styles` | 📕 [README_ROGER.md](file:///c:/Users/Fujiwara/code/mvc-book-library/README_ROGER.md) |

---

## 🚀 ลิงก์ตรงส่งคู่มือพร้อม Prompt สำเร็จรูปให้เพื่อนในกลุ่ม

สามารถคัดลอกข้อความในไฟล์คู่มือแยกประจำตัว ส่งให้เพื่อนแต่ละคนไปวางสั่ง AI ได้ทันที:

- 📘 **ส่งให้ Namo (คนที่ 2):** [README_NAMO.md](file:///c:/Users/Fujiwara/code/mvc-book-library/README_NAMO.md)
- 📙 **ส่งให้ Ammy (คนที่ 3):** [README_AMMY.md](file:///c:/Users/Fujiwara/code/mvc-book-library/README_AMMY.md)
- 📗 **ส่งให้ Jerry (คนที่ 4):** [README_JERRY.md](file:///c:/Users/Fujiwara/code/mvc-book-library/README_JERRY.md)
- 📕 **ส่งให้ Roger (คนที่ 5):** [README_ROGER.md](file:///c:/Users/Fujiwara/code/mvc-book-library/README_ROGER.md)

*(ในแต่ละไฟล์จะมี Prompt สำเร็จรูปที่สั่งให้ AI แก้ไขโค้ด + สั่งให้ AI รัน `git checkout -b`, `git commit` และ `git push` ขึ้น GitHub ให้เลยในชุดคำสั่งเดียว)*

---

## 🛠️ วิธีเปิดรันโปรเจกต์ทดสอบในเครื่อง

1. ติดตั้ง Dependencies (ทำครั้งแรกครั้งเดียว):
   ```bash
   npm install
   ```
2. เริ่มรันเซิร์ฟเวอร์:
   ```bash
   npm start
   ```
3. เปิดเว็บเบราว์เซอร์ไปที่: [http://localhost:3000](http://localhost:3000)
