import type { ReactNode, SVGProps } from "react";

type IconProps = { size?: number } & SVGProps<SVGSVGElement>;

function Icon({
  children,
  size = 20,
  ...rest
}: { children: ReactNode; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9.5h18" />
      <path d="M8 2.5v4M16 2.5v4" />
      <path d="M8 14l2 2 4-4" />
    </Icon>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" strokeWidth="0">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.031 21.784h-.005a9.87 9.87 0 0 1-5.048-1.384l-.362-.216-3.75.984.998-3.65-.236-.375a9.86 9.86 0 0 1-1.51-5.26c0-5.451 4.436-9.887 9.918-9.887 2.649 0 5.137 1.032 7.008 2.905a9.825 9.825 0 0 1 2.903 6.994c-.002 5.45-4.438 9.889-9.916 9.889zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .177 5.318.177 11.869c0 2.096.552 4.14 1.6 5.943L.079 24l6.335-1.662a11.9 11.9 0 0 0 5.63 1.43h.005c6.554 0 11.876-5.318 11.876-11.869a11.822 11.822 0 0 0-3.481-8.412z" />
    </Icon>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" strokeWidth="0">
      <path d="M12 20.5s-7.5-4.6-10-9.3C.4 8 1.9 4.5 5.3 4c2.1-.3 4 .9 4.9 2.6a1 1 0 0 0 1.6 0C12.7 4.9 14.6 3.7 16.7 4c3.4.5 4.9 4 3.3 7.2-2.5 4.7-10 9.3-10 9.3z" />
    </Icon>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2" />
    </Icon>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1-4 4-6 7-6s6 2 7 6" />
    </Icon>
  );
}

export function DiamondIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 9l4-5h10l4 5-11 12z" />
      <path d="M3 9h18M9.5 4l-2 5 4.5 12 4.5-12-2-5" />
    </Icon>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </Icon>
  );
}

export function CrownIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" strokeWidth="0.5">
      <path d="M3 8l4 3 5-6 5 6 4-3-2 10H5L3 8z" />
      <path d="M5 20h14" strokeWidth="1.7" />
    </Icon>
  );
}

export function ImageIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="m21 16-5.5-5.5L9 17" />
    </Icon>
  );
}

export function FeatherIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20.5 3.5c-5 0-13 4-16 12-1 2.5.5 6.5 3 5.5C15 17 19 9 20.5 3.5z" />
      <path d="M15 8 6 17" />
      <path d="M11 12 7.5 15.5" />
    </Icon>
  );
}

export function BrushIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9.5 14.5 19 5a1.4 1.4 0 0 1 2 2l-9.5 9.5" />
      <path d="M11 13c1 1.5 1 3-.5 4.5C9 19 7 19.5 5 19c1-1.5.5-2.5-.5-3.5-1.3-1.3-1.3-3 0-4.2 1.3-1.2 3.3-1.2 4.5.1z" />
    </Icon>
  );
}

export function GraduationCapIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4 2 9l10 5 10-5-10-5z" />
      <path d="M6 11.5V17c0 1.5 3 3 6 3s6-1.5 6-3v-5.5" />
      <path d="M22 9v6" />
    </Icon>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 20c8 0 14-6 14-14V4h-2C9 4 5 10 5 18v2z" />
      <path d="M5 20c3-5 6-8 12-11" />
    </Icon>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A9.9 9.9 0 0 1 12 5c7 0 10.5 7 10.5 7a13.3 13.3 0 0 1-3.1 4" />
      <path d="M6.6 6.6C3.6 8.5 1.5 12 1.5 12s3.5 7 10.5 7a9.9 9.9 0 0 0 4.4-1" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </Icon>
  );
}
