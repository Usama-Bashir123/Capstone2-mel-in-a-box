// Reward stat card — gradient bg, floating illustration image, text bottom-left
// Label: Nunito 500 16px white; Value: Nunito 600 20px white/near-white

import Image from "next/image";

interface RewardStatCardProps {
  label: string;
  value: string;
  gradient: string;
  illustration: string;
  shadow: string;
}

export function RewardStatCard({ label, value, gradient, illustration, shadow }: RewardStatCardProps) {
  return (
    <div
      className="relative flex flex-col justify-end overflow-hidden flex-1"
      style={{ height: "148px", borderRadius: "12px", background: gradient, padding: "20px" }}
    >
      {/* Floating illustration — absolute top-right */}
      <div
        className="absolute"
        style={{ right: "0px", top: "0px", width: "160px", height: "148px" }}
      >
        <Image
          src={illustration}
          alt={label}
          fill
          style={{ objectFit: "contain", objectPosition: "right center", filter: shadow }}
        />
      </div>

      {/* Text */}
      <div className="relative z-10 flex flex-col gap-1">
        <p className="font-nunito font-medium text-white" style={{ fontSize: "16px", lineHeight: "24px" }}>
          {label}
        </p>
        <p className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#FFF5F6" }}>
          {value}
        </p>
      </div>
    </div>
  );
}
