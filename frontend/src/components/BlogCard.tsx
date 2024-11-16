interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
}
export const BlogCard = ({
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) => {
  return (
    <div className=" ">
      <div className="flex gap-2 ">
        <Avator name={authorName} />
        <div className="flex mt-1">
          <div className=" font-light text-sm  ">{authorName}</div>{" "}
          <div className="pt-2 px-2">
            {" "}
            <Circle />{" "}
          </div>
          <div className=" mt-1 font-extralight text-slate-700 text-xs">
            {" "}
            {publishedDate}
          </div>
        </div>
      </div>

      <div> {content.slice(0, 100)} ...</div>
      <div>{`${Math.ceil(content.length / 100)} mins read`}</div>

      <div className="bg-slate-200 h-1 w-full "></div>
    </div>
  );
};

const Avator = ({ name }: { name: string }) => {
  return (
    <div className="">
      <div className="   relative inline-flex items-center justify-center w-7 h-7 overflow-hidden bg-gray-300  rounded-full ">
        <span className="font-medium text-gray-600 ">{name[0]} </span>
      </div>
    </div>
  );
};
const Circle = () => {
  return <div className="h-1 w-1 rounded-full bg-slate-400"></div>;
};
