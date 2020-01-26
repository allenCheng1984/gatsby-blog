/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
// const path = require(`path`)

// exports.createPages = async ({ graphql, actions }) => {
//   const { createPage } = actions // 解構createPage函式
//   /**
//   * 抓取部落格文章
//   */
//   const result = await graphql(`
//       query {
//         blog {
//           allPosts {
//             id
//             title
//             content
//             type
//           }
//         }
//       }
//   `)
//   result.data.blog.allPosts.forEach(( post ) => {
//     createPage({
//       /**
//       * 根據每一篇文章，給訂他的path以及用以產生頁面的樣板以及參數
//       */
//       path: `posts/${post.id}`,
//       component: path.resolve(`./src/templates/blog-post.js`),
//       context: {
//         title: post.title,
//         content: post.content
//       },
//     })
//   })
// }


const path = require(`path`)

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const blogPostTemplate = path.resolve(`src/templates/blogTemplate.js`)

  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `)

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: blogPostTemplate,
      context: {}, // additional data can be passed via context
    })
  })
}
