function checkForAuthToken() {
    const currentPageUrl=window.location.href;

    const idTokenStartPos=currentPageUrl.indexOf("#id_token");
    const accessTokenStartPos=currentPageUrl.indexOf("&access_token");
    const expiresInStartPos=currentPageUrl.indexOf("&expires_in");
    const tokenTypeStartPos=currentPageUrl.indexOf("&token_type");

    var id_token;
    var access_token;
    var expiresIn;
    var token_type;
    var status;
    var alertMessage;
    var redirect_url;

    if(idTokenStartPos==-1) {
        console.log("No JWT tokens present in URL");
        id_token="not found"
        access_token="not found"
        expiresIn="not found"
        token_type="not found"
        status="redirect to login page...";
        alertMessage="No JWT tokens found, redirect to login page...";
        redirect_url="https://a2242020.auth.us-east-1.amazoncognito.com/login?client_id=538iolm2i3kupquslc23u0jb8a&response_type=token&scope=aws.cognito.signin.user.admin+email+https://kkjqf3agnl.execute-api.us-east-1.amazonaws.com/dev/TrainingApp.Configure+openid+phone+profile&redirect_uri=http://localhost:8000";
    }

    if(idTokenStartPos != -1) {
        id_token=currentPageUrl.slice(idTokenStartPos+10, accessTokenStartPos);
        access_token=currentPageUrl.slice(accessTokenStartPos+14, expiresInStartPos);
        expires_in=currentPageUrl.slice(expiresInStartPos+12, tokenTypeStartPos);
        token_type=currentPageUrl.slice(tokenTypeStartPos+12);
        status="JWT tokens found, redirect to training application..."
        alertMessage="redirecting to training app...";
        redirect_url="http://localhost:8000/redirect.html";
    }

    document.getElementById("status").innerHTML=status;
    document.getElementById("id_token").innerHTML=id_token;
    document.getElementById("access_token").innerHTML=access_token;
    document.getElementById("expires_in").innerHTML=expires_in;
    document.getElementById("token_type").innerHTML=token_type;

    document.cookie="id_token=" + id_token;
    document.cookie="access_token=" + access_token; 
    document.cookie="expires_in=" + expires_in;
    document.cookie="token_type=" + token_type;

    document.getElementById("cookies").innerHTML=document.cookie;
    
}    

function redirect(url) {
    window.location.replace(url);
}

function checkCookies() {
    console.log("cookie: " + document.cookie)

    document.getElementById("cookies").innerHTML = document.cookie;
    document.getElementById("id_token").innerHTML = getCookie("id_token");
    document.getElementById("access_token").innerHTML = getCookie("access_token");
    document.getElementById("expires_in").innerHTML = getCookie("expires_in");
    document.getElementById("token_type").innerHTML = getCookie("token_type");

}

function getCookie(key) {
    var name = key + "=";
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function sayGoodbye() {
    console.log("loadSettings() with auth");
    var url = "https://aggt3w98md.execute-api.us-east-1.amazonaws.com/dev/api/agent/f560738e-80c6-4050-b74a-de77ef2c6509/converse?sessionId=NLPUI&text=goodbye";
    const id_token = getCookie("id_token");

    var myHeaders = new Headers();
    myHeaders.append("Authorization", id_token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    // basic fetch:
    // fetch(url, requestOptions)
    //     .then(response => response.text())
    //     .then(result => evalResponse(result))
    //     .catch(error => console.log('error', error));

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

function clearCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    console.log("cleared cookies");
    
}