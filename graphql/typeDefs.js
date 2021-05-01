const gql = require('graphql-tag')

const typeDefs = gql`
      type Post{
            id: ID!
            body: String!
            username: String!
            createdAt: String!
            user: User!
            comments: [Comment]!
            likes: [Like]!
      }
      type Comment{
            id: ID!,
            body: String,
            username: String,
            createdAt: String
      }
      type Like{
            id: ID!,
            username: String,
            createdAt: String
      }
      type User{
            id: String!,
            username: String!,
            email: String!,
            token: String!,
            createdAt: String!
      }
      input RegisterInput{
            username: String!,
            password: String!,
            confirmPassword: String!,
            email: String!
      }
      input LoginInput{
            username: String!
            password: String!
      }
      type Query{
            getPosts: [Post]!
            getPost(postId: ID!): Post!
      }
      type Mutation{
            register(registerInput: RegisterInput): User!
            login(username: String!, password: String!): User!
            createPost(body: String): Post!
            deletePost(postId: ID!): Post!
            createComment(postId: ID!, body: String): Post!
            deleteComment(postId: ID!, commentId: ID!): Post!
            likePost(postId: ID!): Post!
      }
`
module.exports = typeDefs