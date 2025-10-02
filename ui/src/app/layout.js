import '../styles/globals.css';

export const metadata = {
  title: 'Gaza Platform',
  description: 'Support Gaza - Donation and Profile Management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
