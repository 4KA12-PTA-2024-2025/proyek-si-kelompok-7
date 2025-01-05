import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gradient-to-r from-blue-600 to-blue-700 text-white min-h-screen">
      <ul className="mt-6">
        <li className="py-3 pl-6 hover:bg-blue-800 cursor-pointer">
          <Link to="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
            </svg>

            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
        </li>
        <hr className="my-4 border-t border-gray-300" />
        <li className="py-3 pl-6 hover:bg-blue-800 cursor-pointer">
          <Link to="/foods" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
            </svg>

            <i className="fas fa-utensils"></i>
            <span>Menu Makanan</span>
          </Link>
        </li>
        <li className="py-3 pl-6 hover:bg-blue-800 cursor-pointer">
          <Link to="/category" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"
                clipRule="evenodd"
              />
            </svg>

            <i className="fas fa-list"></i>
            <span>Kategori</span>
          </Link>
        </li>
        <li className="py-3 pl-6 hover:bg-blue-800 cursor-pointer">
          <Link to="/saran" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M12 2.25a9.75 9.75 0 1 0 9.75 9.75A9.75 9.75 0 0 0 12 2.25Zm1.03 14.53a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 0-1.06l3-3a.75.75 0 1 1 1.06 1.06L10.81 12l2.22 2.22a.75.75 0 0 1 0 1.06ZM12 4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V5.25A.75.75 0 0 1 12 4.5Z" />
            </svg>
            <span>Saran</span>
          </Link>
        </li>
        <li className="py-3 pl-6 hover:bg-blue-800 cursor-pointer">
          <Link to="/order" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M6 2.25a.75.75 0 0 0-1.5 0v1.5H3A1.5 1.5 0 0 0 1.5 5.25v13.5A1.5 1.5 0 0 0 3 20.25h18a1.5 1.5 0 0 0 1.5-1.5V5.25A1.5 1.5 0 0 0 21 3.75h-1.5v-1.5a.75.75 0 0 0-1.5 0v1.5h-12V2.25Zm-1.5 4.5h15v9H4.5V6.75ZM4.5 18v-1.5h15V18h-15Z" />
            </svg>
            <span>Orderan</span>
          </Link>
        </li>
        <li className="py-3 pl-6 hover:bg-blue-800 cursor-pointer">
          <Link to="/customers" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M16.75 3.75a4.25 4.25 0 1 1-8.5 0 4.25 4.25 0 0 1 8.5 0Z" />
              <path
                fillRule="evenodd"
                d="M12 10.25c-4.556 0-8.25 2.597-8.25 5.812v.688a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-.688c0-3.215-3.694-5.812-8.25-5.812Z"
                clipRule="evenodd"
              />
            </svg>
            <span>Customer Data</span>
          </Link>
        </li>
        <li className="py-3 pl-6 hover:bg-blue-800 cursor-pointer">
          <Link to="/payments" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M5.25 2.25h13.5a3 3 0 0 1 3 3v13.5a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3Zm.75 9.75a.75.75 0 0 0 0 1.5h12a.75.75 0 0 0 0-1.5h-12Z" />
            </svg>
            <span>Payments</span>
          </Link>
        </li>
        <li className="py-3 pl-6 hover:bg-blue-800 cursor-pointer">
          <Link to="/stok" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M2.25 4.5a.75.75 0 0 1 .75-.75h18a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-18a.75.75 0 0 1-.75-.75V4.5ZM4.5 6v11.25h15V6h-15Z" />
            </svg>
            <span>Stock Barang</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
