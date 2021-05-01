const { AuthenticationError } = require('apollo-server-errors')
const Post = require('../../models/Post')
const checkAuth = require('../../utils/checkAuth')

module.exports = {
      Mutation: {
            async createComment(_, { postId, body}, context){
                  const user = checkAuth(context)
                  try {
                        const post = await Post.findById(postId)
                        console.log(post)
                        if (!post) {
                              throw new Error('Post not found')
                        }
                        post.comments.unshift({
                              body,
                              username: user.username,
                              createdAt: new Date().toISOString()
                        })
                        await post.save()
                        return post
                  }
                  catch (err) {
                        throw new Error(err)
                  }
            },
            async deleteComment(_, { postId, commentId }, context) {
                  const user = checkAuth(context)
                  const { username } = user
                  try {
                        const post = await Post.findById(postId)
                        if (!post) {
                              throw new Error("Post not found")
                        }
                        const commentIdx = post.comments.findIndex(c => c.id === commentId)
                        if (commentIdx === -1) {
                              throw new Error("Comment not found")
                        }
                        if (username !== post.comments[commentIdx].username) {
                              throw new AuthenticationError('Not authorized to delete the comment')
                        }
                        post.comments.splice(commentIdx, 1)
                        await post.save()
                        return post
                  }
                  catch (err) {
                        throw new Error(err)
                  }
            }
      }
}