# 📙 คู่มือทำงานสำหรับ Ammy (คนที่ 3)

**งานที่ได้รับมอบหมาย:** ตกแต่งหน้าแก้ไขหนังสือ (`views/edit.ejs`)  
**Git Branch ของคุณ:** `feature/edit-book`

---

## 🤖 คัดลอก Prompt ด้านล่างนี้ไปวางสั่ง AI (Antigravity / ChatGPT / Claude) ได้เลย:

```text
คุณคือ Assistant ช่วยเขียนโค้ดสำหรับโปรเจกต์ MVC Book Library

งานของคุณคือ:
1. ปรับแต่งตกแต่งไฟล์ `views/edit.ejs` ให้ดูสวยงาม ทันสมัย และเป็นมืออาชีพ
   - คงโครงสร้าง `<form action="/books/<%= book.id %>?_method=PUT" method="POST">` และค่า value เดิม (`<%= book.title %>`, `<%= book.author %>`, `<%= book.genre %>`, `<%= book.published_year %>`) ไว้ครบถ้วน ห้ามทำให้การส่งข้อมูลพัง
   - จัดวาง Form เป็น Card ตรงกลางหน้าจอ พร้อมใส่ SVG Vector Icons หน้ารายการ input
   - ปรับปุ่ม "Update Book" ให้ดูเรียบหรู และมีปุ่ม "Cancel" กลับหน้าหลัก (`/`)
   - ออกแบบโซนปุ่มลบหนังสือ (Delete Button) ให้แยกโซนอันตราย (Danger Zone) ชัดเจน พร้อมมี Confirm Dialog ยืนยันก่อนกดลบ
   - ใช้ CSS class ที่เข้ากันกับ `/css/style.css`

2. เมื่อแก้ไขไฟล์ `views/edit.ejs` เสร็จแล้ว ให้ช่วยรันคำสั่ง Git เพื่อส่งงานขึ้น GitHub ให้ด้วย ดังนี้:
   - สร้างและสลับไปยัง branch: `git checkout -b feature/edit-book`
   - ตรวจสอบไฟล์: `git status`
   - เพิ่มไฟล์เข้า staging: `git add views/edit.ejs`
   - บันทึก commit: `git commit -m "feat: redesign edit book form and delete section UI"`
   - ส่งงานขึ้น GitHub: `git push origin feature/edit-book`
```

---

## 🚀 ขั้นตอนการทำงานด้วยตัวเอง (กรณี AI ไม่ได้รัน Git ให้)

เปิด Terminal ใน VS Code (`Ctrl + ~`) แล้วพิมพ์ตามลำดับนี้:

1. **สร้าง Branch ใหม่:**
   ```bash
   git checkout -b feature/edit-book
   ```
2. **แก้ไขไฟล์ `views/edit.ejs` (ให้ AI เจนให้)**
3. **บันทึกและ Push ขึ้น GitHub:**
   ```bash
   git add views/edit.ejs
   git commit -m "feat: redesign edit book form and delete section UI"
   git push origin feature/edit-book
   ```
4. แจ้ง Leader (คนที่ 1) เพื่อกด Merge Pull Request!
