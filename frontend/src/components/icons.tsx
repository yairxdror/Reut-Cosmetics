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
      <path d="M8 4H16L21 10L12 21L3 10Z" />
      <path d="M3 10H21M8 4L12 21M16 4L12 21" />
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

export function PerfumeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="7" y="10.5" width="10" height="9.5" rx="2.5" />
      <path d="M9.5 10.5V8a2.5 2.5 0 0 1 5 0v2.5" />
      <rect x="9.7" y="3.5" width="4.6" height="3" rx="1" />
      <path d="M7 15h10" />
    </Icon>
  );
}

export function MakeupBrushIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="6" r="4" />
      <path d="M12 9.5 9 4M12 9.5 10.6 3.3M12 9.5 12 3M12 9.5 13.4 3.3M12 9.5 15 4" />
      <path d="M9.3 9.8 10 12.5h4l.7-2.7" />
      <path d="M10 12.9h4" />
      <path d="M10.3 13.3V19a1.7 1.7 0 0 0 3.4 0v-5.7" />
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

export function StarIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" strokeWidth="1">
      <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.2 1.3-6.6-4.9-4.6 6.6-.8z" />
    </Icon>
  );
}

export function QuoteIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" strokeWidth="0">
      <path d="M9.5 6.5c-3.3 1-5.2 3.6-5.2 7 0 2.6 1.6 4.3 3.7 4.3 1.8 0 3.1-1.3 3.1-3.1 0-1.7-1.2-2.9-2.7-2.9-.2 0-.4 0-.5.1.2-1.9 1.5-3.4 3.3-4.1l-1.7-1.3zm9.4 0c-3.3 1-5.2 3.6-5.2 7 0 2.6 1.6 4.3 3.7 4.3 1.8 0 3.1-1.3 3.1-3.1 0-1.7-1.2-2.9-2.7-2.9-.2 0-.4 0-.5.1.2-1.9 1.5-3.4 3.3-4.1l-1.7-1.3z" />
    </Icon>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 20l1-4L15.5 5.5l3 3L8 19l-4 1z" />
      <path d="M13.5 6.5l3 3" />
    </Icon>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" strokeWidth="0">
      <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
    </Icon>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" strokeWidth="0">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </Icon>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" strokeWidth="0">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </Icon>
  );
}

export function AccessibilityIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" strokeWidth="0">
      <circle cx="12" cy="4" r="2" />
      <path d="M4.5 8.5c2.3.9 5 1.4 7.5 1.4s5.2-.5 7.5-1.4l.6 1.9c-1.7.7-3.6 1.2-5.5 1.4l1.9 9.4-2.1.4-1.8-8.7-1.8 8.7-2.1-.4 1.9-9.4c-1.9-.2-3.8-.7-5.5-1.4z" />
    </Icon>
  );
}

export function LocationPinIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21s7-6.5 7-11.5a7 7 0 1 0-14 0C5 14.5 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
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

export function WazeIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" strokeWidth="0">
      <path d="M13.218 0C9.915 0 6.835 1.49 4.723 4.148c-1.515 1.913-2.31 4.272-2.31 6.706v1.739c0 .894-.62 1.738-1.862 1.813-.298.025-.547.224-.547.522-.05.82.82 2.31 2.012 3.502.82.844 1.788 1.515 2.832 2.036a3 3 0 0 0 2.955 3.528 2.966 2.966 0 0 0 2.931-2.385h2.509c.323 1.689 2.086 2.856 3.974 2.21 1.64-.546 2.36-2.409 1.763-3.924a12.84 12.84 0 0 0 1.838-1.465 10.73 10.73 0 0 0 3.18-7.65c0-2.882-1.118-5.589-3.155-7.625A10.899 10.899 0 0 0 13.218 0zm0 1.217c2.558 0 4.967.994 6.78 2.807a9.525 9.525 0 0 1 2.807 6.78A9.526 9.526 0 0 1 20 17.585a9.647 9.647 0 0 1-6.78 2.807h-2.46a3.008 3.008 0 0 0-2.93-2.41 3.03 3.03 0 0 0-2.534 1.367v.024a8.945 8.945 0 0 1-2.41-1.788c-.844-.844-1.316-1.614-1.515-2.11a2.858 2.858 0 0 0 1.441-.846 2.959 2.959 0 0 0 .795-2.036v-1.789c0-2.11.696-4.197 2.012-5.861 1.863-2.385 4.62-3.726 7.6-3.726zm-2.41 5.986a1.192 1.192 0 0 0-1.191 1.192 1.192 1.192 0 0 0 1.192 1.193A1.192 1.192 0 0 0 12 8.395a1.192 1.192 0 0 0-1.192-1.192zm7.204 0a1.192 1.192 0 0 0-1.192 1.192 1.192 1.192 0 0 0 1.192 1.193 1.192 1.192 0 0 0 1.192-1.193 1.192 1.192 0 0 0-1.192-1.192zm-7.377 4.769a.596.596 0 0 0-.546.845 4.813 4.813 0 0 0 4.346 2.757 4.77 4.77 0 0 0 4.347-2.757.596.596 0 0 0-.547-.845h-.025a.561.561 0 0 0-.521.348 3.59 3.59 0 0 1-3.254 2.061 3.591 3.591 0 0 1-3.254-2.061.64.64 0 0 0-.546-.348z" />
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

export function LogoutIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </Icon>
  );
}

export function TextSizeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 20L12 4L20 20" />
      <path d="M7.4 14h9.2" />
    </Icon>
  );
}

export function ContrastIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <Icon {...props} fill="currentColor" strokeWidth="0">
      <rect x="4.5" y="4" width="4" height="16" rx="1.3" />
      <rect x="15.5" y="4" width="4" height="16" rx="1.3" />
    </Icon>
  );
}

export function UnderlineIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 4v7a8 8 0 0 0 16 0V4" />
      <path d="M4 20h16" />
    </Icon>
  );
}

export function BookOpenIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5c-2-1.5-4.9-2-8-1v14c3.1-1 6-.5 8 1 2-1.5 4.9-2 8-1V4c-3.1-1-6-.5-8 1z" />
      <path d="M12 5v15" />
    </Icon>
  );
}

export function DropletIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4s7.5 6.2 7.5 9.5a7.5 7.5 0 0 1-15 0C4.5 10.2 12 4 12 4z" />
    </Icon>
  );
}
