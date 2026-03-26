import { CartProvider } from "@/components/features/CartContext";

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
