import localFont from 'next/font/local';
import './globals.css';
import ClientSessionProvider from '@/providers/ClientSessionProvider';
import RootProviders from '@/providers/RootProviders';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata = {
  title: 'Tarello',
  description: 'A custom description of my Tarello application',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      url: '/logo.png',
    },
  ],
};

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: any;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientSessionProvider session={session}>
          {children}
          <RootProviders />
        </ClientSessionProvider>
      </body>
    </html>
  );
}
