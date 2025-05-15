import { Toaster as Sonner } from "sonner";

export const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="light"
      className="toaster group satoshi"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-300 group-[.toaster]:shadow-lg group-[.toaster]:rounded-md group-[.toaster]:font-satoshi",
          description: "group-[.toaster]:text-gray-600 group-[.toaster]:font-satoshi",
          actionButton:
            "group-[.toaster]:bg-[#fec60b] group-[.toaster]:text-gray-900 group-[.toaster]:border-[#fec60b] group-[.toaster]:hover:bg-[#ec9913] group-[.toaster]:font-satoshi",
          cancelButton:
            "group-[.toaster]:bg-gray-100 group-[.toaster]:text-gray-600 group-[.toaster]:font-satoshi",
          error:
            "group-[.toaster]:bg-red-50 group-[.toaster]:text-red-900 group-[.toaster]:border-red-500 group-[.toaster]:font-satoshi",
          success:
            "group-[.toaster]:bg-green-50 group-[.toaster]:text-green-900 group-[.toaster]:border-green-500 group-[.toaster]:font-satoshi",
        },
        duration: 5000, // 5 seconds
      }}
      position="bottom-right"
      {...props}
    />
  );
};