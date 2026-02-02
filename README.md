# InTime - Dispatch & Delivery Services

A modern, responsive landing page for InTime, a Nigerian dispatch and delivery services company that connects users with a large pool of trusted dispatch riders.

## 🚀 Features

- **Modern Design**: Premium UI with InTime brand colors (Navy Blue, Orange, Gray)
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Smooth Animations**: Engaging micro-animations and transitions
- **WhatsApp Integration**: Direct connection to WhatsApp Business
- **SEO Optimized**: Proper meta tags and structured data
- **Fast Performance**: Built with Next.js 13+ and optimized for Nigerian internet speeds

## 🎨 Brand Colors

- **Navy Blue**: `#0E1221` - Primary background and text
- **Orange**: `#F94C05` - CTAs and accents
- **Gray**: `#B4B4B4` - Secondary text
- **White**: `#FFFFFF` - Text on dark backgrounds
- **Black**: `#000000` - Deep text

## 🛠️ Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Styling**: Tailwind CSS v3
- **Language**: JavaScript
- **Font**: Inter (Google Fonts)

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
├── app/
│   ├── layout.js          # Root layout with metadata
│   ├── page.js            # Main landing page
│   └── globals.css        # Global styles and Tailwind
├── components/
│   ├── Navbar.js          # Navigation bar
│   ├── Hero.js            # Hero section with CTA
│   ├── ValueProposition.js # Benefits section
│   ├── HowItWorks.js      # 3-step process
│   ├── ServiceCoverage.js # Cities coverage
│   ├── FinalCTA.js        # Final conversion section
│   └── Footer.js          # Footer with links
├── public/                # Static assets
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration
└── package.json           # Dependencies
```

## 🔧 Configuration

### WhatsApp Number
Update the WhatsApp number in:
- `components/Hero.js`
- `components/HowItWorks.js`
- `components/FinalCTA.js`
- `components/Footer.js`

Replace `2348000000000` with your actual WhatsApp Business number.

### SEO Metadata
Update SEO information in `app/layout.js`:
- Title
- Description
- Keywords
- Open Graph tags

## 📱 Sections

1. **Hero Section**: Eye-catching intro with main CTA
2. **Service Coverage**: Nigerian cities served
3. **Value Proposition**: 4 key benefits (Network, Prices, Speed, Reliability)
4. **How It Works**: 3-step process to get started
5. **Final CTA**: Conversion section with stats
6. **Footer**: Links, contact info, and social media

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and deploy

### Build for Production

```bash
npm run build
npm start
```

## 📝 Future Enhancements

- [ ] Mobile app integration (iOS/Android)
- [ ] Real-time tracking preview
- [ ] Pricing calculator
- [ ] Multi-language support
- [ ] Blog section
- [ ] Customer dashboard

## 📄 License

© 2026 InTime. All rights reserved.

## 🇳🇬 Made in Nigeria

Built with ❤️ for Nigerian businesses.
