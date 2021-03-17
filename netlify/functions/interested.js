let firebase = require('./firebase')

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
  let browsePostId = body.origPostId 
  console.log(browsePostId)

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

    return { statusCode: 200,
     
    }    

  }

  
}
