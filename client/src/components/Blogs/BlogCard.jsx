import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { cn } from "../../lib/utils";

const BlogCard = ({ blog }) => {
  const { title, coverImage, content, author, createdAt, url, type, id } = blog;

  return (
    <Card className={cn("flex flex-col h-full bg-card text-card-foreground")}>
      {coverImage && (
        <img
          src={coverImage}
          alt={title}
          className="h-48 w-full object-cover rounded-t-lg"
        />
      )}
      <CardHeader>
        <CardTitle className="text-xl line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {content || "No content available."}
        </p>
        <p className="mt-2 text-sm">
          By {type === "platform" ? author.name : author.username}
        </p>
        <p className="text-sm text-muted-foreground">
          {format(new Date(createdAt), "PPP")}
        </p>
      </CardContent>
      <CardFooter>
        {type === "hashnode" ? (
          <Button asChild variant="outline">
            <a href={url} target="_blank" rel="noopener noreferrer">
              Read More
            </a>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link to={`/blogs/${id}`}>Read More</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BlogCard;