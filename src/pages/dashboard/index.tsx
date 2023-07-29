import { Container } from "../../components/container";
import { DashboardPanel } from "../../components/panelHeader";
import { FiTrash2 } from "react-icons/fi";
import { useEffect, useState, useContext } from "react";

import { toast } from "react-hot-toast";

import {
   collection,
   getDocs,
   where,
   query,
   doc,
   deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../../services/firebaseConnection";
import { ref, deleteObject } from "firebase/storage";
import { AuthContext } from "../../context/authContext";

interface CarsProps {
   id: string;
   name: string;
   year: string;
   uid: string;
   price: string | number;
   km: string;
   city: string;
   images: CarImageProps[];
}
interface CarImageProps {
   name: string;
   uid: string;
   url: string;
}
export function Dashboard() {
   const [cars, setCars] = useState<CarsProps[]>([]);
   const { user } = useContext(AuthContext);

   useEffect(() => {
      if (!user?.uid) {
         return;
      }
      function loadCars() {
         const carsRef = collection(db, "cars");
         const queryRef = query(carsRef, where("uid", "==", user.uid));

         getDocs(queryRef).then((snapshot) => {
            let listCars = [] as CarsProps[];

            snapshot.forEach((doc) => {
               listCars.push({
                  id: doc.id,
                  name: doc.data().name,
                  year: doc.data().year,
                  km: doc.data().km,
                  city: doc.data().city,
                  price: doc.data().price,
                  images: doc.data().images,
                  uid: doc.data().uid,
               });
            });
            setCars(listCars);
            //console.log(listCars);
         });
      }
      loadCars();
   }, [user]);

   async function handleDeleteCar(car: CarsProps) {
      const itemCar = car;

      const docRef = doc(db, "cars", itemCar.id);
      await deleteDoc(docRef);

      itemCar.images.map(async (image) => {
         const imagePath = `images/${image.uid}/${image.name}`;
         const imageRef = ref(storage, imagePath);

         try {
            await deleteObject(imageRef);
            setCars(cars.filter((car) => car.id !== itemCar.id));
            toast.success("Carro deletado com sucesso!");
         } catch (err) {
            console.log("erro ao excluir essa imagem");
         }
      });
   }
   return (
      <Container>
         <DashboardPanel />
         <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
               <section
                  key={car.id}
                  className="w-full bg-white rounded-lg relative"
               >
                  <button
                     onClick={() => {
                        handleDeleteCar(car);
                     }}
                     className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-1 drop-shadow"
                  >
                     <FiTrash2 size={25} color="#000" />
                  </button>
                  <img
                     className="w-full rounded-lg mb-2 max-h-70"
                     src={car.images[0].url}
                     alt="Carro"
                  />
                  <p className="font-bold mt-1 px-2 pb-2">{car.name}</p>
                  <div className="flex flex-col px-2 ">
                     <span className="text-zinc-700">
                        Ano {car.year} | {car.km} km
                     </span>
                     <strong className="text-black font-bold mt-4">
                        R$ {car.price}
                     </strong>
                  </div>
                  <div className="w-full h-px bg-slate-200 my-2"> </div>
                  <div className="px-2 pb-2">
                     <span className="text-black">{car.city}</span>
                  </div>
               </section>
            ))}
         </main>
      </Container>
   );
}
