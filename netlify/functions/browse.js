let firebase = require('./firebase')

exports.handler = async function (event) {
  let db = firebase.firestore()

  let postsData = []

  let postQuery = await db.collection('posts').orderBy('created').get()
  let posts = postQuery.docs

  for (let i = 0; i < posts.length; i++) {
    let postId = posts[i].id
    let postData = posts[i].data()
    let postCategory = postData.category
    let postImageUrl = postData.imageUrl
    let postUsername = postData.username
    let postDescription = postData.description
    let postValue = postData.value
    // console.log(postCategory)

    postsData.push({
      id: postId,
      category: postCategory,
      username: postUsername,
      imageUrl: postImageUrl,
      value: postValue,
      description: postDescription
    })


  }

  return {
    statusCode: 200,
    body: JSON.stringify(postsData)
  }
}