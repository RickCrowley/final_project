let firebase = require('./firebase')
//everything below should be modeled off of add to create a firebase collection for interested
exports.handler = async function (event) {
  let db = firebase.firestore()
  // console.log(event)
  let body = JSON.parse(event.body)
  let userId = body.userId
  let postCategory = body.category
  let postImageUrl = body.imageUrl
  let postUsername = body.username
  let postDescription = body.description
  let postValue = body.value
  let browsePostId = body.postId 

  let newPost = {
    origPostId: browsePostId,
    userId: userId,
    username: postUsername,
    imageUrl: postImageUrl,
    category: postCategory,
    value: postValue,
    description: postDescription,
    created: firebase.firestore.FieldValue.serverTimestamp()
  }

  // console.log(`${userId}-${browsePostId}`)
  // let currentUser = firebase.auth().currentUser
  // console.log(currentUser.uid)

  let querySnapshot = await db.collection('interested').where('userId', '==', userId).where('origPostId', '==', browsePostId).get()
  console.log(querySnapshot.size)

  if(querySnapshot.size < 1) {

    let docRef = await db.collection(`interested`).add(newPost)
    newPost.id = docRef.id
  
    return {
      statusCode: 200,
      body: JSON.stringify(newPost)
    }    

  } else {

    return { statusCode: 403 }

    

  }

  
}
