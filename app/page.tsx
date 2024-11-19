"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ImageItem = {
  id: string;
  src: string;
  alt: string;
  tags?: string[];
};

export default function Component() {
  const [analyzingStates, setAnalyzingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const [images, setImages] = useState<ImageItem[]>([]);
  const [imageTags, setImageTags] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    console.log("image tags..", imageTags);
  }, [imageTags]);

  useEffect(() => {
    fetch("http://localhost:8080/images", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      const data = await res.json();
      const unsplashImages = JSON.parse(data?.message);
      setImages(() => {
        return unsplashImages?.map((el: any) => {
          return {
            id: el?.id,
            src: el?.urls?.regular,
            alt: el?.description || "An Image of Mother Nature",
          };
        });
      });
    });
  }, []);

  const handleAnalyze = async (id: string) => {
    setAnalyzingStates((prev) => ({ ...prev, [id]: true }));

    await fetch("http://localhost:8080/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: images?.find((el) => el?.id == id)?.src }),
    }).then(async (res) => {
      const data = await res.json();
      const tags = JSON.parse(data?.message);
      setImages((old) => {
        return old?.map((el: ImageItem) => {
          return {
            ...el,
            tags: tags,
          };
        });
      });
      setTimeout(() => {
        setImageTags((prev) => ({ ...prev, [id]: tags }));
        setAnalyzingStates((prev) => ({ ...prev, [id]: false }));
      }, 1000);
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <Image
              src={image.src}
              alt={image.alt}
              width={100}
              height={100}
              className="w-full h-auto rounded-lg"
            />
            <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 p-2 rounded-b-lg">
              <div className="flex flex-wrap justify-center gap-2">
                {imageTags[image.id] ? (
                  imageTags[image.id].map((tag, index) => (
                    <span
                      key={index}
                      className="bg-white text-black px-2 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-white text-sm">No tags yet</span>
                )}
              </div>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
              {analyzingStates[image.id] && (
                <div className="text-white">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
              {!imageTags[image.id] && !analyzingStates[image.id] && (
                <Button
                  onClick={() => handleAnalyze(image.id)}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Analyze
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
