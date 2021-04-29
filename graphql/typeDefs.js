const gql = require('graphql-tag')

const typeDefs = gql`
      type Post{
            id: ID!
            body: String
            username: String
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
            getPosts: [Post]
      }
      type Mutation{
            register(registerInput: RegisterInput): User!
            login(username: String!, password: String!): User!
      }
`
module.exports = typeDefs