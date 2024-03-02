import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import LogoImg from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import { FiUser, FiLogIn } from "react-icons/fi";

export function Header() {
   const { signed, loadingAuth, user } = useContext(AuthContext);

   return (
      <div className="w-full flex items-center justify-center h-16 bg-zinc-900 drop-shadow mb-4">
         <header className="flex w-full max-w-7xl px-4 mx-auto items-center justify-between">
            <Link to="/">
               <img src={LogoImg} alt="logo webcarros" />
            </Link>

            {!loadingAuth && signed && (
               <Link to="/dashboard">
                  <div className="flex flex-row gap-3 items-center">
                     <p className="text-white max-sm:text-sm">
                        Olá, {user?.name.split(" ")[0]}
                     </p>
                     <div className="border-2 rounded-full p-1 border-white-900">
                        <FiUser size={22} color="#FFF" />
                     </div>
                  </div>
               </Link>
            )}
            {!loadingAuth && !signed && (
               <Link to="/login">
                  <div className=" flex flex-row items-center justify-items-center gap-1 rounded-full text-white border-2  p-2 border-white-900">
                     <button>Login</button>
                     <FiLogIn size={20} />
                  </div>
               </Link>
            )}
         </header>
      </div>
   );
}
