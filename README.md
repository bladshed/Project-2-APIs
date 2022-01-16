### PROJECT OVERVIEW
This project serves as the APIs to do CRUD of outfit and review. The main goal of this project is to show the implementation of Node js, Express and Mongo DB working together.

Base URL of the API:  [https://fms-project-2-apis.herokuapp.com/](https://fms-project-2-apis.herokuapp.com/)

### SAMPLE DATA (in json format)

"outfit": {
	"_id":{"$oid":"61d98b510f66d2b3b19b65ef"},
	"submittedBy":"michaeljordan@yahoo.com",
	"type":"formal",
	"gender":"male",
	"img_url":"https://content.api.news/v3/images/bin/3dbe60a618f51afcf6b7917e8093667a",
	"description":"Michael Jordan formal outfit",
	"dateCreated":{"$date":{"$numberLong":"1641646929805"}},
	"dateModified":{"$date":{"$numberLong":"1641984580247"}},
	"reviews":
	[
		{
			"_id":{"$oid":"61dd65a5121606ca5893c698"},
			"submittedBy":"friend@yahoo.com",
			"rating":"2",
			"comment":"not that bad 2",
			"dateCreated":{"$date":{"$numberLong":"1641899429935"}},
			"dateModified":{"$date":{"$numberLong":"1641900033413"}}
		},
		{
			"_id":{"$oid":"61dd686c121606ca5893c699"},
			"submittedBy":"daddy@daddy.com",
			"rating":"5",
			"comment":"I love Jordan style",
			"dateCreated":{"$date":{"$numberLong":"1641900140608"}}
		}
	]
}

### APIs

____________
#### OUTFITS
* DATA BODY TO PASS

"outfit": {
	"_id":{"$oid":"61d98b510f66d2b3b19b65ef"},
	"submittedBy":"michaeljordan@yahoo.com",
	"type":"formal",
	"gender":"male",
	"img_url":"https://content.api.news/v3/images/bin/3dbe60a618f51afcf6b7917e8093667a",
	"description":"Michael Jordan formal outfit",
	"dateCreated":{"$date":{"$numberLong":"1641646929805"}},
	"dateModified":{"$date":{"$numberLong":"1641984580247"}}
}
	
   * GET all
      > `https://fms-project-2-apis.herokuapp.com/outfits`
   * GET single
      > `https://fms-project-2-apis.herokuapp.com/outfits/:id`
   * POST
      > `https://fms-project-2-apis.herokuapp.com/outfits`
   * PUT
      > `https://fms-project-2-apis.herokuapp.com/outfits/:id`
   * DELETE
      > `https://fms-project-2-apis.herokuapp.com/outfits/:id`

____________________________________________
#### REVIEWS (object array in Outfit record)
* DATA BODY TO PASS

"review":
   {
      "_id":{"$oid":"61dd65a5121606ca5893c698"},
      "submittedBy":"friend@yahoo.com",
      "rating":"2",
      "comment":"not that bad 2"
   }

   * GET
      > `https://fms-project-2-apis.herokuapp.com/reviews/:reviewId`
   * POST
      > `https://fms-project-2-apis.herokuapp.com/outfits/:id/reviews/add`
   * PUT
      > `https://fms-project-2-apis.herokuapp.com/reviews/:reviewId`
   * DELETE
      > `https://fms-project-2-apis.herokuapp.com/reviews/:reviewId`

___________
#### SEARCH
* DATA BODY TO PASS

parameters: 
   "description": <string>
   "types": <array>
   "genders": <array>

   * GET
      > `https://fms-project-2-apis.herokuapp.com/outfit-search`

   * EXAMPLE
      > `https://fms-project-2-apis.herokuapp.com/outfit-search?description=outfit`


### TECHNOLOGIES USED

* Node js
   * Main languange used To build my APIs that connects with MongoDB

* Express
   * Framework used to be able to help create web services and connect to my MongoDB, this framework makes Node js very easy to use and a lot of features are very useful

* Mongo DB
   * NoSQL database used for this project. Very flexible database that you can use javascript for you query.


### TEST CASES
<table>
   <tr>
      <th colspan=2>Outfits
   </tr>
   <tr>
      <th>
         <img width="441" height="1">
         <small>Action</small>
      </th>
      <th>
         <img width="441" height="1">
         <small>Expected Result</small>
      </th>
   </tr>
   <tr>
      <td>GET: https://fms-project-2-apis.herokuapp.com/outfits</td>
      <td>Returns outfit objects (array) in json format</td>
   </tr>
   <tr>
      <td>GET: https://fms-project-2-apis.herokuapp.com/outfits/:id</td>
      <td>Returns an outfit object in json format</td>
   </tr>
   <tr>
      <td>POST: https://fms-project-2-apis.herokuapp.com/outfits</td>
      <td>Saves one outfit data</td>
   </tr>
   <tr>
      <td>PUT: https://fms-project-2-apis.herokuapp.com/outfits/:id</td>
      <td>Updates an outfit data</td>
   </tr>
   <tr>
      <td>DELETE: https://fms-project-2-apis.herokuapp.com/outfits/:id</td>
      <td>Deletes an outfit data (deletes the reviews as well)</td>
   </tr>
   <tr>
      <th colspan=2>Reviews
   </tr>
   <tr>
      <th>
         <img width="441" height="1">
         <small>Action</small>
      </th>
      <th>
         <img width="441" height="1">
         <small>Expected Result</small>
      </th>
   </tr>
   <tr>
      <td>GET: https://fms-project-2-apis.herokuapp.com/reviews/:reviewId</td>
      <td>Returns a review object in json format</td>
   </tr>
   <tr>
      <td>POST: https://fms-project-2-apis.herokuapp.com/outfits/:id/reviews/add</td>
      <td>Adds a review data under an outfit document</td>
   </tr>
   <tr>
      <td>PUT: https://fms-project-2-apis.herokuapp.com/reviews/:reviewId</td>
      <td>Updates a review data</td>
   </tr>
   <tr>
      <td>DELETE: https://fms-project-2-apis.herokuapp.com/reviews/:reviewId</td>
      <td>Deletes a review data</td>
   </tr>
   <tr>
      <th colspan=2>Search
   </tr>
   <tr>
      <th>
         <img width="441" height="1">
         <small>Action</small>
      </th>
      <th>
         <img width="441" height="1">
         <small>Expected Result</small>
      </th>
   </tr>
   <tr>
      <td>GET: https://fms-project-2-apis.herokuapp.com/outfit-search</td>
      <td>Returns object/objects (based on the param/s passed) in json format</td>
   </tr>
</table>

### PROJECT COMPLEXITY
<table>
   <tr>
      <th colspan=2>MONGODB/EXPRESS BACKEND
   <tr>
   <tr>
      <th>
         <img width="441" height="1">
         <small>Items</small>
      </td>
      <th>
         <img width="441" height="1">
         <small>File path</small>
      </td>
   <tr>
   <tr>
      <td>
         Each document in your MongoDB (embedded or separate), with at least two keys (excluding IDs).
      </td>
      <td>
         Done
      </td>
   <tr>
   <tr>
      <td>
         Each array or object in your document.
      </td>
      <td>
         Done
      </td>
   <tr>
   <tr>
      <td>
         Each updating of an array or an object in your document
      </td>
      <td>
         Done (both object and array)
      </td>
   <tr>
   <tr>
      <td>
         Each demonstration of a MongoDB find() technique (eg. find with $gte, find with $or etc.)
      </td>
      <td>
         Done
      </td>
   <tr>
   <tr>
      <td>
         Each set of CRUD endpoints your app
      </td>
      <td>
         Done
      </td>
   <tr>
   <tr>
      <td>
         Each endpoint in your Express application
      </td>
      <td>
         Done
      </td>
   <tr>
   <tr>
      <td>
         Bonus: Every feature not listed above
      </td>
      <td>
         None
      </td>
   <tr>
</table>


### CREDITS
* Thanks to Mr Paul Chor, our teacher for Node js, Express and Vue js
* Thanks to Mr Sam, our teacher for Mongo DB
* For my code snippets, tutorials, questions and saviour of all developers
   * [Google](https://www.google.com/)