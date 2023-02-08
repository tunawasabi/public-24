import Image from "next/image";

const EyeCatch: React.FC<{ src?: string }> = ({ src }) => {

    if (!src) {
        return null;
    }

    return (
        <div className="relative aspect-video w-screen left-1/2 -translate-x-1/2 md:w-full md:left-0 md:translate-x-0 bg-neutral-800">
            <Image src={src} fill sizes="100vw" loading="lazy" alt="アイキャッチ画像" style={{ objectFit: 'contain' }} />
        </div>

    );
}
export default EyeCatch;
