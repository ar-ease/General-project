import { Auth } from "../components/Auth";
import { Quotes } from "../components/Quotes";
export const Signup = () => {
  return (
    <div>
      <div className="grid grid-cols-10">
        <div className="col-span-6">
          <Auth />
        </div>
        <div className="col-span-4 invisible md:visible">
          <Quotes />
        </div>
      </div>
    </div>
  );
};
