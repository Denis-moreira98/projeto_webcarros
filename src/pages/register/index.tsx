import LogoImg from "../../assets/logo.svg";
import { Container } from "../../components/container";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/input";

import { auth } from "../../services/firebaseConnection";
import {
   createUserWithEmailAndPassword,
   updateProfile,
   signOut,
} from "firebase/auth";
import { AuthContext } from "../../context/authContext";

import { toast } from "react-hot-toast";

const scheme = z.object({
   name: z.string().nonempty("O campo nome é obrigatório"),
   email: z
      .string()
      .email("Insira um email válido")
      .nonempty("O campo email é obrigatório"),
   password: z
      .string()
      .min(6, "A senha deve conter no mínimo 6 caracteres")
      .nonempty("O campo de senha é obrigatório"),
});

type FormData = z.infer<typeof scheme>;

export function Register() {
   const { handleInfoUser } = useContext(AuthContext);
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

   async function onSubmit(data: FormData) {
      createUserWithEmailAndPassword(auth, data.email, data.password)
         .then(async (user) => {
            await updateProfile(user.user, {
               displayName: data.name,
            });
            handleInfoUser({
               name: data.name,
               email: data.email,
               uid: user.user.uid,
            });
            console.log("Cadastrado com sucesso");
            toast.success("Cadastrado com sucesso!");
            navigate("/login", { replace: true });
         })
         .catch((error) => {
            console.log("Erro ao cadastrar esse usuário");
            console.log(error);
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
                     type="text"
                     placeholder="Digite seu nome completo..."
                     name="name"
                     error={errors.name?.message}
                     register={register}
                  />
               </div>

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
                  className="bg-zinc-900 w-full rounded-lg font-medium text-white h-10"
               >
                  Cadastrar
               </button>
            </form>
            <Link className="font-medium" to="/login">
               Já possui uma conta? Faça o login!
            </Link>
         </div>
      </Container>
   );
}
