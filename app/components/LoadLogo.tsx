import style from "@/styles/logoLoading.module.css";
import imgSrc from "@/assets/logo.png";

const LogoLoading = ({ progress = 0 }: { progress?: number }) => {
  return (
    <div className={style["image-container"]}>
      <img src={imgSrc} className={style.grayscale} />
      <img
        src={imgSrc}
        className={style.original}
        style={{ clipPath: `inset(${progress}% 0 0 0)` }}
      />
    </div>
  );
};

export default LogoLoading;
