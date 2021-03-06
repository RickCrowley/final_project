let firebase = require('./firebase')

exports.handler = async function (event) {
  let db = firebase.firestore()
  console.log(event)
  let body = JSON.parse(event.body)
  let userId = body.userId
  let postCategory = body.category
  let postImageUrl = body.imageUrl
  let postUsername = body.username
  let postDescription = body.description
  let postValue = body.value

  let newPost = {
    userId: userId,
    username: postUsername,
    imageUrl: postImageUrl,
    category: postCategory,
    value: postValue,
    description: postDescription,
    created: firebase.firestore.FieldValue.serverTimestamp()
  }

  let docRef = await db.collection(`posts`).add(newPost)
  newPost.id = docRef.id

  return {
    statusCode: 200,
    body: JSON.stringify(newPost)
  }
}
