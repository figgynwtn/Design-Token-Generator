import './globals.css'

export const metadata = {
  title: 'Design Token Generator',
  description: 'Generate design systems from a single color',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}