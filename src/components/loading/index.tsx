import { ImSpinner3 } from "react-icons/im";

export function Loading() {
   return (
      <div className="flex mt-[15rem] w-full animate-spin items-center justify-center">
         <ImSpinner3 size={28} />
      </div>
   );
}
