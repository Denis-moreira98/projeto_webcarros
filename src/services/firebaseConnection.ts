import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
   apiKey: "AIzaSyCkHr-kY4l82sS--yuYl6LITQLJdM7iqKs",
   authDomain: "webcarros-3135d.firebaseapp.com",
   projectId: "webcarros-3135d",
   storageBucket: "webcarros-3135d.appspot.com",
   messagingSenderId: "427146627385",
   appId: "1:427146627385:web:310676306dbe48f14f40e8",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
