# 📘 คู่มือทำงานสำหรับ Namo (คนที่ 2)

**งานที่ได้รับมอบหมาย:** ตกแต่งหน้าเพิ่มหนังสือ (`views/add.ejs`)  
**Git Branch ของคุณ:** `feature/add-book`

---

## 🤖 คัดลอก Prompt ด้านล่างนี้ไปวางสั่ง AI (Antigravity / ChatGPT / Claude) ได้เลย:

```text
คุณคือ Assistant ช่วยเขียนโค้ดสำหรับโปรเจกต์ MVC Book Library

งานของคุณคือ:
1. ปรับแต่งตกแต่งไฟล์ `views/add.ejs` ให้สวยงาม ทันสมัย แบบ Modern Clean UI
   - คงโครงสร้าง `<form action="/books" method="POST">` และ name attributes (`title`, `author`, `genre`, `published_year`) ไว้ครบถ้วน ห้ามเปลี่ยนชื่อ name เด็ดขาด
   - จัดวาง Form เป็น Card ตรงกลางหน้าจอ มีเงาสวยงาม (Box Shadow)
   - ใช้ SVG Vector Icons ประกอบหน้าช่อง Input แต่ละช่อง (เช่น ไอคอนชื่อหนังสือ, ผู้แต่ง, หมวดหมู่, ปีที่พิมพ์)
   - ปรับปุ่ม "Save Book" ให้โดดเด่นด้วย Hover Effect และมีปุ่ม "Cancel" ลิงก์กลับหน้าหลัก (`/`)
   - ใช้ CSS class ที่รองรับกับ `/css/style.css`

2. เมื่อแก้ไขไฟล์ `views/add.ejs` เสร็จแล้ว ให้ช่วยรันคำสั่ง Git เพื่อส่งงานขึ้น GitHub ให้ด้วย ดังนี้:
   - สร้างและสลับไปยัง branch: `git checkout -b feature/add-book`
   - ตรวจสอบไฟล์: `git status`
   - เพิ่มไฟล์เข้า staging: `git add views/add.ejs`
   - บันทึก commit: `git commit -m "feat: redesign add book form page UI"`
   - ส่งงานขึ้น GitHub: `git push origin feature/add-book`
```

---

## 🚀 ขั้นตอนการทำงานด้วยตัวเอง (กรณี AI ไม่ได้รัน Git ให้)

เปิด Terminal ใน VS Code (`Ctrl + ~`) แล้วพิมพ์ตามลำดับนี้:

1. **สร้าง Branch ใหม่:**
   ```bash
   git checkout -b feature/add-book
   ```
2. **แก้ไขไฟล์ `views/add.ejs` (ให้ AI เจนให้)**
3. **บันทึกและ Push ขึ้น GitHub:**
   ```bash
   git add views/add.ejs
   git commit -m "feat: redesign add book form page UI"
   git push origin feature/add-book
   ```
4. แจ้ง Leader (คนที่ 1) เพื่อกด Merge Pull Request!
