import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

const BlogFilter = ({ filter, onFilterChange }) => {
  return (
    <div className={cn("flex space-x-2")}>
      {["all", "platform", "hashnode"].map((type) => (
        <Button
          key={type}
          variant={filter === type ? "default" : "ghost"}
          onClick={() => onFilterChange(type)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-full",
            filter === type ? "bg-[#f5b210] text-black" : "text-gray-600 hover:bg-gray-200"
          )}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      ))}
    </div>
  );
};

export default BlogFilter;