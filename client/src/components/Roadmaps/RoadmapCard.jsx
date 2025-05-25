import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";

const RoadmapCard = ({ roadmap }) => {
  const { id, title, description, image, author, createdAt, category } = roadmap;

  return (
    <Card
      className={cn(
        "flex flex-col h-full bg-card text-card-foreground border-none shadow-md",
        "transition-all duration-300"
      )}
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="h-38 w-full object-contain rounded-t-lg"
        />
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl line-clamp-2 font-semibold satoshi">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 satoshi">
          {description || "No description available."}
        </p>
        <p className="mt-2 text-sm satoshi">By {author.name}</p>
        <p className="text-sm text-muted-foreground satoshi">
          {format(new Date(createdAt), "PPP")}
        </p>
        <p className="text-xs bg-[#f5b210]/20 text-[#f5b210] px-2 py-1 rounded-full mt-2 inline-block satoshi">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full satoshi">
          <Link to={`/roadmaps/${id}`}>Explore Roadmap</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoadmapCard;