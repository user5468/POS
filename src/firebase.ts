import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA49mQIpqvNORehX7fvs_EB5xTcKWSC2hU",
  authDomain: "depositosanjudas-praxis.firebaseapp.com",
  projectId: "depositosanjudas-praxis",
  storageBucket: "depositosanjudas-praxis.firebasestorage.app",
  messagingSenderId: "405711005956",
  appId: "1:405711005956:web:b7b93ea358b3342e5cc851",
  measurementId: "G-VMZKVK53XM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
