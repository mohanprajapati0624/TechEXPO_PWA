import Image from "next/image";

export function BrandLogo() {
  return <div className="brand-logo"><Image src="/logos/softqube-logo.svg" alt="Softqube Technologies" width={240} height={60} priority /></div>;
}
