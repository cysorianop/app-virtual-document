import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Configuración del proyecto en Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA86mU0nyyBKGNdpnekacKOcQYUJNzpoIU",
  authDomain: "virtual-document-drawer-app.firebaseapp.com",
  projectId: "virtual-document-drawer-app",
  storageBucket: "virtual-document-drawer-app.appspot.com",
  messagingSenderId: "46210911669",
  appId: "1:46210911669:web:fe6c788fca51f405855dfc"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);

// Exportación de servicios de Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };