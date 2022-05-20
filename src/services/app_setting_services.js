import { collection, doc, getDoc, updateDoc } from "@firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { firestore, storage } from "../config/firebase_config";

export const QUERY_APP = collection(firestore, "app_config");

const getAppSettingsInfo = async () => {
  try {
    const data = await getDoc(doc(QUERY_APP, "wDa3KaDTIaNAyrVEr7Bz"));
    if (data.exists()) return { id: data.id, ...data.data() };
    return null;
  } catch (error) {
    throw error;
  }
};

const updateValue = async (value) => {
  try {
    await updateDoc(doc(QUERY_APP, "wDa3KaDTIaNAyrVEr7Bz"), {
      ...value,
    });
  } catch (error) {
    throw error;
  }
};

const updateProfileImage = async (value, file) => {
  const { img_path } = value;
  try {
    if (img_path !== "") {
      const PRODDUC_DEL_REF = ref(storage, img_path);
      deleteObject(PRODDUC_DEL_REF);
    }

    const imgName = Math.round(new Date() / 1000) + "-" + file.name ?? "file";
    let img_url = "";
    const PRODUCT_IMG_REF = ref(storage, "app_img/" + imgName);
    const uploadImage = await uploadBytes(PRODUCT_IMG_REF, file);
    await getDownloadURL(uploadImage.ref).then((url) => (img_url = url));

    await updateDoc(doc(QUERY_APP, "wDa3KaDTIaNAyrVEr7Bz"), {
      img_url: img_url,
      img_alt: "app-icn-alt",
      img_path: PRODUCT_IMG_REF.fullPath,
    });
  } catch (error) {
    throw error;
  }
};

const AppSettingService = {
  getAppSettingsInfo,
  updateValue,
  updateProfileImage,
};

export default AppSettingService;
