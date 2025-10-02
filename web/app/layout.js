import './globals.css'

export const metadata = {
  title: 'Gaza Humanitarian Platform',
  description: 'Supporting communities in Gaza',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
