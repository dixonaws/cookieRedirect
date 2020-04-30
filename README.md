### cookieRedirect
A test for AWS Cognito bearer token authentication. A Cognito User Pool should be configured according to the following:
- One app client
- A Cognito-generated domain to host the login page UI
- Callback URL as http://localhost:8000 for testing
- One resource server with a custom scope
- Implicit grant

The Cognito and API Gateway configuration is explained in this video: https://www.youtube.com/watch?v=bj3yVT6j3XU 

Create a simple webserver to host the content in the root of this domain. Use `python -m SimpleHTTPServer 8000` to host a webserver on port 8000. Successful logins to the hosted UI will redirect to localhost:8000. The index page will read the id_token, access_token, expires_in and token_type from the URL and store these values in a cookie. The id_token can be used to authenticate calls to API Gateway with the `Authorization` header as shown in the code fragment below.

```javascript
function sayGoodbye() {
    console.log("loadSettings() with auth");
    var url = "https://myapigatewayendpoint.amazonaws.com/dev/api/agent/f560738e-80c6-4050-b74a-de77ef2c6509/converse?sessionId=NLPUI&text=goodbye";
    const id_token = getCookie("id_token");

    var myHeaders = new Headers();
    myHeaders.append("Authorization", id_token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(url, requestOptions)
        .then(response => {
            int_status=response.status;
            
            console.log("status code: " + int_status);
            document.getElementById("status").innerHTML=int_status;
            
            if(int_status==401) {
                console.log("Unauthorized")
                window.location.replace("https://a2242020.auth.us-east-1.amazoncognito.com/login?client_id=538iolm2i3kupquslc23u0jb8a&response_type=token&scope=aws.cognito.signin.user.admin+email+https://kkjqf3agnl.execute-api.us-east-1.amazonaws.com/dev/TrainingApp.Configure+openid+phone+profile&redirect_uri=http://localhost:8000");

            }

            return response.json()
        })
        .then(JSONdata => {
            console.log(JSONdata)
            document.getElementById("settings").innerHTML=JSON.stringify(JSONdata);
            
        })
        .catch(error => {
            document.getElementById("status").innerHTML=error;
            console.log('error', error)
        });
}
   ```