import './globals.css'
import PropTypes from 'prop-types';

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
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};