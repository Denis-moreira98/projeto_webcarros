import LogoImg from "../../assets/logo.svg";
import { Container } from "../../components/container";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "../../components/input";

import { auth } from "../../services/firebaseConnection";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

import { toast } from "react-hot-toast";

const scheme = z.object({
   email: z
      .string()
      .email("Insira um email válido")
      .nonempty("O campo email é obrigatório"),
   password: z.string().nonempty("O campo senha é obrigatório"),
});

type FormData = z.infer<typeof scheme>;

export function Login() {
   const navigate = useNavigate();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormData>({
      resolver: zodResolver(scheme),
      mode: "onChange",
   });

   useEffect(() => {
      async function handleLogOut() {
         await signOut(auth);
      }
      handleLogOut();
   }, []);

   function onSubmit(data: FormData) {
      signInWithEmailAndPassword(auth, data.email, data.password)
         .then(() => {
            console.log("logado com sucesso");
            toast.success("Logado com sucesso!");
            navigate("/dashboard", { replace: true });
         })
         .catch((error) => {
            console.log("ERRO AO LOGAR");
            console.log(error);
            toast.error("Erro ao fazer o login.");
         });
   }

   return (
      <Container>
         <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
            <Link to="/" className="mb-6 max-w-sm w-full">
               <img src={LogoImg} alt="Logo" className="w-full" />
            </Link>
            <form
               onSubmit={handleSubmit(onSubmit)}
               className="bg-white max-w-xl w-full rounded-lg p-4"
            >
               <div className="mb-3">
                  <Input
                     type="email"
                     placeholder="Digite seu email..."
                     name="email"
                     error={errors.email?.message}
                     register={register}
                  />
               </div>
               <div className="mb-3">
                  <Input
                     type="password"
                     placeholder="Digite sua senha..."
                     name="password"
                     error={errors.password?.message}
                     register={register}
                  />
               </div>

               <button
                  type="submit"
                  className="bg-zinc-900 w-full rounded-lg font-medium text-white font-medium h-10"
               >
                  Acessar
               </button>
            </form>
            <Link className="font-medium" to="/register">
               Ainda não possui uma conta? Cadastre-se!
            </Link>
         </div>
      </Container>
   );
}
