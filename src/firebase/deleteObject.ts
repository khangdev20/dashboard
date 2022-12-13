import { deleteObject, ref } from "firebase/storage";
import { storage } from "./firebase";

export const deleteObjectFirebase = (value: string) => {
  const deleteRef = ref(storage, value);
  deleteObject(deleteRef)
    .then(() => {
      console.log("delete ok!" + value);
    })
    .catch((err) => {
      console.log("delete failed!" + err)
    });
};

