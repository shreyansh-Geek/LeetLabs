import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

const RoadmapFilter = ({ filter, onFilterChange }) => {
  const categories = ["all", "beginner", "intermediate", "advanced"];

  return (
    <div className={cn("flex space-x-2")}>
      {categories.map((category) => (
        <Button
          key={category}
          variant={filter === category ? "default" : "ghost"}
          onClick={() => onFilterChange(category)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-full",
            filter === category ? "bg-[#f5b210] text-black" : "text-gray-600 hover:bg-gray-200"
          )}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Button>
      ))}
    </div>
  );
};

export default RoadmapFilter;