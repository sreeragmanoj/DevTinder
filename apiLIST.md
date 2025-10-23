#devTinder apis

Auth Router
- POST /signup
- POST /login
- POST /logout

Profile Router
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/forgotpassword

connection Router
- POST /request/send/interested/:userId
- POST /request/send/rejected/:userId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

- GET /user/connections
- GET /user/requests/received
- GET /user/feed - gets you the profile of other user on platform

 Status : ignore, interested, accepted, rejected