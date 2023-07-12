import { Container } from "../../../components/container";
import { DashboardPanel } from "../../../components/panelHeader";
import { FiUpload, FiTrash } from "react-icons/fi";

import { useForm } from "react-hook-form";
import { Input } from "../../../components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState, useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import { v4 as uuidV4 } from "uuid";

import { storage } from "../../../services/firebaseConnection";
import {
   ref,
   uploadBytes,
   getDownloadURL,
   deleteObject,
} from "firebase/storage";

const scheme = z.object({
   name: z.string().nonempty("O campo nome é obrigatório"),
   model: z.string().nonempty("O modelo nome é obrigatório"),
   year: z.string().nonempty("O ano do carro é obrigatório"),
   km: z.string().nonempty("O km do carro é obrigatório"),
   price: z.string().nonempty("O preço é obrigatório"),
   city: z.string().nonempty("A cidade é obrigatória"),
   whatsapp: z
      .string()
      .min(1, "O telefone é obrigatório")
      .refine((value) => /^(\d{10,12})$/.test(value), {
         message: "Numero de telefone invalido",
      }),
   description: z.string().nonempty("A descrição é obrigatória"),
});

type FormData = z.infer<typeof scheme>;

interface ImageItemProps {
   uid: string;
   name: string;
   previewUrl: string;
   url: string;
}

export function New() {
   const { user } = useContext(AuthContext);
   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm<FormData>({
      resolver: zodResolver(scheme),
      mode: "onChange",
   });

   const [carImage, setCarImage] = useState<ImageItemProps[]>([]);

   function onSubmit(data: FormData) {
      console.log(data);
   }
   async function handleFile(e: ChangeEvent<HTMLInputElement>) {
      if (e.target.files && e.target.files[0]) {
         const image = e.target.files[0];

         if (image.type === "image/jpeg" || image.type === "image/png") {
            //enviar pro banco a imagem...
            await handleUpload(image);
         } else {
            alert("Envie uma imagem jpeg ou png!");
            return;
         }
      }
   }

   async function handleUpload(image: File) {
      if (!user?.uid) {
         return;
      }

      const currentUid = user?.uid;
      const uidImage = uuidV4();

      const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);

      uploadBytes(uploadRef, image).then((snapshot) => {
         getDownloadURL(snapshot.ref).then((downloadUrl) => {
            const imageItem = {
               name: uidImage,
               uid: currentUid,
               previewUrl: URL.createObjectURL(image),
               url: downloadUrl,
            };

            setCarImage((images) => [...images, imageItem]);
         });
      });
   }

   async function handleDeleteImage(item: ImageItemProps) {
      const imagePath = `images/${item.uid}/${item.name}`;

      const imageRef = ref(storage, imagePath);

      try {
         await deleteObject(imageRef);
         setCarImage(carImage.filter((car) => car.url !== item.url));
      } catch (err) {
         console.log("ERRO AO DELETAR");
      }
   }

   return (
      <div>
         <Container>
            <DashboardPanel />

            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
               <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                  <div className="absolute cursor-pointer">
                     <FiUpload size={30} color="#000" />
                  </div>
                  <div className="cursor-pointer">
                     <input
                        onChange={handleFile}
                        type="file"
                        accept="image/*"
                        className="opacity-0 cursor-pointer"
                     />
                  </div>
               </button>
               {carImage.map((item) => (
                  <div
                     key={item.name}
                     className="w-full h-32 flex items-center justify-center relative"
                  >
                     <button
                        className="absolute"
                        onClick={() => handleDeleteImage(item)}
                     >
                        <FiTrash size={28} color="#fff" />
                     </button>
                     <img
                        src={item.previewUrl}
                        className="rounded-lg w-full h-32 object-cover"
                        alt="Foto do carro"
                     />
                  </div>
               ))}
            </div>

            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
               <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                     <p className="mb-2 font-medium">Nome do carro</p>
                     <Input
                        type="text"
                        register={register}
                        name="name"
                        error={errors.name?.message}
                        placeholder="Ex: Onix 1.0..."
                     />
                  </div>

                  <div className="mb-3">
                     <p className="mb-2 font-medium">Modelo do carro</p>
                     <Input
                        type="text"
                        register={register}
                        name="model"
                        error={errors.model?.message}
                        placeholder="Ex: 1.0 Flex PLUS MANUAL..."
                     />
                  </div>

                  <div className="flex w-full mb-3 flex-row items-center gap-4">
                     <div className="w-full">
                        <p className="mb-2 font-medium">Ano</p>
                        <Input
                           type="text"
                           register={register}
                           name="year"
                           error={errors.year?.message}
                           placeholder="Ex: 2016/2016..."
                        />
                     </div>

                     <div className="w-full">
                        <p className="mb-2 font-medium">KM rodados</p>
                        <Input
                           type="text"
                           register={register}
                           name="km"
                           error={errors.km?.message}
                           placeholder="Ex: 23.900..."
                        />
                     </div>
                  </div>

                  <div className="flex w-full mb-3 flex-row items-center gap-4">
                     <div className="w-full">
                        <p className="mb-2 font-medium">Telefone / Whatsapp</p>
                        <Input
                           type="text"
                           register={register}
                           name="whatsapp"
                           error={errors.whatsapp?.message}
                           placeholder="Ex: 011999101923..."
                        />
                     </div>

                     <div className="w-full">
                        <p className="mb-2 font-medium">Cidade</p>
                        <Input
                           type="text"
                           register={register}
                           name="city"
                           error={errors.city?.message}
                           placeholder="Ex: Campo Grande - MS..."
                        />
                     </div>
                  </div>

                  <div className="mb-3">
                     <p className="mb-2 font-medium">Preço</p>
                     <Input
                        type="text"
                        register={register}
                        name="price"
                        error={errors.price?.message}
                        placeholder="Ex: 69.000..."
                     />
                  </div>

                  <div className="mb-3">
                     <p className="mb-2 font-medium">Descrição</p>
                     <textarea
                        className="border-2 w-full rounded-md h-24 px-2"
                        {...register("description")}
                        name="description"
                        id="description"
                        placeholder="Digite a descrição completa sobre o carro..."
                     />
                     {errors.description && (
                        <p className="mb-1 text-red-500">
                           {errors.description.message}
                        </p>
                     )}
                  </div>

                  <button
                     type="submit"
                     className="w-full rounded-md bg-zinc-900 text-white font-medium h-10"
                  >
                     Cadastrar
                  </button>
               </form>
            </div>
         </Container>
      </div>
   );
}
