import { useState } from "react";

const useImageHook = () => {
  const [image, setImage] = useState({
    alt: null,
    url: null,
    value: null,
  });

  const change = (e) => {
    const image = e.target.files[0];
    let blob = new Blob([image], { type: "image/jpg" });
    setImage({
      url: URL.createObjectURL(blob),
      alt: e.target.name,
      value: image,
    });
  };

  return [image, change];
};

export default useImageHook;
