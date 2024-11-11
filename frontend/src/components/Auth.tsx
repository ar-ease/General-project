export const Auth = ({ _type }: { type: "signup" | "signin" }) => {
  return (
    <div className="flex h-screen justify-center flex-col">
      <div className="flex justify-center">
        <div className="text-3xl font-extrabold ">Create An account</div>
      </div>
      <h1>Auth</h1>
    </div>
  );
};
