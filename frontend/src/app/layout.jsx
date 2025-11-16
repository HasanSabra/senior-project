import "./globals.css";

export const metadata = {
  title: "Voting App",
  description: "Senior Porject - Voting App",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-[#0e0e0e] text-[#ffffff]'>
        {children}
      </body>
    </html>
  );
}
