# 📕 คู่มือทำงานสำหรับ Roger (คนที่ 5)

**งานที่ได้รับมอบหมาย:** พัฒนา Design System & Theme Styling (`public/css/style.css`)  
**Git Branch ของคุณ:** `feature/theme-styles`

---

## 🤖 คัดลอก Prompt ด้านล่างนี้ไปวางสั่ง AI (Antigravity / ChatGPT / Claude) ได้เลย:

```text
คุณคือ Assistant ช่วยเขียนโค้ดสำหรับโปรเจกต์ MVC Book Library

งานของคุณคือ:
1. ปรับแต่งพัฒนาไฟล์ `public/css/style.css` ให้เป็น Modern Design System:
   - กำหนด CSS Variables สำหรับธีม (Primary: #4F46E5, Secondary: #06B6D4, Background: #F8FAFC, Text: #0F172A, Accent: #F59E0B)
   - ปรับแต่ง Style ของ Components กลางทั้งหมด เช่น `.btn`, `.form-control`, `.card`, `.table`, `.badge`, `.modal`
   - ใส่ Smooth Micro-animations สำหรับ Hover และ Transition
   - ตรวจสอบระบบ Responsive Breakpoints บนหน้าจอมือถือและคอมพิวเตอร์ให้สมบูรณ์สวยงาม

2. เมื่อแก้ไขไฟล์ `public/css/style.css` เสร็จแล้ว ให้ช่วยรันคำสั่ง Git เพื่อส่งงานขึ้น GitHub ให้ด้วย ดังนี้:
   - สร้างและสลับไปยัง branch: `git checkout -b feature/theme-styles`
   - ตรวจสอบไฟล์: `git status`
   - เพิ่มไฟล์เข้า staging: `git add public/css/style.css`
   - บันทึก commit: `git commit -m "feat: enhance theme design system and responsiveness"`
   - ส่งงานขึ้น GitHub: `git push origin feature/theme-styles`
```

---

## 🚀 ขั้นตอนการทำงานด้วยตัวเอง (กรณี AI ไม่ได้รัน Git ให้)

เปิด Terminal ใน VS Code (`Ctrl + ~`) แล้วพิมพ์ตามลำดับนี้:

1. **สร้าง Branch ใหม่:**
   ```bash
   git checkout -b feature/theme-styles
   ```
2. **ปรับแต่งไฟล์ `public/css/style.css` (ให้ AI เจนให้)**
3. **บันทึกและ Push ขึ้น GitHub:**
   ```bash
   git add public/css/style.css
   git commit -m "feat: enhance theme design system and responsiveness"
   git push origin feature/theme-styles
   ```
4. แจ้ง Leader (คนที่ 1) เพื่อกด Merge Pull Request!
