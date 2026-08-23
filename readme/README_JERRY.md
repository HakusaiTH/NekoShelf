# 📗 คู่มือทำงานสำหรับ Jerry (คนที่ 4)

**งานที่ได้รับมอบหมาย:** สร้าง Header และ Footer Partials Component (`views/partials/`)  
**Git Branch ของคุณ:** `feature/layout-partials`

---

## 🤖 คัดลอก Prompt ด้านล่างนี้ไปวางสั่ง AI (Antigravity / ChatGPT / Claude) ได้เลย:

```text
คุณคือ Assistant ช่วยเขียนโค้ดสำหรับโปรเจกต์ MVC Book Library

งานของคุณคือ:
1. สร้างไฟล์ Partials Component ในโฟลเดอร์ `views/partials/` ดังนี้:
   - สร้าง `views/partials/header.ejs`: มี Navigation Bar ด้านบน มี Logo 'BookHub', ช่อง Search bar ค้นหา (UI), และปุ่มลิงก์ '+ Add New Book'
   - สร้าง `views/partials/footer.ejs`: มีข้อมูล Copyright, ลิงก์ Social, และข้อความส่งเสริมการทำงานทีม
   - ใช้ SVG Vector Icons แทน Emoji ในทุกจุด
   - ออกแบบให้รองรับ Responsive แสดงผลได้ดีทั้งบนมือถือและคอมพิวเตอร์

2. เมื่อสร้างไฟล์ใน `views/partials/` เสร็จแล้ว ให้ช่วยรันคำสั่ง Git เพื่อส่งงานขึ้น GitHub ให้ด้วย ดังนี้:
   - สร้างและสลับไปยัง branch: `git checkout -b feature/layout-partials`
   - ตรวจสอบไฟล์: `git status`
   - เพิ่มไฟล์เข้า staging: `git add views/partials/`
   - บันทึก commit: `git commit -m "feat: create navbar header and footer layout partials"`
   - ส่งงานขึ้น GitHub: `git push origin feature/layout-partials`
```

---

## 🚀 ขั้นตอนการทำงานด้วยตัวเอง (กรณี AI ไม่ได้รัน Git ให้)

เปิด Terminal ใน VS Code (`Ctrl + ~`) แล้วพิมพ์ตามลำดับนี้:

1. **สร้าง Branch ใหม่:**
   ```bash
   git checkout -b feature/layout-partials
   ```
2. **สร้างและแก้ไขไฟล์ใน `views/partials/` (ให้ AI เจนให้)**
3. **บันทึกและ Push ขึ้น GitHub:**
   ```bash
   git add views/partials/
   git commit -m "feat: create navbar header and footer layout partials"
   git push origin feature/layout-partials
   ```
4. แจ้ง Leader (คนที่ 1) เพื่อกด Merge Pull Request!
