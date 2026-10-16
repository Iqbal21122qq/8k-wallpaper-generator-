# 🌌 Singularity 8K - Cosmic Black Hole Live Wallpaper & Video Generator

An ultra-high-definition (8K) cosmic black hole live motion simulator, AI video synthesizer (Veo 3), and mobile lock screen wallpaper testbench.

[![Build Singularity 8K App](https://github.com/actions/workflows/build.yml/badge.svg)](../../actions)

---

## 🚀 Features

- **60 FPS Relativistic Physics Engine:** Real-time general relativistic spacetime curvature, gravitational lensing light warp, Doppler beaming, innermost stable circular orbit (ISCO), and vertical relativistic plasma jet.
- **Mobile Lock Screen Simulator:** Interactive 9:16 portrait viewport simulating modern iOS 18 Glass and Android Material You lock screens with live clock, cosmic widgets, observatory notifications, and unlock bar.
- **Veo 3 AI Video Generation (`veo-3.1-fast-generate-preview`):**
  - **Image-to-Video:** Upload any photo or use the preloaded black hole to generate a moving video wallpaper.
  - **Text-to-Video:** Generate cinematic 8K cosmic wallpapers from text prompts in 9:16 (mobile) or 16:9 (desktop).
- **Gemini 4 Argon High Thinking (`gemini-4-argon` • ThinkingLevel.HIGH):** Explores astrophysics, Einstein's field equations, and designs optimized visual prompts for Veo 3.
- **Instant Download Center:**
  - **8K Ultra HD Still (4320 × 7680 PNG):** Crystal-clear static lock screen wallpaper.
  - **Live Video Wallpaper (60 FPS MP4/WebM Loop):** Direct 60fps recording for live mobile wallpaper loops.
  - **Veo 3 AI MP4 Video:** Download AI-synthesized MP4 videos.

---

## 🛠️ GitHub-এ Push করে অটোমেটিক Build করার নিয়ম (How to Push & Build on GitHub)

এই প্রোজেক্টে **GitHub Actions CI/CD** কনফিগার করা আছে। আপনি GitHub-এ কোড Push করলেই স্বয়ংক্রিয়ভাবে কোনো error ছাড়াই অ্যাপ বিল্ড হয়ে যাবে এবং ডাউনলোডযোগ্য `singularity-8k-dist` আর্টফ্যাক্ট তৈরি হবে।

### ধাপ ১: গিট রিপোজিটরি সেটআপ করুন (Setup Git)

টার্মিনালে নিচের কমান্ডগুলো চালান:

```bash
# গিট রিপোজিটরি শুরু করুন
git init

# সব ফাইল যোগ করুন
git add .

# কমিট করুন
git commit -m "feat: Singularity 8K black hole live wallpaper generator"

# ব্রাঞ্চের নাম main করুন
git branch -M main

# আপনার GitHub রিপোজিটরির লিংক যোগ করুন (আপনার ইউজারনেম ও রিপো নাম দিন)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# GitHub-এ কোড পুশ করুন
git push -u origin main
```

---

### ধাপ ২: GitHub-এ বিল্ড দেখা ও ডাউনলোড করা (View Build on GitHub)

1. আপনার GitHub রিপোজিটরিতে যান।
2. উপরের **Actions** ট্যাবে ক্লিক করুন।
3. **Build Singularity 8K App** ওয়ার্কফ্লোটি স্বয়ংক্রিয়ভাবে রান হতে দেখতে পাবেন।
4. বিল্ড সফলভাবে শেষ হলে (সবুজ টিক মার্ক ✔️), নিচে **Artifacts** সেকশনে ক্লিক করে `singularity-8k-dist.zip` ডাউনলোড করে নিতে পারবেন!

---

## 💻 লোকাল কম্পিউটারে রান করার নিয়ম (Local Development)

### প্রয়োজনীয়তা:
- Node.js 20 বা তার চেয়ে নতুন সংস্করণ
- npm বা bun

### ইন্সটলেশন:
```bash
# ডিপেন্ডেন্সি ইন্সটল করুন
npm install

# ডেভেলপমেন্ট সার্ভার চালু করুন (Port 3000)
npm run dev
```
ব্রাউজারে ওপেন করুন: `http://localhost:3000`

### প্রডাকশন বিল্ড টেস্ট করা:
```bash
# টাইপচেক ও লিন্ট
npm run lint

# প্রডাকশন বান্ডেল তৈরি (dist/ ফোল্ডার)
npm run build

# প্রডাকশন সার্ভার রান করা
npm run start
```

---

## 🐳 Docker Deployment (ডকার দিয়ে চালানো)

```bash
# ডকার ইমেজ তৈরি করুন
docker build -t singularity-8k .

# ডকার কন্টেইনার চালান
docker run -p 3000:3000 -e GEMINI_API_KEY="YOUR_KEY" singularity-8k
```

---

## 🔑 Environment Variables (.env)

প্রোজেক্টের রুট ডিরেক্টরিতে একটি `.env` ফাইল তৈরি করুন:

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
PORT=3000
```

---

## 📄 লাইসেন্স (License)

Apache-2.0
