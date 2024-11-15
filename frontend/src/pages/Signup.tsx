import { Auth, LabeledInput } from "../components/Auth";
import { Quotes } from "../components/Quotes";
export const Signup = () => {
  return (
    <div>
      <div className="grid grid-cols-10">
        <div className="lg:col-span-6 col-span-10">
          <div>
            <Auth type="signup" />
          </div>
        </div>
        <div className="col-span-4 hidden lg:block  ">
          <Quotes />
        </div>
      </div>
    </div>
  );
};
