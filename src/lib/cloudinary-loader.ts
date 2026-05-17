export default function cloudinaryLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const cleanSrc = src.replace(
    `https://res.cloudinary.com/${process.env.CLOUDINARY_URL}/image/upload/`,
    "",
  );

  const params = ["f_auto", "q_auto", `w_${width}`, "c_limit"].join(",");

  return `https://res.cloudinary.com/${process.env.CLOUDINARY_URL}/image/upload/${params}/${cleanSrc}`;
}
