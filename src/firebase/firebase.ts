import { initializeApp } from "firebase/app";
import { getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBuUgEijLQjzldw_-_lbE10rcPwNIFVUeU",
  authDomain: "codeflix-ab741.firebaseapp.com",
  projectId: "codeflix-ab741",
  storageBucket: "codeflix-ab741.appspot.com",
  messagingSenderId: "57506794159",
  appId: "1:57506794159:web:30c8de2d9b27b6e524a25a",
  measurementId: "G-VXH9VNSQ8D",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export {storage}