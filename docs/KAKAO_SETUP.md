# Kakao Share Button Setup

This guide explains how to set up the Kakao share button feature in your application.

## Prerequisites

1. A Kakao Developers account
2. A registered application on Kakao Developers
3. Your website domain registered as a platform

## Setup Steps

### 1. Get Your JavaScript Key

1. Go to [Kakao Developers](https://developers.kakao.com/)
2. Navigate to your application
3. Go to "앱 설정" (App Settings) → "앱 키" (App Keys)
4. Copy your "JavaScript 키" (JavaScript Key)

### 2. Configure Environment Variables

Add your Kakao JavaScript Key to your `.env` file:

```bash
VITE_KAKAO_JS_KEY=your_kakao_javascript_key_here
```

Replace `your_kakao_javascript_key_here` with your actual JavaScript Key.

### 3. Register Your Domain

1. In Kakao Developers, go to "플랫폼" (Platform)
2. Add your website domain (e.g., `https://scheduler.shofar.ai`)
3. Save the changes

## Usage

The Kakao share button is displayed in the schedule display section when a valid `VITE_KAKAO_JS_KEY` is configured. The button will be:
- **Greyed out/disabled** initially and until the user clicks "Copy All"
- **Active/enabled** after the user has copied the schedule text

This ensures users have the schedule text in their clipboard before sharing to Kakao.

### Component Usage

You can use the `KakaoShareButton` component anywhere in your app:

```tsx
import { KakaoShareButton } from './components/KakaoShareButton'

<KakaoShareButton
  title="Your Title"
  description="Your Description"
  imageUrl="https://your-domain.com/image.png"
  url="https://your-domain.com/page"
/>
```

### Props

- `title` (optional): The title shown in the Kakao share message
- `description` (optional): The description shown in the share message
- `imageUrl` (optional): The image URL to display (defaults to your logo)
- `url` (optional): The URL to share (defaults to current page)

## Testing

1. Make sure your `.env` file has the correct `VITE_KAKAO_JS_KEY`
2. Restart your development server
3. Generate a schedule
4. Notice the Kakao share button is greyed out/disabled
5. Click the "Copy All" button to copy the schedule text
6. The Kakao share button will become active (bright yellow)
7. Click the Kakao share button
8. The Kakao share dialog should appear

## Troubleshooting

### Button doesn't appear
- Check that `VITE_KAKAO_JS_KEY` is set in your `.env` file
- Restart your development server after adding the key

### Button is greyed out
- This is expected behavior - click "Copy All" first to enable the share button
- The button ensures users copy the schedule before sharing

### "먼저 전체 복사 버튼을 클릭하여 스케줄을 복사해주세요" alert
- Click the "Copy All" button first to copy the schedule text
- The share button will then become active

### "카카오톡 공유 기능을 불러오는 중입니다" alert
- The Kakao SDK is still loading, wait a moment and try again
- Check your internet connection

### Share dialog doesn't open
- Verify your domain is registered in Kakao Developers
- Check browser console for errors
- Ensure the Kakao SDK script is loading correctly

## Production Deployment

When deploying to production (Railway):

1. Add `VITE_KAKAO_JS_KEY` to your Railway environment variables
   - Go to your Railway project
   - Navigate to Variables tab
   - Add: `VITE_KAKAO_JS_KEY` = `your_kakao_javascript_key_here`

2. Ensure your production domain is registered in Kakao Developers
   - Go to Kakao Developers → Your App → Platform
   - Add your production domain (e.g., `https://scheduler.shofar.ai`)

3. Deploy/Redeploy your application
   - The `railway.toml` configuration will pass the environment variable as a build argument
   - Vite will embed the key into the JavaScript bundle during build

4. Test the share functionality on the production site

**Important:** Railway passes environment variables as build arguments during the Docker build process. The key is embedded into the frontend bundle at build time, not runtime.


## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Use different Kakao apps for development and production if needed
- The Kakao JavaScript Key is embedded in the frontend bundle (it's meant to be public)
- Sensitive operations should be handled by your backend, not the Kakao JS SDK
