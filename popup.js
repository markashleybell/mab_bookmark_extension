// This callback function is called when the content script has been 
// injected and returned its results
function onPageInfo(o)  { 
    document.getElementById("title").value = o.title; 
    document.getElementById("url").value = o.url; 
    document.getElementById("summary").innerText = o.summary; 
} 

// POST the data to the server using XMLHttpRequest
function addBookmark() {
    var postUrl = "http://yourwebappurl/addbookmark/";
    var req = new XMLHttpRequest();
    req.open("POST", postUrl, true);
    
    var params = "title=" + document.getElementById("title").value + 
                 "&url=" + document.getElementById("url").value + 
                 "&summary=" + document.getElementById("summary").value +
                 "&tags=" + document.getElementById("tags").value;
    
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(params);
    
    req.onreadystatechange = function() 
    { 
        // If the request completed, close the extension popup
        if (req.readyState == 4)
            if (req.status == 200) 
                window.close();
            else
                alert("Could not reach server " + postUrl);
        
    };

    return false;
}

// When the popup HTML has loaded
window.addEventListener("load", function(evt) {
    // Handle the bookmark form submit event with our addBookmark function
    document.getElementById('addbookmark').addEventListener('submit', addBookmark);
    // Call the getPageInfo function in the background page, injecting content_script.js 
    // into the current HTML page and passing in our onPageInfo function as the callback
    chrome.extension.getBackgroundPage().getPageInfo(onPageInfo);
});