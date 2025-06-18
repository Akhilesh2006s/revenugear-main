import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'REVENUEGEAR',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon using a JPG image */}
        <link rel="icon" type="image/jpeg" href="/favicon.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
      </head>
      <body>
        {/* Optional: Logo header shown on all pages */}
        <header className="flex items-center gap-3 p-4 shadow-sm">
          <img
            src="logo1.png"
            alt="RevenueGear Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-xl font-bold text-[#006C67]">RevenueGear</h1>
        </header>

        {/* Main Page Content */}
        {children}
      </body>
    </html>
  )
}
