"use client";

import React, { useState, useEffect, useRef } from "react";

import { CldImage } from "next-cloudinary";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;
//The keyof operator takes an object type and produces a string or numeric literal union of its keys



function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string |null>(null);

  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");

  const [isUploading, setIsUploading] = useState(false)

  const [isTransforming,setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null)


  useEffect(()=>{
    if(uploadedImage){
      setIsTransforming(true)
    }
  },[selectedFormat,uploadedImage])

  //handle file upload 
  const handleFileUpload = async(event:React.ChangeEvent<HTMLInputElement>) =>{
    const file = event.target.files?.[0];
    if(!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file",file);

    try {
      const response = await fetch("/api/image-upload",{
        method:"POST",
        body:formData
      })

      if(!response.ok) throw new Error("Failed to upload image")

        const data = await response.json();
        setUploadedImage(data.publicId);

    } catch (error) {
      console.log(error);
      alert("Failed to upload image");
      
    }finally{
      setIsUploading(false);
    }
  };

  return <div>Im on social share pages</div>;
}

export default SocialShare;
