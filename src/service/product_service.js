import {
  collection,
  setDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { firestore, storage } from "../config/firebase_config";

export const PRODUCT_QUERY = collection(firestore, "products");

const createNewProduct = async (values, file = null) => {
  const imgName = Math.round(new Date() / 1000) + "-" + file.name ?? "file";
  const { service_name, platform, rate, desc } = values;
  let img_url = "";

  try {
    const PRODUCT_IMG_REF = ref(storage, "product_img/" + imgName);
    const uploadImage = await uploadBytes(PRODUCT_IMG_REF, file);

    await getDownloadURL(uploadImage.ref).then((url) => (img_url = url));

    await setDoc(doc(PRODUCT_QUERY), {
      service_name: service_name,
      platform: platform,
      rate: rate,
      desc: desc,
      img_url: img_url,
      img_alt: service_name + " alt",
      img_path: PRODUCT_IMG_REF.fullPath,
    });
  } catch (error) {
    throw error;
  }
};

const getProduct = async (id) => {
  try {
    const item = await getDoc(doc(PRODUCT_QUERY, id));
    if (item.exists()) return item.data();
    throw new Error("Unable to get data.");
  } catch (error) {
    throw error;
  }
};

const getAllProduct = async () => {
  const list = [];
  const snap = await getDocs(PRODUCT_QUERY);
  snap?.forEach((element) => {
    list.push({ id: element.id, ...element.data() });
  });
  return list;
};

const updateProduct = async (id, values, file) => {
  const { service_name, platform, rate, desc, img_path } = values;
  try {
    if (file !== null) {
      const PRODDUC_DEL_REF = ref(storage, img_path);
      deleteObject(PRODDUC_DEL_REF);
      const imgName = Math.round(new Date() / 1000) + "-" + file.name ?? "file";
      let img_url = "";
      const PRODUCT_IMG_REF = ref(storage, "product_img/" + imgName);
      const uploadImage = await uploadBytes(PRODUCT_IMG_REF, file);
      await getDownloadURL(uploadImage.ref).then((url) => (img_url = url));
      await updateDoc(doc(PRODUCT_QUERY, id), {
        service_name: service_name,
        platform: platform,
        rate: rate,
        desc: desc,
        img_url: img_url,
        img_alt: service_name + " alt",
        img_path: PRODUCT_IMG_REF.fullPath,
      });

      return "Success";
    }

    if (file === null) {
      await updateDoc(doc(PRODUCT_QUERY, id), {
        service_name: service_name,
        platform: platform,
        rate: rate,
        desc: desc,
      });
      return "Success";
    }

    throw new Error("Can't Update at the moment");
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (id, path) => {
  const PRODUCT_IMG_REF = ref(storage, path);
  try {
    await deleteObject(PRODUCT_IMG_REF);
    await deleteDoc(doc(PRODUCT_QUERY, id));
  } catch (error) {
    throw new Error(error);
  }
};

const ProductService = {
  getProduct,
  createNewProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
};
export default ProductService;
