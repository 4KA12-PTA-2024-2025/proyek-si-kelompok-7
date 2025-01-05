export default function Footer() {
  return (
    <footer className="p-6 bg-gray-100 text-gray-800">
      {/* Social Section */}
      <div className="container mx-auto text-center mb-8">
        <ul className="flex justify-center space-x-4">
          <li>
            <a
              href="https://www.facebook.com/chindy.marchellina?mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://img.icons8.com/fluent/50/000000/facebook-new.png"
                alt="Facebook"
              />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/warungnasimarsel"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://img.icons8.com/fluent/48/000000/instagram-new.png"
                alt="Instagram"
              />
            </a>
          </li>
          <li>
            <a
              href={`https://wa.me/6281295917717?text=${encodeURIComponent(
                `Halo! Terima kasih telah menghubungi Catering Warung Nasi Marsel.

Untuk melakukan pemesanan, silakan kirimkan detail berikut:
Nama:
Alamat lengkap:
Produk yang dipesan (beserta jumlah):
Metode pembayaran yang diinginkan:
Catatan tambahan (jika ada):

Kami akan mengonfirmasi pesanan Anda dan memberikan informasi lebih lanjut mengenai total pembayaran dan estimasi waktu pengiriman.

Terima kasih telah memilih Warung Nasi Marsel!
Apakah ada penyesuaian tertentu yang Anda inginkan?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://img.icons8.com/fluent/48/000000/whatsapp.png"
                alt="WhatsApp"
              />
            </a>
          </li>
        </ul>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-sm pt-8">
        <span className="text-gray-600">
          © Copyright 2024. All rights reserved. Designed By Warung Nasi Marsel
        </span>
      </div>
    </footer>
  );
}
