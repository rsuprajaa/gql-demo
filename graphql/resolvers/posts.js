const Post = require('../../models/Post')
const checkAuth = require('../../utils/checkAuth')

module.exports = {
      Query: {
            async getPosts() {
                  try {
                        const posts = await Post.find()
                        return posts
                  }
                  catch (err) {
                        throw new Error(err)
                  }
            },
            async getPost(_, { postId }) {
                  try {
                        const post = await Post.findById(postId)
                        if (post) {
                              return post
                        }
                        else {
                              throw new Error("Post not found")
                        }
                  }
                  catch (err) {
                        throw new Error(err)
                  }
            }
      },
      Mutation: {
            async createPost(_, { body }, context) {
                  const user = checkAuth(context)
                  console.log(user)
                  try {
                        const newPost = new Post({
                              body,
                              user: user.id,
                              username: user.username,
                              createdAt: new Date().toISOString()
                        })
                        const post = await newPost.save()
                        return post
                  }
                  catch (err) {
                        throw new Error(err)
                  }
            },
            async deletePost(_, { postId }, context) {
                  const user = checkAuth(context)
                  try {
                        const post = await Post.findById(postId)
                        if (!post) {
                              throw new Error("Post not found")
                        }
                        if (user.username === post.username) {
                              const deletedPost = await Post.findById(postId)
                              return deletedPost
                        }
                        else {
                              throw new Error("User not authorized to delete the post")
                        }
                        
                  }
                  catch (err) {
                        throw new Error(err)
                  }
            },
            async likePost(_, { postId }, context) {
                  const user = checkAuth(context)
                  try {
                        const post = await Post.findById(postId)
                        const { username } = user
                        const likeIdx = post.likes.findIndex(l => l.username === username)
                        if (likeIdx > -1) {
                              const likeIdx = post.likes.findIndex(l => l.username === username)
                              post.likes.splice(likeIdx, 1)
                              console.log(post)
                              await post.save()
                        }
                        else {
                              post.likes.unshift({
                                    username
                              })
                              await post.save()
                        }
                        return post
                  }
                  catch (err) {
                        throw new Error(err)
                  }
            }
      }
}