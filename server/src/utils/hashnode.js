import { GraphQLClient, gql } from "graphql-request";

// Hashnode GraphQL API endpoint
const HASHNODE_API = "https://gql.hashnode.com";

// Create a GraphQL client with timeout and headers
const client = new GraphQLClient(HASHNODE_API, {
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "LeetLabs/1.0", // Identify your app
  },
});

// GraphQL query to fetch publication posts
const GET_PUBLICATION_POSTS = gql`
  query Publication($host: String!, $first: Int!, $after: String) {
    publication(host: $host) {
      posts(first: $first, after: $after) {
        edges {
          node {
            title
            brief
            slug
            coverImage {
              url
            }
            publishedAt
            author {
              username
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

// Function to fetch Hashnode blogs
export const fetchHashnodeBlogs = async (publicationHost, limit = 10, after = null) => {
  try {
    const variables = {
      host: publicationHost, // e.g., "shreyansh-pandit.hashnode.dev"
      first: limit,
      after,
    };

    // Fetch data from Hashnode API
    const data = await client.request(GET_PUBLICATION_POSTS, variables);

    // Check if publication exists
    if (!data.publication) {
      console.warn(`No publication found for host: ${publicationHost}`);
      return { posts: [], pageInfo: { endCursor: null, hasNextPage: false } };
    }

    // Check if posts exist
    if (!data.publication.posts || !data.publication.posts.edges) {
      console.warn(`No posts found for publication: ${publicationHost}`);
      return { posts: [], pageInfo: { endCursor: null, hasNextPage: false } };
    }

    const posts = data.publication.posts.edges.map(edge => ({
      type: "hashnode",
      id: edge.node.slug,
      coverImage: edge.node.coverImage?.url || null,
      title: edge.node.title,
      content: edge.node.brief,
      author: { username: edge.node.author.username },
      createdAt: edge.node.publishedAt,
      url: `https://${publicationHost}/${edge.node.slug}`,
    }));

    return {
      posts,
      pageInfo: data.publication.posts.pageInfo,
    };
  } catch (error) {
    console.error("Error fetching Hashnode blogs:", error.message);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return { posts: [], pageInfo: { endCursor: null, hasNextPage: false } };
  }
};