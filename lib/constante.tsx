// Section icons as inline SVGs (unique per category)
export function ChickenIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2c-1.35 1.5-2 3-2 5a5 5 0 0 0 10 0c0-2-.65-3.5-2-5" />
      <path d="M9 10a5 5 0 0 0-5 5c0 2.5 2 4 5 4h7c1.7 0 3-.3 4-1" />
      <path d="M12 15v6" />
      <path d="M8 21h8" />
    </svg>
  );
}

export function BeefIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c-1.2 5.4-2 7.8-2 9 0 1.7 .9 3 2 3s2-1.3 2-3c0-1.2-.8-3.6-2-9" />
      <path d="M6.6 9.8c3.8 2 5.8 3.2 6.6 4 1.1 1.1.8 2.6-.4 3.3" />
      <path d="M17.4 9.8C13.6 11.8 11.6 13 10.8 13.8c-1.1 1.1-.8 2.6.4 3.3" />
    </svg>
  );
}

export function PorkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11l1-3h16l1 3" />
      <path d="M4 11v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" />
      <path d="M8 17v2" />
      <path d="M16 17v2" />
      <path d="M9 8V6" />
      <path d="M15 8V6" />
    </svg>
  );
}

export function SalmonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8c0 0-1.5-2-6-2C6 6 2 10 2 12s4 6 10 6c4.5 0 6-2 6-2" />
      <path d="M18 8l4-4" />
      <path d="M18 16l4 4" />
      <path d="M12 12h.01" />
      <path d="M8 10c0 1.1.9 2 2 2" />
    </svg>
  );
}

export const FEATURED_CATEGORIES = [
  { key: "Chicken", label: "Chicken Recipes", icon: <ChickenIcon /> },
  { key: "Beef", label: "Beef Recipes", icon: <BeefIcon /> },
  { key: "Pork", label: "Pork Recipes", icon: <PorkIcon /> },
  { key: "Seafood", label: "Salmon Recipes", icon: <SalmonIcon /> },
];
