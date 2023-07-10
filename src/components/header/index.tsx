import LogoImg from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import { FiUser, FiLogIn } from "react-icons/fi";

export function Header() {
   const signer = false;
   const loadingAuth = false;

   return (
      <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4">
         <header className="flex w-full max-w-7xl px-4 mx-auto items-center justify-between">
            <Link to="/">
               <img src={LogoImg} alt="logo webcarros" />
            </Link>

            {!loadingAuth && signer && (
               <Link to="/dashboard">
                  <div className="border-2 rounded-full p-1 border-gray-900">
                     <FiUser size={22} color="#000" />
                  </div>
               </Link>
            )}
            {!loadingAuth && !signer && (
               <Link to="/login">
                  <div className="border-2 rounded-full p-1 border-gray-900">
                     <FiLogIn size={22} color="#000" />
                  </div>
               </Link>
            )}
         </header>
      </div>
   );
}
